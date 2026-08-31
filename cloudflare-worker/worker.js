/**
 * Visitor-map worker for haoyuwu02.github.io
 *
 * Endpoints:
 *   POST /hit             — record one visit (called by js/visitors.js on page load)
 *   GET  /dots?window=30d — dots + totals for the last 30 days
 *   GET  /dots?window=all — dots + totals since the counter started
 *
 * Privacy: IPs are never stored. A salted hash of (day + IP) is kept for one
 * day purely to avoid double-counting the same visitor; locations are rounded
 * to ~11 km before storage.
 */

const ALLOWED_ORIGINS = [
  "https://haoyuwu02.github.io",
  "http://localhost:8765",
  "http://127.0.0.1:8765",
];

const BOT_RE = /bot|crawl|spider|slurp|preview|fetch|monitor|headless|lighthouse|curl|wget/i;

function corsHeaders(request) {
  const origin = request.headers.get("Origin") || "";
  const allow = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    "Access-Control-Allow-Origin": allow,
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Max-Age": "86400",
    "Vary": "Origin",
  };
}

async function sha256hex(s) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s));
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

async function recordHit(request, env) {
  const ua = request.headers.get("User-Agent") || "";
  if (BOT_RE.test(ua)) return; // silently ignore obvious bots

  const day = new Date().toISOString().slice(0, 10);
  const ip = request.headers.get("CF-Connecting-IP") || "0.0.0.0";
  const salt = env.SALT || "haoyuwu-visitor-map";
  const iphash = await sha256hex(`${day}|${ip}|${salt}`);

  // De-duplicate: only the first visit per (day, visitor) counts.
  const ins = await env.DB.prepare(
    "INSERT OR IGNORE INTO seen (day, iphash) VALUES (?, ?)"
  ).bind(day, iphash).run();
  if (!ins.meta.changes) return; // already counted today

  const batch = [
    env.DB.prepare(
      "INSERT INTO days (day, n) VALUES (?, 1) ON CONFLICT(day) DO UPDATE SET n = n + 1"
    ).bind(day),
  ];

  const cf = request.cf || {};
  const lat = parseFloat(cf.latitude);
  const lon = parseFloat(cf.longitude);
  if (Number.isFinite(lat) && Number.isFinite(lon)) {
    batch.push(
      env.DB.prepare(
        `INSERT INTO visits (day, lat, lon, city, country, n) VALUES (?, ?, ?, ?, ?, 1)
         ON CONFLICT(day, lat, lon) DO UPDATE SET n = n + 1`
      ).bind(
        day,
        Math.round(lat * 10) / 10,
        Math.round(lon * 10) / 10,
        cf.city || null,
        cf.country || null
      )
    );
  }
  await env.DB.batch(batch);

  // Opportunistic cleanup of the de-dup table (~1% of hits).
  if (Math.random() < 0.01) {
    await env.DB.prepare("DELETE FROM seen WHERE day < date('now', '-1 day')").run();
  }
}

async function getDots(request, env) {
  const url = new URL(request.url);
  const windowed = url.searchParams.get("window") !== "all";
  const where = windowed ? "WHERE day >= date('now', '-30 days')" : "";

  const [dots, totals, since] = await Promise.all([
    env.DB.prepare(
      `SELECT lat, lon, SUM(n) AS n, MAX(city) AS city, MAX(country) AS country
       FROM visits ${where} GROUP BY lat, lon`
    ).all(),
    env.DB.prepare(
      `SELECT COALESCE(SUM(n), 0) AS total,
              (SELECT COUNT(DISTINCT country) FROM visits ${where}) AS countries
       FROM days ${where}`
    ).first(),
    env.DB.prepare("SELECT MIN(day) AS since FROM days").first(),
  ]);

  return {
    total: totals.total,
    countries: totals.countries,
    since: since.since,
    dots: dots.results,
  };
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const cors = corsHeaders(request);

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: cors });
    }

    if (request.method === "POST" && url.pathname === "/hit") {
      // Record in the background so the beacon returns immediately.
      ctx.waitUntil(recordHit(request, env).catch(() => {}));
      return new Response(null, { status: 204, headers: cors });
    }

    if (request.method === "GET" && url.pathname === "/dots") {
      try {
        const body = await getDots(request, env);
        return new Response(JSON.stringify(body), {
          headers: {
            ...cors,
            "Content-Type": "application/json",
            "Cache-Control": "public, max-age=300", // 5-minute cache
          },
        });
      } catch (e) {
        return new Response(JSON.stringify({ error: "db" }), { status: 500, headers: cors });
      }
    }

    return new Response("visitor-map worker", { status: 200, headers: cors });
  },
};

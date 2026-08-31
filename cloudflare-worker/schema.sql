-- Visitor-map database schema (Cloudflare D1 / SQLite).
-- Privacy: no IP addresses or exact locations are ever stored.
--   * visits: unique visitors per day, aggregated to a ~11 km grid cell
--   * days:   unique visitors per day (including visitors with no geo data)
--   * seen:   daily-rotating salted IP hashes, used only to de-duplicate
--             repeat visits within a day; rows older than a day are purged.

CREATE TABLE IF NOT EXISTS visits (
  day     TEXT NOT NULL,           -- YYYY-MM-DD (UTC)
  lat     REAL NOT NULL,           -- rounded to 1 decimal place (~11 km)
  lon     REAL NOT NULL,
  city    TEXT,
  country TEXT,
  n       INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (day, lat, lon)
);

CREATE TABLE IF NOT EXISTS days (
  day TEXT PRIMARY KEY,
  n   INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS seen (
  day    TEXT NOT NULL,
  iphash TEXT NOT NULL,
  PRIMARY KEY (day, iphash)
);

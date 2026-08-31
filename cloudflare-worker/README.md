# Visitor-map backend (Cloudflare Worker + D1)

Records visitors to haoyuwu02.github.io and serves the dot data shown on the
map at the bottom of the home page. Free tier is far more than enough for a
personal site (100k requests/day).

**Privacy:** no IP addresses are stored. A salted hash of (day + IP) is kept
for one day only, to avoid counting the same visitor twice in a day. Locations
are rounded to roughly city precision (~11 km) before being saved.

## One-time setup (~10 minutes)

You need a free Cloudflare account: <https://dash.cloudflare.com/sign-up>
(email + password, no credit card). Then, in a terminal:

```
cd cloudflare-worker
npx wrangler login          # opens the browser; log in to Cloudflare
npx wrangler d1 create visitor-map
```

The last command prints a `database_id`. Paste it into `wrangler.toml`
(replacing `REPLACE_ME`), then:

```
npx wrangler d1 execute visitor-map --remote --file=schema.sql
npx wrangler deploy
```

`deploy` prints your worker URL, something like
`https://visitor-map.<your-subdomain>.workers.dev`.

Finally, open `js/visitors.js` (repo root) and set the first line:

```js
const VISITOR_API = "https://visitor-map.<your-subdomain>.workers.dev";
```

Commit and push — the map appears on the site and recording starts.
(Optional hardening: `npx wrangler secret put SALT` and enter any random
string; this makes the daily de-dup hashes non-reproducible.)

## Maintenance

None. To see raw data:

```
npx wrangler d1 execute visitor-map --remote --command "SELECT * FROM days ORDER BY day"
```

To take the map down, remove the section from `index.html` and run
`npx wrangler delete`.

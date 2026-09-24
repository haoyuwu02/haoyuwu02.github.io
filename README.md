# haoyuwu02.github.io

Personal academic website of Haoyu Wu — live at <https://haoyuwu02.github.io>.

Plain static HTML/CSS/JS. No build step, no framework, no dependencies except
one Google Fonts import (STIX Two Text). The files in this repo *are* the site:
GitHub Pages serves them as-is (`.nojekyll` disables Jekyll processing).

## Preview locally

```
python3 -m http.server 8000
```
then open <http://localhost:8000>. (Or just double-click `index.html` — everything
except the web font works fine straight from the filesystem too.)

Edit a file, save, refresh the browser. That's the whole workflow.

## Structure

- `index.html` — Overview: title block, portrait, abstract, keywords, education, contact
- `research.html` — Research: one flat list of projects, newest first. The ones
  that are published/submitted carry a small Journal / Conference / Working tag
  in the title; there is no separate publications list. Talks and posters
  about a paper are listed under that paper's abstract.
- `notes.html` — Notes: a short personal page.
- `css/style.css` — all styling, one file. CSS variables at the top control the
  palette, `--measure` controls the page width, and the `font-size` on `html`
  controls the overall text size.
- `js/main.js` — progressive enhancement only (dark/light toggle, on-scroll
  masthead blur). The site is fully correct with this file blocked or deleted.
- `js/visitors.js` — visitor counter + small dot world-map in the home-page
  footer, with an "All time / Last 30 days" toggle. Backed by a small Cloudflare
  Worker (see `cloudflare-worker/README.md` for the one-time setup). Until
  `VISITOR_API` at the top of the file is set, the section stays hidden and
  nothing is recorded. Preview the map locally with `index.html?demo=1`.
- `cloudflare-worker/` — the recording backend (worker + DB schema + setup
  guide). Not part of the published site.
- `files/` — CV and paper/slide PDFs.
- `files/shared/` — files shared by direct link only: each sits in a
  random-named folder that no page links to, and `robots.txt` asks search
  engines to skip the folder. The repo is public, so these are unlisted,
  not secret. To stop sharing one, delete its folder.
- `images/` — portrait and favicon.

There is no templating, so the header/footer markup is duplicated by hand across
the pages. If you add a page, copy the header/footer from an existing page and
add the nav link to *all* pages.

The pages carry inline `HOW TO EDIT` / `HOW TO ADD` comments explaining how to
add a research entry, a talk, an education line, and so on — read those first
when editing.

## Deploying

Committing to `main` publishes the site; GitHub Pages picks it up within a minute
or two.

```
git add -A && git commit -m "Update site" && git push
```

## History

This repo previously held a Jekyll site based on the *academicpages* template.
It was replaced in Aug 2026 by this hand-written static site. The complete old
site is preserved on the **`old-jekyll-site`** branch — nothing was lost:

```
git checkout old-jekyll-site
```

Old PDF URLs (e.g. `/files/SFS.pdf`) still resolve, so external links to papers
keep working. Old *page* URLs from the Jekyll site (`/publications/`,
`/portfolio/`, `/cv/`, `/talks/`) no longer exist.

## Things to fill in

- Google Scholar / GitHub / LinkedIn links — commented-out block in `index.html`
  under Correspondence, and a second one at the top of `research.html`.
- `files/CV.pdf` — replace whenever you update your CV.

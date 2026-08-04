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
  in the title; there is no separate publications list.
- `css/style.css` — all styling, one file. CSS variables at the top control the
  palette, `--measure` controls the page width, and the `font-size` on `html`
  controls the overall text size.
- `js/main.js` — progressive enhancement only (dark/light toggle, on-scroll
  masthead blur). The site is fully correct with this file blocked or deleted.
- `files/` — CV and paper/slide PDFs.
- `images/` — portrait and favicon.

There is no templating, so the header/footer markup is duplicated by hand across
the two pages. If you add a third page, copy the header/footer from an existing
page and add the nav link to *all* pages.

Both pages carry inline `HOW TO EDIT` comments explaining how to add a research
entry, add an education line, and so on — read those first when editing.

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

A `notes.html` page (hobbies / personal notes) was written but deactivated before
launch. It is preserved in the local backup folder alongside the old site; to
bring it back, restore the file and re-add its nav link to both pages (see the
comment in the nav block).

## Things to fill in

- Conference name for the elections paper, once confirmed (`research.html`,
  marked with a dashed-underline placeholder).
- Google Scholar / GitHub / LinkedIn links — commented-out block in `index.html`
  under Correspondence, and a second one at the top of `research.html`.
- `files/CV.pdf` — replace whenever you update your CV.

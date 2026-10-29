# أحمد خالد توفيق — العرّاب

A bilingual (Arabic / English) fan "Bio-bibliography" of Dr. Ahmed Khaled Tawfik (1962–2018): his life, his series and standalone books, his characters, and the writers around him.

Static site. Open `index.html` or serve the folder (e.g. GitHub Pages). After any change, run `node tools/build-sw.js` (see below): the pages load the data built into one file.

## Pages

| Page | What it shows |
|---|---|
| `index.html` | Opening reveal animation, biography, timeline |
| `guide.html` | "Where to start" — reading paths by taste |
| `works.html` | Series as 3D showcase books, a shelf of every series issue, standalone books as hardcovers, screen adaptations |
| `characters.html` | Character cards that flip, filterable by series |
| `writers.html` | Book-spine shelves: co-authors, introductions, influenced writers, contemporaries, authors he translated |
| `book.html?id=…` | One page per book or series issue (`?id=utopia`, `?id=mwt-12`): cover, titles in other languages, description, details, editions and covers, characters, quotes, neighbouring issues |
| `series.html?id=…` | One page per series (`?id=mwt`), including series by others that he wrote or translated for |
| `audio.html` | His audiobooks on a cassette deck (adapted from Codrops' Old School Cassette Player): Audiohat episodes (Ma Wara' al-Tabi'a, Fantasia, After Midnight) and the Safari radio drama from the Tasgeel YouTube channel. ▶ plays in the cassette when it can (a sample file, or YouTube in a visible player), otherwise opens the source; issue pages get their own cassette |
| `quotes.html` | Sourced quotes, with copy / link / save-as-image |
| `legacy.html` | Farewell and tributes timeline, adaptations, interviews and talks |
| `about.html`, `sources.html`, `privacy.html`, `terms.html`, `contact.html` | Linked from the footer only (not the header): who built the site, sources and how the data was collected, privacy, rights and use, contact. Their text is in `assets/js/info.js` |

Every page has search (press `/` or Ctrl+K), an Arabic/English switch, a paper (light) theme, and a "suggest a fix" link that opens a pre-filled GitHub issue.

Deep links: `works.html#s-mwt` (series), `works.html#w-utopia` (book), `works.html#i-mwt-12` (issue), `characters.html#c-refaat`, `writers.html#wr-influenced-0`, `quotes.html#q-3`.

## Editing content

All content lives in plain data files under `assets/js/`:

- **`data.js`** — bio, timeline, series, works, characters, adaptations, writers
- **`data-issues.js`** — every numbered issue of Ma Wara' al-Tabi'a, Fantasia and Safari
- **`data-quotes.js`** — sourced quotes
- **`data-legacy.js`** — tributes timeline and interviews / media links
- **`data-books-a.js`, `data-books-b.js`** — per-book details (`AKT.bookInfo`): longer descriptions, other titles, genres, editions with ISBNs and covers
- **`data-audio.js`** — Audiohat episodes per issue (links only: their sample URLs expire daily, so no audio is hosted here; add an optional sample per episode if you have permission) and the Safari YouTube episodes
- **`data-series-more.js`** — richer series pages (`AKT.seriesInfo`) and series by others he contributed to (`AKT.otherSeries`)

Covers are only linked from Open Library or Wikimedia Commons; when there is none, the site draws its own cover.

Every text field has an `ar` and `en` version. Add an entry and the pages pick it up — no HTML changes needed. Entries that make factual claims carry a `source` URL; please keep that habit.

Replay the intro with `index.html?intro=1` (it otherwise plays once per browser session).

## Publishing

Enable GitHub Pages (Settings → Pages → deploy from `main`, root). The share-preview tags assume the site lives at `https://samehbilal.github.io/ahmed-khaled-tawfik/` — update the `og:` / `canonical` URLs in the page heads if you use a custom domain. Fonts are self-hosted in `assets/fonts/gf` (SIL Open Font License).

### App (PWA)

The site installs as an app and works offline (`manifest.webmanifest`, `sw.js`, `assets/js/pwa.js`). After changing any page, script, stylesheet or font, run:

```
node tools/build-sw.js
```

It builds, in order:

- **`assets/js/data-built.js`** (`tools/build-data.js`) — the eleven data files from `data.js` to `data-more.js`, run once with their corrections applied: the pages load this one file, not those. Edit the data in those files, never in this one, then rebuild.
- **`sw.js`** — the service worker's file list and version, so installed copies show "A newer version is ready".
- **`sitemap.xml`** (`tools/build-sitemap.js`) — every page, book, issue, series, character, writer, publisher and blog article, for search engines.
- **`share/`** (`tools/build-share.js`) — a small page per book, series, character, writer, publisher and article with its own title and picture for WhatsApp, Facebook and X; the «شارك» buttons hand these out.

 Covers are cached as they're viewed, or all at once with "Save for offline" in the footer.

## Credits

- 3D book components adapted from Codrops: *3D Book Showcase* and *Animated Books with CSS 3D Transforms* (Marco Barría).
- Opening reveal adapted from the GSAP "Believe" animation.
- "The Godfather" font by Jeff Bell (see `assets/fonts/THEGODFATHER-LICENSE.txt`).
- Paper and wood textures from the Codrops demos.
- Cassette artwork by Mauricio Estrella; tape sounds by Pogotron on Freesound (see the CREDITS files).

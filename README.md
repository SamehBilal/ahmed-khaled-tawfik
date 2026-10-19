# أحمد خالد توفيق — العرّاب

A bilingual (Arabic / English) fan "discography" of Dr. Ahmed Khaled Tawfik (1962–2018): his life, his series and standalone books, his characters, and the writers around him.

Static site, no build step. Open `index.html` or serve the folder (e.g. GitHub Pages).

## Pages

| Page | What it shows |
|---|---|
| `index.html` | Opening reveal animation, biography, timeline |
| `guide.html` | "Where to start" — reading paths by taste |
| `works.html` | Series as 3D showcase books, a shelf of every series issue, standalone books as hardcovers, screen adaptations |
| `characters.html` | Character cards that flip, filterable by series |
| `writers.html` | Book-spine shelves: co-authors, introductions, influenced writers, contemporaries, authors he translated |
| `quotes.html` | Sourced quotes, with copy / link / save-as-image |
| `legacy.html` | Farewell and tributes timeline, adaptations, interviews and talks |

Every page has search (press `/` or Ctrl+K), an Arabic/English switch, a paper (light) theme, and a "suggest a fix" link that opens a pre-filled GitHub issue.

Deep links: `works.html#s-mwt` (series), `works.html#w-utopia` (book), `works.html#i-mwt-12` (issue), `characters.html#c-refaat`, `writers.html#wr-influenced-0`, `quotes.html#q-3`.

## Editing content

All content lives in plain data files under `assets/js/`:

- **`data.js`** — bio, timeline, series, works, characters, adaptations, writers
- **`data-issues.js`** — every numbered issue of Ma Wara' al-Tabi'a, Fantasia and Safari
- **`data-quotes.js`** — sourced quotes
- **`data-legacy.js`** — tributes timeline and interviews / media links

Every text field has an `ar` and `en` version. Add an entry and the pages pick it up — no HTML changes needed. Entries that make factual claims carry a `source` URL; please keep that habit.

Replay the intro with `index.html?intro=1` (it otherwise plays once per browser session).

## Publishing

Enable GitHub Pages (Settings → Pages → deploy from `main`, root). The share-preview tags assume the site lives at `https://samehbilal.github.io/ahmed-khaled-tawfik/` — update the `og:` / `canonical` URLs in the page heads if you use a custom domain. Fonts are self-hosted in `assets/fonts/gf` (SIL Open Font License).

## Credits

- 3D book components adapted from Codrops: *3D Book Showcase* and *Animated Books with CSS 3D Transforms* (Marco Barría).
- Opening reveal adapted from the GSAP "Believe" animation.
- "The Godfather" font by Jeff Bell (see `assets/fonts/THEGODFATHER-LICENSE.txt`).
- Paper and wood textures from the Codrops demos.

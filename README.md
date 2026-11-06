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
| `quotes.html` | Sourced quotes, with copy / link / save-as-image; under them «قاموس العرّاب», the phrasebook (`#glossary`) |
| `blog.html` | His columns, stories and comics from the blog archive by year and month; under them «في الصحف», the papers they ran in (`#papers`) |
| `legacy.html` | Farewell and tributes timeline, adaptations, interviews and talks |
| `worlds.html`, `clinic.html` | «عوالم فانتازيا» and «عيادة سافاري»: the world each Fantasia issue enters and the case of each Safari issue (`AKT.fantasiaWorlds`, `AKT.safariCases` in `data-pages.js`), from their back covers, with «خط زمن فانتازيا», the worlds of history and legend in order (`#timeline`); `#fantasia-25`, `#safari-36` |
| `names.html` | «أعلام في حكاياته»: the real and legendary figures the back covers name (`AKT.storyPeople`), who each was and their issues; `#p-shakespeare` |
| `calendar.html` | «تقويم العرّاب»: the whole year a day at a time, from `assets/data/days/`; `#d-06-10` opens one day |
| `compare.html` | «السلاسل جنبًا إلى جنب»: his series in one table — who tells each, years, issues, first and last, house, what is on Audiohat and Storytel, legends, figures, the screen, the ending — counted from the data (each series' enemies and villains are on its own page, `series.html?id=<series>#villains`, from `AKT.villains` in `data-series-more.js`) |
| `wanted.html` | «ما ينقص الأرشيف»: what the archive lacks (unknown worlds and cases, back-cover texts and pictures, editions with no year, text with no English), counted from the data when it opens, with «حالة الأرشيف», how complete each part is, and the outside links that no longer answer (`assets/data/links.json`, from `node tools/check-links.js`: it goes online, so it is not part of the build; GitHub runs it on the 1st of every month, `.github/workflows/links.yml`, commits the new file and opens an issue for the links that died since) |
| `changelog.html`, `story.html` | «سجل التحديثات», every change from git, with «ما الجديد منذ زيارتك» (since the newest change this reader saw there; the footer link shows a dot meanwhile) and «سجل التصحيحات» (`#corrections`: a «correction: …» line in a commit body, or `tools/corrections.json`); and «قصة الموقع», the same history a day at a time — the pages born, the covers added, each day's headline changes (`assets/data/story.json`, `tools/build-story.js`). The changelog's news is also an Atom feed for feed readers, `feed.xml` in Arabic and `feed-en.xml` in English (`tools/build-feed.js`), named in every page's head |
| `about.html`, `sources.html`, `privacy.html`, `terms.html`, `contact.html` | Linked from the footer only (not the header): who built the site, sources and how the data was collected (with «روايات متضاربة», `#disputes`, where sources disagree: `AKT.disputes` in `data-series-more.js`), privacy (with «بياناتك على هذا الجهاز», `#mydata`: everything the site keeps in this browser read live, each with a key to clear it, the offline copy's size, and all of it saved to a file and loaded on another device), rights and use (with «كيف تستشهد بالموقع», `#cite`, a page's reference in Arabic, APA, MLA and BibTeX; the «استشهد» key on book, series, character and writer pages opens it), contact. Their text is in `assets/js/info.js` |

Every page has search (press `/` or Ctrl+K), an Arabic/English switch, a paper (light) theme, and a "suggest a fix" link that opens a pre-filled GitHub issue.

Deep links: `works.html#s-mwt` (series), `works.html#w-utopia` (book), `works.html#i-mwt-12` (issue), `characters.html#c-refaat`, `writers.html#wr-influenced-0`, `quotes.html#q-3`.

## Editing content

All content lives in plain data files under `assets/js/`:

- **`data.js`** — bio, timeline, series, works, characters, adaptations, writers
- **`data-issues.js`** — every numbered issue of Ma Wara' al-Tabi'a, Fantasia and Safari
- **`data-quotes.js`** — sourced quotes, and the first lines of books and issues for «البدايات» on `quiz.html#openings` (`AKT.openings`)
- **`data-pages.js`** — the pages about his world and reading: his library, Refaat's life, the creatures, the phrasebook, Tanta, his handwriting and his books' printed dedications (`AKT.dedications`, `handwriting.html#dedications`), what his heroes read and watch inside the stories (`AKT.refaatLibrary`, `library.html#refaat`), Fantasia's worlds, and Safari's cases — edited here; the build writes each part to `assets/js/pages/<part>.js`, and each page loads only the parts it reads
- **`data-legacy.js`** — tributes timeline and interviews / media links
- **`data-tributes.js`** — what people said of him, and the theses and journal articles about him (`AKT.studies`, «دراسات ورسائل عنه» on `tributes.html#studies`)
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

- **`assets/js/data-built.js`** (`tools/build-data.js`) — the eleven data files from `data.js` to `data-more.js`, run once with their corrections applied: the pages load this one file, not those; what only the book, series and «حول العالم» pages read (the editions' links and credits, the Abjjad links) goes to `assets/js/data-detail.js`, which only they load. Edit the data in those files, never in this one, then rebuild. The privacy, contact, changelog and 404 pages draw nothing from the data and do not load it; search, the lists and "Save for offline" fetch it there when first opened (`App.needData`).
- **page descriptions** (`tools/build-meta.js`) — each section page's description, share tags and JSON-LD, with their numbers (issues, books, quotes, articles…) counted from the data; also the font and data preloads in every head.
- **`assets/img/covers-s/`** (`tools/build-thumbs.js`, needs Python with Pillow) — a WebP copy of every cover at most 320 px wide, at the same path, for the grids (`App.thumb`); the book pages show the cover itself. A new or changed cover gets its copy on the next build.
- **`assets/data/open/`** (`tools/build-open.js`) — the archive's facts as CSV files to download (issues, books, editions, quotes, phrases, calendar), listed on the contact page with how to contribute code and a guide to the site.
- **`feed.xml`, `feed-en.xml`** (`tools/build-feed.js`) — the newest 60 changes of the changelog as Atom feeds, and their links in every page's head (a new page gets them on its next build).
- **`sw.js`** — the service worker's file list and version, so installed copies show "A newer version is ready".
- **`sitemap.xml`** (`tools/build-sitemap.js`) — every page, book, issue, series, character, writer, publisher and blog article, for search engines.
- **`share/`** (`tools/build-share.js`) — a small page per book, series, character, writer, publisher and article with its own title and picture for WhatsApp, Facebook and X; the «شارك» buttons hand these out.

To check the data for pictures that are missing, links to pages the site does not have, orphaned details and similar slips, run `node tools/check-data.js` (add `--en` to list text with no English yet). GitHub runs it on every push (`.github/workflows/check.yml`), and fails the push's check when `data-built.js` or the pages' tags were not rebuilt after a data change.

Covers are cached as they're viewed, or all at once with "Save for offline" in the footer.

## Credits

- 3D book components adapted from Codrops: *3D Book Showcase* and *Animated Books with CSS 3D Transforms* (Marco Barría).
- Opening reveal adapted from the GSAP "Believe" animation.
- "The Godfather" font by Jeff Bell (see `assets/fonts/THEGODFATHER-LICENSE.txt`).
- Paper and wood textures from the Codrops demos.
- Cassette artwork by Mauricio Estrella; tape sounds by Pogotron on Freesound (see the CREDITS files).

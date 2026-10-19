# أحمد خالد توفيق — العرّاب

A bilingual (Arabic / English) fan "discography" of Dr. Ahmed Khaled Tawfik (1962–2018): his life, his series and standalone books, his characters, and the writers around him.

Static site, no build step. Open `index.html` or serve the folder (e.g. GitHub Pages).

## Pages

| Page | What it shows |
|---|---|
| `index.html` | Opening reveal animation, biography, timeline |
| `works.html` | Series as 3D showcase books (flip / view inside), standalone books as hardcovers that open on hover, screen adaptations |
| `characters.html` | Character cards that flip, filterable by series |
| `writers.html` | Book-spine shelves: co-authors, introductions, influenced writers, contemporaries, authors he translated |

## Editing content

All content lives in **`assets/js/data.js`** (`window.AKT = {...}`). Every text field has an `ar` and `en` version. Add a work, character or writer there and the pages pick it up — no HTML changes needed. Entries under `writers` carry a `source` URL; please keep that habit.

- Replay the intro: `index.html?intro=1` (it otherwise plays once per browser session).

## Credits

- 3D book components adapted from Codrops: *3D Book Showcase* and *Animated Books with CSS 3D Transforms* (Marco Barría).
- Opening reveal adapted from the GSAP "Believe" animation.
- "The Godfather" font by Jeff Bell (see `assets/fonts/THEGODFATHER-LICENSE.txt`).
- Paper and wood textures from the Codrops demos.

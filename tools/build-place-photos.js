/* node tools/build-place-photos.js — a picture of each place on the map (assets/data/places.json), for the map band's gallery
   (page-hero.js mapGallery): a well-known sight of it, from Wikipedia's lead image of that sight's article (a country's own
   article mostly leads with its flag). Saved to assets/img/places/, and listed with the article it came from in
   assets/data/place-photos.json. Kept when already there. */
const fs = require('fs'), path = require('path');
const root = path.join(__dirname, '..'), out = path.join(root, 'assets/img/places'), list = path.join(root, 'assets/data/place-photos.json');

/* the place (its English name in places.json) → the sight's English Wikipedia article */
const SIGHTS = {
	'America': 'Statue of Liberty', 'Egypt': 'Giza pyramid complex', 'Africa': 'Mount Kilimanjaro', 'Tibet': 'Potala Palace',
	'the Mongols': 'Gorkhi-Terelj National Park', 'the Amazon': 'Amazon rainforest', 'Cairo': 'Mosque of Muhammad Ali',
	'Tunisia': 'Sidi Bou Said', 'Kuwait': 'Kuwait Towers', 'Cameroon': 'Mount Cameroon', 'Congo': 'Congo River',
	'Liberia': 'Monrovia', 'Romania': 'Bran Castle', 'London': 'Tower Bridge', 'France': 'Mont-Saint-Michel',
	'Paris': 'Champ de Mars', 'Germany': 'Neuschwanstein Castle', 'Rome': 'Colosseum', 'Poland': 'Wawel Castle',
	'Russia': "Saint Basil's Cathedral", 'Moscow': 'Moscow Kremlin', 'Norway': 'Geirangerfjord', 'Finland': 'Lapland (Finland)',
	'Iceland': 'Skógafoss', 'India': 'Taj Mahal', 'Afghanistan': 'Band-e Amir National Park', 'Beijing': 'Forbidden City',
	'Australia': 'Uluru', 'Los Angeles': 'Hollywood Sign', 'Mexico': 'Teotihuacan', 'Argentina': 'Perito Moreno Glacier',
	'Bolivia': 'Salar de Uyuni', 'the Maya': 'Chichen Itza', 'Bermuda': 'Gibbs Hill Lighthouse'
};
const UA = { 'User-Agent': 'akt-archive/1.0 (place pictures for an archive site about Ahmed Khaled Tawfik)' };
const slug = s => s.toLowerCase().replace(/^the /, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

(async () => {
	fs.mkdirSync(out, { recursive: true });
	const places = JSON.parse(fs.readFileSync(path.join(root, 'assets/data/places.json'), 'utf8'));
	const have = fs.existsSync(list) ? JSON.parse(fs.readFileSync(list, 'utf8')) : {};
	for (const p of places) {
		const sight = SIGHTS[p.en];
		if (!sight) { console.log('no sight for', p.en); continue; }
		const file = 'assets/img/places/' + slug(p.en) + '.jpg';
		if (have[p.en] && fs.existsSync(path.join(root, file))) continue;
		try {
			const r = await fetch('https://en.wikipedia.org/api/rest_v1/page/summary/' + encodeURIComponent(sight.replace(/ /g, '_')), { headers: UA });
			const j = await r.json();
			let src = (j.thumbnail || j.originalimage || {}).source;
			if (!src) { console.log('no picture:', sight); continue; }
			/* 500px wide, one of the widths Wikimedia's thumbnails come in; else the one it gave */
			src = src.split('?')[0];
			let img = await fetch(/\/thumb\//.test(src) ? src.replace(/\/\d+px-([^/]+)$/, '/500px-$1') : src, { headers: UA });
			if (!img.ok) img = await fetch(src, { headers: UA });
			if (!img.ok) { console.log('failed:', src, img.status); continue; }
			fs.writeFileSync(path.join(root, file), Buffer.from(await img.arrayBuffer()));
			have[p.en] = { src: file, sight: { en: j.title }, page: (j.content_urls && j.content_urls.desktop.page) || '' };
			console.log(p.en, '→', j.title);
		} catch (e) { console.log('error:', p.en, e.message); }
		await new Promise(ok => setTimeout(ok, 1500)); /* (gently: Wikipedia asks for it) */
	}
	fs.writeFileSync(list, JSON.stringify(have, null, 1) + '\n');
})();

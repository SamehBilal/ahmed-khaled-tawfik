/* node tools/build-library-covers.js — the art of each thing in «مكتبته» (AKT.library, assets/js/data-pages.js): a book's cover,
   a film's poster, a song's sleeve, a writer's portrait, from Wikipedia's lead image of its article. Saved to
   assets/img/library/, and listed with the article it came from in assets/data/library-covers.json (by its English title,
   read by library.js). Kept when already there; an item with no article here, or no picture in it, has none. */
const fs = require('fs'), path = require('path');
const root = path.join(__dirname, '..'), out = path.join(root, 'assets/img/library'), list = path.join(root, 'assets/data/library-covers.json');

/* the item (its English title) → its article: English Wikipedia, or Arabic when marked «ar:» */
const PAGES = {
	'The Cairo Trilogy': 'Palace Walk', 'The Beggar': 'The Beggar (Mahfouz novel)', 'The Journey of Ibn Fattouma': 'The Journey of Ibn Fattouma',
	'Naguib Mahfouz': 'Naguib Mahfouz', 'Crime and Punishment': 'Crime and Punishment', 'Anton Chekhov': 'Anton Chekhov',
	'The Apple and the Skull': 'ar:التفاحة والجمجمة', 'Daughter of Fortune': 'Daughter of Fortune', 'Nineteen Eighty-Four': 'Nineteen Eighty-Four',
	'Misery': 'Misery (novel)', 'Stephen King': 'Stephen King', 'And Then There Were None': 'And Then There Were None',
	'Beware of Pity': 'Beware of Pity', 'Yusuf Idris': 'Yusuf Idris', 'Al-Eib (The Shame)': 'ar:العيب (رواية)', 'Granada Trilogy': 'ar:ثلاثية غرناطة',
	'Madame Bovary': 'Madame Bovary', 'The Moon and Sixpence': 'The Moon and Sixpence', 'Christ Recrucified (The Greek Passion)': 'Christ Recrucified',
	'José Saramago': 'José Saramago', 'Aziz Nesin': 'Aziz Nesin', 'The Masque of the Red Death': 'The Masque of the Red Death',
	'The Personality of Egypt': 'ar:شخصية مصر', 'Rahiq al-Umr': 'ar:رحيق العمر', 'The Five Adventurers': 'ar:المغامرون الخمسة',
	'Tintin': 'The Adventures of Tintin', 'Samir magazine (its golden age)': 'ar:سمير (مجلة)', "Mostafa Hussein's cartoons": 'Mostafa Hussein',
	'Bayram al-Tunisi': 'Bayram al-Tunisi', 'Salah Jahin': 'Salah Jahin', 'Abdel Rahman El-Abnoudi': 'Abdel Rahman el-Abnudi',
	'Zahrat al-Madaen': 'ar:زهرة المدائن', 'Citizen Kane': 'Citizen Kane', 'Apocalypse Now': 'Apocalypse Now', 'Dr. Strangelove': 'Dr. Strangelove',
	'Missing': 'Missing (1982 film)', 'Amadeus': 'Amadeus (film)', 'The Day the Fish Came Out': 'The Day the Fish Came Out',
	'Cinema Paradiso': 'Cinema Paradiso', 'Grindhouse': 'Grindhouse (film)', 'Dracula — Hammer films with Christopher Lee': 'Dracula (1958 film)',
	'Marat/Sade': 'Marat/Sade', 'The Country of the Blind': 'The Country of the Blind', 'If—': 'If—', 'The Poison Belt': 'The Poison Belt',
	'The Lady, or the Tiger?': 'The Lady, or the Tiger?', 'Belal Fadl': 'Belal Fadl', 'Harry Potter': "Harry Potter and the Philosopher's Stone",
	'The Spider': 'ar:العنكبوت (رواية)', 'The Yacoubian Building': 'The Yacoubian Building',
	'Ma Baker': 'Ma Baker', 'Chiquitita': 'Chiquitita', 'Yesterday, When I Was Young': 'Hier encore', 'Take My Breath Away': 'Take My Breath Away',
	'Another Brick in the Wall': 'Another Brick in the Wall', 'In the Year 2525': 'In the Year 2525'
};
const UA = { 'User-Agent': 'akt-archive/1.0 (cover art for an archive site about Ahmed Khaled Tawfik)' };
const slug = s => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

(async () => {
	fs.mkdirSync(out, { recursive: true });
	global.window = { AKT: {} };
	require(path.join(root, 'assets/js/data-pages.js'));
	const have = fs.existsSync(list) ? JSON.parse(fs.readFileSync(list, 'utf8')) : {};
	for (const x of window.AKT.library) {
		const en = x.title.en, page = PAGES[en];
		if (!page) { console.log('no article for', en); continue; }
		if (have[en] && fs.existsSync(path.join(root, have[en].src))) continue;
		const ar = page.startsWith('ar:'), title = ar ? page.slice(3) : page;
		try {
			const r = await fetch('https://' + (ar ? 'ar' : 'en') + '.wikipedia.org/api/rest_v1/page/summary/' + encodeURIComponent(title.replace(/ /g, '_')), { headers: UA });
			const j = await r.json();
			let src = (j.thumbnail || j.originalimage || {}).source;
			if (!src) { console.log('no picture:', page); continue; }
			/* 500px wide, one of the widths Wikimedia's thumbnails come in; else the one it gave */
			src = src.split('?')[0];
			let img = await fetch(/\/thumb\//.test(src) ? src.replace(/\/\d+px-([^/]+)$/, '/500px-$1') : src, { headers: UA });
			if (!img.ok) img = await fetch(src, { headers: UA });
			if (!img.ok) { console.log('failed:', src, img.status); continue; }
			const ext = (/\.(png|gif|webp|svg)$/i.exec(src.replace(/\.png$/i, '.png')) || ['.jpg'])[0].toLowerCase().replace('.svg', '.png');
			const file = 'assets/img/library/' + slug(en) + ext;
			fs.writeFileSync(path.join(root, file), Buffer.from(await img.arrayBuffer()));
			have[en] = { src: file, page: (j.content_urls && j.content_urls.desktop.page) || '' };
			console.log(en, '→', j.title);
		} catch (e) { console.log('error:', en, e.message); }
		await new Promise(ok => setTimeout(ok, 3000)); /* (gently: Wikipedia asks for it) */
	}
	fs.writeFileSync(list, JSON.stringify(have, null, 1) + '\n');
})();

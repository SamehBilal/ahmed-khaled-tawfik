// Rewrites each section page's description, in its <meta name="description">, its share tags (og:, twitter:) and its JSON-LD,
// from the data, so the numbers in them (issues, books, quotes, articles…) are the site's own and never go stale; gives every
// section page the same JSON-LD (the page and the site and him it is about, and where it sits under the home page); and drops a
// stylesheet a page links twice. A page not listed in DESC keeps its own description; index.html keeps its own JSON-LD; the
// pages drawn one per thing (book.html, character.html…), the redirects, 404 and offline only lose a doubled stylesheet.
// Run from the repo root after changing the data:  node tools/build-meta.js  (tools/build-sw.js runs it too)
const fs = require('fs'), path = require('path'), vm = require('vm');
const load = require('./load-data.js'), SITE = load.SITE, root = load.root;
const { App, S, d, win } = load(['data-built', 'data-blog', 'data-pages', 'people', 'books', 'shared', 'app', 'site-stats']);

/* «299 عددًا», «7 سلاسل», «100 عدد»: an Arabic count with its noun (one, two, three to ten, eleven and on) */
const ar = (n, one, two, few, many) => n === 1 ? one : n === 2 ? two : (n % 100 >= 3 && n % 100 <= 10) ? n + ' ' + few : (n % 100 === 0 || n % 100 < 3) && n > 100 ? n + ' ' + one : n + ' ' + many;

const tiles = {};
win.SiteStats.tiles().forEach(x => { if (!(x[2] in tiles)) tiles[x[2]] = x[0]; });
const st = d.stats || {}, posts = (d.blog || {}).posts || [];
const years = posts.map(p => +(p.d || '').slice(0, 4)).filter(Boolean);
const N = {
	issues: tiles['works.html'] || 0, books: (d.works || []).length, series: S.ownSeries().length + S.contributedSeries().length,
	covers: tiles['covers.html#wall'] || 0, editions: tiles['covers.html#editions'] || 0, publishers: (d.publishers || []).length,
	posts: posts.length, papers: st.papers || 0, outlets: st.outlets || 0, from: Math.min.apply(null, years), to: Math.max.apply(null, years),
	audio: tiles['audio.html'] || 0, media: (d.media || []).length, characters: (d.characters || []).length, quotes: (d.quotes || []).length,
	glossary: (d.glossary || []).length, people: tiles['writers.html'] || 0, tributes: (d.tributes || []).length, studies: (d.studies || []).length, places: st.places || 0,
	legacy: (d.legacy || []).length, library: (d.library || []).length, creatures: (d.creatures || []).length, life: (d.refaatLife || []).length,
	hand: (d.handwriting || []).length, awards: (d.awards || []).length,
	translations: (d.works || []).filter(w => w.type === 'translation').length,
	worlds: (d.fantasiaWorlds || []).filter(x => x.world).length, diseases: (d.safariCases || []).filter(x => x.kind === 'disease').length,
	figures: (d.storyPeople || []).length
};
/* «تقويم العرّاب»'s days and moments (assets/data/days/, tools/build-days.js, run before this) */
N.days = 0; N.moments = 0;
for (let m = 1; m <= 12; m++) {
	let month = {};
	try { month = JSON.parse(fs.readFileSync(path.join(root, 'assets/data/days', (m < 10 ? '0' : '') + m + '.json'), 'utf8')); } catch (e) {}
	Object.keys(month).filter(k => k !== '_g').forEach(k => { N.days++; N.moments += month[k].length; });
}

/* the descriptions with numbers in them, Arabic and then English, as the pages had them before */
const DESC = {
	'index.html': n => `موقع عن أحمد خالد توفيق، العرّاب: حياته، و${ar(n.issues, 'عدد', 'عددان', 'أعداد', 'عددًا')} من سلاسله و${ar(n.books, 'كتاب', 'كتابان', 'كتب', 'كتابًا')}، و${ar(n.characters, 'شخصية', 'شخصيتان', 'شخصيات', 'شخصية')}، والكتّاب من حوله. — Ahmed Khaled Tawfik — a bio-bibliography: his life, ${n.issues} issues of his series and ${n.books} books, his characters, and the writers around him.`,
	'works.html': n => `كل أعمال أحمد خالد توفيق: ${ar(n.series, 'سلسلة', 'سلسلتان', 'سلاسل', 'سلسلة')} بـ${ar(n.issues, 'عدد', 'عددين', 'أعداد', 'عددًا')}، و${ar(n.books, 'كتاب', 'كتابان', 'كتب', 'كتابًا')} بين رواية ومجموعة وترجمة، كتبًا ثلاثية الأبعاد. — Every series (${n.issues} issues), novel, collection and translation (${n.books} books) by Ahmed Khaled Tawfik, as 3D books.`,
	'characters.html': n => `${ar(n.characters, 'شخصية', 'شخصيتان', 'شخصيات', 'شخصية')} من عالم أحمد خالد توفيق: رفعت إسماعيل وعبير وعلاء عبد العظيم ومن حولهم. — ${n.characters} characters of Ahmed Khaled Tawfik: Refaat Ismail, Abeer, Alaa Abdel Azim and more.`,
	'writers.html': n => `${ar(n.people, 'اسم', 'اسمان', 'أسماء', 'اسمًا')} حول أحمد خالد توفيق: من كتب معه، ومن قدّم لهم، ومن كتبوا عنه. — ${n.people} people around Ahmed Khaled Tawfik: co-authors, introductions, and the generation he influenced.`,
	'quotes.html': n => `${ar(n.quotes, 'اقتباس', 'اقتباسان', 'اقتباسات', 'اقتباسًا')} لأحمد خالد توفيق، كلٌّ بنصه ومصدره، و«قاموس العرّاب»: ${ar(n.glossary, 'عبارة', 'عبارتان', 'عبارات', 'عبارة')} عُرف بها هو وأبطاله. — ${n.quotes} verified quotes by Ahmed Khaled Tawfik, each with its source, and his phrasebook: ${n.glossary} lines he and his heroes are known by.`,
	'audio.html': n => `أعمال أحمد خالد توفيق مسموعة على شريط كاسيت: ${ar(n.audio, 'تسجيل', 'تسجيلان', 'تسجيلات', 'تسجيلًا')} من أعماله وعنه وعن عالمه، على أوديوهات وستوريتل واقرأ لي وستوريا بود وساوندكلاود ويوتيوب. — ${n.audio} recordings of and about Ahmed Khaled Tawfik's work, played from a vintage cassette deck.`,
	'blog.html': n => `مدونة أحمد خالد توفيق: ${ar(n.posts, 'مقال', 'مقالان', 'مقالات', 'مقالًا')} وقصة وكوميكس بين ${n.from} و${n.to}، و«في الصحف»: ${ar(n.papers, 'مقال', 'مقالان', 'مقالات', 'مقالًا')} في ${ar(n.outlets, 'جريدة', 'جريدتين', 'جرائد ومواقع ومجلات', 'جريدة وموقعًا ومجلة')}. — Ahmed Khaled Tawfik's columns, stories and comics (${n.posts}) by year and month, and the ${n.outlets} papers they ran in.`,
	'tributes.html': n => `ما قاله ${ar(n.tributes, 'كاتب', 'كاتبان', 'كتّاب وفنانين', 'كاتبًا وفنانًا')} عن أحمد خالد توفيق، والكتب التي كُتبت عنه. — What ${n.tributes} writers, artists and public figures said about Ahmed Khaled Tawfik, each with its source.`,
	'studies.html': n => `${n.studies} رسالة جامعية وبحثًا محكّمًا عن أحمد خالد توفيق وكتبه، أكثرها عن «يوتوبيا»، كل عنوان برابط سجلّه في الجامعة أو المجلة. — ${n.studies} theses and peer-reviewed articles about Ahmed Khaled Tawfik and his books.`,
	'legacy.html': n => `إرث أحمد خالد توفيق: الوداع والتكريم و${ar(n.legacy, 'حدث', 'حدثان', 'أحداث', 'حدثًا')} بعد رحيله، ولقاءاته بصوته. — The legacy of Ahmed Khaled Tawfik: his farewell, tributes, ${n.legacy} events since, and his interviews.`,
	'publishers.html': n => `${ar(n.publishers, 'دار نشر', 'داران', 'دور نشر ومنصات', 'دار نشر ومنصة')} صدرت عنها كتب أحمد خالد توفيق وسلاسله، ولكل دار صفحتها. — The ${n.publishers} houses and platforms that published Ahmed Khaled Tawfik, each with its own page.`,
	'covers.html': n => `${ar(n.covers, 'غلاف', 'غلافان', 'أغلفة', 'غلافًا')} لأحمد خالد توفيق على جدار واحد، و${ar(n.editions, 'طبعة', 'طبعتان', 'طبعات', 'طبعة')} مسجّلة لأعداده وكتبه. — Every cover on one wall (${n.covers}), and ${n.editions} editions recorded.`,
	'talks.html': n => `سيرة أحمد خالد توفيق في ستة فصول، من طنطا إلى ما بعد رحيله: ما جرى في كل منها، ولقاءاته وما قيل عنه في سنواته. — The life of Ahmed Khaled Tawfik in six chapters, from Tanta to what came after him.`,
	'interviews.html': n => `${ar(n.media, 'لقاء', 'لقاءان', 'لقاءات', 'لقاءً')} وفيلمًا ومقالًا عن أحمد خالد توفيق: لقاءاته التلفزيونية ومحاضراته، والأفلام والمقالات التي كُتبت عنه — الفيديو يُشاهَد في الصفحة. — ${n.media} interviews, talks and films about him; the videos play on the page.`,
	'tanta.html': n => `طنطا مدينة أحمد خالد توفيق: بيوته ومدارسه وكلية الطب التي درس ودرّس فيها، ومسجد جنازته وقبره، وطنطا كما كتبها — كل مكان بمصدره وموقعه على الخريطة. — Tanta, his city: his homes, schools and faculty, his funeral mosque and grave, and Tanta in his writing.`,
	'map.html': n => `${ar(n.places, 'مكان', 'مكانان', 'أماكن', 'مكانًا')} تذكرها كتب أحمد خالد توفيق وأعداده على خريطة العالم: من غابات رومانيا إلى الأمازون والتبت، مع الجملة التي ذكرت كل مكان. — The ${n.places} places Ahmed Khaled Tawfik's books name, on a world map.`,
	'library.html': n => `${ar(n.library, 'كتاب', 'كتابان', 'كتب', 'كتابًا')} وكاتبًا وفيلمًا وأغنية أحبها أحمد خالد توفيق ونصح بها، كما قال في مقالاته ولقاءاته. — ${n.library} books, writers, films and songs Ahmed Khaled Tawfik loved and recommended.`,
	'creatures.html': n => `${ar(n.creatures, 'وحش', 'وحشان', 'وحوش', 'وحشًا')} وأسطورة من «ما وراء الطبيعة»: الأسطورة الحقيقية وراء مصاص الدماء والمذءوب والنداهة والمومياء وغيرها، والأعداد التي تظهر فيها. — The ${n.creatures} monsters and legends of Paranormal, and the issues they appear in.`,
	'refaat-life.html': n => `حياة د. رفعت إسماعيل كما ترويها «ما وراء الطبيعة»: من كفر بدر عام 1924 إلى العدد الثمانين، في ${ar(n.life, 'محطة', 'محطتين', 'محطات', 'محطة')} مع أعدادها. — Refaat Ismail's life as Paranormal tells it, in ${n.life} moments.`,
	'reader-stories.html': n => `حكايات القرّاء مع أحمد خالد توفيق بأقلامهم، وما كتبه هو بيده لقرّائه: ${ar(n.hand, 'إهداء', 'إهداءان', 'إهداءات وتوقيعات', 'إهداءً وتوقيعًا')} كما رواها أصحابها، وإهداءات كتبه، ودعوة لمن عنده حكاية أو إهداء منه. — Readers’ stories of Ahmed Khaled Tawfik, and what he wrote by hand for them: ${n.hand} dedications and signatures.`,
	'worlds.html': n => `العوالم التي تدخلها عبير في أعداد «فانتازيا» الأربعة والستين: ${ar(n.worlds, 'عالم', 'عالمان', 'عوالم', 'عالمًا')} من الأساطير والأدب والسينما والتاريخ، عددًا عددًا كما يقول غلافه الخلفي.`,
	'clinic.html': n => `أعداد «سافاري» الثلاثة والخمسون ملفاتٍ لعلاء عبد العظيم: المرض أو القبيلة أو اللغز في كل عدد، و${ar(n.diseases, 'مرض', 'مرضان', 'أمراض', 'مرضًا')} بنبذة طبية عن كل منها.`,
	'names.html': n => `${ar(n.figures, 'عَلَم', 'علمان', 'أعلام', 'علمًا')} حقيقيًّا وأسطوريًّا في أعداد أحمد خالد توفيق: شكسبير وهانيبال وتشي جيفارا وفرويد وباستير وجلجاميش وغيرهم، ومن هو كل منهم والأعداد التي تلقاه فيها.`,
	'calendar.html': n => `تقويم أحمد خالد توفيق يومًا بيوم: ${ar(n.moments, 'حدث', 'حدثان', 'أحداث', 'حدثًا')} على ${ar(n.days, 'يوم', 'يومين', 'أيام', 'يومًا')} من العام، من ميلاده ورحيله إلى ما صدر من أعداده وكتبه ومقالاته.`,
	'awards.html': n => `جوائز أحمد خالد توفيق في حياته وبعد رحيله (${n.awards}): جائزة الشارقة عن «مثل إيكاروس»، والقائمة القصيرة لترجمة «يوتوبيا»، وما كُرِّم به اسمه. — His ${n.awards} awards and honours.`
};

const x = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const unx = (s) => String(s).replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
/* a page's English name, as the header and footer give it */
const EN = {};
['nav', 'more', 'world', 'legal'].forEach(k => (App.UI[k] || []).forEach(p => { if (!EN[p.href]) EN[p.href] = p.en; }));
const TYPE = { 'about.html': 'AboutPage', 'contact.html': 'ContactPage' };
const ONE = ['book.html', 'character.html', 'series.html', 'writer.html', 'publisher.html', '404.html', 'offline.html'];

let changed = 0;
fs.readdirSync(root).filter(f => /\.html$/.test(f)).sort().forEach(f => {
	const file = path.join(root, f), was = fs.readFileSync(file, 'utf8');
	let h = was;
	/* a stylesheet linked twice: the first kept */
	const seen = {};
	h = h.replace(/[ \t]*<link rel="stylesheet" href="([^"]+)">\r?\n/g, (m, href) => seen[href] ? '' : (seen[href] = 1, m));
	/* the two Arabic fonts every page sets its text in, and the data the page is drawn from (at the foot of the page, the largest
	   file it loads), asked for from the head, so they come while the stylesheets do rather than after them */
	h = h.replace(/[ \t]*<link rel="preload"[^>]*>\r?\n/g, '');
	if (/<link rel="stylesheet" href="assets\/css\/fonts\.css">/.test(h)) {
		const pre = ['NotoNaskhArabic-arabic-7', 'ReemKufi-arabic-10'].map(n => '\t<link rel="preload" href="assets/fonts/gf/' + n + '.woff2" as="font" type="font/woff2" crossorigin>\n').join('') +
			(/<script src="assets\/js\/data-built\.js"><\/script>/.test(h) ? '\t<link rel="preload" href="assets/js/data-built.js" as="script">\n' : '');
		h = h.replace(/([ \t]*<link rel="stylesheet" href="assets\/css\/fonts\.css">)/, pre + '$1');
	}
	/* the page's own words ([data-i18n]: its eyebrow, title, lead, section heads), in Arabic in the page itself, from PAGE.strings of
	   its script: there at the first paint, so nothing drops when the script fills them, and read by search engines (an English
	   reader's page still puts its English in) */
	const own = (h.match(/<script src="assets\/js\/([a-z0-9-]+\.js)"><\/script>/g) || []).map(t => /js\/([^"]+)"/.exec(t)[1])
		.map(n => path.join(root, 'assets/js', n)).filter(p => fs.existsSync(p) && /^window\.PAGE = /m.test(fs.readFileSync(p, 'utf8')))[0];
	if (own && /data-i18n="/.test(h)) {
		const before = win.PAGE;
		let strings = {};
		try { vm.runInContext(fs.readFileSync(own, 'utf8'), win, { filename: path.basename(own) }); strings = (win.PAGE && win.PAGE.strings) || {}; } catch (err) { console.warn('meta: could not read', path.basename(own), err.message); }
		win.PAGE = before;
		h = h.replace(/(<([a-z0-9]+)\b[^>]*\bdata-i18n="([^"]+)"[^>]*>)[^<]*(<\/\2>)/g, (m, open, tag, k, close) => {
			const s = strings[k], text = typeof s === 'string' ? s : s && typeof s.ar === 'string' ? s.ar : null;
			return text == null ? m : open + text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;') + close;
		});
	}
	const section = !/http-equiv="refresh"/.test(h) && ONE.indexOf(f) < 0 && /<!-- \/share -->/.test(h);
	if (section) {
		const m = /<meta name="description" content="([^"]*)">/.exec(h), old = m ? unx(m[1]) : '';
		const desc = DESC[f] ? DESC[f](N) : old, e = x(desc);
		h = h.replace(/(<meta name="description" content=")[^"]*(">)/, '$1' + e + '$2')
			.replace(/(<meta property="og:description" content=")[^"]*(">)/, '$1' + e + '$2')
			.replace(/(<meta name="twitter:description" content=")[^"]*(">)/, '$1' + e + '$2');
		if (f !== 'index.html') {
			const url = SITE + f, title = unx((/<title>([^<]*)<\/title>/.exec(h) || [])[1] || ''), name = title.split(' — ')[0];
			const img = (/<meta property="og:image" content="([^"]*)">/.exec(h) || [])[1];
			const ld = [{
				'@context': 'https://schema.org', '@type': TYPE[f] || 'CollectionPage', '@id': url + '#page', url: url, name: title,
				alternateName: (EN[f] || name) + ' — Ahmed Khaled Tawfik', description: desc, inLanguage: ['ar', 'en'], image: img,
				isPartOf: { '@type': 'WebSite', '@id': SITE + '#site', name: 'العرّاب — The Godfather', url: SITE },
				about: { '@type': 'Person', '@id': SITE + '#akt', name: 'أحمد خالد توفيق', alternateName: 'Ahmed Khaled Tawfik' }
			}, {
				'@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [
					{ '@type': 'ListItem', position: 1, name: 'الرئيسية', item: SITE }, { '@type': 'ListItem', position: 2, name: name, item: url }]
			}];
			const tag = '\t<script type="application/ld+json">' + JSON.stringify(ld).replace(/<\//g, '<\\/') + '</script>\n';
			h = h.replace(/[ \t]*<script type="application\/ld\+json">.*<\/script>\r?\n/, '');
			h = h.replace(/(<!-- \/share -->\r?\n)/, '$1' + tag);
		}
	}
	if (h !== was) { fs.writeFileSync(file, h); changed++; }
});
console.log('meta', changed + ' pages rewritten', JSON.stringify(N));

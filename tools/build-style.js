// «اللغة والأسلوب» (style.html): his writing in numbers, counted once from the blog archive's titles and excerpts (data-blog.js)
// and the series' issue titles (data-built.js) — written to assets/data/style.json. Run by tools/build-sw.js; on its own:
//   node tools/build-style.js
const fs = require('fs'), path = require('path');
const root = path.resolve(__dirname, '..');
global.window = {};
require(path.join(root, 'assets/js/data-built.js'));
require(path.join(root, 'assets/js/data-blog.js'));
const A = window.AKT, posts = ((A.blog || {}).posts || []).filter(p => /^\d{4}/.test(p.d || '') && +p.d.slice(0, 4) <= 2018);

/* Arabic as a reader sees it: no diacritics or tatweel, one alef, ta marbuta and alef maqsura as they are */
const norm = s => String(s || '').replace(/[ً-ْـ]/g, '').replace(/[أإآ]/g, 'ا').replace(/ى/g, 'ي');
const STOP = new Set(('من في على الى إلى عن ان أن إن او أو ما لا لم لن قد هذا هذه ذلك تلك هو هي هم هن انا أنا نحن انت أنت كان كانت يكون تكون ' +
	'كل بعض مع ثم حتى بل لكن لقد قال قالت عند بين كما مثل الذي التي الذين اللذين التى وهو وهي وفي ومن وما ولا وكان فهو فهي هل اي أي ' +
	'لها له لهم به بها فيه فيها منه منها عليه عليها اليه إليه انه إنه انها إنها كانوا يكن ليس ليست غير بعد قبل هنا هناك اذا إذا لو ' +
	'او كذا وقد فقد ولم ولكن لان لأن وان وأن فان فإن مما عما الا إلا هكذا ايضا أيضا جدا دون حين حيث منذ ولا وهذا وهذه وذلك كلها كله ' +
	'نفس نفسه يا ذات وكل عليك عليه عندي لدي لديه لنا لي لك بي بك بنا اننا إننا انني إنني فلا فما ولو وإن وإذا فى يتم تم ' +
	'الكاتب المقال الكتاب مقال مقالات العدد بقلم المزيد اقرا اقرأ ' +
	/* the illustrators' credits and the names that sign the excerpts, not his words */
	'رسوم رسم الفنان الفنانة طارق عزام احمد محمد خالد توفيق عبد فواز الدكتور مؤخرا قرات صورة صور المصدر علي').split(/\s+/).map(norm));

/* the words: from titles and excerpts, a word as it stands (no prefix stripping — «الرعب» and «رعب» count apart, as he wrote them) */
const words = {}, years = {};
posts.forEach(p => {
	const y = p.d.slice(0, 4), text = norm(p.t + ' ' + (p.ex || ''));
	const Y = years[y] = years[y] || { n: 0, chars: 0, q: 0, x: 0, dots: 0, sent: 0, words: 0 };
	Y.n++; Y.chars += (p.ex || '').length;
	Y.q += ((p.ex || '').match(/[؟?]/g) || []).length;
	Y.x += ((p.ex || '').match(/!/g) || []).length;
	Y.dots += ((p.ex || '').match(/\.\.+|…/g) || []).length;
	const sents = (p.ex || '').split(/[.!?؟…]+/).map(s => s.trim()).filter(s => s.split(/\s+/).length > 2);
	Y.sent += sents.length; Y.words += sents.reduce((n, s) => n + s.split(/\s+/).length, 0);
	(text.match(/[ء-ي]{3,}/g) || []).forEach(w => { if (!STOP.has(w)) words[w] = (words[w] || 0) + 1; });
});
const top = (o, n) => Object.keys(o).sort((a, b) => o[b] - o[a]).slice(0, n).map(k => [k, o[k]]);

/* the issue titles: how many words each series' titles have, and the words they open with */
const series = ['mwt', 'fantasia', 'safari'].map(sid => {
	const list = (A.issues[sid] || []).map(is => norm(is.title.ar));
	const first = {};
	list.forEach(tl => { const w = tl.split(/\s+/)[0]; first[w] = (first[w] || 0) + 1; });
	return { id: sid, n: list.length, avg: +(list.reduce((s, tl) => s + tl.split(/\s+/).length, 0) / (list.length || 1)).toFixed(1), first: top(first, 3) };
});

/* the kinds of writing the archive's labels name */
const KINDS = ['قصة قصيرة', 'كوميكس', 'مسلسلات إذاعية', 'أشعار', 'قرأت مؤخرا', 'هلاوس', 'مقالات'];
const kinds = KINDS.map(k => [k, posts.filter(p => (p.l || []).indexOf(k) >= 0).length]).filter(k => k[1]);

const out = {
	posts: posts.length,
	years: Object.keys(years).sort().map(y => { const Y = years[y]; return [+y, Y.n, +(Y.q * 1000 / (Y.chars || 1)).toFixed(2), +(Y.x * 1000 / (Y.chars || 1)).toFixed(2), +(Y.dots * 1000 / (Y.chars || 1)).toFixed(2), +(Y.words / (Y.sent || 1)).toFixed(1)]; }),
	words: top(words, 80), series: series, kinds: kinds
};
fs.mkdirSync(path.join(root, 'assets/data'), { recursive: true });
fs.writeFileSync(path.join(root, 'assets/data/style.json'), JSON.stringify(out));
console.log('style.json', out.posts, 'articles,', out.words.length, 'words');

/* talks.html — «سيرته»: his life in six chapters (the site's timeline, AKT.timeline, with each period's interviews and, after
   him, the Legacy page's events). His interviews have a page of their own (interviews.html, once #talks here), and so has his
   city (tanta.html, once #tanta). The band: his life as one line, 1962 to 2018 and after, a stretch for each chapter. */
window.PAGE = {
	id: 'talks',
	title: { ar: 'سيرته', en: 'His life' },
	strings: {
		eyebrow: { ar: 'من طنطا إلى الكتابة', en: 'From Tanta to writing' },
		title: { ar: 'سيرته', en: 'His life' },
		lead: {
			ar: 'حياته في ستة فصول، من طنطا إلى ما بعد رحيله: ما جرى في كل منها، ولقاءاته وما قيل عنه في سنواته.',
			en: 'His life in six chapters, from Tanta to what came after him: what happened in each, and the interviews and films of its years.'
		}
	},
	/* the chapters of his life: [from, to (inclusive), title, line] */
	CHAPTERS: [
		[1962, 1984, { ar: 'طنطا والبدايات', en: 'Tanta, and the beginnings' }, { ar: 'الطفولة والمدرسة وأول ما نُشر له.', en: 'Childhood, school, and the first thing he had published.' }],
		[1985, 1991, { ar: 'الطبيب', en: 'The doctor' }, { ar: 'كلية الطب بجامعة طنطا، طالبًا ثم مدرّسًا.', en: 'Tanta University’s Faculty of Medicine, as a student and then a teacher.' }],
		[1992, 2003, { ar: 'روايات مصرية للجيب', en: 'The pocket novels' }, { ar: 'رفعت إسماعيل وعبير وعلاء عبد العظيم، وجيل كامل يقرأ.', en: 'Refaat Ismail, Abeer and Alaa Abdel Azim, and a whole generation reading.' }],
		[2004, 2013, { ar: 'الروائي والكاتب الساخر', en: 'Novelist and columnist' }, { ar: 'الرواية الطويلة والترجمة والمقال الساخر.', en: 'The full-length novel, translation and the satirical column.' }],
		[2014, 2018, { ar: 'السنوات الأخيرة', en: 'The last years' }, { ar: 'وداع رفعت إسماعيل، والجوائز، و«شآبيب»، والرحيل.', en: 'Farewell to Refaat Ismail, the awards, Shaabeeb, and his death.' }],
		[2019, 9999, { ar: 'ما بعده', en: 'After him' }, { ar: 'ما بقي منه: كتبه بعد رحيله، والمسلسل، والتكريم.', en: 'What remained: his books after his death, the series, the honours.' }]
	],
	yt: function (url) { var m = /(?:v=|youtu\.be\/|embed\/)([\w-]{11})/.exec(url || ''); return m ? m[1] : ''; },

	/* the band: his life as one line — a stretch for each chapter, as long as its years (after him, a short fading one), its
	   number and name over it and its years under it; a lit dot at his birth, a candle at 2018; a stretch leads to its chapter */
	band: function (d, A) {
		var e = A.esc, t = A.t, L = A.L, self = window.PAGE;
		var span = function (c) { return c[1] === 9999 ? 6 : c[1] - c[0] + 1; };
		var all = self.CHAPTERS.reduce(function (n, c) { return n + span(c); }, 0);
		return '<div class="ll"><div class="ll-line">' + self.CHAPTERS.map(function (c, i) {
			var after = c[1] === 9999;
			return '<a class="ll-ch' + (after ? ' is-after' : '') + '" href="#ch-' + (i + 1) + '" style="--w:' + (span(c) / all * 100).toFixed(2) + '%;--i:' + i + '">' +
				'<span class="ll-n">' + e(A.num(i + 1)) + '</span><span class="ll-t">' + e(t(c[2])) + '</span>' +
				'<span class="ll-bar" aria-hidden="true"></span><span class="ll-y">' + e(after ? A.num(c[0]) + ' –' : A.num(c[0]) + ' – ' + A.num(c[1])) + '</span></a>';
		}).join('') + '</div></div>';
	},

	render: function () {
		/* the parts that left for pages of their own: an old link to one goes there */
		var away = { '#talks': 'interviews.html', '#tanta': 'tanta.html' }[location.hash];
		if (away) { location.replace(away); return; }
		document.getElementById('content').innerHTML = this.life();
		window.App.focusHash();
	},

	/* «سيرته»: the summary, then a chapter a period — its events from the timeline (after him, the Legacy page's), and the
	   interviews and films of those years */
	life: function () {
		var App = window.App, d = App.data(), e = App.esc, t = App.t, L = App.L, self = this;
		var bio = d.bio || {}, media = d.media || [];
		var paras = String(t(bio.summary || {}) || '').split(/\n\n+/).filter(Boolean);
		var chapters = this.CHAPTERS.map(function (c, i) {
			var after = c[1] === 9999;
			var ev = after
				? (d.legacy || []).filter(function (l) { return +String(l.date).slice(0, 4) >= c[0]; }).slice(0, 8).map(function (l) { return { year: +String(l.date).slice(0, 4), title: l.title, text: l.text }; })
				: (d.timeline || []).filter(function (x) { return x.year >= c[0] && x.year <= c[1]; });
			var talks = media.filter(function (m) { return m.year >= c[0] && m.year <= c[1]; });
			var years = after ? App.num(c[0]) + ' –' : App.num(c[0]) + ' – ' + App.num(c[1]);
			return '<section class="bio-ch" id="ch-' + (i + 1) + '"><header><span class="bio-n">' + e(App.num(i + 1)) + '</span><div><p class="bio-yrs">' + e(years) + '</p>' +
					'<h3>' + e(t(c[2])) + '</h3><p class="bio-line">' + e(t(c[3])) + '</p></div></header>' +
				'<ol class="bio-ev">' + ev.map(function (x) {
					var img = (x.images || [])[0];
					return '<li' + (img ? ' class="has-img"' : '') + '>' + (img ? '<img src="' + e(img.src) + '" alt="' + e(t(img.alt || {})) + '" loading="lazy">' : '') +
						'<b>' + e(App.num(x.year)) + '</b><h4>' + e(t(x.title)) + '</h4><p>' + e(t(x.text)) + '</p></li>';
				}).join('') + '</ol>' +
				(after ? '<p class="bio-more"><a href="legacy.html">' + e(L('كل ما جاء بعده في «الإرث» ←', 'Everything after him on the Legacy page →')) + '</a></p>' : '') +
				(talks.length ? '<p class="bio-talks">' + e(L('من لقاءاته وما قيل عنه في هذه السنوات: ', 'Interviews and films from these years: ')) + talks.slice(0, 4).map(function (m) {
					return '<a href="' + e(self.yt(m.url) ? 'interviews.html#v-' + self.yt(m.url) : m.url) + '"' + (self.yt(m.url) ? '' : ' target="_blank" rel="noopener"') + '>' + e(t(m.title)) + '</a>';
				}).join(' · ') + (talks.length > 4 ? ' · ' + e(L('و' + App.num(talks.length - 4) + ' غيرها', 'and ' + (talks.length - 4) + ' more')) : '') + '</p>' : '') +
			'</section>';
		}).join('');
		return '<section class="section bio tk-life" id="life"><div class="wrap">' + /* (.bio: the home page's biography's two columns, here within the site's width, page-talks.css) */
			'<div class="bio-sum">' + paras.map(function (p) { return '<p>' + e(p) + '</p>'; }).join('') + '</div>' +
			'<nav class="chips bio-jump">' + this.CHAPTERS.map(function (c, i) { return '<a class="chip" href="#ch-' + (i + 1) + '">' + e(App.num(i + 1) + '. ' + t(c[2])) + '</a>'; }).join('') +
				'<a class="chip bio-out" href="tanta.html">' + e(L('طنطا، مدينته ←', 'Tanta, his city →')) + '</a>' +
				'<a class="chip bio-out" href="interviews.html">' + e(L('لقاءاته ←', 'His interviews →')) + '</a></nav>' +
			chapters + '</div></section>';
	}
};

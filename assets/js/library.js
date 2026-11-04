/* library.html — «مكتبته»: the books, writers, films and music he loved, praised or recommended, in his own words
   (AKT.library, data-pages.js): mostly his articles (each leading to it in the blog archive), a few from interviews.
   By kind, with what he said of each. */
window.PAGE = {
	id: 'library',
	title: { ar: 'مكتبته', en: 'His library' },
	strings: {
		eyebrow: { ar: 'ما قرأه وأحبه', en: 'What he read and loved' },
		title: { ar: 'مكتبته', en: 'His library' },
		lead: {
			ar: 'الروايات والكتّاب والأفلام والأغاني التي أحبها ونصح بها، كما قال هو في مقالاته ولقاءاته: من محفوظ ودستويفسكي إلى ستيفن كينج و«المغامرون الخمسة».',
			en: 'The novels, writers, films and songs he loved and recommended, as he said himself in his articles and interviews: from Mahfouz and Dostoevsky to Stephen King and The Five Adventurers.'
		}
	},
	KINDS: [['book', { ar: 'كتب', en: 'Books' }], ['writer', { ar: 'كتّاب', en: 'Writers' }], ['film', { ar: 'أفلام', en: 'Films' }],
		['music', { ar: 'موسيقى', en: 'Music' }], ['other', { ar: 'وأشياء أخرى', en: 'And more' }]],
	kind: 'all',
	/* the drawn small covers' colours, by kind */
	COLOR: { book: '#6b1d10', writer: '#7a4e1d', film: '#3b3357', music: '#1f4a44', other: '#2f4a3a' },

	/* the band: a shelf of spines, each a book he loved, its title along it; at one end of it a crate of the songs and films,
	   at the other one of the writers, magazines and the rest — the crates of «قوائمي» (page-hero.css .ph-crate), a brass
	   plate with the name and how many, the covers (filled in when the art has come) leaning out of the top, each leading to
	   what he said of it */
	band: function (d, A) {
		var e = A.esc, t = A.t, L = A.L, self = window.PAGE, all = d.library || [], list = all.filter(function (x) { return x.kind === 'book'; }).slice(0, 14);
		var cols = ['#6b1d10', '#2f4a3a', '#3b3357', '#7a4e1d', '#1f3b52', '#5a2a3a', '#4a4a2a'];
		var crate = function (name, kinds, icon) {
			var n = all.filter(function (x) { return kinds.indexOf(x.kind) >= 0; }).length;
			return '<div class="ph-crate on lb-crate" data-kinds="' + kinds.join(' ') + '"><div class="ph-crate-in"></div>' +
				'<div class="ph-crate-box"><span class="ph-plate"><svg viewBox="0 0 24 24"><path d="' + icon + '"/></svg><b>' + e(name) + '</b><em>' + e(A.num(n)) + '</em></span></div></div>';
		};
		setTimeout(function () { self.bandArt(d, A); }, 0);
		return '<div class="lb-shelf">' + crate(L('أغانٍ وأفلام', 'Songs and films'), ['music', 'film'], 'M9 18V5l12-2v13M9 18a3 3 0 1 1-6 0 3 3 0 0 1 6 0zm12-2a3 3 0 1 1-6 0 3 3 0 0 1 6 0z') +
			list.map(function (x, i) {
				return '<span style="--c:' + cols[i % cols.length] + ';--h:' + (70 + (i * 37) % 26) + '%;--w:' + (34 + (i * 13) % 18) + 'px"><b>' + e(t(x.title)) + '</b></span>';
			}).join('') +
			crate(L('كتّاب ومجلات', 'Writers and magazines'), ['writer', 'other'], 'M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z') + '</div><i class="lb-plank"></i>';
	},
	/* the crates' covers: two of each kind, those with art first, leaning as in «قوائمي» */
	bandArt: function (d, A) {
		var self = this, e = A.esc, t = A.t, all = d.library || [];
		var fill = function (art) {
			document.querySelectorAll('.lb-crate').forEach(function (bx) {
				var kinds = bx.getAttribute('data-kinds').split(' ');
				var items = [].concat.apply([], kinds.map(function (k) {
					return all.filter(function (x) { return x.kind === k; })
						.sort(function (a, b) { return (art[b.title.en] ? 1 : 0) - (art[a.title.en] ? 1 : 0); }).slice(0, 2);
				}));
				bx.querySelector('.ph-crate-in').innerHTML = items.map(function (x, j) {
					var pic = art[x.title.en], href = x.post ? 'blog.html?post=' + encodeURIComponent(x.post) : x.source;
					var st = '--j:' + j + ';--r:' + [-6, 3, -2, 5][j] + 'deg';
					return '<a class="ph-cv' + (pic ? '' : ' ph-cv-drawn') + '" href="' + e(href) + '" title="' + e(t(x.title)) + '" style="' + st + (pic ? '' : ';background:' + self.COLOR[x.kind]) + '"' +
						(x.post ? '' : ' target="_blank" rel="noopener"') + '>' + (pic ? '<img src="' + e(pic.src) + '" alt="" loading="lazy" decoding="async">' : '<b>' + e(t(x.title)) + '</b>') + '</a>';
				}).reverse().join('');
			});
			var ph = document.querySelector('.ph[data-ph="library"]');
			if (ph) ph.removeAttribute('aria-hidden'); /* (its covers are links) */
		};
		this.artReady().then(fill);
	},
	/* the art of each (tools/build-library-covers.js), fetched once for the band and the list */
	artReady: function () {
		var self = this;
		return this._art || (this._art = fetch('assets/data/library-covers.json').then(function (r) { return r.json(); }).catch(function () { return {}; })
			.then(function (j) { self.art = j; return j; }));
	},

	render: function () {
		var App = window.App, e = App.esc, L = App.L, self = this, list = App.data().library || [];
		var count = {}; list.forEach(function (x) { count[x.kind] = (count[x.kind] || 0) + 1; });
		var posts = list.filter(function (x) { return x.post; }).length;
		document.getElementById('content').innerHTML = '<section class="section lb"><div class="wrap">' +
			'<p class="lb-sum">' + e(L(App.num(list.length) + ' مما أحبه، ' + App.num(posts) + ' منها من مقالاته نفسها.', list.length + ' things he loved, ' + posts + ' of them from his own articles.')) + '</p>' +
			'<div class="chips lb-bar"><button type="button" class="chip" data-k="all" aria-pressed="true">' + e(L('الكل', 'All')) + ' <b>' + e(App.num(list.length)) + '</b></button>' +
				this.KINDS.filter(function (k) { return count[k[0]]; }).map(function (k) {
					return '<button type="button" class="chip" data-k="' + k[0] + '" aria-pressed="false">' + e(App.t(k[1])) + ' <b>' + e(App.num(count[k[0]])) + '</b></button>';
				}).join('') + '</div>' +
			'<div class="lb-list"></div>' +
			'<p class="lb-note">' + e(L('ما قاله عن كل منها مُلخَّص من كلامه؛ افتح المقال لتقرأه بنصّه. وإن كنت تعرف كتابًا آخر نصح به فأرسله من «تواصل وساهم».', 'What he said of each is summed up from his words; open the article to read them in full. If you know another book he recommended, send it from Contact & contribute.')) + '</p>' +
			this.refaat() +
		'</div></section>';
		document.querySelector('.lb-bar').onclick = function (ev) {
			var b = ev.target.closest('[data-k]');
			if (!b) return;
			self.kind = b.getAttribute('data-k');
			document.querySelectorAll('.lb-bar [data-k]').forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
			self.list();
		};
		this.list();
		App.focusHash();
	},

	/* «مكتبة رفعت إسماعيل» (#refaat): what his heroes read, watch and hum inside the stories — Refaat above all, and Alaa and Abeer —
	   each with how they use it and the issues it is in (AKT.refaatLibrary, data-pages.js) */
	WHO: { refaat: { ar: 'رفعت إسماعيل', en: 'Refaat Ismail' }, alaa: { ar: 'علاء عبد العظيم', en: 'Alaa Abdel Azim' }, abeer: { ar: 'عبير عبد الرحمن', en: 'Abeer Abdel Rahman' } },
	refaat: function () {
		var App = window.App, S = window.WorksShared, e = App.esc, t = App.t, L = App.L, self = this, list = App.data().refaatLibrary || [];
		if (!list.length) return '';
		var KIND = { book: L('كتاب', 'Book'), author: L('كاتب', 'Writer'), film: L('فيلم', 'Film'), music: L('موسيقى', 'Music'), poem: L('شعر', 'Poetry') };
		var COL = { book: '#6b1d10', author: '#7a4e1d', film: '#3b3357', music: '#1f4a44', poem: '#5a2a3a' };
		var whos = Object.keys(this.WHO).filter(function (w) { return list.some(function (x) { return x.who === w; }); }).concat(list.some(function (x) { return !self.WHO[x.who]; }) ? ['other'] : []);
		return '<section class="lb-rf" id="refaat"><h2 class="lb-h">' + e(L('مكتبة رفعت إسماعيل', 'Refaat Ismail’s library')) + ' <small>' + e(App.num(list.length)) + '</small></h2>' +
			'<p class="lb-sum">' + e(L('وفي حكاياته مكتبة أخرى: ما يقرؤه أبطاله ويستشهدون به ويحبونه داخل القصص، من بو ولافكرافت إلى الأفلام القديمة والأغاني، والأعداد التي تجده فيها.', 'And in his tales there is another library: what his heroes read, quote and love inside the stories, from Poe and Lovecraft to old films and songs, and the issues you find it in.')) + ' ' +
				e(L('أما عبير فتدخل الكتب نفسها: هي في ', 'Abeer goes into the books themselves: they are in ')) + '<a href="worlds.html">' + e(L('«عوالم فانتازيا»', 'Fantasia’s worlds')) + '</a>.</p>' +
			whos.map(function (w) {
				var items = list.filter(function (x) { return w === 'other' ? !self.WHO[x.who] : x.who === w; });
				return '<h3 class="lb-rf-who">' + e(w === 'other' ? L('وغيرهم', 'And others') : t(self.WHO[w])) + '</h3><div class="lb-grid">' + items.map(function (x) {
					var covers = (x.issues || []).map(function (n) {
						var k = x.series + '-' + n, r = S && S.resolveBook(k);
						return r && r.series ? '<a href="' + e('book.html?id=' + k) + '" title="' + e(t(r.series.s.title) + ' ' + App.num(r.item.n) + ' · ' + t(r.item.title)) + '">' + e(App.num(n)) + '</a>' : '';
					}).filter(Boolean);
					var mini = S ? S.miniCover({ color: COL[x.kind] || '#3a1414', title: t(x.title), by: x.by ? t(x.by) : ' ' }) : '';
					return '<article class="lb-item lb-' + e(x.kind) + '"><h3>' + e(t(x.title)) + '</h3>' +
						'<div class="lb-meta">' + mini + '<div><p class="lb-by">' + e(KIND[x.kind] || '') + (x.by ? ' · ' + e(t(x.by)) : '') + '</p>' +
						(covers.length ? '<p class="lb-from lb-rf-is">' + e(L('في العدد ', 'In issue ')) + covers.join(L('، ', ', ')) + '</p>' : '') + '</div></div>' +
						'<p class="lb-said">' + e(t(x.said)) + '</p>' +
						(x.src || []).map(function (u, i) { return '<a class="lb-src" href="' + e(u) + '" target="_blank" rel="noopener">' + e(L('المصدر', 'Source') + ((x.src || []).length > 1 ? ' ' + App.num(i + 1) : '') + ' ↗') + '</a>'; }).join(' ') + '</article>';
				}).join('') + '</div>';
			}).join('') + '</section>';
	},

	list: function () {
		var App = window.App, e = App.esc, t = App.t, L = App.L, self = this;
		var all = App.data().library || [], art = this.art || {};
		/* (drawn again once the art has come) */
		if (!this.art) this.artReady().then(function () { self.list(); });
		document.querySelector('.lb-list').innerHTML = this.KINDS.filter(function (k) { return self.kind === 'all' || self.kind === k[0]; }).map(function (k) {
			var items = all.filter(function (x) { return x.kind === k[0]; });
			if (!items.length) return '';
			return '<h2 class="lb-h">' + e(t(k[1])) + '</h2><div class="lb-grid">' + items.map(function (x) {
				var href = x.post ? 'blog.html?post=' + encodeURIComponent(x.post) : x.source;
				var pic = art[x.title.en], from = x.from && window.WorksShared ? window.WorksShared.bookHref(x.from) : '';
				/* under the title a small cover, as the site's small books (its art, else drawn with its title), with who and when beside it */
				var mini = window.WorksShared ? window.WorksShared.miniCover({ img: pic && pic.src, color: self.COLOR[x.kind], title: t(x.title), by: x.by ? t(x.by) : ' ' }) : '';
				return '<article class="lb-item lb-' + e(x.kind) + '"><h3>' + e(t(x.title)) + '</h3>' +
					'<div class="lb-meta">' + mini + '<div>' +
					(x.by || x.year ? '<p class="lb-by">' + (x.by ? e(t(x.by)) : '') + (x.by && x.year ? ' · ' : '') + (x.year ? e(App.num(x.year)) : '') + '</p>' : '') +
					(from ? '<p class="lb-from"><a href="' + e(from) + '">' + e(L('من «نشوات قديمة»', 'From Old Delights')) + '</a></p>' : '') + '</div></div>' +
					'<p class="lb-said">' + e(t(x.said)) + '</p>' +
					'<a class="lb-src" href="' + e(href) + '"' + (x.post ? '' : ' target="_blank" rel="noopener"') + '>' + e(x.post ? L('في مقاله ←', 'In his article →') : L('المصدر ↗', 'Source ↗')) + '</a></article>';
			}).join('') + '</div>';
		}).join('');
	}
};

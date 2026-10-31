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

	/* the band: a shelf of spines, each a book he loved, its title along it */
	band: function (d, A) {
		var e = A.esc, t = A.t, list = (d.library || []).filter(function (x) { return x.kind === 'book'; }).slice(0, 22);
		var cols = ['#6b1d10', '#2f4a3a', '#3b3357', '#7a4e1d', '#1f3b52', '#5a2a3a', '#4a4a2a'];
		return '<div class="lb-shelf">' + list.map(function (x, i) {
			return '<span style="--c:' + cols[i % cols.length] + ';--h:' + (70 + (i * 37) % 26) + '%;--w:' + (34 + (i * 13) % 18) + 'px"><b>' + e(t(x.title)) + '</b></span>';
		}).join('') + '</div><i class="lb-plank"></i>';
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
		'</div></section>';
		document.querySelector('.lb-bar').onclick = function (ev) {
			var b = ev.target.closest('[data-k]');
			if (!b) return;
			self.kind = b.getAttribute('data-k');
			document.querySelectorAll('.lb-bar [data-k]').forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
			self.list();
		};
		this.list();
	},

	list: function () {
		var App = window.App, e = App.esc, t = App.t, L = App.L, self = this;
		var all = App.data().library || [];
		document.querySelector('.lb-list').innerHTML = this.KINDS.filter(function (k) { return self.kind === 'all' || self.kind === k[0]; }).map(function (k) {
			var items = all.filter(function (x) { return x.kind === k[0]; });
			if (!items.length) return '';
			return '<h2 class="lb-h">' + e(t(k[1])) + '</h2><div class="lb-grid">' + items.map(function (x) {
				var href = x.post ? 'blog.html?post=' + encodeURIComponent(x.post) : x.source;
				return '<article class="lb-item lb-' + e(x.kind) + '"><h3>' + e(t(x.title)) + '</h3>' +
					(x.by || x.year ? '<p class="lb-by">' + (x.by ? e(t(x.by)) : '') + (x.by && x.year ? ' · ' : '') + (x.year ? e(App.num(x.year)) : '') + '</p>' : '') +
					'<p class="lb-said">' + e(t(x.said)) + '</p>' +
					'<a class="lb-src" href="' + e(href) + '"' + (x.post ? '' : ' target="_blank" rel="noopener"') + '>' + e(x.post ? L('في مقاله ←', 'In his article →') : L('المصدر ↗', 'Source ↗')) + '</a></article>';
			}).join('') + '</div>';
		}).join('');
	}
};

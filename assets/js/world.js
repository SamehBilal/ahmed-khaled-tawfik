/* world.html — «حول العالم»: his books in other languages, from the editions the site records (AKT.bookInfo[...].editions with
   a lang other than Arabic). A shelf a language — its name in its own script, the books, each edition's cover, title as
   printed, translator, publisher and year — linked to the book's page. */
window.PAGE = {
	id: 'world',
	title: { ar: 'حول العالم', en: 'Around the world' },
	strings: {
		eyebrow: { ar: 'مترجمًا', en: 'In translation' },
		title: { ar: 'حول العالم', en: 'Around the world' },
		lead: {
			ar: 'كتبه بلغات أخرى: «يوتوبيا» بالإنجليزية والفرنسية والألمانية والإيطالية والفنلندية، ومقالاته وقصصه بالفارسية والمالايالامية — كل طبعة بغلافها ومترجمها وناشرها.',
			en: 'His books in other languages: Utopia in English, French, German, Italian and Finnish, his essays and stories in Persian and Malayalam — each edition with its cover, translator and publisher.'
		}
	},
	LANGS: {
		en: { ar: 'الإنجليزية', en: 'English', own: 'English' }, fr: { ar: 'الفرنسية', en: 'French', own: 'Français' },
		de: { ar: 'الألمانية', en: 'German', own: 'Deutsch' }, it: { ar: 'الإيطالية', en: 'Italian', own: 'Italiano' },
		fi: { ar: 'الفنلندية', en: 'Finnish', own: 'Suomi' }, fa: { ar: 'الفارسية', en: 'Persian', own: 'فارسی' },
		ml: { ar: 'المالايالامية', en: 'Malayalam', own: 'മലയാളം' }
	},

	/* every foreign edition: { lang, id, w (the book), ed } */
	editions: function () {
		var d = window.App.data(), out = [];
		Object.keys(d.bookInfo || {}).forEach(function (id) {
			var w = window.App.findWork(id);
			if (!w) return;
			(d.bookInfo[id].editions || []).forEach(function (ed) { if (ed.lang && ed.lang !== 'ar') out.push({ lang: ed.lang, id: id, w: w, ed: ed }); });
		});
		return out;
	},

	/* the band: «Utopia» in every script it was printed in, drifting */
	band: function (d, A) {
		var words = ['يوتوبيا', 'Utopia', 'Utopia: Roman aus Ägypten', 'Utopia', 'Utopia', 'عقل بی‌بدن', 'ESP', 'Rahasyamuri 207', 'چای با نعناع', 'قلقلک', 'Utopia', 'خنده های غم انگیز'];
		return '<i class="wd-globe"></i>' + words.map(function (w, i) {
			return '<span class="wd-word" style="--y:' + (8 + (i * 37) % 80) + '%;--s:' + (16 + (i * 7) % 22) + 'px;--d:' + (-i * 2.3).toFixed(1) + 's;--t:' + (26 + (i * 5) % 18) + 's">' + A.esc(w) + '</span>';
		}).join('');
	},

	render: function () {
		var App = window.App, S = window.WorksShared, e = App.esc, t = App.t, L = App.L, self = this;
		var all = this.editions(), by = {};
		all.forEach(function (x) { (by[x.lang] = by[x.lang] || []).push(x); });
		var langs = Object.keys(by).sort(function (a, b) { return by[b].length - by[a].length; });
		var books = {}; all.forEach(function (x) { books[x.id] = 1; });
		var name = function (k) { var l = self.LANGS[k] || { ar: k, en: k, own: k }; return L(l.ar, l.en); };
		document.getElementById('content').innerHTML = '<section class="section wd"><div class="wrap">' +
			'<div class="wd-sum">' +
				'<div><b>' + e(App.num(langs.length)) + '</b><span>' + e(L('لغات', 'languages')) + '</span></div>' +
				'<div><b>' + e(App.num(Object.keys(books).length)) + '</b><span>' + e(L('كتب مترجمة', 'books translated')) + '</span></div>' +
				'<div><b>' + e(App.num(all.length)) + '</b><span>' + e(L('طبعة', 'editions')) + '</span></div>' +
			'</div>' +
			'<nav class="wd-langs chips">' + langs.map(function (k) {
				return '<a class="chip" href="#wd-' + k + '">' + e(name(k)) + ' <b>' + e(App.num(by[k].length)) + '</b></a>';
			}).join('') + '</nav>' +
			langs.map(function (k) {
				var l = self.LANGS[k] || {};
				return '<section class="wd-lang" id="wd-' + k + '"><h2>' + e(name(k)) + ' <span lang="' + k + '">' + e(l.own || '') + '</span></h2><div class="wd-row">' +
					by[k].slice().sort(function (a, b) { return (a.ed.year || 9999) - (b.ed.year || 9999); }).map(function (x) {
						var ed = x.ed, cover = S.coverOf(ed);
						return '<article class="wd-ed">' +
							'<a class="wd-cover" href="' + e(S.bookHref(x.id)) + '">' + (cover ? '<img src="' + e(cover) + '" alt="" loading="lazy">' : '<i></i>') + '</a>' +
							'<div><h3 lang="' + k + '" dir="auto">' + e(t(ed.title) || t(x.w.title)) + '</h3>' +
							'<p class="wd-of">' + e(L('ترجمة «', 'A translation of ')) + '<a href="' + e(S.bookHref(x.id)) + '">' + e(t(x.w.title)) + '</a>' + e(L('»', '')) + '</p>' +
							(ed.translator ? '<p>' + e(L('ترجمة: ', 'Translated by ')) + e(t(ed.translator)) + '</p>' : '') +
							'<p class="wd-pub">' + e(t(ed.publisher)) + (ed.year ? ' · ' + e(App.num(ed.year)) : '') + '</p>' +
							(ed.source ? '<a class="wd-src" href="' + e(ed.source) + '" target="_blank" rel="noopener">' + e(L('المصدر ↗', 'Source ↗')) + '</a>' : '') +
							'</div></article>';
					}).join('') + '</div></section>';
			}).join('') +
			'<p class="wd-note">' + e(L('هذه الطبعات التي عرفها الموقع؛ إن كانت لديك طبعة مترجمة غيرها فاقترح إضافتها من صفحة «تواصل».', 'These are the editions the site knows of; if you know another translation, suggest it from the Contact page.')) + '</p>' +
		'</div></section>';
	}
};

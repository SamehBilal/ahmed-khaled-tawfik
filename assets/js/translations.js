/* translations.html — «ترجماته»: what he put into Arabic. The books he translated (AKT.works of type translation), then the
   two pocket lines he translated for: «روايات عالمية للجيب» (#7–83, each issue with the novel and author it came from — the
   authors as chips that filter the covers) and «رجفة الخوف». Covers and links as on the series pages. */
window.PAGE = {
	id: 'translations',
	title: { ar: 'ترجماته', en: 'His translations' },
	strings: {
		eyebrow: { ar: 'المترجم', en: 'The translator' },
		title: { ar: 'ترجماته', en: 'His translations' },
		lead: {
			ar: 'ما نقله إلى العربية: «نادي القتال» و«كتاب المقبرة» وغيرهما، وعشرات الروايات العالمية في كتاب الجيب — من ويلز وكونان دويل إلى ستيفن كينج وجون جريشام.',
			en: 'What he brought into Arabic: Fight Club, The Graveyard Book and more, and dozens of world novels in pocket form — from Wells and Conan Doyle to Stephen King and John Grisham.'
		}
	},
	/* the books' own authors, from their synopses (AKT.works) */
	BY: {
		fightclub: { ar: 'تشاك بولانيك', en: 'Chuck Palahniuk' }, dermaphoria: { ar: 'كريج كليفنجر', en: 'Craig Clevenger' },
		kiterunner: { ar: 'خالد حسيني', en: 'Khaled Hosseini' }, che: { ar: 'سبين رودريجيز', en: 'Spain Rodriguez' },
		graveyard: { ar: 'نيل جايمان', en: 'Neil Gaiman' }, 'nashawat-qadima': { ar: 'أغانٍ أحبها', en: 'Songs he loved' }
	},
	filter: '',

	/* an issue's original: { title, author } in the language shown, from «X» — Author (a pen name keeps the name in brackets) */
	orig: function (is, lang) {
		var o = ((is.original || {})[lang] || '').split(' — ');
		if (o.length < 2) return null;
		var a = o.slice(1).join(' — ').trim(), m = a.match(/\(([^)]+)\)\s*$/);
		return { title: o[0].replace(/^على الأرجح\s*|^Likely\s*/, '').replace(/[«»]/g, '').trim(), author: m ? m[1].trim() : a };
	},

	/* the band: the novels' own titles drifting one way, his Arabic titles the other */
	band: function (d, A) {
		var P = window.PAGE, S = window.WorksShared, is = S.seriesIssues('rwg'), e = A.esc;
		var en = is.map(function (x) { var o = P.orig(x, 'en'); return o && o.title; }).filter(Boolean).slice(0, 26);
		var ar = is.map(function (x) { return x.title && x.title.ar; }).filter(Boolean).slice(0, 26);
		var row = function (list, k, dir) {
			var s = list.map(function (w) { return '<span>' + e(w) + '</span>'; }).join('<i>✦</i>');
			return '<div class="tr-row tr-r' + k + '" dir="' + dir + '"><div class="tr-track">' + s + '<i>✦</i>' + s + '<i>✦</i></div></div>';
		};
		return row(en, 'en', 'ltr') + '<i class="tr-quill" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M21 3C14 4 9 8 6.5 14L5 19l1.2.8 3-3.6C14 15 19 10 21 3z" fill="currentColor"/><path d="M6.2 19.8 9 15" stroke="#1a130d" stroke-width=".9"/></svg></i>' + row(ar, 'ar', 'rtl');
	},

	render: function () {
		var App = window.App, S = window.WorksShared, d = App.data(), e = App.esc, t = App.t, L = App.L, self = this, lang = App.lang;
		var books = (d.works || []).filter(function (w) { return w.type === 'translation'; }).sort(function (a, b) { return a.year - b.year; });
		var rwg = S.seriesIssues('rwg'), shv = S.seriesIssues('shivers');
		var rs = (S.anySeries('rwg') || {}).s || {}, ss = (S.anySeries('shivers') || {}).s || {};
		/* the authors he translated in «روايات عالمية للجيب», most first */
		var au = {}, akey = function (is) { var o = self.orig(is, 'ar'); return o ? o.author : ''; };
		rwg.forEach(function (is) { var k = akey(is); if (k) (au[k] = au[k] || { n: 0, en: (self.orig(is, 'en') || {}).author || k }).n++; });
		var authors = Object.keys(au).sort(function (a, b) { return au[b].n - au[a].n || a.localeCompare(b, 'ar'); });
		var all = {}; authors.forEach(function (k) { all[k] = 1; });
		shv.forEach(function (is) { var o = self.orig(is, 'ar'); if (o) all[o.author] = 1; });
		books.forEach(function (w) { if (self.BY[w.id] && w.id !== 'nashawat-qadima') all[self.BY[w.id].ar] = 1; });

		var grid = function (sid, ser, list) {
			var digits = String(Math.max.apply(null, list.map(function (is) { return is.n || 0; }))).length;
			return '<div class="cover-grid is-ranked tr-grid" data-digits="' + digits + '" style="--c:' + e(ser.color || '#7a4e1d') + ';--d:' + digits + '">' + list.map(function (is) {
				var o = self.orig(is, lang);
				return '<a class="cover-link" href="' + App.issueHref(sid, is) + '" data-a="' + e(akey(is)) + '" title="' + e(t(is.title)) + '">' +
					'<span class="cl-cover">' + S.miniCover({ img: S.issueCover(sid, is), color: ser.color, title: t(is.title), sub: is.original ? t(is.original) : '' }) +
						(is.n != null ? '<b class="cl-n">' + e(App.num(is.n)) + '</b>' : '') + '</span>' +
					'<span class="cl-t">' + e(t(is.title)) + '</span>' +
					(o ? '<span class="tr-of"><span dir="auto">' + e(o.title) + '</span> · ' + e(o.author) + '</span>' : '') +
				'</a>';
			}).join('') + '</div>';
		};

		document.getElementById('content').innerHTML = '<section class="section tr"><div class="wrap">' +
			'<div class="wd-sum">' +
				'<div><b>' + e(App.num(books.length + rwg.length + shv.length)) + '</b><span>' + e(L('عملًا ترجمه', 'works translated')) + '</span></div>' +
				'<div><b>' + e(App.num(Object.keys(all).length)) + '</b><span>' + e(L('كاتبًا نقلهم إلى العربية', 'authors he brought into Arabic')) + '</span></div>' +
				'<div><b>' + e(App.num(rwg.length)) + '</b><span>' + e(L('عددًا من «روايات عالمية»', 'World Pocket Novels')) + '</span></div>' +
			'</div>' +
			'<nav class="chips tr-jump"><a class="chip" href="#tr-books">' + e(L('كتب ترجمها', 'Books')) + '</a><a class="chip" href="#tr-rwg">' + e(t(rs.title || {})) + '</a>' +
				(shv.length ? '<a class="chip" href="#tr-shivers">' + e(t(ss.title || {})) + '</a>' : '') + '</nav>' +

			/* the books */
			'<section class="tr-part" id="tr-books"><h2>' + e(L('كتب ترجمها', 'Books he translated')) + '</h2><div class="wd-row">' + books.map(function (w) {
				var cover = S.coverOf((d.bookInfo || {})[w.id]), by = self.BY[w.id];
				return '<article class="wd-ed">' +
					'<a class="wd-cover" href="' + e(S.bookHref(w.id)) + '">' + (cover ? '<img src="' + e(cover) + '" alt="" loading="lazy">' : '<i></i>') + '</a>' +
					'<div><h3><a href="' + e(S.bookHref(w.id)) + '">' + e(t(w.title)) + '</a></h3>' +
					(lang === 'ar' && w.title.en ? '<p class="tr-en" dir="ltr">' + e(w.title.en) + '</p>' : '') +
					(by ? '<p>' + e(L('عن ', 'From ')) + e(t(by)) + '</p>' : '') +
					'<p class="wd-pub">' + e(t(w.publisher)) + ' · ' + e(App.num(w.year)) + '</p>' +
					'<p class="tr-syn">' + e(t(w.synopsis)) + '</p></div></article>';
			}).join('') + '</div></section>' +

			/* روايات عالمية للجيب */
			'<section class="tr-part" id="tr-rwg"><h2><a href="' + e(S.seriesHref('rwg')) + '">' + e(t(rs.title || {})) + '</a></h2>' +
				(rs.description ? '<p class="tr-about">' + e(t(rs.description)) + '</p>' : '') +
				'<div class="chips tr-authors" role="group" aria-label="' + e(L('حسب الكاتب', 'By author')) + '">' +
					'<button type="button" class="chip is-on" data-a="" aria-pressed="true">' + e(L('الكل', 'All')) + ' <b>' + e(App.num(rwg.length)) + '</b></button>' +
					authors.filter(function (k) { return au[k].n > 1; }).map(function (k) {
						return '<button type="button" class="chip" data-a="' + e(k) + '" aria-pressed="false">' + e(lang === 'ar' ? k : au[k].en) + ' <b>' + e(App.num(au[k].n)) + '</b></button>';
					}).join('') + '</div>' +
				grid('rwg', rs, rwg) + '</section>' +

			/* رجفة الخوف */
			(shv.length ? '<section class="tr-part" id="tr-shivers"><h2><a href="' + e(S.seriesHref('shivers')) + '">' + e(t(ss.title || {})) + '</a></h2>' +
				(ss.synopsis ? '<p class="tr-about">' + e(t(ss.synopsis)) + '</p>' : '') + grid('shivers', ss, shv) + '</section>' : '') +

			'<p class="wd-note">' + e(L('هذه الترجمات التي عرفها الموقع؛ إن كانت لديك ترجمة له غيرها فاقترح إضافتها من صفحة «تواصل».', 'These are the translations the site knows of; if you know another, suggest it from the Contact page.')) + '</p>' +
		'</div></section>';

		/* an author chip shows only that author's novels */
		var box = document.querySelector('.tr-authors');
		if (box) box.addEventListener('click', function (ev) {
			var b = ev.target.closest('button[data-a]');
			if (!b) return;
			var a = b.getAttribute('data-a');
			box.querySelectorAll('button').forEach(function (x) { var on = x === b; x.classList.toggle('is-on', on); x.setAttribute('aria-pressed', on ? 'true' : 'false'); });
			document.querySelectorAll('#tr-rwg .cover-link').forEach(function (c) { c.hidden = !!a && c.getAttribute('data-a') !== a; });
		});
	}
};

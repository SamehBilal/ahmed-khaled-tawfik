/* series.html?id=<series id> — one page per series: his own, or one by others he contributed to */
window.PAGE = {
	id: 'works',
	title: { ar: 'سلسلة', en: 'Series' },

	render: function () {
		var App = window.App, d = App.data(), S = window.WorksShared;
		var e = App.esc, t = App.t, tx = App.tx, L = App.L;
		var id = new URLSearchParams(location.search).get('id') || '';
		var ser = S.anySeries(id);
		var root = document.getElementById('content');

		if (!ser) {
			root.innerHTML = '<section class="page-hero"><div class="wrap"><p class="eyebrow">404</p><h1>' + L('لم نجد هذه السلسلة', 'Series not found') + '</h1>' +
				'<p class="lead"><a href="works.html">' + L('عودة إلى كل الأعمال', 'Back to all works') + '</a></p></div></section>';
			return;
		}

		var s = ser.s, info = ser.info || {}, other = ser.other;
		this.title = s.title;
		App.applyLang();

		var issues = S.seriesIssues(id);
		var desc = info.description || s.description || s.synopsis;
		var hero = s.hero ? App.byId(d.characters, s.hero) : null;
		var chars = (d.characters || []).filter(function (c) { return c.work === id; });
		var adapts = (d.adaptations || []).filter(function (a) { return a.basedOn === id; });

		/* 3D book: own series reuse the works-page book; others get a simple one */
		var bookOpts = ser.own ? S.seriesBook(s) : {
			color: s.color || '#4b3b2a', title: s.title, motif: S.monogram(s.title),
			back: tx(s.description || ''), meta: s.years || '',
			pages: ['<h4>' + tx(s.title) + '</h4>' + App.paras(s.description)],
			info: { title: '', text: '' }
		};
		bookOpts.id = '';
		bookOpts.info = { title: '', text: '' };

		var facts = [
			[L('السنوات', 'Years'), App.num(s.years || '')],
			[L('عدد الأعداد', 'Issues'), App.num(s.count || (issues.length || ''))],
			[L('الناشر', 'Publisher'), s.publisher ? t(s.publisher) : ''],
			[L('صاحب السلسلة', 'Created by'), ser.own ? L('أحمد خالد توفيق', 'Ahmed Khaled Tawfik') : (s.owner ? t(s.owner) : '')],
			[L('دوره', 'His role'), !ser.own && s.role ? t(s.role) : (other && other.role ? t(other.role) : '')],
			[L('البطل', 'Lead'), hero ? t(hero.name) : ''],
			[L('الشكل', 'Format'), info.format ? t(info.format) : '']
		].filter(function (x) { return x[1]; });

		var issueGrid = issues.map(function (is) {
			return '<a class="cover-link" href="' + App.issueHref(id, is) + '" title="' + e(t(is.title)) + '">' +
				S.miniCover({ color: s.color, title: t(is.title), num: is.n != null ? App.num(is.n) + (is.part ? '/' + App.num(is.part) : '') : '', sub: is.original ? t(is.original) : '' }) +
				'<span class="cl-t">' + (is.n != null ? App.num(is.n) + '. ' : '') + tx(is.title) + '</span>' +
			'</a>';
		}).join('');

		var eds = (info.editions || []).map(function (ed) {
			return '<li><b>' + tx(ed.publisher) + '</b>' + (ed.years ? ' · ' + App.num(ed.years) : '') + (ed.kind ? ' — ' + tx(ed.kind) : '') +
				(ed.note ? '<br><span class="meta">' + tx(ed.note) + '</span>' : '') +
				(ed.source ? ' <a href="' + e(ed.source) + '" target="_blank" rel="noopener">↗</a>' : '') + '</li>';
		}).join('');

		var links = (info.links || []).map(function (l) { return '<a href="' + e(l.url) + '" target="_blank" rel="noopener">' + e(l.label) + ' ↗</a>'; }).join('');
		var sources = (info.sources || []).concat(s.source ? [s.source] : []);

		/* other series list for navigation */
		var all = S.ownSeries().map(function (x) { return { id: x.id, title: x.title, color: x.color, own: true }; })
			.concat(S.contributedSeries().map(function (x) { return { id: x.id, title: x.title, color: x.color, own: false }; }));

		root.innerHTML =
			'<section class="detail"><div class="wrap">' +
				'<nav class="crumbs"><a href="works.html">' + L('الأعمال', 'Works') + '</a> / <span>' + tx(s.title) + '</span></nav>' +
				'<div class="detail-grid">' +
					'<aside class="d-cover"><ul class="bk-list bk-solo" id="d-book">' + window.Books.showcase(bookOpts) + '</ul>' +
						(links ? '<div class="d-links">' + links + '</div>' : '') + '</aside>' +
					'<div class="d-main">' +
						'<p class="eyebrow">' + (ser.own ? L('سلسلة من تأليفه', 'His series') : L('سلسلة شارك فيها', 'A series he contributed to')) + '</p>' +
						'<h1>' + tx(s.title) + '</h1>' +
						'<p class="d-alt">' + e(App.alt(s.title)) + '</p>' +
						(s.tagline ? '<p class="d-by">' + tx(s.tagline) + '</p>' : '') +
						(desc ? '<div class="d-desc">' + App.paras(desc) + '</div>' : '') +
						(info.genres && info.genres.length ? '<div class="d-genres">' + info.genres.map(function (g) { return '<span>' + tx(g) + '</span>'; }).join('') + '</div>' : '') +
						'<dl class="d-facts">' + facts.map(function (x) { return '<dt>' + e(x[0]) + '</dt><dd>' + e(x[1]) + '</dd>'; }).join('') + '</dl>' +
						(info.altTitles && info.altTitles.length ? '<section class="d-block"><h3>' + L('عناوين أخرى', 'Other titles') + '</h3><ul class="alt-titles">' +
							info.altTitles.map(function (a) { return '<li><b>' + e(a.title) + '</b>' + (a.note ? ' — ' + tx(a.note) : '') + '</li>'; }).join('') + '</ul></section>' : '') +
						(info.readingOrder ? '<section class="d-block"><h3>' + L('ترتيب القراءة', 'Reading order') + '</h3>' + App.paras(info.readingOrder) + '</section>' : '') +
						(chars.length ? '<section class="d-block"><h3>' + L('الشخصيات', 'Characters') + '</h3><p class="chips-line">' + chars.map(function (c) { return App.charLink(c.id); }).join('') + '</p></section>' : '') +
						(eds ? '<section class="d-block"><h3>' + L('الطبعات', 'Editions') + '</h3><ul class="ed-list">' + eds + '</ul></section>' : '') +
						(adapts.length ? '<section class="d-block"><h3>' + L('على الشاشة', 'On screen') + '</h3>' + adapts.map(function (a) {
							return '<p><b>' + tx(a.title) + '</b> (' + App.num(a.year || '') + ') — ' + tx(a.text) + '</p>'; }).join('') + '</section>' : '') +
					'</div>' +
				'</div>' +
				(issues.length ? '<section class="d-block d-wide"><div class="d-head"><h3>' + (ser.own ? L('كل الأعداد', 'Every issue') : L('ما كتبه أو ترجمه فيها', 'What he wrote or translated in it')) +
					' <small>(' + App.num(issues.length) + ')</small></h3></div><div class="cover-grid">' + issueGrid + '</div></section>' : '') +
				'<section class="d-block d-wide"><div class="d-head"><h3>' + L('سلاسل أخرى', 'Other series') + '</h3></div><div class="cover-row">' +
					all.filter(function (x) { return x.id !== id; }).map(function (x) {
						return '<a class="cover-link" href="' + S.seriesHref(x.id) + '">' + S.miniCover({ color: x.color, title: t(x.title), sub: x.own ? '' : L('مشاركة', 'Contributor') }) + '</a>';
					}).join('') + '</div></section>' +
				(sources.length ? '<section class="d-block d-sources d-wide"><h3>' + L('المصادر', 'Sources') + '</h3><ul>' +
					sources.map(function (u) { return '<li><a href="' + e(u) + '" target="_blank" rel="noopener">' + e(u.replace(/^https?:\/\/(www\.)?/, '').slice(0, 70)) + '</a></li>'; }).join('') + '</ul></section>' : '') +
				App.fixLink(t(s.title)) +
			'</div></section>';

		window.Books.initShowcase(document.getElementById('d-book'));
	}
};

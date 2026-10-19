/* Data -> book options, shared by the home and works pages. */
(function () {
	'use strict';

	var TYPES = {
		series: { ar: 'سلسلة', en: 'Series' },
		novel: { ar: 'رواية', en: 'Novel' },
		stories: { ar: 'قصص', en: 'Short stories' },
		articles: { ar: 'مقالات', en: 'Essays & articles' },
		translation: { ar: 'ترجمة', en: 'Translation' },
		nonfiction: { ar: 'غير روائي', en: 'Non-fiction' },
		collab: { ar: 'عمل مشترك', en: 'Collaboration' }
	};

	/* first letter of the Arabic title, skipping a leading "ال" */
	function monogram(title) {
		var s = ((title && title.ar) || '').trim().replace(/^ال/, '');
		return s.charAt(0) || '؟';
	}

	/* "Characters: A, B, C" links for a series or work */
	function charXref(workId) {
		var App = window.App;
		var cs = (App.data().characters || []).filter(function (c) { return c.work === workId; });
		if (!cs.length) return '';
		return '<div class="xref">' + App.L('الشخصيات: ', 'Characters: ') +
			cs.map(function (c) { return App.charLink(c.id); }).join(App.L('، ', ', ')) + '</div>';
	}

	function seriesBook(s) {
		var App = window.App, t = App.t, tx = App.tx;
		var L = function (ar, en) { return App.lang === 'ar' ? ar : en; };
		var hero = App.byId(App.data().characters, s.hero);

		var pages = [];
		pages.push('<h4>' + tx(s.title) + '</h4>' + App.paras(s.synopsis));
		var facts = '<dl>' +
			(s.years ? '<dt>' + L('السنوات', 'Years') + '</dt><dd>' + App.esc(App.num(s.years)) + '</dd>' : '') +
			(s.count ? '<dt>' + L('الأعداد', 'Issues') + '</dt><dd>' + App.num(s.count) + '</dd>' : '') +
			(s.publisher ? '<dt>' + L('الناشر', 'Publisher') + '</dt><dd>' + tx(s.publisher) + '</dd>' : '') +
			(hero ? '<dt>' + L('البطل', 'Lead') + '</dt><dd>' + tx(hero.name) + '</dd>' : '') +
			(s.firstIssue ? '<dt>' + L('أول عدد', 'First') + '</dt><dd>' + tx(s.firstIssue) + '</dd>' : '') +
			(s.lastIssue ? '<dt>' + L('آخر عدد', 'Last') + '</dt><dd>' + tx(s.lastIssue) + '</dd>' : '') +
			'</dl>';
		pages.push('<h4>' + L('بطاقة السلسلة', 'At a glance') + '</h4>' + facts);
		if (s.notable && s.notable.length) {
			pages.push('<h4>' + L('أعداد بارزة', 'Notable issues') + '</h4><ol>' +
				s.notable.map(function (n) { return '<li>' + tx(n) + '</li>'; }).join('') + '</ol>');
		}

		return {
			id: 's-' + s.id,
			color: s.color, title: s.title,
			num: s.count ? '№ ' + s.count : '',
			motif: monogram(s.title),
			back: tx(s.tagline || s.synopsis),
			meta: s.years || '',
			pages: pages,
			info: {
				title: t(s.title), sub: App.alt(s.title), text: t(s.tagline),
				extra: charXref(s.id) + App.fixLink(t(s.title)),
				facts: [
					[L('السنوات', 'Years'), App.num(s.years || '')],
					[L('الأعداد', 'Issues'), s.count ? App.num(s.count) : ''],
					[L('البطل', 'Lead'), hero ? t(hero.name) : '']
				]
			}
		};
	}

	window.WorksShared = { TYPES: TYPES, seriesBook: seriesBook, monogram: monogram, charXref: charXref };
})();

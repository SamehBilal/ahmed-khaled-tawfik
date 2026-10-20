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

		/* the cover: the first issue's, else a collected volume's */
		var first = seriesIssues(s.id)[0];
		var vol = ((App.data().seriesCovers || {})[s.id] || []).filter(function (c) { return /cdn.(abjjad|aseeralkotb)|covers\/books\/(abjjad|aseeralkotb)-/.test(c.cover); })[0];
		return {
			id: 's-' + s.id,
			img: (first && issueCover(s.id, first)) || (vol && vol.cover) || '',
			color: s.color, title: s.title,
			num: s.count ? '№ ' + s.count : '',
			motif: monogram(s.title),
			back: tx(s.tagline || s.synopsis),
			meta: s.years || '',
			pages: pages,
			info: {
				title: t(s.title), sub: App.alt(s.title), text: t(s.tagline),
				extra: charXref(s.id) + '<a class="more-link" href="series.html?id=' + s.id + '">' + L('صفحة السلسلة وكل أعدادها ←', 'Series page & every issue →') + '</a> ' + App.fixLink(t(s.title)),
				facts: [
					[L('السنوات', 'Years'), App.num(s.years || '')],
					[L('الأعداد', 'Issues'), s.count ? App.num(s.count) : ''],
					[L('البطل', 'Lead'), hero ? t(hero.name) : '']
				]
			}
		};
	}

	/* ---------- catalogue: ids, lookups and mini covers for the detail pages ---------- */

	/* own series, or a series by others that he contributed to */
	function anySeries(id) {
		var d = window.App.data();
		var s = window.App.byId(d.series, id);
		var o0 = window.App.byId(d.otherSeries, id);
		/* a line like روايات عالمية للجيب appears in both lists: it isn't his own series, so the contributor record wins */
		if (s && (o0 || s.contributor)) return { own: false, s: Object.assign({}, s, o0 || {}), info: (d.seriesInfo || {})[id] || {}, other: o0 };
		if (s) return { own: true, s: s, info: (d.seriesInfo || {})[id] || {}, other: null };
		var o = window.App.byId(d.otherSeries, id);
		return o ? { own: false, s: o, info: {}, other: o } : null;
	}

	/* issues of a series: own series from data-issues, others from otherSeries[].issues */
	function seriesIssues(id) {
		var d = window.App.data();
		var list = ((d.issues || {})[id] || []).slice();
		if (!list.length) {
			var o = window.App.byId(d.otherSeries, id);
			list = ((o && o.issues) || []).map(function (is, i) { return Object.assign({ _idx: i }, is); });
		}
		return list.sort(function (a, b) { return (a.n || 9999) - (b.n || 9999) || (a.part || 0) - (b.part || 0) || (a._idx || 0) - (b._idx || 0); });
	}

	/* الأعداد الخاصة of a series, flagged so links go to <series>-s<n> */
	function specialIssues(id) {
		var list = ((window.App.data().specials || {})[id] || []);
		return list.map(function (is) { return Object.assign({ _special: true }, is); });
	}

	function issueKey(sid, is) {
		return sid + '-' + (is.n != null ? is.n : 'x' + (is._idx || 0)) + (is.part ? '-' + is.part : '');
	}

	/* book.html?id=… → a standalone work, or an issue of a series */
	function resolveBook(id) {
		var App = window.App, d = App.data();
		var w = App.byId(d.works, id);
		if (w) return { kind: 'work', id: id, item: w, info: (d.bookInfo || {})[id] || {} };
		/* special issues: <series>-s<n> */
		var sp = /^([a-z]+)-s(\d+)$/.exec(id || '');
		/* the special issues now live in their own series, «الأعداد الخاصة» */
		if (sp && anySeries('specials')) { var r0 = resolveBook('specials-' + sp[2]); if (r0) r0.special = true; return r0; }
		if (sp) {
			var sser = anySeries(sp[1]);
			var slist = specialIssues(sp[1]);
			for (var k = 0; k < slist.length; k++) if (+slist[k].n === +sp[2]) return { kind: 'issue', special: true, id: id, item: slist[k], series: sser, index: k, list: slist, info: ((d.issueInfo || {})[id]) || {} };
			return null;
		}
		var m = /^([a-z0-9]+)-(x?\d+)(?:-(\d))?$/.exec(id || '');
		if (!m) return null;
		var ser = anySeries(m[1]);
		if (!ser) return null;
		var list = seriesIssues(m[1]);
		for (var i = 0; i < list.length; i++) {
			if (issueKey(m[1], list[i]) === id) {
				return { kind: 'issue', id: id, item: list[i], series: ser, index: i, list: list, info: ((d.issueInfo || {})[id]) || {} };
			}
		}
		return null;
	}

	/* the first known cover of an issue (from data-more.js: store listings, Wikimedia) */
	function issueCover(sid, is) {
		var key = is._special ? 'specials-' + is.n : issueKey(sid, is);
		return coverOf(((window.App.data().issueInfo) || {})[key]);
	}

	function bookHref(id) { return 'book.html?id=' + encodeURIComponent(id); }
	function seriesHref(id) { return 'series.html?id=' + encodeURIComponent(id); }

	/* small flat cover: a real image when we have one, otherwise a drawn cover */
	function miniCover(o) {
		var App = window.App, e = App.esc;
		return '<span class="mini-cover' + (o.img ? ' has-img' : '') + '" style="--c:' + e(o.color || '#3a1414') + '">' +
			(o.img ? '<img src="' + e(o.img) + '" alt="" loading="lazy" onerror="this.parentNode.classList.remove(\'has-img\');this.remove()">' : '') +
			(o.num ? '<span class="mc-num">' + e(o.num) + '</span>' : '') +
			'<span class="mc-t">' + e(o.title || '') + '</span>' +
			(o.sub ? '<span class="mc-s">' + e(o.sub) + '</span>' : '') +
			'<span class="mc-by">' + e(o.by || 'أحمد خالد توفيق') + '</span>' +
		'</span>';
	}

	/* first edition cover we know about */
	function coverOf(info) {
		if (info && info.ownCover) return info.ownCover;
		var eds = (info && info.editions) || [];
		for (var i = 0; i < eds.length; i++) if (eds[i].cover) return eds[i].cover;
		return info && info.cover || '';
	}

	function ownSeries() {
		var d = window.App.data();
		return (d.series || []).filter(function (s) { return !s.contributor && !window.App.byId(d.otherSeries, s.id); });
	}
	function contributedSeries() {
		var d = window.App.data();
		var list = (d.otherSeries || []).slice();
		(d.series || []).forEach(function (s) { if (s.contributor && !window.App.byId(list, s.id)) list.push(s); });
		return list;
	}

	window.WorksShared = {
		ownSeries: ownSeries, contributedSeries: contributedSeries,
		TYPES: TYPES, seriesBook: seriesBook, monogram: monogram, charXref: charXref,
		anySeries: anySeries, seriesIssues: seriesIssues, specialIssues: specialIssues, issueKey: issueKey, resolveBook: resolveBook, issueCover: issueCover,
		bookHref: bookHref, seriesHref: seriesHref, miniCover: miniCover, coverOf: coverOf
	};
})();

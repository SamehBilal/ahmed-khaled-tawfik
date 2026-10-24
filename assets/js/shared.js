/* Data -> book options, shared by the home and works pages. */
(function () {
	'use strict';

	var TYPES = {
		series: { ar: 'سلسلة', en: 'Series' },
		novel: { ar: 'رواية', en: 'Novel' },
		stories: { ar: 'قصص', en: 'Short stories' },
		articles: { ar: 'مقالات', en: 'Essays & articles' },
		poetry: { ar: 'شعر', en: 'Poetry' },
		translation: { ar: 'ترجمة', en: 'Translation' },
		nonfiction: { ar: 'غير روائي', en: 'Non-fiction' },
		collab: { ar: 'عمل مشترك', en: 'Collaboration' },
		about: { ar: 'كتاب عنه', en: 'A book about him' }
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
		return o ? { own: false, inspired: !!o.inspired, s: o, info: (d.seriesInfo || {})[id] || {}, other: o } : null;
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
		/* books other writers wrote about him (tributes page) */
		var ab = App.byId(d.aboutBooks, id);
		if (ab) return { kind: 'work', about: true, id: id, item: Object.assign({ type: 'about' }, ab), info: Object.assign({ cover: ab.cover }, (d.bookInfo || {})[id] || {}) };
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

	/* a series' cover: the cover of its first book that has one, else the series' own cover */
	function seriesCover(id) {
		var list = seriesIssues(id);
		for (var i = 0; i < list.length; i++) { var c = issueCover(id, list[i]); if (c) return c; }
		var s = window.App.byId(window.App.data().series, id) || window.App.byId(window.App.data().otherSeries, id);
		return (s && s.cover) || '';
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
	function inspiredSeries() {
		return (window.App.data().otherSeries || []).filter(function (s) { return s.inspired; });
	}
	/* who wrote a series: him, or the author of a series he contributed to or that his work inspired */
	function seriesAuthor(ser) {
		return ser && !ser.own && ser.s.author ? ser.s.author : { ar: 'أحمد خالد توفيق', en: 'Ahmed Khaled Tawfik' };
	}
	/* awards as cards: medal, year, prize, what it was for, source */
	function awardsList(list) {
		var App = window.App, e = App.esc, tx = App.tx, L = App.L;
		var KIND = { win: { ar: 'فوز', en: 'Won' }, finalist: { ar: 'قائمة قصيرة', en: 'Finalist' }, honour: { ar: 'تكريم', en: 'Honour' } };
		return '<ul class="awards">' + list.map(function (a) {
			return '<li class="award rise ' + e(a.kind || 'win') + '">' +
				'<div class="yr">' + App.num(a.year || '') + ' · ' + tx(KIND[a.kind] || KIND.win) + (a.posthumous ? ' · ' + L('بعد الرحيل', 'posthumous') : '') + '</div>' +
				'<h3>' + tx(a.title) + '</h3>' +
				'<p>' + tx(a.text) + '</p>' +
				(a.image ? '<button type="button" class="aw-pic" data-src="' + e(a.image.src) + '" data-alt="' + e(App.t(a.image.alt)) + '" onclick="App.showPic(this.dataset.src, this.dataset.alt)"><img src="' + e(a.image.src) + '" alt="' + e(App.t(a.image.alt)) + '" loading="lazy"></button>' : '') +
				(a.work && App.findWork(a.work) ? '<div class="for">' + L('عن ', 'For ') + App.workLink(a.work) + '</div>' : '') +
				(a.source ? '<a class="src" href="' + e(a.source) + '" target="_blank" rel="noopener">' + L('المصدر ↗', 'Source ↗') + '</a>' : '') +
			'</li>';
		}).join('') + '</ul>';
	}
	function contributedSeries() {
		var d = window.App.data();
		/* series he wrote or translated for; series by others that grew out of his work are listed apart */
		var list = (d.otherSeries || []).filter(function (s) { return !s.inspired; });
		(d.series || []).forEach(function (s) { if (s.contributor && !window.App.byId(list, s.id)) list.push(s); });
		return list;
	}

	/* Aseer Al Kotb is a store, not an edition: its listings leave the editions (so no card and no count anywhere)
	   and become info.aseer {source, cover} for the where-to-buy link. The covers stay: the book keeps the cover
	   it showed before, and when no edition left has one, the first edition takes Aseer's. */
	(function () {
		var A = window.AKT || {};
		[A.bookInfo, A.issueInfo].forEach(function (map) {
			Object.keys(map || {}).forEach(function (k) {
				var info = map[k], all = info && info.editions;
				if (!all || !all.length) return;
				var isA = function (ed) { return ed.store === 'Aseer Al Kotb'; };
				var aseer = all.filter(isA);
				if (!aseer.length) return;
				var shown = coverOf(info);
				info.editions = all.filter(function (ed) { return !isA(ed); });
				info.aseer = {
					source: (aseer.filter(function (ed) { return ed.source; })[0] || {}).source || '',
					cover: (aseer.filter(function (ed) { return ed.cover; })[0] || {}).cover || ''
				};
				if (shown && coverOf(info) !== shown) info.ownCover = shown;
				if (info.aseer.cover && info.editions.length && !info.editions.some(function (ed) { return ed.cover; }))
					info.editions[0] = Object.assign({}, info.editions[0], { cover: info.aseer.cover });
			});
		});
	})();

	/* ---------- publishers (AKT.publishers): each house's name is matched against the publisher of every work and series ---------- */
	function publisherHref(id) { return 'publisher.html?id=' + encodeURIComponent(id); }
	/* a house that only took a book over later («ثم …») is not counted for it */
	function pubMatches(p, name) { return !!name && new RegExp(p.match).test(name.replace(/\(ثم[^)]*\)/g, '')); }
	function yearOf(y) { var m = String(y || '').match(/\d{4}/); return m ? +m[0] : 0; }
	/* every house with what it published first, oldest partnership first:
	   [{ p, list: [{ id, title, href, year, cover, color, series }], from, to, later: [...] }] */
	function publishers() {
		var App = window.App, d = App.data();
		/* the first edition's house stands in for a work whose own publisher is not recorded */
		var house = function (w) {
			var p = w.publisher && w.publisher.ar;
			if (p) return p;
			var eds = ((d.bookInfo || {})[w.id] || {}).editions || [];
			return eds.length && eds[0].publisher ? eds[0].publisher.ar || '' : '';
		};
		var items = (d.works || []).map(function (w) {
			return { id: w.id, title: w.title, href: App.workHref(w.id), year: yearOf(w.year), date: ((d.bookInfo || {})[w.id] || {}).firstPublished || '', pub: house(w), cover: coverOf((d.bookInfo || {})[w.id]), color: w.color };
		}).concat(ownSeries().concat(contributedSeries()).map(function (s) {
			return { id: s.id, title: s.title, href: seriesHref(s.id), year: yearOf(s.years), pub: (s.publisher && s.publisher.ar) || '', cover: seriesCover(s.id), color: s.color, series: true };
		}));
		return (d.publishers || []).map(function (p) {
			var mine = items.filter(function (it) { return pubMatches(p, it.pub); })
				.sort(function (a, b) { return ((a.year || 9999) - (b.year || 9999)) || String(a.date || '').localeCompare(String(b.date || '')); });
			/* later editions of other books of his that this house reissued */
			var later = items.filter(function (it) {
				if (it.series || mine.indexOf(it) >= 0) return false;
				return (((d.bookInfo || {})[it.id] || {}).editions || []).some(function (ed) { return ed.publisher && pubMatches(p, ed.publisher.ar || ''); });
			}).map(function (it) {
				var ys = ((d.bookInfo || {})[it.id].editions || []).filter(function (ed) { return ed.publisher && pubMatches(p, ed.publisher.ar || ''); })
					.map(function (ed) { return yearOf(ed.year); }).filter(Boolean);
				return Object.assign({}, it, { year: ys.length ? Math.min.apply(null, ys) : 0 });
			}).sort(function (a, b) { return (a.year || 9999) - (b.year || 9999); });
			/* each book shows this house's own cover when its edition here has one: of the editions naming this house,
			   the one that names it first («كيان للنشر» over «دار ليلى (كيان كورب)») */
			var own = function (it) {
				if (it.series) return it;
				var best = null, at = 1e9;
				(((d.bookInfo || {})[it.id] || {}).editions || []).forEach(function (ed) {
					var n = ((ed.publisher || {}).ar || '').replace(/\(ثم[^)]*\)/g, ''), m = ed.cover && n.match(new RegExp(p.match));
					if (m && m.index < at) { at = m.index; best = ed; }
				});
				return best ? Object.assign({}, it, { cover: best.cover }) : it;
			};
			mine = mine.map(own);
			later = later.map(own);
			var ys = mine.map(function (it) { return it.year; }).filter(Boolean);
			return { p: p, list: mine, later: later, from: ys.length ? Math.min.apply(null, ys) : 0, to: ys.length ? Math.max.apply(null, ys) : 0 };
		}).filter(function (c) { return c.list.length; })
			.sort(function (a, b) { return (a.from || 9999) - (b.from || 9999); });
	}
	/* a publisher's name as printed, linked to the page of the first house it names (or plain text) */
	function publisherLink(name) {
		var App = window.App, text = typeof name === 'string' ? name : App.t(name || {}), ar = typeof name === 'string' ? name : (name && name.ar) || '';
		var p = (App.data().publishers || []).filter(function (x) { return pubMatches(x, ar); })[0];
		return p ? '<a href="' + App.esc(publisherHref(p.id)) + '">' + App.esc(text) + '</a>' : App.esc(text);
	}

	/* a house's card (works page, publishers.html): logo, name, count, years, note and its books */
	function publisherCard(c) {
		var App = window.App, e = App.esc, tx = App.tx, L = App.L;
		var n = c.list.length;
		return '<article class="pub rise">' +
			'<div class="pub-head">' + (c.p.logo ? '<span class="pub-logo"><img src="' + e(c.p.logo) + '" alt="' + e(App.t(c.p.name)) + '" loading="lazy"></span>' : '<span class="pub-logo is-mono" aria-hidden="true">' + e(App.t(c.p.name).replace(/^(دار|Dar)\s+/, '').charAt(0)) + '</span>') + '<h3><a class="pub-a" href="' + e(publisherHref(c.p.id)) + '">' + tx(c.p.name) + '</a></h3>' +
				'<span class="pub-n">' + (n === 2 ? L('عملان', '2 works') : App.num(n) + ' ' + (n === 1 ? L('عمل', 'work') : L(n <= 10 ? 'أعمال' : 'عملًا', 'works'))) + '</span></div>' +
			(c.from ? '<div class="pub-yr">' + App.num(c.from) + (c.to > c.from ? '–' + App.num(c.to) : '') + '</div>' : '') +
			(c.p.note ? '<p class="pub-note">' + tx(c.p.note) + '</p>' : '') +
			'<a class="pub-more" href="' + e(publisherHref(c.p.id)) + '">' + L('صفحة الدار ←', 'The house’s page →') + '</a>' +
			'<ul class="pub-list">' + c.list.map(function (it) {
				return '<li' + (it.series ? ' class="is-series"' : '') + '><a href="' + e(it.href) + '">' + tx(it.title) + '</a></li>';
			}).join('') + '</ul></article>';
	}

	window.WorksShared = {
		publishers: publishers, publisherHref: publisherHref, publisherLink: publisherLink, publisherCard: publisherCard,
		ownSeries: ownSeries, contributedSeries: contributedSeries, awardsList: awardsList, inspiredSeries: inspiredSeries, seriesAuthor: seriesAuthor,
		TYPES: TYPES, seriesBook: seriesBook, monogram: monogram, charXref: charXref,
		anySeries: anySeries, seriesIssues: seriesIssues, specialIssues: specialIssues, issueKey: issueKey, resolveBook: resolveBook, issueCover: issueCover,
		bookHref: bookHref, seriesHref: seriesHref, miniCover: miniCover, coverOf: coverOf, seriesCover: seriesCover
	};
})();

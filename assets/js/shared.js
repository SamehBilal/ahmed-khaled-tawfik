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
		about: { ar: 'كتاب عنه', en: 'A book about him' },
		foreword: { ar: 'كتاب بمقدمة منه', en: 'With his foreword' },
		backword: { ar: 'كتاب عليه كلمته', en: 'With his words on the back' },
		dedicated: { ar: 'كتاب أُهدي إليه', en: 'Dedicated to him' }
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

		/* the cover: its own front when it names one (s.front), else the first issue's, else a collected volume's */
		var first = seriesIssues(s.id)[0];
		var vol = ((App.data().seriesCovers || {})[s.id] || []).filter(function (c) { return /cdn.(abjjad|aseeralkotb)|covers\/books\/(abjjad|aseeralkotb)-/.test(c.cover); })[0];
		return {
			id: 's-' + s.id,
			img: (window.App.data().seriesFronts || {})[s.id] || s.front || (first && issueCover(s.id, first)) || (vol && vol.cover) || '',
			color: s.color, title: s.title,
			num: s.count ? '№ ' + s.count : '',
			motif: monogram(s.title),
			back: tx(s.tagline || s.synopsis),
			meta: s.years || '',
			pages: pages,
			info: {
				title: t(s.title), sub: App.alt(s.title), text: t(s.tagline),
				/* of the characters only the lead is named, in the facts below; the others are on the series page */
				extra: '<a class="more-link" href="series.html?id=' + s.id + '">' + L('صفحة السلسلة وكل أعدادها ←', 'Series page & every issue →') + '</a> ' + App.fixLink(t(s.title)),
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
		/* an unnumbered book can say which number it comes after ("after: 17") */
		var at = function (x) { return x.n || (x.after != null ? x.after + .5 : 9999); };
		return list.sort(function (a, b) { return at(a) - at(b) || (a.part || 0) - (b.part || 0) || (a._idx || 0) - (b._idx || 0); });
	}

	/* الأعداد الخاصة of a series, flagged so links go to <series>-s<n> */
	function specialIssues(id) {
		var list = ((window.App.data().specials || {})[id] || []);
		return list.map(function (is) { return Object.assign({ _special: true }, is); });
	}

	function issueKey(sid, is) {
		return sid + '-' + (is.n != null ? is.n : 'x' + (is._idx || 0)) + (is.part ? '-' + is.part : '');
	}

	/* The books on the writers page that carry his words or are dedicated to him (other writers' books, not his):
	   each has a page, book.html?id=by-<its English title>, saying why it is on the site. */
	function entryBookId(w) { return 'by-' + String((w.book || {}).en || '').split(':')[0].toLowerCase().replace(/\(.*?\)/g, ' ').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''); }
	function entryBooks() {
		var W = window.App.data().writers || {}, out = [];
		['introductions', 'dedications'].forEach(function (sh) {
			(W[sh] || []).forEach(function (w) { if (w.book && w.book.en) out.push({ id: entryBookId(w), w: w, shelf: sh }); });
		});
		return out;
	}
	function entryBookHref(w) { return bookHref(entryBookId(w)); }

	/* book.html?id=… → a standalone work, or an issue of a series */
	function resolveBook(id) {
		var App = window.App, d = App.data();
		var w = App.byId(d.works, id);
		if (w) return { kind: 'work', id: id, item: w, info: (d.bookInfo || {})[id] || {} };
		/* a book of another writer's that carries his words or is dedicated to him */
		if (/^by-/.test(id)) {
			var eb = entryBooks().filter(function (x) { return x.id === id; })[0];
			if (eb) {
				var w = eb.w, kind = w.direction === 'dedication' ? 'dedicated' : w.direction === 'back_akt' ? 'backword' : 'foreword';
				var eds = (w.cover || (w.back && kind !== 'dedicated')) ? [{ lang: 'ar', cover: w.cover || '', back: kind === 'dedicated' ? '' : (w.back || '') }] : [];
				return { kind: 'work', about: true, entry: eb, id: id,
					item: { id: id, type: kind, title: w.book, year: w.year, by: w.name, color: '#3a2a1f' },
					info: { cover: w.cover || '', description: w.text, editions: eds, shop: w.shop, sources: w.source ? [w.source] : [], intro: w.intro || null,
						dedicationPage: kind === 'dedicated' ? w.back : '' } };
			}
		}
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
		/* an old link to an issue that has since been numbered (<series>-x<i>) still opens it */
		var x = /^x(\d+)$/.exec(m[2]);
		for (var j = 0; x && j < list.length; j++) {
			if (list[j]._idx === +x[1] && list[j].n != null) { var nid = issueKey(m[1], list[j]); return { kind: 'issue', id: nid, item: list[j], series: ser, index: j, list: list, info: ((d.issueInfo || {})[nid]) || {} }; }
		}
		return null;
	}

	/* the first known cover of an issue (from data-more.js: store listings, Wikimedia) */
	function issueCover(sid, is) {
		var key = is._special ? 'specials-' + is.n : issueKey(sid, is);
		/* an issue that is one of his books takes that book's cover */
		return coverOf(((window.App.data().issueInfo) || {})[key]) || (is.work ? coverOf((window.App.data().bookInfo || {})[is.work]) : '');
	}

	/* a book's back cover: its own (backCovers, on the book page), else one of its editions' */
	function backOf(id) {
		var d = window.App.data(), info = (d.bookInfo || {})[id] || (d.issueInfo || {})[id] || {};
		return (d.backCovers || {})[id] || ((info.editions || []).filter(function (ed) { return ed.back; })[0] || {}).back || '';
	}

	/* a series' cover: the cover of its first book that has one, else the series' own cover */
	function seriesCover(id) {
		var s = window.App.byId(window.App.data().series, id) || window.App.byId(window.App.data().otherSeries, id);
		/* the cover chosen for the whole series (AKT.seriesFronts), then a front cover it names for itself (s.front) */
		var fr = (window.App.data().seriesFronts || {})[id];
		if (fr) return fr;
		if (s && s.front) return s.front;
		var list = seriesIssues(id);
		for (var i = 0; i < list.length; i++) { var c = issueCover(id, list[i]); if (c) return c; }
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
	/* the last year a span names («1996–2018» → 2018) */
	function lastYearOf(y) { var m = String(y || '').match(/\d{4}/g); return m ? +m[m.length - 1] : 0; }
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
			/* a series brings its last year and how many of its issues are his */
			return { id: s.id, title: s.title, href: seriesHref(s.id), year: yearOf(s.years), yearTo: lastYearOf(s.years), issues: seriesIssues(s.id).length, pub: (s.publisher && s.publisher.ar) || '', cover: seriesCover(s.id), color: s.color, series: true };
		}));
		return (d.publishers || []).map(function (p) {
			var mine = items.filter(function (it) { return pubMatches(p, it.pub); })
				.sort(function (a, b) { return ((a.year || 9999) - (b.year || 9999)) || String(a.date || '').localeCompare(String(b.date || '')); });
			/* later editions of other books of his that this house reissued */
			/* a series a house later gathered and reissued says so in its publisher, «(ثم جمعتها كيان في مجلد واحد عام 2017)» */
			var then = function (it) { var m = it.series && String(it.pub || '').match(/\(ثم([^)]*)\)/); return m && new RegExp(p.match).test(m[1]) ? m[1] : ''; };
			var later = items.filter(function (it) {
				if (mine.indexOf(it) >= 0) return false;
				if (it.series) return !!then(it);
				return (((d.bookInfo || {})[it.id] || {}).editions || []).some(function (ed) { return ed.publisher && pubMatches(p, ed.publisher.ar || ''); });
			}).map(function (it) {
				if (it.series) return Object.assign({}, it, { year: yearOf(then(it)), yearTo: 0, inOne: /مجلد واحد/.test(then(it)) });
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
				/* and its link opens the book on this house's edition */
				return Object.assign({}, it, best ? { cover: best.cover } : {}, { href: it.href + (it.href.indexOf('?') < 0 ? '?' : '&') + 'pub=' + encodeURIComponent(p.id) });
			};
			mine = mine.map(own);
			later = later.map(own);
			/* its years run to the last a book or series of his came out with it (a series' last issue, not its first) */
			var ys = mine.map(function (it) { return it.year; }).filter(Boolean), ye = mine.map(function (it) { return it.yearTo || it.year; }).filter(Boolean);
			/* and what it published of his world that isn't his: a series grown from his work (Lasheen), and books about him */
			var world = inspiredSeries().filter(function (s) { return s.publisher && pubMatches(p, s.publisher.ar || ''); }).map(function (s) {
				return { id: s.id, title: s.title, href: seriesHref(s.id), year: yearOf(s.years), yearTo: lastYearOf(s.years), issues: seriesIssues(s.id).length, cover: seriesCover(s.id), color: s.color, series: true, world: true, by: s.author };
			});
			var about = (d.aboutBooks || []).filter(function (b) { return b.publisher && pubMatches(p, b.publisher.ar || ''); }).map(function (b) {
				return { id: b.id, title: b.title, href: bookHref(b.id), year: b.year, cover: b.cover, color: b.color || '#3a2a1f', by: b.by, about: true };
			});
			/* an audio house (p.audio) made his series into audiobooks: how many issues of each, from its episodes on the site
			   (Audiohat's own pages, and its YouTube channel's), the special issues of every series counted together */
			var heard = [];
			if (p.audio) {
				var A = d.audio || {}, Y = A.youtube || {}, n = {};
				var take = function (k) { var m = /^([a-z]+)-(s?)\d+$/.exec(k); if (!m || m[1] === 'specials') return; var sid = m[2] ? 'specials' : m[1]; n[sid] = n[sid] || {}; n[sid][k] = 1; };
				Object.keys(A.issues || {}).forEach(take);
				Object.keys(Y.issues || {}).forEach(function (k) { if (new RegExp(p.audio).test(((Y.channels || {})[k] || {}).name || '')) take(k); });
				heard = Object.keys(n).map(function (sid) { var s = anySeries(sid).s; return s && { id: sid, title: s.title, href: seriesHref(sid), cover: seriesCover(sid), color: s.color, series: true, heard: true, issues: Object.keys(n[sid]).length }; })
					.filter(Boolean).sort(function (a, b) { return b.issues - a.issues; });
			}
			/* a house whose recordings the site lists (p.heardOn: Storytel, Iqraaly): its issues by series, then his books and
			   the books about him it recorded (a story it sells on its own is not counted) */
			var own2 = ((d.audio || {})[p.heardOn] || {}).items;
			if (own2) {
				var bySeries = {}, books = [];
				Object.keys(own2).forEach(function (k) {
					var m = /^([a-z]+)-\d+$/.exec(k), w = /^work:(.+)$/.exec(k), sr = /^series:(.+)$/.exec(k), ab = /^about:(.+)$/.exec(k);
					if (m) { bySeries[m[1]] = (bySeries[m[1]] || 0) + 1; return; }
					if (sr) { var s0 = anySeries(sr[1]); if (s0) books.push({ id: sr[1], title: s0.s.title, href: seriesHref(sr[1]), cover: seriesCover(sr[1]), color: s0.s.color, heard: true }); return; }
					var wk = w && App.byId(d.works, w[1]), bk = ab && App.byId(d.aboutBooks, ab[1]);
					if (wk) books.push({ id: wk.id, title: wk.title, href: App.workHref(wk.id), year: yearOf(wk.year), cover: coverOf((d.bookInfo || {})[wk.id]), color: wk.color, heard: true });
					if (bk) books.push({ id: bk.id, title: bk.title, href: bookHref(bk.id), year: bk.year, cover: bk.cover, color: bk.color || '#3a2a1f', by: bk.by, about: true, heard: true });
				});
				heard = heard.concat(Object.keys(bySeries).map(function (sid) { var s = anySeries(sid); return s && { id: sid, title: s.s.title, href: seriesHref(sid), cover: seriesCover(sid), color: s.s.color, series: true, heard: true, issues: bySeries[sid] }; })
					.filter(Boolean).sort(function (a, b) { return b.issues - a.issues; }), books.sort(function (a, b) { return (a.year || 9999) - (b.year || 9999); }));
			}
			return { p: p, list: mine, later: later, world: world, about: about, heard: heard, from: ys.length ? Math.min.apply(null, ys) : 0, to: ye.length ? Math.max.apply(null, ye) : 0 };
		}).filter(function (c) { return c.list.length || c.later.length || c.world.length || c.about.length || c.heard.length; })
			.sort(function (a, b) { return (a.from || 9999) - (b.from || 9999); });
	}
	/* a publisher's name as printed, linked to the page of the first house it names (or plain text) */
	function publisherLink(name) {
		var App = window.App, text = typeof name === 'string' ? name : App.t(name || {}), ar = typeof name === 'string' ? name : (name && name.ar) || '';
		var p = (App.data().publishers || []).filter(function (x) { return pubMatches(x, ar); })[0];
		return p ? '<a href="' + App.esc(publisherHref(p.id)) + '">' + App.esc(text) + '</a>' : App.esc(text);
	}

	/* a house that has closed says so in a small badge, with the year when it is known (p.closed: { year }) */
	function closedBadge(p) {
		var App = window.App, L = App.L;
		return p.closed ? ' <span class="pub-closed" title="' + App.esc(L('توقفت الدار عن النشر', 'This house no longer publishes')) + '">' + L('مغلقة', 'Closed') + (p.closed.year ? ' · ' + App.num(p.closed.year) : '') + '</span>' : '';
	}

	/* a house's card (works page, publishers.html): logo, name, count, years, note and its books */
	function publisherCard(c) {
		var App = window.App, e = App.esc, tx = App.tx, L = App.L;
		var books = c.list.filter(function (it) { return !it.series; }).length, series = c.list.filter(function (it) { return it.series; });
		var issues = series.reduce(function (m, it) { return m + (it.issues || 0); }, 0);
		/* Arabic counts: one, two (the dual), up to ten the plural, then the accusative singular */
		var count = function (n, one, two, few, many, en1, enN) { return n === 2 ? L(two, '2 ' + enN) : n === 1 ? L(one + (/ة$/.test(one) ? ' واحدة' : ' واحد'), '1 ' + en1) : App.num(n) + ' ' + L(n <= 10 ? few : many, enN); };
		/* «٣ كتب · ٢٨٩ عددًا في ٧ سلاسل»: its books, then the issues of its series and how many series they make */
		var what = [books ? count(books, 'كتاب', 'كتابان', 'كتب', 'كتابًا', 'book', 'books') : '',
			series.length ? (issues ? count(issues, 'عدد', 'عددان', 'أعداد', 'عددًا', 'issue', 'issues') + L(' في ', ' in ') : '') + count(series.length, 'سلسلة', issues ? 'سلسلتين' : 'سلسلتان', 'سلاسل', 'سلسلة', 'series', 'series') : ''].filter(Boolean).join(' · ');
		/* a house that published only his world or books about him says that instead */
		var hs = (c.heard || []).filter(function (it) { return it.series; }), hb = (c.heard || []).length - hs.length;
		var heard = hs.reduce(function (m, it) { return m + it.issues; }, 0);
		if (!what && (heard || hb)) what = L('مسموعًا: ', 'On audio: ') + [heard ? count(heard, 'عدد', 'عددان', 'أعداد', 'عددًا', 'issue', 'issues') + L(' في ', ' in ') + count(hs.length, 'سلسلة', 'سلسلتين', 'سلاسل', 'سلسلة', 'series', 'series') : '',
			hb ? count(hb, 'كتاب', 'كتابان', 'كتب', 'كتابًا', 'book', 'books') : ''].filter(Boolean).join(' · ');
		if (!what) what = [(c.world || []).length ? L('سلسلة من عالمه', 'A series from his world') : '', (c.about || []).length ? (c.about.length === 1 ? L('كتاب عنه', '1 book about him') : count(c.about.length, 'كتاب عنه', 'كتابان عنه', 'كتب عنه', 'كتابًا عنه', 'book about him', 'books about him')) : ''].filter(Boolean).join(' · ');
		return '<article class="pub rise">' +
			'<div class="pub-head">' + (c.p.logo ? '<span class="pub-logo"><img src="' + e(c.p.logo) + '" alt="' + e(App.t(c.p.name)) + '" loading="lazy"></span>' : '<span class="pub-logo is-mono" aria-hidden="true">' + e(App.t(c.p.name).replace(/^(دار|Dar)\s+/, '').charAt(0)) + '</span>') + '<h3><a class="pub-a" href="' + e(publisherHref(c.p.id)) + '">' + tx(c.p.name) + '</a>' + closedBadge(c.p) + '</h3>' +
				'</div>' +
			/* its years at one end, what it published at the other */
			'<div class="pub-yr">' + (c.from ? App.num(c.from) + (c.to > c.from ? '–' + App.num(c.to) : '') : '') + (what ? '<span class="pub-n">' + what + '</span>' : '') + '</div>' +
			(c.p.note ? '<p class="pub-note">' + tx(c.p.note) + '</p>' : '') +
			'<a class="pub-more" href="' + e(publisherHref(c.p.id)) + '">' + L('صفحة الدار ←', 'The house’s page →') + '</a>' +
			/* his books and series, then what it published of his world and about him */
			'<ul class="pub-list">' + c.list.concat(c.heard || [], c.world || [], c.about || []).map(function (it) {
				/* a series says how many of its issues are his */
				return '<li' + (it.world ? ' class="is-series is-world"' : it.about ? ' class="is-about"' : it.series ? ' class="is-series"' : '') + '><a href="' + e(it.href) + '">' + tx(it.title) + (it.series && it.issues ? ' <small class="pub-is">(' + App.num(it.issues) + ')</small>' : '') + '</a></li>';
			}).join('') + '</ul></article>';
	}

	/* what an opened issue shows (the series page's grid and the Works shelf): its cover, a few facts and the words on
	   its back, with a link to its page and a ✕ to close it */
	function issuePanel(sid, s, is) {
		var App = window.App, d = App.data(), e = App.esc, t = App.t, tx = App.tx, L = App.L;
		var key = issueKey(sid, is), info = (d.issueInfo || {})[key] || {}, eds = info.editions || [];
		var blurb = (d.blurbs || {})[key] || info.blurb || null;
		var text = blurb ? blurb.ar : (is.synopsis ? t(is.synopsis) : '');
		var first = function (f) { for (var i = 0; i < eds.length; i++) if (eds[i][f]) return eds[i][f]; return ''; };
		/* its year is the earliest edition's, whatever order the editions are listed in */
		var years = eds.map(function (x) { return parseInt(x.year || x.date, 10); }).filter(function (y) { return y > 0; });
		var year = is.year || info.firstPublished || (years.length ? Math.min.apply(null, years) : ''), pages = is.pages || first('pages');
		var chars = (is.chars || []).map(App.charLink).filter(Boolean).join(L('، ', ', '));
		var audio = d.audio && (d.audio.issues[sid + '-' + is.n] || (d.audio.youtube && d.audio.youtube.issues[sid + '-' + is.n]));
		var facts = [
			is.n != null ? [L('العدد', 'Issue'), App.num(is.n) + (is.part ? ' / ' + L('الجزء ', 'part ') + App.num(is.part) : '')] : null,
			year ? [L('سنة الصدور', 'Year'), App.num(String(year).slice(0, 4))] : null,
			pages ? [L('الصفحات', 'Pages'), App.num(pages)] : null,
			is.original ? [L('عن', 'From'), tx(is.original)] : null,
			chars ? [L('الشخصيات', 'Characters'), chars] : null,
			audio ? [L('مسموع', 'Audio'), '<a href="audio.html">' + L('استمع ♪', 'Listen ♪') + '</a>'] : null
		].filter(Boolean);
		var img = issueCover(sid, is);
		return '<button type="button" class="ip-close" aria-label="' + e(L('إغلاق', 'Close')) + '">✕</button>' +
			'<a class="ip-cover" href="' + e(App.issueHref(sid, is)) + '">' + (img ? '<img src="' + e(img) + '" alt="">' : miniCover({ color: s.color, title: t(is.title) })) + '</a>' +
			'<div class="ip-body"><h4>' + tx(is.title) + '</h4>' +
				(facts.length ? '<dl class="ip-facts">' + facts.map(function (f) { return '<div><dt>' + e(f[0]) + '</dt><dd>' + (/</.test(f[1]) ? f[1] : e(f[1])) + '</dd></div>'; }).join('') + '</dl>' : '') +
				(text ? '<p class="ip-text" dir="rtl" lang="ar">' + e(text) + '</p>' : '') +
				'<a class="ip-more" href="' + e(App.issueHref(sid, is)) + '">' + L('صفحة العدد ←', 'Issue page →') + '</a></div>';
	}

	window.WorksShared = {
		issuePanel: issuePanel, closedBadge: closedBadge,
		backOf: backOf, entryBooks: entryBooks, entryBookHref: entryBookHref, publishers: publishers, publisherHref: publisherHref, publisherLink: publisherLink, publisherCard: publisherCard,
		ownSeries: ownSeries, contributedSeries: contributedSeries, awardsList: awardsList, inspiredSeries: inspiredSeries, seriesAuthor: seriesAuthor,
		TYPES: TYPES, seriesBook: seriesBook, monogram: monogram, charXref: charXref,
		anySeries: anySeries, seriesIssues: seriesIssues, specialIssues: specialIssues, issueKey: issueKey, resolveBook: resolveBook, issueCover: issueCover,
		bookHref: bookHref, seriesHref: seriesHref, miniCover: miniCover, coverOf: coverOf, seriesCover: seriesCover
	};
})();

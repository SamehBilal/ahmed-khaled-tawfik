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
			/* the cover of its first book (the first issue that has one), else the series' own */
			img: S.seriesCover(s.id),
			color: s.color || '#4b3b2a', title: s.title, motif: S.monogram(s.title),
			back: tx(s.description || ''), meta: s.years || '',
			pages: ['<h4>' + tx(s.title) + '</h4>' + App.paras(s.description)],
			info: { title: '', text: '' },
			by: ser.inspired ? t(S.seriesAuthor(ser)) : ''
		};
		/* its back: its own back cover (a collected volume's), else the back cover of its first book that has one */
		if (info.back) bookOpts.backImg = info.back;
		if (!ser.own && !bookOpts.backImg) issues.some(function (is) { var bk = S.backOf(is.work || S.issueKey(id, is)); if (bk) bookOpts.backImg = bk; return !!bk; });
		bookOpts.id = '';
		bookOpts.info = { title: '', text: '' };

		var facts = [
			[L('السنوات', 'Years'), App.num(s.years || '')],
			[L('عدد الأعداد', 'Issues'), App.num(s.count || (issues.length || ''))],
			[L('الناشر', 'Publisher'), s.publisher ? t(s.publisher) : '', s.publisher ? S.publisherLink(s.publisher) : ''],
			[L('صاحب السلسلة', 'Created by'), ser.own ? L('أحمد خالد توفيق', 'Ahmed Khaled Tawfik') : (s.owner ? t(s.owner) : '')],
			[ser.inspired ? L('صلتها به', 'Link to him') : L('دوره', 'His role'), !ser.own && s.role ? t(s.role) : (other && other.role ? t(other.role) : '')],
			[L('البطل', 'Lead'), hero ? t(hero.name) : ''],
			[L('الشكل', 'Format'), info.format ? t(info.format) : '']
		].filter(function (x) { return x[1]; });

		/* each issue's number stands beside its cover, as on the guide (.step-n) */
		/* the widest number sets the column all the numbers stand in, so every cover is the same width */
		var digits = Math.max.apply(null, [1].concat(issues.map(function (is) { return is.n != null ? String(is.n).length : 1; })));
		var issueGrid = issues.map(function (is, i) {
			var n = is.n != null ? App.num(is.n) + (is.part ? '/' + App.num(is.part) : '') : (is.mark || '');
			return '<a class="cover-link" href="' + App.issueHref(id, is) + '" data-i="' + i + '" title="' + e(t(is.title)) + '">' +
				'<span class="cl-cover">' + S.miniCover({ img: S.issueCover(id, is), color: s.color, title: t(is.title), sub: is.original ? t(is.original) : '', by: t(S.seriesAuthor(ser)) }) +
					(n ? '<b class="cl-n"' + (is.part ? ' data-part' : '') + '>' + e(n) + '</b>' : '') + '</span>' +
				'<span class="cl-t">' + tx(is.title) + '</span>' +
				((d.audio && (d.audio.issues[id + '-' + is.n] || (d.audio.youtube && d.audio.youtube.issues[id + '-' + is.n])) && !(is.part > 1)) ? '<span class="cl-audio" title="' + L('متاح مسموعًا على Audiohat', 'Audiobook on Audiohat') + '">' + L('مسموع ♪', 'Audio ♪') + '</span>' : '') +
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
		/* from this world in other series: a series that counts as this one's specials (specialsOf, e.g. the comics) joins
		   its special issues; the rest, with the series that grew out of it (grewFrom, e.g. Lasheen), is "what came of it" */
		var related = [], extraSpecials = [];
		S.contributedSeries().forEach(function (x) {
			S.seriesIssues(x.id).forEach(function (is) {
				if (is.related === id) (x.specialsOf === id ? extraSpecials : related).push({ s: x, is: is });
			});
		});
		var grown = (d.otherSeries || []).filter(function (x) { return x.inspired && x.grewFrom === id; });
		var specials = S.specialIssues(id);

		root.innerHTML =
			'<section class="detail"><div class="wrap">' +
				'<nav class="crumbs"><a href="works.html">' + L('الأعمال', 'Works') + '</a> / <span>' + tx(s.title) + '</span></nav>' +
				'<div class="detail-grid">' +
					'<aside class="d-cover"><ul class="bk-list bk-solo" id="d-book">' + window.Books.showcase(bookOpts) + '</ul>' +
						(links ? '<div class="d-links">' + links + '</div>' : '') + '</aside>' +
					'<div class="d-main">' +
						'<p class="eyebrow">' + (ser.own ? L('سلسلة من تأليفه', 'His series') : ser.inspired ? L('عالم خرج من أدبه', 'A world grown from his work') : L('سلسلة شارك فيها', 'A series he contributed to')) + '</p>' +
						'<h1>' + tx(s.title) + '</h1>' +
						'<p class="d-alt">' + e(App.alt(s.title)) + '</p>' +
						(s.tagline ? '<p class="d-by">' + tx(s.tagline) + '</p>' : '') +
						(desc ? '<div class="d-desc">' + App.paras(desc) + '</div>' : '') +
						(info.genres && info.genres.length ? '<div class="d-genres">' + info.genres.map(function (g) { return '<span>' + tx(g) + '</span>'; }).join('') + '</div>' : '') +
						'<dl class="d-facts">' + facts.map(function (x) { return '<dt>' + e(x[0]) + '</dt><dd>' + (x[2] || e(x[1])) + '</dd>'; }).join('') + '</dl>' +
						(info.altTitles && info.altTitles.length ? '<section class="d-block"><h3>' + L('عناوين أخرى', 'Other titles') + '</h3><ul class="alt-titles">' +
							info.altTitles.map(function (a) { return '<li><b>' + e(a.title) + '</b>' + (a.note ? ' — ' + tx(a.note) : '') + '</li>'; }).join('') + '</ul></section>' : '') +
						(info.readingOrder ? '<section class="d-block"><h3>' + L('ترتيب القراءة', 'Reading order') + '</h3>' + App.paras(info.readingOrder) + '</section>' : '') +
						(d.audio && issues.some(function (is) { return d.audio.issues[id + '-' + is.n] || (d.audio.youtube && d.audio.youtube.issues[id + '-' + is.n]); }) ? '<p class="note"><a href="audio.html">♪ ' + L('عدد من أعدادها متاح مسموعًا — استمع على المسجّل', 'Many issues are on audio — listen on the cassette deck') + ' ←</a></p>' : '') +
						(info.blocks || []).map(function (b) {
							return '<section class="d-block d-extra"><h3>' + tx(b.title) + (b.items && b.items.length > 1 ? ' <small>(' + App.num(b.items.length) + ')</small>' : '') + '</h3>' +
								(b.text ? App.paras(b.text) : '') +
								(b.items ? '<ul class="ex-list">' + b.items.map(function (it) {
									var head = it.href ? '<a href="' + e(it.href) + '">' + tx(it.title) + '</a>' : it.url ? '<a href="' + e(it.url) + '" target="_blank" rel="noopener">' + tx(it.title) + ' ↗</a>' : '<b>' + tx(it.title) + '</b>';
									return '<li>' + head + (it.meta ? ' <span class="meta">' + tx(it.meta) + '</span>' : '') + (it.text ? '<br><span class="ex-t">' + tx(it.text) + '</span>' : '') + '</li>';
								}).join('') + '</ul>' : '') + '</section>';
						}).join('') +
						(chars.length ? '<section class="d-block"><h3>' + L('الشخصيات', 'Characters') + '</h3><p class="chips-line">' + chars.map(function (c) { return App.charLink(c.id); }).join('') + '</p></section>' : '') +
						(eds ? '<section class="d-block"><h3>' + L('الطبعات', 'Editions') + '</h3><ul class="ed-list">' + eds + '</ul></section>' : '') +
						/* collected volumes, box sets and the series logo, from the stores and Wikimedia */
						this.volumesHtml(id, s) +
						this.buyHtml(s) +
						/* each adaptation in a card with its poster, as on the Works page */
						(adapts.length ? '<section class="d-block"><h3>' + L('على الشاشة', 'On screen') + '</h3>' + adapts.map(function (a) {
							return '<article class="adapt d-adapt' + (a.poster ? ' has-poster' : '') + '">' +
								(a.poster ? '<a class="adapt-poster" href="' + e(a.posterSource || a.poster) + '" target="_blank" rel="noopener"><img src="' + e(a.poster) + '" alt="' + e(L('ملصق ', 'Poster: ') + t(a.title)) + '" loading="lazy"></a>' : '') +
								'<div>' + (a.kind ? '<div class="kind">' + tx(a.kind) + '</div>' : '') +
								'<h3>' + tx(a.title) + '</h3>' +
								(a.year ? '<div class="yr">' + App.num(a.year) + '</div>' : '') +
								'<p>' + tx(a.text) + '</p></div></article>'; }).join('') + '</section>' : '') +
					'</div>' +
				'</div>' +
				(ser.own && hero && issues.length ? this.proximityHtml(s, hero, issues) : '') +
				(issues.length ? '<section class="d-block d-wide"><div class="d-head"><h3>' + (ser.own ? L('كل الأعداد', 'Every issue') : ser.inspired ? L('كتب السلسلة', 'The books') : L('ما كتبه أو ترجمه فيها', 'What he wrote or translated in it')) +
					' <small>(' + App.num(issues.length) + ')</small></h3></div><div class="cover-grid is-ranked" id="issue-grid" data-digits="' + digits + '" style="--c:' + e(s.color || '#c0392b') + ';--d:' + digits + '">' + issueGrid + '</div></section>' : '') +
				((specials.length + extraSpecials.length) ? '<section class="d-block d-wide"><div class="d-head"><h3>' + L('الأعداد الخاصة', 'Special issues') + ' <small>(' + App.num(specials.length + extraSpecials.length) + ')</small></h3></div><div class="cover-grid">' +
					specials.map(function (is) {
						var au = d.audio && d.audio.youtube && d.audio.youtube.issues[id + '-s' + is.n];
						return '<a class="cover-link" href="' + App.issueHref(id, is) + '" title="' + e(t(is.title)) + '">' +
							S.miniCover({ img: S.issueCover(id, is), color: '#1f1b2e', title: t(is.title), num: L('خاص ', 'S') + App.num(is.n) }) +
							'<span class="cl-t">' + L('عدد خاص ', 'Special ') + App.num(is.n) + '. ' + tx(is.title) + '</span>' +
							(au ? '<span class="cl-audio">' + L('مسموع ♪', 'Audio ♪') + '</span>' : '') +
						'</a>';
					}).join('') +
					/* the comics: special issues too, told in pictures */
					extraSpecials.map(function (r) {
						return '<a class="cover-link" href="' + App.issueHref(r.s.id, r.is) + '" title="' + e(t(r.is.title)) + '">' +
							S.miniCover({ img: S.issueCover(r.s.id, r.is), color: r.s.color, title: t(r.is.title), num: L('كوميكس', 'Comic'), sub: t(r.s.title) }) +
							'<span class="cl-t">' + tx(r.is.title) + ' · ' + tx(r.s.title) + '</span></a>';
					}).join('') + '</div></section>' : '') +
				/* what came of this world: its stories in other series, and the series that grew out of it */
				((related.length + grown.length) ? '<section class="d-block d-wide"><div class="d-head"><h3>' + L('ما خرج من عالمها', 'What grew from this world') + ' <small>(' + App.num(related.length + grown.length) + ')</small></h3></div><div class="cover-grid">' +
					related.map(function (r) {
						return '<a class="cover-link" href="' + App.issueHref(r.s.id, r.is) + '" title="' + e(t(r.is.title)) + '">' +
							S.miniCover({ img: S.issueCover(r.s.id, r.is), color: r.s.color, title: t(r.is.title), sub: t(r.s.title) }) +
							'<span class="cl-t">' + tx(r.is.title) + ' · ' + tx(r.s.title) + '</span></a>';
					}).join('') +
					grown.map(function (x) {
						return '<a class="cover-link" href="' + S.seriesHref(x.id) + '" title="' + e(t(x.title)) + '">' +
							S.miniCover({ img: S.seriesCover(x.id), color: x.color, title: t(x.title), sub: x.author ? t(x.author) : '' }) +
							'<span class="cl-t">' + L('سلسلة ', 'The series ') + tx(x.title) + (x.author ? ' · ' + tx(x.author) : '') +
								(x.count ? ' · ' + App.num(x.count) + ' ' + L('كتابًا', 'books') : '') + '</span></a>';
					}).join('') + '</div></section>' : '') +
				/* its characters, the cards of the characters page: the leads at full size, the others smaller */
				(chars.length && window.CharCards ? '<section class="d-block d-wide sv-chars"><div class="d-head"><h3>' + L('الشخصيات', 'Characters') + ' <small>(' + App.num(chars.length) + ')</small></h3></div>' +
					(chars.some(function (c) { return c.main; }) ? '<div class="char-grid cc-grid">' + chars.filter(function (c) { return c.main; }).map(function (c) { return window.CharCards.card(c); }).join('') + '</div>' : '') +
					(chars.some(function (c) { return !c.main; }) ? '<div class="char-grid cc-grid cc-minor">' + chars.filter(function (c) { return !c.main; }).map(function (c) { return window.CharCards.card(c); }).join('') + '</div>' : '') +
				'</section>' : '') +
				'<section class="d-block d-wide"><div class="d-head"><h3>' + L('سلاسل أخرى', 'Other series') + '</h3></div><div class="cover-row">' +
					all.filter(function (x) { return x.id !== id; }).map(function (x) {
						return '<a class="cover-link" href="' + S.seriesHref(x.id) + '">' + S.miniCover({ img: S.seriesCover(x.id), color: x.color, title: t(x.title), sub: x.own ? '' : L('مشاركة', 'Contributor') }) + '</a>';
					}).join('') + '</div></section>' +
				(sources.length ? '<section class="d-block d-sources d-wide"><h3>' + L('المصادر', 'Sources') + '</h3><ul>' +
					sources.map(function (u) { return '<li><a href="' + e(u) + '" target="_blank" rel="noopener">' + e(u.replace(/^https?:\/\/(www\.)?/, '').slice(0, 70)) + '</a></li>'; }).join('') + '</ul></section>' : '') +
				App.fixLink(t(s.title)) +
			'</div></section>';

		window.Books.initShowcase(document.getElementById('d-book'));
		this.initProximity(document.getElementById('prox'));
		this.initIssuePanel(document.getElementById('issue-grid'), issues, id, s);
		this.initVolumes(id);
		var cs = document.querySelector('.sv-chars');
		if (cs) window.CharCards.bindFlip(cs);
	},

	/* ---------- collected volumes, box sets and the series logo (d.seriesCovers) ----------
	   As on a book page, one card stands for many printings: a series' numbered volumes share one design, so they
	   are one card with a chip per volume, each opening a popup with that volume and where to buy it; box sets and
	   single printings get a card each, and the logo and photos stay pictures */
	volOrd: { 'الأول': 1, 'الاول': 1, 'الحادي': 1, 'الحادى': 1, 'الثاني': 2, 'الثانى': 2, 'الثالث': 3, 'الرابع': 4, 'الخامس': 5, 'السادس': 6, 'السابع': 7, 'الثامن': 8, 'التاسع': 9, 'العاشر': 10 },
	volNum: function (label) {
		if (/بوكس|box/i.test(label)) return 0;
		var m = /(?:^|\s)ج\s*(\d+)/.exec(label) || /(?:الجزء|المجلد)\s+(\d+)/.exec(label);
		if (m) return +m[1];
		m = /(?:الجزء|المجلد)\s+(ال\S+)(\s+عشر)?/.exec(label);
		var n = m && this.volOrd[m[1]];
		return n ? n + (m[2] ? 10 : 0) : 0;
	},
	storeOf: function (url) {
		var L = window.App.L, h = String(url || '');
		return /aseeralkotb/.test(h) ? L('عصير الكتب', 'Aseer Al Kotb') : /abjjad/.test(h) ? L('أبجد', 'Abjjad') : /goodreads/.test(h) ? 'Goodreads'
			: /thebookhome/.test(h) ? L('بيت الكتب', 'The Book Home') : /asfar/.test(h) ? L('أسفار', 'Asfar') : /wiki/.test(h) ? L('ويكيبيديا', 'Wikipedia') : '';
	},
	volumeGroups: function (id) {
		var self = this, t = window.App.t, list = ((window.App.data().seriesCovers || {})[id] || []);
		var vols = [], cards = [], pics = [];
		list.forEach(function (c) {
			if (c.kind === 'logo' || /wiki/.test(c.source || '')) { pics.push(c); return; }
			var n = self.volNum(t(c.label));
			if (n) vols.push({ c: c, n: n }); else cards.push({ list: [{ c: c, n: 0 }] });
		});
		vols.sort(function (a, b) { return a.n - b.n; });
		/* a picture for the volumes card as a whole (d.volumesCover), else the first volume's cover */
		var groups = (vols.length ? [{ vols: true, list: vols, cover: ((window.App.data().volumesCover || {})[id]) || '' }] : []).concat(cards);
		return { groups: groups, pics: pics };
	},
	volumesHtml: function (id, s) {
		var App = window.App, e = App.esc, t = App.t, tx = App.tx, L = App.L, S = window.WorksShared, self = this;
		var g = this.volumeGroups(id), total = ((App.data().seriesCovers || {})[id] || []).length;
		if (!total) return '';
		var cards = g.groups.map(function (grp, gi) {
			var first = grp.list[0].c, n = grp.list.length;
			var head = grp.vols ? L('مجلدات ', 'The volumes of ') + t(s.title) : t(first.label);
			var meta = [first.publisher ? S.publisherLink(first.publisher) : '', grp.vols ? e(n === 2 ? L('مجلدان', '2 volumes') : App.num(n) + ' ' + L(n <= 10 ? 'مجلدات' : 'مجلدًا', 'volumes')) : ''].filter(Boolean).join(' · ');
			return '<article class="edition" data-g="' + gi + '">' +
				'<span class="sv-ed-cover">' + S.miniCover({ img: grp.cover || first.cover, color: s.color, title: head }) + '</span>' +
				'<div><h4>' + e(head) + '</h4>' + (meta ? '<p class="meta">' + meta + '</p>' : '') +
				'<div class="ed-years" role="group" aria-label="' + e(grp.vols ? L('المجلدات', 'Volumes') : L('الطبعة', 'Printing')) + '">' + grp.list.map(function (v, vi) {
					return '<button type="button" class="ed-yr" data-g="' + gi + '" data-v="' + vi + '" aria-expanded="false">' + (grp.vols ? e(App.num(v.n)) : L('التفاصيل', 'Details')) + '</button>';
				}).join('') + '</div>' +
				'</div></article>';
		}).join('');
		/* the logo and photos as cards too, the picture beside what it is */
		var pics = g.pics.map(function (c) {
			var store = self.storeOf(c.source);
			return '<article class="edition sv-pic">' +
				'<a class="sv-pic-img" href="' + e(c.source || c.cover) + '" target="_blank" rel="noopener"><img src="' + e(c.cover) + '" alt="' + e(t(c.label)) + '" loading="lazy" referrerpolicy="no-referrer"></a>' +
				'<div><h4>' + e(t(c.label)) + '</h4>' +
				(c.license || store ? '<p class="meta">' + e([store, c.license].filter(Boolean).join(' · ')) + '</p>' : '') +
				(c.source ? '<a href="' + e(c.source) + '" target="_blank" rel="noopener">' + L('المصدر ↗', 'Source ↗') + '</a>' : '') + '</div></article>';
		}).join('');
		return '<section class="d-block d-editions sv-volumes"><h3>' + L('المجلدات والأغلفة', 'Volumes and covers') + ' <small>(' + App.num(g.groups.length + g.pics.length) + ')</small></h3>' +
			'<div class="editions">' + cards + pics + '</div></section>';
	},
	/* a volume's chip opens its popup and puts its cover on the card */
	initVolumes: function (id) {
		var sec = document.querySelector('.sv-volumes');
		if (!sec) return;
		var App = window.App, e = App.esc, t = App.t, L = App.L, S = window.WorksShared, self = this;
		var groups = this.volumeGroups(id).groups;
		var pop = document.createElement('div');
		pop.className = 'ed-pop';
		pop.hidden = true;
		sec.appendChild(pop);
		var openBtn = null;
		var close = function () { pop.hidden = true; if (openBtn) openBtn.setAttribute('aria-expanded', 'false'); openBtn = null; };
		sec.addEventListener('click', function (ev) {
			var btn = ev.target.closest('.ed-yr');
			if (!btn) { if (!ev.target.closest('.ed-pop')) close(); return; }
			if (openBtn === btn) { close(); return; }
			close();
			openBtn = btn;
			btn.setAttribute('aria-expanded', 'true');
			var grp = groups[+btn.getAttribute('data-g')], c = grp.list[+btn.getAttribute('data-v')].c;
			var img = btn.closest('.edition').querySelector('.sv-ed-cover img');
			if (img) img.src = c.cover;
			var row = function (k, v) { return v ? '<dt>' + k + '</dt><dd>' + v + '</dd>' : ''; };
			pop.innerHTML = '<dl>' + row(L('العنوان', 'Title'), e(t(c.label))) +
				row(L('الأعداد', 'Issues'), c.issues ? e(App.num(c.issues)) : '') +
				row(L('الناشر', 'Publisher'), c.publisher ? S.publisherLink(c.publisher) : '') +
				row(L('السنة', 'Year'), c.year ? e(App.num(c.year)) : '') +
				row(L('الصفحات', 'Pages'), c.pages ? e(App.num(c.pages)) : '') + '</dl>' +
				(c.goodreads ? '<p class="ed-pop-links"><a href="' + e(c.goodreads) + '" target="_blank" rel="noopener">' + L('على Goodreads ↗', 'On Goodreads ↗') + '</a></p>' : '');
			pop.hidden = false;
			var sr = sec.getBoundingClientRect(), br = btn.getBoundingClientRect();
			pop.style.left = Math.min(Math.max(0, br.left - sr.left + br.width / 2 - pop.offsetWidth / 2), sr.width - pop.offsetWidth) + 'px';
			pop.style.top = (br.bottom - sr.top + 8) + 'px';
		});
		document.addEventListener('click', function (ev) { if (!sec.contains(ev.target)) close(); });
		document.addEventListener('keydown', function (ev) { if (ev.key === 'Escape') close(); });
	},

	/* ---------- where to buy the series: store searches, as on a book page (no affiliate codes) ---------- */
	buyHtml: function (s) {
		var App = window.App, e = App.esc, t = App.t, L = App.L;
		var title = s.title.ar || t(s.title), Q = encodeURIComponent(title + ' أحمد خالد توفيق');
		var shops = [
			{ kind: L('ورقي', 'Print'), items: [
				[L('بيت الكتب', 'The Book Home'), 'https://www.thebookhome.com/Home/SearchResult?searchKey=' + encodeURIComponent(title) + '&sortKey=Date%20desc&pageNumber=1'],
				[L('عصير الكتب', 'Aseer Al Kotb'), 'https://www.aseeralkotb.com/ar/search?q=' + encodeURIComponent(title)],
				['Amazon.eg', 'https://www.amazon.eg/s?k=' + Q + '&i=stripbooks'],
				['Noon', 'https://www.noon.com/egypt-ar/search/?q=' + Q]
			] },
			{ kind: L('إلكتروني', 'Ebook'), items: [
				['Abjjad', 'https://www.abjjad.com/search?q=' + Q],
				['Google Play Books', 'https://play.google.com/store/search?q=' + Q + '&c=books'],
				['Kindle', 'https://www.amazon.com/s?k=' + Q + '&i=digital-text']
			] }
		];
		return '<section class="d-block d-buy"><h3>' + L('اشترِ السلسلة', 'Where to buy') + '</h3>' +
			shops.map(function (g) {
				return '<div class="buy-row"><span class="buy-kind">' + e(g.kind) + '</span>' +
					g.items.map(function (it) { return '<a class="buy-btn" href="' + e(it[1]) + '" target="_blank" rel="noopener nofollow">' + e(it[0]) + ' ↗</a>'; }).join('') + '</div>';
			}).join('') +
			'<p class="buy-note">' + L('روابط بحث في المتاجر عن هذه السلسلة — التوفر والسعر والطبعة حسب كل متجر. لا عمولة لهذا الموقع.', 'Store searches for this series — availability, price and edition vary by store. This site earns nothing from them.') + '</p></section>';
	},

	/* a click on an issue opens it under its row: its cover, a few facts and the words on its back, with a link to its
	   page; the same issue again, ✕ or Escape closes it; a click with a modifier key still opens the page */
	initIssuePanel: function (grid, issues, sid, s) {
		if (!grid) return;
		var S = window.WorksShared;
		var panel = null, openI = -1;
		var close = function () { if (panel) panel.remove(); panel = null; openI = -1; grid.querySelectorAll('.is-open').forEach(function (a) { a.classList.remove('is-open'); a.setAttribute('aria-expanded', 'false'); }); };
		grid.addEventListener('click', function (ev) {
			if (ev.target.closest('.ip-close')) { var back = grid.querySelector('[data-i="' + openI + '"]'); close(); if (back) back.focus(); return; }
			var a = ev.target.closest('.cover-link[data-i]');
			if (!a || ev.ctrlKey || ev.metaKey || ev.shiftKey || ev.altKey || ev.button) return;
			ev.preventDefault();
			var i = +a.getAttribute('data-i');
			if (i === openI) { close(); return; }
			close();
			/* the panel goes after the last cover of the clicked cover's row */
			var top = a.offsetTop, last = a, links = [].slice.call(grid.querySelectorAll('.cover-link[data-i]'));
			for (var k = links.indexOf(a) + 1; k < links.length && links[k].offsetTop === top; k++) last = links[k];
			panel = document.createElement('div');
			panel.className = 'issue-panel';
			panel.setAttribute('style', '--c:' + (s.color || '#c0392b'));
			panel.innerHTML = S.issuePanel(sid, s, issues[i]);
			last.after(panel);
			openI = i;
			a.classList.add('is-open');
			a.setAttribute('aria-expanded', 'true');
			var r = panel.getBoundingClientRect();
			if (r.bottom > window.innerHeight) panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
		});
		document.addEventListener('keydown', function (ev) { if (ev.key === 'Escape' && panel) close(); });
		/* the rows reflow when the width changes (not when a phone's address bar comes and goes) */
		var w = window.innerWidth;
		window.addEventListener('resize', function () { if (window.innerWidth !== w) { w = window.innerWidth; if (panel) close(); } });
	},

	/* ---------- Thumbnail proximity effect (Codrops demo 3) ----------
	   The series' hero is the backdrop; every issue cover hides on top of it and
	   scales / fades in as the cursor gets near. The closest cover shows its title. */
	proximityHtml: function (s, hero, issues) {
		var App = window.App, S = window.WorksShared, e = App.esc, tx = App.tx, L = App.L;
		/* a series can give its library a picture of its own (seriesInfo[id].library), else the hero's portrait */
		var lib = ((App.data().seriesInfo || {})[s.id] || {}).library || {};
		var img = lib.image || hero.image || '', credit = lib.image ? lib.credit : hero.imageCredit;
		return '<section class="d-block d-wide"><div class="d-head"><h3>' + L('مكتبة ', 'The library of ') + tx(hero.name) + '</h3>' +
				'<span class="prox-hint">' + L('حرّك المؤشر فوق الصورة لتظهر الأعداد', 'Move your cursor over the picture to reveal the issues') + '</span></div>' +
			'<div class="prox' + (img ? ' has-img' : '') + '" id="prox" style="--c:' + e(s.color || '#3a1414') + (img ? ';background-image:url(\'' + e(img) + '\')' : '') + '">' +
				(img ? '' : '<div class="prox-art" aria-hidden="true"><span class="pa-name">' + tx(hero.name) + '</span><span class="pa-role">' + tx(hero.role) + '</span></div>') +
				'<ul class="prox-grid">' + issues.map(function (is) {
					return '<li><a href="' + App.issueHref(s.id, is) + '" data-n="' + e(App.num(is.n)) + (is.part ? '/' + e(App.num(is.part)) : '') + '" data-t="' + e(App.t(is.title)) + '">' +
						S.miniCover({ img: S.issueCover(s.id, is), color: s.color, title: App.t(is.title), num: is.n != null ? App.num(is.n) : '' }) + '</a></li>';
				}).join('') + '</ul>' +
				'<div class="prox-label" aria-hidden="true"></div>' +
				(credit ? '<span class="prox-credit">' + tx(credit) + '</span>' : '') +
			'</div></section>';
	},

	initProximity: function (box) {
		if (!box) return;
		var links = [].slice.call(box.querySelectorAll('.prox-grid a'));
		var label = box.querySelector('.prox-label');
		var fine = window.matchMedia && window.matchMedia('(hover: hover) and (pointer: fine)').matches;
		var still = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		if (!fine || still) { box.classList.add('prox-static'); return; }

		var MAX = 170, MIN_S = 0, MAX_S = 1.35, MIN_O = 0, MAX_O = 1;
		var centres = [], px = null, py = null, raf = 0, active = null;

		function measure() {
			centres = links.map(function (a) {
				var r = a.parentNode.getBoundingClientRect();
				return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
			});
		}
		function frame() {
			raf = 0;
			var best = null, bestP = 0;
			for (var i = 0; i < links.length; i++) {
				var d = px == null ? Infinity : Math.hypot(centres[i].x - px, centres[i].y - py);
				var p = d < MAX ? 1 - d / MAX : 0;
				var a = links[i];
				a.style.setProperty('--s', (MIN_S + p * (MAX_S - MIN_S)).toFixed(3));
				a.style.setProperty('--o', (MIN_O + p * (MAX_O - MIN_O)).toFixed(3));
				a.parentNode.style.zIndex = p > 0 ? String(10 + Math.round(p * 100)) : '';
				if (p > bestP) { bestP = p; best = a; }
			}
			if (best && bestP > 0.82) {
				if (active !== best) {
					active = best;
					label.innerHTML = '<b>' + best.getAttribute('data-n') + '</b> ' + window.App.esc(best.getAttribute('data-t'));
				}
				var br = best.parentNode.getBoundingClientRect(), bx = box.getBoundingClientRect();
				label.style.transform = 'translate(' + Math.round(br.left - bx.left + br.width / 2) + 'px,' + Math.round(br.top - bx.top - 14) + 'px) translate(-50%, -100%)';
				label.classList.add('on');
			} else {
				active = null;
				label.classList.remove('on');
			}
		}
		function queue() { if (!raf) raf = requestAnimationFrame(frame); }

		box.addEventListener('pointerenter', function () { measure(); });
		box.addEventListener('pointermove', function (ev) { px = ev.clientX; py = ev.clientY; queue(); });
		box.addEventListener('pointerleave', function () { px = py = null; queue(); });
		window.addEventListener('scroll', function () { if (px != null) { measure(); queue(); } }, { passive: true });
		window.addEventListener('resize', function () { measure(); queue(); });
		measure(); frame();
	}
};

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
		var by = S.seriesAuthor(ser);
		App.seo({
			path: S.seriesHref(id), desc: desc, image: S.seriesCover(id), imageAlt: L('غلاف ', 'Cover of ') + t(s.title),
			ld: { '@type': 'BookSeries', name: t(s.title), inLanguage: 'ar',
				author: ser.own ? App.seoAuthor : { '@type': 'Person', name: by.ar, alternateName: by.en } },
			crumbs: [[L('الأعمال', 'Works'), 'works.html'], [s.title]]
		});
		var hero = s.hero ? App.byId(d.characters, s.hero) : null;
		/* its own characters, and any a series names from elsewhere (seriesInfo[id].chars), as the special issues do */
		var chars = (d.characters || []).filter(function (c) { return c.work === id; })
			.concat((info.chars || []).map(function (cid) { return App.byId(d.characters, cid); }).filter(Boolean));
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
		/* its back: its own back cover (a collected volume's), else the back cover of its first book that has one —
		   unless the series asks for a plain back in its cover's colour (s.plainBack, s.bookColor) */
		if (s.bookColor) { bookOpts.color = s.bookColor; bookOpts.fixedColor = true; }
		if (info.back && !s.plainBack) bookOpts.backImg = info.back;
		if (!ser.own && !bookOpts.backImg && !s.plainBack) issues.some(function (is) { var bk = S.backOf(is.work || S.issueKey(id, is)); if (bk) bookOpts.backImg = bk; return !!bk; });
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
			/* (a split issue: its number as big as the rest, and its part, «1», small beside it) */
			var n = is.n != null ? App.num(is.n) : (is.mark || ''), part = is.n != null && is.part ? '<small class="cl-part">' + e(App.num(is.part)) + '</small>' : '';
			return '<a class="cover-link" href="' + App.issueHref(id, is) + '" data-i="' + i + '" title="' + e(t(is.title)) + '">' +
				'<span class="cl-cover">' + S.miniCover({ img: S.issueCover(id, is), color: s.color, title: t(is.title), sub: is.original ? t(is.original) : '', by: t(S.seriesAuthor(ser)) }) +
					(n ? '<b class="cl-n"' + (part ? ' data-part' : '') + '>' + e(n) + part + '</b>' : '') + '</span>' +
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
				/* an issue can belong to several worlds (related: [ids]) and count as their special issue (asSpecial) */
				if ([].concat(is.related || []).indexOf(id) >= 0) (x.specialsOf === id || is.asSpecial ? extraSpecials : related).push({ s: x, is: is });
			});
		});
		var grown = (d.otherSeries || []).filter(function (x) { return x.inspired && x.grewFrom === id; });
		var specials = S.specialIssues(id);

		/* the heroes' series wear their hero's scene behind the book (as on their character pages, character.css):
		   Refaat's fog and lamplight, Alaa's heartbeat, Abeer's stars and portal, the Virus's falling code */
		/* and every other series a scene of its own (detail.css): the specials, the three heroes' lights meeting; Shivers, rain and
		   lightning; the World Pocket Novels, a turning globe; Molotov, rising embers; the Summer Book, a sun; the Adventurer, a
		   compass and a trail; Adabiyat, ruled paper and ink; Super Mega, comic dots and a burst; Balya, bouncing marbles; the comics,
		   panels; Lasheen, a clock at midnight (it grew from «بعد منتصف الليل») */
		var theme = { mwt: 'ghosts', safari: 'medicine', fantasia: 'fantasy', www: 'code', specials: 'crossing', shivers: 'storm', rwg: 'globe',
			molotov: 'embers', sayf: 'summer', mughamer: 'compass', maqalat: 'ink', supermega: 'pop', bley: 'marbles', comics: 'panels', lasheen: 'midnight' }[id] || '';
		var many = function (n, f) { var out = ''; for (var i = 0; i < n; i++) out += f(i); return out; };
		var scene = {
			ghosts: '<div class="ch-fog"><span></span><span></span><span></span></div><i class="sv-lamp"></i>',
			medicine: '<svg class="ch-ecg" viewBox="0 0 1200 120" preserveAspectRatio="none"><path d="M0 60 H380 L400 60 L415 30 L430 95 L450 10 L470 110 L485 60 H700 L715 45 L730 75 L745 60 H1200" /></svg>',
			fantasy: '<div class="ch-stars"></div><div class="ch-portal"></div>',
			/* WWW: the Virus's code, falling in columns */
			code: '<div class="ch-code">' + [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map(function (i) { var bits = ''; for (var k = 0; k < 28; k++) bits += (i * 7 + k * 13) % 3 ? '1' : '0'; return '<span style="--i:' + i + '">' + bits + '</span>'; }).join('') + '</div>',
			crossing: '<i class="sv-orb" style="--o:#e0a050;--x:-60px;--y:-30px"></i><i class="sv-orb" style="--o:#3fbf8a;--x:70px;--y:-10px;animation-delay:-3s"></i><i class="sv-orb" style="--o:#9a7cff;--x:0px;--y:60px;animation-delay:-6s"></i>',
			storm: '<div class="sv-rain"></div><i class="sv-flash"></i>',
			globe: '<svg class="sv-globe" viewBox="-110 -110 220 220"><circle r="100"/>' +
				many(5, function (i) { return '<ellipse class="mer" rx="100" ry="100" style="animation-delay:' + (-i * 2.4) + 's"/>'; }) +
				[-60, -30, 0, 30, 60].map(function (y) { var r = Math.sqrt(10000 - y * y * 1.6); return '<ellipse rx="' + r.toFixed(1) + '" ry="' + (r * 0.18).toFixed(1) + '" cy="' + y + '"/>'; }).join('') + '</svg>',
			embers: many(16, function (i) { return '<i class="sv-ember" style="--l:' + ((i * 37) % 100) + '%;--d:' + (-(i * 0.9) % 8).toFixed(1) + 's;--s:' + (3 + (i % 4)) + 'px"></i>'; }),
			summer: '<i class="sv-sun"></i>',
			compass: '<svg class="sv-trail" viewBox="0 0 600 300" preserveAspectRatio="none"><path d="M10 250 C 120 180, 160 290, 280 210 S 460 80, 590 60"/></svg>' +
				'<svg class="sv-compass" viewBox="-100 -100 200 200"><circle r="92"/><circle r="70"/>' + many(16, function (i) { return '<line y1="-92" y2="' + (i % 4 ? -84 : -76) + '" transform="rotate(' + i * 22.5 + ')"/>'; }) +
				'<g class="needle"><path d="M0 -66 L9 0 L0 66 L-9 0 Z"/><path class="n" d="M0 -66 L9 0 L-9 0 Z"/></g></svg>',
			ink: '<div class="sv-ruled"></div><i class="sv-blot"></i>',
			pop: '<div class="sv-dots"></div><i class="sv-burst"></i>',
			marbles: many(7, function (i) { return '<i class="sv-marble" style="--l:' + (8 + i * 13) + '%;--h:' + (60 + (i * 47) % 120) + 'px;--d:' + (-(i * 0.37)).toFixed(2) + 's;--m:hsl(' + (i * 51) % 360 + ' 70% 55%)"></i>'; }),
			panels: '<div class="sv-panels">' + many(6, function (i) { return '<i style="--d:' + (i * 0.5) + 's"></i>'; }) + '</div>',
			midnight: '<svg class="sv-clock" viewBox="-100 -100 200 200"><circle r="94"/>' + many(12, function (i) { return '<line y1="-86" y2="' + (i % 3 ? -78 : -70) + '" transform="rotate(' + i * 30 + ')"/>'; }) +
				'<line class="h" y2="-46"/><line class="m" y2="-72"/><circle class="c" r="4"/></svg>'
		}[theme] || '';

		root.innerHTML =
			'<section class="detail' + (theme ? ' sv-theme sv-theme-' + theme : '') + '">' + (scene ? '<div class="sv-scene" aria-hidden="true">' + scene + '</div>' : '') + '<div class="wrap">' +
				'<nav class="crumbs"><a href="works.html">' + L('الأعمال', 'Works') + '</a> / <span>' + tx(s.title) + '</span></nav>' +
				'<div class="detail-grid">' +
					'<aside class="d-cover"><ul class="bk-list bk-solo" id="d-book">' + window.Books.showcase(bookOpts) + '</ul>' +
						(links ? '<div class="d-links">' + links + '</div>' : '') + '</aside>' +
					'<div class="d-main">' +
						'<p class="eyebrow">' + (ser.own ? L('سلسلة من تأليفه', 'His series') : ser.inspired ? L('عالم خرج من أدبه', 'A world grown from his work') : L('سلسلة شارك فيها', 'A series he contributed to')) + '</p>' +
						'<h1>' + tx(s.title) + '</h1>' +
						'<p class="d-alt">' + e(App.alt(s.title)) + '</p>' +
						(s.tagline ? '<p class="d-by">' + tx(s.tagline) + '</p>' : '') + App.shareButton() +
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
				/* the library holds everything of this world: its issues, its special issues and comics and its stories in other
				   series, written by him or not (of a series that grew from it, like Lasheen, only its first book) */
				(issues.length ? this.proximityHtml(s, hero, (info.libraryMore || []).map(function (b) { return { sid: id, is: b, href: b.url, cover: b.cover, by: b.by }; })
					.concat(issues.map(function (is) { return { sid: id, is: is }; }))
					/* the series' books not on the site (seriesInfo[id].libraryMore) take their places among its own, by number */
					.sort(function (p, q) { return (p.is.n || 9999) - (q.is.n || 9999); })
					.concat(specials.map(function (is) { return { sid: id, is: is, tag: L('خاص ', 'Special ') }; }))
					.concat(extraSpecials.map(function (r) { return { sid: r.s.id, is: r.is, tag: r.s.specialsOf === id ? L('كوميكس', 'Comic') : t(r.s.title), color: r.s.color }; }))
					.concat(related.map(function (r) { return { sid: r.s.id, is: r.is, tag: t(r.s.title), color: r.s.color }; }))
					/* of a series that grew from it (Lasheen), only its first book */
					.concat(grown.map(function (x) { var is = S.seriesIssues(x.id)[0]; return is && { sid: x.id, is: is, tag: t(x.title) + ' ', color: x.color }; }).filter(Boolean))) : '') +
				(issues.length ? '<section class="d-block d-wide"><div id="sv-progress"></div><div class="d-head"><h3>' + (ser.own ? L('كل الأعداد', 'Every issue') : ser.inspired ? L('كتب السلسلة', 'The books') : L('ما كتبه أو ترجمه فيها', 'What he wrote or translated in it')) +
					' <small>(' + App.num(issues.length) + ')</small></h3>' +
					(issues.length > 2 ? '<button type="button" class="share-btn sv-random" data-random><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3.5" y="3.5" width="17" height="17" rx="3.5"/><circle cx="8.5" cy="8.5" r="1.3" fill="currentColor"/><circle cx="15.5" cy="15.5" r="1.3" fill="currentColor"/><circle cx="12" cy="12" r="1.3" fill="currentColor"/><circle cx="15.5" cy="8.5" r="1.3" fill="currentColor"/><circle cx="8.5" cy="15.5" r="1.3" fill="currentColor"/></svg>' +
						e(L('عدد عشوائي', 'A random issue')) + '</button>' : '') + '</div><div class="cover-grid is-ranked" id="issue-grid" data-digits="' + digits + '" style="--c:' + e(s.color || '#c0392b') + ';--d:' + digits + '">' + issueGrid + '</div></section>' : '') +
				/* its characters, the cards of the characters page, all small and the same size, about as big as the covers above (leads first), right under every issue */
				(chars.length && window.CharCards ? '<section class="d-block d-wide sv-chars"><div class="d-head"><h3>' + L('الشخصيات', 'Characters') + ' <small>(' + App.num(chars.length) + ')</small></h3></div>' +
					'<div class="char-grid cc-grid cc-minor">' + chars.filter(function (c) { return c.main; }).concat(chars.filter(function (c) { return !c.main; })).map(function (c) { return window.CharCards.card(c); }).join('') + '</div>' +
				'</section>' : '') +
				this.withHtml(id) +
				((specials.length + extraSpecials.length) ? '<section class="d-block d-wide"><div class="d-head"><h3>' + L('الأعداد الخاصة', 'Special issues') + ' <small>(' + App.num(specials.length + extraSpecials.length) + ')</small></h3></div><div class="cover-grid">' +
					specials.map(function (is) {
						var au = d.audio && d.audio.youtube && d.audio.youtube.issues[id + '-s' + is.n];
						return '<a class="cover-link" href="' + App.issueHref(id, is) + '" title="' + e(t(is.title)) + '">' +
							S.miniCover({ img: S.issueCover(id, is), color: '#1f1b2e', title: t(is.title), num: L('خاص ', 'S') + App.num(is.n) }) +
							'<span class="cl-t">' + L('عدد خاص ', 'Special ') + App.num(is.n) + '. ' + tx(is.title) + '</span>' +
							(au ? '<span class="cl-audio">' + L('مسموع ♪', 'Audio ♪') + '</span>' : '') +
						'</a>';
					}).join('') +
					/* the comics, and issues of other series that count as its specials (like «كتاب الصيف»'s «ثلاثة») */
					extraSpecials.map(function (r) {
						return '<a class="cover-link" href="' + App.issueHref(r.s.id, r.is) + '" title="' + e(t(r.is.title)) + '">' +
							S.miniCover({ img: S.issueCover(r.s.id, r.is), color: r.s.color, title: t(r.is.title), num: r.s.specialsOf === id ? L('كوميكس', 'Comic') : t(r.s.title), sub: t(r.s.title) }) +
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
		this.progress(issues, id);
		/* «عدد عشوائي»: any issue, or for a reader with lists one not yet read (a collector: one not yet owned) */
		var dice = document.querySelector('[data-random]');
		if (dice) dice.addEventListener('click', function () {
			var st = window.Lists ? window.Lists.state() : null, skip = {};
			if (st) (st.lists[st.mode === 'collector' ? 'own' : 'read'] || []).forEach(function (x) { skip[x.key] = 1; });
			var all = issues.filter(function (is) { return !(is.part > 1); });
			var fresh = all.filter(function (is) { return !skip['b:' + decodeURIComponent(App.issueHref(id, is).replace(/^book\.html\?id=/, ''))]; });
			var pool = fresh.length ? fresh : all;
			location.href = App.issueHref(id, pool[Math.floor(Math.random() * pool.length)]);
		});
		this.initVolumes(id);
		var cs = document.querySelector('.sv-chars');
		if (cs) window.CharCards.bindFlip(cs);
	},

	/* the reader's progress through the series, from their lists (lists.js): how many issues they have read (a collector: own),
	   a bar, and the first one not yet read (owned) to go to next; each read or owned cover is marked. Redrawn as the lists change */
	progress: function (issues, id) {
		var App = window.App, Ls = window.Lists, e = App.esc, t = App.t, L = App.L, self = this;
		var box = document.getElementById('sv-progress'), grid = document.getElementById('issue-grid');
		if (!box || !grid || !Ls) return;
		if (!this._progWired) { this._progWired = true; document.addEventListener('akt-lists', function () { if (self._prog) self.progress(self._prog[0], self._prog[1]); }); }
		this._prog = [issues, id];
		var st = Ls.state(), collector = st.mode === 'collector';
		var inList = function (k) { var m = {}; (st.lists[k] || []).forEach(function (x) { m[x.key] = 1; }); return m; };
		var read = inList('read'), own = inList('own');
		var keyOf = function (is) { return 'b:' + decodeURIComponent(App.issueHref(id, is).replace(/^book\.html\?id=/, '')); };
		grid.querySelectorAll('.cover-link[data-i]').forEach(function (a) {
			var k = keyOf(issues[+a.getAttribute('data-i')]);
			a.classList.toggle('is-done', !!(collector ? own : read)[k]);
		});
		/* an issue in two parts counts once, done when its first part is */
		var whole = issues.filter(function (is) { return !(is.part > 1); }), done = collector ? own : read;
		var n = whole.filter(function (is) { return done[keyOf(is)]; }).length;
		if (!n) { box.innerHTML = ''; return; }
		var next = whole.filter(function (is) { return !done[keyOf(is)]; })[0];
		var pct = Math.round(n / whole.length * 100);
		box.innerHTML = '<div class="sv-prog">' +
			'<p><b>' + e(collector ? L('في مكتبتك ', 'In your collection: ') : L('قرأت ', 'You have read ')) + e(App.num(n)) + L(' من ', ' of ') + e(App.num(whole.length)) + '</b>' +
				(n === whole.length ? ' — ' + e(collector ? L('السلسلة كاملة عندك.', 'the whole series.') : L('قرأت السلسلة كلها.', 'the whole series.')) : '') + '</p>' +
			'<span class="sv-prog-bar" role="progressbar" aria-valuemin="0" aria-valuemax="' + whole.length + '" aria-valuenow="' + n + '"><i style="width:' + pct + '%"></i></span>' +
			(next ? '<a class="sv-prog-next" href="' + e(App.issueHref(id, next)) + '">' + e(collector ? L('ينقصك: ', 'Missing: ') : L('التالي: ', 'Next: ')) +
				(next.n != null ? '#' + e(App.num(next.n)) + ' ' : '') + '«' + e(t(next.title)) + '» ' + L('←', '→') + '</a>' : '') +
		'</div>';
	},

	/* ---------- «شاركوه السلسلة»: the writers who wrote the series with him (seriesInfo[id].with), each linked to their page ---------- */
	withHtml: function (id) {
		var App = window.App, e = App.esc, t = App.t, tx = App.tx, L = App.L, P = window.People;
		var list = (((App.data().seriesInfo || {})[id] || {}).with || []).map(function (x) { return { p: P && P.byId(x.id), role: x.role }; }).filter(function (x) { return x.p; });
		if (!list.length) return '';
		/* a series that grew out of his work (Lasheen) is its writer's own: they are not «with him» but who made it */
		var own = (window.WorksShared.anySeries(id) || {}).inspired;
		return '<section class="d-block d-wide sv-with"><div class="d-head"><h3>' + (own ? L('صاحب السلسلة', 'Created by') : L('شاركوه السلسلة', 'They shared the series with him') + ' <small>(' + App.num(list.length) + ')</small>') + '</h3>' +
				'<a href="writers.html">' + L('الكُتّاب ←', 'Writers →') + '</a></div>' +
			'<div class="sv-with-list">' + list.map(function (x) {
				var p = x.p, name = t(p.name);
				return '<a class="sv-person" href="' + e(P.href(p)) + '">' +
					'<span class="sv-person-pic"' + (p.photo ? ' style="background-image:url(&quot;' + e(p.photo.url) + '&quot;)"' : '') + '>' + (p.photo ? '' : e(P.initials(name, App.lang))) + '</span>' +
					'<span class="sv-person-txt"><b>' + e(name) + '</b>' + (x.role ? '<small>' + tx(x.role) + '</small>' : '') + '<i>' + L(p.female ? 'صفحتها ←' : 'صفحته ←', 'Their page →') + '</i></span></a>';
			}).join('') + '</div></section>';
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
	   Every series has one: the library of its lead, or of the series itself when it has none. The lead (or the series'
	   own picture) is the backdrop; every issue cover hides on top of it and scales / fades in as the cursor gets near.
	   The closest cover shows its title. The panel is sized to the issues: short for a dozen or fewer, middling up to 30. */
	proximityHtml: function (s, hero, items) {
		var App = window.App, S = window.WorksShared, e = App.esc, tx = App.tx, L = App.L;
		/* a series can give its library a picture of its own (seriesInfo[id].library), else the hero's portrait */
		var lib = ((App.data().seriesInfo || {})[s.id] || {}).library || {};
		var img = lib.image || (hero && hero.image) || '', credit = lib.image ? lib.credit : hero && hero.imageCredit;
		var name = hero ? hero.name : s.title, role = hero ? hero.role : s.tagline;
		var n = items.length, size = n <= 12 ? ' prox-few' : n <= 30 ? ' prox-mid' : '';
		return '<section class="d-block d-wide"><div class="d-head"><h3>' + L('مكتبة ', 'The library of ') + tx(name) + '</h3>' +
				'<span class="prox-hint">' + L('حرّك المؤشر فوق الصورة لتظهر الأعداد', 'Move your cursor over the picture to reveal the issues') + '</span></div>' +
			/* a short series gets a shorter panel, its covers bigger and spread across the middle */
			'<div class="prox' + (img ? ' has-img' : '') + size + '" id="prox" style="--n:' + n + ';--c:' + e(s.color || '#3a1414') + (img ? ';background-image:url(\'' + e(img) + '\')' : '') + '">' +
				(img ? '' : '<div class="prox-art" aria-hidden="true"><span class="pa-name">' + tx(name) + '</span>' + (role ? '<span class="pa-role">' + tx(role) + '</span>' : '') + '</div>') +
				'<ul class="prox-grid">' + items.map(function (x) {
					/* a cover from beyond the series' own issues says what it is: «خاص 3», «كوميكس», «لاشين 5» */
					var is = x.is, num = is.n != null ? App.num(is.n) + (is.part ? '/' + App.num(is.part) : '') : '';
					var tagged = x.tag ? (x.tag + (/ $/.test(x.tag) || !num ? '' : ' ') + num).trim() : num;
					/* a book of the series that isn't on the site (seriesInfo[id].libraryMore) brings its own cover and link, and says whose it is */
					return '<li' + (x.tag || x.href ? ' class="is-extra"' : '') + '><a href="' + e(x.href || App.issueHref(x.sid, is)) + '"' + (x.href ? ' target="_blank" rel="noopener"' : '') + ' data-n="' + e(tagged) + '" data-t="' + e(App.t(is.title) + (x.by ? ' — ' + App.t(x.by) : '')) + '">' +
						S.miniCover({ img: x.cover || S.issueCover(x.sid, is), color: x.color || s.color, title: App.t(is.title), num: tagged }) + '</a></li>';
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

window.PAGE = {
	id: 'writers',
	title: { ar: 'الكُتّاب', en: 'Writers' },
	strings: {
		eyebrow: { ar: 'حول العرّاب', en: 'Around the Godfather' },
		title: { ar: 'الكُتّاب', en: 'The Writers' },
		lead: {
			ar: 'رفاق الطريق، ومن شاركوه الغلاف، ومن قدّم لهم وقدّموا له، والجيل الذي خرج من عباءته. اسحب كتابًا من الرف لتقرأ قصته.',
			en: 'Fellow travellers, co-authors, the writers he introduced and who introduced him, and the generation that grew up reading him. Pull a book off the shelf to read its story.'
		}
	},

	shelves: [
		{ key: 'collaborators', title: { ar: 'كتبوا معه', en: 'Wrote with him' }, text: { ar: 'كُتّاب شاركوه تأليف كتاب أو سلسلة.', en: 'Writers who co-authored a book or series with him.' }, palette: ['#6e1a14', '#8a3b12', '#4f2a1c'] },
		{ key: 'introductions', title: { ar: 'المقدّمات', en: 'Introductions' }, text: { ar: 'كتب قدّم لها العرّاب أو كتب كلمة على غلافها، وكُتّاب قدّموا لكتبه.', en: 'Books he wrote forewords or back-cover words for, and writers who wrote forewords for his.' }, palette: ['#1f4e5a', '#2c3e64', '#3d5a4a'] },
		{ key: 'dedications', title: { ar: 'أهدوا إليه', en: 'Dedicated to him' }, text: { ar: 'كُتّاب ومترجمون أهدوا كتبهم إلى العرّاب.', en: 'Writers and translators who dedicated a book to him.' }, palette: ['#5a1f3a', '#3a2a5a', '#6b3a1c'] },
		{ key: 'influenced', title: { ar: 'تأثّروا به', en: 'Influenced by him' }, text: { ar: 'كُتّاب يقولون بأنفسهم إنهم خرجوا من عباءته.', en: 'Writers who, in their own words, grew up under his influence.' }, palette: ['#7a5a1c', '#5b3a6e', '#8c2f39'] },
		{ key: 'contemporaries', title: { ar: 'رفاق الطريق', en: 'Contemporaries' }, text: { ar: 'زملاء جيله ورفاقه في عالم كتب الجيب.', en: 'Peers from his generation and from the world of pocket books.' }, palette: ['#334155', '#4b3b2a', '#2f4f3f'] },
		{ key: 'translated', title: { ar: 'ترجم لهم', en: 'Authors he translated' }, text: { ar: 'كُتّاب عالميون نقل أعمالهم إلى العربية.', en: 'Foreign authors whose work he brought into Arabic.' }, palette: ['#3b3b58', '#5a3d2b', '#28485a'] }
	],

	/* a shelf's entries grouped by person, in first-appearance order: one book per writer */
	group: function (list) {
		var P = window.People, out = [], at = {};
		list.forEach(function (w) {
			var k = P.key(w.name);
			if (!(k in at)) { at[k] = out.length; out.push({ person: P.ofEntry(w), entries: [] }); }
			out[at[k]].entries.push(w);
		});
		return out;
	},

	/* one entry inside a writer's card: its covers, what it was, the story, the source */
	entry: function (w) {
		var App = window.App, e = App.esc, t = App.t, L = App.L, meta = window.People.meta(w), S = window.WorksShared;
		return '<div class="wr-entry">' +
			((w.cover || w.back) ? '<div class="wr-entry-covers">' +
				(w.cover ? '<figure class="wr-photo wr-cover"><img src="' + e(w.cover) + '" alt="' + e(t(w.book)) + '" loading="lazy"></figure>' : '') +
				/* the back cover with his words, or the dedication page, opens at full size */
				(w.back ? '<figure class="wr-photo wr-cover wr-back"><a href="' + e(w.back) + '" target="_blank" rel="noopener"><img src="' + e(w.back) + '" alt="' + e((w.direction === 'dedication' ? L('صفحة الإهداء — ', 'Dedication page — ') : L('الغلاف الخلفي — ', 'Back cover — ')) + t(w.book)) + '" loading="lazy"></a><figcaption>' + (w.direction === 'dedication' ? L('صفحة الإهداء ↗', 'Dedication page ↗') : L('الغلاف الخلفي ↗', 'Back cover ↗')) + '</figcaption></figure>' : '') +
			'</div>' : '') +
			(meta ? '<p class="meta">' + e(meta) + '</p>' : '') +
			App.paras(w.text) +
			(w.source ? '<a href="' + e(w.source) + '" target="_blank" rel="noopener">' + L('المصدر ↗', 'Source ↗') + '</a>' : '') +
			(w.book && w.book.en && S ? ' <a class="wr-book" href="' + e(S.entryBookHref(w)) + '">' + L('صفحة الكتاب ←', 'Book page →') + '</a>' : '') +
			(w.shop ? ' <a class="wr-shop" href="' + e(w.shop.url) + '" target="_blank" rel="noopener">' + L('اشترِه من ', 'Buy it from ') + t(w.shop.name) + ' ↗</a>' : '') +
			this.books(w) +
		'</div>';
	},

	/* the books an entry names (w.books: a work's id, "s:<series>" or "i:<series>:<n>"), as a row of covers, each leading to its page */
	books: function (w) {
		var App = window.App, d = App.data(), e = App.esc, t = App.t, S = window.WorksShared;
		if (!S || !(w.books || []).length) return '';
		var list = w.books.map(function (id) {
			var m = /^([si]):([a-z0-9-]+)(?::(\d+))?$/.exec(id);
			if (!m) { var wk = App.findWork(id); return wk && { title: wk.title, href: 'book.html?id=' + wk.id, img: S.coverOf((d.bookInfo || {})[wk.id]), color: wk.color }; }
			var sr = S.anySeries(m[2]);
			if (!sr) return null;
			if (m[1] === 's') return { title: sr.s.title, href: S.seriesHref(m[2]), img: S.seriesCover(m[2]), color: sr.s.color };
			var is = S.seriesIssues(m[2]).filter(function (x) { return x.n === +m[3]; })[0];
			return is && { title: is.title, href: App.issueHref(m[2], is), img: S.issueCover(m[2], is), color: sr.s.color };
		}).filter(Boolean);
		return list.length ? '<div class="wr-bks">' + list.map(function (b) {
			return '<a class="wr-bk" href="' + e(b.href) + '">' + (b.img ? '<img src="' + e(b.img) + '" alt="" loading="lazy">' : S.miniCover({ color: b.color, title: t(b.title) })) + '<span>' + App.tx(b.title) + '</span></a>';
		}).join('') + '</div>' : '';
	},

	shelf: null,

	render: function () {
		var App = window.App, d = App.data(), e = App.esc, t = App.t, tx = App.tx, L = App.L, P = window.People, self = this;
		var W = d.writers || {};
		var grouped = {};
		this.shelves.forEach(function (sh) { grouped[sh.key] = self.group(W[sh.key] || []); });
		var shelves = this.shelves.filter(function (sh) { return grouped[sh.key].length; });
		if (!shelves.some(function (sh) { return sh.key === self.shelf; })) this.shelf = shelves.length ? shelves[0].key : null;

		/* one shelf for every connection with a chip for each (as Every issue on the works page): all the spines stand on it,
		   the chips show one connection's at a time, and a pulled spine opens its writer in a panel under it */
		var html = '<section class="section" id="wr-shelves"><div class="wrap">' +
			'<div class="section-head"><div><h2>' + L('رفوف الكُتّاب', 'The writers’ shelves') + '</h2><p id="wr-hint"></p></div>' +
				'<div class="chips issues-tabs" id="wr-tabs" role="group" aria-label="' + e(L('حسب العلاقة', 'By connection')) + '">' + shelves.map(function (sh) {
					return '<button type="button" class="chip" data-s="' + sh.key + '" aria-pressed="false">' + tx(sh.title) + '<span class="count">' + App.num(grouped[sh.key].length) + '</span></button>';
				}).join('') + '</div></div>' +
			'<div class="shelf" id="wr-shelf">' + shelves.map(function (sh, si) {
				return grouped[sh.key].map(function (g, i) {
					var h = 160 + ((i * 37 + si * 13) % 60);
					var c = sh.palette[i % sh.palette.length];
					return '<button type="button" class="spine" id="wr-' + sh.key + '-' + g.person.id + '" data-s="' + sh.key + '" aria-expanded="false" aria-controls="wr-card" data-i="' + i + '" style="--h:' + h + 'px;--c:' + c + '"><span>' + tx(g.person.name) + '</span>' +
						(g.entries.length > 1 ? '<b class="spine-n">' + App.num(g.entries.length) + '</b>' : '') + '</button>';
				}).join('');
			}).join('') + '</div>' +
			'<div class="issue-card"><div class="issue-panel wr-panel" id="wr-card" aria-live="polite" hidden></div></div>' +
		'</div></section>' +
		this.directory() +
		'<section class="section"><div class="wrap"><div class="shelf-block rise" id="sources-block"></div></div></section>';

		var content = document.getElementById('content');
		content.innerHTML = html;
		/* a writer's photo, a cover or a back cover in the opened panel shows full size, as on the timeline */
		if (!content.dataset.pics) {
			content.dataset.pics = '1';
			content.addEventListener('click', function (ev) {
				var img = ev.target.closest('.wr-panel .wr-photo img');
				if (!img) return;
				ev.preventDefault();
				App.showPic(img.getAttribute('src'), img.alt);
			});
		}
		this.wave();
		this.bindDirectory();

		var tabs = document.getElementById('wr-tabs'), shelfEl = document.getElementById('wr-shelf'), card = document.getElementById('wr-card');
		var close = function () { card.hidden = true; shelfEl.querySelectorAll('.spine').forEach(function (x) { x.setAttribute('aria-expanded', 'false'); }); };
		var show = function (key) {
			self.shelf = key;
			var sh = shelves.filter(function (x) { return x.key === key; })[0];
			tabs.querySelectorAll('.chip').forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-s') === key)); });
			shelfEl.querySelectorAll('.spine').forEach(function (b) { b.hidden = b.getAttribute('data-s') !== key; });
			document.getElementById('wr-hint').innerHTML = sh ? tx(sh.text) : '';
			close();
		};
		this.showShelf = show;
		tabs.onclick = function (ev) { var b = ev.target.closest('.chip'); if (b) show(b.getAttribute('data-s')); };
		show(this.shelf);

		this.openSpine = function (b) {
			var open = b.getAttribute('aria-expanded') === 'true';
			close();
			if (open) return;
			b.setAttribute('aria-expanded', 'true');
			var g = grouped[b.getAttribute('data-s')][+b.getAttribute('data-i')], p = g.person;
			card.style.setProperty('--c', b.style.getPropertyValue('--c') || '#6e1a14');
			/* the same panel as an issue pulled off a shelf on the works page: the writer's photo, then what they shared with him */
			card.innerHTML = '<button type="button" class="ip-close" aria-label="' + e(L('إغلاق', 'Close')) + '">✕</button>' +
				'<div class="ip-cover">' + (p.photo ? '<figure class="wr-photo"><img src="' + e(p.photo.url) + '" alt="' + e(t(p.name)) + '" referrerpolicy="no-referrer">' +
					(p.photo.file ? '<figcaption><a href="' + e(p.photo.file) + '" target="_blank" rel="noopener">' + (p.photo.license ? e(p.photo.license) + ' · ' : '') + (p.photo.source ? tx(p.photo.source) : 'Wikimedia Commons') + '</a></figcaption>' : '') + '</figure>'
					: '<span class="wr-initials">' + e(P.initials(t(p.name), App.lang)) + '</span>') + '</div>' +
				'<div class="ip-body"><h4>' + tx(p.name) + '</h4>' +
					'<p class="sub">' + e(App.alt(p.name)) + '</p>' +
					g.entries.map(function (w) { return self.entry(w); }).join('') +
					'<p class="wr-more"><a class="ip-more" href="' + e(P.href(p)) + '">' + L('صفحة ' + t(p.name) + ' ←', t(p.name) + '’s page →') + '</a> ' + App.fixLink(t(p.name)) + '</p></div>';
			card.hidden = false;
			card.querySelector('.ip-close').onclick = function () { close(); b.focus(); };
			var r = card.getBoundingClientRect();
			if (r.bottom > window.innerHeight) card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
		};
		shelfEl.onclick = function (ev) { var b = ev.target.closest('.spine'); if (b) self.openSpine(b); };
		if (!this.escBound) { this.escBound = true; document.addEventListener('keydown', function (ev) { var c = document.getElementById('wr-card'); if (ev.key === 'Escape' && c && !c.hidden) close(); }); }

		/* sources */
		var src = d.sources || [];
		var sb = document.getElementById('sources-block');
		if (src.length) {
			sb.innerHTML = '<h3>' + L('المراجع', 'Sources') + '</h3><p>' + L('المصادر العامة التي جُمعت منها بيانات الموقع.', 'Public sources used to compile this site.') + '</p>' +
				'<ul style="margin:0;padding-inline-start:20px;font-family:var(--f-latin);font-size:15px">' +
				src.map(function (s) { return '<li><a href="' + e(s.url) + '" target="_blank" rel="noopener">' + e(s.label || s.url) + '</a></li>'; }).join('') + '</ul>';
		} else sb.remove();

		/* #wr-shelf-id turns to that writer's shelf and pulls their book off it */
		this.onHash = function () {
			/* #all (and the old authors.html) opens at the top of the A to Z list */
			/* (instantly, once the page has loaded: a smooth scroll this long gets cut off) */
			if (location.hash === '#all') {
				var go = function () { var a = document.getElementById('all'); if (a) a.scrollIntoView({ block: 'start', behavior: 'instant' }); };
				if (document.readyState === 'complete') setTimeout(go, 60); else window.addEventListener('load', function () { setTimeout(go, 60); }, { once: true });
				return;
			}
			var at = document.getElementById(decodeURIComponent(location.hash.slice(1)));
			if (at && at.classList.contains('spine') && at.getAttribute('data-s') !== self.shelf) self.showShelf(at.getAttribute('data-s'));
			App.focusHash(function (el) { if (el.classList.contains('spine') && el.getAttribute('aria-expanded') !== 'true') self.openSpine(el); });
		};
		this.onHash();
	},

	/* every writer once, A to Z, each card leading to their own page; the shelves filter it */
	dirShelf: '',
	directory: function () {
		var App = window.App, P = window.People, self = this;
		var e = App.esc, t = App.t, L = App.L;
		var bare = function (p) { return t(p.name).replace(/^(د\.|Dr\.)\s*/, ''); };
		var all = P.all().slice().sort(function (a, b) { return bare(a).localeCompare(bare(b), App.lang); });
		var label = function (sh, p) { return L(p && p.female && sh.arF ? sh.arF : sh.ar, sh.en); };
		var chips = '<button type="button" class="dir-chip" data-shelf=""' + (!this.dirShelf ? ' aria-pressed="true"' : '') + '>' + L('الكل', 'All') + ' <small>' + App.num(all.length) + '</small></button>' +
			P.SHELVES.map(function (s) {
				var n = all.filter(function (p) { return p.shelves.indexOf(s) >= 0; }).length;
				return n ? '<button type="button" class="dir-chip" style="--c:' + P.LABELS[s].c + '" data-shelf="' + s + '"' + (self.dirShelf === s ? ' aria-pressed="true"' : '') + '>' + e(label(P.LABELS[s])) + ' <small>' + App.num(n) + '</small></button>' : '';
			}).join('');
		var card = function (p) {
			var n = t(p.name), first = P.LABELS[p.shelves[0]];
			return '<a class="dir-card" href="' + e(P.href(p)) + '" data-shelves="' + p.shelves.join(' ') + '" style="--c:' + first.c + '">' +
				'<span class="dir-pic"' + (p.photo ? ' style="background-image:url(&quot;' + e(p.photo.url) + '&quot;)"' : '') + '>' + (p.photo ? '' : e(P.initials(n, App.lang))) + '</span>' +
				'<span class="dir-body"><b>' + e(n) + '</b><small>' + e(App.alt(p.name)) + '</small>' +
					'<span class="dir-tags">' + p.shelves.map(function (s) { return '<i style="--c:' + P.LABELS[s].c + '">' + e(label(P.LABELS[s], p)) + '</i>'; }).join('') + '</span></span>' +
			'</a>';
		};
		return '<section class="section" id="all"><div class="wrap">' +
			'<div class="section-head"><div><h2>' + L('كل الكُتّاب أبجديًا', 'All the writers, A to Z') + '</h2>' +
				'<p>' + L('كل كاتب مرة واحدة، ولكل منهم صفحته وما جمعه بالعرّاب. اختر رفًّا لتصفية القائمة.', 'Every writer once, each with a page on what they shared with him. Pick a shelf to filter the list.') + '</p></div></div>' +
			'<div class="dir-chips" role="group" aria-label="' + e(L('حسب العلاقة', 'By connection')) + '">' + chips + '</div>' +
			'<div class="dir-grid">' + all.map(card).join('') + '</div>' +
		'</div></section>';
	},
	bindDirectory: function () {
		var self = this, sec = document.getElementById('all');
		if (!sec) return;
		var apply = function () {
			sec.querySelectorAll('.dir-chip').forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-shelf') === self.dirShelf)); });
			sec.querySelectorAll('.dir-card').forEach(function (c) { c.hidden = !!self.dirShelf && (' ' + c.getAttribute('data-shelves') + ' ').indexOf(' ' + self.dirShelf + ' ') < 0; });
		};
		sec.querySelector('.dir-chips').addEventListener('click', function (ev) {
			var b = ev.target.closest('.dir-chip');
			if (!b) return;
			self.dirShelf = b.getAttribute('data-shelf');
			apply();
		});
		apply();
	},

	/* the wave of people under the page title: every writer once, as a circle with their photo or initials,
	   linking to their own page */
	wave: function () {
		var App = window.App, e = App.esc, t = App.t, P = window.People;
		var hero = document.querySelector('.page-hero .wrap');
		if (!hero) return;
		var old = hero.querySelector('.people-wave');
		if (old) old.remove();
		var shelfTitle = {};
		this.shelves.forEach(function (sh) { shelfTitle[sh.key] = t(sh.title); });
		var people = P.all();
		if (!people.length) return;
		var div = document.createElement('div');
		div.className = 'people-wave';
		div.innerHTML = '<div class="pw-rows">' +
			'<ul class="pw-row pw-main">' + people.map(function (p, i) {
				var name = t(p.name);
				return '<li style="--i:' + i + '"><a class="pw-person" href="' + e(P.href(p)) + '" data-name="' + e(name) + '" aria-label="' + e(name + ' — ' + p.shelves.map(function (s) { return shelfTitle[s]; }).join('، ')) + '"' + (p.photo ? ' style="background-image:url(&quot;' + e(p.photo.url) + '&quot;)"' : '') + '>' + (p.photo ? '' : e(P.initials(name, App.lang))) + '</a></li>';
			}).join('') + '</ul>' +
			'<ul class="pw-row pw-ghost" aria-hidden="true">' + people.map(function (p, i) { return '<li style="--i:' + i + '"></li>'; }).join('') + '</ul>' +
		'</div>';
		hero.insertBefore(div, hero.firstChild);
	}
};

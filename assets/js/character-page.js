/* character.html?id=<character id> — one page per character.
   The main characters get a themed page from data-heroes.js: Refaat's bestiary of legends, Alaa's medical case files from
   Africa, Abeer's doors into other worlds; the Virus's infected files; and the heroes of the novels, the turns of their
   story beside their book. Everyone gets their appearances and the people around them. */
window.PAGE = {
	id: 'characters',
	title: { ar: 'شخصية', en: 'Character' },

	render: function () {
		var App = window.App, d = App.data(), S = window.WorksShared;
		var e = App.esc, t = App.t, tx = App.tx, L = App.L;
		var id = new URLSearchParams(location.search).get('id') || '';
		var c = App.byId(d.characters, id);
		var root = document.getElementById('content');

		/* only the leads have a page; anyone else is shown on the characters page, at their card */
		if (c && !c.main) { location.replace(App.charHref(id)); return; }
		if (!c) {
			root.innerHTML = '<section class="page-hero"><div class="wrap"><p class="eyebrow">404</p><h1>' + L('لم نجد هذه الشخصية', 'Character not found') + '</h1>' +
				'<p class="lead"><a href="characters.html">' + L('كل الشخصيات', 'All characters') + '</a></p></div></section>';
			return;
		}
		this.title = c.name;
		App.applyLang();

		var hero = (d.heroes || {})[id] || null;
		var ser = S.anySeries(c.work);
		var work = !ser ? App.findWork(c.work) : null;
		var color = (ser && ser.s.color) || (work && work.color) || '#5a2a22';
		var issues = ser ? S.seriesIssues(c.work) : [];
		var byN = function (n) { for (var i = 0; i < issues.length; i++) if (+issues[i].n === +n && !issues[i].part) return issues[i]; for (var j = 0; j < issues.length; j++) if (+issues[j].n === +n) return issues[j]; return null; };
		var name = t(c.name);
		/* (the initial: past «د.», and past the article «ال» / «The») */
		var mono = (App.lang === 'ar' ? (c.name.ar || '') : (c.name.en || '')).replace(/^(د\.|Dr\.)\s*/, '').replace(/^(ال|The\s+)/, '').charAt(0);

		/* an issue as a small cover that links to its page (and can be dragged to My lists) */
		var issueCard = function (is) {
			if (!is) return '';
			var key = S.issueKey(c.work, is), info = (d.issueInfo || {})[key] || {};
			return '<a class="ch-issue" href="' + e(S.bookHref(key)) + '">' +
				S.miniCover({ img: S.coverOf(info), color: color, num: App.num(is.n), title: t(is.title) }) +
				/* a drawn cover already shows the title; a photo of a real cover gets it as a caption */
				(S.coverOf(info) ? '<span class="ch-issue-t">' + tx(is.title) + '</span>' : '') +
				(is.year ? '<span class="ch-issue-y">' + e(App.num(is.year)) + '</span>' : '') +
			'</a>';
		};

		/* a drawn full-length figure (AKT.charFigures) stands free of the frame; else their picture; else their initial */
		var figure = (d.charFigures || {})[id];
		var portrait = figure
			? '<img src="' + e(figure) + '" alt="' + e(name) + '">'
			: c.image
			? '<img src="' + e(c.image) + '" alt="' + e(name) + '">'
			/* a novel's hero with no picture of their own stands on the novel's cover */
			: work && S.coverOf((d.bookInfo || {})[work.id])
			? '<img class="ch-bookcover" src="' + e(S.coverOf((d.bookInfo || {})[work.id])) + '" alt="' + e(t(work.title)) + '">'
			: '<span class="ch-mono" aria-hidden="true">' + e(mono) + '</span>';

		var backdrop = {
			ghosts: '<div class="ch-fog" aria-hidden="true"><span></span><span></span><span></span></div>',
			medicine: '<svg class="ch-ecg" aria-hidden="true" viewBox="0 0 1200 120" preserveAspectRatio="none"><path d="M0 60 H380 L400 60 L415 30 L430 95 L450 10 L470 110 L485 60 H700 L715 45 L730 75 L745 60 H1200" /></svg>',
			fantasy: '<div class="ch-stars" aria-hidden="true"></div><div class="ch-portal" aria-hidden="true"></div>',
			/* the Virus: columns of code falling behind him */
			code: '<div class="ch-code" aria-hidden="true">' + [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map(function (i) { var bits = ''; for (var k = 0; k < 28; k++) bits += (i * 7 + k * 13) % 3 ? '1' : '0'; return '<span style="--i:' + i + '">' + bits + '</span>'; }).join('') + '</div>',
			/* Utopia: the wall, gold on its inner side, grey outside */
			wall: '<div class="ch-wall ch-wall-' + e((hero && hero.side) || 'in') + '" aria-hidden="true"><span></span></div>',
			/* al-Senga: a scrawled, unreadable word on a wall */
			graffiti: '<div class="ch-graffiti" aria-hidden="true"><b>؟</b></div>',
			/* Like Icarus: a burning sun, and feathers drifting down */
			sun: '<div class="ch-sun" aria-hidden="true"></div><div class="ch-feathers" aria-hidden="true">' + [0, 1, 2, 3, 4, 5].map(function (i) { return '<i style="--i:' + i + '"></i>'; }).join('') + '</div>',
			/* In the Rats’ Corridor: darkness, and a small light that follows the pointer */
			dark: '<div class="ch-dark" aria-hidden="true"></div>'
		}[hero && hero.theme] || '';

		var html = '<section class="ch-hero' + (hero ? ' ch-theme-' + e(hero.theme) : '') + '" style="--c:' + e(color) + '">' + backdrop +
			'<div class="wrap ch-hero-grid">' +
				'<div class="ch-portrait' + (figure ? ' is-figure' : '') + '">' + portrait +
					/* Refaat's lantern: its glow breathes and flickers, and moths circle it */
					(figure && hero && hero.theme === 'ghosts' ? '<span class="ch-lantern" aria-hidden="true"><b class="glow"></b>' +
						[0, 1, 2].map(function (i) { return '<i class="moth" style="--i:' + i + '"><b></b></i>'; }).join('') + '</span>' : '') + '</div>' +
				'<div class="ch-text">' +
					'<p class="eyebrow">' + (hero ? tx(hero.eyebrow) + ' · ' : '') +
						(ser ? '<a href="' + e(S.seriesHref(c.work)) + '">' + tx(ser.s.title) + '</a>' : work ? App.workLink(c.work) : '') + '</p>' +
					'<h1>' + e(name) + '</h1>' +
					'<p class="ch-alt">' + e(App.alt(c.name)) + '</p>' +
					'<p class="ch-role">' + tx(c.role) + '</p>' +
					/* a hero's longer introduction replaces the card text, which says the same in brief */
					App.paras(hero ? hero.intro : c.desc) +
					(c.traits && c.traits.length ? '<div class="traits">' + c.traits.map(function (x) { return '<span>' + tx(x) + '</span>'; }).join('') + '</div>' : '') +
				'</div>' +
			'</div></section>';

		/* the themed section */
		if (hero && ser) {
			html += '<section class="section ch-themed ch-theme-' + e(hero.theme) + '-body"><div class="wrap">' +
				'<div class="section-head"><div><h2>' + tx(hero.sectionTitle) + '</h2><p>' + tx(hero.sectionText) + '</p></div></div>' +
				(hero.places ? '<div class="ch-places" role="list">' + hero.places.map(function (p) {
					var is = byN(p.issue), key = is && S.issueKey(c.work, is), cov = is && S.coverOf((d.issueInfo || {})[key] || {});
					/* the outline of its country with a dot on the place, as the pin had its head; else the pin */
					var mark = p.map
						? '<svg class="ch-place-map" viewBox="0 0 24 24" aria-hidden="true"><path d="' + e(p.map.d) + '" fill-rule="evenodd"/>' +
							'<circle class="ring" cx="' + p.map.dot[0] + '" cy="' + p.map.dot[1] + '" r="2.4"/><circle cx="' + p.map.dot[0] + '" cy="' + p.map.dot[1] + '" r="1.3"/></svg>'
						: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 22s7-7.2 7-12.5A7 7 0 0 0 5 9.5C5 14.8 12 22 12 22z" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="9.5" r="2.5" fill="currentColor"/></svg>';
					return '<a role="listitem" class="ch-place' + (cov ? ' has-cover' : '') + '" href="' + e(is ? S.bookHref(key) : '#') + '">' + mark +
						'<b>' + tx(p.name) + '</b><span>' + tx(p.where) + '</span>' +
						(is ? '<small>' + L('العدد ', 'Issue ') + e(App.num(is.n)) + '</small>' : '') +
						(cov ? '<img class="ch-place-cover" src="' + e(cov) + '" alt="" loading="lazy">' : '') + '</a>';
				}).join('') + '</div>' : '') +
				hero.groups.map(function (g) {
					var list = g.issues.map(byN).filter(Boolean);
					if (!list.length) return '';
					return '<div class="ch-group rise"' + (g.kind ? ' data-kind="' + e(g.kind) + '"' : '') + '>' +
						'<h3>' + tx(g.title) + ' <small>' + e(App.num(list.length)) + '</small></h3>' +
						(g.text ? '<p>' + tx(g.text) + '</p>' : '') +
						'<div class="ch-issues">' + list.map(issueCard).join('') + '</div></div>';
				}).join('') +
			'</div></section>';
		}

		/* a novel's hero: the turns of their story, and the book beside them (and, for In the Rats’ Corridor, the issue it grew from) */
		if (hero && hero.beats) {
			var rel = hero.related && S.anySeries(hero.related.series), relIs = rel && S.seriesIssues(hero.related.series).filter(function (x) { return +x.n === hero.related.issue && !(x.part > 1); })[0];
			var bookCard = function (img, href, title, sub, col) {
				return '<a class="ch-book rise" href="' + e(href) + '">' + S.miniCover({ img: img, color: col || color, title: t(title) }) + '<b>' + tx(title) + '</b>' + (sub ? '<span>' + sub + '</span>' : '') + '</a>';
			};
			html += '<section class="section ch-themed ch-theme-' + e(hero.theme) + '-body"><div class="wrap">' +
				'<div class="section-head"><div><h2>' + tx(hero.sectionTitle) + '</h2><p>' + tx(hero.sectionText) + '</p></div></div>' +
				'<div class="ch-story">' +
					'<ol class="ch-beats">' + hero.beats.map(function (b, i) { return '<li class="ch-beat rise" style="--i:' + i + '"><span class="ch-beat-n">' + e(App.num(i + 1)) + '</span><h3>' + tx(b.title) + '</h3><p>' + tx(b.text) + '</p></li>'; }).join('') + '</ol>' +
					'<div class="ch-books">' +
						(work ? bookCard(S.coverOf((d.bookInfo || {})[work.id]), App.workHref(work.id), work.title, work.year ? App.num(work.year) : '', work.color) : '') +
						(relIs ? bookCard(S.issueCover(hero.related.series, relIs), S.bookHref(S.issueKey(hero.related.series, relIs)), relIs.title, L('أصلها: ', 'Grew from: ') + tx(rel.s.title) + ' ' + e(App.num(relIs.n)), rel.s.color) : '') +
					'</div>' +
				'</div></div></section>';
		}

		/* appearances: a hero is in every issue; others are listed by the issues that name them */
		var seen = issues.filter(function (is) { return (is.chars || []).indexOf(id) >= 0; });
		if (hero && ser) {
			html += '<section class="section"><div class="wrap"><p class="ch-every">' +
				L('يظهر في كل أعداد ', 'Appears in every issue of ') + '<a href="' + e(S.seriesHref(c.work)) + '">' + tx(ser.s.title) + '</a>' +
				' (' + e(App.num(issues.length)) + ')' + '</p></div></section>';
		} else if (seen.length) {
			html += '<section class="section"><div class="wrap">' +
				'<div class="section-head"><div><h2>' + L('أين يظهر', 'Where they appear') + '</h2></div></div>' +
				'<div class="ch-issues">' + seen.map(issueCard).join('') + '</div></div></section>';
		}

		/* in their words */
		var qs = (d.quotes || []).map(function (q, i) { return { q: q, i: i }; }).filter(function (x) { return x.q.character === id; });
		if (qs.length || (c.quote && t(c.quote))) {
			html += '<section class="section"><div class="wrap">' +
				'<div class="section-head"><div><h2>' + L('بلسانه', 'In their words') + '</h2></div></div>' +
				'<div class="ch-quotes">' +
					(c.quote && t(c.quote) ? '<blockquote>' + tx(c.quote) + '</blockquote>' : '') +
					qs.map(function (x) { return '<blockquote>' + tx(x.q.text) + ' <a href="quotes.html#q-' + x.i + '">↗</a></blockquote>'; }).join('') +
				'</div></div></section>';
		}

		/* the people around them */
		var others = (d.characters || []).filter(function (o) { return o.work === c.work && o.id !== id; });
		if (others.length) {
			html += '<section class="section"><div class="wrap">' +
				'<div class="section-head"><div><h2>' + L('من حوله', 'Around them') + '</h2></div></div>' +
				'<div class="ch-people">' + others.map(function (o) {
					var on = t(o.name), om = (App.lang === 'ar' ? (o.name.ar || '') : (o.name.en || '')).replace(/^(د\.|Dr\.)\s*/, '').charAt(0);
					return '<a class="ch-person rise" href="' + e(App.charHref(o.id)) + '" style="--c:' + e(color) + '">' +
						(o.image ? '<img src="' + e(o.image) + '" alt="">' : '<span class="ch-mono" aria-hidden="true">' + e(om) + '</span>') +
						'<b>' + e(on) + '</b><span>' + tx(o.role) + '</span></a>';
				}).join('') + '</div></div></section>';
		}

		html += '<section class="section"><div class="wrap"><p class="ch-back"><a href="characters.html">' + L('→ كل الشخصيات', '← All characters') + '</a></p></div></section>';
		root.innerHTML = html;

		/* in the darkness, a small light follows the pointer */
		var dark = hero && hero.theme === 'dark' && root.querySelector('.ch-hero');
		if (dark) dark.addEventListener('pointermove', function (ev) { var r = dark.getBoundingClientRect(); dark.style.setProperty('--mx', (ev.clientX - r.left) + 'px'); dark.style.setProperty('--my', (ev.clientY - r.top) + 'px'); });
	}
};

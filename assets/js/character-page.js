/* character.html?id=<character id> — one page per character.
   The three series heroes get a themed section from data-heroes.js: Refaat's bestiary of
   legends, Alaa's medical case files from Africa, Abeer's doors into other worlds.
   Everyone else gets their card, their appearances and the people around them. */
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
		var mono = (App.lang === 'ar' ? (c.name.ar || '') : (c.name.en || '')).replace(/^(د\.|Dr\.)\s*/, '').charAt(0);

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

		var portrait = c.image
			? '<img src="' + e(c.image) + '" alt="' + e(name) + '">'
			: '<span class="ch-mono" aria-hidden="true">' + e(mono) + '</span>';

		var backdrop = {
			ghosts: '<div class="ch-fog" aria-hidden="true"><span></span><span></span><span></span></div>',
			medicine: '<svg class="ch-ecg" aria-hidden="true" viewBox="0 0 1200 120" preserveAspectRatio="none"><path d="M0 60 H380 L400 60 L415 30 L430 95 L450 10 L470 110 L485 60 H700 L715 45 L730 75 L745 60 H1200" /></svg>',
			fantasy: '<div class="ch-stars" aria-hidden="true"></div><div class="ch-portal" aria-hidden="true"></div>'
		}[hero && hero.theme] || '';

		var html = '<section class="ch-hero' + (hero ? ' ch-theme-' + e(hero.theme) : '') + '" style="--c:' + e(color) + '">' + backdrop +
			'<div class="wrap ch-hero-grid">' +
				'<div class="ch-portrait">' + portrait + '</div>' +
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
					var is = byN(p.issue);
					return '<a role="listitem" class="ch-place" href="' + e(is ? S.bookHref(S.issueKey(c.work, is)) : '#') + '">' +
						'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 22s7-7.2 7-12.5A7 7 0 0 0 5 9.5C5 14.8 12 22 12 22z" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="9.5" r="2.5" fill="currentColor"/></svg>' +
						'<b>' + tx(p.name) + '</b><span>' + tx(p.where) + '</span>' +
						(is ? '<small>' + L('العدد ', 'Issue ') + e(App.num(is.n)) + '</small>' : '') + '</a>';
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
	}
};

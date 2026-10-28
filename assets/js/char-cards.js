/* The character cards (assets/css/char-cards.css), shared by the characters page and a series' page:
   a card per character that flips to its description; the leads at full size, everyone else smaller. */
window.CharCards = {
	/* what a card shows of a character: its picture, first appearance and how often they appear.
	   The picture is a cut-out from AKT.charFigures when there is one, else their own image, else the cover of
	   their first appearance, else the first issue of the series they lead, else the cover of their book. */
	info: function (c) {
		var App = window.App, d = App.data(), S = window.WorksShared, t = App.t;
		var ser = S && S.anySeries(c.work), w = App.findWork(c.work);
		var out = { color: (ser && ser.s.color) || (w && w.color) || '#5a2a22', figure: '', cutout: false, first: '', count: 0 };
		var issues = ser ? S.seriesIssues(c.work) : [];
		var seen = issues.filter(function (is) { return (is.chars || []).indexOf(c.id) >= 0; });
		var lead = ser && ser.s.hero === c.id;
		if (lead) out.count = ser.s.count || issues.length;
		else out.count = seen.length;
		var firstIs = seen[0] || (lead ? issues[0] : null);
		if (firstIs) out.first = (firstIs.n != null ? App.num(firstIs.n) + ' · ' : '') + t(firstIs.title);
		var cut = (d.charFigures || {})[c.id];
		if (cut) { out.figure = cut; out.cutout = true; }
		else if (c.image) out.figure = c.image;
		else if (firstIs) out.figure = S.issueCover(c.work, firstIs);
		if (!out.figure && ser) out.figure = S.seriesCover(c.work);
		if (!out.figure && w) out.figure = S.coverOf((d.bookInfo || {})[c.work]);
		return out;
	},

	card: function (c) {
		var App = window.App, d = App.data(), e = App.esc, t = App.t, tx = App.tx, L = App.L;
		var w = App.findWork(c.work);
		var info = this.info(c);
		var name = t(c.name);
		var plain = name.replace(/^(د\.|Dr\.)\s*/, '');
		var row = function (k, v) { return v ? '<li><span>' + e(k) + '</span>' + v + '</li>' : ''; };
		return '<div class="char-cell cc-cell rise" id="c-' + e(c.id) + '" data-work="' + e(c.work) + '">' +
			/* (a main character's page is a link laid over the card's foot, so it shows on the front and the back as it turns) */
			'<div class="cc-hold' + (c.main ? ' has-go' : '') + '" style="--c:' + e(info.color) + '">' +
			'<button type="button" class="char cc" aria-pressed="false" style="--c:' + e(info.color) + '">' +
			/* the character, standing over the card's corner */
			(info.figure ? '<span class="cc-figure' + (info.cutout ? ' is-cutout' : '') + '" aria-hidden="true"><img src="' + e(info.figure) + '" alt="" loading="lazy"></span>' : '') +
			'<span class="cc-inner">' +
				'<span class="cc-face cc-front"><span class="cc-main">' +
					/* the pen's two-tone name: the first letter big in English; Arabic letters join, so there the first word */
					'<span class="cc-name">' + (App.lang === 'ar'
						? '<b class="w">' + e(plain.split(' ')[0]) + '</b>' + (plain.indexOf(' ') > 0 ? '<span>' + e(plain.slice(plain.indexOf(' ') + 1)) + '</span>' : '')
						: '<b>' + e(plain.charAt(0)) + '</b>' + e(plain.slice(1))) + '</span>' +
					'<span class="cc-alt">' + e(App.alt(c.name)) + '</span>' +
					'<ul class="cc-info">' +
						row(L('العمل', 'From'), w ? tx(w.title) : '') +
						row(L('الدور', 'Role'), tx(c.role)) +
						row(L('أول ظهور', 'First seen'), info.first ? e(info.first) : '') +
						row(L('الظهور', 'Appears in'), info.count ? e(App.num(info.count) + ' ' + (info.count === 1 ? L('عدد', 'issue') : info.count === 2 ? L('عددين', 'issues') : L(info.count <= 10 ? 'أعداد' : 'عددًا', 'issues'))) : '') +
					'</ul>' +
					(c.traits && c.traits.length ? '<span class="cc-traits">' + c.traits.slice(0, 3).map(function (x) { return '<i>' + tx(x) + '</i>'; }).join('') + '</span>' : '') +
					'<span class="flip-hint">' + L('اقلب البطاقة ↻', 'Flip the card ↻') + '</span>' +
				'</span></span>' +
				'<span class="cc-face cc-back"><span class="cc-main">' +
					'<span class="cc-back-name">' + e(name) + '</span>' +
					'<span class="cc-text">' + App.paras(c.desc) +
						(c.quote && t(c.quote) ? '<blockquote>' + tx(c.quote) + '</blockquote>' : '') +
						(d.quotes || []).map(function (q) { return q.character === c.id ? '<blockquote>' + tx(q.text) + '</blockquote>' : ''; }).join('') +
					'</span>' +
				'</span></span>' +
			'</span>' +
		'</button>' +
			(c.main ? '<a class="cc-go" href="character.html?id=' + e(c.id) + '">' + L('صفحة ' + plain + ' ←', plain + '’s page →') + '</a>' : '') +
			'</div>' +
			/* (a main character's page is the button on the card) */
			'<div class="char-meta">' + [w ? L('من ', 'From ') + App.workLink(c.work) : '', App.fixLink(name)].filter(Boolean).join(' · ') + '</div>' +
		'</div>';
	},

	/* a click on a card flips it */
	bindFlip: function (root) {
		root.addEventListener('click', function (ev) {
			var c = ev.target.closest('.char');
			if (!c) return;
			var on = !c.classList.contains('is-flipped');
			c.classList.toggle('is-flipped', on);
			c.setAttribute('aria-pressed', String(on));
		});
	}
};

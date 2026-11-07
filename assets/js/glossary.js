/* glossary.html — «قاموس العرّاب», a page of its own again (it was a section of the quotes page for a while, and
   quotes.html#glossary leads here): the phrases readers know him and his heroes by (AKT.glossary, data-pages.js) — each with who
   says it, what it means and when it comes, the issue or book it is from, and where it was checked. By speaker, or searched.
   GlossarySection draws it (html) and wires it (wire); the page (PAGE, below) puts it under its title. */
window.GlossarySection = {
	title: { ar: 'قاموس العرّاب', en: 'The Godfather’s phrasebook' },
	lead: {
		ar: '«حتى تحترق النجوم» و«جعلوه فانجعل» وأخواتهما: العبارات التي عرفنا بها رفعت إسماعيل وعبير وعلاء عبد العظيم، وصوته هو في مقالاته، مع معناها ومن أين جاءت.',
		en: '“Until the stars burn out”, “they made him, so he was made” and the rest: the lines we know Refaat Ismail, Abeer, Alaa Abdel Azim and his own column voice by, with what they mean and where they come from.'
	},
	WHO: [['refaat', { ar: 'رفعت إسماعيل', en: 'Refaat Ismail' }], ['abeer', { ar: 'عبير', en: 'Abeer' }], ['alaa', { ar: 'علاء عبد العظيم', en: 'Alaa Abdel Azim' }],
		['akt', { ar: 'بصوته هو', en: 'In his own voice' }], ['other', { ar: 'وغيرهم', en: 'And others' }]],
	who: 'all', q: '',

	html: function () {
		var App = window.App, e = App.esc, L = App.L, t = App.t, list = App.data().glossary || [];
		if (!list.length) return '';
		var count = {}; list.forEach(function (x) { count[x.who] = (count[x.who] || 0) + 1; });
		/* (its title and lead are the page's own, above) */
		return '<section class="section gl" id="glossary"><div class="wrap">' +
			'<div class="gl-bar"><div class="chips"><button type="button" class="chip" data-w="all" aria-pressed="true">' + e(L('الكل', 'All')) + ' <b>' + e(App.num(list.length)) + '</b></button>' +
				this.WHO.filter(function (w) { return count[w[0]]; }).map(function (w) { return '<button type="button" class="chip" data-w="' + w[0] + '" aria-pressed="false">' + e(App.t(w[1])) + ' <b>' + e(App.num(count[w[0]])) + '</b></button>'; }).join('') +
			'</div><input type="search" class="gl-q" placeholder="' + e(L('ابحث عن عبارة…', 'Look up a phrase…')) + '"></div>' +
			'<div class="gl-list"></div>' +
			'<p class="gl-note">' + e(L('كل عبارة نُقلت كما في مصدرها؛ تعرف عبارة أخرى؟ أرسلها من «تواصل وساهم».', 'Each phrase is given as its source has it; know another? Send it from Contact & contribute.')) + ' <a href="contact.html">' + e(L('تواصل وساهم ←', 'Contact & contribute →')) + '</a></p>' +
		'</div></section>';
	},

	wire: function () {
		var self = this, root = document.querySelector('.gl');
		if (!root) return;
		root.querySelector('.chips').onclick = function (ev) {
			var b = ev.target.closest('[data-w]');
			if (!b) return;
			self.pick(b.getAttribute('data-w'));
			/* (the address names the speaker, to share: quotes.html#glossary-refaat) */
			history.replaceState(null, '', self.who === 'all' ? '#glossary' : '#glossary-' + self.who);
		};
		root.querySelector('.gl-q').oninput = function (ev) { self.q = ev.target.value.trim(); self.list(); };
		/* «صورة»: the phrase as a picture to post (quote-image.js), in the voice of who says it */
		root.querySelector('.gl-list').onclick = function (ev) {
			var b = ev.target.closest('.gl-pic');
			if (b && window.QuoteImage) self.picture((window.App.data().glossary || [])[+b.getAttribute('data-g')]);
		};
		this.list();
	},

	/* one speaker's phrases ('all' for every one), the search cleared */
	pick: function (w) {
		var root = document.querySelector('.gl');
		if (!root || !root.querySelector('[data-w="' + w + '"]')) w = 'all';
		this.who = w; this.q = '';
		if (root) {
			root.querySelectorAll('[data-w]').forEach(function (x) { x.setAttribute('aria-pressed', String(x.getAttribute('data-w') === w)); });
			root.querySelector('.gl-q').value = '';
		}
		this.list();
	},

	/* the phrase as a picture: said by its speaker (his own name for his voice and the rest), with its issue's or book's cover */
	picture: function (x) {
		if (!x) return;
		var App = window.App, S = window.WorksShared, d = App.data(), L = App.L, w = this.where(x.where), who = {};
		this.WHO.forEach(function (v) { who[v[0]] = v[1]; });
		var k = x.where || '', by = who[x.who] && x.who !== 'akt' && x.who !== 'other' ? App.t(who[x.who]) : L('أحمد خالد توفيق', 'Ahmed Khaled Tawfik');
		window.QuoteImage.open({ text: L(x.phrase, x.en) }, { by: by, cite: w ? w.label : '', cover: (S && (S.coverOf((d.issueInfo || {})[k]) || S.coverOf((d.bookInfo || {})[k]))) || '' });
	},

	/* where a phrase is from: an issue's page (with its series and number) or a book's */
	where: function (k) {
		var App = window.App, S = window.WorksShared, t = App.t;
		if (!k) return null;
		var m = /^([a-z]+)-(\d+)$/.exec(k);
		if (m) {
			var ser = S.anySeries(m[1]), is = ser && S.seriesIssues(m[1]).filter(function (x) { return +x.n === +m[2]; })[0];
			if (is) return { href: 'book.html?id=' + k, label: t(ser.s.title) + ' ' + App.num(is.n) + ': ' + t(is.title) };
		}
		var w = App.findWork(k);
		return w ? { href: S.bookHref(w.id), label: t(w.title) } : null;
	},

	list: function () {
		var App = window.App, e = App.esc, t = App.t, L = App.L, self = this;
		var who = {}; this.WHO.forEach(function (w) { who[w[0]] = w[1]; });
		var bare = function (s) { return String(s).replace(/[ًٌٍَُِّْـ«»]/g, '').toLowerCase(); }, q = bare(this.q);
		var all = App.data().glossary || [], rows = all.filter(function (x) {
			return (self.who === 'all' || x.who === self.who) && (!q || bare(x.phrase + ' ' + x.en + ' ' + t(x.meaning)).indexOf(q) >= 0);
		});
		document.querySelector('.gl-list').innerHTML = rows.map(function (x) {
			var w = self.where(x.where);
			return '<article class="gl-item gl-' + e(x.who) + '" id="g-' + all.indexOf(x) + '"><p class="gl-who">' + e(t(who[x.who] || who.other)) + '</p>' +
				'<h3>' + e(x.phrase) + '</h3>' + (App.lang === 'en' ? '' : '<p class="gl-en" dir="ltr">' + e(x.en) + '</p>') +
				(App.lang === 'en' ? '<p class="gl-en-main">' + e(x.en) + '</p>' : '') +
				'<p class="gl-mean">' + e(t(x.meaning)) + '</p>' +
				'<p class="gl-from">' + (w ? '<a href="' + e(w.href) + '">' + e(w.label) + '</a>' : '') + (x.source ? (w ? ' · ' : '') + '<a href="' + e(x.source) + '" target="_blank" rel="noopener">' + e(L('المصدر ↗', 'Source ↗')) + '</a>' : '') +
				((w || x.source) ? ' · ' : '') + '<button type="button" class="gl-pic" data-g="' + all.indexOf(x) + '">' + e(L('صورة', 'Image')) + '</button></p></article>';
		}).join('') || '<p class="gl-note">' + e(L('لا عبارة تطابق.', 'No phrase matches.')) + '</p>';
	}
};

/* the page: its title and lead, the phrasebook under them; glossary.html#glossary-refaat opens on one speaker's phrases, and
   #g-3 on one phrase, every speaker's shown so it is there */
window.PAGE = {
	id: 'glossary',
	title: window.GlossarySection.title,
	strings: {
		eyebrow: { ar: 'عبارات لا تُنسى', en: 'Lines that stay' },
		title: window.GlossarySection.title,
		lead: window.GlossarySection.lead
	},

	/* the band (page-hero.js): an open dictionary in the dark — one entry at a time in the middle, its headword large in its
	   speaker's colour, the English under it, what it means and who says it, turning over every few seconds; the other entries
	   in columns at its sides, rising slowly as pages do when leafed through; and a thumb index down the edge, a tab a speaker,
	   each opening the phrasebook on that speaker's lines */
	SPEAKER: { refaat: '#e0633a', abeer: '#c9a2e8', alaa: '#6fb8a8', akt: '#d9a45a', other: '#a39a8a' },
	band: function (d, A) {
		var self = window.PAGE, G = window.GlossarySection, e = A.esc, t = A.t, L = A.L, list = d.glossary || [];
		if (!list.length) return '';
		var who = {}; G.WHO.forEach(function (w) { who[w[0]] = w[1]; });
		var short = function (s, n) { s = String(s || ''); return s.length > n ? s.slice(0, n - 1).trim() + '…' : s; };
		/* the entries the middle turns through: the shorter lines, so each fits */
		self._feat = list.map(function (x, i) { return i; }).filter(function (i) { return list[i].phrase.length <= 34; });
		var entry = function (x) {
			return '<p class="gb-e" style="--c:' + (self.SPEAKER[x.who] || self.SPEAKER.other) + '"><b>' + e(x.phrase) + '</b> ' + e(short(t(x.meaning), 70)) + '</p>';
		};
		var col = function (from) {
			var rows = list.filter(function (x, i) { return i % 2 === from; }).map(entry).join('');
			return '<div class="gb-col"><div class="gb-run">' + rows + rows + '</div></div>';
		};
		var tabs = G.WHO.filter(function (w) { return w[0] !== 'other'; }).map(function (w) {
			return '<a class="gb-tab" href="#glossary-' + w[0] + '" style="--c:' + self.SPEAKER[w[0]] + '">' + e(t(w[1])) + '</a>';
		}).join('');
		setTimeout(function () { self.bandWire(); }, 0);
		return '<div class="gb">' + col(0) +
			'<div class="gb-page"><span class="gb-rule" aria-hidden="true"></span><div class="gb-feat"></div><span class="gb-rule" aria-hidden="true"></span></div>' +
			col(1) + '<nav class="gb-tabs">' + tabs + '</nav></div>';
	},
	/* the middle entry, and the next every five seconds (still, for those who would rather no motion); a thumb tab picks a speaker */
	bandWire: function () {
		var self = this, App = window.App, e = App.esc, t = App.t, L = App.L, G = window.GlossarySection;
		var box = document.querySelector('.gb-feat'), list = App.data().glossary || [], feat = this._feat || [];
		if (!box || !feat.length) return;
		var who = {}; G.WHO.forEach(function (w) { who[w[0]] = w[1]; });
		var k = Math.floor(Math.random() * feat.length);
		var show = function () {
			var i = feat[k % feat.length], x = list[i];
			box.style.setProperty('--c', self.SPEAKER[x.who] || self.SPEAKER.other);
			box.innerHTML = '<a href="#g-' + i + '"><span class="gb-who">' + e(t(who[x.who] || who.other)) + '</span>' +
				'<b class="gb-head">' + e(x.phrase) + '</b>' + '<i class="gb-en" dir="ltr">' + e(x.en) + '</i>' +
				'<span class="gb-mean">' + e(String(t(x.meaning)).split(/[.؛:]/)[0]) + '</span></a>';
			box.classList.remove('is-in'); void box.offsetWidth; box.classList.add('is-in');
		};
		show();
		clearInterval(this._gbTimer);
		if (!matchMedia('(prefers-reduced-motion: reduce)').matches) this._gbTimer = setInterval(function () { k++; show(); }, 5200);
		var ph = box.closest('.ph');
		if (ph) ph.removeAttribute('aria-hidden'); /* (its tabs and entry are links) */
		var root = box.closest('.gb');
		root.onclick = function (ev) {
			var a = ev.target.closest('a');
			if (!a) return;
			var m = /#glossary-([a-z]+)$/.exec(a.getAttribute('href')), g = /#g-(\d+)$/.exec(a.getAttribute('href'));
			ev.preventDefault();
			if (m) G.pick(m[1]);
			else if (g) G.pick('all');
			history.replaceState(null, '', a.getAttribute('href'));
			var to = document.getElementById(g ? 'g-' + g[1] : 'glossary');
			if (to) { to.scrollIntoView({ behavior: 'smooth', block: g ? 'center' : 'start' }); if (g) { to.classList.remove('is-target'); void to.offsetWidth; to.classList.add('is-target'); } }
		};
	},
	render: function () {
		var G = window.GlossarySection, h = location.hash, sp = /^#glossary-([a-z]+)$/.exec(h);
		document.getElementById('content').innerHTML = G.html() +
			'<section class="section"><div class="wrap"><p class="gl-note">' + window.App.esc(window.App.L('وللاقتباسات الأطول، بمصادرها، صفحة ', 'And for his longer quotes, with their sources, there is ')) +
				'<a href="quotes.html">' + window.App.esc(window.App.L('«اقتباسات»', 'Quotes')) + '</a>.</p></div></section>';
		G.wire();
		if (sp) G.pick(sp[1]);
		window.App.focusHash();
	}
};

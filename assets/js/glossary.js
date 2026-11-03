/* «قاموس العرّاب» — a section of the quotes page (quotes.html#glossary; glossary.html, once a page of its own, leads there): the
   phrases readers know him and his heroes by (AKT.glossary, data-pages.js) — each with who says it, what it means and when it
   comes, the issue or book it is from, and where it was checked. By speaker, or searched. quotes.js draws it (html) and wires it (wire). */
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
		return '<section class="section gl" id="glossary"><div class="wrap">' +
			'<h2 class="pp-title">' + e(t(this.title)) + '</h2><p class="pp-lead">' + e(t(this.lead)) + '</p>' +
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
				'<p class="gl-from">' + (w ? '<a href="' + e(w.href) + '">' + e(w.label) + '</a>' : '') + (x.source ? (w ? ' · ' : '') + '<a href="' + e(x.source) + '" target="_blank" rel="noopener">' + e(L('المصدر ↗', 'Source ↗')) + '</a>' : '') + '</p></article>';
		}).join('') || '<p class="gl-note">' + e(L('لا عبارة تطابق.', 'No phrase matches.')) + '</p>';
	}
};

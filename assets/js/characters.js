window.PAGE = {
	id: 'characters',
	title: { ar: 'الشخصيات', en: 'Characters' },
	strings: {
		eyebrow: { ar: 'سكان الصفحات', en: 'The people on the page' },
		title: { ar: 'الشخصيات', en: 'The Characters' },
		lead: {
			ar: 'عجوزٌ نحيل يدخّن ويسخر من كل شيء، وفتاةٌ عادية تعيش الأساطير، وطبيبٌ شاب في أدغال أفريقيا. اضغط على البطاقة لتقلبها.',
			en: 'A thin, chain-smoking old sceptic, an ordinary girl who lives inside legends, a young doctor in the African bush. Tap a card to flip it.'
		}
	},
	filter: 'all',

	render: function () {
		var App = window.App, d = App.data(), e = App.esc, t = App.t, tx = App.tx, self = this;
		var chars = d.characters || [];

		/* group by the work they belong to, in the order works first appear */
		var groups = [];
		chars.forEach(function (c) { if (groups.indexOf(c.work) < 0) groups.push(c.work); });

		var html = '<section class="section"><div class="wrap">' +
			'<div class="section-head"><div></div><div class="chips" id="char-filters" role="group" aria-label="' + (App.lang === 'ar' ? 'تصفية حسب العمل' : 'Filter by work') + '">' +
				'<button type="button" class="chip" data-f="all">' + (App.lang === 'ar' ? 'الكل' : 'All') + '<span class="count">' + App.num(chars.length) + '</span></button>' +
				groups.map(function (g) {
					var w = App.findWork(g);
					var n = chars.filter(function (c) { return c.work === g; }).length;
					return '<button type="button" class="chip" data-f="' + e(g) + '">' + (w ? tx(w.title) : e(g)) + '<span class="count">' + App.num(n) + '</span></button>';
				}).join('') +
			'</div></div>' +
			'<div class="char-grid" id="char-grid">' +
				chars.map(function (c) {
					var w = App.findWork(c.work);
					var color = (w && w.color) || '#5a2a22';
					var name = t(c.name);
					var mono = App.lang === 'ar' ? ((c.name && c.name.ar) || '').charAt(0) : ((c.name && c.name.en) || '').charAt(0);
					return '<div class="char-cell rise" id="c-' + e(c.id) + '" data-work="' + e(c.work) + '"><button type="button" class="char" aria-pressed="false" style="--c:' + e(color) + '">' +
						'<div class="char-inner">' +
							'<div class="char-face char-front">' +
								'<span class="char-mono" aria-hidden="true">' + e(mono) + '</span>' +
								'<span class="char-series">' + (w ? tx(w.title) : '') + '</span>' +
								'<span class="char-name">' + e(name) + '</span>' +
								'<span class="char-role">' + tx(c.role) + '</span>' +
								'<span class="flip-hint">' + (App.lang === 'ar' ? 'اقلب البطاقة ↻' : 'Flip the card ↻') + '</span>' +
							'</div>' +
							'<div class="char-face char-back">' +
								'<h4>' + e(name) + '</h4>' +
								App.paras(c.desc) +
								(c.traits && c.traits.length ? '<div class="traits">' + c.traits.map(function (x) { return '<span>' + tx(x) + '</span>'; }).join('') + '</div>' : '') +
								(c.quote && t(c.quote) ? '<blockquote>' + tx(c.quote) + '</blockquote>' : '') +
								(d.quotes || []).map(function (q, qi) {
									return q.character === c.id ? '<blockquote>' + tx(q.text) + '</blockquote>' : '';
								}).join('') +
							'</div>' +
						'</div>' +
					'</button>' +
						'<div class="char-meta">' + (w ? App.L('من ', 'From ') + App.workLink(c.work) + ' · ' : '') + App.fixLink(name) + '</div>' +
					'</div>';
				}).join('') +
			'</div></div></section>';

		document.getElementById('content').innerHTML = html;

		var grid = document.getElementById('char-grid');
		var filters = document.getElementById('char-filters');
		function apply() {
			grid.querySelectorAll('.char-cell').forEach(function (c) { c.hidden = !(self.filter === 'all' || c.getAttribute('data-work') === self.filter); });
			filters.querySelectorAll('.chip').forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-f') === self.filter)); });
		}
		filters.addEventListener('click', function (ev) {
			var b = ev.target.closest('.chip');
			if (!b) return;
			self.filter = b.getAttribute('data-f');
			apply();
		});
		grid.addEventListener('click', function (ev) {
			var c = ev.target.closest('.char');
			if (!c) return;
			var on = !c.classList.contains('is-flipped');
			c.classList.toggle('is-flipped', on);
			c.setAttribute('aria-pressed', String(on));
		});
		apply();
		this.apply = apply;
		this.onHash();
	},

	/* #c-id: show that character's card and flip it to the description */
	onHash: function () {
		var self = this;
		window.App.focusHash(function (el) {
			if (el.hidden) { self.filter = 'all'; self.apply(); }
			var card = el.querySelector('.char');
			if (card && !card.classList.contains('is-flipped')) {
				setTimeout(function () { card.classList.add('is-flipped'); card.setAttribute('aria-pressed', 'true'); }, 600);
			}
		});
	}
};

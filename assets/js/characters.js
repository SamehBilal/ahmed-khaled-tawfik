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
			/* the leads at full size; everyone else follows as the same card, smaller */
			'<div class="char-grid cc-grid" id="char-grid">' +
				chars.map(function (c) { return window.CharCards.card(c); }).join('') +
			'</div></div></section>';

		document.getElementById('content').innerHTML = html;

		/* the others move to a grid of their own under the leads, where their cards are drawn smaller */
		var grid = document.getElementById('char-grid');
		var minor = document.createElement('div');
		minor.className = 'char-grid cc-grid cc-minor';
		minor.id = 'char-grid-minor';
		chars.forEach(function (c) { if (!c.main) minor.appendChild(document.getElementById('c-' + c.id)); });
		var minorHead = document.createElement('h2');
		minorHead.className = 'cc-minor-head';
		minorHead.textContent = App.L('شخصيات أخرى', 'Other characters');
		grid.after(minorHead, minor);
		var filters = document.getElementById('char-filters');
		function apply() {
			[grid, minor].forEach(function (g) {
				var shown = 0;
				g.querySelectorAll('.char-cell').forEach(function (c) { c.hidden = !(self.filter === 'all' || c.getAttribute('data-work') === self.filter); if (!c.hidden) shown++; });
				g.hidden = !shown;
				if (g === minor) minorHead.hidden = !shown;
			});
			filters.querySelectorAll('.chip').forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-f') === self.filter)); });
		}
		filters.addEventListener('click', function (ev) {
			var b = ev.target.closest('.chip');
			if (!b) return;
			self.filter = b.getAttribute('data-f');
			apply();
		});
		window.CharCards.bindFlip(grid.parentNode);
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

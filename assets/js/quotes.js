window.PAGE = {
	id: 'quotes',
	title: { ar: 'اقتباسات', en: 'Quotes' },
	strings: {
		eyebrow: { ar: 'بكلماته', en: 'In his words' },
		title: { ar: 'اقتباسات', en: 'Quotes' },
		lead: {
			ar: 'تنتشر على الإنترنت اقتباسات كثيرة منسوبة إليه خطأً. هنا فقط ما وجدنا له مصدرًا موثوقًا — مع رابط المصدر تحت كل اقتباس.',
			en: 'Many quotes are falsely attributed to him online. This page holds only those we could trace to a reliable source — with the link under each one.'
		}
	},
	filter: 'all',

	render: function () {
		var App = window.App, d = App.data(), e = App.esc, t = App.t, tx = App.tx, L = App.L, self = this;
		var quotes = d.quotes || [];

		if (!quotes.length) {
			document.getElementById('content').innerHTML = '<section class="section"><div class="wrap"><p class="empty-note">' +
				L('لم تُضف اقتباسات بعد.', 'No quotes have been added yet.') + '</p></div></section>';
			return;
		}

		/* filter chips: one per source (work id, or "other" for interviews/articles) */
		var groups = [];
		quotes.forEach(function (q) { var g = q.work || 'other'; if (groups.indexOf(g) < 0) groups.push(g); });
		var chip = function (id, label, n) {
			return '<button type="button" class="chip" data-f="' + e(id) + '">' + label + '<span class="count">' + App.num(n) + '</span></button>';
		};

		document.getElementById('content').innerHTML =
			'<section class="section"><div class="wrap">' +
				'<div class="section-head"><div></div><div class="chips" id="q-filters" role="group" aria-label="' + L('تصفية حسب المصدر', 'Filter by source') + '">' +
					chip('all', L('الكل', 'All'), quotes.length) +
					groups.map(function (g) {
						var w = App.findWork(g);
						var n = quotes.filter(function (q) { return (q.work || 'other') === g; }).length;
						return chip(g, w ? tx(w.title) : L('لقاءات ومقالات', 'Interviews & articles'), n);
					}).join('') +
				'</div></div>' +
				'<div class="quote-grid" id="q-grid">' + quotes.map(function (q, i) {
					var other = App.alt(q.text);
					var from = q.work ? App.workLink(q.work) : tx(q.from);
					if (q.work && q.from && t(q.from) && t(q.from) !== t((App.findWork(q.work) || {}).title)) from += ' — ' + tx(q.from);
					return '<figure class="quote rise" id="q-' + i + '" data-g="' + e(q.work || 'other') + '">' +
						'<blockquote>' + tx(q.text) + '</blockquote>' +
						(other ? '<p class="alt" lang="' + (App.lang === 'ar' ? 'en' : 'ar') + '">' + e(other) + '</p>' : '') +
						'<figcaption>' +
							'<span>— ' + from + (q.character ? ' · ' + App.charLink(q.character) : '') + '</span>' +
							(q.source ? '<a href="' + e(q.source) + '" target="_blank" rel="noopener">' + L('المصدر ↗', 'Source ↗') + '</a>' : '') +
							'<span class="q-actions">' +
								'<button type="button" data-act="copy" data-i="' + i + '">' + L('نسخ', 'Copy') + '</button>' +
								'<button type="button" data-act="link" data-i="' + i + '">' + L('رابط', 'Link') + '</button>' +
								'<button type="button" data-act="image" data-i="' + i + '">' + L('صورة', 'Image') + '</button>' +
							'</span>' +
						'</figcaption>' +
					'</figure>';
				}).join('') + '</div>' +
			'</div></section>';

		var grid = document.getElementById('q-grid'), filters = document.getElementById('q-filters');
		function apply() {
			grid.querySelectorAll('.quote').forEach(function (f) { f.hidden = !(self.filter === 'all' || f.getAttribute('data-g') === self.filter); });
			filters.querySelectorAll('.chip').forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-f') === self.filter)); });
		}
		this.apply = apply;
		filters.onclick = function (ev) {
			var b = ev.target.closest('.chip');
			if (b) { self.filter = b.getAttribute('data-f'); apply(); }
		};
		grid.onclick = function (ev) {
			var b = ev.target.closest('button[data-act]');
			if (!b) return;
			var i = +b.getAttribute('data-i'), q = quotes[i], act = b.getAttribute('data-act');
			var cite = t(q.from) || t((App.findWork(q.work) || {}).title);
			var text = '«' + t(q.text) + '»\n— ' + L('أحمد خالد توفيق', 'Ahmed Khaled Tawfik') + (cite ? '، ' + cite : '');
			var url = location.href.split('#')[0] + '#q-' + i;
			if (act === 'copy') self.copy(text, b);
			else if (act === 'link') {
				if (navigator.share) navigator.share({ title: document.title, text: text, url: url }).catch(function () {});
				else self.copy(url, b);
			} else if (act === 'image') self.image(q, cite);
		};
		apply();
		this.featured();
		App.focusHash(function (el) { if (el.hidden) { self.filter = 'all'; apply(); } });
	},

	/* one quote in a speech bubble under the page title; "another" picks a new one */
	featured: function () {
		var App = window.App, d = App.data(), e = App.esc, t = App.t, L = App.L, self = this;
		var quotes = (d.quotes || []).filter(function (q) { return t(q.text) && t(q.text).length < 220; });
		var hero = document.querySelector('.page-hero .wrap');
		if (!hero || !quotes.length) return;
		var box = hero.querySelector('.qb-hero');
		if (!box) { box = document.createElement('figure'); box.className = 'qb-hero'; hero.insertBefore(box, hero.firstChild); }
		if (this._qb == null || this._qb >= quotes.length) this._qb = Math.floor(Math.random() * quotes.length);
		var q = quotes[this._qb], i = (d.quotes || []).indexOf(q);
		var cite = t(q.from) || t((App.findWork(q.work) || {}).title);
		box.innerHTML = '<blockquote>' + e(t(q.text)) + '</blockquote>' +
			'<figcaption><span>— ' + L('أحمد خالد توفيق', 'Ahmed Khaled Tawfik') + (cite ? '<br><em>' + e(cite) + '</em>' : '') + '</span>' +
				'<a href="#q-' + i + '">' + L('في القائمة ↓', 'In the list ↓') + '</a>' +
				'<button type="button" class="qb-next">' + L('اقتباس آخر', 'Another quote') + '</button></figcaption>';
		box.querySelector('.qb-next').onclick = function () {
			box.classList.add('swap');
			setTimeout(function () {
				var n = self._qb;
				while (quotes.length > 1 && n === self._qb) n = Math.floor(Math.random() * quotes.length);
				self._qb = n; self.featured(); box.classList.remove('swap');
			}, 300);
		};
	},

	onHash: function () {
		var self = this;
		window.App.focusHash(function (el) { if (el.hidden) { self.filter = 'all'; self.apply(); } });
	},

	copy: function (text, btn) {
		var L = window.App.L, old = btn.textContent;
		var done = function () { if (window.Notify) window.Notify(L('نُسخ إلى الحافظة.', 'Copied to the clipboard.'), { type: 'success' }); btn.textContent = L('تم ✓', 'Done ✓'); setTimeout(function () { btn.textContent = old; }, 1400); };
		if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(done, function () {});
		else {
			var ta = document.createElement('textarea'); ta.value = text; document.body.appendChild(ta); ta.select();
			try { document.execCommand('copy'); done(); } catch (e) {} ta.remove();
		}
	},

	/* draw a 1080×1080 paper card for the quote and download it as PNG */
	image: function (q, cite) {
		var App = window.App, rtl = App.lang === 'ar';
		var c = document.createElement('canvas'); c.width = 1080; c.height = 1080;
		var x = c.getContext('2d');
		var draw = function (bg) {
			x.fillStyle = '#f3ead6'; x.fillRect(0, 0, 1080, 1080);
			if (bg) { x.globalAlpha = .55; x.drawImage(bg, 0, 0, 1080, 1080); x.globalAlpha = 1; }
			x.strokeStyle = '#9e2219'; x.lineWidth = 4; x.strokeRect(48, 48, 984, 984);
			x.fillStyle = 'rgba(158,34,25,.25)'; x.font = '220px Georgia, serif'; x.textAlign = 'center';
			x.fillText(rtl ? '«' : '“', 540, 300);

			x.direction = rtl ? 'rtl' : 'ltr';
			x.fillStyle = '#231d16'; x.textAlign = 'center';
			var font = rtl ? '"Reem Kufi", "Noto Naskh Arabic", serif' : '"Cormorant Garamond", Georgia, serif';
			var size = 58, lines;
			do { x.font = '600 ' + size + 'px ' + font; lines = wrap(App.t(q.text), 820); size -= 4; } while (lines.length * size * 1.55 > 520 && size > 28);
			var lh = (size + 4) * 1.55, y = 560 - (lines.length - 1) * lh / 2;
			lines.forEach(function (l, k) { x.fillText(l, 540, y + k * lh); });

			x.font = '400 34px ' + font; x.fillStyle = '#7a1c14';
			x.fillText('— ' + App.L('أحمد خالد توفيق', 'Ahmed Khaled Tawfik') + (cite ? (rtl ? '، ' : ', ') + cite : ''), 540, 900);
			x.font = '400 40px Lalezar, sans-serif'; x.fillStyle = '#9e2219';
			x.fillText('العرّاب', 540, 975);

			var a = document.createElement('a');
			a.download = 'akt-quote.png'; a.href = c.toDataURL('image/png'); a.click();
		};
		function wrap(text, max) {
			var words = text.split(/\s+/), out = [], line = '';
			words.forEach(function (w) {
				var test = line ? line + ' ' + w : w;
				if (x.measureText(test).width > max && line) { out.push(line); line = w; } else line = test;
			});
			if (line) out.push(line);
			return out;
		}
		var img = new Image();
		img.onload = function () { draw(img); };
		img.onerror = function () { draw(null); };
		img.src = 'assets/img/paper.jpg';
	}
};

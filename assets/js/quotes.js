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

	/* «صورة»: the quote as a picture to post — a square for a post or a tall one for a story or a WhatsApp status, on paper or by
	   night, with the book's cover when it has one; shared straight to the phone's apps where it can be, otherwise saved as PNG */
	image: function (q, cite) {
		var App = window.App, L = App.L, e = App.esc, self = this;
		var dlg = document.getElementById('qimg');
		if (!dlg) {
			dlg = document.createElement('dialog');
			dlg.id = 'qimg'; dlg.className = 'qimg';
			document.body.appendChild(dlg);
			dlg.addEventListener('click', function (ev) { if (ev.target === dlg) dlg.close(); });
		}
		var st = this._qimg = this._qimg || { size: 'square', look: 'paper' };
		var canShare = !!(navigator.canShare && window.File && navigator.canShare({ files: [new File([''], 'q.png', { type: 'image/png' })] }));
		var chips = function (k, opts) {
			return '<div class="qimg-opts" role="group">' + opts.map(function (o) {
				return '<button type="button" class="chip" data-' + k + '="' + o[0] + '" aria-pressed="' + (st[k] === o[0]) + '">' + e(o[1]) + '</button>';
			}).join('') + '</div>';
		};
		dlg.innerHTML = '<div class="qimg-in">' +
			'<div class="qimg-view"><canvas></canvas></div>' +
			'<div class="qimg-side">' +
				'<h3>' + e(L('الاقتباس صورةً', 'The quote as a picture')) + '</h3>' +
				chips('size', [['square', L('مربّع — منشور', 'Square — a post')], ['story', L('طولي — ستوري أو حالة', 'Tall — a story or status')]]) +
				chips('look', [['paper', L('ورق', 'Paper')], ['night', L('ليل', 'Night')]]) +
				'<div class="qimg-act">' +
					(canShare ? '<button type="button" class="share-btn qimg-share">' + e(L('شارك', 'Share')) + '</button>' : '') +
					'<button type="button" class="share-btn qimg-save">' + e(L('تحميل', 'Download')) + '</button>' +
					'<button type="button" class="share-btn qimg-close">' + e(L('إغلاق', 'Close')) + '</button>' +
				'</div>' +
			'</div></div>';
		var c = dlg.querySelector('canvas');
		var redraw = function () { self.drawQuote(c, q, cite, st); };
		dlg.querySelector('.qimg-side').addEventListener('click', function (ev) {
			var b = ev.target.closest('button');
			if (!b) return;
			if (b.hasAttribute('data-size') || b.hasAttribute('data-look')) {
				var k = b.hasAttribute('data-size') ? 'size' : 'look';
				st[k] = b.getAttribute('data-' + k);
				dlg.querySelectorAll('[data-' + k + ']').forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
				redraw();
			} else if (b.classList.contains('qimg-close')) dlg.close();
			else if (b.classList.contains('qimg-save')) {
				var a = document.createElement('a');
				a.download = 'akt-quote-' + st.size + '.png'; a.href = c.toDataURL('image/png'); a.click();
			} else if (b.classList.contains('qimg-share')) {
				c.toBlob(function (blob) {
					var file = new File([blob], 'akt-quote.png', { type: 'image/png' });
					navigator.share({ files: [file], text: '«' + App.t(q.text) + '» — ' + L('أحمد خالد توفيق', 'Ahmed Khaled Tawfik') }).catch(function () {});
				}, 'image/png');
			}
		});
		dlg.showModal();
		redraw();
	},

	/* the picture itself: 1080 wide, 1080 or 1920 tall */
	drawQuote: function (c, q, cite, st) {
		var App = window.App, rtl = App.lang === 'ar', S = window.WorksShared, d = App.data();
		var W = 1080, H = st.size === 'story' ? 1920 : 1080, night = st.look === 'night';
		c.width = W; c.height = H;
		var x = c.getContext('2d');
		var ink = night ? '#efe6d2' : '#231d16', red = night ? '#e0633a' : '#9e2219', dim = night ? '#c9b48e' : '#7a1c14';
		var font = rtl ? '"Reem Kufi", "Noto Naskh Arabic", serif' : '"Cormorant Garamond", Georgia, serif';
		/* the book's cover, when the quote's book has one of the site's own */
		var w = q.work && App.findWork(q.work), coverSrc = '';
		if (w && S) coverSrc = S.anySeries(q.work) ? S.seriesCover(q.work) : S.coverOf((d.bookInfo || {})[q.work]);
		if (coverSrc && /^https?:/.test(coverSrc)) coverSrc = '';
		var load = function (src) { return new Promise(function (ok) { if (!src) return ok(null); var i = new Image(); i.onload = function () { ok(i); }; i.onerror = function () { ok(null); }; i.src = src; }); };
		var fonts = document.fonts && document.fonts.load ? Promise.all(['600 58px "Reem Kufi"', '400 34px "Reem Kufi"', '400 40px Lalezar', '600 58px "Cormorant Garamond"']
			.map(function (f) { return document.fonts.load(f).catch(function () {}); })) : Promise.resolve();
		Promise.all([night ? null : load('assets/img/paper.jpg'), load(coverSrc), fonts]).then(function (got) {
			var paper = got[0], cover = got[1];
			/* the ground */
			if (night) {
				var g = x.createRadialGradient(W * .7, H * .2, 40, W * .5, H * .5, H * .9);
				g.addColorStop(0, '#2a1a14'); g.addColorStop(1, '#0b0c10');
				x.fillStyle = g; x.fillRect(0, 0, W, H);
			} else {
				x.fillStyle = '#f3ead6'; x.fillRect(0, 0, W, H);
				if (paper) { x.globalAlpha = .55; for (var py = 0; py < H; py += W) x.drawImage(paper, 0, py, W, W); x.globalAlpha = 1; }
			}
			x.strokeStyle = red; x.lineWidth = 4; x.strokeRect(48, 48, W - 96, H - 96);
			/* the space the words get, and the cover under them */
			var coverH = cover ? (H > W ? 520 : 0) : 0;
			var top = H > W ? 260 : 120, bottom = H - (H > W ? 330 + coverH : 230);
			x.fillStyle = night ? 'rgba(224,99,58,.3)' : 'rgba(158,34,25,.25)'; x.font = '220px Georgia, serif'; x.textAlign = 'center';
			/* the opening mark as written, «, whatever the page's direction */
			x.direction = 'ltr'; x.fillText(rtl ? '«' : '“', W / 2, top + 140);
			x.direction = rtl ? 'rtl' : 'ltr';
			x.fillStyle = ink;
			var size = H > W ? 66 : 58, lines, room = bottom - top - 160;
			do { x.font = '600 ' + size + 'px ' + font; lines = wrap(App.t(q.text), 820); size -= 4; } while (lines.length * (size + 4) * 1.55 > room && size > 28);
			var lh = (size + 4) * 1.55, mid = top + 160 + room / 2, y = mid - (lines.length - 1) * lh / 2;
			lines.forEach(function (l, k) { x.fillText(l, W / 2, y + k * lh); });
			/* who said it, and where */
			x.font = '400 36px ' + font; x.fillStyle = dim;
			var by = '— ' + App.L('أحمد خالد توفيق', 'Ahmed Khaled Tawfik') + (cite ? (rtl ? '، ' : ', ') + cite : '');
			x.fillText(by, W / 2, y + (lines.length - 1) * lh + lh + 30);
			/* the cover, standing at the foot of a tall picture; on a square a small one in the corner */
			if (cover) {
				var ch = H > W ? coverH : 190, cw = ch * cover.width / cover.height;
				var cx = H > W ? (W - cw) / 2 : (rtl ? 90 : W - 90 - cw), cy = H > W ? H - 300 - ch : H - 110 - ch;
				x.save(); x.shadowColor = 'rgba(0,0,0,.45)'; x.shadowBlur = 30; x.shadowOffsetY = 12;
				x.drawImage(cover, cx, cy, cw, ch); x.restore();
			}
			x.font = '400 44px Lalezar, sans-serif'; x.fillStyle = red;
			x.fillText('العرّاب', W / 2, H - 150);
			x.font = '400 24px "Cormorant Garamond", Georgia, serif'; x.fillStyle = dim; x.direction = 'ltr';
			x.fillText('samehbilal.github.io/ahmed-khaled-tawfik', W / 2, H - 100);
		});
		function wrap(text, max) {
			var words = text.split(/\s+/), out = [], line = '';
			words.forEach(function (wd) {
				var test = line ? line + ' ' + wd : wd;
				if (x.measureText(test).width > max && line) { out.push(line); line = wd; } else line = test;
			});
			if (line) out.push(line);
			return out;
		}
	}
};

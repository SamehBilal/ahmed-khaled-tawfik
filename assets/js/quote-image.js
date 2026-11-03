/* «صورة»: a line as a picture to post — a square for a post or a tall one for a story or a WhatsApp status, on paper or by
   night, with its book's cover when it has one; shared straight to the phone's apps where it can be, otherwise saved as PNG.
   For the quotes (quotes.js), «قاموس العرّاب»'s phrases (glossary.js) and the home page's «كلمة اليوم» (home.js, which loads
   this file only when asked). QuoteImage.open({ text, work }, { cite, by, cover }): by is who says it (his name when left out),
   cite the book or issue, cover a cover of the site's own (when left out, the cover of q.work). */
window.QuoteImage = {
	st: { size: 'square', look: 'paper' },

	open: function (q, o) {
		var App = window.App, L = App.L, e = App.esc, self = this, st = this.st;
		o = o || {};
		var dlg = document.getElementById('qimg');
		if (!dlg) {
			dlg = document.createElement('dialog');
			dlg.id = 'qimg'; dlg.className = 'qimg';
			document.body.appendChild(dlg);
			dlg.addEventListener('click', function (ev) { if (ev.target === dlg) dlg.close(); });
		}
		var canShare = !!(navigator.canShare && window.File && navigator.canShare({ files: [new File([''], 'q.png', { type: 'image/png' })] }));
		var chips = function (k, opts) {
			return '<div class="qimg-opts" role="group">' + opts.map(function (x) {
				return '<button type="button" class="chip" data-' + k + '="' + x[0] + '" aria-pressed="' + (st[k] === x[0]) + '">' + e(x[1]) + '</button>';
			}).join('') + '</div>';
		};
		dlg.innerHTML = '<div class="qimg-in">' +
			'<div class="qimg-view"><canvas></canvas></div>' +
			'<div class="qimg-side">' +
				'<h3>' + e(o.by ? L('العبارة صورةً', 'The line as a picture') : L('الاقتباس صورةً', 'The quote as a picture')) + '</h3>' +
				chips('size', [['square', L('مربّع — منشور', 'Square — a post')], ['story', L('طولي — ستوري أو حالة', 'Tall — a story or status')]]) +
				chips('look', [['paper', L('ورق', 'Paper')], ['night', L('ليل', 'Night')]]) +
				'<div class="qimg-act">' +
					(canShare ? '<button type="button" class="share-btn qimg-share">' + e(L('شارك', 'Share')) + '</button>' : '') +
					'<button type="button" class="share-btn qimg-save">' + e(L('تحميل', 'Download')) + '</button>' +
					'<button type="button" class="share-btn qimg-close">' + e(L('إغلاق', 'Close')) + '</button>' +
				'</div>' +
			'</div></div>';
		var c = dlg.querySelector('canvas');
		var redraw = function () { self.draw(c, q, o); };
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
					navigator.share({ files: [file], text: '«' + App.t(q.text) + '» — ' + (o.by || L('أحمد خالد توفيق', 'Ahmed Khaled Tawfik')) }).catch(function () {});
				}, 'image/png');
			}
		});
		dlg.showModal();
		redraw();
	},

	/* the picture itself: 1080 wide, 1080 or 1920 tall */
	draw: function (c, q, o) {
		var App = window.App, rtl = App.lang === 'ar', S = window.WorksShared, d = App.data(), st = this.st;
		var W = 1080, H = st.size === 'story' ? 1920 : 1080, night = st.look === 'night';
		c.width = W; c.height = H;
		var x = c.getContext('2d');
		var ink = night ? '#efe6d2' : '#231d16', red = night ? '#e0633a' : '#9e2219', dim = night ? '#c9b48e' : '#7a1c14';
		var font = rtl ? '"Reem Kufi", "Noto Naskh Arabic", serif' : '"Cormorant Garamond", Georgia, serif';
		/* the book's cover, when the line's book has one of the site's own */
		var coverSrc = o.cover;
		if (coverSrc == null) {
			var w = q.work && App.findWork(q.work);
			coverSrc = w && S ? (S.anySeries(q.work) ? S.seriesCover(q.work) : S.coverOf((d.bookInfo || {})[q.work])) : '';
		}
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
			var by = '— ' + (o.by || App.L('أحمد خالد توفيق', 'Ahmed Khaled Tawfik')) + (o.cite ? (rtl ? '، ' : ', ') + o.cite : '');
			x.fillText(by, W / 2, y + (lines.length - 1) * lh + lh + 30, W - 160);
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

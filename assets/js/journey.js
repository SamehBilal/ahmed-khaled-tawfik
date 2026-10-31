/* «رحلتي», on the lists page (lists.html#journey, above «قوائمي»): the reader's own progress through his work, from their lists (lists.js; on this device only) —
   a ring for each series and one for his books, how much is read (a collector: owned) and what comes next, the months it
   happened in, and the whole as a picture to share. A reader with empty lists is shown where to begin. */
window.Journey = {
	/* drawn into el (lists.html: #journey, above the lists) */
	mount: function (el) { this.el = el; this.render(); },

	/* the reader's progress: { mode, done: {key:1}, rows: [{ id, title, color, href, total, n, next }], months: {YYYY-MM: n} } */
	progress: function () {
		var App = window.App, S = window.WorksShared, d = App.data(), Ls = window.Lists, st = Ls ? Ls.state() : { lists: {}, mode: 'reader' };
		var mode = st.mode === 'collector' ? 'collector' : 'reader', list = st.lists[mode === 'collector' ? 'own' : 'read'] || [];
		var done = {}, months = {};
		list.forEach(function (x) { done[x.key] = 1; var m = String(x.added || '').slice(0, 7); if (m) months[m] = (months[m] || 0) + 1; });
		var key = function (href) { return 'b:' + decodeURIComponent(href.replace(/^book\.html\?id=/, '')); };
		var rows = (d.series || []).map(function (s) {
			var issues = S.seriesIssues(s.id).map(function (is, i) { return [is, App.issueHref(s.id, Object.assign({ _idx: i }, is))]; }).filter(function (x) { return !(x[0].part > 1); });
			var n = issues.filter(function (x) { return done[key(x[1])]; }).length, next = issues.filter(function (x) { return !done[key(x[1])]; })[0];
			return { id: s.id, title: s.title, color: s.color, href: S.seriesHref(s.id), total: issues.length, n: n, next: next && { title: next[0].title, n: next[0].n, href: next[1] } };
		});
		var works = (d.works || []).filter(function (w) { return w.type !== 'translation'; });
		var wn = works.filter(function (w) { return done['b:' + w.id]; }).length, wnext = works.filter(function (w) { return !done['b:' + w.id]; })[0];
		rows.push({ id: 'works', title: { ar: 'كتبه', en: 'His books' }, color: '#7a4e1d', href: 'works.html', total: works.length, n: wn, next: wnext && { title: wnext.title, href: S.bookHref(wnext.id) } });
		return { mode: mode, count: list.length, rows: rows, months: months };
	},

	ring: function (n, total, color, size) {
		var p = total ? n / total : 0, r = 40, c = (2 * Math.PI * r);
		return '<svg class="jr-dial" viewBox="0 0 100 100" width="' + (size || 120) + '" height="' + (size || 120) + '" style="--c:' + window.App.esc(color || '#e0633a') + '">' +
			'<circle cx="50" cy="50" r="' + r + '"/><circle class="v" cx="50" cy="50" r="' + r + '" stroke-dasharray="' + (c * p).toFixed(1) + ' ' + c.toFixed(1) + '" transform="rotate(-90 50 50)"/>' +
			'<text x="50" y="50" dy="6">' + Math.round(p * 100) + '%</text></svg>';
	},

	render: function () {
		var App = window.App, e = App.esc, t = App.t, L = App.L, self = this, p = this.progress();
		var col = p.mode === 'collector';
		if (!this._wired) { this._wired = true; document.addEventListener('akt-lists', function () { self.render(); }); }
		if (!p.count) {
			this.el.innerHTML = '<section class="section jr"><div class="wrap"><div class="jr-empty">' +
				'<h2>' + e(col ? L('مكتبتك فارغة بعد', 'Your collection is empty so far') : L('لم تبدأ رحلتك بعد', 'Your journey has not begun')) + '</h2>' +
				'<p>' + e(L('أضف ما قرأته إلى «قرأته» من زر القوائم في صفحة كل عدد أو كتاب، أو اسحب غلافه إلى «قوائمي»، وستمتلئ الدوائر هنا.', 'Add what you have read to “Read” from the list buttons on any issue or book page, or drag its cover onto “My lists”, and the rings here will fill.')) + '</p>' +
				'<p class="jr-act"><a class="share-btn" href="guide.html">' + e(L('من أين أبدأ؟', 'Start here')) + '</a> <a class="share-btn" href="#lists">' + e(L('قوائمي', 'My lists')) + '</a></p></div></div></section>';
			return;
		}
		var started = p.rows.filter(function (r) { return r.n; }), all = p.rows.reduce(function (s, r) { return s + r.total; }, 0), sum = p.rows.reduce(function (s, r) { return s + r.n; }, 0);
		var months = Object.keys(p.months).sort(), mmax = Math.max.apply(null, months.map(function (m) { return p.months[m]; }).concat([1]));
		this.el.innerHTML = '<section class="section jr"><div class="wrap">' +
			'<div class="jr-head">' + this.ring(sum, all, '#e0633a', 170) +
				'<div><p class="eyebrow">' + e(col ? L('مكتبتك', 'Your collection') : L('ما قرأته', 'What you have read')) + '</p>' +
				'<h2>' + e(App.num(sum)) + ' <small>' + e(L('من ', 'of ')) + e(App.num(all)) + '</small></h2>' +
				'<p>' + e(L('عددًا وكتابًا من سلاسله وكتبه', 'issues and books of his series and books')) + (started.length ? ' · ' + e(L('بدأت ' + App.num(started.length) + ' منها', 'started ' + started.length + ' of them')) : '') + '</p>' +
				'<p class="jr-act"><button type="button" class="share-btn jr-pic">' + e(L('شارك رحلتك صورةً', 'Share your journey')) + '</button> <a class="share-btn" href="#lists">' + e(L('قوائمي', 'My lists')) + '</a></p></div></div>' +
			'<div class="jr-grid">' + p.rows.map(function (r) {
				return '<article class="jr-card' + (r.n ? '' : ' is-idle') + '">' + self.ring(r.n, r.total, r.color, 96) +
					'<div><h3><a href="' + e(r.href) + '">' + e(t(r.title)) + '</a></h3>' +
					'<p class="jr-count">' + e(App.num(r.n)) + ' / ' + e(App.num(r.total)) + (r.n === r.total && r.total ? ' · ' + e(L('اكتملت!', 'complete!')) : '') + '</p>' +
					(r.next ? '<a class="jr-next" href="' + e(r.next.href) + '">' + e(col ? L('ينقصك: ', 'Missing: ') : L('التالي: ', 'Next: ')) + (r.next.n != null ? '#' + e(App.num(r.next.n)) + ' ' : '') + '«' + e(t(r.next.title)) + '»</a>' : '') +
					'</div></article>';
			}).join('') + '</div>' +
			(months.length > 1 ? '<figure class="jr-months"><figcaption>' + e(L('متى أضفتها', 'When you added them')) + '</figcaption><div class="jr-bars">' + months.map(function (m) {
				return '<span title="' + e(m) + ' · ' + p.months[m] + '"><i style="height:' + (p.months[m] / mmax * 100).toFixed(0) + '%"></i><small>' + e(m.slice(2).replace('-', '/')) + '</small></span>';
			}).join('') + '</div></figure>' : '') +
			'<p class="jr-note">' + e(L('تُحسب الرحلة من «' + (col ? 'في مكتبتي' : 'قرأته') + '» في «قوائمي»؛ غيّر بين «قارئ» و«مقتنٍ» من هناك.', 'Counted from “' + (col ? 'In my collection' : 'Read') + '” in My lists; switch between Reader and Collector there.')) + '</p>' +
		'</div></section>';
		this.el.querySelector('.jr-pic').onclick = function () { self.picture(p, sum, all); };
	},

	/* the journey as a 1080×1350 picture: the big ring and a row a series */
	picture: function (p, sum, all) {
		var App = window.App, L = App.L, t = App.t, rtl = App.lang !== 'en';
		var c = document.createElement('canvas'); c.width = 1080; c.height = 1350;
		var x = c.getContext('2d');
		var fonts = document.fonts && document.fonts.load ? Promise.all(['600 54px "Reem Kufi"', '700 120px "Cormorant Garamond"', '400 44px Lalezar'].map(function (f) { return document.fonts.load(f).catch(function () {}); })) : Promise.resolve();
		fonts.then(function () {
			var g = x.createRadialGradient(760, 260, 40, 540, 600, 1100); g.addColorStop(0, '#2a1a14'); g.addColorStop(1, '#0b0c10');
			x.fillStyle = g; x.fillRect(0, 0, 1080, 1350);
			x.strokeStyle = '#e0633a'; x.lineWidth = 4; x.strokeRect(48, 48, 984, 1254);
			var ring = function (cx, cy, r, f, col, w) {
				x.lineWidth = w; x.strokeStyle = 'rgba(239,230,210,.12)'; x.beginPath(); x.arc(cx, cy, r, 0, Math.PI * 2); x.stroke();
				x.strokeStyle = col; x.lineCap = 'round'; x.beginPath(); x.arc(cx, cy, r, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * f); x.stroke();
			};
			ring(540, 330, 150, all ? sum / all : 0, '#e0633a', 26);
			x.textAlign = 'center'; x.direction = 'ltr'; x.fillStyle = '#efe6d2'; x.font = '700 110px "Cormorant Garamond", Georgia, serif';
			x.fillText(sum, 540, 360);
			x.direction = rtl ? 'rtl' : 'ltr'; x.fillStyle = '#c9b48e'; x.font = '600 40px "Reem Kufi", sans-serif';
			x.fillText(L('من ' + all + ' في رحلتي مع العرّاب', 'of ' + all + ' on my journey with the Godfather'), 540, 545);
			p.rows.forEach(function (r, i) {
				var y = 640 + i * 80, f = r.total ? r.n / r.total : 0;
				x.direction = rtl ? 'rtl' : 'ltr'; x.textAlign = rtl ? 'right' : 'left'; x.fillStyle = '#efe6d2'; x.font = '600 34px "Reem Kufi", sans-serif';
				x.fillText(t(r.title), rtl ? 960 : 120, y);
				x.direction = 'ltr'; x.textAlign = rtl ? 'left' : 'right'; x.fillStyle = '#c9b48e'; x.font = '400 30px "Cormorant Garamond", Georgia, serif';
				x.fillText(r.n + ' / ' + r.total, rtl ? 120 : 960, y);
				x.fillStyle = 'rgba(239,230,210,.12)'; x.fillRect(120, y + 18, 840, 10);
				x.fillStyle = r.color || '#e0633a'; var w = 840 * f; x.fillRect(rtl ? 960 - w : 120, y + 18, w, 10);
			});
			x.textAlign = 'center'; x.direction = rtl ? 'rtl' : 'ltr'; x.font = '400 44px Lalezar, sans-serif'; x.fillStyle = '#e0633a';
			x.fillText('العرّاب', 540, 1225);
			x.font = '400 24px "Cormorant Garamond", Georgia, serif'; x.fillStyle = '#c9b48e'; x.direction = 'ltr';
			x.fillText('samehbilal.github.io/ahmed-khaled-tawfik', 540, 1268);
			c.toBlob(function (blob) {
				var file = new File([blob], 'akt-journey.png', { type: 'image/png' });
				if (navigator.canShare && navigator.canShare({ files: [file] })) navigator.share({ files: [file], text: L('رحلتي مع أحمد خالد توفيق', 'My journey with Ahmed Khaled Tawfik') }).catch(function () {});
				else { var a = document.createElement('a'); a.download = 'akt-journey.png'; a.href = URL.createObjectURL(blob); a.click(); }
			}, 'image/png');
		});
	}
};

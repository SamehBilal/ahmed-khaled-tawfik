/* changelog.html — «سجل التحديثات»: everything added to the site and when, from its history (assets/data/changelog.json,
   tools/build-changelog.js): a day at a time, newest first, filtered by kind or searched; each change in Arabic where it has a line (x.a), with the words it was recorded in under it.
   Above it «ما الجديد منذ زيارتك» (what came since the newest change this reader saw here, kept on their device as akt-cl-seen),
   and under it «سجل التصحيحات»: the changes that put a fact right (x.c). */
window.PAGE = {
	id: 'changelog',
	title: { ar: 'سجل التحديثات', en: 'Changelog' },
	strings: {
		eyebrow: { ar: 'خلف الكواليس', en: 'Behind the site' },
		title: { ar: 'سجل التحديثات', en: 'Changelog' },
		lead: {
			ar: 'كل ما أُضيف إلى الموقع أو تغيّر فيه، يومًا بيوم منذ بدأ: صفحات جديدة وأغلفة وصور وتسجيلات ومقالات وتصحيحات.',
			en: 'Everything added to the site or changed in it, day by day since it began: new pages, covers and pictures, recordings, articles and fixes.'
		}
	},
	KINDS: [['page', { ar: 'صفحات جديدة', en: 'New pages' }], ['data', { ar: 'كتب ومقالات وبيانات', en: 'Books, articles, data' }], ['pics', { ar: 'أغلفة وصور', en: 'Covers & pictures' }],
		['audio', { ar: 'مسموع ومرئي', en: 'Audio & video' }], ['design', { ar: 'تصميم', en: 'Design' }], ['fix', { ar: 'تصحيحات', en: 'Fixes' }]],
	kind: 'all', q: '', shown: 3, day: '', since: 0,

	/* the band, after Paul Troshkin's «Date Ruler» on CodePen (made there with Reactive CSS; here in plain script): a card with
	   the weekday and the year, the date on reels that roll to it, and a ruler each for the day, the month and the year, dragged
	   sideways (or stepped with the arrow keys) under a needle. It opens on the newest day the site changed; the days, months
	   and years it changed are marked on the rulers, and the line under the card leads to that day's changes */
	band: function () {
		var A = window.App, L = A.L, e = A.esc;
		var reel = function (cls, items) { return '<span class="dr-reel ' + cls + '"><span class="dr-strip">' + items.map(function (x) { return '<i>' + e(x) + '</i>'; }).join('') + '</span></span>'; };
		var digits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];
		var ruler = function (k, label) { return '<div class="dr-ruler dr-' + k + '" dir="ltr"><input type="range" aria-label="' + e(label) + '"><div class="dr-track"></div></div>'; };
		/* (called on its own by page-hero.js, so through window.PAGE) */
		setTimeout(function () { window.PAGE.ruler(); }, 0);
		return '<form class="dr-card" aria-label="' + e(L('اختر يومًا من سجل التحديثات', 'Pick a day of the changelog')) + '" onsubmit="return false">' +
			'<p class="dr-meta" aria-hidden="true">' + reel('dr-wd', window.PAGE.WEEKDAYS()) + '<span class="dr-years" dir="ltr">' + reel('dr-y1', digits) + reel('dr-y2', digits) + reel('dr-y3', digits) + reel('dr-y4', digits) + '</span></p>' +
			'<p class="dr-date" aria-hidden="true"><span class="dr-num" dir="ltr">' + reel('dr-dt', ['0', '1', '2', '3']) + reel('dr-du', digits) + '</span>' + reel('dr-mo', window.PAGE.MONTHS()) + '</p>' +
			ruler('day', L('اليوم', 'Day')) + ruler('month', L('الشهر', 'Month')) + ruler('year', L('السنة', 'Year')) +
			'<p class="dr-out" aria-live="polite"></p></form>';
	},
	MONTHS: function () { return window.App.lang === 'en' ? ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'] : ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر']; },
	WEEKDAYS: function () { return window.App.lang === 'en' ? ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'] : ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت']; },

	/* the rulers at work, once the log is in (they mark the days it changed) */
	ruler: function () {
		var card = document.querySelector('.dr-card'), self = this, A = window.App, L = A.L;
		if (!card || !this.log || card.getAttribute('data-on')) return;
		card.setAttribute('data-on', '1');
		var ph = card.closest('.ph');
		if (ph) ph.removeAttribute('aria-hidden'); /* (this band is a control, not a decoration) */
		var by = {}; this.log.forEach(function (x) { by[x.d] = (by[x.d] || 0) + 1; });
		var newest = this.log[0].d, oldest = this.log[this.log.length - 1].d, at = this.day || newest;
		var v = { y: +at.slice(0, 4), m: +at.slice(5, 7), d: +at.slice(8) };
		var Y0 = +oldest.slice(0, 4) - 1, Y1 = Math.max(+newest.slice(0, 4), new Date().getFullYear()) + 1;
		var two = function (n) { return ('0' + n).slice(-2); };
		var len = function () { return new Date(v.y, v.m, 0).getDate(); };
		var key = function () { return v.y + '-' + two(v.m) + '-' + two(Math.min(v.d, len())); };
		var has = function (prefix) { return Object.keys(by).some(function (k) { return k.indexOf(prefix) === 0; }); };
		var R = {
			day: { min: 1, max: 31, gap: 34, get: function () { return v.d; }, set: function (n) { v.d = n; }, label: function (n) { return n; }, mark: function (n) { return by[v.y + '-' + two(v.m) + '-' + two(n)]; } },
			month: { min: 1, max: 12, gap: 64, get: function () { return v.m; }, set: function (n) { v.m = n; }, label: function (n) { return self.MONTHS()[n - 1]; }, mark: function (n) { return has(v.y + '-' + two(n)); } },
			year: { min: Y0, max: Y1, gap: 64, get: function () { return v.y; }, set: function (n) { v.y = n; }, label: function (n) { return n; }, mark: function (n) { return has(n + '-'); } }
		};
		/* each ruler: a label under each tick, the marked ones in the ember colour */
		var T = {};
		Object.keys(R).forEach(function (k) {
			var r = R[k], el = card.querySelector('.dr-' + k), out = '';
			for (var n = r.min; n <= r.max; n++) out += '<span data-n="' + n + '">' + A.esc(String(r.label(n))) + '</span>';
			el.querySelector('.dr-track').innerHTML = out;
			el.style.setProperty('--gap', r.gap + 'px');
			T[k] = { el: el, track: el.querySelector('.dr-track'), input: el.querySelector('input') };
			T[k].input.min = r.min; T[k].input.max = r.max;
		});
		var reelTo = function (cls, n) { var st = card.querySelector('.' + cls + ' .dr-strip'); if (st) st.style.transform = 'translateY(' + (-n * 1.2) + 'em)'; };
		var paint = function (live) {
			var n = len(), dd = Math.min(v.d, n);
			Object.keys(R).forEach(function (k) {
				var r = R[k], t = T[k], pos = live && live.k === k ? live.pos : (k === 'day' ? dd : r.get());
				t.track.style.transition = live && live.k === k ? 'none' : '';
				t.track.style.transform = 'translateX(' + (-(pos - r.min) * r.gap) + 'px)';
				t.input.value = k === 'day' ? dd : r.get();
				[].forEach.call(t.track.children, function (sp) { var m = +sp.getAttribute('data-n'); sp.classList.toggle('is-mark', !!r.mark(m)); sp.classList.toggle('is-out', k === 'day' && m > n); });
			});
			reelTo('dr-dt', Math.floor(dd / 10)); reelTo('dr-du', dd % 10);
			card.querySelector('.dr-dt').classList.toggle('is-none', dd < 10);
			reelTo('dr-mo', v.m - 1); reelTo('dr-wd', new Date(v.y, v.m - 1, dd).getDay());
			String(v.y).split('').forEach(function (c, i) { reelTo('dr-y' + (i + 1), +c); });
			var c = by[key()];
			card.querySelector('.dr-out').innerHTML = c ? '<button type="button" class="dr-go">' + A.esc(L(A.count(c, ['تحديث واحد', 'تحديثان', 'تحديثات', 'تحديثًا']) + ' في هذا اليوم ↓', c + ' change' + (c > 1 ? 's' : '') + ' on this day ↓')) + '</button>'
				: '<span>' + A.esc(L('لم يتغير الموقع في هذا اليوم', 'The site did not change on this day')) + '</span>';
		};
		/* the day is cut to the month's end once the month or the year has moved */
		var settle = function () { v.d = Math.min(v.d, len()); paint(); };
		Object.keys(R).forEach(function (k) {
			var r = R[k], t = T[k], start = null, moved = false;
			t.el.addEventListener('pointerdown', function (ev) { start = { x: ev.clientX, n: r.get() }; moved = false; t.el.setPointerCapture(ev.pointerId); t.el.classList.add('is-drag'); });
			t.el.addEventListener('pointermove', function (ev) {
				if (!start) return;
				if (Math.abs(ev.clientX - start.x) > 3) moved = true;
				var pos = Math.max(r.min, Math.min(r.max, start.n - (ev.clientX - start.x) / r.gap));
				r.set(Math.round(pos));
				paint({ k: k, pos: pos });
			});
			var end = function (ev) {
				if (!start) return;
				start = null; t.el.classList.remove('is-drag');
				/* a tap, not a drag: go to the label tapped */
				if (!moved && ev && ev.type === 'pointerup') { var sp = document.elementsFromPoint(ev.clientX, ev.clientY).filter(function (x) { return x.parentNode === t.track; })[0]; if (sp) r.set(+sp.getAttribute('data-n')); }
				settle();
			};
			t.el.addEventListener('pointerup', end); t.el.addEventListener('pointercancel', end);
			/* the arrow keys step it, as the range it holds */
			t.input.addEventListener('input', function () { r.set(+t.input.value); settle(); });
		});
		card.querySelector('.dr-out').addEventListener('click', function (ev) {
			if (!ev.target.closest('.dr-go')) return;
			self.day = key(); self.shown = 3; self.list();
			var box = document.querySelector('.cl-list');
			if (box) box.scrollIntoView({ behavior: 'smooth', block: 'start' });
		});
		paint();
	},

	render: function () {
		var App = window.App, e = App.esc, L = App.L, self = this;
		/* the log beside the side menu of the pages about the site (app.js infoTabs), as on «عن الموقع» and the others */
		document.getElementById('content').innerHTML = '<section class="section cl"><div class="wrap info-wrap">' + App.infoTabs('changelog') +
			'<div class="info-body cl-body"><p class="cl-sum">' + e(L('…', '…')) + '</p></div></div></section>';
		fetch('assets/data/changelog.json').then(function (r) { return r.json(); }).then(function (log) {
			self.log = log;
			var count = {}; log.forEach(function (x) { x.k.forEach(function (k) { count[k] = (count[k] || 0) + 1; }); });
			var days = {}; log.forEach(function (x) { days[x.d] = 1; });
			var fixes = log.filter(function (x) { return x.c; });
			document.querySelector('.cl-body').innerHTML = self.sinceHtml(log) +
				'<p class="cl-sum">' + e(L(App.num(log.length) + ' تحديثًا في ' + App.num(Object.keys(days).length) + ' يومًا، منذ ' + App.num(log[log.length - 1].d) + '.', log.length + ' changes on ' + Object.keys(days).length + ' days, since ' + log[log.length - 1].d + '.')) +
					(fixes.length ? ' <a href="#corrections">' + e(L('وسجل التصحيحات (' + App.num(fixes.length) + ') ↓', 'And the corrections (' + fixes.length + ') ↓')) + '</a>' : '') + '</p>' +
				/* the same news as a feed (feed.xml, feed-en.xml, built by tools/build-feed.js) */
				'<p class="cl-feed"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 19a1 1 0 1 0 0-.01M5 11a8 8 0 0 1 8 8M5 4a15 15 0 0 1 15 15"/></svg>' +
					e(L('تابع الجديد من قارئ الأخبار، دون أن تزور الموقع: ', 'Follow what’s new in a feed reader, without visiting: ')) +
					'<a href="feed.xml" type="application/atom+xml">' + e(L('بالعربية', 'in Arabic')) + '</a> · <a href="feed-en.xml" type="application/atom+xml" hreflang="en">' + e(L('بالإنجليزية', 'in English')) + '</a> <small>(RSS / Atom)</small></p>' +
				'<div class="cl-bar"><div class="chips"><button type="button" class="chip" data-k="all" aria-pressed="true">' + e(L('الكل', 'All')) + '</button>' +
					self.KINDS.filter(function (k) { return count[k[0]]; }).map(function (k) { return '<button type="button" class="chip" data-k="' + k[0] + '" aria-pressed="false">' + e(App.t(k[1])) + ' <b>' + e(App.num(count[k[0]])) + '</b></button>'; }).join('') +
				'</div><input type="search" class="cl-q" placeholder="' + e(L('ابحث في السجل…', 'Search the log…')) + '"></div>' +
				'<div class="cl-list"></div>' + self.fixesHtml(fixes) +
				'<p class="cl-note">' + e(L('كُتب السجل أولًا بالإنجليزية في تاريخ الموقع على GitHub؛ وتحت كل سطر عربي نصّه الأصلي.', 'The log is written in the site’s history on GitHub, as it was recorded there.')) + ' <a href="https://github.com/SamehBilal/ahmed-khaled-tawfik/commits/main" target="_blank" rel="noopener">GitHub ↗</a></p>';
			var root = document.querySelector('.cl');
			root.querySelector('.chips').onclick = function (ev) {
				var b = ev.target.closest('[data-k]');
				if (!b) return;
				self.kind = b.getAttribute('data-k'); self.shown = 3;
				root.querySelectorAll('[data-k]').forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
				self.list();
			};
			root.querySelector('.cl-q').oninput = function (ev) { self.q = ev.target.value.trim().toLowerCase(); self.shown = 3; self.list(); };
			root.querySelector('.cl-list').onclick = function (ev) {
				if (ev.target.closest('.cl-more')) { self.shown += 3; self.list(); }
				if (ev.target.closest('.cl-all')) { self.day = ''; self.since = 0; self.shown = 3; self.list(); }
			};
			var only = root.querySelector('.cl-new-only');
			if (only) only.onclick = function () { self.since = +only.getAttribute('data-n'); self.day = ''; self.shown = 99; self.list(); root.querySelector('.cl-list').scrollIntoView({ behavior: 'smooth', block: 'start' }); };
			self.list();
			self.ruler();
			App.focusHash();
		}).catch(function () {
			document.querySelector('.cl-body').innerHTML = '<p class="cl-sum">' + e(L('تعذّر تحميل السجل الآن.', 'The log could not be loaded just now.')) + '</p>';
		});
	},

	/* the changes, a month a block; the newest months first, more on demand */
	list: function () {
		var App = window.App, e = App.esc, t = App.t, L = App.L, self = this;
		var kindName = {}; this.KINDS.forEach(function (k) { kindName[k[0]] = k[1]; });
		var MONTHS = App.lang === 'en' ? ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
			: ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
		var rows = this.log.filter(function (x, i) { return (!self.since || i < self.since) && (!self.day || x.d === self.day) && (self.kind === 'all' || x.k.indexOf(self.kind) >= 0) && (!self.q || (x.s + ' ' + (x.a || '')).toLowerCase().indexOf(self.q) >= 0); });
		/* a block a day (the site is young: its months are long) */
		var days = [], by = {};
		rows.forEach(function (x) { if (!by[x.d]) { by[x.d] = []; days.push(x.d); } by[x.d].push(x); });
		var box = document.querySelector('.cl-list');
		if (!rows.length) { box.innerHTML = '<p class="cl-sum">' + e(L('لا شيء يطابق.', 'Nothing matches.')) + '</p>'; return; }
		box.innerHTML = days.slice(0, this.shown).map(function (dd) {
			return '<section class="cl-month"><h2>' + e(App.num(+dd.slice(8)) + ' ' + MONTHS[+dd.slice(5, 7) - 1] + ' ' + App.num(dd.slice(0, 4))) + ' <small>' + e(App.num(by[dd].length)) + '</small></h2><ol>' + by[dd].map(function (x) {
				var ar = App.lang !== 'en' && x.a;
				return '<li><span class="cl-d">•</span><div>' + (ar ? '<p class="cl-ar">' + e(x.a) + '</p><details class="cl-en"><summary>' + e(L('النص الأصلي', 'Original')) + '</summary><p dir="ltr">' + e(x.s) + '</p></details>' : '<p dir="ltr">' + e(x.s) + '</p>') + (x.k.length ? '<p class="cl-k">' + x.k.map(function (k) { return '<span class="cl-' + k + '">' + e(t(kindName[k])) + '</span>'; }).join('') + '</p>' : '') + '</div></li>';
			}).join('') + '</ol></section>';
		}).join('') + (days.length > this.shown ? '<button type="button" class="share-btn cl-more">' + e(L('أيام أقدم', 'Older days')) + '</button>' : '') +
			(this.day || this.since ? ' <button type="button" class="share-btn cl-all">' + e(L('كل الأيام', 'All days')) + '</button>' : '');
	},

	/* «ما الجديد منذ زيارتك»: the changes since the newest one this reader saw here; then all of them count as seen */
	sinceHtml: function (log) {
		var App = window.App, e = App.esc, L = App.L, seen = null;
		try { seen = localStorage.getItem('akt-cl-seen'); localStorage.setItem('akt-cl-seen', log[0].h); } catch (err) {}
		document.querySelectorAll('a.is-new').forEach(function (a) { a.classList.remove('is-new'); a.removeAttribute('title'); });
		var at = -1;
		log.some(function (x, i) { if (x.h === seen) { at = i; return true; } });
		if (at < 0) return '';
		var MONTHS = this.MONTHS(), when = log[at].d, date = App.num(+when.slice(8)) + ' ' + MONTHS[+when.slice(5, 7) - 1];
		if (!at) return '<p class="cl-new is-none">' + e(L('لا جديد منذ زيارتك الأخيرة لهذه الصفحة (' + date + ').', 'Nothing new since you last looked here (' + date + ').')) + '</p>';
		var fresh = log.slice(0, at), pages = fresh.filter(function (x) { return x.k.indexOf('page') >= 0; });
		var count = {}; fresh.forEach(function (x) { x.k.forEach(function (k) { count[k] = (count[k] || 0) + 1; }); });
		var name = {}; this.KINDS.forEach(function (k) { name[k[0]] = k[1]; });
		var line = function (x) { var s = App.lang !== 'en' && x.a ? x.a : x.s; return s.length > 150 ? s.slice(0, 148).replace(/\s+\S*$/, '') + '…' : s; };
		return '<section class="cl-new" aria-labelledby="cl-new-h"><h2 id="cl-new-h">' + e(L('ما الجديد منذ زيارتك', 'New since your visit')) + '</h2>' +
			'<p>' + e(L(App.count(fresh.length, ['تحديث واحد', 'تحديثان', 'تحديثات', 'تحديثًا']) + ' منذ آخر مرة فتحت فيها هذه الصفحة، في ' + date + ':', fresh.length + ' change' + (fresh.length > 1 ? 's' : '') + ' since you last opened this page, on ' + date + ':')) + '</p>' +
			'<p class="cl-k">' + this.KINDS.filter(function (k) { return count[k[0]]; }).map(function (k) { return '<span class="cl-' + k[0] + '">' + e(App.t(name[k[0]])) + ' ' + e(App.num(count[k[0]])) + '</span>'; }).join('') + '</p>' +
			(pages.length ? '<ul class="cl-new-pages">' + pages.slice(0, 5).map(function (x) { return '<li>' + e(line(x)) + '</li>'; }).join('') + '</ul>' : '') +
			'<button type="button" class="share-btn cl-new-only" data-n="' + at + '">' + e(L('اعرض الجديد وحده ↓', 'Show only what is new ↓')) + '</button></section>';
	},

	/* «سجل التصحيحات»: each fact put right, newest first — what it says now, when, who sent it, and the change itself on GitHub */
	fixesHtml: function (fixes) {
		var App = window.App, e = App.esc, L = App.L, MONTHS = this.MONTHS();
		return '<section class="cl-fixes" id="corrections"><h2>' + e(L('سجل التصحيحات', 'Corrections')) + ' <small>' + e(App.num(fixes.length)) + '</small></h2>' +
			'<p class="cl-sum">' + e(L('كل معلومة كانت خطأً في الموقع ثم صُحّحت: ماذا صارت ومتى، ومن نبّه إليها إن أحب أن يُذكر. لا نمحو الخطأ بصمت.', 'Every fact the site had wrong and then put right: what it says now and when, and who pointed it out, if they wished to be named. Mistakes are not erased quietly.')) + '</p>' +
			(fixes.length ? '<ol class="cl-fix-list">' + fixes.map(function (x) {
				return '<li><time datetime="' + e(x.d) + '">' + e(App.num(+x.d.slice(8)) + ' ' + MONTHS[+x.d.slice(5, 7) - 1] + ' ' + App.num(x.d.slice(0, 4))) + '</time>' +
					'<p>' + e(App.t(x.c)) + '</p>' +
					'<p class="cl-fix-by">' + (x.c.by ? e(L('بتنبيه من ', 'Pointed out by ') + x.c.by) + ' · ' : '') +
					'<a href="https://github.com/SamehBilal/ahmed-khaled-tawfik/commit/' + e(x.h) + '" target="_blank" rel="noopener" dir="ltr">' + e(x.h) + ' ↗</a></p></li>';
			}).join('') + '</ol>' : '') +
			'<p class="cl-fix-send"><a class="share-btn" href="' + e(App.fixHref(L('تصحيح', 'Correction'))) + '" target="_blank" rel="noopener">' + e(L('وجدت خطأً آخر؟ أرسله ↗', 'Found another mistake? Send it ↗')) + '</a></p></section>';
	}
};

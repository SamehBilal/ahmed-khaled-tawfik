/* calendar.html — «تقويم العرّاب»: the whole year a day at a time — every day the data dates something to (his birth and death,
   the legacy, a book or an issue that came out, an article the papers printed: assets/data/days/<MM>.json, tools/build-days.js),
   as a year of small squares, darker where more happened; a day chosen shows its moments (the cards of «في مثل هذا اليوم»,
   site.css .otd-card). Today's day is chosen first; #d-06-10 opens on one. Filtered by kind. */
window.PAGE = {
	id: 'calendar',
	title: { ar: 'تقويم العرّاب', en: 'The Godfather’s calendar' },
	strings: {
		eyebrow: { ar: 'يومًا بيوم', en: 'Day by day' },
		title: { ar: 'تقويم العرّاب', en: 'The Godfather’s calendar' },
		lead: {
			ar: 'عام كامل في مربعات صغيرة، كل يوم بما حدث فيه في أعوام مختلفة: ميلاده ورحيله، وما صدر من أعداده وكتبه، ومقالاته يوم نشرتها الصحف، وما جاء بعده.',
			en: 'A whole year in small squares, each day with what happened on it in other years: his birth and death, the issues and books that came out, his articles the day the papers ran them, and what came after.'
		}
	},
	MONTHS: { ar: ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'],
		en: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'] },
	KIND: [['born', { ar: 'ميلاد', en: 'Born' }], ['died', { ar: 'رحيل', en: 'Farewell' }], ['legacy', { ar: 'الإرث', en: 'Legacy' }],
		['book', { ar: 'صدر كتاب', en: 'A book came out' }], ['issue', { ar: 'صدر عدد', en: 'An issue came out' }], ['article', { ar: 'مقال', en: 'Article' }]],
	LEN: [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
	days: null, kind: 'all', pick: null,

	/* the band: twelve tear-off sheets, a month each with how much it holds; a sheet lifts with the pointer and leads to its month */
	band: function (d, A) {
		var self = window.PAGE, names = self.MONTHS[A.lang === 'en' ? 'en' : 'ar'], now = new Date().getMonth();
		setTimeout(function () { self.bandWire(); }, 0);
		return '<div class="ca-sheets">' + names.map(function (m, i) {
			return '<a class="ca-sheet' + (i === now ? ' is-now' : '') + '" href="#m-' + (i + 1) + '" style="--i:' + i + '"><i class="ca-rings"></i><b>' + A.esc(m) + '</b><span class="ca-n" data-m="' + (i + 1) + '"></span></a>';
		}).join('') + '</div>';
	},
	bandWire: function () {
		var box = document.querySelector('.ca-sheets');
		if (!box || box.getAttribute('data-on')) return;
		box.setAttribute('data-on', '1');
		var ph = box.closest('.ph');
		if (ph) ph.removeAttribute('aria-hidden');
		box.addEventListener('click', function (ev) {
			var a = ev.target.closest('.ca-sheet'), to = a && document.getElementById(a.getAttribute('href').slice(1));
			if (!a) return;
			ev.preventDefault();
			if (to) to.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'center' });
		});
		this.counts();
	},
	/* each sheet's count, once the year has come */
	counts: function () {
		var self = this, A = window.App;
		if (!this.days) return;
		document.querySelectorAll('.ca-n').forEach(function (el) {
			var m = +el.getAttribute('data-m'), n = 0, month = self.days[m] || {};
			Object.keys(month).forEach(function (k) { if (k !== '_g') n += self.of(month[k]).length; });
			el.textContent = A.num(n);
		});
	},
	of: function (list) { var k = this.kind; return (list || []).filter(function (x) { return k === 'all' || x[0] === k; }); },

	render: function () {
		var App = window.App, e = App.esc, L = App.L, self = this;
		/* under the calendar, the day itself: «في مثل هذا اليوم» (otd.js) and «كلمة اليوم · بكلماته» (today.js), moved here from the Works page */
		if (window.OnThisDay) window.OnThisDay.mount(document.getElementById('otd'));
		if (window.TodayLine) window.TodayLine.mount(document.getElementById('today-line'));
		document.getElementById('content').innerHTML = '<section class="section ca"><div class="wrap">' +
			'<div class="chips ca-bar"><button type="button" class="chip" data-k="all" aria-pressed="true">' + e(L('الكل', 'All')) + '</button>' +
				this.KIND.map(function (k) { return '<button type="button" class="chip" data-k="' + k[0] + '" aria-pressed="false">' + e(App.t(k[1])) + '</button>'; }).join('') + '</div>' +
			'<div class="ca-year" aria-busy="true"><p class="ca-wait">' + e(L('جارٍ جمع العام…', 'Gathering the year…')) + '</p></div>' +
			'<section class="ca-day" id="ca-day" aria-live="polite"></section>' +
			'<p class="ca-note">' + e(L('كل ما في البيانات من تاريخ بيومه: الأعداد والكتب يوم صدرت طبعتها الأولى، والمقالات يوم نشرتها صحفها كما يحفظها أرشيف المدونة.', 'Everything the data dates to a day: issues and books on the day their first edition came out, articles on the day their paper ran them, as the blog archive keeps it.')) +
				' <a href="wanted.html#dates">' + e(L('ما ينقص من التواريخ ←', 'Missing dates →')) + '</a></p>' +
		'</div></section>';
		document.querySelector('.ca-bar').onclick = function (ev) {
			var b = ev.target.closest('[data-k]');
			if (!b) return;
			self.kind = b.getAttribute('data-k');
			document.querySelectorAll('.ca-bar [data-k]').forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
			self.year(); self.day(self.pick); self.counts();
		};
		document.querySelector('.ca-year').onclick = function (ev) {
			var b = ev.target.closest('[data-d]');
			if (!b) return;
			self.day(b.getAttribute('data-d'), true);
			history.replaceState(null, '', '#d-' + b.getAttribute('data-d'));
		};
		var pad = function (n) { return (n < 10 ? '0' : '') + n; };
		(this.days ? Promise.resolve() : Promise.all(this.LEN.map(function (x, i) {
			return fetch('assets/data/days/' + pad(i + 1) + '.json').then(function (r) { return r.ok ? r.json() : {}; }).catch(function () { return {}; });
		})).then(function (got) { self.days = {}; got.forEach(function (m, i) { self.days[i + 1] = m; }); })).then(function () {
			self.year();
			var h = /^#d-(\d\d)-(\d\d)$/.exec(location.hash), now = new Date();
			self.day(h ? h[1] + '-' + h[2] : pad(now.getMonth() + 1) + '-' + pad(now.getDate()), !!h);
			self.counts();
		});
	},

	/* the year: a block a month, a square a day, its shade by how much it holds */
	year: function () {
		var App = window.App, e = App.esc, self = this, names = this.MONTHS[App.lang === 'en' ? 'en' : 'ar'], now = new Date();
		var pad = function (n) { return (n < 10 ? '0' : '') + n; }, max = 1;
		this.LEN.forEach(function (len, i) { for (var dd = 1; dd <= len; dd++) max = Math.max(max, self.of((self.days[i + 1] || {})[pad(dd)]).length); });
		var box = document.querySelector('.ca-year');
		box.removeAttribute('aria-busy');
		box.innerHTML = this.LEN.map(function (len, i) {
			var m = i + 1, month = self.days[m] || {}, cells = '';
			for (var dd = 1; dd <= len; dd++) {
				var n = self.of(month[pad(dd)]).length, key = pad(m) + '-' + pad(dd);
				var lv = n ? Math.min(4, 1 + Math.floor(Math.log(n) / Math.log(max + 1) * 4)) : 0;
				cells += '<button type="button" class="ca-c" data-d="' + key + '" data-l="' + lv + '"' + (m === now.getMonth() + 1 && dd === now.getDate() ? ' data-today' : '') +
					' aria-label="' + e(App.num(dd) + ' ' + names[i] + ': ' + App.num(n)) + '" title="' + e(App.num(dd) + ' ' + names[i] + (n ? ' · ' + App.num(n) : '')) + '"' + (n ? '' : ' disabled') + '>' + e(App.num(dd)) + '</button>';
			}
			return '<div class="ca-m" id="m-' + m + '"><h3>' + e(names[i]) + '</h3><div class="ca-cells">' + cells + '</div></div>';
		}).join('');
		if (this.pick) { var on = box.querySelector('[data-d="' + this.pick + '"]'); if (on) on.setAttribute('aria-pressed', 'true'); }
	},

	/* a day's moments; a day with none (or none of the kind) gives way to the next that has */
	day: function (key, go) {
		var App = window.App, e = App.esc, t = App.t, L = App.L, self = this, names = this.MONTHS[App.lang === 'en' ? 'en' : 'ar'];
		var pad = function (n) { return (n < 10 ? '0' : '') + n; };
		var m = +key.slice(0, 2), dd = +key.slice(3), list = [];
		for (var k = 0; k < 366 && !list.length; k++) {
			list = this.of((this.days[m] || {})[pad(dd)]);
			if (!list.length) { dd++; if (dd > this.LEN[m - 1]) { dd = 1; m = m % 12 + 1; } }
		}
		key = pad(m) + '-' + pad(dd);
		this.pick = key;
		document.querySelectorAll('.ca-c[aria-pressed]').forEach(function (x) { x.removeAttribute('aria-pressed'); });
		var on = document.querySelector('.ca-c[data-d="' + key + '"]');
		if (on) on.setAttribute('aria-pressed', 'true');
		var order = this.KIND.map(function (x) { return x[0]; }), kinds = {}; this.KIND.forEach(function (x) { kinds[x[0]] = x[1]; });
		var base = (this.days[m] || {})._g || '', year = new Date().getFullYear();
		var ago = function (n) {
			return App.lang === 'en' ? (n === 1 ? 'a year ago' : n + ' years ago')
				: n === 1 ? 'منذ عام' : n === 2 ? 'منذ عامين' : n <= 10 ? 'منذ ' + App.num(n) + ' أعوام' : 'منذ ' + App.num(n) + ' عامًا';
		};
		list = list.slice().sort(function (a, b) { return order.indexOf(a[0]) - order.indexOf(b[0]) || a[1] - b[1]; });
		var box = document.getElementById('ca-day');
		box.innerHTML = '<h2>' + e(App.num(dd) + ' ' + names[m - 1]) + ' <small>' + e(L(App.num(list.length) + ' في هذا اليوم', list.length + ' on this day')) + '</small></h2>' +
			'<div class="otd-list">' + list.map(function (x) {
				var src = x[5] ? (x[5].indexOf('g:') === 0 ? base + x[5].slice(2) : x[5]) : '';
				return '<a class="otd-card otd-' + e(x[0]) + (src ? ' has-pic' : '') + '" href="' + e(x[3]) + '">' +
					(src ? '<span class="otd-pic' + (/\/covers\//.test(src) ? ' is-tall' : '') + '"><img src="' + e(App.thumb(src)) + '" alt="" loading="lazy" decoding="async" referrerpolicy="no-referrer" onerror="this.parentNode.remove()"></span>' : '') +
					'<span class="otd-y">' + e(App.num(x[1])) + '</span><span class="otd-ago">' + e(year - x[1] > 0 ? ago(year - x[1]) : '') + '</span>' +
					'<span class="otd-k">' + e(t(kinds[x[0]] || x[0])) + (x[4] ? ' · ' + e(t(x[4])) : '') + '</span>' +
					'<b>' + e(t(x[2])) + '</b></a>';
			}).join('') + '</div>';
		if (go) box.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
	}
};

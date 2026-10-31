/* «في مثل هذا اليوم»: on the Works page (works.html, #otd) — what happened on today's date in other years: his birth or death,
   the legacy, a book or an issue that came out, the articles the papers printed (assets/data/days/<MM>.json, tools/build-days.js);
   on a day with none, the next one that has */
(function () {
	var cache = {};
	function mount(box) {
		var App = window.App, e = App.esc, t = App.t, L = App.L;
		if (!box) return;
		var MONTHS = { ar: ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'],
			en: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'] };
		var KIND = { born: { ar: 'ميلاد', en: 'Born' }, died: { ar: 'رحيل', en: 'Farewell' }, legacy: { ar: 'الإرث', en: 'Legacy' },
			book: { ar: 'صدر كتاب', en: 'A book came out' }, issue: { ar: 'صدر عدد', en: 'An issue came out' }, article: { ar: 'مقال', en: 'Article' } };
		var ORDER = ['born', 'died', 'legacy', 'book', 'issue', 'article'];
		var ago = function (n) {
			return App.lang === 'en' ? (n === 1 ? 'a year ago' : n + ' years ago')
				: n === 1 ? 'منذ عام' : n === 2 ? 'منذ عامين' : n <= 10 ? 'منذ ' + App.num(n) + ' أعوام' : 'منذ ' + App.num(n) + ' عامًا';
		};
		var now = new Date(), pad = function (n) { return (n < 10 ? '0' : '') + n; };
		var month = function (m) {
			if (!cache[m]) cache[m] = fetch('assets/data/days/' + pad(m) + '.json').then(function (r) { return r.ok ? r.json() : {}; }).catch(function () { return {}; });
			return cache[m];
		};
		/* today, or the first of the next ten days with something */
		var tries = [];
		for (var i = 0; i < 10; i++) { var dt = new Date(now.getFullYear(), now.getMonth(), now.getDate() + i); tries.push(dt); }
		var months = tries.map(function (x) { return x.getMonth() + 1; }).filter(function (m, k, all) { return all.indexOf(m) === k; });
		Promise.all(months.map(month)).then(function (got) {
			var by = {}; months.forEach(function (m, k) { by[m] = got[k] || {}; });
			var day = null, list = [];
			for (var k = 0; k < tries.length && !list.length; k++) { day = tries[k]; list = (by[day.getMonth() + 1] || {})[pad(day.getDate())] || []; }
			if (!list.length) { box.hidden = true; return; }
			var today = day.getDate() === now.getDate() && day.getMonth() === now.getMonth();
			list = list.slice().sort(function (a, b) { return ORDER.indexOf(a[0]) - ORDER.indexOf(b[0]) || a[1] - b[1]; });
			/* its picture: a blog picture after the address the month's file gives once («g:…»), a cover upright, the rest square */
			var base = (by[day.getMonth() + 1] || {})._g || '';
			var card = function (x) {
				var years = now.getFullYear() - x[1], src = x[5] ? (x[5].indexOf('g:') === 0 ? base + x[5].slice(2) : x[5]) : '';
				return '<a class="otd-card otd-' + e(x[0]) + (src ? ' has-pic' : '') + '" href="' + e(x[3]) + '">' +
					(src ? '<span class="otd-pic' + (/\/covers\//.test(src) ? ' is-tall' : '') + '"><img src="' + e(src) + '" alt="" loading="lazy" decoding="async" referrerpolicy="no-referrer" onerror="this.parentNode.remove()"></span>' : '') +
					'<span class="otd-y">' + e(App.num(x[1])) + '</span><span class="otd-ago">' + e(years > 0 ? ago(years) : '') + '</span>' +
					'<span class="otd-k">' + e(t(KIND[x[0]] || x[0])) + (x[4] ? ' · ' + e(t(x[4])) : '') + '</span>' +
					'<b>' + e(t(x[2])) + '</b></a>';
			};
			var first = list.slice(0, 6), rest = list.slice(6);
			box.querySelector('.eyebrow').textContent = today ? L('في مثل هذا اليوم', 'On this day') : L('في مثل هذا الأسبوع', 'This week');
			box.querySelector('h2').textContent = App.num(day.getDate()) + ' ' + MONTHS[App.lang === 'en' ? 'en' : 'ar'][day.getMonth()];
			box.querySelector('.otd-list').innerHTML = first.map(card).join('') +
				(rest.length ? '<div class="otd-more" hidden>' + rest.map(card).join('') + '</div>' : '');
			var more = box.querySelector('.otd-all');
			more.hidden = !rest.length;
			more.textContent = L('كل ما في هذا اليوم (' + App.num(list.length) + ')', 'Everything on this day (' + list.length + ')');
			more.onclick = function () { var m = box.querySelector('.otd-more'); if (m) { m.hidden = false; m.style.display = 'contents'; } more.hidden = true; };
			box.hidden = false;
		});
	}
	window.OnThisDay = { mount: mount };
})();

/* «ما صدر بعد رحيله»: his books that came out after 2 April 2018 — on the Works page (works.html, #after), and read by
   «ذكراه كل عام» (remembrance.js) for each year's books. A book counts when the legacy timeline dates its release after
   his death (AKT.legacy, «صدور …» or its cover), or its year is 2019 or later; «شآبيب» (early 2018) came out in his life.
   Also the dates the two pages share: «2 أبريل 2018», «يونيو 2018», and how long after his death. */
(function () {
	'use strict';
	var DEATH = '2018-04-02';
	var MONTHS = {
		ar: ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'],
		en: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
	};
	var WEEKDAYS = {
		ar: ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'],
		en: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
	};
	/* an Arabic count with its noun: one, two, three to ten, eleven and on */
	function count(n, one, two, few, many) {
		var App = window.App;
		return n === 1 ? one : n === 2 ? two : (n % 100 >= 3 && n % 100 <= 10) ? App.num(n) + ' ' + few : App.num(n) + ' ' + many;
	}

	var P = window.Posthumous = {
		DEATH: DEATH,
		count: count,
		/* «2 أبريل 2018» / «April 2018» / «2018», from "2018-04-02", "2018-04" or "2018" */
		fmt: function (s) {
			var App = window.App, p = String(s || '').split('-'), m = MONTHS[App.lang] || MONTHS.ar;
			if (p.length === 3) return App.lang === 'ar' ? App.num(+p[2]) + ' ' + m[+p[1] - 1] + ' ' + App.num(p[0]) : m[+p[1] - 1] + ' ' + (+p[2]) + ', ' + p[0];
			if (p.length === 2) return m[+p[1] - 1] + ' ' + App.num(p[0]);
			return App.num(p[0]);
		},
		weekday: function (s) {
			var p = String(s || '').split('-');
			if (p.length !== 3) return '';
			return (WEEKDAYS[window.App.lang] || WEEKDAYS.ar)[new Date(Date.UTC(+p[0], +p[1] - 1, +p[2])).getUTCDay()];
		},
		/* «بعد رحيله بشهرين» / «4 years after his death» */
		since: function (s) {
			var App = window.App, L = App.L, p = String(s || '').split('-');
			var months = (+p[0] - 2018) * 12 + ((+p[1] || 6) - 4);
			if (months < 1) return L('في أيام رحيله', 'in the days after his death');
			/* «بشهرين» but «بـ3 أشهر»: the letter joined to a word, set apart from a number */
			var by = function (w) { return 'بعد رحيله ' + (/^[0-9٠-٩]/.test(w) ? 'بـ' : 'ب') + w; };
			if (months < 12) return L(by(count(months, 'شهر', 'شهرين', 'أشهر', 'شهرًا')), months + ' month' + (months > 1 ? 's' : '') + ' after his death');
			var y = Math.round(months / 12);
			return L(by(count(y, 'عام', 'عامين', 'أعوام', 'عامًا')), y + ' year' + (y > 1 ? 's' : '') + ' after his death');
		},
		/* the books, oldest first: { w, date, legacy (its index on the legacy timeline, or -1) } */
		list: function () {
			var App = window.App, d = App.data(), legacy = d.legacy || [], seen = {}, out = [];
			(d.works || []).forEach(function (w) {
				if (seen[w.id]) return;
				seen[w.id] = 1;
				var title = (w.title && w.title.ar || '').replace(/\s*[:(].*$/, '');
				var li = legacy.findIndex(function (l) {
					return l.image === 'cover:' + w.id || (/صدور/.test(l.title.ar) && title.length > 2 && l.title.ar.indexOf(title) >= 0);
				});
				var date = li >= 0 ? legacy[li].date : String(w.year || '');
				if (!(date > DEATH && (li >= 0 || +w.year >= 2019))) return;
				out.push({ w: w, date: date, legacy: li });
			});
			return out.sort(function (a, b) { return a.date < b.date ? -1 : a.date > b.date ? 1 : 0; });
		},
		mount: function (sec) {
			var App = window.App, S = window.WorksShared, d = App.data(), e = App.esc, t = App.t, L = App.L;
			if (!sec || !S) return;
			var list = P.list();
			if (!list.length) { sec.hidden = true; return; }
			sec.querySelector('.eyebrow').textContent = L('بعد 2 أبريل 2018', 'After 2 April 2018');
			sec.querySelector('h2').textContent = L('ما صدر بعد رحيله', 'Published after his death');
			sec.querySelector('.pm-lead').innerHTML = e(L(count(list.length, 'كتاب', 'كتابان', 'كتب', 'كتابًا') + ' خرجت إلى قرّائه بعد أن رحل: قصص ومقالات وترجمات ورواية وشِعر، عامًا بعد عام.',
				list.length + ' books reached his readers after he was gone: stories, articles, translations, a novel and poems, year after year.')) +
				' <a href="remembrance.html">' + e(L('وكل ما جرى في ذكراه عامًا بعام ←', 'And all that came each year in his memory →')) + '</a>';
			sec.querySelector('.pm-list').innerHTML = list.map(function (x) {
				var w = x.w, info = (d.bookInfo || {})[w.id] || {}, cover = S.coverOf(info);
				return '<li class="pm-item rise"><a class="pm-book" href="' + e(S.bookHref(w.id)) + '">' +
					S.miniCover({ img: cover, color: w.color || '#3a1414', title: t(w.title) }) +
					'<span class="pm-tx"><small class="pm-when">' + e(P.fmt(x.date)) + ' · ' + e(P.since(x.date)) + '</small>' +
						'<b>' + e(t(w.title)) + '</b>' +
						'<span class="pm-meta">' + e(t(S.TYPES[w.type] || { ar: w.type, en: w.type })) + (w.publisher ? ' · ' + e(t(w.publisher)) : '') + '</span>' +
						(w.note && t(w.note) ? '<span class="pm-note">' + e(t(w.note)) + '</span>' : '') +
					'</span></a></li>';
			}).join('');
			sec.hidden = false;
		}
	};
})();

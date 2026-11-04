/* «ذكراه كل عام» (remembrance.html): every 2 April since 2018, year by year — the first anniversary, the second… — each with
   what the year brought in his memory: the legacy timeline's events (AKT.legacy, each to its place on legacy.html), the books
   that came out (posthumous.js), the words said of him (AKT.tributes) and the articles and films about him (AKT.media); the
   anniversary's own day marked. Over it, the days to the next one; above, its band: a candle a year, the next still unlit. */
window.PAGE = {
	id: 'remembrance',
	title: { ar: 'ذكراه كل عام', en: 'Remembered every year' },
	strings: {
		eyebrow: { ar: 'في كل 2 أبريل', en: 'Every 2 April' },
		title: { ar: 'ذكراه كل عام', en: 'Remembered every year' },
		lead: { ar: 'رحل مساء الاثنين 2 أبريل 2018. ومنذ ذلك اليوم يعود قرّاؤه إليه كل عام: كتب تصدر، ومسلسلات تُعرض، وقبر صار مزارًا، ومعارض تحتفي به. هنا كل عام بذكراه، من الأولى إلى اليوم.',
			en: 'He died on the evening of Monday 2 April 2018. Every year since, his readers have come back to him: books coming out, series on screen, a grave that became a place of visits, book fairs in his honour. Here is each year of his memory, from the first to today.' }
	},
	FIRST: 2019,
	ORD: {
		ar: ['', 'الأولى', 'الثانية', 'الثالثة', 'الرابعة', 'الخامسة', 'السادسة', 'السابعة', 'الثامنة', 'التاسعة', 'العاشرة', 'الحادية عشرة', 'الثانية عشرة', 'الثالثة عشرة', 'الرابعة عشرة', 'الخامسة عشرة'],
		en: ['', 'first', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh', 'eighth', 'ninth', 'tenth', 'eleventh', 'twelfth', 'thirteenth', 'fourteenth', 'fifteenth']
	},
	ord: function (n) {
		var A = window.App, o = this.ORD[A.lang] || this.ORD.ar;
		return A.L('الذكرى ' + (o[n] || A.num(n)), 'The ' + (o[n] || n + 'th') + ' anniversary');
	},
	/* the next 2 April: its year, and the days to it (0 on the day) */
	next: function () {
		var now = new Date(), today = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
		var y = now.getFullYear(), at = Date.UTC(y, 3, 2);
		if (today > at) { y++; at = Date.UTC(y, 3, 2); }
		return { year: y, days: Math.round((at - today) / 864e5) };
	},
	years: function (d) {
		var self = this, P = window.Posthumous, out = {}, last = Math.max(new Date().getFullYear(), this.FIRST);
		for (var y = this.FIRST; y <= last; y++) out[y] = { y: y, ev: [], books: [], who: [], media: [] };
		(d.legacy || []).forEach(function (l, i) { var y = +String(l.date).slice(0, 4); if (out[y]) out[y].ev.push({ l: l, i: i }); });
		(d.tributes || []).forEach(function (p, i) { var y = +String(p.date).slice(0, 4); if (out[y]) out[y].who.push({ p: p, i: i }); });
		(d.media || []).forEach(function (m, i) { if (out[+m.year]) out[+m.year].media.push({ m: m, i: i }); });
		(P ? P.list() : []).forEach(function (b) { var y = +String(b.date).slice(0, 4); if (out[y]) out[y].books.push(b); });
		/* a book's release on the legacy timeline is told once, as the book */
		var asBook = {};
		Object.keys(out).forEach(function (k) { out[k].books.forEach(function (b) { if (b.legacy >= 0) asBook[b.legacy] = 1; }); });
		Object.keys(out).forEach(function (k) { out[k].ev = out[k].ev.filter(function (v) { return !asBook[v.i]; }); });
		return Object.keys(out).map(function (k) { return out[k]; }).filter(function (x) { return x.y < last || x.ev.length || x.books.length || x.who.length || x.media.length; });
	},
	pic: function (l) {
		var s = l.image || '', S = window.WorksShared, A = window.App;
		if (s === 'portrait') return 'assets/img/photos/youm7-e94d8bd9a946.jpg';
		if (s.indexOf('yt:') === 0) return 'https://i.ytimg.com/vi/' + s.slice(3) + '/mqdefault.jpg';
		if (s.indexOf('cover:') === 0) return S ? A.thumb(S.coverOf((A.data().bookInfo || {})[s.slice(6)] || {})) : '';
		return s;
	},

	/* the band: a candle for each anniversary so far, lit, and the next one waiting */
	band: function (d, A) {
		var self = window.PAGE, e = A.esc, n = self.next(), html = '';
		for (var y = self.FIRST; y <= n.year; y++) {
			var lit = y < n.year || n.days === 0;
			html += '<span class="rm-candle' + (lit ? ' is-lit' : '') + '" style="--i:' + (y - self.FIRST) + '"><i class="rm-flame"></i><i class="rm-wax"></i><b>' + e(A.num(y)) + '</b></span>';
		}
		return '<div class="rm-band">' + html + '</div>';
	},

	render: function () {
		var A = window.App, d = A.data(), e = A.esc, t = A.t, L = A.L, P = window.Posthumous, S = window.WorksShared, self = this;
		if (!P) return;
		var n = this.next(), list = this.years(d).reverse();
		var countdown = '<section class="section rm-next-sec"><div class="wrap"><div class="rm-next">' +
			'<span class="rm-next-flame" aria-hidden="true"><i></i></span>' +
			'<div><p class="eyebrow">' + e(n.days === 0 ? L('اليوم', 'Today') : L('الذكرى القادمة', 'The next anniversary')) + '</p>' +
				'<h2>' + e(this.ord(n.year - 2018)) + '</h2>' +
				'<p>' + e(P.weekday(n.year + '-04-02') + ' ' + P.fmt(n.year + '-04-02')) + ' · ' +
					e(n.days === 0 ? L('اليوم يمرّ على رحيله ' + A.num(n.year - 2018) + ' أعوام', 'It is today') : L('بعد ' + A.num(n.days) + ' يومًا', 'in ' + n.days + ' days')) + '</p></div>' +
			'<a class="buy-btn" href="tributes.html#farewell">' + e(L('الوداع، يومًا بيوم ←', 'The farewell, day by day →')) + '</a>' +
			'</div></div></section>';
		var yearHTML = function (x) {
			var k = x.y - 2018, day = x.y + '-04-02';
			var onDay = x.ev.filter(function (v) { return v.l.date === day; }), rest = x.ev.filter(function (v) { return v.l.date !== day; });
			var ev = function (v, mark) {
				var src = self.pic(v.l);
				return '<a class="rm-ev' + (mark ? ' is-day' : '') + '" href="legacy.html#l-' + v.i + '">' +
					(src ? '<img src="' + e(src) + '" alt="" loading="lazy" referrerpolicy="no-referrer">' : '') +
					'<span><small>' + e(mark ? L('في يوم ذكراه', 'On the anniversary') : P.fmt(v.l.date)) + '</small><b>' + e(t(v.l.title)) + '</b>' + e(t(v.l.text)) + '</span></a>';
			};
			var c = function (n, ar, en) { return n ? '<i>' + e(A.lang === 'ar' ? P.count(n, ar[0], ar[1], ar[2], ar[3]) : n + ' ' + en + (n > 1 ? 's' : '')) + '</i>' : ''; };
			var counts = c(x.ev.length, ['حدث واحد', 'حدثان', 'أحداث', 'حدثًا'], 'event') + c(x.books.length, ['كتاب واحد', 'كتابان', 'كتب', 'كتابًا'], 'book') +
				c(x.who.length, ['شهادة واحدة', 'شهادتان', 'شهادات', 'شهادة'], 'tribute') + c(x.media.length, ['مقال واحد', 'مقالان', 'مقالات', 'مقالًا'], 'article');
			return '<li class="rm-year rise" id="y' + x.y + '">' +
				'<div class="rm-head"><span class="rm-flag" aria-hidden="true">' + e(A.num(k)) + '</span>' +
					'<div><h3>' + e(self.ord(k)) + '</h3><p>' + e(P.weekday(day) + ' ' + P.fmt(day)) + '</p></div>' +
					'<span class="rm-counts">' + counts + '</span></div>' +
				(x.ev.length || x.books.length || x.who.length || x.media.length ? '' : '<p class="rm-empty">' + e(L('لا شيء مسجّل لهذا العام بعد. إن كنت تعرف ما جرى فيه في ذكراه فأخبرنا من «تواصل وساهم».', 'Nothing recorded for this year yet. If you know what happened in his memory, tell us from «Contact & contribute».')) + '</p>') +
				(onDay.length || rest.length ? '<div class="rm-evs">' + onDay.map(function (v) { return ev(v, true); }).join('') + rest.map(function (v) { return ev(v, false); }).join('') + '</div>' : '') +
				(x.books.length ? '<div class="rm-group"><h4>' + e(L('صدر له هذا العام', 'Published this year')) + '</h4><div class="rm-books">' + x.books.map(function (b) {
					return '<a class="cover-link" href="' + e(S.bookHref(b.w.id)) + '">' + S.miniCover({ img: S.coverOf((d.bookInfo || {})[b.w.id] || {}), color: b.w.color || '#3a1414', title: t(b.w.title) }) +
						'<span class="cl-t">' + e(t(b.w.title)) + ' — ' + e(P.fmt(b.date)) + '</span></a>';
				}).join('') + '</div></div>' : '') +
				(x.who.length ? '<div class="rm-group"><h4>' + e(L('قالوا عنه', 'Said of him')) + '</h4><ul class="rm-who">' + x.who.map(function (w) {
					return '<li><a href="tributes.html#t-' + w.i + '">' + (w.p.photo ? '<img src="' + e(w.p.photo) + '" alt="" loading="lazy" referrerpolicy="no-referrer">' : '') +
						'<span><b>' + e(t(w.p.name)) + '</b><q>' + e(t(w.p.quote)) + '</q></span></a></li>';
				}).join('') + '</ul></div>' : '') +
				(x.media.length ? '<div class="rm-group"><h4>' + e(L('كُتب عنه وعُرض', 'Written and shown about him')) + '</h4><ul class="rm-media">' + x.media.map(function (m) {
					return '<li><a href="' + e(m.m.url) + '" target="_blank" rel="noopener"><b>' + e(t(m.m.title)) + '</b>' + (m.m.outlet ? '<small>' + e(t(m.m.outlet)) + '</small>' : '') + '</a></li>';
				}).join('') + '</ul></div>' : '') +
			'</li>';
		};
		document.getElementById('content').innerHTML = countdown +
			'<section class="section"><div class="wrap">' +
				'<nav class="rm-jump chips" aria-label="' + e(L('الأعوام', 'The years')) + '">' + list.map(function (x) { return '<a class="chip" href="#y' + x.y + '">' + e(A.num(x.y)) + '</a>'; }).join('') + '</nav>' +
				'<ol class="rm-years">' + list.map(yearHTML).join('') +
					'<li class="rm-year rm-zero rise"><div class="rm-head"><span class="rm-flag" aria-hidden="true">' + e(A.num(0)) + '</span><div><h3>' + e(L('عام الرحيل', 'The year he died')) + '</h3><p>' + e(P.weekday(P.DEATH) + ' ' + P.fmt(P.DEATH)) + '</p></div></div>' +
						'<p class="rm-empty">' + e(L('الأيام الأولى بعد رحيله على صفحة «قالوا عنه»، وما صدر له منذئذ على صفحة «الأعمال».', 'The first days after his death are on «Tributes», and what has come out since on «Works».')) +
						' <a href="tributes.html#farewell">' + e(L('الوداع، يومًا بيوم', 'The farewell, day by day')) + '</a> · <a href="works.html#after">' + e(L('ما صدر بعد رحيله', 'Published after his death')) + '</a></p></li>' +
				'</ol>' +
			'</div></section>';
	}
};

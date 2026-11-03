/* «إحصاءات الموقع»: what the site holds, counted from its own data as the home page counts it — the third step of numbers.html
   (#stats; once on the covers page). And every cover the site holds, once (each issue's and book's cover and those of its
   other editions), which the covers page hangs on its wall and these numbers count. */
window.SiteStats = {
	covers: function () {
		if (this._covers) return this._covers;
		var App = window.App, S = window.WorksShared, d = App.data(), t = App.t, seen = {}, out = [];
		var add = function (src, href, title, sid, n, ed) {
			if (!src || seen[src]) return;
			seen[src] = 1;
			out.push({ src: src, href: href, title: title, sid: sid, n: n, ed: ed || '' });
		};
		S.ownSeries().concat(S.contributedSeries()).forEach(function (s) {
			S.seriesIssues(s.id).forEach(function (is, i) {
				var href = App.issueHref(s.id, Object.assign({ _idx: i }, is)), key = decodeURIComponent(href.replace(/^book\.html\?id=/, ''));
				add(S.issueCover(s.id, is), href, t(is.title), s.id, is.n);
				(((d.issueInfo || {})[key] || {}).editions || []).forEach(function (ed) { add(S.coverOf(ed), href, t(is.title), s.id, is.n, t(ed.publisher) + (ed.year ? ' ' + ed.year : '')); });
			});
		});
		(d.works || []).forEach(function (w) {
			var info = (d.bookInfo || {})[w.id] || {};
			add(S.coverOf(info), S.bookHref(w.id), t(w.title), 'works');
			(info.editions || []).forEach(function (ed) { add(S.coverOf(ed), S.bookHref(w.id), t(w.title), 'works', null, t(ed.publisher) + (ed.year ? ' ' + ed.year : '')); });
		});
		return (this._covers = out);
	},

	/* the numbers, each leading to where they are: [count, label, href] */
	tiles: function () {
		var App = window.App, S = window.WorksShared, d = App.data(), L = App.L;
		var issues = 0, editions = 0, au = d.audio || {}, heard = {}, w = d.writers || {}, people = {};
		(d.series || []).forEach(function (s) { issues += S.seriesIssues(s.id).filter(function (is) { return !(is.part > 1); }).length; });
		[d.issueInfo, d.bookInfo].forEach(function (store) { Object.keys(store || {}).forEach(function (k) { editions += ((store[k] || {}).editions || []).length; }); });
		/* every recording once, on every platform (home.js) */
		var hear = function (where, eps, at) { (eps || []).forEach(function (ep) { heard[where + ':' + ep[at || 0]] = 1; }); };
		Object.keys(au.issues || {}).forEach(function (k) { hear('ah', au.issues[k]); });
		hear('ah', au.midnight, 1);
		(au.seasons || []).concat(au.lasheenBooks || [], au.midnightSpoofs ? [au.midnightSpoofs] : []).forEach(function (x) { hear('ah', x.eps); });
		[au.storytel, au.iqraaly, au.storiapod].forEach(function (P, k) { if (P && P.items) Object.keys(P.items).forEach(function (key) { hear('p' + k, P.items[key]); }); });
		((au.storiapod || {}).dramas || []).forEach(function (x) { hear('sp', x.eps); });
		if (au.youtube) { Object.keys(au.youtube.issues || {}).forEach(function (k) { hear('yt', au.youtube.issues[k]); }); if (au.youtube.eslamAdel) hear('yt', au.youtube.eslamAdel.eps); }
		Object.keys(w).forEach(function (k) { (w[k] || []).forEach(function (p) { people[(p.name || {}).ar || (p.name || {}).en] = 1; }); });
		return [
			[issues, L('عددًا في سلاسله', 'issues in his series'), 'works.html'],
			[(d.works || []).length, L('كتابًا مستقلًا', 'standalone books'), 'works.html'],
			[this.covers().length, L('غلافًا على الجدار', 'covers on the wall'), 'covers.html#wall'],
			[editions, L('طبعة مسجّلة', 'editions recorded'), 'covers.html#editions'],
			[(d.publishers || []).length, L('دار نشر ومنصة', 'publishers and platforms'), 'publishers.html'],
			[(d.stats || {}).papers, L('مقالًا في الصحف', 'pieces in the papers'), 'blog.html#papers'],
			[(d.stats || {}).outlets, L('جريدة ومجلة وموقعًا', 'papers and sites he wrote for'), 'blog.html#papers'],
			[Object.keys(heard).length, L('تسجيلًا صوتيًا ومرئيًا', 'audio and video recordings'), 'audio.html'],
			[(d.media || []).length, L('لقاءً وفيلمًا عنه', 'interviews and films'), 'talks.html#talks'],
			[(d.characters || []).length, L('شخصية', 'characters'), 'characters.html'],
			[(d.quotes || []).length, L('اقتباسًا', 'quotes'), 'quotes.html'],
			[Object.keys(people).length, L('اسمًا من دائرته', 'people in his circle'), 'writers.html'],
			[(d.tributes || []).length, L('شهادة عنه', 'tributes'), 'tributes.html'],
			[(d.stats || {}).places, L('مكانًا على الخريطة', 'places on the map'), 'map.html'],
			[(d.legacy || []).length, L('حدثًا بعد رحيله', 'events after him'), 'legacy.html']
		].filter(function (x) { return x[0]; });
	}
};

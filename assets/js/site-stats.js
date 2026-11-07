/* numbers.html's «المسيرة»: his work and what the site holds of it, as one set, counted from the site's own data as the home
   page counts it (#career; «إحصاءات الموقع», #stats, was once a step of its own there, and before that on the covers page). And every cover the site holds, once (each issue's and book's cover and those of its
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

	/* the numbers, each leading to where they are: [count, label, href] (tools/build-meta.js reads the first for each address) */
	tiles: function () {
		var App = window.App, S = window.WorksShared, d = App.data(), L = App.L;
		var issues = 0, editions = 0, au = d.audio || {}, heard = {}, w = d.writers || {}, people = {}, main = d.series || [], st = d.stats || {};
		main.forEach(function (s) { issues += S.seriesIssues(s.id).filter(function (is) { return !(is.part > 1); }).length; });
		/* the series he wrote for beyond those of the main list (his own, and World Pocket Novels, which he carried on) */
		var beyond = S.contributedSeries().filter(function (s) { return !App.byId(main, s.id); }).length;
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
		/* a label is [Arabic for eleven and up, Arabic for three to ten, English] */
		return [
			[issues, ['عددًا في سلاسله', 'أعداد في سلاسله', 'issues in his series'], 'works.html'],
			[main.length, ['سلسلة', 'سلاسل', 'series'], 'series.html'],
			[beyond, ['سلسلة أخرى شارك فيها', 'سلاسل أخرى شارك فيها', 'more series he wrote for'], 'series.html'],
			[(d.works || []).length, ['كتابًا مستقلًا', 'كتب مستقلة', 'standalone books'], 'works.html'],
			[st.papers, ['مقالًا وقصة في الصحف', 'مقالات في الصحف', 'pieces in the papers'], 'blog.html#papers'],
			[st.outlets, ['جريدة ومجلة وموقعًا كتب لها', 'صحف ومواقع كتب لها', 'papers and sites he wrote for'], 'blog.html#papers'],
			[st.posts, ['منشورًا في المدونة', 'منشورات في المدونة', 'posts on the blog'], 'blog.html'],
			[this.covers().length, ['غلافًا على الجدار', 'أغلفة على الجدار', 'covers on the wall'], 'covers.html#wall'],
			[editions, ['طبعة مسجّلة', 'طبعات مسجّلة', 'editions recorded'], 'covers.html#editions'],
			[(d.publishers || []).length, ['دار نشر ومنصة', 'دور نشر ومنصات', 'publishers and platforms'], 'publishers.html'],
			[Object.keys(heard).length, ['تسجيلًا صوتيًا ومرئيًا', 'تسجيلات صوتية ومرئية', 'audio and video recordings'], 'audio.html'],
			[(d.media || []).length, ['لقاءً وفيلمًا عنه', 'لقاءات وأفلام عنه', 'interviews and films'], 'interviews.html'],
			[(d.characters || []).length, ['شخصية', 'شخصيات', 'characters'], 'characters.html'],
			[(d.quotes || []).length, ['اقتباسًا', 'اقتباسات', 'quotes'], 'quotes.html'],
			[Object.keys(people).length, ['اسمًا من دائرته', 'أسماء من دائرته', 'people in his circle'], 'writers.html'],
			[(d.tributes || []).length, ['شهادة عنه', 'شهادات عنه', 'tributes'], 'tributes.html'],
			[st.places, ['مكانًا على الخريطة', 'أماكن على الخريطة', 'places on the map'], 'map.html'],
			[(d.legacy || []).length, ['حدثًا بعد رحيله', 'أحداث بعد رحيله', 'events after him'], 'legacy.html']
		].filter(function (x) { return x[0]; }).map(function (x) {
			return [x[0], L(x[0] >= 3 && x[0] <= 10 ? x[1][1] : x[1][0], x[1][2]), x[2]];
		});
	}
};

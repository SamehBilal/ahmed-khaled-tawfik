/* sitemap.html — «خريطة الموقع»: every page in one place, from the same lists the header and footer are built from (App.UI),
   then the pages made one per series, book, character and person, with how many there are. */
window.PAGE = {
	id: 'sitemap',
	title: { ar: 'خريطة الموقع', en: 'Site map' },
	strings: {
		eyebrow: { ar: 'خلف الكواليس', en: 'Behind the site' },
		title: { ar: 'خريطة الموقع', en: 'Site map' },
		lead: {
			ar: 'كل صفحات الموقع في مكان واحد: الصفحات الرئيسية، وعالم العرّاب، وما صُنع من البيانات، وصفحات كل سلسلة وكتاب وشخصية.',
			en: 'Every page of the site in one place: the main pages, the Godfather’s world, the pages made from the data, and a page for each series, book and character.'
		}
	},

	/* the band: the site's pages as a map's dotted roads between named places */
	band: function (d, A) {
		var UI = A.UI, names = UI.nav.filter(function (n) { return !n.phone; }).map(function (n) { return n[A.lang === 'en' ? 'en' : 'ar']; }).slice(0, 9), out = '<svg class="sm-roads" viewBox="0 0 100 40" preserveAspectRatio="none"><path d="M2 30 C 20 6, 30 36, 50 18 S 80 4, 98 22"/><path d="M6 8 C 30 24, 60 34, 94 34"/></svg>';
		names.forEach(function (n, i) { out += '<span class="sm-pin" style="left:' + (6 + i * 10.5) + '%;top:' + (i % 2 ? 62 : 26) + '%">' + A.esc(n) + '</span>'; });
		return out;
	},

	render: function () {
		var App = window.App, d = App.data(), S = window.WorksShared, e = App.esc, t = App.t, L = App.L, UI = App.UI;
		var link = function (n) { return '<li><a href="' + e(n.href) + '">' + e(n[App.lang === 'en' ? 'en' : 'ar']) + '</a></li>'; };
		var seen = {}, once = function (list) { return list.filter(function (n) { if (seen[n.href]) return false; seen[n.href] = 1; return true; }); };
		var main = once(UI.nav.filter(function (n) { return !n.phone; }).concat(UI.more.filter(function (n) { return n.main; })));
		var world = once(UI.world), more = once(UI.more.filter(function (n) { return !n.main; }).concat(UI.nav.filter(function (n) { return n.phone; }))), legal = once(UI.legal);
		var series = (S.ownSeries ? S.ownSeries() : d.series || []).map(function (s) { return { href: S.seriesHref(s.id), ar: s.title.ar, en: s.title.en }; });
		var people = window.People ? window.People.all().length : 0;
		var block = function (title, list, note) { return '<section class="sm-block"><h2>' + e(title) + '</h2>' + (note ? '<p>' + e(note) + '</p>' : '') + '<ul>' + list.map(link).join('') + '</ul></section>'; };
		var counts = [
			[series.length, L('سلسلة، لكل منها صفحة', 'series, each with a page'), 'works.html'],
			[(d.works || []).length, L('كتابًا، لكل منها صفحة', 'books, each with a page'), 'works.html'],
			[(d.characters || []).length, L('شخصية، لكل منها صفحة', 'characters, each with a page'), 'characters.html'],
			[people, L('اسمًا من دائرته، لكل منهم صفحة', 'people in his circle, each with a page'), 'writers.html'],
			[(d.publishers || []).length, L('دار نشر ومنصة', 'publishers and platforms'), 'publishers.html'],
			[((d.blog || {}).posts || []).length || (d.stats || {}).papers, L('مقالًا في المدونة', 'articles in the blog'), 'blog.html']
		].filter(function (x) { return x[0]; });
		document.getElementById('content').innerHTML = '<section class="section sm"><div class="wrap"><div class="sm-grid">' +
			block(L('الصفحات الرئيسية', 'The main pages'), main) +
			block(L('عالم العرّاب', 'The Godfather’s world'), world) +
			block(L('اكتشف أكثر', 'Discover more'), more) +
			block(L('خلف الكواليس', 'Behind the site'), legal) +
			block(L('سلاسله', 'His series'), series) +
			'</div><h2 class="sm-h">' + e(L('صفحات كثيرة، واحدة لكل…', 'Many pages, one for each…')) + '</h2><div class="sm-counts">' + counts.map(function (x) {
				return '<a href="' + e(x[2]) + '"><b>' + e(App.num(x[0])) + '</b><span>' + e(x[1]) + '</span></a>';
			}).join('') + '</div></div></section>';
	}
};

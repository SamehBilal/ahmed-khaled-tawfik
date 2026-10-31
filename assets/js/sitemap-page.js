/* sitemap.html — «خريطة الموقع», drawn as G. Norman's CodePen sitemap draws one (codepen.io/g-norman/pen/RwwgmWy): a tall numbered
   tile for each main page, the pages that belong to it in tiles under it, and in lighter tiles the pages made one per series,
   issue, book, character and person with how many there are — counted as sitemap.xml counts them (tools/build-sitemap.js);
   the tiles rise in one after another. Names come from the lists the header and footer are built from (App.UI). */
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
		var App = window.App, d = App.data(), S = window.WorksShared, e = App.esc, L = App.L, UI = App.UI;
		/* every page the header and footer know, by its address, so a name here is the name there */
		var page = {};
		UI.nav.concat(UI.more, UI.world, UI.legal).forEach(function (n) { if (!page[n.href]) page[n.href] = n; });
		var name = function (href) { return (page[href] || {})[App.lang === 'en' ? 'en' : 'ar'] || href; };
		/* the pages made one per thing, counted as tools/build-sitemap.js counts them for sitemap.xml */
		var own = S.ownSeries(), wrote = S.contributedSeries(), issues = 0, books = 0, seen = {};
		own.concat(wrote).forEach(function (s) { S.seriesIssues(s.id).forEach(function (is, i) { issues++; seen[App.issueHref(s.id, Object.assign({ _idx: i }, is))] = 1; }); });
		/* a book that is also an issue (as «دماغي كده») has one page, counted once */
		(d.works || []).map(function (w) { return App.workHref(w.id); }).concat(S.entryBooks().map(function (x) { return S.entryBookHref(x.w); })).forEach(function (h) { if (!seen[h]) { seen[h] = 1; books++; } });
		var chars = (d.characters || []).filter(function (c) { return App.charHasPage(c.id); }).length;
		/* the tree, as the CodePen sitemap draws it: a tall numbered tile for each main page, under it the pages that belong to
		   it, and in a lighter tile the pages made one per thing, with how many */
		var TREE = [
			['index.html', ['guide.html']],
			['works.html', ['covers.html', 'translations.html', 'world.html', 'screen.html'], [[own.length + wrote.length, L('صفحة سلسلة', 'series pages')], [issues, L('صفحة عدد', 'issue pages')], [books, L('صفحة كتاب', 'book pages')]]],
			['characters.html', ['glossary.html', 'creatures.html', 'refaat-life.html', 'network.html'], [[chars, L('صفحة بطل', 'lead’s pages')]]],
			['writers.html', ['publishers.html', 'library.html'], [[window.People ? window.People.all().length : 0, L('صفحة اسم من دائرته', 'pages of his circle')], [S.publishers().length, L('صفحة دار نشر', 'publisher pages')]]],
			['quotes.html', []],
			['audio.html', []],
			['legacy.html', ['talks.html', 'awards.html', 'tanta.html', 'handwriting.html', 'map.html']],
			['tributes.html', []],
			['blog.html', ['papers.html', 'style.html', 'numbers.html'], [[((d.blog || {}).posts || []).length || (d.stats || {}).posts, L('مقال', 'articles')]]],
			['quiz.html', ['lists.html']],
			['about.html', UI.legal.map(function (n) { return n.href; }).filter(function (h) { return h !== 'about.html'; })]
		];
		/* a page the header or footer gains later and the tree does not place yet still shows, in the last column */
		var placed = {};
		TREE.forEach(function (c) { placed[c[0]] = 1; c[1].forEach(function (h) { placed[h] = 1; }); });
		var rest = Object.keys(page).filter(function (h) { return !placed[h]; });
		if (rest.length) TREE[TREE.length - 1][1] = TREE[TREE.length - 1][1].concat(rest);
		var k = 0, tile = function (cls, href, inner) { return '<a class="sm-item ' + cls + '" href="' + e(href) + '" style="--i:' + (k++) + '">' + inner + '</a>'; };
		var cols = TREE.map(function (c, i) {
			return '<div class="sm-col">' + tile('sm-main', c[0], '<span class="sm-n">' + e(App.num(('0' + (i + 1)).slice(-2))) + '</span><span class="sm-p">' + e(name(c[0])) + '</span>') +
				c[1].map(function (h) { return tile('sm-sub', h, '<span class="sm-p">' + e(name(h)) + '</span>'); }).join('') +
				(c[2] || []).filter(function (x) { return x[0]; }).map(function (x) { return tile('sm-one', c[0], '<span class="sm-p"><b>' + e(App.num(x[0])) + '</b> ' + e(x[1]) + '</span>'); }).join('') + '</div>';
		}).join('');
		var row = function (title, list) {
			return '<h2 class="sm-h">' + e(title) + '</h2><div class="sm-row">' + list.map(function (s) { return tile('sm-one', S.seriesHref(s.id), '<span class="sm-p">' + e(App.t(s.title)) + '</span>'); }).join('') + '</div>';
		};
		document.getElementById('content').innerHTML = '<section class="section sm"><div class="wrap">' +
			'<div class="sm-tree">' + cols + '</div>' +
			row(L('سلاسله', 'His series'), own) + (wrote.length ? row(L('سلاسل كتب فيها', 'Series he wrote for'), wrote) : '') +
			'<p class="sm-xml">' + e(L('ولمحركات البحث: ', 'And for search engines: ')) + '<a href="sitemap.xml" dir="ltr">sitemap.xml</a>' + e(L('، فيها كل هذه العناوين مع أغلفتها.', ', with all these addresses and their covers.')) + '</p></div></section>';
	}
};

/* A wall of his books as small covers (assets/css/mosaic.css): every standalone book and series,
   then Ma Wara' al-Tabi'a issues to fill it. Drawn at the top of the Works page into <ul id="mosaic">. */
(function () {
	'use strict';

	function render() {
		var App = window.App, d = App.data(), S = window.WorksShared, t = App.t, e = App.esc;
		var ul = document.getElementById('mosaic');
		if (!ul || !S) return;
		ul.parentNode.setAttribute('aria-label', App.L('كتبه', 'His books'));
		var items = [];
		(d.works || []).forEach(function (w) {
			items.push({ href: S.bookHref(w.id), title: t(w.title), color: w.color, img: S.coverOf((d.bookInfo || {})[w.id]) });
		});
		S.ownSeries().concat(S.contributedSeries()).forEach(function (s) {
			items.push({ href: S.seriesHref(s.id), title: t(s.title), color: s.color, img: S.seriesCover(s.id) });
		});
		var mwt = App.byId(d.series, 'mwt');
		/* about 68 books, rounded up so the last row is full: with 2k+1 grid columns a row holds k books */
		var cols = getComputedStyle(ul).gridTemplateColumns.split(' ').length, k = Math.max(1, (cols - 1) / 2);
		var want = Math.ceil(Math.max(68, items.length) / k) * k;
		S.seriesIssues('mwt').forEach(function (is) {
			if (items.length >= want || is.part > 1) return;
			items.push({ href: App.issueHref('mwt', is), title: t(is.title), color: mwt && mwt.color, num: App.num(is.n), img: S.issueCover('mwt', is) });
		});
		ul.setAttribute('data-k', k);
		ul.innerHTML = items.map(function (it) {
			return '<li><a href="' + e(it.href) + '" title="' + e(it.title) + '">' +
				S.miniCover({ img: it.img, color: it.color, title: it.title, num: it.num }) + '</a></li>';
		}).join('');
	}

	/* a resize that changes how many books a row holds redraws the wall, so its last row stays full */
	var timer;
	window.addEventListener('resize', function () {
		clearTimeout(timer);
		timer = setTimeout(function () {
			var ul = document.getElementById('mosaic');
			if (!ul || !ul.children.length) return;
			var cols = getComputedStyle(ul).gridTemplateColumns.split(' ').length;
			if (String(Math.max(1, (cols - 1) / 2)) !== ul.getAttribute('data-k')) render();
		}, 200);
	});

	window.Mosaic = { render: render };
})();

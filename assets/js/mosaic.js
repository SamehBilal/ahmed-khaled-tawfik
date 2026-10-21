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
			items.push({ href: S.seriesHref(s.id), title: t(s.title), color: s.color });
		});
		var mwt = App.byId(d.series, 'mwt');
		S.seriesIssues('mwt').forEach(function (is) {
			if (items.length >= 68 || is.part > 1) return;
			items.push({ href: App.issueHref('mwt', is), title: t(is.title), color: mwt && mwt.color, num: App.num(is.n), img: S.issueCover('mwt', is) });
		});
		ul.innerHTML = items.map(function (it) {
			return '<li><a href="' + e(it.href) + '" title="' + e(it.title) + '">' +
				S.miniCover({ img: it.img, color: it.color, title: it.title, num: it.num }) + '</a></li>';
		}).join('');
	}

	window.Mosaic = { render: render };
})();

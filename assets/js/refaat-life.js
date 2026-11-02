/* refaat-life.html — «يوميات رفعت إسماعيل»: the life of Dr. Refaat Ismail as Ma Wara' al-Tabi'a tells it, from Kafr Badr in 1924
   to the last morning of issue 80 (AKT.refaatLife, data-pages.js): a timeline, each event with the issue it is told in. */
window.PAGE = {
	id: 'refaat-life',
	title: { ar: 'يوميات رفعت إسماعيل', en: 'The life of Refaat Ismail' },
	strings: {
		eyebrow: { ar: 'من مذكراته', en: 'From his memoirs' },
		title: { ar: 'يوميات رفعت إسماعيل', en: 'The life of Refaat Ismail' },
		lead: {
			ar: 'حياة رفعت إسماعيل كما ترويها «ما وراء الطبيعة»: من قرية كفر بدر إلى دندي ورومانيا، من ماجي إلى هويدا، حتى الصباح الأخير في العدد الثمانين.',
			en: 'Refaat Ismail’s life as Ma Wara’ al-Tabi’a tells it: from the village of Kafr Badr to Dundee and Romania, from Maggie to Huwaida, to the last morning in issue eighty.'
		}
	},

	/* the band: after Chris Bolson's circular timeline on CodePen (vEBWwxL) — his life as a great wheel, half of it showing, each
	   moment a mark on its rim named by its year, its issue («ع ٢٠») or the time of his life; one chosen (a click, or the arrow
	   keys: they are radio buttons, as in the pen), the wheel turns to bring it to the top, a line drops from it and its title
	   and its story rise in the middle, with the issue it is told in */
	band: function (d, A) {
		var e = A.esc, t = A.t, L = A.L, S = window.WorksShared, list = d.refaatLife || [], self = window.PAGE;
		var issues = S ? S.seriesIssues('mwt') : [], byKey = {};
		issues.forEach(function (is, i) { byKey[decodeURIComponent(A.issueHref('mwt', Object.assign({ _idx: i }, is)).replace(/^book\.html\?id=/, ''))] = [is, i]; });
		var mark = function (x) {
			var w = t(x.when), hit = x.issue && byKey[x.issue];
			return /^\d/.test(x.when.en || x.when.ar) ? w : hit ? L('ع ' + A.num(hit[0].n), '#' + hit[0].n) : w;
		};
		setTimeout(function () { self.wheelWire(); }, 0);
		return '<div class="rw"><ul class="rw-cards" style="--items:' + list.length + ';--index:0">' + list.map(function (x, i) {
			var hit = x.issue && byKey[x.issue];
			return '<li style="--i:' + i + '"><input type="radio" id="rw-' + i + '" name="rw" value="' + i + '"' + (i ? '' : ' checked') + '>' +
				'<label for="rw-' + i + '" title="' + e(t(x.title)) + '">' + e(mark(x)) + '</label>' +
				'<div class="rw-info"><p class="rw-when">' + e(t(x.when)) + '</p><h2>' + e(t(x.title)) + '</h2><p>' + e(t(x.text)) + '</p>' +
					(hit ? '<a href="' + e(A.issueHref('mwt', Object.assign({ _idx: hit[1] }, hit[0]))) + '">' + e(L('العدد ' + A.num(hit[0].n) + ': ' + t(hit[0].title) + ' ←', 'Issue ' + hit[0].n + ': ' + t(hit[0].title) + ' →')) + '</a>' : '') +
				'</div></li>';
		}).join('') + '</ul></div>';
	},
	/* the wheel turns to the chosen moment (the pen sets this with :has() for each item; here the radio's own value does it) */
	wheelWire: function () {
		var ul = document.querySelector('.rw-cards');
		if (!ul || ul.getAttribute('data-on')) return;
		ul.setAttribute('data-on', '1');
		var ph = ul.closest('.ph');
		if (ph) ph.removeAttribute('aria-hidden'); /* (its marks are controls) */
		var radios = [].slice.call(ul.querySelectorAll('input[name="rw"]'));
		/* (chosen here, not left to the browser: its radio, wherever on the turned wheel it sits, is focused without the page
		   being scrolled to it) */
		var pick = function (k, auto) {
			var r = radios[(k + radios.length) % radios.length];
			r.checked = true;
			if (!auto) { r.focus({ preventScroll: true }); rest = Date.now() + 15000; }
			ul.style.setProperty('--index', r.value);
		};
		ul.addEventListener('click', function (ev) {
			var lb = ev.target.closest('label[for^="rw-"]');
			if (!lb) return;
			ev.preventDefault();
			pick(+lb.getAttribute('for').slice(3));
		});
		ul.addEventListener('keydown', function (ev) {
			var k = radios.indexOf(document.activeElement), step = { ArrowLeft: 1, ArrowDown: 1, ArrowRight: -1, ArrowUp: -1 }[ev.key];
			if (k < 0 || !step) return;
			ev.preventDefault();
			/* (left is the next moment in Arabic, as the wheel runs; right in English) */
			pick(k + (getComputedStyle(ul).direction === 'rtl' ? step : -step));
		});
		/* and on by itself: the next moment every seven seconds, held while the pointer or the focus is on it, for a while after
		   one is chosen by hand, and while the band is off screen; never for those who ask for less motion */
		var rest = 0, held = false, seen = true;
		var still = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
		var wheel = ul.closest('.rw');
		wheel.addEventListener('pointerenter', function () { held = true; });
		wheel.addEventListener('pointerleave', function () { held = false; });
		wheel.addEventListener('focusin', function () { held = true; });
		wheel.addEventListener('focusout', function () { held = false; });
		if (window.IntersectionObserver) new IntersectionObserver(function (es) { seen = es[0].isIntersecting; }).observe(wheel);
		if (!still) var timer = setInterval(function () {
			if (!document.body.contains(ul)) { clearInterval(timer); return; }
			if (held || !seen || document.hidden || Date.now() < rest) return;
			pick(radios.findIndex(function (r) { return r.checked; }) + 1, true);
		}, 7000);
	},

	render: function () {
		var App = window.App, S = window.WorksShared, e = App.esc, t = App.t, L = App.L, list = App.data().refaatLife || [];
		var issues = S.seriesIssues('mwt'), byKey = {};
		issues.forEach(function (is, i) { byKey[decodeURIComponent(App.issueHref('mwt', Object.assign({ _idx: i }, is)).replace(/^book\.html\?id=/, ''))] = [is, i]; });
		var c = (App.data().characters || []).filter(function (x) { return x.id === 'refaat'; })[0];
		var pic = (App.data().charFigures || {}).refaat || (c && c.image);
		document.getElementById('content').innerHTML = '<section class="section rl"><div class="wrap">' +
			'<div class="rl-intro">' + (pic ? '<img src="' + e(pic) + '" alt="">' : '') + '<div><p>' + e(c ? t(c.desc) : '') + '</p>' +
				'<p class="rl-links"><a href="character.html?id=refaat">' + e(L('صفحة رفعت إسماعيل ←', 'Refaat Ismail’s page →')) + '</a> · <a href="series.html?id=mwt">' + e(L('«ما وراء الطبيعة» ←', 'Ma Wara’ al-Tabi’a →')) + '</a> · <a href="creatures.html">' + e(L('وحوش وأساطير ←', 'Monsters & legends →')) + '</a></p></div></div>' +
			'<ol class="rl-line">' + list.map(function (x) {
				var hit = x.issue && byKey[x.issue];
				return '<li><span class="rl-when">' + e(t(x.when)) + '</span><div class="rl-body"><h3>' + e(t(x.title)) + '</h3><p>' + e(t(x.text)) + '</p>' +
					(hit ? '<a class="rl-issue" href="' + e(App.issueHref('mwt', Object.assign({ _idx: hit[1] }, hit[0]))) + '">' + S.miniCover({ img: S.issueCover('mwt', hit[0]), color: '#3a1414', title: t(hit[0].title), num: App.num(hit[0].n) }) +
						'<span>' + e(L('العدد ', 'Issue ') + App.num(hit[0].n)) + '<b>' + e(t(hit[0].title)) + '</b></span></a>' : '') +
					(x.source ? '<a class="rl-src" href="' + e(x.source) + '" target="_blank" rel="noopener">' + e(L('المصدر ↗', 'Source ↗')) + '</a>' : '') + '</div></li>';
			}).join('') + '</ol>' +
			'<p class="rl-note">' + e(L('ما تقوله الأعداد نفسها عن حياته؛ حيث لا تذكر سنة، فالترتيب ترتيب الأعداد.', 'What the issues themselves say of his life; where they give no year, the order is the issues’ order.')) + '</p>' +
		'</div></section>';
	}
};

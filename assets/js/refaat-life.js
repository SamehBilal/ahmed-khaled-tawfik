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

	/* the band: a page of his memoirs, ruled, with dates in the margin and a lamp's glow */
	band: function (d, A) {
		var e = A.esc, t = A.t, list = (d.refaatLife || []).slice(0, 9);
		return '<div class="rl-page">' + list.map(function (x, i) {
			return '<p style="--d:' + (i * 0.5).toFixed(1) + 's"><b>' + e(t(x.when)) + '</b>' + e(t(x.title)) + '</p>';
		}).join('') + '</div><i class="rl-lamp"></i>';
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

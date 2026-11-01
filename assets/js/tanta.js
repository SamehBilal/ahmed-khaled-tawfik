/* «طنطا، مدينته», a part of «سيرته» on talks.html (#tanta; once a page of its own, tanta.html): his city — the houses he was born
   and lived in, his schools, the faculty and hospital, the mosque of his funeral and his grave, what was done there in his memory,
   and the Tanta of his columns and stories (AKT.tanta, data-pages.js): by kind, each with its source. talks.js draws it with
   TantaSection.html(). */
window.TantaSection = {
	GROUPS: [
		[['home', 'school'], { ar: 'البيت والمدرسة', en: 'Home and school' }],
		[['university', 'hospital'], { ar: 'الطبيب', en: 'The doctor' }],
		[['mosque', 'grave', 'memorial', 'event'], { ar: 'الوداع والذكرى', en: 'Farewell and memory' }],
		[['other', 'fiction', 'cafe'], { ar: 'طنطا في كتاباته', en: 'Tanta in his writing' }]
	],

	html: function () {
		var App = window.App, e = App.esc, t = App.t, L = App.L, list = App.data().tanta || [];
		var bio = App.data().bio || {};
		if (!list.length) return '';
		return '<section class="section tn" id="tanta"><div class="wrap">' +
			'<h2 class="tk-h">' + e(L('طنطا، مدينته', 'Tanta, his city')) + '</h2>' +
			'<p class="tn-lead">' + e(L('وُلد في طنطا وعاش فيها ودرّس في كليتها ودُفن في ترابها: بيوته ومدارسه وكليته، ومسجد جنازته وقبره، وطنطا كما كتبها في مقالاته.', 'He was born in Tanta, lived and taught there, and lies buried there: his homes, schools and faculty, the mosque of his funeral and his grave, and Tanta as he wrote it in his columns.')) + '</p>' +
			'<div class="tn-dates"><div><b>' + e(App.num(1962)) + '</b><span>' + e(t((bio.born || {}).place || { ar: 'طنطا', en: 'Tanta' })) + '</span></div>' +
				'<div><b>' + e(App.num(2018)) + '</b><span>' + e(L('دُفن في طنطا', 'Buried in Tanta')) + '</span></div></div>' +
			this.GROUPS.map(function (g) {
				var items = list.filter(function (x) { return g[0].indexOf(x.kind) >= 0; });
				if (!items.length) return '';
				return '<h3 class="tn-h">' + e(t(g[1])) + '</h3><div class="tn-grid">' + items.map(function (x) {
					var map = x.lat != null && x.lng != null ? 'https://www.openstreetmap.org/?mlat=' + x.lat + '&mlon=' + x.lng + '#map=17/' + x.lat + '/' + x.lng : '';
					return '<article class="tn-card tn-' + e(x.kind) + '">' + (x.year ? '<b class="tn-y">' + e(App.num(x.year)) + '</b>' : '') +
						'<h4>' + e(t(x.name)) + '</h4><p>' + e(t(x.text)) + '</p>' +
						'<p class="tn-src">' + (map ? '<a href="' + e(map) + '" target="_blank" rel="noopener">' + e(L('على الخريطة ↗', 'On the map ↗')) + '</a> · ' : '') +
						'<a href="' + e(x.source) + '" target="_blank" rel="noopener">' + e(/aktowfik\.blogspot/.test(x.source) ? L('في مقاله ↗', 'In his column ↗') : L('المصدر ↗', 'Source ↗')) + '</a></p></article>';
				}).join('') + '</div>';
			}).join('') +
			'<p class="tn-note">' + e(L('تختلف بعض المصادر في التفاصيل (بيت الميلاد مثلًا)، فذكرنا ما قاله كل منها. تعرف مكانًا آخر في طنطا مرتبطًا به؟ أرسله من ', 'Some sources differ on details (his birthplace, for one), so each is given as it says. Know another place in Tanta tied to him? Send it from ')) +
				'<a href="contact.html#contribute">' + e(L('«تواصل وساهم»', 'Contact & contribute')) + '</a>.</p>' +
		'</div></section>';
	}
};

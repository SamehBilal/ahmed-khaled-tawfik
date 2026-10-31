/* tanta.html — «طنطا»: his city — the houses he was born and lived in, his schools, the faculty and hospital, the mosque of his
   funeral and his grave, what was done there in his memory, and the Tanta of his columns and stories (AKT.tanta, data-pages.js):
   by kind, each with its source. */
window.PAGE = {
	id: 'tanta',
	title: { ar: 'طنطا', en: 'Tanta' },
	strings: {
		eyebrow: { ar: 'مدينته', en: 'His city' },
		title: { ar: 'طنطا', en: 'Tanta' },
		lead: {
			ar: 'وُلد في طنطا وعاش فيها ودرّس في كليتها ودُفن في ترابها: بيوته ومدارسه وكليته، ومسجد جنازته وقبره، وطنطا كما كتبها في مقالاته.',
			en: 'He was born in Tanta, lived and taught there, and lies buried there: his homes, schools and faculty, the mosque of his funeral and his grave, and Tanta as he wrote it in his columns.'
		}
	},
	GROUPS: [
		[['home', 'school'], { ar: 'البيت والمدرسة', en: 'Home and school' }],
		[['university', 'hospital'], { ar: 'الطبيب', en: 'The doctor' }],
		[['mosque', 'grave', 'memorial', 'event'], { ar: 'الوداع والذكرى', en: 'Farewell and memory' }],
		[['other', 'fiction', 'cafe'], { ar: 'طنطا في كتاباته', en: 'Tanta in his writing' }]
	],

	/* the band: the town's skyline at dusk — the Badawi mosque's domes and minarets among the roofs */
	band: function () {
		var roofs = '';
		for (var i = 0; i < 26; i++) roofs += '<i style="left:' + (i * 4) + '%;height:' + (18 + (i * 37) % 22) + '%;width:' + (3 + (i * 7) % 3) + '%"></i>';
		return '<div class="tn-sky"></div><div class="tn-roofs">' + roofs + '</div><div class="tn-mosque"><span class="m1"></span><span class="dome"></span><span class="m2"></span></div>';
	},

	render: function () {
		var App = window.App, e = App.esc, t = App.t, L = App.L, list = App.data().tanta || [];
		var bio = App.data().bio || {};
		document.getElementById('content').innerHTML = '<section class="section tn"><div class="wrap">' +
			'<div class="tn-dates"><div><b>' + e(App.num(1962)) + '</b><span>' + e(t((bio.born || {}).place || { ar: 'طنطا', en: 'Tanta' })) + '</span></div>' +
				'<div><b>' + e(App.num(2018)) + '</b><span>' + e(L('دُفن في طنطا', 'Buried in Tanta')) + '</span></div></div>' +
			this.GROUPS.map(function (g) {
				var items = list.filter(function (x) { return g[0].indexOf(x.kind) >= 0; });
				if (!items.length) return '';
				return '<h2 class="tn-h">' + e(t(g[1])) + '</h2><div class="tn-grid">' + items.map(function (x) {
					var map = x.lat != null && x.lng != null ? 'https://www.openstreetmap.org/?mlat=' + x.lat + '&mlon=' + x.lng + '#map=17/' + x.lat + '/' + x.lng : '';
					return '<article class="tn-card tn-' + e(x.kind) + '">' + (x.year ? '<b class="tn-y">' + e(App.num(x.year)) + '</b>' : '') +
						'<h3>' + e(t(x.name)) + '</h3><p>' + e(t(x.text)) + '</p>' +
						'<p class="tn-src">' + (map ? '<a href="' + e(map) + '" target="_blank" rel="noopener">' + e(L('على الخريطة ↗', 'On the map ↗')) + '</a> · ' : '') +
						'<a href="' + e(x.source) + '" target="_blank" rel="noopener">' + e(/aktowfik\.blogspot/.test(x.source) ? L('في مقاله ↗', 'In his column ↗') : L('المصدر ↗', 'Source ↗')) + '</a></p></article>';
				}).join('') + '</div>';
			}).join('') +
			'<p class="tn-note">' + e(L('تختلف بعض المصادر في التفاصيل (بيت الميلاد مثلًا)، فذكرنا ما قاله كل منها. تعرف مكانًا آخر في طنطا مرتبطًا به؟ أرسله من «تواصل وساهم».', 'Some sources differ on details (his birthplace, for one), so each is given as it says. Know another place in Tanta tied to him? Send it from Contact & contribute.')) + '</p>' +
		'</div></section>';
	}
};

/* tanta.html — «طنطا، مدينته»: his city — the houses he was born and lived in, his schools, the faculty and hospital, the
   mosque of his funeral and his grave, what was done there in his memory, and the Tanta of his columns and stories (AKT.tanta,
   data-pages.js; assets/js/pages/tanta.js): by kind, each with its source. (A part of «سيرته», talks.html#tanta, for a while;
   a page of its own again, and that link leads here.) The band: the town's skyline at dusk, the Badawi mosque among its roofs. */
window.PAGE = {
	id: 'tanta',
	title: { ar: 'طنطا، مدينته', en: 'Tanta, his city' },
	strings: {
		eyebrow: { ar: 'حياته', en: 'His life' },
		title: { ar: 'طنطا، مدينته', en: 'Tanta, his city' },
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

	/* the band: the town at dusk — rows of roofs, lit windows here and there, the Badawi mosque's dome and minarets in the
	   middle, a first star; the years he was born and buried there at its sides */
	band: function (d, A) {
		var roofs = '', L = A.L;
		for (var i = 0; i < 34; i++) {
			var lit = (i * 7) % 5 === 0;
			roofs += '<i style="left:' + (i * 3).toFixed(1) + '%;height:' + (16 + (i * 37) % 26) + '%;width:' + (2.6 + (i * 7) % 3 * 0.6).toFixed(1) + '%"' + (lit ? ' class="lit"' : '') + '></i>';
		}
		return '<div class="tn-sky"><i class="tn-star"></i></div><div class="tn-roofs">' + roofs + '</div>' +
			'<div class="tn-mosque"><span class="m1"></span><span class="dome"></span><span class="m2"></span></div>' +
			'<span class="tn-mark is-born"><b>' + A.esc(A.num(1962)) + '</b>' + A.esc(L('وُلد هنا', 'Born here')) + '</span>' +
			'<span class="tn-mark is-rest"><b>' + A.esc(A.num(2018)) + '</b>' + A.esc(L('ودُفن هنا', 'And rests here')) + '</span>';
	},

	render: function () {
		var App = window.App, e = App.esc, t = App.t, L = App.L, list = App.data().tanta || [];
		document.getElementById('content').innerHTML = '<section class="section tn" id="tanta"><div class="wrap">' +
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
			'<p class="tn-note">' + e(L('تختلف بعض المصادر في التفاصيل (بيت الميلاد مثلًا)، فذكرنا ما قاله كل منها. تعرف مكانًا آخر في طنطا مرتبطًا به؟ أرسله من ', 'Some sources differ on details (his birthplace, for one), so each is given as it says. Know another place in Tanta tied to him? Send it from ')) +
				'<a href="contact.html#contribute">' + e(L('«تواصل وساهم»', 'Contact & contribute')) + '</a>' + e(L('. وحياته كلها في ', '. And his whole life is in ')) +
				'<a href="talks.html">' + e(L('«سيرته»', 'His life')) + '</a>.</p>' +
		'</div></section>';
	}
};

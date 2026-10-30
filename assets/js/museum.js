/* museum.html — «المتحف»: the 3D figures of his characters (AKT.figures3d), each on a lit pedestal to turn and, on a phone, to
   set in one's room; with the character's page and series beside it. The figures are the site's editor's (figure3d.js). */
window.PAGE = {
	id: 'museum',
	title: { ar: 'المتحف', en: 'The museum' },
	strings: {
		eyebrow: { ar: 'مجسّمات', en: 'Figures' },
		title: { ar: 'المتحف', en: 'The museum' },
		lead: {
			ar: 'أبطاله في ثلاثة أبعاد: أدِر كل مجسّم بإصبعك أو بالفأرة، وعلى الهاتف ضعه على مكتبك بالكاميرا. مجسّمات صنعها محرر الموقع تحيةً لعالمه.',
			en: 'His heroes in three dimensions: turn each figure with a finger or the mouse, and on a phone set it on your desk through the camera. Figures made by the site’s editor in tribute to his world.'
		}
	},

	/* the band: a dark hall, spotlights falling on empty pedestals */
	band: function (d, A) {
		var out = '';
		for (var i = 0; i < 5; i++) out += '<i class="mu-spot" style="--x:' + (10 + i * 20) + '%;--d:' + (-i * 1.1).toFixed(1) + 's"></i><i class="mu-ped" style="--x:' + (10 + i * 20) + '%"></i>';
		return '<i class="mu-floor"></i>' + out;
	},

	render: function () {
		var App = window.App, S = window.WorksShared, d = App.data(), e = App.esc, t = App.t, L = App.L;
		var figs = d.figures3d || {};
		document.getElementById('content').innerHTML = '<section class="section mu"><div class="wrap">' +
			'<div class="mu-hall">' + Object.keys(figs).map(function (k) {
				var f = figs[k], chars = (f.chars || []).map(function (id) { return App.byId(d.characters, id); }).filter(Boolean);
				var work = chars[0] && chars[0].work, ser = work && S.anySeries(work);
				return '<article class="mu-item">' + window.Figure3D.html(k, { big: true }) +
					'<p class="mu-links">' + chars.filter(function (c) { return App.charHasPage(c.id); }).map(function (c) {
						return '<a href="' + e(App.charHref(c.id)) + '">' + e(t(c.name)) + ' ←</a>';
					}).join(' ') + (ser ? ' <a href="' + e(S.seriesHref(work)) + '">' + e(L('سلسلة «' + t(ser.s.title) + '»', t(ser.s.title) + ' series')) + ' ←</a>' : '') + '</p></article>';
			}).join('') + '</div>' +
			'<div class="mu-how"><h2>' + e(L('كيف تشاهدها', 'How to view them')) + '</h2><ul>' +
				'<li>' + e(L('اضغط «اعرض المجسم» ليُحمَّل النموذج (نحو 1 ميجابايت)، ثم اسحبه ليدور، وقرّبه بإصبعين أو بعجلة الفأرة.', 'Press “View in 3D” to load the model (about 1 MB), then drag to turn it and pinch or scroll to zoom.')) + '</li>' +
				'<li>' + e(L('على هاتف أندرويد أو آيفون يظهر زر «ضعه في غرفتك»: وجّه الكاميرا إلى الأرض أو المكتب ليقف المجسّم أمامك.', 'On an Android phone or iPhone, “See it in your room” appears: point the camera at the floor or a desk and the figure stands in front of you.')) + '</li>' +
				'<li>' + e(L('المجسّمات تصوّر فني صنعه محرر الموقع بأداة Meshy للذكاء الاصطناعي، وليست أعمالًا رسمية؛ والشخصيات من إبداع أحمد خالد توفيق.', 'The figures are artistic impressions made by the site’s editor with the Meshy AI tool, not official works; the characters are Ahmed Khaled Tawfik’s creations.')) + '</li>' +
			'</ul></div></div></section>';
	}
};

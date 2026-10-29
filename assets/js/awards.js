/* awards.html — «الجوائز»: his prizes and the honours given in his name (AKT.awards), each with its photograph, the book it was
   for and its source; then the other honours the Legacy timeline records — a doodle, a salon, a fair — linked there. */
window.PAGE = {
	id: 'awards',
	title: { ar: 'الجوائز', en: 'Awards' },
	strings: {
		eyebrow: { ar: 'تكريم', en: 'Honours' },
		title: { ar: 'الجوائز', en: 'Awards' },
		lead: {
			ar: 'جوائزه في حياته وبعد رحيله، من القائمة القصيرة لترجمة «يوتوبيا» إلى جائزة الشارقة عن «مثل إيكاروس»، وما كُرِّم به اسمه بعد ذلك.',
			en: 'His prizes in his life and after it, from the shortlist for Utopia in translation to the Sharjah prize for Like Icarus, and the honours given in his name since.'
		}
	},
	KIND: { win: { ar: 'فاز', en: 'Won' }, finalist: { ar: 'القائمة القصيرة', en: 'Shortlisted' }, honour: { ar: 'تكريم', en: 'Honour' } },

	/* the band: a medal turning on its ribbon among falling confetti */
	band: function (d, A) {
		var bits = '';
		for (var i = 0; i < 26; i++) bits += '<i class="aw-bit" style="--x:' + ((i * 37) % 100) + '%;--d:' + (-(i * 0.7) % 9).toFixed(1) + 's;--h:' + ((i * 53) % 360) + '"></i>';
		return bits + '<div class="aw-medal"><i class="aw-ribbon"></i><b>' + A.esc(String((d.awards || []).length)) + '</b></div>';
	},

	render: function () {
		var App = window.App, S = window.WorksShared, d = App.data(), e = App.esc, t = App.t, L = App.L, self = this;
		var died = String(((d.bio || {}).died || {}).date || '9999').slice(0, 4);
		var awards = (d.awards || []).slice().sort(function (a, b) { return a.year - b.year; });
		/* the Legacy timeline's honours not already among the awards */
		var honours = (d.legacy || []).filter(function (l) {
			var s = (l.title || {}).ar || '';
			return /تكريم|دودل|[يت]حتفي|يحمل اسم|باسمه|صالون/.test(s) && !/جائزة/.test(s);
		});
		document.getElementById('content').innerHTML = '<section class="section aw"><div class="wrap">' +
			'<ol class="aw-list">' + awards.map(function (a) {
				var w = a.work && App.findWork(a.work), after = String(a.year) > died || (String(a.year) === died && /بعد الرحيل/.test(a.title.ar));
				return '<li class="aw-item aw-' + e(a.kind) + '">' +
					'<div class="aw-year"><b>' + e(App.num(a.year)) + '</b><span>' + e(t(self.KIND[a.kind] || self.KIND.honour)) + '</span>' + (after ? '<small>' + e(L('بعد رحيله', 'after his death')) + '</small>' : '') + '</div>' +
					'<div class="aw-body"><h2>' + e(t(a.title).replace(/\s*—\s*بعد الرحيل$/, '')) + '</h2><p>' + e(t(a.text)) + '</p>' +
						(w ? '<a class="aw-book" href="' + e(S.bookHref(w.id)) + '">' + (S.coverOf((d.bookInfo || {})[w.id]) ? '<img src="' + e(S.coverOf(d.bookInfo[w.id])) + '" alt="" loading="lazy">' : '') + '<span>' + e(t(w.title)) + '</span></a>' : '') +
						(a.source ? '<a class="aw-src" href="' + e(a.source) + '" target="_blank" rel="noopener">' + e(L('المصدر ↗', 'Source ↗')) + '</a>' : '') + '</div>' +
					(a.image ? '<figure class="aw-pic"><img src="' + e(a.image.src) + '" alt="' + e(t(a.image.alt)) + '" loading="lazy"></figure>' : '') +
					'</li>';
			}).join('') + '</ol>' +
			(honours.length ? '<h2 class="pp-h">' + e(L('تكريمات أخرى', 'Other honours')) + '</h2><div class="aw-more">' + honours.map(function (l) {
				return '<a href="legacy.html" class="aw-hon"><b>' + e(String(l.date).slice(0, 4)) + '</b><span>' + e(t(l.title)) + '</span></a>';
			}).join('') + '</div>' : '') +
		'</div></section>';
	}
};

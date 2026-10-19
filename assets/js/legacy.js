window.PAGE = {
	id: 'legacy',
	title: { ar: 'الإرث', en: 'Legacy' },
	strings: {
		eyebrow: { ar: 'ما بعد ٢ أبريل ٢٠١٨', en: 'After 2 April 2018' },
		title: { ar: 'الإرث', en: 'The Legacy' },
		lead: {
			ar: 'رحل العرّاب، وبقي جيلٌ تعلّم القراءة على يديه. هنا الوداع والتكريم وما تحوّل من أعماله إلى الشاشة، ثم لقاءاته ومحاضراته بصوته.',
			en: 'The Godfather is gone, but a generation that learned to read through him remains. Here are the farewell, the tributes, the screen adaptations — and his interviews and talks, in his own voice.'
		}
	},

	render: function () {
		var App = window.App, d = App.data(), e = App.esc, tx = App.tx, L = App.L;
		var legacy = d.legacy || [], media = d.media || [];
		var KIND = {
			interview: { ar: 'لقاء', en: 'Interview' }, talk: { ar: 'محاضرة / ندوة', en: 'Talk' },
			profile: { ar: 'بورتريه', en: 'Profile' }, documentary: { ar: 'وثائقي', en: 'Documentary' }, article: { ar: 'مقال', en: 'Article' }
		};
		var fmtDate = function (s) {
			if (!s) return '';
			var p = String(s).split('-');
			var months = App.lang === 'ar'
				? ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر']
				: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
			if (p.length === 3) return App.num(+p[2]) + ' ' + months[+p[1] - 1] + ' ' + App.num(p[0]);
			if (p.length === 2) return months[+p[1] - 1] + ' ' + App.num(p[0]);
			return App.num(p[0]);
		};

		var html = '';
		if (legacy.length) {
			html += '<section class="section"><div class="wrap">' +
				'<div class="section-head"><div><h2>' + L('الوداع والتكريم', 'Farewell & tributes') + '</h2></div></div>' +
				'<ol class="timeline">' + legacy.map(function (l, i) {
					return '<li class="rise" id="l-' + i + '"><div class="yr">' + e(fmtDate(l.date)) + '</div><h3>' + tx(l.title) + '</h3><p>' + tx(l.text) + '</p>' +
						(l.source ? '<a class="src" href="' + e(l.source) + '" target="_blank" rel="noopener">' + L('المصدر ↗', 'Source ↗') + '</a>' : '') + '</li>';
				}).join('') + '</ol>' +
			'</div></section>';
		}

		var ad = d.adaptations || [];
		if (ad.length) {
			html += '<section class="section"><div class="wrap">' +
				'<div class="section-head"><div><h2>' + L('على الشاشة', 'On screen') + '</h2></div></div>' +
				'<div class="adapt-grid">' + ad.map(function (a) {
					return '<article class="adapt rise"><div class="kind">' + tx(a.kind) + '</div><h3>' + tx(a.title) + '</h3>' +
						'<div class="yr">' + App.num(a.year || '') + (App.findWork(a.basedOn) ? ' · ' + L('عن ', 'from ') + App.workLink(a.basedOn) : '') + '</div>' +
						'<p>' + tx(a.text) + '</p></article>';
				}).join('') + '</div>' +
			'</div></section>';
		}

		if (media.length) {
			var kinds = [];
			media.forEach(function (m) { if (kinds.indexOf(m.kind) < 0) kinds.push(m.kind); });
			html += '<section class="section"><div class="wrap">' +
				'<div class="section-head"><div><h2>' + L('بصوته وعنه', 'In his voice, and about him') + '</h2>' +
					'<p>' + L('لقاءات ومحاضرات ومقالات — روابط إلى مصادرها الأصلية.', 'Interviews, talks and articles — linked to where they were first published.') + '</p></div></div>' +
				'<div class="media-grid">' + media.map(function (m, i) {
					return '<a class="media rise" id="m-' + i + '" href="' + e(m.url) + '" target="_blank" rel="noopener">' +
						'<span class="kind">' + tx(KIND[m.kind] || { ar: m.kind, en: m.kind }) + (m.lang ? '<span class="lng">' + e(m.lang === 'ar' ? 'عربي' : 'EN') + '</span>' : '') + '</span>' +
						'<h3>' + tx(m.title) + '</h3>' +
						'<span class="outlet">' + tx(m.outlet) + (m.year ? ' · ' + App.num(m.year) : '') + '</span>' +
						(m.note && App.t(m.note) ? '<p>' + tx(m.note) + '</p>' : '') +
					'</a>';
				}).join('') + '</div>' +
			'</div></section>';
		}

		if (!html) html = '<section class="section"><div class="wrap"><p class="empty-note">' + L('لم تُضف بيانات بعد.', 'Nothing added yet.') + '</p></div></section>';
		document.getElementById('content').innerHTML = html;
		App.focusHash();
	}
};

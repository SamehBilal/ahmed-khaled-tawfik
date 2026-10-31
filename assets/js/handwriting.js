/* handwriting.html — «بخط يده»: his signatures, dedications and notes as readers and reporters have told of them (AKT.handwriting,
   data-pages.js) — linked where they were published, not copied — and a call for readers' own: a dedication in their copy,
   a note in his hand, sent from the contact page. */
window.PAGE = {
	id: 'handwriting',
	title: { ar: 'بخط يده', en: 'In his hand' },
	strings: {
		eyebrow: { ar: 'إهداءات وتوقيعات', en: 'Dedications and signatures' },
		title: { ar: 'بخط يده', en: 'In his hand' },
		lead: {
			ar: 'ما كتبه بيده لقرّائه: إهداءات على نسخهم وتوقيعات في حفلات التوقيع وقصاصات جيبه، كما رواها أصحابها. وإن كان عندك إهداء منه فهذه صفحته.',
			en: 'What he wrote by hand for his readers: dedications in their copies, signatures at signings, the notes in his pocket, as their owners told of them. If you have a dedication from him, this is its page.'
		}
	},
	KIND: { dedication: { ar: 'إهداء', en: 'Dedication' }, signature: { ar: 'توقيع', en: 'Signature' }, note: { ar: 'قصاصة', en: 'Note' }, letter: { ar: 'رسالة', en: 'Letter' }, manuscript: { ar: 'مخطوط', en: 'Manuscript' } },

	/* the band: a pen writing a dedication across a book's first page */
	band: function (d, A) {
		return '<div class="hw-page"><p class="hw-line"><span>' + A.esc(A.L('إلى القارئ العزيز.. ابق حيًا حتى اللقاء القادم', 'To the dear reader.. stay alive till we meet again')) + '</span></p>' +
			'<p class="hw-sign"><span>' + A.esc(A.L('أحمد خالد توفيق', 'Ahmed Khaled Tawfik')) + '</span></p></div>';
	},

	render: function () {
		var App = window.App, e = App.esc, t = App.t, L = App.L, self = this, list = App.data().handwriting || [];
		document.getElementById('content').innerHTML = '<section class="section hw"><div class="wrap">' +
			'<div class="hw-list">' + list.map(function (x) {
				return '<article class="hw-card"><p class="hw-kind">' + e(t(self.KIND[x.kind] || { ar: x.kind, en: x.kind })) + (x.year ? ' · ' + e(App.num(x.year)) : '') + '</p>' +
					'<h3>' + e(t(x.title)) + '</h3><p>' + e(t(x.text)) + '</p>' +
					'<a class="hw-src" href="' + e(x.url) + '" target="_blank" rel="noopener">' + e(t(x.outlet || { ar: 'المصدر', en: 'Source' })) + ' ↗</a></article>';
			}).join('') + '</div>' +
			'<aside class="hw-call"><h2>' + e(L('هل عندك إهداء منه؟', 'Do you have a dedication from him?')) + '</h2>' +
				'<p>' + e(L('قلّما نُشر خطه: لم نجد بعد مخطوطًا أو رسالة بخطه في مكان عام. إن كتب لك إهداءً على نسختك، أو عندك ورقة بخطه، فصوّرها وأرسلها، واكتب سطرًا عن اليوم؛ تُنشر هنا باسمك إن أردت.', 'His hand was seldom published: we have yet to find a manuscript or a letter of his shown anywhere public. If he wrote a dedication in your copy, or you have a page in his hand, photograph it and send it with a line about the day; it goes up here, under your name if you wish.')) + '</p>' +
				'<a class="share-btn" href="contact.html#contribute">' + e(L('أرسل إهداءك ←', 'Send your dedication →')) + '</a></aside>' +
		'</div></section>';
	}
};

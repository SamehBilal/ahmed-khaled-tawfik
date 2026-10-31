/* handwriting.html — «بخط يده»: his signatures, dedications and notes as readers and reporters have told of them (AKT.handwriting,
   data-pages.js) — linked where they were published, not copied — and a call for readers' own: a dedication in their copy,
   a note in his hand, sent by a form of its own to the site's GitHub issues (with the photos) or by email. */
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
				'<form class="hw-form" id="send">' +
					'<label>' + e(L('اسمك كما تحب أن يظهر', 'Your name as you’d like it shown')) + '<input name="name" placeholder="' + e(L('اتركه فارغًا إن لم ترد ذكره', 'Leave it empty to stay unnamed')) + '"></label>' +
					'<label>' + e(L('ما الذي عندك؟', 'What do you have?')) + '<select name="kind">' + ['dedication', 'signature', 'note', 'letter'].map(function (k) { return '<option value="' + k + '">' + e(t(self.KIND[k])) + '</option>'; }).join('') + '</select></label>' +
					'<label>' + e(L('الكتاب أو العدد', 'The book or issue')) + '<input name="book"></label>' +
					'<label>' + e(L('متى وأين؟', 'When and where?')) + '<input name="when" placeholder="' + e(L('مثال: معرض القاهرة للكتاب، يناير 2014', 'e.g. Cairo Book Fair, January 2014')) + '"></label>' +
					'<label class="hw-wide">' + e(L('حكاية اليوم', 'The story of that day')) + '<textarea name="story" rows="4"></textarea></label>' +
					'<label class="hw-wide hw-check"><input type="checkbox" name="credit" checked> ' + e(L('اذكروا اسمي مع الصورة', 'Show my name with it')) + '</label>' +
					'<p class="hw-wide hw-how">' + e(L('اختر طريقة الإرسال، ثم أرفق صور الإهداء هناك: على GitHub اسحب الصور إلى خانة «الصور»، وفي البريد أرفقها بالرسالة.', 'Pick how to send it, then attach the photos there: on GitHub drag them into the «Photos» box; by email, attach them to the message.')) + '</p>' +
					'<p class="hw-wide hw-acts"><button type="submit" class="buy-btn" value="github">' + e(L('أرسل عبر GitHub ↗', 'Send on GitHub ↗')) + '</button> ' +
					'<button type="submit" class="share-btn" value="mail">' + e(L('أرسل بالبريد', 'Send by email')) + '</button></p></form></aside>' +
		'</div></section>';
		var form = document.getElementById('send');
		form.addEventListener('submit', function (ev) {
			ev.preventDefault();
			var f = form.elements, v = function (n) { return f[n].value.trim(); }, kind = t(self.KIND[v('kind')]), how = ev.submitter ? ev.submitter.value : 'github';
			var title = L('بخط يده: ', 'In his hand: ') + kind + (v('book') ? ' — ' + v('book') : '');
			if (how === 'mail') {
				var body = [L('الاسم: ', 'Name: ') + (v('name') || '—'), L('النوع: ', 'Kind: ') + kind, L('الكتاب أو العدد: ', 'Book or issue: ') + (v('book') || '—'), L('متى وأين: ', 'When and where: ') + (v('when') || '—'),
					L('الحكاية: ', 'The story: ') + (v('story') || '—'), L('ذكر الاسم: ', 'Name shown: ') + (f.credit.checked ? L('نعم', 'yes') : L('لا', 'no')), '', L('(أرفق الصور بهذه الرسالة)', '(attach the photos to this message)')].join('\n');
				location.href = 'mailto:' + self.EMAIL + '?subject=' + encodeURIComponent(title) + '&body=' + encodeURIComponent(body);
				return;
			}
			/* GitHub's issue form (.github/ISSUE_TEMPLATE/handwriting.yml), its boxes filled from this one; the photos are dropped in there */
			var q = { template: 'handwriting.yml', title: title, name: v('name'), book: v('book'), when: v('when'), story: v('story') };
			window.open(self.REPO + '/issues/new?' + Object.keys(q).filter(function (k) { return q[k]; }).map(function (k) { return k + '=' + encodeURIComponent(q[k]); }).join('&'), '_blank', 'noopener');
		});
	},
	REPO: 'https://github.com/SamehBilal/ahmed-khaled-tawfik',
	EMAIL: 'sameh.bilal@outlook.com'
};

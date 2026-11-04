/* «حكايات القرّاء» (reader-stories.html): how readers met him and his books, in their own words (AKT.readerStories,
   data-readers.js) — and under them how to send one (readers-invite.js, which «تواصل وساهم» shows too). */
window.PAGE = {
	id: 'reader-stories',
	title: { ar: 'حكايات القرّاء', en: 'Readers’ stories' },
	strings: {
		eyebrow: { ar: 'بأقلامكم', en: 'In your own words' },
		title: { ar: 'حكايات القرّاء', en: 'Readers’ stories' },
		lead: { ar: 'أول عدد اشتريته من بائع الجرائد، الكتاب الذي خبّأته تحت كتب المدرسة، الندوة التي وقّع لك فيها، اليوم الذي عرفت فيه أنه رحل. كل قارئ له حكاية مع العرّاب، وهنا تُحكى بأصحابها.',
			en: 'The first issue you bought from the newsstand, the book hidden under your schoolbooks, the talk where he signed your copy, the day you heard he had gone. Every reader has a story with the Godfather, and here they are told by those who lived them.' }
	},
	/* the band: notes on lined paper drifting on the dark, each a reader's few lines still to be written */
	band: function () {
		var spots = [[6, 30, -8], [21, 120, 5], [37, 18, -3], [52, 140, 7], [66, 40, -6], [81, 112, 4], [93, 26, 9]];
		return '<div class="rs-band">' + spots.map(function (p, i) {
			return '<span class="rs-note" style="inset-inline-start:calc(' + p[0] + '% - 75px);top:' + p[1] + 'px;--r:' + p[2] + 'deg;--d:-' + (i * 1.3).toFixed(1) + 's">' +
				[86, 64, 92, 48].map(function (w) { return '<i style="--w:' + ((w + i * 7) % 60 + 40) + '%"></i>'; }).join('') + '</span>';
		}).join('') + '</div>';
	},
	render: function () {
		var A = window.App, d = A.data(), e = A.esc, t = A.t, L = A.L, S = window.WorksShared;
		var list = d.readerStories || [];
		var book = function (id) {
			if (!id) return '';
			var w = A.findWork && A.findWork(id);
			return w ? '<a href="' + e(S ? S.bookHref(w.id) : 'works.html') + '">' + e(t(w.title)) + '</a>' : e(id);
		};
		var stories = list.length
			? '<ul class="rs-grid">' + list.map(function (s, i) {
				return '<li class="rs-card rise" id="s-' + i + '">' + (s.photo ? '<img class="rs-photo" src="' + e(s.photo) + '" alt="" loading="lazy">' : '') +
					'<blockquote>' + e(t(s.text)) + '</blockquote>' +
					'<p class="rs-who"><b>' + e(t(s.name)) + '</b>' + (s.city ? ' · ' + e(t(s.city)) : '') +
						(s.first ? '<small>' + e(L('قرأه أول مرة عام ', 'First read him in ')) + e(A.num(s.first)) + (s.book ? ' — ' + book(s.book) : '') + '</small>' : '') + '</p></li>';
			}).join('') + '</ul>'
			: '<div class="rs-empty"><span class="rs-empty-ic" aria-hidden="true">✎</span><h2>' + e(L('الصفحة تنتظر حكايتك', 'This page is waiting for your story')) + '</h2>' +
				'<p>' + e(L('لم تُنشر حكايات بعد. أول من يكتب يفتتحها: سطرٌ واحد يكفي، أو صفحة كاملة.', 'No stories have been published yet. The first to write opens the page: one line is enough, or a whole page.')) + '</p></div>';
		document.getElementById('content').innerHTML =
			'<section class="section"><div class="wrap">' + stories + '</div></section>' +
			'<section class="section" id="write"><div class="wrap">' + window.ReaderStories.invite(false) + '</div></section>';
	}
};

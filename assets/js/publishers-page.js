/* publishers.html — every house he published with, oldest partnership first, each card leading to its own page
   (publisher.html). The cards are the works page's (WorksShared.publisherCard). */
window.PAGE = {
	id: 'publishers',
	title: { ar: 'دور النشر', en: 'Publishers' },
	strings: {
		eyebrow: { ar: 'من نشر له', en: 'Who published him' },
		title: { ar: 'دور النشر', en: 'The publishers' },
		lead: {
			ar: 'الدور التي صدرت عنها كتبه وسلاسله، بترتيب أول كتاب له عند كل منها. اختر دارًا لترى كل ما نشرته له وما أعادت نشره.',
			en: 'The houses that published his books and series, in order of his first book with each. Pick one to see everything it published of his, and what it reissued.'
		}
	},

	render: function () {
		var App = window.App, S = window.WorksShared, L = App.L;
		var cards = S.publishers();
		var books = 0, reissues = 0;
		cards.forEach(function (c) { books += c.list.length; reissues += c.later.length; });
		document.getElementById('content').innerHTML =
			'<section class="section"><div class="wrap">' +
				'<p class="dir-sum">' + App.num(cards.length) + ' ' + L('دارًا للنشر', 'houses') + ' · ' + App.num(books) + ' ' + L('عملًا صدر أول مرة عنها', 'first editions') + ' · ' +
					App.num(reissues) + ' ' + L('إعادة نشر', 'reissues') + '</p>' +
				'<div class="pub-grid">' + cards.map(S.publisherCard).join('') + '</div>' +
			'</div></section>';
	}
};

/* 404.html — a bookshelf with one book missing */
window.PAGE = {
	id: '404',
	title: { ar: 'الصفحة غير موجودة', en: 'Page not found' },
	strings: {
		title: { ar: 'أسطورة الصفحة المفقودة', en: 'The Legend of the Missing Page' },
		lead: {
			ar: 'بحثنا في كل الرفوف، ولم نجد الصفحة التي تبحث عنها. ربما أخذها رفعت إسماعيل ولم يُعِدها.',
			en: 'We searched every shelf and could not find the page you are looking for. Perhaps Refaat Ismail borrowed it and never brought it back.'
		}
	},

	render: function () {
		var App = window.App, e = App.esc, L = App.L;
		var books = [
			['home', 'index.html', L('الرئيسية', 'Home')],
			['works', 'works.html', L('الأعمال', 'Works')],
			['chars', 'characters.html', L('الشخصيات', 'Characters')],
			['audio', 'audio.html', L('مسموع', 'Audio')]
		];
		var shelf = document.getElementById('nf-shelf');
		shelf.setAttribute('aria-label', L('رف الكتب', 'Bookshelf'));
		shelf.innerHTML = books.map(function (b) {
			return '<a class="nf-book nf-' + b[0] + '" href="' + b[1] + '">' + e(b[2]) + '</a>';
		}).join('') +
			'<span class="nf-book nf-missing" aria-hidden="true"><span class="nf-note">' + e(L('هذه الصفحة غير موجودة', "this page can't be found")) + '</span></span>' +
			'<span class="nf-door nf-left" aria-hidden="true"></span>' +
			'<span class="nf-door nf-right" aria-hidden="true"></span>';

		document.getElementById('nf-actions').innerHTML =
			'<a class="buy-btn" href="index.html">' + L('العودة إلى الرئيسية', 'Back to the home page') + '</a> ' +
			'<button type="button" class="buy-btn" id="nf-search">' + L('ابحث في الموقع', 'Search the site') + '</button>';
		document.getElementById('nf-search').onclick = function () { App.Search.open(); };
	}
};

/* lists.html — the reader's and collector's lists on a page of their own: the same lists as the «My lists» panel
   (lists.js), here always open — the modes, the lists to drop covers on, the shelf of everything, export and import. */
window.PAGE = {
	id: 'lists',
	title: { ar: 'قوائمي', en: 'My lists' },
	strings: {
		eyebrow: { ar: 'مكتبتك', en: 'Your library' },
		title: { ar: 'قوائمي', en: 'My lists' },
		lead: {
			ar: 'ما قرأته وما تنوي قراءته إن كنت قارئًا، وما في مكتبتك وما تبحث عنه إن كنت مقتنيًا. اسحب أي غلاف في الموقع إلى قائمة، أو استعمل أزرار القوائم في صفحة كل كتاب؛ وتبقى القوائم على جهازك.',
			en: 'What you have read and what you mean to read, as a reader; what is on your shelves and what you are looking for, as a collector. Drag any cover on the site onto a list, or use the list buttons on each book’s page; the lists stay on your device.'
		}
	},

	render: function () {
		document.getElementById('content').innerHTML = '<section class="section"><div class="wrap"><div id="ls-page"></div></div></section>';
		if (window.Lists && window.Lists.mountPage) window.Lists.mountPage(document.getElementById('ls-page'));
	}
};

/* lists.html — the reader's and collector's lists on a page of their own: the same lists as the «My lists» panel
   (lists.js), here always open — the modes, the lists to drop covers on, the shelf of everything, export and import.
   A shared list (lists.html#share=<list>/<keys>, from a list's share button) shows first, its covers read-only, with a
   button to add them all to the same list of one's own. */
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

	/* the shared list in the address, if any: { list, keys } with only the books and series the site knows */
	shared: function () {
		var m = /^#share=(\w+)\/(.*)$/.exec(location.hash), Ls = window.Lists, S = window.WorksShared;
		if (!m || !Ls || !Ls.LISTS[m[1]]) return null;
		var keys = Ls.decodeKeys(decodeURIComponent(m[2])).filter(function (k) { return k[0] === 's' ? S.anySeries(k.slice(2)) : S.resolveBook(k.slice(2)); });
		return keys.length ? { list: m[1], keys: keys } : null;
	},

	sharedHtml: function (sh) {
		var App = window.App, S = window.WorksShared, Ls = window.Lists, e = App.esc, t = App.t, L = App.L;
		var name = L(Ls.LISTS[sh.list].ar, Ls.LISTS[sh.list].en), mine = Ls.state().lists[sh.list] || [];
		var fresh = sh.keys.filter(function (k) { return !mine.some(function (x) { return x.key === k; }); }).length;
		return '<section class="section ls-shared"><div class="wrap">' +
			'<p class="eyebrow">' + L('قائمة وصلتك', 'A list shared with you') + '</p>' +
			'<h2>«' + e(name) + '» <b>' + e(App.num(sh.keys.length)) + '</b></h2>' +
			'<div class="ls-shared-grid">' + sh.keys.map(function (k) {
				var r = Ls.describe(k);
				return '<a class="cover-link" href="' + e(r.href) + '">' + S.miniCover({ img: r.img, color: r.color || '#3a1414', title: t(r.title), num: r.n != null ? App.num(r.n) : '', sub: r.series ? t(r.series) : '' }) + '</a>';
			}).join('') + '</div>' +
			'<p class="ls-shared-act">' + (fresh
				? '<button type="button" class="share-btn" data-adopt>' + e(L('أضِفها إلى «' + name + '» عندي', 'Add them to my “' + name + '”')) + (fresh < sh.keys.length ? ' (' + e(App.num(fresh)) + ')' : '') + '</button>'
				: '<span class="ls-hint">' + e(L('كلها في قائمتك بالفعل.', 'They are all in your list already.')) + '</span>') +
				' <a href="lists.html">' + e(L('قوائمي أنا ←', 'My own lists →')) + '</a></p>' +
		'</div></section>';
	},

	render: function () {
		var self = this, sh = this.shared();
		document.getElementById('content').innerHTML = (sh ? '<div id="ls-shared">' + this.sharedHtml(sh) + '</div>' : '') +
			'<section class="section"><div class="wrap"><div id="ls-page"></div></div></section>';
		if (window.Lists && window.Lists.mountPage) window.Lists.mountPage(document.getElementById('ls-page'));
		if (this._wired) return;
		this._wired = true;
		document.getElementById('content').addEventListener('click', function (ev) {
			if (!ev.target.closest('[data-adopt]')) return;
			var cur = self.shared(), Ls = window.Lists;
			if (!cur) return;
			cur.keys.slice().reverse().forEach(function (k) { Ls.add(cur.list, Ls.describe(k)); });
			document.getElementById('ls-shared').innerHTML = self.sharedHtml(cur);
			if (window.Notify) window.Notify(window.App.L('أُضيفت إلى قائمتك.', 'Added to your list.'), { type: 'success', title: window.App.L('قوائمي', 'My lists') });
		});
	},
	/* a shared list opened while on the page (App calls this on a new #hash) */
	onHash: function () { this.render(); }
};

/* changelog.html — «سجل التحديثات»: everything added to the site and when, from its history (assets/data/changelog.json,
   tools/build-changelog.js): a day at a time, newest first, filtered by kind or searched; each change in Arabic where it has a line (x.a), with the words it was recorded in under it. */
window.PAGE = {
	id: 'changelog',
	title: { ar: 'سجل التحديثات', en: 'Changelog' },
	strings: {
		eyebrow: { ar: 'خلف الكواليس', en: 'Behind the site' },
		title: { ar: 'سجل التحديثات', en: 'Changelog' },
		lead: {
			ar: 'كل ما أُضيف إلى الموقع أو تغيّر فيه، يومًا بيوم منذ بدأ: صفحات جديدة وأغلفة وصور وتسجيلات ومقالات وتصحيحات.',
			en: 'Everything added to the site or changed in it, day by day since it began: new pages, covers and pictures, recordings, articles and fixes.'
		}
	},
	KINDS: [['page', { ar: 'صفحات جديدة', en: 'New pages' }], ['data', { ar: 'كتب ومقالات وبيانات', en: 'Books, articles, data' }], ['pics', { ar: 'أغلفة وصور', en: 'Covers & pictures' }],
		['audio', { ar: 'مسموع ومرئي', en: 'Audio & video' }], ['design', { ar: 'تصميم', en: 'Design' }], ['fix', { ar: 'تصحيحات', en: 'Fixes' }]],
	kind: 'all', q: '', shown: 3,

	/* the band: a calendar's pages turning, each with a day the site changed */
	band: function () {
		var out = '';
		for (var i = 0; i < 7; i++) out += '<span class="cl-day" style="--i:' + i + ';--d:' + (-i * 1.1).toFixed(1) + 's"><b>' + (3 + i * 4) + '</b><i></i></span>';
		return out;
	},

	render: function () {
		var App = window.App, e = App.esc, L = App.L, self = this;
		document.getElementById('content').innerHTML = '<section class="section cl"><div class="wrap"><p class="cl-sum">' + e(L('…', '…')) + '</p></div></section>';
		fetch('assets/data/changelog.json').then(function (r) { return r.json(); }).then(function (log) {
			self.log = log;
			var count = {}; log.forEach(function (x) { x.k.forEach(function (k) { count[k] = (count[k] || 0) + 1; }); });
			var days = {}; log.forEach(function (x) { days[x.d] = 1; });
			document.querySelector('.cl .wrap').innerHTML =
				'<p class="cl-sum">' + e(L(App.num(log.length) + ' تحديثًا في ' + App.num(Object.keys(days).length) + ' يومًا، منذ ' + App.num(log[log.length - 1].d) + '.', log.length + ' changes on ' + Object.keys(days).length + ' days, since ' + log[log.length - 1].d + '.')) + '</p>' +
				'<div class="cl-bar"><div class="chips"><button type="button" class="chip" data-k="all" aria-pressed="true">' + e(L('الكل', 'All')) + '</button>' +
					self.KINDS.filter(function (k) { return count[k[0]]; }).map(function (k) { return '<button type="button" class="chip" data-k="' + k[0] + '" aria-pressed="false">' + e(App.t(k[1])) + ' <b>' + e(App.num(count[k[0]])) + '</b></button>'; }).join('') +
				'</div><input type="search" class="cl-q" placeholder="' + e(L('ابحث في السجل…', 'Search the log…')) + '"></div>' +
				'<div class="cl-list"></div>' +
				'<p class="cl-note">' + e(L('كُتب السجل أولًا بالإنجليزية في تاريخ الموقع على GitHub؛ وتحت كل سطر عربي نصّه الأصلي.', 'The log is written in the site’s history on GitHub, as it was recorded there.')) + ' <a href="https://github.com/SamehBilal/ahmed-khaled-tawfik/commits/main" target="_blank" rel="noopener">GitHub ↗</a></p>';
			var root = document.querySelector('.cl');
			root.querySelector('.chips').onclick = function (ev) {
				var b = ev.target.closest('[data-k]');
				if (!b) return;
				self.kind = b.getAttribute('data-k'); self.shown = 3;
				root.querySelectorAll('[data-k]').forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
				self.list();
			};
			root.querySelector('.cl-q').oninput = function (ev) { self.q = ev.target.value.trim().toLowerCase(); self.shown = 3; self.list(); };
			root.querySelector('.cl-list').onclick = function (ev) { if (ev.target.closest('.cl-more')) { self.shown += 3; self.list(); } };
			self.list();
		}).catch(function () {
			document.querySelector('.cl .wrap').innerHTML = '<p class="cl-sum">' + e(L('تعذّر تحميل السجل الآن.', 'The log could not be loaded just now.')) + '</p>';
		});
	},

	/* the changes, a month a block; the newest months first, more on demand */
	list: function () {
		var App = window.App, e = App.esc, t = App.t, L = App.L, self = this;
		var kindName = {}; this.KINDS.forEach(function (k) { kindName[k[0]] = k[1]; });
		var MONTHS = App.lang === 'en' ? ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
			: ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
		var rows = this.log.filter(function (x) { return (self.kind === 'all' || x.k.indexOf(self.kind) >= 0) && (!self.q || (x.s + ' ' + (x.a || '')).toLowerCase().indexOf(self.q) >= 0); });
		/* a block a day (the site is young: its months are long) */
		var days = [], by = {};
		rows.forEach(function (x) { if (!by[x.d]) { by[x.d] = []; days.push(x.d); } by[x.d].push(x); });
		var box = document.querySelector('.cl-list');
		if (!rows.length) { box.innerHTML = '<p class="cl-sum">' + e(L('لا شيء يطابق.', 'Nothing matches.')) + '</p>'; return; }
		box.innerHTML = days.slice(0, this.shown).map(function (dd) {
			return '<section class="cl-month"><h2>' + e(App.num(+dd.slice(8)) + ' ' + MONTHS[+dd.slice(5, 7) - 1] + ' ' + App.num(dd.slice(0, 4))) + ' <small>' + e(App.num(by[dd].length)) + '</small></h2><ol>' + by[dd].map(function (x) {
				var ar = App.lang !== 'en' && x.a;
				return '<li><span class="cl-d">•</span><div>' + (ar ? '<p class="cl-ar">' + e(x.a) + '</p><details class="cl-en"><summary>' + e(L('النص الأصلي', 'Original')) + '</summary><p dir="ltr">' + e(x.s) + '</p></details>' : '<p dir="ltr">' + e(x.s) + '</p>') + (x.k.length ? '<p class="cl-k">' + x.k.map(function (k) { return '<span class="cl-' + k + '">' + e(t(kindName[k])) + '</span>'; }).join('') + '</p>' : '') + '</div></li>';
			}).join('') + '</ol></section>';
		}).join('') + (days.length > this.shown ? '<button type="button" class="share-btn cl-more">' + e(L('أيام أقدم', 'Older days')) + '</button>' : '');
	}
};

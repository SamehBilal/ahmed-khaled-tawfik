/* story.html — «قصة الموقع»: the site's history told as a story, a day at a time from its first (assets/data/story.json, built
   from git by tools/build-story.js): the pages born each day, the covers added, how many changes and of what kind, and the
   day's two headline changes. The band is the days themselves as a skyline, each a column as tall as its changes, flagged
   where a page was born; the log of every change is «سجل التحديثات». */
window.PAGE = {
	id: 'story',
	title: { ar: 'قصة الموقع', en: 'The site’s story' },
	strings: {
		eyebrow: { ar: 'خلف الكواليس', en: 'Behind the site' },
		title: { ar: 'قصة الموقع', en: 'The site’s story' },
		lead: {
			ar: 'كيف كبر هذا الأرشيف يومًا بعد يوم منذ بدأ: متى وُلدت كل صفحة، وكم غلافًا أُضيف، وأهم ما تغيّر في كل يوم.',
			en: 'How this archive grew, day after day since it began: when each page was born, how many covers were added, and what changed most each day.'
		}
	},
	KINDS: [['page', { ar: 'صفحات', en: 'Pages' }], ['data', { ar: 'بيانات', en: 'Data' }], ['pics', { ar: 'صور', en: 'Pictures' }],
		['audio', { ar: 'مسموع', en: 'Audio' }], ['design', { ar: 'تصميم', en: 'Design' }], ['fix', { ar: 'تصحيحات', en: 'Fixes' }]],
	/* the pages drawn from the data have no single address to link to */
	TEMPLATES: ['book.html', 'series.html', 'character.html', 'writer.html', 'publisher.html'],

	band: function () { return '<div class="st-sky" aria-hidden="true"></div>'; },

	date: function (d, year) {
		var App = window.App, M = App.lang === 'en' ? ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
			: ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
		return App.lang === 'en' ? M[+d.slice(5, 7) - 1] + ' ' + (+d.slice(8)) + (year ? ', ' + d.slice(0, 4) : '')
			: App.num(+d.slice(8)) + ' ' + M[+d.slice(5, 7) - 1] + (year ? ' ' + App.num(d.slice(0, 4)) : '');
	},

	render: function () {
		var App = window.App, e = App.esc, L = App.L, self = this;
		document.getElementById('content').innerHTML = '<section class="section st"><div class="wrap info-wrap">' + App.infoTabs('story') +
			'<div class="info-body st-body"><p class="st-sum">…</p></div></div></section>';
		fetch('assets/data/story.json').then(function (r) { return r.json(); }).then(function (s) {
			self.s = s;
			self.sky(s);
			document.querySelector('.st-body').innerHTML = self.body(s);
			App.focusHash();
		}).catch(function () {
			document.querySelector('.st-body').innerHTML = '<p class="st-sum">' + e(L('تعذّر تحميل القصة الآن.', 'The story could not be loaded just now.')) + '</p>';
		});
	},

	/* the band: a column a day, as tall as its changes; a flag on the days a page was born */
	sky: function (s) {
		var App = window.App, e = App.esc, L = App.L, box = document.querySelector('.st-sky');
		if (!box) return;
		var max = Math.max.apply(null, s.days.map(function (x) { return x.n; }).concat(1));
		box.innerHTML = s.days.map(function (x, i) {
			return '<a class="st-col' + (x.pages.length ? ' has-page' : '') + '" href="#day-' + x.d + '" style="--h:' + Math.max(4, Math.round(x.n / max * 100)) + '%;--i:' + i + '" tabindex="-1" title="' +
				e(this.date(x.d) + ' · ' + L(App.count(x.n, ['تحديث واحد', 'تحديثان', 'تحديثات', 'تحديثًا']), x.n + ' changes') + (x.pages.length ? ' · ' + L(App.count(x.pages.length, ['صفحة', 'صفحتان', 'صفحات', 'صفحة']), x.pages.length + ' page' + (x.pages.length > 1 ? 's' : '')) : '')) + '">' +
				(x.pages.length ? '<i class="st-flag">' + e(App.num(x.pages.length)) + '</i>' : '') + '<span></span><b>' + e(App.num(i + 1)) + '</b></a>';
		}, this).join('');
	},

	body: function (s) {
		var App = window.App, e = App.esc, L = App.L, t = App.t, self = this;
		var name = {}; this.KINDS.forEach(function (k) { name[k[0]] = k[1]; });
		var tiles = [[App.num(s.days.length), L('يومًا', 'days')], [App.num(s.changes), L('تحديثًا', 'changes')], [App.num(s.pages), L('صفحة', 'pages')], [App.num(s.covers), L('غلافًا', 'covers')]];
		return '<p class="st-sum">' + e(L('بدأ الموقع في ' + this.date(s.start, true) + '، وهذه قصته حتى ' + this.date(s.end, true) + '. أعمدة الشريط في الأعلى هي أيامه، كلٌّ بطول ما تغيّر فيه، وعليها رايات حيث وُلدت صفحة.',
			'The site began on ' + this.date(s.start, true) + ', and this is its story up to ' + this.date(s.end, true) + '. The columns of the band above are its days, each as tall as what changed in it, flagged where a page was born.')) + '</p>' +
			'<ul class="st-tiles">' + tiles.map(function (x) { return '<li><b>' + e(x[0]) + '</b><span>' + e(x[1]) + '</span></li>'; }).join('') + '</ul>' +
			'<ol class="st-days">' + s.days.map(function (x, i) {
				var kinds = self.KINDS.filter(function (k) { return x.k[k[0]]; });
				return '<li class="st-day" id="day-' + x.d + '"><p class="st-when"><b>' + e(L('اليوم ', 'Day ') + App.num(i + 1)) + '</b> <i aria-hidden="true">·</i> <time datetime="' + x.d + '">' + e(self.date(x.d, true)) + '</time></p>' +
					'<p class="st-count">' + e(L(App.count(x.n, ['تحديث واحد', 'تحديثان', 'تحديثات', 'تحديثًا']), x.n + ' change' + (x.n === 1 ? '' : 's')) + (x.covers ? L(' · ' + App.count(x.covers, ['غلاف جديد', 'غلافان جديدان', 'أغلفة جديدة', 'غلافًا جديدًا']), ' · ' + x.covers + ' new cover' + (x.covers === 1 ? '' : 's')) : '')) +
						' <span class="st-total">' + e(L('(صار في الموقع ' + App.count(x.total.pages, ['صفحة', 'صفحتان', 'صفحات', 'صفحة']) + ' و' + App.count(x.total.covers, ['غلاف', 'غلافان', 'أغلفة', 'غلافًا']) + ')', '(the site now has ' + x.total.pages + ' pages and ' + x.total.covers + ' covers)')) + '</span></p>' +
					(x.pages.length ? '<p class="st-born"><span>' + e(L('وُلدت', 'Born')) + '</span>' + x.pages.map(function (p) {
						var label = e(App.lang === 'en' ? p.en : p.ar);
						return self.TEMPLATES.indexOf(p.f) >= 0 ? '<span class="st-page">' + label + '</span>' : '<a class="st-page" href="' + e(p.f) + '">' + label + '</a>';
					}).join('') + '</p>' : '') +
					(x.top.length ? '<ul class="st-top">' + x.top.map(function (c) { return '<li>' + e(App.lang === 'en' ? c.en : c.ar) + '</li>'; }).join('') + '</ul>' : '') +
					(kinds.length ? '<p class="st-kinds">' + kinds.map(function (k) { return '<span class="st-k-' + k[0] + '">' + e(t(name[k[0]])) + ' ' + e(App.num(x.k[k[0]])) + '</span>'; }).join('') + '</p>' : '') + '</li>';
			}).join('') + '</ol>' +
			'<p class="st-note">' + e(L('كل تحديث بنصه في ', 'Every change, word for word, is in the ')) + '<a href="changelog.html">' + e(L('«سجل التحديثات»', 'Changelog')) + '</a>' +
				e(L('، والتاريخ كله على ', ', and the whole history is on ')) + '<a href="https://github.com/SamehBilal/ahmed-khaled-tawfik/commits/main" target="_blank" rel="noopener">GitHub ↗</a>.</p>';
	}
};

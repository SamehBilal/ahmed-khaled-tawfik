window.PAGE = {
	id: 'tributes',
	title: { ar: 'قالوا عنه', en: 'Tributes' },
	strings: {
		eyebrow: { ar: 'بأقلامهم وأصواتهم', en: 'In their words' },
		title: { ar: 'قالوا عنه', en: 'What they said about him' },
		lead: {
			ar: 'كُتّاب وفنانون ومخرجون وصحفيون تحدّثوا عن العرّاب — عند رحيله وفي ذكراه. كل كلمة هنا منقولة بنصّها مع رابط مصدرها. مرّر لتنفتح البطاقات واحدة بعد أخرى، أو اضغط على صورة أو اسم.',
			en: 'Writers, artists, directors and journalists on the Godfather — when he died and in the years after. Every word here is quoted as published, with a link to where it appeared. Scroll and the cards open one after another, or click a portrait or a name.'
		}
	},

	render: function () {
		var App = window.App, d = App.data(), e = App.esc, t = App.t, tx = App.tx, L = App.L;
		var list = d.tributes || []; /* kept in date order in the data, so #t-i matches search links */
		var content = document.getElementById('content');
		if (!list.length) {
			content.innerHTML = '<section class="section"><div class="wrap"><p class="empty-note">' + L('لم تُضف شهادات بعد.', 'Nothing added yet.') + '</p></div></section>';
			return;
		}
		var fmtDate = function (s) {
			var p = String(s || '').split('-');
			var months = App.lang === 'ar'
				? ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر']
				: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
			if (p.length === 3) return App.num(+p[2]) + ' ' + months[+p[1] - 1] + ' ' + App.num(p[0]);
			if (p.length === 2) return months[+p[1] - 1] + ' ' + App.num(p[0]);
			return App.num(p[0]);
		};
		var initials = function (name) {
			return name.split(/\s+/).filter(Boolean).slice(0, 2).map(function (p) { return p.charAt(/^ال./.test(p) ? 2 : 0); }).join(App.lang === 'ar' ? ' ' : '');
		};
		var plus = '<svg viewBox="0 0 14 14" aria-hidden="true"><path d="M7 1v12M1 7h12" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/></svg>';

		content.innerHTML = '<section class="section"><div class="wrap">' +
			'<ol class="tb" id="tb">' + list.map(function (p, i) {
				var name = t(p.name), other = App.alt(p.quote);
				return '<li class="tb-event rise" id="t-' + i + '" data-i="' + i + '">' +
					'<button type="button" class="tb-thumb" tabindex="-1" aria-hidden="true">' +
						(p.photo ? '<img src="' + e(p.photo) + '" alt="" loading="lazy" referrerpolicy="no-referrer">' : e(initials(name))) +
						'<span class="tb-date">' + e(fmtDate(p.date)) + '</span></button>' +
					'<span class="tb-knob" aria-hidden="true">' + plus + '</span>' +
					'<div class="tb-persp"><div class="tb-card"><div class="tb-inner">' +
						'<h3 class="tb-head"><button type="button" aria-expanded="false" aria-controls="tb-body-' + i + '">' + e(name) +
							'<span class="tb-role">' + tx(p.role) + '</span></button></h3>' +
						'<div class="tb-body" id="tb-body-' + i + '">' +
							'<blockquote>' + tx(p.quote) + '</blockquote>' +
							(other ? '<p class="alt" lang="' + (App.lang === 'ar' ? 'en' : 'ar') + '">' + e(other) + '</p>' : '') +
							(p.context ? '<p class="ctx">' + tx(p.context) + ' ' : '<p class="ctx">') +
							(p.source ? '<a class="src" href="' + e(p.source) + '" target="_blank" rel="noopener">' + L('المصدر ↗', 'Source ↗') + '</a>' : '') + '</p>' +
						'</div>' +
					'</div></div></div>' +
				'</li>';
			}).join('') + '</ol>' +
			(list.some(function (p) { return p.photo; }) ? '<p class="empty-note">' + (list.some(function (p) { return p.photoSource; })
				? L('الصور من ويكيميديا كومنز بتراخيص حرّة، وبعضها من صفحات المؤلفين في «عصير الكتب» أو من التقرير الذي نقل كلمته.', 'Photos from Wikimedia Commons under free licences, and some from the authors’ pages on Aseer Al Kotb or from the report that carried their words.')
				: L('الصور من ويكيميديا كومنز، بتراخيص حرّة.', 'Photos from Wikimedia Commons, under free licences.')) + '</p>' : '') +
		'</div></section>' +
		/* books written about him, covers from assets/img/covers/about */
		((d.aboutBooks || []).length && window.WorksShared ? '<section class="section"><div class="wrap"><h2 class="tb-books-h">' + L('كتب عنه', 'Books about him') + '</h2><div class="cover-grid tb-books">' +
			d.aboutBooks.map(function (b) {
				return '<a class="cover-link" href="book.html?id=' + e(b.id) + '">' + window.WorksShared.miniCover({ img: b.cover, color: b.color || '#3a1414', title: t(b.title), by: t(b.by) }) +
					'<span class="cl-t">' + tx(b.title) + ' — ' + tx(b.by) + '</span></a>';
			}).join('') + '</div></div></section>' : '') +
		/* and after them, the academic work: theses first, then journal articles (AKT.studies) */
		this.studies(d);

		var root = document.getElementById('tb');
		/* keep: leave the other cards open (scrolling on a phone: folding a card above would pull the page up under the reader) */
		var open = function (li, keep) {
			if (!keep) root.querySelectorAll('.tb-event.open').forEach(function (x) {
				if (x === li) return;
				x.classList.remove('open');
				x.querySelector('.tb-head button').setAttribute('aria-expanded', 'false');
			});
			li.classList.add('open');
			li.querySelector('.tb-head button').setAttribute('aria-expanded', 'true');
		};
		this.open = open;
		var lockUntil = 0;
		root.addEventListener('click', function (ev) {
			if (ev.target.closest('a')) return;
			var b = ev.target.closest('.tb-thumb, .tb-head button');
			/* a click wins over the scroll for a moment, while the cards resize */
			if (b) { open(b.closest('.tb-event')); lockUntil = Date.now() + 1200; }
		});
		open(root.querySelector('.tb-event'));
		this.onHash();

		/* scrolling opens the card that reaches the middle of the screen and folds the last one */
		var events = [].slice.call(root.querySelectorAll('.tb-event')), queued = false;
		var narrow = window.matchMedia('(max-width: 760px)');
		var pick = function () {
			queued = false;
			if (!root.isConnected || Date.now() < lockUntil) return;
			var line = window.innerHeight * 0.45, best = null;
			events.forEach(function (li) { if (li.getBoundingClientRect().top < line) best = li; });
			if (best && !best.classList.contains('open')) open(best, narrow.matches);
		};
		this.pick = pick;
		if (this._onScroll) window.removeEventListener('scroll', this._onScroll);
		this._onScroll = function () { if (!queued) { queued = true; requestAnimationFrame(pick); } };
		window.addEventListener('scroll', this._onScroll, { passive: true });
	},

	/* #t-3 opens that card */
	/* «دراسات ورسائل عنه» (#studies): the theses and the journal articles about him, each with where and when, and the book it reads */
	COUNTRY: { Egypt: 'مصر', Algeria: 'الجزائر', 'Saudi Arabia': 'السعودية', Jordan: 'الأردن', Ukraine: 'أوكرانيا', USA: 'الولايات المتحدة', Iraq: 'العراق', Iran: 'إيران', Turkey: 'تركيا', Brazil: 'البرازيل' },
	studies: function (d) {
		var App = window.App, e = App.esc, t = App.t, L = App.L, self = this, list = d.studies || [];
		if (!list.length) return '';
		var KIND = { phd: L('دكتوراه', 'PhD'), ma: L('ماجستير', 'Master’s'), article: L('بحث محكّم', 'Journal article'), paper: L('ورقة مؤتمر', 'Conference paper'), chapter: L('فصل في كتاب', 'Book chapter') };
		var where = function (c) { return App.lang === 'en' ? c : (self.COUNTRY[c] || c); };
		var byYear = function (a, b) { return (b.year || 0) - (a.year || 0); };
		var row = function (x) {
			var w = (d.works || []).filter(function (b) { return b.id === x.about; })[0], ser = !w && x.about ? (d.series || []).filter(function (s) { return s.id === x.about; })[0] : null;
			var rtl = /[؀-ۿ]/.test(x.title);
			return '<li><p class="tb-st-k">' + e(KIND[x.kind] || x.kind) + ' · ' + e(where(x.country)) + (x.year ? ' · ' + e(App.num(x.year)) : '') + '</p>' +
				'<a class="tb-st-t" href="' + e(x.url) + '" target="_blank" rel="noopener" dir="' + (rtl ? 'rtl' : 'ltr') + '">' + e(x.title) + ' ↗</a>' +
				(App.lang === 'en' && x.titleEn ? '<p class="tb-st-en" dir="ltr">' + e(x.titleEn) + '</p>' : '') +
				'<p class="tb-st-by">' + (x.author ? e(x.author) + ' — ' : '') + e(t(x.where)) + '</p>' +
				(w || ser ? '<p class="tb-st-on">' + e(L('عن ', 'On ')) + '<a href="' + e(w ? App.workHref(w.id) : 'series.html?id=' + ser.id) + '">' + e(t((w || ser).title)) + '</a></p>' : '') + '</li>';
		};
		var theses = list.filter(function (x) { return x.kind === 'phd' || x.kind === 'ma'; }).sort(byYear), papers = list.filter(function (x) { return x.kind !== 'phd' && x.kind !== 'ma'; }).sort(byYear);
		var lands = {}; list.forEach(function (x) { lands[x.country] = (lands[x.country] || 0) + 1; });
		return '<section class="section tb-st" id="studies"><div class="wrap"><h2 class="tb-books-h">' + e(L('دراسات ورسائل عنه', 'Studies and theses about him')) + ' <small>' + e(App.num(list.length)) + '</small></h2>' +
			'<p class="tb-st-lead">' + e(L('ما كُتب عنه في الجامعات والمجلات المحكّمة: رسائل ماجستير ودكتوراه وأبحاث، أكثرها عن «يوتوبيا»، من ', 'What has been written about him in universities and peer-reviewed journals: master’s and doctoral theses and articles, most of them on Utopia, from ')) +
				e(Object.keys(lands).sort(function (a, b) { return lands[b] - lands[a]; }).map(function (c) { return where(c) + ' (' + App.num(lands[c]) + ')'; }).join(L('، ', ', '))) + e(L('. كل عنوان يفتح سجلّه في الجامعة أو المجلة.', '. Each title opens its record at the university or the journal.')) + '</p>' +
			'<div class="tb-st-cols"><div><h3>' + e(L('رسائل جامعية', 'Theses')) + ' <small>' + e(App.num(theses.length)) + '</small></h3><ul class="tb-st-list">' + theses.map(row).join('') + '</ul></div>' +
			'<div><h3>' + e(L('أبحاث في المجلات', 'Journal articles')) + ' <small>' + e(App.num(papers.length)) + '</small></h3><ul class="tb-st-list">' + papers.map(row).join('') + '</ul></div></div>' +
			'<p class="tb-st-lead">' + e(L('تعرف رسالة أو بحثًا عنه لم يُذكر هنا؟', 'Know a thesis or a study about him that is not here?')) + ' <a href="' + e(App.fixHref(L('دراسات ورسائل عنه', 'Studies and theses about him'))) + '" target="_blank" rel="noopener">' + e(L('أخبرنا ↗', 'Tell us ↗')) + '</a></p>' +
		'</div></section>';
	},

	onHash: function () {
		var self = this;
		window.App.focusHash(function (el) { if (el.classList.contains('tb-event')) self.open(el); });
	}
};

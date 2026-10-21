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
				? L('الصور من ويكيميديا كومنز بتراخيص حرّة، وبعضها من صفحات المؤلفين في «عصير الكتب».', 'Photos from Wikimedia Commons under free licences, and some from the authors’ pages on Aseer Al Kotb.')
				: L('الصور من ويكيميديا كومنز، بتراخيص حرّة.', 'Photos from Wikimedia Commons, under free licences.')) + '</p>' : '') +
		'</div></section>' +
		/* books written about him, covers from assets/img/covers/about */
		((d.aboutBooks || []).length && window.WorksShared ? '<section class="section"><div class="wrap"><h2 class="tb-books-h">' + L('كتب عنه', 'Books about him') + '</h2><div class="cover-grid tb-books">' +
			d.aboutBooks.map(function (b) {
				return '<a class="cover-link" href="book.html?id=' + e(b.id) + '">' + window.WorksShared.miniCover({ img: b.cover, color: b.color || '#3a1414', title: t(b.title), by: t(b.by) }) +
					'<span class="cl-t">' + tx(b.title) + ' — ' + tx(b.by) + '</span></a>';
			}).join('') + '</div></div></section>' : '');

		var root = document.getElementById('tb');
		var open = function (li) {
			root.querySelectorAll('.tb-event.open').forEach(function (x) {
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
		var pick = function () {
			queued = false;
			if (!root.isConnected || Date.now() < lockUntil) return;
			var line = window.innerHeight * 0.45, best = null;
			events.forEach(function (li) { if (li.getBoundingClientRect().top < line) best = li; });
			if (best && !best.classList.contains('open')) open(best);
		};
		this.pick = pick;
		if (this._onScroll) window.removeEventListener('scroll', this._onScroll);
		this._onScroll = function () { if (!queued) { queued = true; requestAnimationFrame(pick); } };
		window.addEventListener('scroll', this._onScroll, { passive: true });
	},

	/* #t-3 opens that card */
	onHash: function () {
		var self = this;
		window.App.focusHash(function (el) { if (el.classList.contains('tb-event')) self.open(el); });
	}
};

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

	/* «الوداع، يومًا بيوم» (#farewell): from Monday 2 April 2018, the evening he died, to the end of May — each day with what
	   the legacy timeline has for it (AKT.legacy, each to its place on legacy.html) and the faces of those whose words about him
	   are dated that day (AKT.tributes, each opening its card above) */
	farewell: function (d) {
		var App = window.App, e = App.esc, t = App.t, L = App.L, P = window.Posthumous;
		if (!P) return '';
		var END = '2018-05-31', days = {}, order = [];
		var day = function (k) { if (!days[k]) { days[k] = { k: k, ev: [], who: [] }; order.push(k); } return days[k]; };
		(d.legacy || []).forEach(function (l, i) { if (l.date >= P.DEATH && l.date <= END) day(l.date).ev.push({ l: l, i: i }); });
		(d.tributes || []).forEach(function (p, i) { if (p.date >= P.DEATH && p.date <= END) day(p.date).who.push({ p: p, i: i }); });
		if (!order.length) return '';
		order.sort();
		var pic = function (l) {
			var s = l.image || '';
			if (s === 'portrait') return 'assets/img/photos/youm7-e94d8bd9a946.jpg';
			if (s.indexOf('yt:') === 0) return 'https://i.ytimg.com/vi/' + s.slice(3) + '/mqdefault.jpg';
			if (s.indexOf('cover:') === 0 || !s) return '';
			return s;
		};
		return '<section class="section fw" id="farewell"><div class="wrap">' +
			'<div class="section-head"><div><p class="eyebrow">' + e(L('أبريل ومايو 2018', 'April and May 2018')) + '</p><h2>' + e(L('الوداع، يومًا بيوم', 'The farewell, day by day')) + '</h2>' +
				'<p>' + e(L('من مساء الاثنين الذي رحل فيه إلى آخر مايو: كيف ودّعه قرّاؤه ومدينته ومن كتبوا معه، يومًا بعد يوم.', 'From the Monday evening he died to the end of May: how his readers, his city and those who wrote beside him said goodbye, one day after another.')) + '</p></div></div>' +
			'<ol class="fw-days">' + order.map(function (k) {
				var x = days[k], parts = k.split('-'), full = parts.length === 3;
				return '<li class="fw-day rise">' +
					'<div class="fw-date"><b>' + e(full ? App.num(+parts[2]) : '—') + '</b><span>' + e(full ? P.weekday(k) : '') + '</span><small>' + e(P.fmt(parts[0] + '-' + parts[1])) + '</small></div>' +
					'<div class="fw-body">' +
						x.ev.map(function (v) {
							var src = pic(v.l);
							return '<a class="fw-ev" href="legacy.html#l-' + v.i + '">' + (src ? '<img src="' + e(src) + '" alt="" loading="lazy" referrerpolicy="no-referrer">' : '') +
								'<span><b>' + e(t(v.l.title)) + '</b><small>' + e(t(v.l.text)) + '</small></span></a>';
						}).join('') +
						(x.who.length ? '<div class="fw-who"><p>' + e(L('قالوا عنه في هذا اليوم:', 'Who spoke of him that day:')) + '</p>' + x.who.map(function (w) {
							var name = t(w.p.name);
							return '<a href="#t-' + w.i + '" data-t="' + w.i + '" title="' + e(name) + '">' + (w.p.photo ? '<img src="' + e(w.p.photo) + '" alt="" loading="lazy" referrerpolicy="no-referrer">' : '<i>' + e(name.charAt(0)) + '</i>') + '<span>' + e(name) + '</span></a>';
						}).join('') + '</div>' : '') +
					'</div></li>';
			}).join('') + '</ol>' +
		'</div></section>';
	},

	render: function () {
		/* «دراسات ورسائل عنه» has a page of its own now: an old link to it goes there */
		if (location.hash === '#studies') { location.replace('studies.html'); return; }
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
		/* «الوداع، يومًا بيوم»: the days from his death to the end of May 2018 */
		this.farewell(d) +
		/* books written about him, covers from assets/img/covers/about */
		((d.aboutBooks || []).length && window.WorksShared ? '<section class="section"><div class="wrap"><h2 class="tb-books-h">' + L('كتب عنه', 'Books about him') + '</h2><div class="cover-grid tb-books">' +
			d.aboutBooks.map(function (b) {
				return '<a class="cover-link" href="book.html?id=' + e(b.id) + '">' + window.WorksShared.miniCover({ img: b.cover, color: b.color || '#3a1414', title: t(b.title), by: t(b.by) }) +
					'<span class="cl-t">' + tx(b.title) + ' — ' + tx(b.by) + '</span></a>';
			}).join('') + '</div></div></section>' : '');

		var fwBox = document.getElementById('farewell');
		if (fwBox) fwBox.addEventListener('click', function (ev) {
			var a = ev.target.closest('.fw-who a[data-t]');
			if (!a) return;
			var li = document.getElementById('t-' + a.dataset.t), btn = li && li.querySelector('.tb-head button');
			if (!li) return;
			ev.preventDefault();
			li.scrollIntoView({ behavior: 'smooth', block: 'center' });
			if (btn && btn.getAttribute('aria-expanded') !== 'true') setTimeout(function () { btn.click(); }, 450);
		});
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
	onHash: function () {
		var self = this;
		window.App.focusHash(function (el) { if (el.classList.contains('tb-event')) self.open(el); });
	}
};

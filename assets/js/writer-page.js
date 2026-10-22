/* writer.html?id=<id> — one page per writer around him (assets/js/people.js):
   who they are, how they are connected to him and everything they did together, the books of theirs and his
   on the site, what they said about him, and the writers next to them on the shelf. */
window.PAGE = {
	id: 'writers',
	title: { ar: 'كاتب', en: 'Writer' },

	SHELF: {
		collaborators: { ar: 'كتب معه', arF: 'كتبت معه', en: 'Wrote with him', c: '#8a3b12' },
		introductions: { ar: 'المقدّمات', en: 'Introductions', c: '#2c5a68' },
		dedications: { ar: 'أهدى إليه', arF: 'أهدت إليه', en: 'Dedicated a book to him', c: '#5a1f3a' },
		influenced: { ar: 'تأثّر به', arF: 'تأثّرت به', en: 'Influenced by him', c: '#7a5a1c' },
		contemporaries: { ar: 'رفيق الطريق', arF: 'رفيقة الطريق', en: 'Contemporary', c: '#334155' },
		translated: { ar: 'ترجم له', en: 'He translated them', c: '#3b3b58' }
	},

	/* a shelf's label for this person (feminine in Arabic for a woman) */
	label: function (sh, p) { return window.App.L(p.female && sh.arF ? sh.arF : sh.ar, sh.en); },

	/* one sentence on how they are connected to him, from the shelves they are on */
	link: function (p) {
		var App = window.App, n = App.t(p.name), has = function (s) { return p.shelves.indexOf(s) >= 0; };
		var L = function (ar, en, arF) { return App.L(p.female && arF ? arF : ar, en); };
		var parts = [];
		if (has('collaborators')) parts.push(L('شارك أحمد خالد توفيق الكتابة', 'wrote with Ahmed Khaled Tawfik', 'شاركت أحمد خالد توفيق الكتابة'));
		if (has('introductions')) parts.push(L('جمعتهما مقدّمة أو كلمة على غلاف', 'shared a foreword or a back-cover word with him'));
		if (has('dedications')) parts.push(L('أهدى إليه كتابًا', 'dedicated a book to him', 'أهدت إليه كتابًا'));
		if (has('influenced')) parts.push(L('خرج من عباءته قارئًا ثم كاتبًا', 'grew up reading him before becoming a writer', 'خرجت من عباءته قارئةً ثم كاتبةً'));
		if (has('contemporaries')) parts.push(L('كان من رفاق جيله في كتب الجيب', 'was one of his peers in the pocket books', 'كانت من رفاق جيله في كتب الجيب'));
		if (has('translated')) parts.push(L('نقل العرّاب أعماله إلى العربية', 'was translated into Arabic by him'));
		if (!parts.length) return '';
		var last = parts.pop();
		return n + ' ' + (parts.length ? parts.join(L('، و', ', ')) + L('، و', ' and ') : '') + last + L('.', '.');
	},

	render: function () {
		var App = window.App, d = App.data(), S = window.WorksShared, P = window.People, self = this;
		var e = App.esc, t = App.t, tx = App.tx, L = App.L;
		var id = new URLSearchParams(location.search).get('id') || '';
		var p = P.byId(id);
		var root = document.getElementById('content');
		if (!p) {
			root.innerHTML = '<section class="page-hero"><div class="wrap"><p class="eyebrow">404</p><h1>' + L('لم نجد هذا الكاتب', 'Writer not found') + '</h1>' +
				'<p class="lead"><a href="writers.html">' + L('كل الكُتّاب', 'All the writers') + '</a></p></div></section>';
			return;
		}
		this.title = p.name;
		App.applyLang();

		var first = this.SHELF[p.shelves[0]] || this.SHELF.collaborators;
		var name = t(p.name);
		var portrait = p.photo
			? '<figure class="wp-photo"><img src="' + e(p.photo.url) + '" alt="' + e(name) + '" referrerpolicy="no-referrer">' +
				(p.photo.file ? '<figcaption><a href="' + e(p.photo.file) + '" target="_blank" rel="noopener">' + (p.photo.license ? e(p.photo.license) + ' · ' : '') + (p.photo.source ? tx(p.photo.source) : 'Wikimedia Commons') + ' ↗</a></figcaption>' : '') + '</figure>'
			: '<div class="wp-photo wp-mono" aria-hidden="true">' + e(P.initials(name, App.lang)) + '</div>';
		var chips = p.shelves.map(function (s) {
			var sh = self.SHELF[s];
			return '<a class="wp-chip" style="--c:' + sh.c + '" href="writers.html#wr-' + s + '-' + e(p.id) + '">' + e(self.label(sh, p)) + '</a>';
		}).join('');
		var bio = p.bio
			? '<p class="wp-bio">' + e(L(p.bio.ar, p.bio.en)) + ' <a class="wp-src" href="' + e(App.lang === 'en' && p.bio.srcEn ? p.bio.srcEn : p.bio.src) + '" target="_blank" rel="noopener">' +
				(/wikipedia/.test(App.lang === 'en' && p.bio.srcEn ? p.bio.srcEn : p.bio.src) ? L('عن ويكيبيديا ↗', 'From Wikipedia ↗') : L('عن «عصير الكتب» ↗', 'From Aseer Al Kotb ↗')) + '</a></p>'
			: '';

		/* everything they did with him, shelf by shelf */
		var together = p.shelves.map(function (s) {
			var sh = self.SHELF[s];
			return '<div class="wp-group" style="--c:' + sh.c + '"><h3>' + e(self.label(sh, p)) + '</h3>' +
				p.entries.filter(function (x) { return x.shelf === s; }).map(function (x) {
					var w = x.w, meta = P.meta(w);
					return '<article class="wp-entry">' +
						((w.cover || w.back) ? '<div class="wp-covers">' +
							(w.cover ? '<img src="' + e(w.cover) + '" alt="' + e(t(w.book)) + '" loading="lazy">' : '') +
							(w.back ? '<a href="' + e(w.back) + '" target="_blank" rel="noopener"><img src="' + e(w.back) + '" alt="' + e((w.direction === 'dedication' ? L('صفحة الإهداء — ', 'Dedication page — ') : L('الغلاف الخلفي — ', 'Back cover — ')) + t(w.book)) + '" loading="lazy"></a>' : '') +
						'</div>' : '') +
						'<div class="wp-entry-body">' + (meta ? '<p class="wp-meta">' + e(meta) + '</p>' : '') + App.paras(w.text) +
						(w.source ? '<a class="wp-src" href="' + e(w.source) + '" target="_blank" rel="noopener">' + L('المصدر ↗', 'Source ↗') + '</a>' : '') + '</div>' +
					'</article>';
				}).join('') + '</div>';
		}).join('');

		/* the books on the site their entries name */
		var books = p.works.map(function (wid) {
			var w = App.findWork(wid);
			if (!w) return '';
			return '<a class="cover-link" href="' + e(S.bookHref(wid)) + '">' + S.miniCover({ img: S.coverOf((d.bookInfo || {})[wid]), color: w.color, title: t(w.title) }) +
				'<span class="cl-t">' + tx(w.title) + (w.year ? ' · ' + App.num(w.year) : '') + '</span></a>';
		}).concat(p.series.map(function (sid) {
			var s = S.anySeries(sid);
			if (!s) return '';
			return '<a class="cover-link" href="' + e(S.seriesHref(sid)) + '">' + S.miniCover({ img: S.seriesCover(sid), color: s.s.color, title: t(s.s.title) }) +
				'<span class="cl-t">' + tx(s.s.title) + ' · ' + L('سلسلة', 'series') + '</span></a>';
		})).join('');

		var tribute = p.tribute
			? '<section class="section"><div class="wrap"><h2 class="wp-h">' + (p.female ? L('قالت عنه', 'What she said about him') : L('قال عنه', 'What they said about him')) + '</h2>' +
				'<blockquote class="wp-quote">' + tx(p.tribute.quote) + (p.tribute.context ? '<cite>' + tx(p.tribute.context) + '</cite>' : '') +
				(p.tribute.source ? ' <a class="wp-src" href="' + e(p.tribute.source) + '" target="_blank" rel="noopener">' + L('المصدر ↗', 'Source ↗') + '</a>' : '') + '</blockquote></div></section>'
			: '';

		/* the writers next to them: the rest of their first shelf, then the others */
		var all = P.all();
		var near = all.filter(function (q) { return q !== p && q.shelves.indexOf(p.shelves[0]) >= 0; })
			.concat(all.filter(function (q) { return q !== p && q.shelves.indexOf(p.shelves[0]) < 0; }));
		var i = all.indexOf(p), prev = all[(i - 1 + all.length) % all.length], next = all[(i + 1) % all.length];
		var person = function (q) {
			var n = t(q.name);
			return '<a class="wp-person" href="' + e(P.href(q)) + '"><span class="wp-dot"' + (q.photo ? ' style="background-image:url(&quot;' + e(q.photo.url) + '&quot;)"' : '') + '>' + (q.photo ? '' : e(P.initials(n, App.lang))) + '</span><span>' + e(n) + '</span></a>';
		};

		root.innerHTML =
			'<section class="wp-hero" style="--c:' + first.c + '"><div class="wrap">' +
				'<nav class="crumbs"><a href="writers.html">' + L('الكُتّاب', 'Writers') + '</a> / <span>' + e(name) + '</span></nav>' +
				'<div class="wp-head">' + portrait +
					'<div class="wp-id"><p class="eyebrow">' + L('حول العرّاب', 'Around the Godfather') + '</p><h1>' + tx(p.name) + '</h1>' +
						'<p class="wp-alt">' + e(App.alt(p.name)) + '</p><div class="wp-chips">' + chips + '</div>' +
						bio + '<p class="wp-link">' + e(this.link(p)) + '</p></div>' +
				'</div></div></section>' +
			'<section class="section"><div class="wrap"><h2 class="wp-h">' + L('ما جمعه بالعرّاب', 'What they did with him') + '</h2>' + together + '</div></section>' +
			(books ? '<section class="section"><div class="wrap"><h2 class="wp-h">' + L('على الموقع', 'On this site') + '</h2><div class="cover-row">' + books + '</div></div></section>' : '') +
			tribute +
			'<section class="section"><div class="wrap"><h2 class="wp-h">' + L('كُتّاب آخرون', 'Other writers') + '</h2><div class="wp-people">' + near.map(person).join('') + '</div>' +
				'<div class="pn wp-pn"><a href="' + e(P.href(prev)) + '">' + L('→ ', '← ') + e(t(prev.name)) + '</a><a href="' + e(P.href(next)) + '">' + e(t(next.name)) + L(' ←', ' →') + '</a></div>' +
			'</div></section>';
	}
};

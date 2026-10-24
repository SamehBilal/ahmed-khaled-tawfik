/* book.html?id=<work id> or book.html?id=<series>-<n>[-part] — a Goodreads-style page for one book */
window.PAGE = {
	id: 'works',
	title: { ar: 'كتاب', en: 'Book' },

	render: function () {
		var App = window.App, d = App.data(), S = window.WorksShared;
		var e = App.esc, t = App.t, tx = App.tx, L = App.L;
		var id = new URLSearchParams(location.search).get('id') || '';
		var r = S.resolveBook(id);
		var root = document.getElementById('content');

		if (!r) {
			root.innerHTML = '<section class="page-hero"><div class="wrap"><p class="eyebrow">404</p><h1>' + L('لم نجد هذا الكتاب', 'Book not found') + '</h1>' +
				'<p class="lead"><a href="works.html">' + L('عودة إلى كل الأعمال', 'Back to all works') + '</a></p></div></section>';
			return;
		}

		var item = r.item, info = r.info || {};
		var isIssue = r.kind === 'issue', ser = isIssue ? r.series : null;
		var title = item.title || {};
		var color = item.color || (ser && ser.s.color) || '#3a1414';
		var typeLabel = isIssue
			? (item.spinoff ? { ar: 'كتاب جانبي', en: 'Spin-off' } : { ar: 'عدد من سلسلة', en: 'Series issue' })
			: (S.TYPES[item.type] || { ar: item.type, en: item.type });
		var cover = S.coverOf(info);
		var desc = info.description || item.synopsis || (isIssue && item.original ? item.original : null);
		/* what is printed on its back: a photo of the real back cover, and the blurb (series issues) */
		var blurb = (d.blurbs || {})[id] || info.blurb || null, backImg = (d.backCovers || {})[id] || '';
		if (!desc && blurb) desc = { ar: blurb.ar };
		var numLabel = r.special ? L('عدد خاص ', 'Special issue ') + App.num(item.n) : isIssue && item.n != null ? App.num('#' + item.n) + (item.part ? ' · ' + L('الجزء ', 'Part ') + App.num(item.part) : '') : '';

		this.title = title;
		window.App.applyLang();

		/* ---------- left: the 3D book ---------- */
		var pages = [];
		if (desc) pages.push('<h4>' + tx(title) + '</h4>' + App.paras(desc));
		if (info.contents && info.contents.length) {
			pages.push('<h4>' + L('المحتويات', 'Contents') + '</h4><ol>' + info.contents.map(function (c) { return '<li>' + tx(c) + '</li>'; }).join('') + '</ol>');
		}
		if (!pages.length) pages.push('<h4>' + tx(title) + '</h4><p>' + L('لا يوجد وصف بعد.', 'No description yet.') + '</p>');

		var book = window.Books.showcase({
			key: 'b:' + id,
			color: color, title: title, img: cover,
			num: isIssue && item.n != null ? '№ ' + item.n : '',
			motif: isIssue && item.n != null ? App.num(item.n) : S.monogram(title),
			back: blurb ? e(blurb.ar).replace(/\n/g, '<br>') : tx(item.synopsis || desc || ''),
			backImg: backImg,
			meta: isIssue ? t(ser.s.title) : (item.year ? String(item.year) : ''),
			pages: pages,
			info: { title: '', text: '' },
			by: r.about ? t(item.by) : isIssue && ser.inspired ? t(S.seriesAuthor(ser)) : ''
		});

		/* ---------- details table ---------- */
		var firstEd = (info.editions || [])[0] || {};
		var publisher = item.publisher || (isIssue ? ser.s.publisher : null) || firstEd.publisher;
		var rows = [
			[L('النوع', 'Type'), t(typeLabel)],
			[L('أول نشر', 'First published'), App.num(info.firstPublished || item.year || '')],
			[L('الناشر', 'Publisher'), publisher ? t(publisher) : '', publisher ? S.publisherLink(publisher) : ''],
			[L('عدد الصفحات', 'Pages'), App.num(info.pages || firstEd.pages || '')],
			[L('اللغة', 'Language'), langName(info.language || 'ar')],
			['ISBN', firstEd.isbn || ''],
			[L('الأصل', 'Original'), item.original ? t(item.original) : '']
		].filter(function (x) { return x[1]; });

		/* ---------- people ---------- */
		/* a book about him, or a book of a series his work inspired, is by someone else */
		var otherAuthor = r.about ? item.by : (isIssue && ser.inspired ? S.seriesAuthor(ser) : null);
		var authorAr = otherAuthor ? otherAuthor.ar : 'أحمد خالد توفيق';
		/* the book's other people, without repeating the author already named first (some lists include him) */
		var bare = function (n) { return String(n || '').replace(/^(د\.|Dr\.)\s*/, '').replace(/\s+/g, ' ').trim(); };
		var people = (otherAuthor ? '<span>' + tx(otherAuthor) + '</span>' : '<a href="index.html">' + L('أحمد خالد توفيق', 'Ahmed Khaled Tawfik') + '</a>') +
			(info.authors || []).filter(function (p) { return bare(p.ar) !== bare(authorAr) || p.role; }).map(function (p) {
				return '<span class="sep">·</span>' + tx(p) + (p.role ? ' <span class="role">(' + tx(p.role) + ')</span>' : '');
			}).join('');

		/* ---------- characters / quotes / adaptations ---------- */
		var chars = [];
		if (isIssue) {
			if (ser.own && ser.s.hero) chars.push(ser.s.hero);
			(item.chars || []).forEach(function (c) { if (chars.indexOf(c) < 0) chars.push(c); });
			if (ser.inspired) (d.characters || []).forEach(function (c) { if (c.work === ser.s.id && chars.indexOf(c.id) < 0) chars.push(c.id); });
		} else {
			(d.characters || []).forEach(function (c) { if (c.work === item.id) chars.push(c.id); });
		}
		var quotes = isIssue ? [] : (d.quotes || []).map(function (q, i) { return { q: q, i: i }; }).filter(function (x) { return x.q.work === item.id; });
		var adapts = (d.adaptations || []).filter(function (a) { return a.basedOn === (isIssue ? '' : item.id); });

		/* ---------- editions ---------- */
		var eds = info.editions || [];
		var edHtml = eds.map(function (ed) {
			var meta = [
				ed.publisher ? t(ed.publisher) : '',
				ed.year ? App.num(ed.year) : '',
				ed.format ? t(ed.format) : '',
				ed.pages ? App.num(ed.pages) + ' ' + L('صفحة', 'pages') : '',
				langName(ed.lang)
			].filter(Boolean).join(' · ');
			return '<article class="edition">' +
				S.miniCover({ img: ed.cover, color: color, title: t(ed.title || title), by: otherAuthor ? authorAr : ed.lang && ed.lang !== 'ar' ? 'Ahmed Khaled Tawfik' : '' }) +
				'<div><h4>' + tx(ed.title || title) + '</h4>' +
				'<p class="meta">' + e(meta) + '</p>' +
				(ed.translator ? '<p class="meta">' + L('ترجمة: ', 'Translated by ') + tx(ed.translator) + '</p>' : '') +
				(ed.isbn ? '<p class="meta">ISBN ' + e(ed.isbn) + '</p>' : '') +
				(ed.source ? '<a href="' + e(ed.source) + '" target="_blank" rel="noopener">' + (ed.store === 'Abjjad' ? L('على أبجد ↗', 'On Abjjad ↗') : ed.store === 'Aseer Al Kotb' ? L('على عصير الكتب ↗', 'On Aseer Al Kotb ↗') : L('المصدر ↗', 'Source ↗')) + '</a>' : '') +
				'</div></article>';
		}).join('');

		/* ---------- series navigation (issues) / related books (works) ---------- */
		var shelf = '';
		if (isIssue) {
			var list = r.list, i0 = Math.max(0, r.index - 4), near = list.slice(i0, i0 + 9);
			var prev = list[r.index - 1], next = list[r.index + 1];
			shelf = '<section class="d-block"><div class="d-head"><h3>' + L('في هذه السلسلة', 'In this series') + '</h3>' +
				'<a href="' + S.seriesHref(ser.s.id) + '">' + L('كل الأعداد ←', 'All issues →') + '</a></div>' +
				'<div class="pn">' +
					(prev ? '<a href="' + App.issueHref(ser.s.id, prev) + '">' + L('→ السابق: ', '← Previous: ') + tx(prev.title) + '</a>' : '<span></span>') +
					(next ? '<a href="' + App.issueHref(ser.s.id, next) + '">' + L('التالي: ', 'Next: ') + tx(next.title) + L(' ←', ' →') + '</a>' : '<span></span>') +
				'</div>' +
				'<div class="cover-row">' + near.map(function (is) {
					var here = is === item;
					return '<a class="cover-link' + (here ? ' here' : '') + '" href="' + App.issueHref(ser.s.id, is) + '"' + (here ? ' aria-current="page"' : '') + '>' +
						S.miniCover({ img: S.issueCover(ser.s.id, is), color: ser.s.color, title: t(is.title), num: is.n != null ? App.num(is.n) : '', by: authorAr }) + '</a>';
				}).join('') + '</div></section>';
		} else {
			var rel = r.about ? (d.aboutBooks || []).filter(function (w) { return w.id !== item.id; })
				: (d.works || []).filter(function (w) { return w.type === item.type && w.id !== item.id; }).slice(0, 8);
			if (rel.length) {
				shelf = '<section class="d-block"><div class="d-head"><h3>' + (r.about ? L('كتب أخرى عنه', 'More books about him') : L('من النوع نفسه', 'More like this')) + '</h3>' +
					(r.about ? '<a href="tributes.html">' + L('قالوا عنه ←', 'Tributes →') + '</a>' : '<a href="works.html">' + L('كل الأعمال ←', 'All works →') + '</a>') + '</div>' +
					'<div class="cover-row">' + rel.map(function (w) {
						return '<a class="cover-link" href="' + S.bookHref(w.id) + '">' +
							S.miniCover({ img: r.about ? w.cover : S.coverOf((d.bookInfo || {})[w.id]), color: w.color, title: t(w.title), sub: w.year ? App.num(w.year) : '', by: r.about ? t(w.by) : '' }) + '</a>';
					}).join('') + '</div></section>';
			}
		}

		var audioTracks = (isIssue && window.Cassette) ? window.Cassette.issueTracks(r.id, t(title)) : [];

		/* ---------- where to buy: store search links for this title (no affiliate codes) ---------- */
		var qAr = (isIssue && ser ? t(ser.s.title) + ' ' : '') + (title.ar || '') + ' ' + authorAr;
		var enEd = (info.editions || []).filter(function (ed) { return ed.lang === 'en'; })[0];
		var qEn = enEd ? ((ed2t(enEd) || title.en || '') + ' Ahmed Khaled Towfik') : '';
		function ed2t(ed) { return ed.title && (ed.title.en || ed.title.ar); }
		var Q = encodeURIComponent(qAr);
		/* The Book Home: straight to the book when we know its product page, else its search */
		var bh = (d.bookhome || {})[r.id] || (d.bookhome || {})[id];
		/* the publisher's own shop, when we have the book's page there, comes first */
		var shops = [
			{ kind: L('ورقي', 'Print'), items: (info.shop ? [[t(info.shop.name), info.shop.url]] : []).concat([
				[L('بيت الكتب', 'The Book Home'), bh ? 'https://www.thebookhome.com/product/index/' + bh : 'https://www.thebookhome.com/Home/SearchResult?searchKey=' + encodeURIComponent(title.ar || '') + '&sortKey=Date%20desc&pageNumber=1'],
				/* Aseer Al Kotb: its page for the book when we have one, else a search for the title */
				[L('عصير الكتب', 'Aseer Al Kotb'), (info.aseer && info.aseer.source) || 'https://www.aseeralkotb.com/ar/search?q=' + encodeURIComponent(title.ar || '')],
				['Amazon.eg','https://www.amazon.eg/s?k=' + Q + '&i=stripbooks'],
				['Noon', 'https://www.noon.com/egypt-ar/search/?q=' + Q]
			]) },
			{ kind: L('إلكتروني', 'Ebook'), items: [
				['Abjjad', 'https://www.abjjad.com/search?q=' + Q],
				['Google Play Books', 'https://play.google.com/store/search?q=' + Q + '&c=books'],
				['Kindle', 'https://www.amazon.com/s?k=' + Q + '&i=digital-text']
			] }
		];
		if (audioTracks.length) shops.push({ kind: L('مسموع', 'Audio'), items: [
			audioTracks[0].yt ? ['YouTube — ' + (audioTracks[0].channel || ''), audioTracks[0].url] : ['Audiohat', audioTracks[0].url]
		] });
		if (qEn) shops.push({ kind: L('بالإنجليزية', 'In English'), items: [
			['Amazon', 'https://www.amazon.com/s?k=' + encodeURIComponent(qEn) + '&i=stripbooks']
		] });
		var buyHtml = '<section class="d-block d-buy"><h3>' + L('اشترِ الكتاب', 'Where to buy') + '</h3>' +
			shops.map(function (g) {
				return '<div class="buy-row"><span class="buy-kind">' + e(g.kind) + '</span>' +
					g.items.map(function (it) { return '<a class="buy-btn" href="' + e(it[1]) + '" target="_blank" rel="noopener nofollow">' + e(it[0]) + ' ↗</a>'; }).join('') + '</div>';
			}).join('') +
			'<p class="buy-note">' + L('روابط بحث في المتاجر عن هذا العنوان — التوفر والسعر والطبعة حسب كل متجر. لا عمولة لهذا الموقع.', 'Store searches for this title — availability, price and edition vary by store. This site earns nothing from them.') + '</p></section>';
		var links = (info.links || []).map(function (l) { return '<a href="' + e(l.url) + '" target="_blank" rel="noopener">' + e(l.label) + ' ↗</a>'; }).join('');
		var sources = (info.sources || []).concat(item.source ? [item.source] : []);

		root.innerHTML =
			'<section class="detail"><div class="wrap">' +
				'<nav class="crumbs">' + (r.about ? '<a href="tributes.html">' + L('قالوا عنه', 'Tributes') + '</a>' : '<a href="works.html">' + L('الأعمال', 'Works') + '</a>') +
					(isIssue ? ' / <a href="' + S.seriesHref(ser.s.id) + '">' + tx(ser.s.title) + '</a>' : '') + ' / <span>' + tx(title) + '</span></nav>' +
				'<div class="detail-grid">' +
					'<aside class="d-cover"><ul class="bk-list bk-solo" id="d-book">' + book + '</ul>' +
						(links ? '<div class="d-links">' + links + '</div>' : '') +
					'</aside>' +
					'<div class="d-main">' +
						'<p class="eyebrow">' + tx(typeLabel) + (isIssue ? ' · <a href="' + S.seriesHref(ser.s.id) + '">' + tx(ser.s.title) + '</a> ' + e(numLabel) : '') + '</p>' +
						'<h1>' + tx(title) + '</h1>' +
						'<p class="d-alt">' + e(App.alt(title)) + '</p>' +
						'<p class="d-by">' + (isIssue && !ser.own && !ser.inspired ? L('دوره: ', 'His role: ') + tx(ser.s.role || { ar: 'مساهم', en: 'Contributor' }) + ' — ' : item.type === 'translation' ? L('ترجمة ', 'translated by ') : L('تأليف ', 'by ')) + people + '</p>' +
						(r.about ? '<p class="d-by">' + L('كتاب عن ', 'About ') + '<a href="index.html">' + L('أحمد خالد توفيق', 'Ahmed Khaled Tawfik') + '</a></p>' : '') +
						(isIssue && ser.inspired && ser.s.role ? '<p class="d-by">' + L('صلتها به: ', 'Link to him: ') + tx(ser.s.role) + '</p>' : '') +
						(window.Lists ? window.Lists.buttons('b:' + id) : '') +
						((desc && !(blurb && desc.ar === blurb.ar)) ? '<div class="d-desc">' + App.paras(desc) + '</div>' : '') +
						((blurb || backImg) ? '<section class="d-block d-backcover"><h3>' + L('على الغلاف الخلفي', 'On the back cover') + '</h3>' +
							(backImg ? '<button type="button" class="d-back-img" data-src="' + e(backImg) + '" data-alt="' + e(L('الغلاف الخلفي — ', 'Back cover — ') + t(title)) + '" aria-label="' + e(L('تكبير الغلاف الخلفي', 'Enlarge the back cover')) + '"><img src="' + e(backImg) + '" alt="' + e(L('الغلاف الخلفي — ', 'Back cover — ') + t(title)) + '" loading="lazy"></button>' : '') +
							(blurb ? '<blockquote class="d-blurb" dir="rtl" lang="ar">' + e(blurb.ar).replace(/\n/g, '<br>') + '</blockquote><a class="d-blurb-src" href="' + e(blurb.src) + '" target="_blank" rel="noopener">' + (blurb.by ? L('عن ', 'From ') + t(blurb.by) + ' ↗' : L('عن أبجد ↗', 'From Abjjad ↗')) + '</a>' : '') +
						'</section>' : '') +
						(info.genres && info.genres.length ? '<div class="d-genres">' + info.genres.map(function (g) { return '<span>' + tx(g) + '</span>'; }).join('') + '</div>' : '') +
						(item.note && t(item.note) ? '<p class="note">' + tx(item.note) + '</p>' : '') +
						(function () {
							var aw = (d.awards || []).filter(function (a) { return a.work && a.work === (isIssue ? '' : item.id); });
							return aw.length ? '<section class="d-block"><h3>' + L('جوائز', 'Awards') + '</h3>' + S.awardsList(aw) + '</section>' : '';
						})() +
						buyHtml +
						(audioTracks.length ? '<section class="d-block d-audio"><h3>' + L('استمع إليه', 'Listen') + ' <small>' + e(audioTracks.map(function (x) { return x.yt ? (x.channel || 'YouTube') : 'Audiohat'; }).filter(function (v, k, arr) { return arr.indexOf(v) === k; }).join(' · ')) + '</small></h3><div id="d-cassette"></div></section>' : '') +
						'<dl class="d-facts">' + rows.map(function (x) { return '<dt>' + e(x[0]) + '</dt><dd>' + (x[2] || e(x[1])) + '</dd>'; }).join('') + '</dl>' +
						(info.altTitles && info.altTitles.length ? '<section class="d-block"><h3>' + L('عناوين أخرى', 'Other titles') + '</h3><ul class="alt-titles">' +
							info.altTitles.map(function (a) { return '<li><b lang="' + e(a.lang || '') + '">' + e(a.title) + '</b>' + (a.note ? ' — ' + tx(a.note) : '') + (a.lang ? ' <span class="lng">' + e(a.lang) + '</span>' : '') + '</li>'; }).join('') +
						'</ul></section>' : '') +
						(chars.length ? '<section class="d-block"><h3>' + L('الشخصيات', 'Characters') + '</h3><p class="chips-line">' + chars.map(App.charLink).filter(Boolean).join('') + '</p></section>' : '') +
						(eds.length ? '<section class="d-block"><h3>' + L('الطبعات والأغلفة', 'Editions & covers') + ' <small>(' + App.num(eds.length) + ')</small></h3><div class="editions">' + edHtml + '</div></section>' : '') +
						(quotes.length ? '<section class="d-block"><h3>' + L('اقتباسات', 'Quotes') + '</h3>' + quotes.map(function (x) {
							return '<blockquote class="d-quote">' + tx(x.q.text) + ' <a href="quotes.html#q-' + x.i + '">↗</a></blockquote>';
						}).join('') + '</section>' : '') +
						(adapts.length ? '<section class="d-block"><h3>' + L('على الشاشة', 'On screen') + '</h3>' + adapts.map(function (a) {
							return '<p><b>' + tx(a.title) + '</b> (' + App.num(a.year || '') + ') — ' + tx(a.text) + '</p>';
						}).join('') + '</section>' : '') +
						shelf +
						(sources.length ? '<section class="d-block d-sources"><h3>' + L('المصادر', 'Sources') + '</h3><ul>' +
							sources.map(function (u) { return '<li><a href="' + e(u) + '" target="_blank" rel="noopener">' + e(u.replace(/^https?:\/\/(www\.)?/, '').slice(0, 70)) + '</a></li>'; }).join('') + '</ul></section>' : '') +
						App.fixLink(t(title)) +
					'</div>' +
				'</div>' +
			'</div></section>';

		window.Books.initShowcase(document.getElementById('d-book'));
		/* the back cover opens full size, like the pictures on the home timeline */
		var bc = root.querySelector('.d-back-img');
		if (bc) bc.addEventListener('click', function () { App.showPic(bc.dataset.src, bc.dataset.alt); });
		if (audioTracks.length) window.Cassette.mount(document.getElementById('d-cassette'), { tracks: audioTracks });

		function langName(l) {
			var N = { ar: ['العربية', 'Arabic'], en: ['الإنجليزية', 'English'], fr: ['الفرنسية', 'French'], it: ['الإيطالية', 'Italian'], de: ['الألمانية', 'German'], es: ['الإسبانية', 'Spanish'], tr: ['التركية', 'Turkish'], fa: ['الفارسية', 'Persian'] };
			return l ? (N[l] ? N[l][App.lang === 'ar' ? 0 : 1] : l) : '';
		}
	}
};

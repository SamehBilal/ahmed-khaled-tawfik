/* book.html?id=<work id> or book.html?id=<series>-<n>[-part] — a Goodreads-style page for one book */
window.PAGE = {
	id: 'works',
	title: { ar: 'كتاب', en: 'Book' },

	render: function () {
		var App = window.App, d = App.data(), S = window.WorksShared;
		var e = App.esc, t = App.t, tx = App.tx, L = App.L;
		var id = new URLSearchParams(location.search).get('id') || '';
		var r = S.resolveBook(id);
		/* an old link to an issue since numbered: carry on under its id now, and show that in the address bar */
		if (r && r.kind === 'issue' && r.id !== id) {
			id = r.id;
			try { history.replaceState(null, '', 'book.html?id=' + encodeURIComponent(id) + location.hash); } catch (err) {}
		}
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
		var blurb = (d.blurbs || {})[id] || info.blurb || null;
		/* back covers: the book's own (backCovers), else one per edition (ed.back); the 3D book shows the one of the cover it shows */
		var backs = (info.editions || []).filter(function (ed) { return ed.back; }).filter(function (ed, i, all) { return all.map(function (x) { return x.back; }).indexOf(ed.back) === i; });
		if ((d.backCovers || {})[id]) backs = [{ back: d.backCovers[id] }];
		var mainCover = S.coverOf(info);
		/* the back of the edition whose cover it shows; a back tied to no edition's cover fits any; else the blurb */
		var backImg = ((backs.filter(function (ed) { return ed.cover && ed.cover === mainCover; })[0] ||
			backs.filter(function (ed) { return !ed.cover; })[0] || {}).back) || '';
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

		/* the back as text (the blurb), also for the 3D book when the edition it shows has no back cover */
		var backText = blurb ? e(blurb.ar).replace(/\n/g, '<br>') : tx(item.synopsis || desc || '');
		var backMeta = isIssue ? t(ser.s.title) : (item.year ? String(item.year) : '');
		var book = window.Books.showcase({
			key: 'b:' + id,
			color: color, title: title, img: cover,
			num: isIssue && item.n != null ? '№ ' + item.n : '',
			motif: isIssue && item.n != null ? App.num(item.n) : S.monogram(title),
			back: backText,
			backImg: backImg,
			meta: backMeta,
			pages: pages,
			info: { title: '', text: '' },
			by: r.about ? t(item.by) : isIssue && ser.inspired ? t(S.seriesAuthor(ser)) : ''
		});

		/* the awards this book won (or was shortlisted for): a badge beside the title leads to them */
		var bookAwards = (d.awards || []).filter(function (a) { return a.work && a.work === (isIssue ? '' : item.id); });

		/* ---------- details table ---------- */
		var firstEd = (info.editions || [])[0] || {};
		/* an empty publisher ({ar: ''}) counts as none, so the first edition's stands in */
		var named = function (p) { return p && (p.ar || p.en) ? p : null; };
		var publisher = named(item.publisher) || (isIssue ? named(ser.s.publisher) : null) || named(firstEd.publisher);
		var rows = [
			[L('النوع', 'Type'), t(typeLabel)],
			[L('أول نشر', 'First published'), App.num(info.firstPublished || item.year || '')],
			[L('الناشر', 'Publisher'), publisher ? t(publisher) : '', publisher ? S.publisherLink(publisher) : ''],
			[L('عدد الصفحات', 'Pages'), App.num(info.pages || firstEd.pages || '')],
			[L('اللغة', 'Language'), langName(info.language || 'ar')],
			['ISBN', firstEd.isbn || ''],
			[L('الأصل', 'Original'), item.original ? t(item.original) : ''],
			/* a standalone book that came out in a publisher's line (أدبيات) */
			[L('ضمن سلسلة', 'In the series'), info.inSeries ? t(info.inSeries) : '', info.inSeries && info.inSeriesId ? '<a href="' + e(S.seriesHref(info.inSeriesId)) + '">' + e(t(info.inSeries)) + '</a>' : '']
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

		/* ---------- editions ----------
		   One card per house and cover: printings that only differ in year, format or page count are the same edition
		   to a reader, so they share a card and show as year chips; a chip opens that printing's details. A printing
		   without a cover of its own (an ebook, a reprint) joins its house's card. A book in parts (الآن نفتح الصندوق 1, 2, 3)
		   keeps each part's printings on cards of their own, in the parts' order. */
		var eds = info.editions || [];
		var ORD = ['الأول', 'الثاني', 'الثالث', 'الرابع', 'الخامس'];
		var partOf = function (ed) {
			if (ed.part) return +ed.part;
			var tt = (ed.title || {}).ar || '', m = tt.match(/الجزء\s+(الأول|الثاني|الثالث|الرابع|الخامس)/);
			if (m) return ORD.indexOf(m[1]) + 1;
			m = tt.match(/\s([1-9])\s*$/);
			return m ? +m[1] : 0;
		};
		var houseOf = function (ed) {
			var n = ((ed.publisher || {}).ar || '').replace(/\(ثم[^)]*\)/g, '');
			var p = (d.publishers || []).filter(function (x) { return n && new RegExp(x.match).test(n); })[0];
			return (p ? p.id : n.replace(/\(.*?\)|[–-].*$|\s(للنشر|للطباعة|للتوزيع).*$/g, '').replace(/^(شركة|دار|مؤسسة|مكتبة)\s+/, '').trim()) + '|' + (ed.lang || 'ar') + '|' + partOf(ed);
		};
		var groups = [], byKey = {};
		/* a printing that names no publisher (a Kindle edition) goes with the house whose printing wears the same cover */
		var houseByCover = {};
		eds.forEach(function (ed) { if (ed.cover && ed.publisher && !houseByCover[ed.cover]) houseByCover[ed.cover] = houseOf(ed); });
		var houseOf0 = houseOf;
		houseOf = function (ed) { return (!ed.publisher && houseByCover[ed.cover]) || houseOf0(ed); };
		eds.forEach(function (ed, i) {
			if (!ed.cover) return;
			var k = houseOf(ed) + '|' + ed.cover;
			if (!byKey[k]) { byKey[k] = { cover: ed.cover, house: houseOf(ed), list: [] }; groups.push(byKey[k]); }
			byKey[k].list.push(i);
		});
		eds.forEach(function (ed, i) {
			if (ed.cover) return;
			var g = groups.filter(function (x) { return x.house === houseOf(ed); })[0];
			if (!g) { g = { cover: '', house: houseOf(ed), list: [] }; groups.push(g); }
			g.list.push(i);
		});
		var yr = function (ed) { return +String(ed.year || '').slice(0, 4) || 9999; };
		groups.forEach(function (g) { g.list.sort(function (x, y) { return yr(eds[x]) - yr(eds[y]); }); });
		/* parts in order (a printing of all of them, part 0, comes last), then by year */
		var po = function (g) { return partOf(eds[g.list[0]]) || 99; };
		groups.sort(function (x, y) { return (po(x) - po(y)) || (yr(eds[x.list[0]]) - yr(eds[y.list[0]])); });
		var edHtml = groups.map(function (g) {
			var first = eds[g.list[0]];
			var withPub = g.list.map(function (i) { return eds[i]; }).filter(function (ed) { return ed.publisher; })[0] || first;
			var n = g.list.length;
			/* the house links to its page when it has one */
			var meta = [withPub.publisher ? S.publisherLink(withPub.publisher) : '', e(langName(first.lang)),
				n > 1 ? e(n === 2 ? L('طبعتان', '2 printings') : App.num(n) + ' ' + L(n <= 10 ? 'طبعات' : 'طبعة', 'printings')) : ''].filter(Boolean).join(' · ');
			return '<article class="edition">' +
				S.miniCover({ img: g.cover, color: color, title: t(first.title || title), by: otherAuthor ? authorAr : first.lang && first.lang !== 'ar' ? 'Ahmed Khaled Tawfik' : '' }) +
				'<div><h4>' + tx(first.title || title) + '</h4>' +
				'<p class="meta">' + meta + '</p>' +
				'<div class="ed-years" role="group" aria-label="' + e(L('الطبعات', 'Printings')) + '">' + g.list.map(function (i) {
					var ed = eds[i], f = ed.format ? t(ed.format) : '';
					return '<button type="button" class="ed-yr" data-ed="' + i + '" data-first="' + g.list[0] + '" aria-expanded="false">' + (ed.year ? e(App.num(String(ed.year).slice(0, 4))) : '—') +
						(/كيندل|Kindle/i.test(f) ? ' <small>' + L('إلكتروني', 'ebook') + '</small>' : /صوتي|Audio/i.test(f) ? ' <small>' + L('مسموع', 'audio') + '</small>' : '') + '</button>';
				}).join('') + '</div>' +
				'</div></article>';
		}).join('');
		/* the editions the 3D book can wear: one per card that has a cover, with that edition's back cover if we have one */
		var looks = groups.filter(function (g) { return g.cover; }).map(function (g) {
			var list = g.list.map(function (i) { return eds[i]; });
			var withPub = list.filter(function (ed) { return ed.publisher; })[0] || list[0];
			var p = (d.publishers || []).filter(function (x) { return withPub.publisher && new RegExp(x.match).test(((withPub.publisher || {}).ar || '').replace(/\(ثم[^)]*\)/g, '')); })[0];
			/* its own back cover, else one tied to no edition (it fits any), else none: the blurb */
			return { cover: g.cover, back: (list.filter(function (ed) { return ed.back; })[0] || backs.filter(function (ed) { return !ed.cover; })[0] || {}).back || '',
				house: p ? p.id : '', label: withPub.publisher ? t(withPub.publisher) : L('طبعة', 'Edition'), year: list[0].year ? String(list[0].year).slice(0, 4) : '', lang: list[0].lang };
		});
		var printsHtml = looks.length > 1 ? '<div class="d-prints" role="group" aria-label="' + e(L('بدّل الطبعة على الكتاب', 'Show another edition on the book')) + '">' + looks.map(function (lk, i) {
			var on = lk.cover === S.coverOf(info);
			return '<button type="button" class="d-print" data-look="' + i + '" aria-pressed="' + on + '" title="' + e(lk.label + (lk.year ? ' · ' + App.num(lk.year) : '')) + '">' +
				'<img src="' + e(lk.cover) + '" alt="" loading="lazy"><span>' + e(lk.label) + ((lk.year || (lk.lang && lk.lang !== 'ar')) ? '<small>' + e([lk.year ? App.num(lk.year) : '', lk.lang && lk.lang !== 'ar' ? langName(lk.lang) : ''].filter(Boolean).join(' · ')) + '</small>' : '') + '</span></button>';
		}).join('') + '</div>' : '';

		/* a printing's details, for its chip's popup */
		var edDetails = function (ed, cardTitle) {
			var rows = [
				ed.title && t(ed.title) !== t(cardTitle || title) ? [L('العنوان', 'Title'), tx(ed.title)] : null,
				ed.publisher ? [L('الناشر', 'Publisher'), S.publisherLink(ed.publisher)] : null,
				ed.date ? [L('تاريخ النشر', 'Published'), e(App.num(ed.date.split('-').reverse().join('/')))] : ed.year ? [L('السنة', 'Year'), e(App.num(ed.year))] : null,
				ed.format ? [L('الشكل', 'Format'), e(t(ed.format))] : null,
				ed.edition ? [L('الطبعة', 'Printing'), e(t(ed.edition))] : null,
				ed.pages ? [L('الصفحات', 'Pages'), e(App.num(ed.pages))] : null,
				ed.translator ? [L('الترجمة', 'Translator'), tx(ed.translator)] : null,
				/* the names a printing carries, when they differ from the book's */
				ed.credit ? [L('بقلم', 'By'), tx(ed.credit)] : null,
				ed.isbn ? ['ISBN', e(ed.isbn)] : null,
				ed.isbn10 ? ['ISBN-10', e(ed.isbn10)] : null,
				ed.asin ? ['ASIN', e(ed.asin)] : null
			].filter(Boolean);
			return '<dl>' + rows.map(function (r) { return '<dt>' + r[0] + '</dt><dd>' + r[1] + '</dd>'; }).join('') + '</dl>' +
				(ed.source ? '<a href="' + e(ed.source) + '" target="_blank" rel="noopener">' + (ed.store === 'Abjjad' ? L('على أبجد ↗', 'On Abjjad ↗') : L('المصدر ↗', 'Source ↗')) + '</a>' : '');
		};

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
			/* a book on the writers page sits with the others that carry his words; a book about him with the others about him */
			var rel = r.entry ? S.entryBooks().filter(function (x) { return x.id !== item.id; }).map(function (x) { return { id: x.id, title: x.w.book, year: x.w.year, cover: x.w.cover, by: x.w.name, color: '#3a2a1f' }; })
				: r.about ? (d.aboutBooks || []).filter(function (w) { return w.id !== item.id; })
				: (d.works || []).filter(function (w) { return w.type === item.type && w.id !== item.id; }).slice(0, 8);
			if (rel.length) {
				shelf = '<section class="d-block"><div class="d-head"><h3>' + (r.entry ? L('كتب أخرى عليها كلمته', 'More books with his words') : r.about ? L('كتب أخرى عنه', 'More books about him') : L('من النوع نفسه', 'More like this')) + '</h3>' +
					(r.entry ? '<a href="writers.html">' + L('الكُتّاب ←', 'Writers →') + '</a>' : r.about ? '<a href="tributes.html">' + L('قالوا عنه ←', 'Tributes →') + '</a>' : '<a href="works.html">' + L('كل الأعمال ←', 'All works →') + '</a>') + '</div>' +
					'<div class="cover-row">' + rel.map(function (w) {
						return '<a class="cover-link" href="' + S.bookHref(w.id) + '">' +
							S.miniCover({ img: r.about ? w.cover : S.coverOf((d.bookInfo || {})[w.id]), color: w.color, title: t(w.title), sub: w.year ? App.num(w.year) : '', by: r.about ? t(w.by) : '' }) + '</a>';
					}).join('') + '</div></section>';
			}
		}

		/* an issue's episodes (Audiohat, YouTube, Storytel, Iqraaly); a book of his has its Storytel audiobooks */
		var audioTracks = !window.Cassette ? [] : isIssue ? window.Cassette.issueTracks(r.id, t(title))
			: (window.Cassette.storytelTracks ? window.Cassette.storytelTracks((r.about ? 'about:' : 'work:') + (r.id || id), t(title)) : []);
		var whereOf = function (x) { return x.yt ? (x.channel || 'YouTube') : L(x.providerAr || x.provider || 'Audiohat', x.provider || 'Audiohat'); };

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
		/* one link for each place it can be heard: its first episode there */
		if (audioTracks.length) shops.push({ kind: L('مسموع', 'Audio'), items: audioTracks.filter(function (x, k, arr) {
			return arr.findIndex(function (y) { return whereOf(y) === whereOf(x); }) === k;
		}).map(function (x) { return [x.yt ? 'YouTube — ' + (x.channel || '') : whereOf(x), x.url]; }) });
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
				'<nav class="crumbs">' + (r.entry ? '<a href="writers.html">' + L('الكُتّاب', 'Writers') + '</a>' : r.about ? '<a href="tributes.html">' + L('قالوا عنه', 'Tributes') + '</a>' : '<a href="works.html">' + L('الأعمال', 'Works') + '</a>') +
					(isIssue ? ' / <a href="' + S.seriesHref(ser.s.id) + '">' + tx(ser.s.title) + '</a>' : '') + ' / <span>' + tx(title) + '</span></nav>' +
				'<div class="detail-grid">' +
					'<aside class="d-cover"><ul class="bk-list bk-solo" id="d-book">' + book + '</ul>' + printsHtml +
						(links ? '<div class="d-links">' + links + '</div>' : '') +
					'</aside>' +
					'<div class="d-main">' +
						'<p class="eyebrow">' + tx(typeLabel) + (isIssue ? ' · <a href="' + S.seriesHref(ser.s.id) + '">' + tx(ser.s.title) + '</a> ' + e(numLabel) : '') + '</p>' +
						'<h1>' + tx(title) + (bookAwards.length ? ' <a class="d-award-badge' + (bookAwards[0].kind && bookAwards[0].kind !== 'win' ? ' ' + e(bookAwards[0].kind) : '') + '" href="#d-awards" title="' + e(t(bookAwards[0].title)) + '">' +
							'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 2h4l1.5 5h-4z M13 2h4l-2.5 5H11.5z" fill="#b3261e"/><circle cx="12" cy="14.5" r="7" fill="#d9a441"/><circle cx="12" cy="14.5" r="5" fill="none" stroke="#fff3c4" stroke-width="1.2"/><path d="M12 10.8l1.1 2.3 2.5.3-1.8 1.7.5 2.5-2.3-1.2-2.3 1.2.5-2.5-1.8-1.7 2.5-.3z" fill="#fff3c4"/></svg>' +
							'<span>' + (bookAwards.length > 1 ? App.num(bookAwards.length) + ' ' + L('جوائز', 'awards') : e(t(bookAwards[0].badge || bookAwards[0].title).replace(/\s*[—(].*$/, '')) + ' ' + App.num(bookAwards[0].year || '')) + '</span></a>' : '') + '</h1>' +
						'<p class="d-alt">' + e(App.alt(title)) + '</p>' +
						'<p class="d-by">' + (isIssue && !ser.own && !ser.inspired ? L('دوره: ', 'His role: ') + tx(ser.s.role || { ar: 'مساهم', en: 'Contributor' }) + ' — ' : item.type === 'translation' ? L('ترجمة ', 'translated by ') : L('تأليف ', 'by ')) + people + '</p>' +
						(r.about && !r.entry ? '<p class="d-by">' + L('كتاب عن ', 'About ') + '<a href="index.html">' + L('أحمد خالد توفيق', 'Ahmed Khaled Tawfik') + '</a></p>' : '') +
						(isIssue && ser.inspired && ser.s.role ? '<p class="d-by">' + L('صلتها به: ', 'Link to him: ') + tx(ser.s.role) + '</p>' : '') +
						(window.Lists ? window.Lists.buttons('b:' + id) : '') +
						((desc && !(blurb && desc.ar === blurb.ar)) ? '<div class="d-desc">' + App.paras(desc) + '</div>' : '') +
						(r.entry ? '<section class="d-block d-why-block"><h3>' + L('لماذا هذا الكتاب هنا؟', 'Why this book is here') + '</h3><p class="d-why">' +
							(item.type === 'dedicated' ? L('أهداه مؤلفه إلى أحمد خالد توفيق.', 'Its author dedicated it to Ahmed Khaled Tawfik.') :
								item.type === 'backword' ? L('على غلافه الخلفي كلمة لأحمد خالد توفيق.', 'It carries Ahmed Khaled Tawfik’s words on its back cover.') :
								L('كتب له أحمد خالد توفيق مقدمته.', 'Ahmed Khaled Tawfik wrote its foreword.')) + '</p></section>' : '') +
						(info.intro ? '<section class="d-block d-intro"><h3>' + L('مقدمة أحمد خالد توفيق', 'His foreword') + '</h3><blockquote class="d-blurb" dir="rtl" lang="ar">' + e(info.intro.ar || '').replace(/\n/g, '<br>') + '</blockquote>' +
							(info.intro.src ? '<a class="d-blurb-src" href="' + e(info.intro.src) + '" target="_blank" rel="noopener">' + L('المصدر ↗', 'Source ↗') + '</a>' : '') + '</section>' : '') +
						(info.dedicationPage ? '<section class="d-block d-backcover"><h3>' + L('صفحة الإهداء', 'The dedication page') + '</h3><div class="d-backs"><figure><button type="button" class="d-back-img" data-src="' + e(info.dedicationPage) + '" data-alt="' + e(L('صفحة الإهداء — ', 'Dedication page — ') + t(title)) + '"><img src="' + e(info.dedicationPage) + '" alt="" loading="lazy"></button></figure></div></section>' : '') +
						((blurb || backs.length) ? '<section class="d-block d-backcover"><h3>' + L('على الغلاف الخلفي', 'On the back cover') + '</h3>' +
							(backs.length ? '<div class="d-backs">' + backs.map(function (ed) {
								/* with more than one, each is captioned with its edition */
								var cap = backs.length > 1 ? [ed.publisher ? t(ed.publisher) : '', ed.year ? App.num(ed.year) : ''].filter(Boolean).join(' · ') : '';
								var alt = L('الغلاف الخلفي — ', 'Back cover — ') + t(title) + (cap ? ' (' + cap + ')' : '');
								return '<figure><button type="button" class="d-back-img" data-src="' + e(ed.back) + '" data-alt="' + e(alt) + '" aria-label="' + e(L('تكبير الغلاف الخلفي', 'Enlarge the back cover')) + '"><img src="' + e(ed.back) + '" alt="' + e(alt) + '" loading="lazy"></button>' + (cap ? '<figcaption>' + e(cap) + '</figcaption>' : '') + '</figure>';
							}).join('') + '</div>' : '') +
							(blurb ? '<blockquote class="d-blurb" dir="rtl" lang="ar">' + e(blurb.ar).replace(/\n/g, '<br>') + '</blockquote>' + (blurb.src ? '<a class="d-blurb-src" href="' + e(blurb.src) + '" target="_blank" rel="noopener">' + (blurb.by ? L('عن ', 'From ') + t(blurb.by) + ' ↗' : L('عن أبجد ↗', 'From Abjjad ↗')) + '</a>' : '') : '') +
						'</section>' : '') +
						(info.genres && info.genres.length ? '<div class="d-genres">' + info.genres.map(function (g) { return '<span>' + tx(g) + '</span>'; }).join('') + '</div>' : '') +
						(item.note && t(item.note) ? '<p class="note">' + tx(item.note) + '</p>' : '') +
						(function () {
							return bookAwards.length ? '<section class="d-block" id="d-awards"><h3>' + L('جوائز', 'Awards') + '</h3>' + S.awardsList(bookAwards) + '</section>' : '';
						})() +
						buyHtml +
						(audioTracks.length ? '<section class="d-block d-audio"><h3>' + L('استمع إليه', 'Listen') + ' <small>' + e(audioTracks.map(whereOf).filter(function (v, k, arr) { return arr.indexOf(v) === k; }).join(' · ')) + '</small></h3><div id="d-cassette"></div></section>' : '') +
						'<dl class="d-facts">' + rows.map(function (x) { return '<dt>' + e(x[0]) + '</dt><dd>' + (x[2] || e(x[1])) + '</dd>'; }).join('') + '</dl>' +
						(info.altTitles && info.altTitles.length ? '<section class="d-block"><h3>' + L('عناوين أخرى', 'Other titles') + '</h3><ul class="alt-titles">' +
							info.altTitles.map(function (a) { return '<li><b lang="' + e(a.lang || '') + '">' + e(a.title) + '</b>' + (a.note ? ' — ' + tx(a.note) : '') + (a.lang ? ' <span class="lng">' + e(a.lang) + '</span>' : '') + '</li>'; }).join('') +
						'</ul></section>' : '') +
						(chars.length ? '<section class="d-block"><h3>' + L('الشخصيات', 'Characters') + '</h3><p class="chips-line">' + chars.map(App.charLink).filter(Boolean).join('') + '</p></section>' : '') +
						(eds.length ? '<section class="d-block d-editions"><h3>' + L('الطبعات والأغلفة', 'Editions & covers') + ' <small>(' + App.num(groups.length) + ')</small></h3><div class="editions">' + edHtml + '</div></section>' : '') +
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
		/* the edition buttons: put that edition's front cover, and its back cover (or the blurb), on the 3D book */
		var printsEl = root.querySelector('.d-prints');
		if (printsEl) {
			var bookEl = document.getElementById('d-book'), backEl = bookEl.querySelector('.bk-back');
			printsEl.addEventListener('click', function (ev) {
				var btn = ev.target.closest('.d-print');
				if (!btn) return;
				var lk = looks[+btn.getAttribute('data-look')];
				printsEl.querySelectorAll('.d-print').forEach(function (x) { x.setAttribute('aria-pressed', String(x === btn)); });
				var cov = bookEl.querySelector('.bk-cover'), img = cov.querySelector('.bk-img');
				if (!img) { img = document.createElement('img'); img.className = 'bk-img'; img.alt = ''; cov.insertBefore(img, cov.firstChild); }
				cov.classList.add('has-img');
				img.src = lk.cover;
				/* its own back cover, else the book's (the one the page opened with) */
				if (lk.back) { backEl.classList.add('has-img'); backEl.innerHTML = '<img class="bk-back-img" src="' + e(lk.back) + '" alt="">'; }
				else { backEl.classList.remove('has-img'); backEl.innerHTML = '<p>' + backText + '</p>' + (backMeta ? '<div class="bk-meta">' + e(backMeta) + '</div>' : ''); }
			});
			/* ?pub=<house> (a publisher's page links here) opens on that house's edition */
			var pub = new URLSearchParams(location.search).get('pub');
			var want = pub ? looks.map(function (lk) { return lk.house; }).indexOf(pub) : -1;
			if (want >= 0) printsEl.querySelector('[data-look="' + want + '"]').click();
		}
		/* a printing's year opens a small popup with its details; one at a time, closed by a click elsewhere or Escape */
		var edSec = root.querySelector('.d-editions');
		if (edSec) {
			var pop = document.createElement('div');
			pop.className = 'ed-pop';
			pop.hidden = true;
			edSec.appendChild(pop);
			var openBtn = null;
			var close = function () { pop.hidden = true; if (openBtn) openBtn.setAttribute('aria-expanded', 'false'); openBtn = null; };
			edSec.addEventListener('click', function (ev) {
				var btn = ev.target.closest('.ed-yr');
				if (!btn) { if (!ev.target.closest('.ed-pop')) close(); return; }
				if (openBtn === btn) { close(); return; }
				close();
				openBtn = btn;
				btn.setAttribute('aria-expanded', 'true');
				pop.innerHTML = edDetails(eds[+btn.getAttribute('data-ed')], eds[+btn.getAttribute('data-first')].title);
				pop.hidden = false;
				var sr = edSec.getBoundingClientRect(), br = btn.getBoundingClientRect();
				var left = Math.min(Math.max(0, br.left - sr.left + br.width / 2 - pop.offsetWidth / 2), sr.width - pop.offsetWidth);
				pop.style.left = left + 'px';
				pop.style.top = (br.bottom - sr.top + 8) + 'px';
			});
			document.addEventListener('click', function (ev) { if (!edSec.contains(ev.target)) close(); });
			document.addEventListener('keydown', function (ev) { if (ev.key === 'Escape') close(); });
		}
		/* a publisher named in the description links to its page (its first mention, as a whole name) */
		var descEl = root.querySelector('.d-desc');
		if (descEl) {
			(d.publishers || []).forEach(function (p) {
				var names = [p.name.ar, p.name.en].filter(function (n) { return n && n.length > 3; });
				var walker = document.createTreeWalker(descEl, NodeFilter.SHOW_TEXT), node;
				while ((node = walker.nextNode())) {
					if (node.parentNode.closest('a')) continue;
					var hit = null;
					names.forEach(function (n) {
						var i = node.data.indexOf(n);
						var before = i > 0 ? node.data.charAt(i - 1) : ' ', after = node.data.charAt(i + n.length) || ' ';
						/* a whole name: not inside a longer word (Arabic letters or Latin letters on either side) */
						if (i >= 0 && !/[ء-يa-zA-Z]/.test(before) && !/[ء-يa-zA-Z]/.test(after) && (!hit || i < hit.i)) hit = { i: i, n: n };
					});
					if (!hit) continue;
					var rest = node.splitText(hit.i);
					rest.splitText(hit.n.length);
					var a = document.createElement('a');
					a.href = S.publisherHref(p.id);
					a.className = 'd-pub-link';
					rest.parentNode.replaceChild(a, rest);
					a.appendChild(rest);
					break;
				}
			});
		}

		/* a book on the writers page: why it is here, with a link to its writer */
		if (r.entry) {
			var why = root.querySelector('.d-why');
			if (why && window.People) {
				var who = window.People.ofEntry(r.entry.w);
				if (who) why.insertAdjacentHTML('beforeend', ' <a href="' + e(window.People.href(who)) + '">' + L('صفحة ', '') + e(t(who.name)) + L(' ←', '’s page →') + '</a>');
			}
		}

		/* the back cover opens full size, like the pictures on the home timeline */
		root.querySelectorAll('.d-back-img').forEach(function (bc) { bc.addEventListener('click', function () { App.showPic(bc.dataset.src, bc.dataset.alt); }); });
		if (audioTracks.length) window.Cassette.mount(document.getElementById('d-cassette'), { tracks: audioTracks });

		function langName(l) {
			var N = { ar: ['العربية', 'Arabic'], en: ['الإنجليزية', 'English'], fr: ['الفرنسية', 'French'], it: ['الإيطالية', 'Italian'], de: ['الألمانية', 'German'], es: ['الإسبانية', 'Spanish'], tr: ['التركية', 'Turkish'], fa: ['الفارسية', 'Persian'], fi: ['الفنلندية', 'Finnish'], ml: ['المالايالامية', 'Malayalam'], ru: ['الروسية', 'Russian'], ku: ['الكردية', 'Kurdish'], ur: ['الأردية', 'Urdu'], id: ['الإندونيسية', 'Indonesian'] };
			return l ? (N[l] ? N[l][App.lang === 'ar' ? 0 : 1] : l) : '';
		}
	}
};

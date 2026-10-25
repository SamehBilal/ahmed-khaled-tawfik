window.PAGE = {
	id: 'works',
	title: { ar: 'الأعمال', en: 'Works' },
	strings: {
		eyebrow: { ar: 'المكتبة', en: 'The library' },
		title: { ar: 'الأعمال', en: 'The Works' },
		lead: {
			ar: 'من كتيّبات الجيب التي ربّت جيلًا كاملًا على القراءة، إلى الروايات التي صدمت القارئ بمستقبلٍ قاتم. اقلب الكتب، وافتحها، وتصفّحها.',
			en: 'From the pocket books that raised a whole generation of readers to the novels that shook them with a bleak future. Flip the books, open them, leaf through.'
		},
		seriesTitle: { ar: 'السلاسل', en: 'The series' },
		seriesHint: { ar: 'اضغط «تصفّح من الداخل» لفتح الكتاب، أو «اقلب الكتاب» لقراءة الغلاف الخلفي.', en: 'Press "View inside" to open a book, or "Flip" to read the back cover.' },
		issuesTitle: { ar: 'كل الأعداد', en: 'Every issue' },
		contribTitle: { ar: 'سلاسل شارك فيها', en: 'Series he contributed to' },
		contribHint: { ar: 'سلاسل لم يؤسسها، لكنه كتب أو ترجم لها.', en: 'Series he did not create, but wrote or translated for.' },
		issuesHint: { ar: 'رفّ لكل سلسلة — اسحب أي عدد لترى تفاصيله.', en: 'A shelf for each series — pull out any issue to see its details.' },
		booksTitle: { ar: 'الكتب المستقلة', en: 'Standalone books' },
		booksHint: { ar: 'مرّر المؤشر على الكتاب (أو المسه) لينفتح.', en: 'Hover over a book (or tap it) to open it.' },
		adaptTitle: { ar: 'على الشاشة', en: 'On screen' },
		adaptHint: { ar: 'أعمال تحوّلت إلى مسلسلات وأفلام.', en: 'Works adapted for television and film.' }
	},
	filter: 'all',
	issueSeries: null,

	render: function () {
		var App = window.App, d = App.data(), e = App.esc, t = App.t, tx = App.tx;
		var S = window.WorksShared, self = this;

		this.renderMosaic();

		/* series — showcase books */
		var seriesEl = document.getElementById('series');
		seriesEl.innerHTML = S.ownSeries().map(function (s) { return window.Books.showcase(Object.assign(S.seriesBook(s), { key: 's:' + s.id, href: S.seriesHref(s.id) })); }).join('');

		/* series by others that he wrote or translated for */
		var contrib = S.contributedSeries();
		document.getElementById('contrib-section').hidden = !contrib.length;
		document.getElementById('contrib').innerHTML = contrib.map(function (o) {
			var n = S.seriesIssues(o.id).length;
			return '<a class="cover-link" href="' + S.seriesHref(o.id) + '">' +
				S.miniCover({ img: S.seriesCover(o.id), color: o.color, title: t(o.title), sub: o.owner ? t(o.owner) : '', by: o.role ? t(o.role) : ' ' }) +
				'<span class="cl-t">' + tx(o.title) + (n ? ' · ' + (n === 1 ? App.L('عنوان واحد', '1 title') : n === 2 ? App.L('عنوانان', '2 titles') : App.num(n) + App.L(n <= 10 ? ' عناوين' : ' عنوانًا', ' titles')) : '') + '</span></a>';
		}).join('');
		/* series by others that grew out of his work */
		var insp = S.inspiredSeries(), cs = document.getElementById('contrib-section');
		var ins = document.getElementById('inspired-section');
		if (insp.length && cs && !ins) {
			ins = document.createElement('section');
			ins.id = 'inspired-section'; ins.className = cs.className;
			cs.parentNode.insertBefore(ins, cs.nextSibling);
		}
		if (ins) ins.innerHTML = '<div class="wrap"><div class="section-head"><div><h2>' + App.L('عوالم خرجت من أدبه', 'Worlds grown from his work') + '</h2>' +
			'<p class="sub">' + App.L('سلاسل كتبها غيره، تبدأ من حيث توقف أحد أعداده.', 'Series by other writers that pick up where one of his books left off.') + '</p></div></div>' +
			'<div class="cover-grid">' + insp.map(function (o) {
				var n = S.seriesIssues(o.id).length, first = S.seriesIssues(o.id)[0];
				return '<a class="cover-link" href="' + S.seriesHref(o.id) + '">' +
					S.miniCover({ img: first ? S.issueCover(o.id, first) : '', color: o.color, title: t(o.title), sub: o.owner ? t(o.owner) : '', by: o.author ? t(o.author) : ' ' }) +
					'<span class="cl-t">' + tx(o.title) + (n ? ' · ' + App.num(n) + App.L(n <= 10 ? ' كتب' : ' كتابًا', ' books') : '') + ' — ' + tx(o.author) + '</span></a>';
			}).join('') + '</div></div>';
		window.Books.initShowcase(seriesEl);

		this.renderIssues();

		/* standalone books — hardcovers, sorted by year, and within a year by the day each first came out */
		var firstOut = function (w) { return String(((d.bookInfo || {})[w.id] || {}).firstPublished || ''); };
		var works = (d.works || []).slice().sort(function (a, b) { return ((a.year || 9999) - (b.year || 9999)) || firstOut(a).localeCompare(firstOut(b)); });
		var types = [];
		works.forEach(function (w) { if (types.indexOf(w.type) < 0) types.push(w.type); });

		var chips = [{ id: 'all', label: { ar: 'الكل', en: 'All' }, n: works.length }].concat(types.map(function (ty) {
			return { id: ty, label: S.TYPES[ty] || { ar: ty, en: ty }, n: works.filter(function (w) { return w.type === ty; }).length };
		}));
		var filters = document.getElementById('filters');
		filters.setAttribute('aria-label', App.L('تصفية حسب النوع', 'Filter by type'));
		filters.innerHTML = chips.map(function (c) {
			return '<button type="button" class="chip" data-f="' + e(c.id) + '" aria-pressed="' + (self.filter === c.id) + '">' + tx(c.label) + '<span class="count">' + App.num(c.n) + '</span></button>';
		}).join('');

		var booksEl = document.getElementById('books');
		booksEl.innerHTML = works.map(function (w) {
			var typeLabel = t(S.TYPES[w.type] || { ar: w.type, en: w.type });
			/* the details panel, after Codrops' Book Preview: the book turns on its spine and the facts slide in */
			var bi = (d.bookInfo || {})[w.id] || {}, eds = bi.editions || [], ed0 = eds[0] || {};
			/* the short synopsis and the long description together, without repeating a paragraph */
			var about = [];
			(t(w.synopsis) + '\n\n' + t(bi.description)).split(/\n\s*\n/).forEach(function (p) {
				p = p.trim();
				if (!p) return;
				for (var i = 0; i < about.length; i++) {
					if (about[i].indexOf(p) >= 0) return;
					if (p.indexOf(about[i]) >= 0) { about[i] = p; return; }
				}
				about.push(p);
			});
			var cover = S.coverOf(bi);
			/* a solid book for the details view: it turns to show its spine (on the right, as Arabic books bind) */
			var box = '<div class="hc-boxwrap" aria-hidden="true"><div class="hc-box" style="--hc-c:' + e(w.color || '#444') + '">' +
				'<div class="hcb-front">' + (cover ? '<img src="' + e(cover) + '" alt="" loading="lazy" referrerpolicy="no-referrer" onerror="this.remove()">' : '') + '<span>' + e(t(w.title)) + '</span></div>' +
				'<div class="hcb-back"></div><div class="hcb-edge"></div><div class="hcb-top"></div>' +
				'<div class="hcb-spine"><span>' + e(t(w.title)) + '</span><b>' + e(App.num(w.year || '')) + '</b></div>' +
			'</div></div>';
			var facts = [
				w.publisher && t(w.publisher) ? [App.L('الناشر', 'Publisher'), t(w.publisher)] : null,
				w.year ? [App.L('سنة النشر', 'Published'), App.num(w.year)] : null,
				ed0.pages ? [App.L('الصفحات', 'Pages'), App.num(ed0.pages)] : null,
				eds.length ? [App.L('الطبعات', 'Editions'), App.num(eds.length)] : null
			].filter(Boolean);
			var details = '<div class="hc-details" id="hd-' + e(w.id) + '" role="region" aria-label="' + e(App.L('تفاصيل ', 'Details: ') + t(w.title)) + '"><ul>' +
				'<li>' + about.map(function (p) { return '<p>' + e(p) + '</p>'; }).join('') + '</li>' +
				facts.map(function (f) { return '<li><span>' + e(f[0]) + '</span> ' + e(f[1]) + '</li>'; }).join('') +
				'<li><a href="book.html?id=' + e(w.id) + '">' + App.L('صفحة الكتاب ←', 'Book page →') + '</a></li>' +
				'</ul><button type="button" class="hc-close-details" aria-label="' + e(App.L('إغلاق التفاصيل', 'Close details')) + '"></button></div>';
			return '<li class="hc-item rise" id="w-' + e(w.id) + '" data-type="' + e(w.type) + '">' +
				window.Books.hardcover({ key: 'b:' + w.id, img: S.coverOf((d.bookInfo || {})[w.id]), color: w.color, title: w.title, year: w.year, typeLabel: typeLabel, ribbon: w.ribbon }) +
				'<div class="hc-caption">' +
					'<div class="type">' + e(typeLabel) + (w.year ? ' · ' + App.num(w.year) : '') + '</div>' +
					'<h3><a href="book.html?id=' + e(w.id) + '" style="color:inherit">' + tx(w.title) + '</a></h3>' +
					'<p class="sub">' + e(App.alt(w.title)) + (w.publisher && t(w.publisher) ? ' — ' + tx(w.publisher) : '') + '</p>' +
					'<p>' + tx(w.synopsis) + '</p>' +
					(w.note && t(w.note) ? '<div class="note">' + tx(w.note) + '</div>' : '') +
					S.charXref(w.id) +
					'<div class="hc-buttons"><button type="button" class="hc-show-details" aria-expanded="false" aria-controls="hd-' + e(w.id) + '">' + App.L('التفاصيل', 'Details') + '</button>' +
						'<a class="more-link" href="book.html?id=' + e(w.id) + '">' + App.L('الكتاب والطبعات ←', 'Book & editions →') + '</a></div> ' +
					App.fixLink(t(w.title)) +
				'</div>' + box + details +
			'</li>';
		}).join('');
		if (!booksEl._wired) {
			window.Books.initHardcovers(booksEl);
			/* Details: one book at a time; the close button, a click outside or Esc puts it back */
			var closeDetails = function (li) {
				(li ? [li] : [].slice.call(booksEl.querySelectorAll('.hc-item.details-open'))).forEach(function (x) {
					x.classList.remove('details-open');
					var b = x.querySelector('.hc-show-details'); if (b) b.setAttribute('aria-expanded', 'false');
				});
				document.body.classList.toggle('hc-dim', !!booksEl.querySelector('.hc-item.details-open'));
			};
			booksEl.addEventListener('click', function (ev) {
				var show = ev.target.closest('.hc-show-details'), close = ev.target.closest('.hc-close-details');
				if (show) {
					var li = show.closest('.hc-item');
					closeDetails();
					li.classList.add('details-open');
					show.setAttribute('aria-expanded', 'true');
					document.body.classList.add('hc-dim');
					setTimeout(function () { var c = li.querySelector('.hc-close-details'); if (c) c.focus(); }, 300);
				} else if (close) {
					var li2 = close.closest('.hc-item');
					closeDetails(li2);
					var b2 = li2.querySelector('.hc-show-details'); if (b2) b2.focus();
				}
			});
			document.addEventListener('click', function (ev) { if (document.body.classList.contains('hc-dim') && !ev.target.closest('.hc-item.details-open, .hc-show-details')) closeDetails(); });
			document.addEventListener('keydown', function (ev) { if (ev.key === 'Escape' && document.body.classList.contains('hc-dim')) closeDetails(); });
			booksEl._wired = true;
			/* the details panel shows its scrollbar only while it scrolls */
			booksEl.addEventListener('scroll', function (ev) {
				var p = ev.target;
				if (!p.classList || !p.classList.contains('hc-details')) return;
				p.classList.add('is-scrolling');
				clearTimeout(p._scrollT);
				p._scrollT = setTimeout(function () { p.classList.remove('is-scrolling'); }, 900);
			}, true);
		}

		function applyFilter() {
			booksEl.querySelectorAll('.hc-item').forEach(function (li) {
				li.hidden = !(self.filter === 'all' || li.getAttribute('data-type') === self.filter);
			});
			filters.querySelectorAll('.chip').forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-f') === self.filter)); });
		}
		this.applyFilter = applyFilter;
		filters.onclick = function (ev) {
			var b = ev.target.closest('.chip');
			if (!b) return;
			self.filter = b.getAttribute('data-f');
			applyFilter();
		};
		applyFilter();

		/* adaptations */
		var ad = d.adaptations || [];
		document.getElementById('adaptations-section').hidden = !ad.length;
		var e = App.esc, t = App.t;
		document.getElementById('adaptations').innerHTML = ad.map(function (a) {
			var src = App.findWork(a.basedOn);
			return '<article class="adapt rise' + (a.poster ? ' has-poster' : '') + '">' +
				(a.poster ? '<a class="adapt-poster" href="' + e(a.posterSource || a.poster) + '" target="_blank" rel="noopener"><img src="' + e(a.poster) + '" alt="' + e(App.L('ملصق ', 'Poster: ') + t(a.title)) + '" loading="lazy"></a>' : '') +
				'<div>' +
				'<div class="kind">' + tx(a.kind) + '</div>' +
				'<h3>' + tx(a.title) + '</h3>' +
				'<div class="yr">' + App.num(a.year || '') + (src ? ' · ' + App.L('عن ', 'from ') + App.workLink(a.basedOn) : '') + '</div>' +
				'<p>' + tx(a.text) + '</p>' +
			'</div></article>';
		}).join('');

		this.renderPublishers();

		/* his awards, and the books others wrote about him, after On screen */
		var after = document.getElementById('adaptations-section');
		var addSection = function (id, html) {
			var el = document.getElementById(id);
			if (!el) { el = document.createElement('section'); el.id = id; el.className = 'section'; after.parentNode.insertBefore(el, after.nextSibling); }
			el.innerHTML = '<div class="wrap">' + html + '</div>';
			after = el;
		};
		if ((d.awards || []).length) addSection('awards-section',
			'<div class="section-head"><div><h2>' + App.L('الجوائز والتكريم', 'Awards & honours') + '</h2></div></div>' + S.awardsList(d.awards));
		if ((d.aboutBooks || []).length) addSection('about-section',
			'<div class="section-head"><div><h2>' + App.L('كتب عنه', 'Books about him') + '</h2>' +
				'<p>' + App.L('سِيَر ودراسات كتبها غيره عنه وعن أدبه. ', 'Biographies and studies others wrote about him and his work. ') + '<a href="tributes.html">' + App.L('وما قالوه عنه ←', 'And what they said →') + '</a></p></div></div>' +
			'<div class="cover-grid tb-books">' + d.aboutBooks.map(function (b) {
				return '<a class="cover-link" href="' + S.bookHref(b.id) + '">' + S.miniCover({ img: b.cover, color: b.color, title: t(b.title), by: t(b.by) }) +
					'<span class="cl-t">' + tx(b.title) + ' — ' + tx(b.by) + '</span></a>';
			}).join('') + '</div>');

		this.onHash();
	},

	/* ---------- the publishers he worked with, in order of their first book with him ---------- */
	renderPublishers: function () {
		var App = window.App, d = App.data(), S = window.WorksShared, e = App.esc, tx = App.tx, L = App.L;
		var pubs = d.publishers || [], before = document.getElementById('adaptations-section');
		if (!pubs.length || !before) return;
		var cards = S.publishers();
		var sec = document.getElementById('publishers-section');
		if (!sec) {
			sec = document.createElement('section');
			sec.id = 'publishers-section'; sec.className = 'section';
			before.parentNode.insertBefore(sec, before);
		}
		sec.innerHTML = '<div class="wrap"><div class="section-head"><div><h2>' + L('دور النشر', 'Publishers') + '</h2>' +
			'<p>' + L('الدور التي صدرت عنها كتبه وسلاسله، بترتيب أول كتاب له عند كل منها.', 'The houses that published his books and series, in order of his first book with each.') + '</p></div></div>' +
			'<div class="pub-grid">' + cards.map(S.publisherCard).join('') + '</div></div>';
	},

	/* ---------- every issue, as spines on a shelf ---------- */
	renderIssues: function () {
		var App = window.App, d = App.data(), e = App.esc, tx = App.tx, S = window.WorksShared, self = this;
		/* his own series first, then the ones he wrote or translated for */
		var ids = S.ownSeries().concat(S.contributedSeries()).map(function (s) { return s.id; })
			.filter(function (id, i, all) { return all.indexOf(id) === i && S.seriesIssues(id).length; });
		var ser = function (id) { return S.anySeries(id).s; };
		var section = document.getElementById('issues-section');
		section.hidden = !ids.length;
		if (!ids.length) return;
		if (ids.indexOf(this.issueSeries) < 0) this.issueSeries = ids[0];

		var tabs = document.getElementById('issue-tabs');
		tabs.setAttribute('aria-label', App.L('اختر السلسلة', 'Choose a series'));
		tabs.innerHTML = ids.map(function (id) {
			return '<button type="button" class="chip" data-s="' + e(id) + '" aria-pressed="' + (id === self.issueSeries) + '">' + tx(ser(id).title) + '<span class="count">' + App.num(S.seriesIssues(id).length) + '</span></button>';
		}).join('');
		tabs.onclick = function (ev) {
			var b = ev.target.closest('.chip');
			if (!b) return;
			self.issueSeries = b.getAttribute('data-s');
			self.renderIssues();
		};

		var s = ser(this.issueSeries);
		var list = S.seriesIssues(this.issueSeries);
		var shelf = document.getElementById('issues');
		shelf.style.setProperty('--c', s.color || '#3a1414');
		shelf.innerHTML = list.map(function (is, i) {
			var h = 150 + (((is.n || i + 1) * 29) % 46);
			return '<button type="button" class="issue" id="i-' + e(S.issueKey(s.id, is)) + '" data-i="' + i + '" data-ls-key="b:' + e(S.issueKey(s.id, is)) + '" aria-expanded="false" aria-controls="issue-card" style="--h:' + h + 'px">' +
				'<span class="no">' + e(App.num(is.n)) + (is.part ? '<small>' + e(App.num(is.part)) + '</small>' : '') + '</span><span class="nm">' + tx(is.title) + '</span></button>';
		}).join('');

		var card = document.getElementById('issue-card');
		card.hidden = true;
		shelf.onclick = function (ev) {
			var b = ev.target.closest('.issue');
			if (b) self.openIssue(b);
		};

		var total = s.count ? +s.count : 0, books = list.length;
		var note = document.getElementById('issues-note');
		var src = d.issuesSources || [];
		note.innerHTML = (total && books < total
			? App.L('القائمة تضم ' + App.num(books) + ' من ' + App.num(total) + ' عددًا موثّقًا حتى الآن. ', 'This shelf lists ' + books + ' of ' + total + ' issues confirmed so far. ')
			: '') +
			(src.length ? App.L('المصادر: ', 'Sources: ') + src.map(function (x) { return '<a href="' + e(x.url) + '" target="_blank" rel="noopener">' + e(x.label || x.url) + '</a>'; }).join(' · ') : '');
	},

	openIssue: function (b) {
		var App = window.App, d = App.data(), e = App.esc, tx = App.tx;
		var shelf = document.getElementById('issues'), card = document.getElementById('issue-card');
		var open = b.getAttribute('aria-expanded') === 'true';
		shelf.querySelectorAll('.issue').forEach(function (x) { x.setAttribute('aria-expanded', 'false'); });
		if (open) { card.hidden = true; return; }
		b.setAttribute('aria-expanded', 'true');
		var S = window.WorksShared, s = S.anySeries(this.issueSeries).s;
		var is = S.seriesIssues(this.issueSeries)[+b.getAttribute('data-i')];
		var chars = (is.chars || []).map(App.charLink).filter(Boolean);
		card.innerHTML =
			'<h4>' + tx(is.title) + '</h4>' +
			'<p class="sub">' + e(App.alt(is.title)) + '</p>' +
			'<p class="meta">' + tx(s.title) + (is.n != null ? ' — ' + App.L('العدد ', 'Issue ') + e(App.num(is.n)) : '') + (is.year ? ' · ' + e(App.num(is.year)) : '') + '</p>' +
			(is.note ? '<p class="meta">' + tx(is.note) + '</p>' : '') +
			(chars.length ? '<p class="meta">' + App.L('يظهر فيه: ', 'Featuring: ') + chars.join(App.L('، ', ', ')) + '</p>' : '') +
			'<a class="more-link" href="' + App.issueHref(s.id, is) + '">' + App.L('صفحة العدد ←', 'Issue page →') + '</a> ' +
			App.fixLink(App.t(s.title) + (is.n != null ? ' #' + is.n : ' — ' + App.t(is.title)));
		card.hidden = false;
	},

	/* #s-id opens a series book, #w-id opens a hardcover, #i-series-n pulls an issue */
	onHash: function () {
		var self = this, App = window.App;
		var m = /^#i-([a-z]+)-(\d+)(?:-\d)?$/.exec(location.hash);
		if (m && m[1] !== this.issueSeries && window.WorksShared.seriesIssues(m[1]).length) { this.issueSeries = m[1]; this.renderIssues(); }
		App.focusHash(function (el, id) {
			if (id.indexOf('w-') === 0) {
				if (el.hidden) { self.filter = 'all'; self.applyFilter(); }
				var hc = el.querySelector('.hc');
				document.querySelectorAll('.hc.is-open').forEach(function (x) { x.classList.remove('is-open'); });
				if (hc) setTimeout(function () { hc.classList.add('is-open'); }, 500);
			} else if (id.indexOf('s-') === 0) {
				var btn = el.querySelector('.bk-bookview');
				if (btn && !btn.classList.contains('bk-active')) setTimeout(function () { btn.click(); }, 500);
			} else if (id.indexOf('i-') === 0) {
				if (el.getAttribute('aria-expanded') !== 'true') self.openIssue(el);
			}
		});
	},

	/* the wall of books at the top (assets/js/mosaic.js) */
	renderMosaic: function () {
		if (window.Mosaic) window.Mosaic.render();
	}
};

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

		/* series — showcase books */
		var seriesEl = document.getElementById('series');
		seriesEl.innerHTML = S.ownSeries().map(function (s) { return window.Books.showcase(S.seriesBook(s)); }).join('');

		/* series by others that he wrote or translated for */
		var contrib = S.contributedSeries();
		document.getElementById('contrib-section').hidden = !contrib.length;
		document.getElementById('contrib').innerHTML = contrib.map(function (o) {
			var n = S.seriesIssues(o.id).length;
			return '<a class="cover-link" href="' + S.seriesHref(o.id) + '">' +
				S.miniCover({ color: o.color, title: t(o.title), sub: o.owner ? t(o.owner) : '', by: o.role ? t(o.role) : ' ' }) +
				'<span class="cl-t">' + tx(o.title) + (n ? ' · ' + App.num(n) + App.L(' عنوانًا', ' titles') : '') + '</span></a>';
		}).join('');
		window.Books.initShowcase(seriesEl);

		this.renderIssues();

		/* standalone books — hardcovers, sorted by year */
		var works = (d.works || []).slice().sort(function (a, b) { return (a.year || 9999) - (b.year || 9999); });
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
			return '<li class="hc-item rise" id="w-' + e(w.id) + '" data-type="' + e(w.type) + '">' +
				window.Books.hardcover({ color: w.color, title: w.title, year: w.year, typeLabel: typeLabel, ribbon: w.ribbon }) +
				'<div class="hc-caption">' +
					'<div class="type">' + e(typeLabel) + (w.year ? ' · ' + App.num(w.year) : '') + '</div>' +
					'<h3><a href="book.html?id=' + e(w.id) + '" style="color:inherit">' + tx(w.title) + '</a></h3>' +
					'<p class="sub">' + e(App.alt(w.title)) + (w.publisher && t(w.publisher) ? ' — ' + tx(w.publisher) : '') + '</p>' +
					'<p>' + tx(w.synopsis) + '</p>' +
					(w.note && t(w.note) ? '<div class="note">' + tx(w.note) + '</div>' : '') +
					S.charXref(w.id) +
					'<a class="more-link" href="book.html?id=' + e(w.id) + '">' + App.L('تفاصيل الكتاب والطبعات ←', 'Book details & editions →') + '</a> ' +
					App.fixLink(t(w.title)) +
				'</div>' +
			'</li>';
		}).join('');
		if (!booksEl._wired) { window.Books.initHardcovers(booksEl); booksEl._wired = true; }

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
		document.getElementById('adaptations').innerHTML = ad.map(function (a) {
			var src = App.findWork(a.basedOn);
			return '<article class="adapt rise">' +
				'<div class="kind">' + tx(a.kind) + '</div>' +
				'<h3>' + tx(a.title) + '</h3>' +
				'<div class="yr">' + App.num(a.year || '') + (src ? ' · ' + App.L('عن ', 'from ') + App.workLink(a.basedOn) : '') + '</div>' +
				'<p>' + tx(a.text) + '</p>' +
			'</article>';
		}).join('');

		this.onHash();
	},

	/* ---------- every issue, as spines on a shelf ---------- */
	renderIssues: function () {
		var App = window.App, d = App.data(), e = App.esc, tx = App.tx, S = window.WorksShared, self = this;
		var issues = d.issues || {};
		var ids = S.ownSeries().map(function (s) { return s.id; }).filter(function (id) { return (issues[id] || []).length; });
		var section = document.getElementById('issues-section');
		section.hidden = !ids.length;
		if (!ids.length) return;
		if (ids.indexOf(this.issueSeries) < 0) this.issueSeries = ids[0];

		var tabs = document.getElementById('issue-tabs');
		tabs.setAttribute('aria-label', App.L('اختر السلسلة', 'Choose a series'));
		tabs.innerHTML = ids.map(function (id) {
			var s = App.byId(d.series, id);
			return '<button type="button" class="chip" data-s="' + e(id) + '" aria-pressed="' + (id === self.issueSeries) + '">' + tx(s.title) + '<span class="count">' + App.num(issues[id].length) + '</span></button>';
		}).join('');
		tabs.onclick = function (ev) {
			var b = ev.target.closest('.chip');
			if (!b) return;
			self.issueSeries = b.getAttribute('data-s');
			self.renderIssues();
		};

		var s = App.byId(d.series, this.issueSeries);
		var list = issues[this.issueSeries].slice().sort(function (a, b) { return a.n - b.n || (a.part || 0) - (b.part || 0); });
		var shelf = document.getElementById('issues');
		shelf.style.setProperty('--c', s.color || '#3a1414');
		shelf.innerHTML = list.map(function (is, i) {
			var h = 150 + ((is.n * 29) % 46);
			return '<button type="button" class="issue" id="i-' + e(s.id) + '-' + e(is.n) + (is.part ? '-' + is.part : '') + '" data-i="' + i + '" aria-expanded="false" aria-controls="issue-card" style="--h:' + h + 'px">' +
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
		var s = App.byId(d.series, this.issueSeries);
		var is = d.issues[this.issueSeries].slice().sort(function (a, c) { return a.n - c.n || (a.part || 0) - (c.part || 0); })[+b.getAttribute('data-i')];
		var chars = (is.chars || []).map(App.charLink).filter(Boolean);
		card.innerHTML =
			'<h4>' + tx(is.title) + '</h4>' +
			'<p class="sub">' + e(App.alt(is.title)) + '</p>' +
			'<p class="meta">' + tx(s.title) + ' — ' + App.L('العدد ', 'Issue ') + e(App.num(is.n)) + (is.year ? ' · ' + e(App.num(is.year)) : '') + '</p>' +
			(chars.length ? '<p class="meta">' + App.L('يظهر فيه: ', 'Featuring: ') + chars.join(App.L('، ', ', ')) + '</p>' : '') +
			'<a class="more-link" href="' + App.issueHref(s.id, is) + '">' + App.L('صفحة العدد ←', 'Issue page →') + '</a> ' +
			App.fixLink(App.t(s.title) + ' #' + is.n);
		card.hidden = false;
	},

	/* #s-id opens a series book, #w-id opens a hardcover, #i-series-n pulls an issue */
	onHash: function () {
		var self = this, App = window.App;
		var m = /^#i-([a-z]+)-(\d+)(?:-\d)?$/.exec(location.hash);
		if (m && m[1] !== this.issueSeries && (App.data().issues || {})[m[1]]) { this.issueSeries = m[1]; this.renderIssues(); }
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
	}
};

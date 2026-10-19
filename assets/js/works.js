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
		booksTitle: { ar: 'الكتب المستقلة', en: 'Standalone books' },
		booksHint: { ar: 'مرّر المؤشر على الكتاب (أو المسه) لينفتح.', en: 'Hover over a book (or tap it) to open it.' },
		adaptTitle: { ar: 'على الشاشة', en: 'On screen' },
		adaptHint: { ar: 'أعمال تحوّلت إلى مسلسلات وأفلام.', en: 'Works adapted for television and film.' }
	},
	filter: 'all',

	render: function () {
		var App = window.App, d = App.data(), e = App.esc, t = App.t, tx = App.tx;
		var S = window.WorksShared, self = this;

		/* series — showcase books */
		var seriesEl = document.getElementById('series');
		seriesEl.innerHTML = (d.series || []).map(function (s) { return window.Books.showcase(S.seriesBook(s)); }).join('');
		window.Books.initShowcase(seriesEl);

		/* standalone books — hardcovers, sorted by year */
		var works = (d.works || []).slice().sort(function (a, b) { return (a.year || 9999) - (b.year || 9999); });
		var types = [];
		works.forEach(function (w) { if (types.indexOf(w.type) < 0) types.push(w.type); });

		var chips = [{ id: 'all', label: { ar: 'الكل', en: 'All' }, n: works.length }].concat(types.map(function (ty) {
			return { id: ty, label: S.TYPES[ty] || { ar: ty, en: ty }, n: works.filter(function (w) { return w.type === ty; }).length };
		}));
		var filters = document.getElementById('filters');
		filters.setAttribute('aria-label', App.lang === 'ar' ? 'تصفية حسب النوع' : 'Filter by type');
		filters.innerHTML = chips.map(function (c) {
			return '<button type="button" class="chip" data-f="' + e(c.id) + '" aria-pressed="' + (self.filter === c.id) + '">' + tx(c.label) + '<span class="count">' + App.num(c.n) + '</span></button>';
		}).join('');

		var booksEl = document.getElementById('books');
		booksEl.innerHTML = works.map(function (w) {
			var typeLabel = t(S.TYPES[w.type] || { ar: w.type, en: w.type });
			return '<li class="hc-item rise" data-type="' + e(w.type) + '">' +
				window.Books.hardcover({ color: w.color, title: w.title, year: w.year, typeLabel: typeLabel, ribbon: w.ribbon }) +
				'<div class="hc-caption">' +
					'<div class="type">' + e(typeLabel) + (w.year ? ' · ' + App.num(w.year) : '') + '</div>' +
					'<h3>' + tx(w.title) + '</h3>' +
					'<p class="sub">' + e(App.alt(w.title)) + (w.publisher ? ' — ' + tx(w.publisher) : '') + '</p>' +
					'<p>' + tx(w.synopsis) + '</p>' +
					(w.note && t(w.note) ? '<div class="note">' + tx(w.note) + '</div>' : '') +
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
				'<div class="yr">' + App.num(a.year || '') + (src ? ' · ' + (App.lang === 'ar' ? 'عن ' : 'from ') + tx(src.title) : '') + '</div>' +
				'<p>' + tx(a.text) + '</p>' +
			'</article>';
		}).join('');
	}
};

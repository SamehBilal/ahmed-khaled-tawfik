/* clinic.html — «عيادة سافاري»: Safari's 53 issues as Dr Alaa Abdel Azim's case files — the disease, the tribe or place, the
   experiment or the mystery of each, from its back cover (AKT.safariCases, data-pages.js; series-file.js draws the cards), with a
   short medical note for the diseases it names. */
window.PAGE = {
	id: 'clinic',
	title: { ar: 'عيادة سافاري', en: 'The Safari clinic' },
	strings: {
		eyebrow: { ar: 'من عالم «سافاري»', en: 'From Safari' },
		title: { ar: 'عيادة سافاري', en: 'The Safari clinic' },
		lead: {
			ar: 'ملفات د. علاء عبد العظيم في الكاميرون: المرض أو القبيلة أو التجربة أو اللغز في كل عدد كما يقول غلافه الخلفي، ونبذة طبية عن الأمراض التي يسمّيها.',
			en: 'Dr Alaa Abdel Azim’s files from Cameroon: the disease, the tribe, the experiment or the mystery of each issue as its back cover gives it, with a medical note on the diseases it names.'
		}
	},
	KINDS: [['disease', { ar: 'أمراض وأوبئة', en: 'Diseases' }], ['people', { ar: 'قبائل وأماكن', en: 'Peoples & places' }], ['science', { ar: 'علم وتجارب', en: 'Science & experiments' }],
		['mystery', { ar: 'جرائم وألغاز', en: 'Crimes & mysteries' }], ['life', { ar: 'حياة علاء', en: 'Alaa’s life' }], ['unknown', { ar: 'لم نعرف بعد', en: 'Not known yet' }]],

	/* the band: a heart monitor in the dark — its trace running across and beating, and over it, as the monitor's readings, the
	   diseases the series names; one lights with the pointer and leads to its card */
	band: function (d, A) {
		var S = window.WorksShared, e = A.esc, t = A.t, self = window.PAGE, by = {};
		S.seriesIssues('safari').forEach(function (is) { if (!by[is.n]) by[is.n] = is; });
		var beat = 'l 40 0 l 8 -10 l 8 10 l 14 0 l 6 18 l 10 -86 l 10 96 l 8 -28 l 12 0 l 10 -14 l 12 14 l 42 0';
		var path = 'M 0 120 ' + Array.apply(null, Array(9)).map(function () { return beat; }).join(' ');
		var tags = (d.safariCases || []).filter(function (x) { return x.kind === 'disease' && x.case && by[x.n]; }).map(function (x, i) {
			return '<a class="cl-read" href="#safari-' + x.n + '" style="--i:' + i + '"><b>' + e(A.num(x.n)) + '</b>' + e(t(x.name || x.case)) + '</a>';
		}).join('');
		setTimeout(function () { self.bandWire(); }, 0);
		return '<div class="cl-grid"></div><svg class="cl-trace" viewBox="0 0 1620 200" preserveAspectRatio="none" aria-hidden="true"><path d="' + path + '"/><path class="cl-glow" d="' + path + '"/></svg>' +
			'<div class="cl-reads">' + tags + '</div><span class="cl-bpm" aria-hidden="true">♥ 72</span>';
	},
	bandWire: function () {
		var box = document.querySelector('.cl-reads');
		if (!box || box.getAttribute('data-on')) return;
		box.setAttribute('data-on', '1');
		var ph = box.closest('.ph');
		if (ph) ph.removeAttribute('aria-hidden');
		box.addEventListener('click', function (ev) {
			var a = ev.target.closest('.cl-read');
			if (!a) return;
			ev.preventDefault();
			var id = a.getAttribute('href').slice(1), card = document.getElementById(id);
			if (!card) { var all = document.querySelector('.sf-bar [data-k="all"]'); if (all) all.click(); card = document.getElementById(id); }
			if (card) {
				card.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'center' });
				card.classList.remove('is-target'); void card.offsetWidth; card.classList.add('is-target');
				history.replaceState(null, '', '#' + id);
			}
		});
	},

	render: function () {
		window.SeriesFile.render(this, {
			sid: 'safari', field: 'case', kinds: this.KINDS,
			list: function () { return window.App.data().safariCases || []; },
			note: { ar: 'الحالة كما يقولها الغلاف الخلفي لكل عدد (في صفحته)، وما عُلِّم «من عنوانه» مأخوذ من العنوان وحده؛ والنبذة الطبية تعريف عام بالمرض، لا بما في القصة.', en: 'Each case as the issue’s back cover gives it (on its page); those marked «from its title» are from the title alone. The medical notes describe the disease in general, not the story.' }
		});
	}
};

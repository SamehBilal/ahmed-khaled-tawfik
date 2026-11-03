/* worlds.html — «عوالم فانتازيا»: the world each of Fantasia's 64 issues takes Abeer to — a myth, a book, a film or a comic, a
   moment of history, an idea, a game — from its back cover (AKT.fantasiaWorlds, data-pages.js; series-file.js draws the cards). */
window.PAGE = {
	id: 'worlds',
	title: { ar: 'عوالم فانتازيا', en: 'Fantasia’s worlds' },
	strings: {
		eyebrow: { ar: 'من عالم «فانتازيا»', en: 'From Fantasia' },
		title: { ar: 'عوالم فانتازيا', en: 'Fantasia’s worlds' },
		lead: {
			ar: 'في كل عدد تركب عبير القطار إلى أرض الأحلام، فتنزل في أسطورة أو رواية أو فيلم أو لحظة من التاريخ: إلى أين أخذها كل عدد، كما يقول غلافه الخلفي.',
			en: 'In every issue Abeer takes the train to the land of dreams and steps off into a legend, a novel, a film or a moment of history: where each issue took her, as its back cover says.'
		}
	},
	KINDS: [['myth', { ar: 'أساطير وملاحم', en: 'Myths & epics' }], ['lit', { ar: 'أدب وكتّاب', en: 'Books & writers' }], ['screen', { ar: 'سينما وقصص مصوّرة', en: 'Film & comics' }],
		['history', { ar: 'تاريخ وأعلام', en: 'History' }], ['mind', { ar: 'علم وفكر', en: 'Science & ideas' }], ['play', { ar: 'ألعاب وألغاز', en: 'Games & riddles' }],
		['own', { ar: 'من عوالم مصرية', en: 'Egyptian worlds' }], ['unknown', { ar: 'لم نعرف بعد', en: 'Not known yet' }]],

	/* the band: Abeer's train to Fantasia («إن صفير القطار يدوي، والبخار يتصاعد حول قاطرته»: the back cover of «من أجل طروادة»),
	   an engine and its carriages crossing the dark slowly, a cover in each window; under the pointer the train waits and the
	   carriage says where it goes; a click leads to its card */
	band: function (d, A) {
		var S = window.WorksShared, e = A.esc, t = A.t, self = window.PAGE, by = {};
		S.seriesIssues('fantasia').forEach(function (is) { if (!by[is.n]) by[is.n] = is; });
		var cars = (d.fantasiaWorlds || []).filter(function (x) { return x.world && by[x.n] && S.issueCover('fantasia', by[x.n]); })
			.filter(function (x, i) { return i % 4 === 0; }).slice(0, 12).map(function (x) {
				var is = by[x.n];
				return '<a class="wt-car" href="#fantasia-' + x.n + '"><span class="wt-win"><img src="' + e(A.thumb(S.issueCover('fantasia', is))) + '" alt="" loading="lazy"></span>' +
					'<span class="wt-tag">' + e(A.num(x.n) + ' · ' + t(is.title)) + '</span><i class="wt-w"></i><i class="wt-w"></i></a>';
			}).join('');
		var engine = '<span class="wt-engine" aria-hidden="true"><i class="wt-stack"></i><i class="wt-puff"></i><i class="wt-puff"></i><i class="wt-puff"></i><i class="wt-cab"></i><i class="wt-w big"></i><i class="wt-w big"></i><i class="wt-w"></i></span>';
		setTimeout(function () { self.bandWire(); }, 0);
		/* (the train twice over, so it never ends) */
		return '<div class="wt-sky"></div><div class="wt-run"><div class="wt-train">' + engine + cars + '</div><div class="wt-train" aria-hidden="true">' + engine + cars + '</div></div><i class="wt-rail"></i>';
	},
	bandWire: function () {
		var run = document.querySelector('.wt-run');
		if (!run || run.getAttribute('data-on')) return;
		run.setAttribute('data-on', '1');
		var ph = run.closest('.ph');
		if (ph) ph.removeAttribute('aria-hidden');
		run.addEventListener('click', function (ev) {
			var a = ev.target.closest('.wt-car');
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

	/* «خط زمن فانتازيا»: the worlds of history and legend in the order they are set, from Gilgamesh to Che Guevara (their year
	   and era in AKT.fantasiaWorlds), a cover at each stop, each to its card; in order, not to scale (the span is nearly five
	   thousand years) */
	timeline: function () {
		var App = window.App, S = window.WorksShared, e = App.esc, t = App.t, L = App.L, by = {};
		S.seriesIssues('fantasia').forEach(function (is) { if (!by[is.n]) by[is.n] = is; });
		var list = (App.data().fantasiaWorlds || []).filter(function (x) { return x.year != null && by[x.n]; }).sort(function (a, b) { return a.year - b.year; });
		if (!list.length) return '';
		return '<section class="section wl" id="timeline"><div class="wrap"><h2 class="wl-h">' + e(L('خط زمن فانتازيا', 'Fantasia’s timeline')) + '</h2>' +
			'<p class="wl-lead">' + e(L('العوالم التاريخية والأسطورية التي زارتها عبير بترتيب زمنها، من جلجاميش إلى تشي جيفارا: نحو خمسة آلاف عام في ' + App.num(list.length) + ' عددًا.', 'The worlds of history and legend Abeer visited, in the order they are set, from Gilgamesh to Che Guevara: nearly five thousand years in ' + list.length + ' issues.')) + '</p>' +
			'<ol class="wl-line">' + list.map(function (x) {
				var is = by[x.n];
				return '<li><a href="#fantasia-' + x.n + '" class="wl-stop"><span class="wl-era">' + e(t(x.era)) + '</span><i class="wl-dot"></i>' +
					'<span class="wl-cv">' + S.miniCover({ img: S.issueCover('fantasia', is), color: '#3a1414', title: t(is.title), num: App.num(is.n) }) + '</span>' +
					'<b>' + e(t(is.title)) + '</b></a></li>';
			}).join('') + '</ol></div></section>';
	},

	render: function () {
		window.SeriesFile.render(this, {
			sid: 'fantasia', field: 'world', kinds: this.KINDS, before: this.timeline(),
			list: function () { return window.App.data().fantasiaWorlds || []; },
			note: { ar: 'العالم كما يقوله الغلاف الخلفي لكل عدد (في صفحته)، وما عُلِّم «من عنوانه» مأخوذ من العنوان وحده.', en: 'Each world as the issue’s back cover gives it (on its page); those marked «from its title» are from the title alone.' }
		});
	}
};

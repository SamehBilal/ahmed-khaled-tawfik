/* compare.html — «السلاسل جنبًا إلى جنب»: his pocket series in one table — who tells each, its years and issues, the first and
   the last, its house, what is heard of it on Audiohat and Storytel, the legends and figures in it, the screen, and how it
   ended — all counted from the data (AKT.series, the issues, AKT.audio, AKT.creatures, AKT.storyPeople, AKT.adaptations,
   AKT.seriesEndings). (The enemies his heroes meet are on each series' page now.) The band is the series' lives side by side,
   a lane each from first year to last. */
window.PAGE = {
	id: 'compare',
	title: { ar: 'السلاسل جنبًا إلى جنب', en: 'The series side by side' },
	strings: {
		eyebrow: { ar: 'من البيانات', en: 'From the data' },
		title: { ar: 'السلاسل جنبًا إلى جنب', en: 'The series side by side' },
		lead: {
			ar: '«ما وراء الطبيعة» و«فانتازيا» و«سافاري» و«WWW» و«روايات عالمية» وأخواتها في جدول واحد: من يرويها، وكم عددًا، ومتى بدأت وانتهت، وما يُسمع منها، وكيف انتهت.',
			en: 'Paranormal, Fantasia, Safari, WWW, World Pocket Novels and the rest in one table: who tells each, how many issues, when it began and ended, what can be heard of it, and how it ended.'
		}
	},
	/* (with «روايات عالمية للجيب», the line of world novels he translated from its 7th issue, its issues in AKT.otherSeries) */
	SERIES: ['mwt', 'fantasia', 'safari', 'www', 'rwg', 'shivers', 'specials'],
	FROM: 1992, TO: 2019,
	who: 'all',

	years: function (s) {
		var m = String(s.years || '').match(/(\d{4})\D+(\d{4})/) || String(s.years || '').match(/(\d{4})/);
		if (m) return [+m[1], +(m[2] || m[1])];
		/* a series whose own years are not known: from the first to the last of its issues that are dated («روايات عالمية للجيب») */
		var d = this.dated(s);
		return d ? [d.from.year, d.to.year] : null;
	},
	dated: function (s) {
		var S = window.WorksShared, list = S ? S.seriesIssues(s.id).filter(function (is) { return is.year; }) : [];
		return list.length ? { from: list[0], to: list[list.length - 1] } : null;
	},

	/* the band: a lane each, from its first year to its last, as many marks along it as it has issues */
	band: function (d, A) {
		var self = window.PAGE, e = A.esc, t = A.t, span = self.TO - self.FROM;
		var lanes = self.SERIES.map(function (id) { return (d.series || []).filter(function (s) { return s.id === id; })[0]; }).filter(function (s) { return s && self.years(s); });
		var ticks = [1995, 2000, 2005, 2010, 2015];
		return '<div class="cp-lanes" style="--n:' + lanes.length + '">' +
			ticks.map(function (y) { return '<span class="cp-tick" style="--x:' + ((y - self.FROM) / span * 100).toFixed(2) + '%">' + e(A.num(y)) + '</span>'; }).join('') +
			lanes.map(function (s, i) {
				var y = self.years(s), n = s.count || (window.WorksShared ? window.WorksShared.seriesIssues(s.id).length : ((d.issues || {})[s.id] || []).length), end = (y[1] + 1 - self.FROM) / span;
				return '<a class="cp-lane' + (end > 0.72 ? ' is-in' : '') + '" href="#col-' + e(s.id) + '" style="--a:' + ((y[0] - self.FROM) / span * 100).toFixed(2) + '%;--w:' + (Math.max(1, y[1] - y[0] + 1) / span * 100).toFixed(2) + '%;--c:' + e(s.color || '#7a2a1a') + ';--i:' + i + ';--k:' + Math.min(n, 90) + '">' +
					'<span class="cp-bar"></span><b>' + e(t(s.title)) + ' <small>' + e(A.num(n)) + '</small></b></a>';
			}).join('') + '</div>';
	},

	render: function () {
		var App = window.App, e = App.esc, L = App.L, t = App.t, S = window.WorksShared, d = App.data(), self = this;
		var list = this.SERIES.map(function (id) { return (d.series || []).filter(function (s) { return s.id === id; })[0]; }).filter(Boolean);
		var chars = {}; (d.characters || []).forEach(function (c) { chars[c.id] = c; });
		var ofSeries = function (arr, id, key) { return (arr || []).filter(function (x) { return (x[key || 'issues'] || []).some(function (k) { return String(k).indexOf(id + '-') === 0; }); }); };
		var keys = function (o, id) { return Object.keys(o || {}).filter(function (k) { return k.indexOf(id + '-') === 0; }).length; };
		/* (by its place in the list, so the last issue's second part is the last, not its first) */
		var issuesOf = function (sid) { return S.seriesIssues(sid); };
		var other = function (sid) { return App.byId(d.otherSeries, sid) || {}; };
		var cover = function (sid, i) {
			var is = issuesOf(sid)[i];
			return is ? '<a class="cp-cv" href="' + e(App.issueHref(sid, Object.assign({ _idx: i }, is))) + '" title="' + e(t(is.title)) + '">' + S.miniCover({ img: S.issueCover(sid, is), color: '#3a1414', title: t(is.title), num: App.num(is.n) }) + '<span>' + e(App.num(is.n) + ' · ' + t(is.title)) + '</span></a>' : '';
		};
		var none = '<span class="cp-none">—</span>';
		var ROWS = [
			[L('من يرويها', 'Who tells it'), function (s) {
				var c = chars[s.hero];
				if (c) return '<a href="character.html?id=' + e(c.id) + '">' + e(t(c.name)) + '</a><small>' + e(t(c.role)) + '</small>';
				/* a series of others' novels: his part in it instead */
				return other(s.id).role ? '<small>' + e(t(other(s.id).role)) + '</small>' : none;
			}],
			[L('السنوات', 'Years'), function (s) {
				if (s.years) return e(App.num(s.years));
				var x = self.dated(s);
				return x ? e(App.num(x.from.year) + '–' + App.num(x.to.year)) + '<small>' + e(L('من العدد ' + App.num(x.from.n) + ' إلى ' + App.num(x.to.n) + '، كما أرّختها طبعاتها', 'from #' + x.from.n + ' to #' + x.to.n + ', as their editions date them')) + '</small>' : none;
			}],
			[L('الأعداد', 'Issues'), function (s) {
				var is = issuesOf(s.id), n = s.count || is.length, a = is.length && is[0].n, z = is.length && is[is.length - 1].n;
				/* (where his part began after its first issue, which numbers) */
				return '<b class="cp-big">' + e(App.num(n)) + '</b>' + (a > 1 ? '<small>' + e(L('الأعداد ' + App.num(a) + '–' + App.num(z), '#' + a + '–' + z)) + '</small>' : '');
			}],
			[L('أول عدد', 'First issue'), function (s) { var is = issuesOf(s.id); return is.length ? cover(s.id, 0) : none; }],
			[L('آخر عدد', 'Last issue'), function (s) { var is = issuesOf(s.id); return is.length > 1 ? cover(s.id, is.length - 1) : none; }],
			[L('الناشر', 'Publisher'), function (s) { return s.publisher ? e(t(s.publisher)) : none; }],
			[L('طابعها', 'Its kind'), function (s) { return s.tagline ? e(t(s.tagline)) : none; }],
			[L('مسموعة على Audiohat', 'Heard on Audiohat'), function (s) { var n = keys((d.audio || {}).issues, s.id); return n ? '<a href="audio.html">' + e(App.num(n)) + '</a>' : none; }],
			[L('مسموعة على Storytel', 'Heard on Storytel'), function (s) { var n = keys(((d.audio || {}).storytel || {}).items, s.id); return n ? '<a href="audio.html">' + e(App.num(n)) + '</a>' : none; }],
			[L('وحوش وأساطير', 'Monsters & legends'), function (s) { var n = ofSeries(d.creatures, s.id).length; return n ? '<a href="creatures.html">' + e(App.num(n)) + '</a>' : none; }],
			[L('أعلام حقيقيون', 'Real figures'), function (s) { var n = ofSeries(d.storyPeople, s.id).length; return n ? '<a href="names.html">' + e(App.num(n)) + '</a>' : none; }],
			[L('على الشاشة', 'On screen'), function (s) { var a = (d.adaptations || []).filter(function (x) { return x.basedOn === s.id; }); return a.length ? a.map(function (x) { return '<a href="screen.html">' + e(t(x.title) + ' (' + App.num(x.year) + ')') + '</a>'; }).join('<br>') : none; }],
			[L('النهاية', 'The ending'), function (s) {
				/* (a line of separate novels has no ending of its own to tell) */
				if (s.contributor) return none;
				return (d.seriesEndings || {})[s.id] ? '<a href="series.html?id=' + e(s.id) + '#ending">' + e(L('على صفحتها', 'On its page')) + '</a>' : '<a class="cp-ask" href="wanted.html">' + e(L('لم تُكتب بعد', 'Not written yet')) + '</a>';
			}]
		];
		document.getElementById('content').innerHTML = '<section class="section cp"><div class="wrap">' +
			'<p class="cp-sum">' + e(L('السلاسل ' + (['', '', '', 'الثلاث', 'الأربع', 'الخمس', 'الست', 'السبع', 'الثماني', 'التسع'][list.length] || App.num(list.length)) + ' التي كتبها أو ترجمها في «روايات مصرية للجيب» وغيرها، عمودًا عمودًا. الأرقام من بيانات الموقع، فما لم يُعرف بعد تركناه بشَرطة.', 'The ' + (['', '', '', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'][list.length] || list.length) + ' series he wrote or translated for the Egyptian Pocket Novels and others, a column each. The numbers come from the site’s data; what is not known yet is left as a dash.')) + '</p>' +
			'<div class="cp-scroll" tabindex="0" role="region" aria-label="' + e(L('جدول السلاسل', 'The series table')) + '"><table class="cp-table"><thead><tr><th scope="col"></th>' + list.map(function (s) {
				return '<th scope="col" id="col-' + e(s.id) + '" style="--c:' + e(s.color || '#7a2a1a') + '"><a href="series.html?id=' + e(s.id) + '">' + e(t(s.title)) + '</a></th>';
			}).join('') + '</tr></thead><tbody>' + ROWS.map(function (r) {
				return '<tr><th scope="row">' + e(r[0]) + '</th>' + list.map(function (s) { return '<td>' + r[1](s) + '</td>'; }).join('') + '</tr>';
			}).join('') + '</tbody></table></div>' +
			'<p class="cp-note">' + e(L('على الهاتف اسحب الجدول جانبًا لترى بقية السلاسل.', 'On a phone, swipe the table sideways for the other series.')) + '</p>' +
		'</div></section>';
		App.focusHash();
	}
};

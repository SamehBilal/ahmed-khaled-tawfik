/* creatures.html — «وحوش وأساطير»: the monsters and legends of Ma Wara' al-Tabi'a (AKT.creatures, data-pages.js): for each, the
   folklore or myth behind it, how it comes into his story, and the covers of the issues it appears in. By kind. */
window.PAGE = {
	id: 'creatures',
	title: { ar: 'وحوش وأساطير', en: 'Monsters & legends' },
	strings: {
		eyebrow: { ar: 'من عالم «ما وراء الطبيعة»', en: 'From Ma Wara’ al-Tabi’a' },
		title: { ar: 'وحوش وأساطير', en: 'Monsters & legends' },
		lead: {
			ar: 'مصاصو الدماء والمذءوب والنداهة والمومياء وغيرها: الأسطورة الحقيقية وراء كل منها، وكيف دخلت حكايات رفعت إسماعيل، والأعداد التي تلقاها فيها.',
			en: 'Vampires, the werewolf, the Naddaha, the mummy and the rest: the real legend behind each, how it came into Refaat Ismail’s tales, and the issues where you meet it.'
		}
	},
	KINDS: [['vampire', { ar: 'مصاصو دماء', en: 'Vampires' }], ['undead', { ar: 'موتى لا يموتون', en: 'The undead' }], ['shapeshifter', { ar: 'متحوّلون', en: 'Shapeshifters' }],
		['demon', { ar: 'شياطين', en: 'Demons' }], ['folk', { ar: 'من التراث الشعبي', en: 'Folk legends' }], ['myth', { ar: 'من الأساطير القديمة', en: 'Ancient myths' }],
		['creature', { ar: 'كائنات', en: 'Creatures' }], ['other', { ar: 'ظواهر وألغاز', en: 'Mysteries' }]],
	kind: 'all',

	/* the band: eyes opening in the dark, and the names of what watches */
	band: function (d, A) {
		var e = A.esc, t = A.t, list = (d.creatures || []).slice(0, 14), out = '';
		list.forEach(function (c, i) {
			out += '<span class="cr-eyes" style="left:' + (4 + (i * 53) % 90) + '%;top:' + (12 + (i * 29) % 62) + '%;--d:' + (-(i * 0.8)).toFixed(1) + 's"><i></i><i></i></span>' +
				'<span class="cr-name" style="left:' + (2 + (i * 53 + 17) % 88) + '%;top:' + (20 + (i * 29 + 11) % 64) + '%;--d:' + (-(i * 1.3)).toFixed(1) + 's">' + e(t(c.name)) + '</span>';
		});
		return out;
	},

	render: function () {
		var App = window.App, e = App.esc, L = App.L, self = this, list = App.data().creatures || [];
		var count = {}; list.forEach(function (x) { count[x.kind] = (count[x.kind] || 0) + 1; });
		document.getElementById('content').innerHTML = '<section class="section cx"><div class="wrap">' +
			'<div class="chips cx-bar"><button type="button" class="chip" data-k="all" aria-pressed="true">' + e(L('الكل', 'All')) + ' <b>' + e(App.num(list.length)) + '</b></button>' +
				this.KINDS.filter(function (k) { return count[k[0]]; }).map(function (k) {
					return '<button type="button" class="chip" data-k="' + k[0] + '" aria-pressed="false">' + e(App.t(k[1])) + ' <b>' + e(App.num(count[k[0]])) + '</b></button>';
				}).join('') + '</div>' +
			'<div class="cx-grid"></div>' +
			'<p class="cx-note">' + e(L('الأسطورة كما يرويها التراث أو الموسوعات، والحكاية كما في أعداده؛ المصدر تحت كل بطاقة.', 'The legend as folklore or the encyclopaedias tell it, the tale as his issues do; the source is under each card.')) + '</p>' +
		'</div></section>';
		document.querySelector('.cx-bar').onclick = function (ev) {
			var b = ev.target.closest('[data-k]');
			if (!b) return;
			self.kind = b.getAttribute('data-k');
			document.querySelectorAll('.cx-bar [data-k]').forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
			self.list();
		};
		this.list();
	},

	list: function () {
		var App = window.App, S = window.WorksShared, e = App.esc, t = App.t, L = App.L, self = this;
		var kindName = {}; this.KINDS.forEach(function (k) { kindName[k[0]] = k[1]; });
		var issues = S.seriesIssues('mwt'), byKey = {};
		issues.forEach(function (is, i) { byKey[decodeURIComponent(App.issueHref('mwt', Object.assign({ _idx: i }, is)).replace(/^book\.html\?id=/, ''))] = [is, i]; });
		var list = (App.data().creatures || []).filter(function (x) { return self.kind === 'all' || x.kind === self.kind; });
		document.querySelector('.cx-grid').innerHTML = list.map(function (c) {
			var covers = (c.issues || []).map(function (k) {
				var hit = byKey[k];
				if (!hit) return '';
				return '<a href="' + e(App.issueHref('mwt', Object.assign({ _idx: hit[1] }, hit[0]))) + '" title="' + e(App.num(hit[0].n) + ' · ' + t(hit[0].title)) + '">' +
					S.miniCover({ img: S.issueCover('mwt', hit[0]), color: '#3a1414', title: t(hit[0].title), num: App.num(hit[0].n) }) + '</a>';
			}).join('');
			return '<article class="cx-card" id="' + e(c.id) + '"><p class="cx-kind">' + e(t(kindName[c.kind] || { ar: '', en: '' })) + '</p><h3>' + e(t(c.name)) + '</h3>' +
				'<h4>' + e(L('الأسطورة', 'The legend')) + '</h4><p>' + e(t(c.lore)) + '</p>' +
				'<h4>' + e(L('في حكاياته', 'In his tales')) + '</h4><p>' + e(t(c.inBooks)) + '</p>' +
				(covers ? '<div class="cx-covers">' + covers + '</div>' : '') +
				(c.source ? '<a class="cx-src" href="' + e(c.source) + '" target="_blank" rel="noopener">' + e(L('المصدر ↗', 'Source ↗')) + '</a>' : '') + '</article>';
		}).join('');
	}
};

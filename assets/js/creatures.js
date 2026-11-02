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

	/* the band: the creatures that have a shape of their own, as silhouettes standing in a row in the dark, their eyes opening
	   now and then; each one's name over it under the pointer, leading to its card. The drawings: [id, viewBox width, path,
	   eyes [[x, y]…]] on a ground 150 high (a shape's eyes are where its head is) */
	SIL: [
		['ghost', 90, 'M45 12C22 12 12 32 12 58V138l11-10 11 12 11-12 11 12 11-12 11 10V58C78 32 68 12 45 12z', [[36, 50], [54, 50]]],
		['frankenstein', 96, 'M30 10h36v8h4v30h-6v8h22l6 6v52h-8v-40h-4v56H72v20H56v-20h-16v20H24v-20h-8V64h-4v40H4V62l6-6h22v-8h-6V18h4z', [[39, 32], [57, 32]]],
		['dracula', 130, 'M65 8c-9 0-15 7-15 16 0 6 3 11 7 13l-15 4L6 18l8 30-6 4 12 6-8 8 16 2 4 60h24l2 22h12l2-22h24l4-60 16-2-8-8 12-6-6-4 8-30-36 23-15-4c4-2 7-7 7-13 0-9-6-16-15-16z', [[59, 22], [71, 22]]],
		['werewolf', 120, 'M58 6l6 16 8-12 4 18c10 4 16 12 18 22l20 6-16 6c0 8-6 14-14 16l4 14 12 30 6 28H88l-6-26-8 26H52l-6-30c-10-2-16-10-16-20l-8 18-14 6 6-12 10-26c4-12 12-20 22-24l-4-18 8 10z', [[64, 34], [76, 36]]],
		['mummy', 104, 'M44 8c-9 0-15 7-15 17 0 7 4 12 9 15l-14 6v8l58-2 18 4v-8l-22-6-12-2c5-3 8-8 8-15 0-10-6-17-15-17zM24 54l-4 50h10l4-40 2 48-4 38h18l4-30 4 30h18l-4-38 2-48z', [[38, 24], [50, 24]]],
		['minotaur', 130, 'M18 6c4 14 14 22 28 24l4 8c-4 6-4 14 2 20l-10 4-22 6-8 42h12l8-30 6 32-4 38h22l4-34 4 34h22l-4-38 6-32 8 30h12l-8-42-22-6-10-4c6-6 6-14 2-20l4-8c14-2 24-10 28-24-10 8-22 12-34 12h-6c-6-6-14-6-20 0h-6c-12 0-24-4-34-12z', [[57, 38], [73, 38]]],
		['witch', 112, 'M58 2L44 40H26l8 6c-2 8 0 14 6 18l-8 4 6 4-18 76h28l4-28 6 28h28l-14-62 22 12 8-6-26-18c4-6 4-12 2-18h18l-18-6z', [[44, 52], [53, 52]]],
		['yeti', 130, 'M64 8c-12 0-20 9-20 20l-14 8c-10 6-16 18-18 32l-6 40 12 4 6-30 4 30-6 36h28l4-24 6 24h28l-6-36 4-30 6 30 12-4-6-40c-2-14-8-26-18-32l-14-8c0-11-8-20-20-20z', [[57, 26], [71, 26]]],
		['medusa', 120, 'M60 34c-12 0-22 10-22 24 0 12 8 22 18 24l-4 10-24 8-6 50h76l-6-50-24-8-4-10c10-2 18-12 18-24 0-14-10-24-22-24zM40 40c-10-6-20-4-26 4 8-4 16-2 22 4zM42 32c-6-12-16-16-26-14 10 2 16 8 20 16zM56 30c0-12-6-20-16-24 6 6 10 14 10 24zM66 30c2-12 8-20 18-22-6 6-10 14-12 22zM78 36c8-10 18-12 28-8-10 0-18 4-24 12zM82 48c10-4 20 0 24 8-8-4-16-4-22 0z', [[53, 56], [67, 56]]],
		['loch-ness', 170, 'M18 64c-2-14 8-26 22-26 10 0 16 6 16 16 0 4-2 8-4 10l-6 20c8 0 14 8 16 18l4 28h-10l-4-18-10-8-10 26H2l10-30c4-14 6-26 6-36zM90 150c0-18 12-30 26-30s26 12 26 30zM146 150c0-10 8-18 16-18s8 8 8 18z', [[34, 50]]],
		['man-eating-plant', 110, 'M40 150l6-30h22l6 30zM56 120c-2-18 0-32 6-44l-8-4c-16 4-30-2-38-14 12 4 24 2 32-6-8-4-12-12-12-22 10 2 18 8 22 16 4-10 12-16 22-18-2 12-8 20-18 24l12 8c-8 14-10 30-8 50zM8 92c8-10 20-12 30-6-10 2-18 6-24 12zM104 84c-8-10-20-12-30-6 10 2 18 6 24 12z', [[38, 46], [48, 44]]],
		['haunted-house', 160, 'M28 150V78l-12 6 52-46 14 12V24h14v38l42 22-12-6v72H92v-30H70v30zM46 92h14v16H46zM104 92h14v16h-14zM118 24l10-20 10 20v18h-20z', [[53, 100], [111, 100]]]
	],
	band: function (d, A) {
		var e = A.esc, t = A.t, self = window.PAGE, by = {};
		(d.creatures || []).forEach(function (c) { by[c.id] = c; });
		setTimeout(function () { self.bandWire(); }, 0);
		return '<div class="cr-row">' + self.SIL.filter(function (s) { return by[s[0]]; }).map(function (s, i) {
			var c = by[s[0]], h = [132, 112, 140, 124, 118, 138, 120, 134, 116, 92, 104, 128][i % 12];
			return '<a class="cr-sil" href="#' + e(c.id) + '" style="--w:' + s[1] + ';--h:' + h + ';--d:' + (-(i * 1.7) % 9).toFixed(1) + 's" aria-label="' + e(t(c.name)) + '">' +
				'<span class="cr-tag">' + e(t(c.name)) + '</span>' +
				'<svg viewBox="0 0 ' + s[1] + ' 150" preserveAspectRatio="xMidYMax meet" aria-hidden="true"><path d="' + s[2] + '"/>' +
				s[3].map(function (p) { return '<circle class="cr-eye" cx="' + p[0] + '" cy="' + p[1] + '" r="2.6"/>'; }).join('') + '</svg></a>';
		}).join('') + '</div><i class="cr-ground"></i>';
	},
	/* a silhouette leads to its card, the filter let go first if it hides it */
	bandWire: function () {
		var row = document.querySelector('.cr-row');
		if (!row || row.getAttribute('data-on')) return;
		row.setAttribute('data-on', '1');
		var ph = row.closest('.ph');
		if (ph) ph.removeAttribute('aria-hidden'); /* (its shapes are links) */
		row.addEventListener('click', function (ev) {
			var a = ev.target.closest('.cr-sil'), id = a && a.getAttribute('href').slice(1), card = id && document.getElementById(id);
			if (!a) return;
			ev.preventDefault();
			if (!card) { var all = document.querySelector('.cx-bar [data-k="all"]'); if (all) all.click(); card = document.getElementById(id); }
			if (card) { card.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'center' }); history.replaceState(null, '', '#' + id); }
		});
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

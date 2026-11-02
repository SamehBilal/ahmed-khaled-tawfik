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

	/* the band: the creatures that have a shape of their own, as silhouettes standing in a row in the dark, a glow in their
	   eyes (or the windows) now and then; each one's name under it with the pointer, leading to its card. Each: [id, width,
	   height, picture or path, eyes [[x, y]…], how tall it stands (of 150)]. Most are pictures cut out to their shape
	   (assets/img/creatures, from silhouettes the site's owner chose), painted in the page's own shade through an alpha mask;
	   a path drawn here would do as well */
	SIL: [
		['haunted-house', 358, 360, 'img', [], 140], ['man-eating-plant', 252, 360, 'img', [], 108], ['loch-ness', 471, 163, 'img', [], 62],
		['medusa', 144, 360, 'img', [], 132], ['yeti', 367, 360, 'img', [], 124], ['witch', 223, 272, 'img', [], 118],
		['minotaur', 346, 360, 'img', [[262, 81]], 136],
		['mummy', 119, 360, 'img', [[51, 25], [63, 25]], 118],
		['werewolf', 289, 360, 'img', [], 140], ['dracula', 422, 360, 'img', [], 128],
		['frankenstein', 156, 360, 'img', [], 122],
		['ghost', 197, 360, 'img', [[88, 24], [102, 24]], 132]
	],
	band: function (d, A) {
		var e = A.esc, t = A.t, self = window.PAGE, by = {};
		(d.creatures || []).forEach(function (c) { by[c.id] = c; });
		setTimeout(function () { self.bandWire(); }, 0);
		return '<div class="cr-row">' + self.SIL.filter(function (s) { return by[s[0]]; }).map(function (s, i) {
			var c = by[s[0]], w = s[1], h = s[2], img = s[3] === 'img', r = (h / 90).toFixed(1);
			/* a picture paints the page's shade through itself (its alpha); the house's windows let a warm light through */
			var shape = img
				? '<mask id="crm-' + c.id + '" style="mask-type:alpha"><image href="assets/img/creatures/' + c.id + '.webp" width="' + w + '" height="' + h + '"/></mask>' +
					/* (its windows: the gaps its walls close in, a mask of their own) */
					(c.id === 'haunted-house' ? '<mask id="crm-lit" style="mask-type:alpha"><image href="assets/img/creatures/haunted-house-lit.webp" width="' + w + '" height="' + h + '"/></mask>' +
						'<rect class="cr-lit" width="' + w + '" height="' + h + '" mask="url(#crm-lit)"/>' : '') +
					'<rect width="' + w + '" height="' + h + '" mask="url(#crm-' + c.id + ')"/>'
				: '<path d="' + s[3] + '"/>';
			return '<a class="cr-sil" href="#' + e(c.id) + '" style="--w:' + (w / h * s[5]).toFixed(1) + ';--h:' + s[5] + ';--d:' + (-(i * 1.7) % 9).toFixed(1) + 's" aria-label="' + e(t(c.name)) + '">' +
				'<span class="cr-tag">' + e(t(c.name)) + '</span>' +
				'<svg viewBox="0 0 ' + w + ' ' + h + '" preserveAspectRatio="xMidYMax meet" aria-hidden="true">' + shape +
				s[4].map(function (p) { return '<circle class="cr-eye" cx="' + p[0] + '" cy="' + p[1] + '" r="' + (img ? r : 2.6) + '"/>'; }).join('') + '</svg></a>';
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
			if (card) { window.PAGE.show(card); history.replaceState(null, '', '#' + id); }
		});
	},
	/* go to a card and light it for a moment with the site's own glow, as a link to it from another page does (app.js
	   focusHash, extras.css .is-target) */
	show: function (card) {
		card.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'center' });
		card.classList.remove('is-target'); void card.offsetWidth; card.classList.add('is-target');
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

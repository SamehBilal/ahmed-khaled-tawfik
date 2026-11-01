/* awards.html — «الجوائز»: his prizes and the honours given in his name (AKT.awards), each with its photograph, the book it was
   for and its source; then the other honours the Legacy timeline records — a doodle, a salon, a fair — each linked to its own entry there. */
window.PAGE = {
	id: 'awards',
	title: { ar: 'الجوائز', en: 'Awards' },
	strings: {
		eyebrow: { ar: 'تكريم', en: 'Honours' },
		title: { ar: 'الجوائز', en: 'Awards' },
		lead: {
			ar: 'جوائزه في حياته وبعد رحيله، من القائمة القصيرة لترجمة «يوتوبيا» إلى جائزة الشارقة عن «مثل إيكاروس»، وما كُرِّم به اسمه بعد ذلك.',
			en: 'His prizes in his life and after it, from the shortlist for Utopia in translation to the Sharjah prize for Like Icarus, and the honours given in his name since.'
		}
	},
	KIND: { win: { ar: 'فاز', en: 'Won' }, finalist: { ar: 'القائمة القصيرة', en: 'Shortlisted' }, honour: { ar: 'تكريم', en: 'Honour' } },

	/* the prizes by year, and the Legacy timeline's honours not already among them */
	sorted: function (d) { return (d.awards || []).slice().sort(function (a, b) { return a.year - b.year; }); },
	honours: function (d) {
		return (d.legacy || []).filter(function (l) {
			var s = (l.title || {}).ar || '';
			return /تكريم|دودل|[يت]حتفي|يحمل اسم|باسمه|صالون/.test(s) && !/جائزة/.test(s);
		});
	},

	/* the band: a trophy cabinet of wood — the prizes on the top shelf and the other honours below, each on a black base, its
	   stars by order (three for a win, two for the shortlist, one for an honour): a cup for a prize, gold for a win and silver for
	   the shortlist; an honour is no prize won, so not a cup but a thing of its own in bronze — a plaque for a name given, a
	   rosette for a day kept, a shield for a gathering held, a medal for the tributes; a hover tells which and when, a click goes
	   to it below */
	band: function (d, A) {
		var P = window.PAGE, e = A.esc, t = A.t, L = A.L;
		var STARS = { win: 3, finalist: 2, honour: 1 }, LINE = { win: '#6b4508', finalist: '#4a4f56', honour: '#5a2f10' };
		var star = function (cx, cy, R, r) {
			for (var p = [], i = 0; i < 10; i++) { var a = Math.PI / 5 * i - Math.PI / 2, q = i % 2 ? r : R; p.push((cx + q * Math.cos(a)).toFixed(1) + ' ' + (cy + q * Math.sin(a)).toFixed(1)); }
			return 'M' + p.join('L') + 'Z';
		};
		/* an honour's shape, by what it was */
		var shapeOf = function (title) {
			return /معرض|يحمل اسمه|باسمه/.test(title) ? 'plaque' : /جوجل|دودل|ميلاد/.test(title) ? 'rosette' : /صالون|ندوة|أمسية/.test(title) ? 'shield' : 'medal';
		};
		/* the black base and its stars, under every one */
		var base = function (k) {
			for (var s = '', i = 0; i < 3; i++) s += '<path d="' + star(28 + i * 12, 94, 4.6, 2) + '" fill="' + (i < STARS[k] ? '#f6d356' : '#7d7d7d') + '" stroke="#000" stroke-width=".6"/>';
			return '<rect x="21" y="75" width="38" height="7" rx="1.5" fill="url(#awb)" stroke="#000" stroke-width="1"/>' +
				'<rect x="15" y="82" width="50" height="24" rx="2" fill="url(#awb)" stroke="#000" stroke-width="1"/>' + s;
		};
		var honourShape = function (shape) {
			var o = LINE.honour, g = 'url(#awg-honour)', rg = 'url(#awr-honour)', st = star(40, 0, 0, 0);
			var svg = '<svg class="awc-svg" viewBox="0 0 80 110" aria-hidden="true">';
			if (shape === 'plaque') {
				/* a plaque on a stand, his name engraved: a fair named after him */
				svg += '<path d="M36 66h8v9h-8z" fill="' + g + '" stroke="' + o + '" stroke-width="1.4"/>' +
					'<rect x="12" y="14" width="56" height="52" rx="4" fill="' + rg + '" stroke="' + o + '" stroke-width="2.2"/>' +
					'<rect x="17" y="19" width="46" height="42" rx="2" fill="none" stroke="' + o + '" stroke-width="1.2" stroke-opacity=".7"/>' +
					'<path d="' + star(40, 33, 8, 3.4) + '" fill="' + g + '" stroke="' + o + '" stroke-width="1.4" stroke-linejoin="round"/>' +
					'<path d="M24 48h32M28 54h24" stroke="' + o + '" stroke-width="2" stroke-linecap="round" opacity=".8"/>' +
					'<path d="M15 18c3 10 3 26 1 40" fill="none" stroke="rgba(255,255,255,.5)" stroke-width="2" stroke-linecap="round"/>';
			} else if (shape === 'rosette') {
				/* a ribbon rosette, its two tails hanging: a day kept for his birth */
				var pts = [];
				for (var i = 0; i < 24; i++) { var a = Math.PI / 12 * i, q = i % 2 ? 19 : 23; pts.push((40 + q * Math.cos(a)).toFixed(1) + ' ' + (32 + q * Math.sin(a)).toFixed(1)); }
				svg += '<path d="M30 46 22 75l9-5 5 7 4-28zM50 46l8 29-9-5-5 7-4-28z" fill="#b8441f" stroke="' + o + '" stroke-width="1.4" stroke-linejoin="round"/>' +
					'<path d="M' + pts.join('L') + 'Z" fill="' + g + '" stroke="' + o + '" stroke-width="1.6" stroke-linejoin="round"/>' +
					'<circle cx="40" cy="32" r="14" fill="' + rg + '" stroke="' + o + '" stroke-width="1.8"/>' +
					'<path d="' + star(40, 32, 7.5, 3.2) + '" fill="' + g + '" stroke="' + o + '" stroke-width="1.3" stroke-linejoin="round"/>';
			} else if (shape === 'shield') {
				/* a shield on a short stem: a gathering held for him */
				svg += '<path d="M36 64h8v11h-8z" fill="' + g + '" stroke="' + o + '" stroke-width="1.4"/>' +
					'<path d="M40 8 64 16v18c0 16-10 26-24 32C26 60 16 50 16 34V16z" fill="' + rg + '" stroke="' + o + '" stroke-width="2.2" stroke-linejoin="round"/>' +
					'<path d="M40 14 58 20v14c0 12-7 20-18 25-11-5-18-13-18-25V20z" fill="none" stroke="' + o + '" stroke-width="1.2" stroke-opacity=".7"/>' +
					'<path d="' + star(40, 34, 9, 3.8) + '" fill="' + g + '" stroke="' + o + '" stroke-width="1.5" stroke-linejoin="round"/>' +
					'<path d="M21 20c0 14 2 24 8 32" fill="none" stroke="rgba(255,255,255,.5)" stroke-width="2.2" stroke-linecap="round"/>';
			} else {
				/* a medal on its ribbon, over a small stand: the tributes */
				svg += '<path d="M26 6h10l8 26h-10zM54 6H44l-8 26h10z" fill="#b8441f" stroke="' + o + '" stroke-width="1.4" stroke-linejoin="round"/>' +
					'<path d="M31 6h3l7 23h-3zM49 6h-3l-7 23h3z" fill="#f3c48a" opacity=".8"/>' +
					'<path d="M37 64h6v11h-6z" fill="' + g + '" stroke="' + o + '" stroke-width="1.4"/>' +
					'<circle cx="40" cy="47" r="18" fill="' + rg + '" stroke="' + o + '" stroke-width="2.2"/>' +
					'<circle cx="40" cy="47" r="13.5" fill="none" stroke="' + o + '" stroke-width="1.2" stroke-opacity=".7"/>' +
					'<path d="' + star(40, 47, 9, 3.8) + '" fill="' + g + '" stroke="' + o + '" stroke-width="1.5" stroke-linejoin="round"/>' +
					'<path d="M27 40c-2 6-1 12 2 16" fill="none" stroke="rgba(255,255,255,.55)" stroke-width="2.2" stroke-linecap="round"/>';
			}
			return svg + base('honour') + '</svg>';
		};
		var cup = function (k, title) {
			if (k === 'honour') return honourShape(shapeOf(title || ''));
			var o = LINE[k], g = 'url(#awg-' + k + ')';
			return '<svg class="awc-svg" viewBox="0 0 80 110" aria-hidden="true">' +
				'<path d="M22 20C6 16 4 44 30 48M58 20C74 16 76 44 50 48" fill="none" stroke="' + o + '" stroke-width="8" stroke-linecap="round"/>' +
				'<path d="M22 20C6 16 4 44 30 48M58 20C74 16 76 44 50 48" fill="none" stroke="' + g + '" stroke-width="4.5" stroke-linecap="round"/>' +
				'<path d="M36 55h8l-1 11h-6z" fill="' + g + '" stroke="' + o + '" stroke-width="1.6"/>' +
				'<path d="M14 12h52c0 28-10 42-26 44C24 54 14 40 14 12z" fill="url(#awr-' + k + ')" stroke="' + o + '" stroke-width="2.2"/>' +
				'<ellipse cx="40" cy="12" rx="26" ry="4.5" fill="' + g + '" stroke="' + o + '" stroke-width="2"/><ellipse cx="40" cy="12.5" rx="21" ry="2.6" fill="rgba(0,0,0,.28)"/>' +
				'<path d="M21 18c0 16 4 26 11 32" fill="none" stroke="rgba(255,255,255,.6)" stroke-width="3" stroke-linecap="round"/>' +
				'<path d="' + star(40, 31, 10, 4.2) + '" fill="' + g + '" stroke="' + o + '" stroke-width="1.8" stroke-linejoin="round"/>' +
				'<ellipse cx="40" cy="63" rx="6.5" ry="2.8" fill="' + g + '" stroke="' + o + '" stroke-width="1.4"/>' +
				'<path d="M30 67h20l4 8H26z" fill="' + g + '" stroke="' + o + '" stroke-width="1.6" stroke-linejoin="round"/>' + base(k) + '</svg>';
		};
		var item = function (k, title, kind, year, to) {
			return '<div class="awc-item" data-to="' + e(to) + '">' + cup(k, title) +
				'<span class="awc-tip"><b>' + e(title) + '</b><small>' + e(kind) + '<br>' + e(A.num(year)) + '</small></span></div>';
		};
		var defs = function (k, hi, mid, lo, deep) {
			return '<radialGradient id="awr-' + k + '" cx=".34" cy=".28" r=".85"><stop offset="0" stop-color="' + hi + '"/><stop offset=".35" stop-color="' + mid + '"/><stop offset=".78" stop-color="' + lo + '"/><stop offset="1" stop-color="' + deep + '"/></radialGradient>' +
				'<linearGradient id="awg-' + k + '" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="' + hi + '"/><stop offset=".45" stop-color="' + mid + '"/><stop offset="1" stop-color="' + lo + '"/></linearGradient>';
		};
		return '<svg width="0" height="0" style="position:absolute"><defs>' + defs('win', '#fffbe0', '#f7d04a', '#c9901c', '#8a5a08') +
				defs('finalist', '#ffffff', '#e1e5ea', '#9aa1aa', '#5d636b') + defs('honour', '#ffe2c2', '#e09a58', '#a8642a', '#6a3a14') +
				'<linearGradient id="awb" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3a3a3a"/><stop offset=".2" stop-color="#1c1c1c"/><stop offset="1" stop-color="#080808"/></linearGradient></defs></svg>' +
			'<div class="awc"><div class="awc-shelf">' + P.sorted(d).map(function (a, i) {
				return item(STARS[a.kind] ? a.kind : 'honour', t(a.title).split(/\s+—\s+/)[0].replace(/\s*\([^)]*\)$/, ''), t(P.KIND[a.kind] || P.KIND.honour), a.year, 'aw-' + i);
			}).join('') + '</div><div class="awc-shelf">' + P.honours(d).map(function (l, i) {
				return item('honour', t(l.title), L('تكريم', 'Honour'), String(l.date).slice(0, 4), 'awh-' + i);
			}).join('') + '</div></div>';
	},

	render: function () {
		var App = window.App, S = window.WorksShared, d = App.data(), e = App.esc, t = App.t, L = App.L, self = this;
		var died = String(((d.bio || {}).died || {}).date || '9999').slice(0, 4);
		var awards = self.sorted(d), honours = self.honours(d);
		document.getElementById('content').innerHTML = '<section class="section aw"><div class="wrap">' +
			'<ol class="aw-list">' + awards.map(function (a, i) {
				var w = a.work && App.findWork(a.work), after = String(a.year) > died || (String(a.year) === died && /بعد الرحيل/.test(a.title.ar));
				return '<li class="aw-item aw-' + e(a.kind) + '" id="aw-' + i + '">' +
					'<div class="aw-year"><b>' + e(App.num(a.year)) + '</b><span>' + e(t(self.KIND[a.kind] || self.KIND.honour)) + '</span>' + (after ? '<small>' + e(L('بعد رحيله', 'after his death')) + '</small>' : '') + '</div>' +
					'<div class="aw-body"><h2>' + e(t(a.title).replace(/\s*—\s*بعد الرحيل$/, '')) + '</h2><p>' + e(t(a.text)) + '</p>' +
						(w ? '<a class="aw-book" href="' + e(S.bookHref(w.id)) + '">' + (S.coverOf((d.bookInfo || {})[w.id]) ? '<img src="' + e(S.coverOf(d.bookInfo[w.id])) + '" alt="" loading="lazy">' : '') + '<span>' + e(t(w.title)) + '</span></a>' : '') +
						(a.source ? '<a class="aw-src" href="' + e(a.source) + '" target="_blank" rel="noopener">' + e(L('المصدر ↗', 'Source ↗')) + '</a>' : '') + '</div>' +
					/* its photograph opens full size with its caption, as the home timeline's do */
					(a.image ? '<figure class="aw-pic"><button type="button" class="aw-zoom" data-src="' + e(a.image.src) + '" data-alt="' + e(t(a.image.alt)) + '" aria-label="' + e(L('تكبير الصورة', 'Enlarge the photo')) + '">' +
						'<img src="' + e(a.image.src) + '" alt="' + e(t(a.image.alt)) + '" loading="lazy"></button></figure>' : '') +
					'</li>';
			}).join('') + '</ol>' +
			(honours.length ? '<h2 class="pp-h">' + e(L('تكريمات أخرى', 'Other honours')) + '</h2><div class="aw-more">' + honours.map(function (l, i) {
				/* to its own entry on the Legacy timeline (legacy.js numbers them by their place in AKT.legacy) */
				return '<a href="legacy.html#l-' + (d.legacy || []).indexOf(l) + '" class="aw-hon" id="awh-' + i + '"><b>' + e(String(l.date).slice(0, 4)) + '</b><span>' + e(t(l.title)) + '</span></a>';
			}).join('') + '</div>' : '') +
		'</div></section>';
		/* a trophy in the cabinet takes one to its entry; a prize's photograph opens full size */
		if (!self.wired) {
			self.wired = true;
			document.addEventListener('click', function (ev) {
				var z = ev.target.closest && ev.target.closest('.aw-zoom');
				if (z) { App.showPic(z.getAttribute('data-src'), z.getAttribute('data-alt')); return; }
				var it = ev.target.closest && ev.target.closest('.awc-item[data-to]'), to = it && document.getElementById(it.getAttribute('data-to'));
				if (!to) return;
				to.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'center' });
				to.classList.remove('is-lit'); void to.offsetWidth; to.classList.add('is-lit');
			});
		}
	}
};

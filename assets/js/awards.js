/* awards.html — «الجوائز»: his prizes and the honours given in his name (AKT.awards), each with its photograph, the book it was
   for and its source; then the other honours the Legacy timeline records — a doodle, a salon, a fair — linked there. */
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

	/* the band: a trophy cabinet — the prizes on the top shelf (gold for a win, silver for the shortlist, bronze for an honour),
	   the other honours as medals below, each on a pedestal with its year; a hover tells which, a click goes to it below */
	band: function (d, A) {
		var P = window.PAGE, e = A.esc, t = A.t, L = A.L;
		var cup = function (k) {
			return '<svg class="awc-svg" viewBox="0 0 64 64" aria-hidden="true">' +
				'<path d="M15 10c-9 0-11 6-9 11 2 6 9 9 13 10M49 10c9 0 11 6 9 11-2 6-9 9-13 10" fill="none" stroke="url(#awg-' + k + ')" stroke-width="4" stroke-linecap="round"/>' +
				'<path d="M13 5h38v14c0 15-9 23-19 23S13 34 13 19z" fill="url(#awg-' + k + ')"/>' +
				'<path d="M18 9v10c0 8 4 14 9 17" fill="none" stroke="rgba(255,255,255,.55)" stroke-width="2.5" stroke-linecap="round"/>' +
				(k === 'win' ? '<path d="M32 13l2.6 5.3 5.8.8-4.2 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8-4.2-4.1 5.8-.8z" fill="rgba(120,70,0,.45)"/>' : '') +
				'<path d="M29 42h6v7h-6z" fill="url(#awg-' + k + ')"/><ellipse cx="32" cy="45" rx="5" ry="2" fill="url(#awg-' + k + ')"/>' +
				'<path d="M21 49h22l3 9H18z" fill="url(#awg-' + k + ')"/></svg>';
		};
		var medal = '<svg class="awc-svg" viewBox="0 0 64 64" aria-hidden="true">' +
			'<path d="M22 2h9l5 18h-9zM42 2h-9l-5 18h9z" fill="#b3261e"/><path d="M33 2h9l-5 18h-9z" fill="#8a1c16"/>' +
			'<circle cx="32" cy="38" r="17" fill="url(#awg-honour)"/><circle cx="32" cy="38" r="12" fill="none" stroke="rgba(255,240,210,.5)" stroke-width="1.5"/>' +
			'<path d="M32 30l2.4 4.9 5.4.8-3.9 3.8.9 5.4-4.8-2.5-4.8 2.5.9-5.4-3.9-3.8 5.4-.8z" fill="rgba(90,45,10,.55)"/></svg>';
		var item = function (svg, title, kind, year, to) {
			return '<div class="awc-item" data-to="' + e(to) + '">' + svg + '<span class="awc-ped"><b>' + e(A.num(year)) + '</b></span>' +
				'<span class="awc-tip"><b>' + e(title) + '</b><small>' + e(kind) + ' · ' + e(A.num(year)) + '</small></span></div>';
		};
		var grad = function (id, a, b, c) { return '<linearGradient id="awg-' + id + '" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="' + a + '"/><stop offset=".45" stop-color="' + b + '"/><stop offset="1" stop-color="' + c + '"/></linearGradient>'; };
		return '<svg width="0" height="0" style="position:absolute"><defs>' + grad('win', '#fff3c4', '#e9b949', '#94650f') + grad('finalist', '#ffffff', '#c9ccd2', '#6b7078') +
				grad('honour', '#ffd9b0', '#c27a3a', '#6a3a14') + '</defs></svg>' +
			'<div class="awc"><div class="awc-shelf">' + P.sorted(d).map(function (a, i) {
				return item(cup(P.KIND[a.kind] ? a.kind : 'honour'), t(a.title).split(/\s+—\s+/)[0].replace(/\s*\([^)]*\)$/, ''), t(P.KIND[a.kind] || P.KIND.honour), a.year, 'aw-' + i);
			}).join('') + '</div><div class="awc-shelf">' + P.honours(d).map(function (l, i) {
				return item(medal, t(l.title), L('تكريم', 'Honour'), String(l.date).slice(0, 4), 'awh-' + i);
			}).join('') + '</div><i class="awc-glass"></i></div>';
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
					(a.image ? '<figure class="aw-pic"><img src="' + e(a.image.src) + '" alt="' + e(t(a.image.alt)) + '" loading="lazy"></figure>' : '') +
					'</li>';
			}).join('') + '</ol>' +
			(honours.length ? '<h2 class="pp-h">' + e(L('تكريمات أخرى', 'Other honours')) + '</h2><div class="aw-more">' + honours.map(function (l, i) {
				return '<a href="legacy.html" class="aw-hon" id="awh-' + i + '"><b>' + e(String(l.date).slice(0, 4)) + '</b><span>' + e(t(l.title)) + '</span></a>';
			}).join('') + '</div>' : '') +
		'</div></section>';
		/* a trophy in the cabinet takes one to its entry */
		if (!self.wired) {
			self.wired = true;
			document.addEventListener('click', function (ev) {
				var it = ev.target.closest && ev.target.closest('.awc-item[data-to]'), to = it && document.getElementById(it.getAttribute('data-to'));
				if (!to) return;
				to.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'center' });
				to.classList.remove('is-lit'); void to.offsetWidth; to.classList.add('is-lit');
			});
		}
	}
};

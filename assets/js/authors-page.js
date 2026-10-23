/* authors.html — every writer around him on one page, A to Z, each leading to their own page (writer.html).
   The shelves (People.LABELS) filter the list; writers.html keeps the shelves themselves. */
window.PAGE = {
	id: 'authors',
	title: { ar: 'كل الكُتّاب', en: 'All the writers' },
	strings: {
		eyebrow: { ar: 'حول العرّاب', en: 'Around the Godfather' },
		title: { ar: 'كل الكُتّاب', en: 'All the writers' },
		lead: {
			ar: 'كل من كتب معه، أو قدّم له أو قدّم هو له، أو أهدى إليه، أو خرج من عباءته — مرتّبين أبجديًا، ولكل منهم صفحته.',
			en: 'Everyone who wrote with him, wrote a foreword for him or got one from him, dedicated a book to him, or grew up reading him — A to Z, each with a page of their own.'
		}
	},
	shelf: '',

	render: function () {
		var App = window.App, P = window.People, self = this;
		var e = App.esc, t = App.t, L = App.L;
		var all = P.all().slice().sort(function (a, b) { return t(a.name).replace(/^(د\.|Dr\.)\s*/, '').localeCompare(t(b.name).replace(/^(د\.|Dr\.)\s*/, ''), App.lang); });
		var label = function (sh, p) { return L(p && p.female && sh.arF ? sh.arF : sh.ar, sh.en); };
		var root = document.getElementById('content');

		var chips = '<button type="button" class="dir-chip" data-shelf=""' + (!this.shelf ? ' aria-pressed="true"' : '') + '>' + L('الكل', 'All') + ' <small>' + App.num(all.length) + '</small></button>' +
			P.SHELVES.map(function (s) {
				var n = all.filter(function (p) { return p.shelves.indexOf(s) >= 0; }).length;
				return n ? '<button type="button" class="dir-chip" style="--c:' + P.LABELS[s].c + '" data-shelf="' + s + '"' + (self.shelf === s ? ' aria-pressed="true"' : '') + '>' + e(label(P.LABELS[s])) + ' <small>' + App.num(n) + '</small></button>' : '';
			}).join('');

		var card = function (p) {
			var n = t(p.name), first = P.LABELS[p.shelves[0]];
			return '<a class="dir-card" href="' + e(P.href(p)) + '" data-shelves="' + p.shelves.join(' ') + '" style="--c:' + first.c + '">' +
				'<span class="dir-pic"' + (p.photo ? ' style="background-image:url(&quot;' + e(p.photo.url) + '&quot;)"' : '') + '>' + (p.photo ? '' : e(P.initials(n, App.lang))) + '</span>' +
				'<span class="dir-body"><b>' + e(n) + '</b><small>' + e(App.alt(p.name)) + '</small>' +
					'<span class="dir-tags">' + p.shelves.map(function (s) { return '<i style="--c:' + P.LABELS[s].c + '">' + e(label(P.LABELS[s], p)) + '</i>'; }).join('') + '</span></span>' +
			'</a>';
		};

		root.innerHTML = '<section class="section"><div class="wrap">' +
			'<div class="dir-chips" role="group" aria-label="' + e(L('حسب العلاقة', 'By connection')) + '">' + chips + '</div>' +
			'<div class="dir-grid">' + all.map(card).join('') + '</div>' +
			'<p class="dir-more"><a href="writers.html">' + L('الكُتّاب على رفوفهم ←', 'The writers on their shelves →') + '</a></p>' +
		'</div></section>';

		var grid = root.querySelector('.dir-grid');
		var apply = function () {
			root.querySelectorAll('.dir-chip').forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-shelf') === self.shelf)); });
			grid.querySelectorAll('.dir-card').forEach(function (c) { c.hidden = !!self.shelf && (' ' + c.getAttribute('data-shelves') + ' ').indexOf(' ' + self.shelf + ' ') < 0; });
		};
		root.querySelector('.dir-chips').addEventListener('click', function (ev) {
			var b = ev.target.closest('.dir-chip');
			if (!b) return;
			self.shelf = b.getAttribute('data-shelf');
			apply();
		});
		apply();
	}
};

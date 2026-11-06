/* «مكتبة رفعت إسماعيل» (refaat-library.html): what his heroes read, quote, watch and hum inside the stories — Refaat above all,
   and Alaa — each with how they use it and the issues it is in (AKT.refaatLibrary, data-pages.js; assets/js/pages/refaatLibrary.js).
   By hero, a heading each, and by kind. Its band: their books standing on a shelf in the light of Refaat's lantern, each spine
   leading to its card. (Once a part of «مكتبته», library.html#refaat, which now leads here.) */
window.PAGE = {
	id: 'refaat-library',
	title: { ar: 'مكتبة رفعت إسماعيل', en: 'Refaat Ismail’s library' },
	strings: {
		eyebrow: { ar: 'داخل الحكايات', en: 'Inside the stories' },
		title: { ar: 'مكتبة رفعت إسماعيل', en: 'Refaat Ismail’s library' },
		lead: { ar: 'ما يقرؤه أبطاله ويستشهدون به ويحبونه داخل القصص: من بو ولافكرافت ودراكيولا إلى الأفلام القديمة وأم كلثوم، والأعداد التي يرد فيها كل منها.',
			en: 'What his heroes read, quote and love inside the stories: from Poe, Lovecraft and Dracula to old films and Umm Kulthum, and the issues each one turns up in.' }
	},
	WHO: { refaat: { ar: 'رفعت إسماعيل', en: 'Refaat Ismail' }, alaa: { ar: 'علاء عبد العظيم', en: 'Alaa Abdel Azim' }, abeer: { ar: 'عبير عبد الرحمن', en: 'Abeer Abdel Rahman' } },
	KINDS: [['book', { ar: 'كتب', en: 'Books' }], ['author', { ar: 'كتّاب', en: 'Writers' }], ['poem', { ar: 'شعر', en: 'Poetry' }], ['film', { ar: 'أفلام', en: 'Films' }], ['music', { ar: 'موسيقى', en: 'Music' }]],
	KIND: { book: { ar: 'كتاب', en: 'Book' }, author: { ar: 'كاتب', en: 'Writer' }, film: { ar: 'فيلم', en: 'Film' }, music: { ar: 'موسيقى', en: 'Music' }, poem: { ar: 'شعر', en: 'Poetry' } },
	COL: { book: '#6b1d10', author: '#7a4e1d', film: '#3b3357', music: '#1f4a44', poem: '#5a2a3a' },
	kind: 'all',

	/* the band: a spine for each on a shelf, its height its own, its colour its kind, Refaat's lantern glowing at the end */
	band: function (d, A) {
		var self = window.PAGE, e = A.esc, t = A.t, list = d.refaatLibrary || [];
		return '<div class="rl-shelf"><span class="rl-lamp" aria-hidden="true"><i></i></span><div class="rl-books">' + list.map(function (x, i) {
			return '<a class="rl-spine" href="#rl-' + i + '" style="--h:' + (150 + (i * 37) % 70) + 'px;--c:' + (self.COL[x.kind] || '#3a1414') + '" title="' + e(t(x.title)) + '">' +
				'<span>' + e(t(x.title)) + '</span></a>';
		}).join('') + '</div><i class="rl-board" aria-hidden="true"></i></div>';
	},

	card: function (x, i) {
		var App = window.App, S = window.WorksShared, e = App.esc, t = App.t, L = App.L;
		var covers = (x.issues || []).map(function (n) {
			var k = x.series + '-' + n, r = S && S.resolveBook(k);
			return r && r.series ? '<a href="' + e('book.html?id=' + k) + '" title="' + e(t(r.series.s.title) + ' ' + App.num(r.item.n) + ' · ' + t(r.item.title)) + '">' + e(App.num(n)) + '</a>' : '';
		}).filter(Boolean);
		var mini = S ? S.miniCover({ color: this.COL[x.kind] || '#3a1414', title: t(x.title), by: x.by ? t(x.by) : ' ' }) : '';
		return '<article class="lb-item lb-' + e(x.kind) + '" id="rl-' + i + '"><h3>' + e(t(x.title)) + '</h3>' +
			'<div class="lb-meta">' + mini + '<div><p class="lb-by">' + e(t(this.KIND[x.kind] || {})) + (x.by ? ' · ' + e(t(x.by)) : '') + '</p>' +
			(covers.length ? '<p class="lb-from lb-rf-is">' + e(L('في العدد ', 'In issue ')) + covers.join(L('، ', ', ')) + '</p>' : '') + '</div></div>' +
			'<p class="lb-said">' + e(t(x.said)) + '</p>' +
			(x.src || []).map(function (u, k) { return '<a class="lb-src" href="' + e(u) + '" target="_blank" rel="noopener">' + e(L('المصدر', 'Source') + ((x.src || []).length > 1 ? ' ' + App.num(k + 1) : '') + ' ↗') + '</a>'; }).join(' ') + '</article>';
	},

	list: function () {
		var App = window.App, e = App.esc, t = App.t, L = App.L, self = this, all = App.data().refaatLibrary || [];
		var items = all.map(function (x, i) { return [x, i]; }).filter(function (p) { return self.kind === 'all' || p[0].kind === self.kind; });
		var whos = Object.keys(this.WHO).concat(['other']);
		document.querySelector('.rl-groups').innerHTML = whos.map(function (w) {
			var mine = items.filter(function (p) { return w === 'other' ? !self.WHO[p[0].who] : p[0].who === w; });
			if (!mine.length) return '';
			return '<section class="rl-group"><h2 class="rl-who">' + e(w === 'other' ? L('وغيرهم', 'And others') : t(self.WHO[w])) + ' <b>' + e(App.num(mine.length)) + '</b></h2>' +
				'<div class="lb-grid">' + mine.map(function (p) { return self.card(p[0], p[1]); }).join('') + '</div></section>';
		}).join('');
	},

	render: function () {
		var App = window.App, e = App.esc, L = App.L, self = this, list = App.data().refaatLibrary || [];
		var count = {}; list.forEach(function (x) { count[x.kind] = (count[x.kind] || 0) + 1; });
		document.getElementById('content').innerHTML = '<section class="section lb rl"><div class="wrap">' +
			'<div class="chips lb-bar"><button type="button" class="chip" data-k="all" aria-pressed="true">' + e(L('الكل', 'All')) + ' <b>' + e(App.num(list.length)) + '</b></button>' +
				this.KINDS.filter(function (k) { return count[k[0]]; }).map(function (k) {
					return '<button type="button" class="chip" data-k="' + k[0] + '" aria-pressed="false">' + e(App.t(k[1])) + ' <b>' + e(App.num(count[k[0]])) + '</b></button>';
				}).join('') + '</div>' +
			'<div class="rl-groups"></div>' +
			'<p class="lb-note">' + e(L('أما عبير فتدخل الكتب نفسها: هي في ', 'Abeer goes into the books themselves: they are in ')) + '<a href="worlds.html">' + e(L('«عوالم فانتازيا»', 'Fantasia’s worlds')) + '</a>' +
				e(L('. وما أحبه أحمد خالد توفيق نفسه ونصح به في ', '. And what Ahmed Khaled Tawfik himself loved and recommended is in ')) + '<a href="library.html">' + e(L('«مكتبته»', 'His library')) + '</a>.</p>' +
		'</div></section>';
		document.querySelector('.lb-bar').onclick = function (ev) {
			var b = ev.target.closest('[data-k]');
			if (!b) return;
			self.kind = b.getAttribute('data-k');
			document.querySelectorAll('.lb-bar [data-k]').forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
			self.list();
		};
		this.list();
		/* a spine on the shelf above goes to its card, whatever kind is chosen */
		if (!this.wired) {
			this.wired = true;
			document.addEventListener('click', function (ev) {
				var a = ev.target.closest('.rl-spine');
				if (!a) return;
				ev.preventDefault();
				var id = a.getAttribute('href').slice(1);
				if (!document.getElementById(id)) { self.kind = 'all'; document.querySelectorAll('.lb-bar [data-k]').forEach(function (x) { x.setAttribute('aria-pressed', String(x.dataset.k === 'all')); }); self.list(); }
				var card = document.getElementById(id);
				if (card) { card.scrollIntoView({ behavior: 'smooth', block: 'center' }); card.classList.remove('is-target'); void card.offsetWidth; card.classList.add('is-target'); history.replaceState(null, '', '#' + id); }
			});
		}
		App.focusHash();
	}
};

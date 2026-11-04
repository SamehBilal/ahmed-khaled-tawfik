/* names.html — «أعلام في حكاياته»: the real and legendary figures his issues' back covers name — writers, rulers and leaders,
   thinkers, scientists, explorers, heroes of legend — who each was, and the issues you meet them in (AKT.storyPeople,
   data-pages.js). By kind, or searched; each card at #p-<id>. */
window.PAGE = {
	id: 'names',
	title: { ar: 'أعلام في حكاياته', en: 'Figures in his tales' },
	strings: {
		eyebrow: { ar: 'من «فانتازيا» و«سافاري»', en: 'From Fantasia and Safari' },
		title: { ar: 'أعلام في حكاياته', en: 'Figures in his tales' },
		lead: {
			ar: 'شكسبير ودستويفسكي وهانيبال وتشي جيفارا وفرويد وباستير وجلجاميش: من التقتهم عبير وعلاء في حكاياته، ومن هو كل منهم، والأعداد التي تلقاه فيها.',
			en: 'Shakespeare, Dostoevsky, Hannibal, Che Guevara, Freud, Pasteur, Gilgamesh: whom Abeer and Alaa meet in his tales, who each was, and the issues you meet them in.'
		}
	},
	KINDS: [['writer', { ar: 'أدباء وعلماء لغة', en: 'Writers & grammarians' }], ['ruler', { ar: 'ملوك وقادة', en: 'Rulers & leaders' }], ['thinker', { ar: 'مفكرون', en: 'Thinkers' }],
		['science', { ar: 'علماء وأطباء', en: 'Scientists & doctors' }], ['explorer', { ar: 'رحّالة ومستكشفون', en: 'Explorers' }], ['legend', { ar: 'أبطال الأساطير', en: 'Heroes of legend' }]],
	kind: 'all', q: '',

	/* the band: a frieze of their names — three rows sliding slowly, each the other way, the middle one in outline; beside each
	   name the years they lived (from their note) and a dot in the colour of their kind. A row stops under the pointer; a name
	   leads to its card */
	COLORS: { writer: '#d9a441', ruler: '#e0633a', thinker: '#9b8cf0', science: '#4fc39a', explorer: '#5aa9e6', legend: '#e07ab0' },
	band: function (d, A) {
		var e = A.esc, t = A.t, self = window.PAGE, list = (d.storyPeople || []).slice();
		setTimeout(function () { self.bandWire(); }, 0);
		/* «(1564–1616)», «(c. 2700 BC)»: the first bracket in their note with a year in it */
		var years = function (p) { var m = /\(([^()]*\d{3,4}[^()]*)\)/.exec(t(p.who) || ''); return m ? m[1].replace(/\s+/g, ' ').trim() : ''; };
		/* the most met first, dealt into three rows so each has some of every kind */
		list.sort(function (a, b) { return b.issues.length - a.issues.length; });
		var rows = [[], [], []];
		list.forEach(function (p, i) { rows[i % 3].push(p); });
		var name = function (p, dup) {
			var y = years(p);
			return '<a class="nm-name" href="#p-' + e(p.id) + '" style="--k:' + (self.COLORS[p.kind] || '#d9a441') + '"' + (dup ? ' tabindex="-1" aria-hidden="true"' : '') + '>' +
				'<i aria-hidden="true"></i><b>' + e(t(p.name)) + '</b>' + (y ? '<small dir="auto">' + e(y) + '</small>' : '') + '</a>';
		};
		return '<div class="nm-frieze">' + rows.map(function (r, k) {
			/* each row twice over, so it runs on without a seam */
			var once = r.map(function (p) { return name(p); }).join(''), again = r.map(function (p) { return name(p, true); }).join('');
			return '<div class="nm-row' + (k === 1 ? ' is-rev' : '') + '" style="--dur:' + (70 + k * 18) + 's"><div class="nm-track">' + once + again + '</div></div>';
		}).join('') + '</div>';
	},
	bandWire: function () {
		var sky = document.querySelector('.nm-frieze');
		if (!sky || sky.getAttribute('data-on')) return;
		sky.setAttribute('data-on', '1');
		var ph = sky.closest('.ph');
		if (ph) ph.removeAttribute('aria-hidden');
		var self = this;
		sky.addEventListener('click', function (ev) {
			var a = ev.target.closest('.nm-name');
			if (!a) return;
			ev.preventDefault();
			var id = a.getAttribute('href').slice(1);
			if (!document.getElementById(id)) { self.kind = 'all'; self.q = ''; var q = document.querySelector('.nm-q'); if (q) q.value = ''; document.querySelectorAll('.nm-bar [data-k]').forEach(function (x) { x.setAttribute('aria-pressed', String(x.getAttribute('data-k') === 'all')); }); self.list(); }
			var card = document.getElementById(id);
			if (card) {
				card.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'center' });
				card.classList.remove('is-target'); void card.offsetWidth; card.classList.add('is-target');
				history.replaceState(null, '', '#' + id);
			}
		});
	},

	render: function () {
		var App = window.App, e = App.esc, L = App.L, self = this, list = App.data().storyPeople || [];
		var count = {}; list.forEach(function (x) { count[x.kind] = (count[x.kind] || 0) + 1; });
		document.getElementById('content').innerHTML = '<section class="section nm"><div class="wrap">' +
			'<div class="nm-tools"><div class="chips nm-bar"><button type="button" class="chip" data-k="all" aria-pressed="true">' + e(L('الكل', 'All')) + ' <b>' + e(App.num(list.length)) + '</b></button>' +
				this.KINDS.filter(function (k) { return count[k[0]]; }).map(function (k) {
					return '<button type="button" class="chip" data-k="' + k[0] + '" aria-pressed="false">' + e(App.t(k[1])) + ' <b>' + e(App.num(count[k[0]])) + '</b></button>';
				}).join('') + '</div>' +
				'<input type="search" class="nm-q" placeholder="' + e(L('ابحث عن اسم…', 'Look up a name…')) + '"></div>' +
			'<div class="nm-grid"></div>' +
			'<p class="nm-note">' + e(L('الأسماء كما تذكرها الأغلفة الخلفية للأعداد (في صفحاتها)، والتعريف بكل منها عام. تعرف اسمًا آخر في عدد؟', 'The names as the issues’ back covers give them (on their pages); each note is a general one. Know another name in an issue?')) +
				' <a href="' + e(App.fixHref(L('أعلام في حكاياته', 'Figures in his tales'))) + '" target="_blank" rel="noopener">' + e(L('أخبرنا ↗', 'Tell us ↗')) + '</a></p>' +
		'</div></section>';
		document.querySelector('.nm-bar').onclick = function (ev) {
			var b = ev.target.closest('[data-k]');
			if (!b) return;
			self.kind = b.getAttribute('data-k');
			document.querySelectorAll('.nm-bar [data-k]').forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
			self.list();
		};
		document.querySelector('.nm-q').oninput = function (ev) { self.q = ev.target.value.trim(); self.list(); };
		this.list();
		App.focusHash();
	},

	list: function () {
		var App = window.App, S = window.WorksShared, e = App.esc, t = App.t, self = this;
		var kindName = {}; this.KINDS.forEach(function (k) { kindName[k[0]] = k[1]; });
		var bare = function (s) { return String(s).replace(/[ًٌٍَُِّْـ]/g, '').replace(/[أإآ]/g, 'ا').toLowerCase(); }, q = bare(this.q);
		document.querySelector('.nm-grid').innerHTML = (App.data().storyPeople || []).filter(function (p) {
			return (self.kind === 'all' || p.kind === self.kind) && (!q || bare(p.name.ar + ' ' + p.name.en + ' ' + t(p.who)).indexOf(q) >= 0);
		}).map(function (p) {
			var covers = p.issues.map(function (k) {
				var r = S.resolveBook(k);
				if (!r || !r.series) return '';
				var sid = r.series.s.id, is = r.item;
				return '<a href="' + e('book.html?id=' + k) + '" title="' + e(t(r.series.s.title) + ' ' + App.num(is.n) + ' · ' + t(is.title)) + '">' +
					S.miniCover({ img: S.issueCover(sid, is), color: '#3a1414', title: t(is.title), num: App.num(is.n) }) + '</a>';
			}).join('');
			return '<article class="nm-card" id="p-' + e(p.id) + '"><p class="nm-kind">' + e(t(kindName[p.kind] || {})) + '</p><h3>' + e(t(p.name)) + '</h3>' +
				(App.lang === 'en' ? '' : '<p class="nm-en" dir="ltr">' + e(p.name.en) + '</p>') +
				'<p class="nm-who">' + e(t(p.who)) + '</p><div class="nm-covers">' + covers + '</div></article>';
		}).join('') || '<p class="nm-note">' + e(App.L('لا اسم يطابق.', 'No name matches.')) + '</p>';
	}
};

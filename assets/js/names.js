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

	/* the band: an investigation board — cork in a wooden frame, and on it the issues where several of them meet (Verne and Wells,
	   Freud with Adler and Jung, Pasteur among the bacteriologists, Ross, Manson and Grassi…): each issue's cover pinned, the
	   names met in it on paper tags around it, a red thread from the cover to each; a tag leads to its card, a cover to its issue.
	   «التقوا في عدد واحد» stamped in its corner. Laid out on a canvas of its own, in hundredths, that scrolls sideways on a phone */
	COLORS: { writer: '#d9a441', ruler: '#e0633a', thinker: '#9b8cf0', science: '#4fc39a', explorer: '#5aa9e6', legend: '#e07ab0' },
	band: function (d, A) {
		var e = A.esc, t = A.t, L = A.L, S = window.WorksShared, self = window.PAGE, list = d.storyPeople || [];
		setTimeout(function () { self.bandWire(); }, 0);
		var years = function (p) { var m = /\(([^()]*\d{3,4}[^()]*)\)/.exec(t(p.who) || ''); return m ? m[1].replace(/\s+/g, ' ').trim() : ''; };
		/* the issues two or more of them share, the fullest first */
		var by = {};
		list.forEach(function (p) { p.issues.forEach(function (k) { (by[k] = by[k] || []).push(p); }); });
		var groups = Object.keys(by).filter(function (k) { return by[k].length > 1; })
			.sort(function (a, b) { return by[b].length - by[a].length || (a < b ? -1 : 1); }).slice(0, 9);
		if (!groups.length || !S) return '';
		/* two rows, the groups dealt so the rows weigh alike; each group's width by how many names it holds; in it, its cover in the
		   middle, half its names on tags above it and half below, a red thread from the cover to each */
		var rnd = function (i, k) { var x = Math.sin(i * 12.9898 + k * 78.233) * 43758.5453; return x - Math.floor(x); };
		var weight = function (k) { return Math.max(by[k].length, 2) + 0.8; };
		var rows = [[], []], tot = [0, 0];
		groups.forEach(function (k) { var r = tot[0] <= tot[1] ? 0 : 1; rows[r].push(k); tot[r] += weight(k); });
		var threads = [], pins = [], g = 0;
		rows.forEach(function (row, ri) {
			var x0 = 0, cy = ri ? 74 : 26;
			row.forEach(function (key) {
				var w = weight(key) / tot[ri] * 100, cx = x0 + w / 2;
				var r = S.resolveBook(key), is = r && r.item, cover = is ? S.issueCover(key.split('-')[0], is) : '';
				pins.push('<a class="nb-cover" href="book.html?id=' + e(key) + '" style="left:' + cx.toFixed(2) + '%;top:' + cy + '%;--r:' + ((rnd(g, 1) - 0.5) * 10).toFixed(1) + 'deg" title="' + e(is ? t(r.series.s.title) + ' ' + A.num(is.n) + ' · ' + t(is.title) : key) + '">' +
					(cover ? '<img src="' + e(A.thumb(cover)) + '" alt="" loading="lazy" decoding="async">' : '') + '<i class="nb-pin" aria-hidden="true"></i></a>');
				var ppl = by[key], up = Math.ceil(ppl.length / 2);
				ppl.forEach(function (p, k) {
					var above = k < up, m = above ? up : ppl.length - up, idx = above ? k : k - up;
					var x = x0 + (idx + 0.5) / m * w, y = cy + (above ? -17.5 : 17.5) + (rnd(g * 7 + k, 3) - 0.5) * 2;
					threads.push('<path d="M' + cx.toFixed(2) + ' ' + cy + ' Q' + ((cx + x) / 2).toFixed(2) + ' ' + ((cy + y) / 2 + 2).toFixed(2) + ' ' + x.toFixed(2) + ' ' + y.toFixed(2) + '"/>');
					var y2 = years(p);
					pins.push('<a class="nb-tag" href="#p-' + e(p.id) + '" style="left:' + x.toFixed(2) + '%;top:' + y.toFixed(2) + '%;--r:' + ((rnd(g * 7 + k, 2) - 0.5) * 8).toFixed(1) + 'deg;--k:' + (self.COLORS[p.kind] || '#d9a441') + '">' +
						'<i class="nb-pin" aria-hidden="true"></i><b>' + e(t(p.name)) + '</b>' + (y2 ? '<small dir="auto">' + e(y2) + '</small>' : '') + '</a>');
				});
				x0 += w; g++;
			});
		});
		return '<div class="nb-wrap"><div class="nb-board">' +
			'<svg class="nb-threads" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">' + threads.join('') + '</svg>' +
			pins.join('') +
			'<span class="nb-stamp" aria-hidden="true">' + e(L('التقوا في عدد واحد', 'Met in one issue')) + '</span>' +
		'</div></div>';
	},
	bandWire: function () {
		var sky = document.querySelector('.nb-board');
		if (!sky || sky.getAttribute('data-on')) return;
		sky.setAttribute('data-on', '1');
		var ph = sky.closest('.ph');
		if (ph) ph.removeAttribute('aria-hidden');
		var self = this;
		sky.addEventListener('click', function (ev) {
			var a = ev.target.closest('.nb-tag');
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

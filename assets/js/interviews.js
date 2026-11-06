/* interviews.html — «لقاءاته»: his interviews and talks, and the films, profiles and articles about him (AKT.media — the same
   items the Legacy page lists): by kind, newest first or oldest, the videos playing here (from youtube-nocookie, loaded only
   when pressed), the rest linking out. (Once the second half of «سيرته ولقاءاته», talks.html#talks, which now leads here.) */
window.PAGE = {
	id: 'interviews',
	title: { ar: 'لقاءاته', en: 'His interviews' },
	strings: {
		eyebrow: { ar: 'بصوته وعنه', en: 'In his voice, and about him' },
		title: { ar: 'لقاءاته', en: 'His interviews' },
		lead: {
			ar: 'لقاءاته التلفزيونية ومحاضراته، والأفلام والمقالات التي كُتبت عنه — الفيديو يُشاهَد هنا، والمقال يُفتح في موقعه.',
			en: 'His television interviews and talks, and the films and articles about him — the videos play here, the articles open where they were published.'
		}
	},
	KINDS: [['interview', { ar: 'لقاءات', en: 'Interviews' }], ['talk', { ar: 'محاضرات', en: 'Talks' }], ['documentary', { ar: 'أفلام وثائقية', en: 'Documentaries' }],
		['profile', { ar: 'بورتريه', en: 'Profiles' }], ['article', { ar: 'مقالات', en: 'Articles' }]],
	kind: 'all', order: 'old',

	yt: function (url) { var m = /(?:v=|youtu\.be\/|embed\/)([\w-]{11})/.exec(url || ''); return m ? m[1] : ''; },

	/* the band: a wall of old television sets in a shop window, each tuned to one of his interviews (his own voice first) — its
	   still under static and scanlines, its year and its name under it; the pointer tunes one in, and a click goes down to it
	   in the list and plays it there */
	band: function (d, A) {
		var e = A.esc, t = A.t, self = window.PAGE;
		var vids = (d.media || []).filter(function (m) { return self.yt(m.url); });
		var mine = vids.filter(function (m) { return m.kind === 'interview' || m.kind === 'talk'; });
		var pick = mine.concat(vids.filter(function (m) { return mine.indexOf(m) < 0; })).slice(0, 9)
			.sort(function (a, b) { return (a.year || 9999) - (b.year || 9999); });
		/* each set its own size and make: [width (px), with antenna, wooden] */
		var SETS = [[150, 1, 1], [118, 0, 0], [170, 0, 1], [130, 1, 0], [190, 0, 1], [124, 0, 0], [160, 1, 1], [116, 0, 0], [144, 0, 1]];
		setTimeout(function () { self.wallWire(); }, 0);
		return '<div class="tv-wall">' + pick.map(function (m, i) {
			var id = self.yt(m.url), s = SETS[i % SETS.length];
			return '<button type="button" class="tv' + (s[1] ? ' has-ant' : '') + (s[2] ? ' wood' : '') + '" data-yt="' + e(id) + '" style="--w:' + s[0] + 'px;--d:' + (-(i * 0.37) % 2).toFixed(2) + 's" title="' + e(t(m.title)) + '">' +
				'<span class="tv-box"><span class="tv-screen"><img src="https://i.ytimg.com/vi/' + e(id) + '/mqdefault.jpg" alt="" loading="lazy" referrerpolicy="no-referrer"><i class="tv-snow"></i></span>' +
				'<span class="tv-knobs"><i></i><i></i></span></span>' +
				'<span class="tv-cap"><b>' + e(m.year ? A.num(m.year) : '') + '</b>' + e(t(m.title)) + '</span></button>';
		}).join('') + '</div>';
	},
	/* a set clicked: its interview below, shown (the filter let go if it hides it), lit, and playing */
	wallWire: function () {
		var wall = document.querySelector('.tv-wall');
		if (!wall || wall.getAttribute('data-on')) return;
		wall.setAttribute('data-on', '1');
		var ph = wall.closest('.ph');
		if (ph) ph.removeAttribute('aria-hidden'); /* (its sets are buttons) */
		wall.addEventListener('click', function (ev) {
			var tv = ev.target.closest('.tv'), id = tv && tv.getAttribute('data-yt');
			if (!id) return;
			var find = function () { return document.querySelector('.tk-play[data-yt="' + id + '"]'); }, b = find();
			if (!b) { var all = document.querySelector('.tk-bar [data-k="all"]'); if (all) all.click(); b = find(); }
			if (!b) return;
			var card = b.closest('.tk-item');
			card.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'center' });
			card.classList.remove('is-target'); void card.offsetWidth; card.classList.add('is-target');
			b.click();
		});
	},

	render: function () {
		var App = window.App, e = App.esc, L = App.L, self = this, media = App.data().media || [];
		var count = {}; media.forEach(function (m) { count[m.kind] = (count[m.kind] || 0) + 1; });
		var vids = media.filter(function (m) { return self.yt(m.url); }).length;
		var chip = function (k, label, n) { return '<button type="button" class="chip" data-k="' + k + '" aria-pressed="' + (self.kind === k) + '">' + e(label) + ' <b>' + e(App.num(n)) + '</b></button>'; };
		document.getElementById('content').innerHTML = '<section class="section tk" id="talks"><div class="wrap">' +
			'<p class="tk-sum">' + e(L(App.num(media.length) + ' لقاءً وفيلمًا ومقالًا، منها ' + App.num(vids) + ' فيديو يُشاهَد هنا.', media.length + ' interviews, films and articles, ' + vids + ' of them videos you can watch here.')) + '</p>' +
			'<div class="tk-bar"><div class="chips">' + chip('all', L('الكل', 'All'), media.length) + chip('video', L('فيديو', 'Video'), vids) +
				this.KINDS.filter(function (k) { return count[k[0]]; }).map(function (k) { return chip(k[0], App.t(k[1]), count[k[0]]); }).join('') + '</div>' +
				'<button type="button" class="chip tk-order">' + e(this.order === 'old' ? L('الأقدم أولًا ↓', 'Oldest first ↓') : L('الأحدث أولًا ↓', 'Newest first ↓')) + '</button></div>' +
			'<div class="tk-list"></div>' +
			'<p class="tk-sum tk-also">' + e(L('وحياته كلها في ستة فصول في ', 'And his whole life, in six chapters, is in ')) + '<a href="talks.html">' + e(L('«سيرته»', 'His life')) + '</a>.</p>' +
			'</div></section>';
		var root = document.querySelector('.tk');
		root.querySelector('.tk-bar').onclick = function (ev) {
			var b = ev.target.closest('button');
			if (!b) return;
			if (b.classList.contains('tk-order')) { self.order = self.order === 'old' ? 'new' : 'old'; b.textContent = self.order === 'old' ? L('الأقدم أولًا ↓', 'Oldest first ↓') : L('الأحدث أولًا ↓', 'Newest first ↓'); }
			else { self.kind = b.getAttribute('data-k'); root.querySelectorAll('[data-k]').forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); }); }
			self.list();
		};
		root.querySelector('.tk-list').onclick = function (ev) {
			var b = ev.target.closest('.tk-play');
			if (!b) return;
			var f = document.createElement('iframe');
			f.src = 'https://www.youtube-nocookie.com/embed/' + b.getAttribute('data-yt') + '?autoplay=1&rel=0';
			f.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen'; f.allowFullscreen = true; f.className = 'tk-frame'; f.title = b.getAttribute('aria-label');
			b.replaceWith(f);
		};
		this.list();
		/* a link from «سيرته» to one video (#v-<id>): that one, lit */
		var m = /^#v-([\w-]{11})$/.exec(location.hash);
		if (m) {
			var b = document.querySelector('.tk-play[data-yt="' + m[1] + '"]'), card = b && b.closest('.tk-item');
			if (card) setTimeout(function () { card.scrollIntoView({ block: 'center' }); card.classList.add('is-target'); }, 300);
		}
	},

	list: function () {
		var App = window.App, e = App.esc, t = App.t, L = App.L, self = this;
		var kindName = {}; this.KINDS.forEach(function (k) { kindName[k[0]] = k[1]; });
		var list = (App.data().media || []).filter(function (m) { return self.kind === 'all' || (self.kind === 'video' ? self.yt(m.url) : m.kind === self.kind); })
			.slice().sort(function (a, b) { return self.order === 'old' ? (a.year || 9999) - (b.year || 9999) : (b.year || 0) - (a.year || 0); });
		var host = function (u) { try { return new URL(u).hostname.replace(/^www\./, ''); } catch (err) { return ''; } };
		var lastYear = null;
		document.querySelector('.tk-list').innerHTML = list.map(function (m) {
			var id = self.yt(m.url), head = '';
			if (m.year !== lastYear) { head = '<h2 class="tk-year">' + e(m.year ? App.num(m.year) : L('بلا تاريخ', 'Undated')) + '</h2>'; lastYear = m.year; }
			return head + '<article class="tk-item' + (id ? ' is-video' : '') + '"' + (id ? ' id="v-' + e(id) + '"' : '') + '>' +
				(id ? '<button type="button" class="tk-play" data-yt="' + e(id) + '" aria-label="' + e(L('شاهد: ', 'Watch: ') + t(m.title)) + '" style="background-image:url(&quot;https://i.ytimg.com/vi/' + e(id) + '/mqdefault.jpg&quot;)"><span>▶</span></button>' : '') +
				'<div class="tk-body"><p class="tk-meta">' + e(t(kindName[m.kind] || { ar: m.kind, en: m.kind })) + ' · ' + e(t(m.outlet)) + (m.lang && m.lang !== 'ar' ? ' · ' + e(m.lang === 'en' ? 'English' : m.lang) : '') + '</p>' +
				'<h3>' + (id ? e(t(m.title)) : '<a href="' + e(m.url) + '" target="_blank" rel="noopener">' + e(t(m.title)) + ' ↗</a>') + '</h3>' +
				(m.note ? '<p class="tk-note">' + e(t(m.note)) + '</p>' : '') +
				(id ? '<a class="tk-out" href="' + e(m.url) + '" target="_blank" rel="noopener">YouTube ↗</a>' : '<span class="tk-out">' + e(host(m.url)) + '</span>') +
				'</div></article>';
		}).join('') || '<p class="tk-sum">' + e(L('لا شيء هنا.', 'Nothing here.')) + '</p>';
	}
};

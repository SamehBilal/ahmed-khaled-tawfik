/* talks.html — «سيرته ولقاءاته»: his life in six chapters first (the site's timeline, AKT.timeline, with each period's
   interviews and, after him, the Legacy page's events), then his interviews and talks, and the films, profiles and articles about him (AKT.media — the same items
   the Legacy page lists), on a page of their own: by kind, newest first or oldest, the videos playing here (from
   youtube-nocookie, loaded only when pressed), the rest linking out. */
window.PAGE = {
	id: 'talks',
	title: { ar: 'سيرته ولقاءاته', en: 'His life & interviews' },
	strings: {
		eyebrow: { ar: 'بصوته وعنه', en: 'In his voice, and about him' },
		title: { ar: 'سيرته ولقاءاته', en: 'His life & interviews' },
		lead: {
			ar: 'حياته في ستة فصول، من طنطا إلى ما بعد رحيله، ثم لقاءاته التلفزيونية ومحاضراته والأفلام والمقالات التي كُتبت عنه — الفيديو يُشاهَد هنا، والمقال يُفتح في موقعه.',
			en: 'His life in six chapters, from Tanta to what came after him; then his television interviews and talks, and the films and articles about him — the videos play here, the articles open where they were published.'
		}
	},
	/* the chapters of his life: [from, to (inclusive), title, line] */
	CHAPTERS: [
		[1962, 1984, { ar: 'طنطا والبدايات', en: 'Tanta, and the beginnings' }, { ar: 'الطفولة والمدرسة وأول ما نُشر له.', en: 'Childhood, school, and the first thing he had published.' }],
		[1985, 1991, { ar: 'الطبيب', en: 'The doctor' }, { ar: 'كلية الطب بجامعة طنطا، طالبًا ثم مدرّسًا.', en: 'Tanta University’s Faculty of Medicine, as a student and then a teacher.' }],
		[1992, 2003, { ar: 'روايات مصرية للجيب', en: 'The pocket novels' }, { ar: 'رفعت إسماعيل وعبير وعلاء عبد العظيم، وجيل كامل يقرأ.', en: 'Refaat Ismail, Abeer and Alaa Abdel Azim, and a whole generation reading.' }],
		[2004, 2013, { ar: 'الروائي والكاتب الساخر', en: 'Novelist and columnist' }, { ar: 'الرواية الطويلة والترجمة والمقال الساخر.', en: 'The full-length novel, translation and the satirical column.' }],
		[2014, 2018, { ar: 'السنوات الأخيرة', en: 'The last years' }, { ar: 'وداع رفعت إسماعيل، والجوائز، و«شآبيب»، والرحيل.', en: 'Farewell to Refaat Ismail, the awards, Shaabeeb, and his death.' }],
		[2019, 9999, { ar: 'ما بعده', en: 'After him' }, { ar: 'ما بقي منه: كتبه بعد رحيله، والمسلسل، والتكريم.', en: 'What remained: his books after his death, the series, the honours.' }]
	],
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
		/* his life, then his city (tanta.js, once a page of its own), then the interviews */
		document.getElementById('content').innerHTML = this.life() + (window.TantaSection ? window.TantaSection.html() : '') + '<section class="section tk" id="talks"><div class="wrap">' +
			'<h2 class="tk-h">' + e(L('لقاءاته', 'Interviews')) + '</h2>' +
			'<p class="tk-sum">' + e(L(App.num(media.length) + ' لقاءً وفيلمًا ومقالًا، منها ' + App.num(vids) + ' فيديو يُشاهَد هنا.', media.length + ' interviews, films and articles, ' + vids + ' of them videos you can watch here.')) + '</p>' +
			'<div class="tk-bar"><div class="chips">' + chip('all', L('الكل', 'All'), media.length) + chip('video', L('فيديو', 'Video'), vids) +
				this.KINDS.filter(function (k) { return count[k[0]]; }).map(function (k) { return chip(k[0], App.t(k[1]), count[k[0]]); }).join('') + '</div>' +
				'<button type="button" class="chip tk-order">' + e(this.order === 'old' ? L('الأقدم أولًا ↓', 'Oldest first ↓') : L('الأحدث أولًا ↓', 'Newest first ↓')) + '</button></div>' +
			'<div class="tk-list"></div></div></section>';
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
		/* drawn after the page loaded, so the browser cannot go to a part of it (tanta.html sends its visitors to #tanta) by itself:
		   once the page has loaded, straight there — and again a few times while «سيرته»'s two columns settle (its fonts and pictures
		   coming in move what is below them), unless the reader has started scrolling */
		if (/^#(life|tanta|talks|ch-\d)$/.test(location.hash) && !this.jumped) {
			this.jumped = true;
			var to = document.getElementById(location.hash.slice(1)), moved = false;
			var stop = function () { moved = true; };
			['wheel', 'touchstart', 'keydown'].forEach(function (k) { window.addEventListener(k, stop, { once: true, passive: true }); });
			var go = function () {
				[50, 400, 1000, 2000].forEach(function (ms) {
					setTimeout(function () { if (!moved && Math.abs(to.getBoundingClientRect().top - 80) > 40) to.scrollIntoView({ behavior: 'instant' }); }, ms);
				});
			};
			if (to) { if (document.readyState === 'complete') go(); else window.addEventListener('load', go); }
		}
	},

	/* «سيرته»: the summary, then a chapter a period — its events from the timeline (after him, the Legacy page's), and the
	   interviews and films of those years */
	life: function () {
		var App = window.App, d = App.data(), e = App.esc, t = App.t, L = App.L, self = this;
		var bio = d.bio || {}, media = d.media || [];
		var paras = String(t(bio.summary || {}) || '').split(/\n\n+/).filter(Boolean);
		var chapters = this.CHAPTERS.map(function (c, i) {
			var after = c[1] === 9999;
			var ev = after
				? (d.legacy || []).filter(function (l) { return +String(l.date).slice(0, 4) >= c[0]; }).slice(0, 8).map(function (l) { return { year: +String(l.date).slice(0, 4), title: l.title, text: l.text }; })
				: (d.timeline || []).filter(function (x) { return x.year >= c[0] && x.year <= c[1]; });
			var talks = media.filter(function (m) { return m.year >= c[0] && m.year <= c[1]; });
			var years = after ? App.num(c[0]) + ' –' : App.num(c[0]) + ' – ' + App.num(c[1]);
			return '<section class="bio-ch" id="ch-' + (i + 1) + '"><header><span class="bio-n">' + e(App.num(i + 1)) + '</span><div><p class="bio-yrs">' + e(years) + '</p>' +
					'<h3>' + e(t(c[2])) + '</h3><p class="bio-line">' + e(t(c[3])) + '</p></div></header>' +
				'<ol class="bio-ev">' + ev.map(function (x) {
					var img = (x.images || [])[0];
					return '<li' + (img ? ' class="has-img"' : '') + '>' + (img ? '<img src="' + e(img.src) + '" alt="' + e(t(img.alt || {})) + '" loading="lazy">' : '') +
						'<b>' + e(App.num(x.year)) + '</b><h4>' + e(t(x.title)) + '</h4><p>' + e(t(x.text)) + '</p></li>';
				}).join('') + '</ol>' +
				(after ? '<p class="bio-more"><a href="legacy.html">' + e(L('كل ما جاء بعده في «الإرث» ←', 'Everything after him on the Legacy page →')) + '</a></p>' : '') +
				(talks.length ? '<p class="bio-talks">' + e(L('من لقاءاته وما قيل عنه في هذه السنوات: ', 'Interviews and films from these years: ')) + talks.slice(0, 4).map(function (m) {
					return '<a href="' + e(self.yt(m.url) ? '#talks' : m.url) + '"' + (self.yt(m.url) ? '' : ' target="_blank" rel="noopener"') + '>' + e(t(m.title)) + '</a>';
				}).join(' · ') + (talks.length > 4 ? ' · ' + e(L('و' + App.num(talks.length - 4) + ' غيرها', 'and ' + (talks.length - 4) + ' more')) : '') + '</p>' : '') +
			'</section>';
		}).join('');
		return '<section class="section bio tk-life" id="life"><div class="wrap">' + /* (.bio: the home page's biography's two columns, here within the site's width, page-talks.css) */
			'<h2 class="tk-h">' + e(L('سيرته', 'His life')) + '</h2>' +
			'<div class="bio-sum">' + paras.map(function (p) { return '<p>' + e(p) + '</p>'; }).join('') + '</div>' +
			'<nav class="chips bio-jump">' + this.CHAPTERS.map(function (c, i) { return '<a class="chip" href="#ch-' + (i + 1) + '">' + e(App.num(i + 1) + '. ' + t(c[2])) + '</a>'; }).join('') +
				(window.TantaSection ? '<a class="chip" href="#tanta">' + e(L('طنطا، مدينته', 'Tanta, his city')) + '</a>' : '') +
				'<a class="chip" href="#talks">' + e(L('لقاءاته', 'Interviews')) + '</a></nav>' +
			chapters + '</div></section>';
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
			return head + '<article class="tk-item' + (id ? ' is-video' : '') + '">' +
				(id ? '<button type="button" class="tk-play" data-yt="' + e(id) + '" aria-label="' + e(L('شاهد: ', 'Watch: ') + t(m.title)) + '" style="background-image:url(&quot;https://i.ytimg.com/vi/' + e(id) + '/mqdefault.jpg&quot;)"><span>▶</span></button>' : '') +
				'<div class="tk-body"><p class="tk-meta">' + e(t(kindName[m.kind] || { ar: m.kind, en: m.kind })) + ' · ' + e(t(m.outlet)) + (m.lang && m.lang !== 'ar' ? ' · ' + e(m.lang === 'en' ? 'English' : m.lang) : '') + '</p>' +
				'<h3>' + (id ? e(t(m.title)) : '<a href="' + e(m.url) + '" target="_blank" rel="noopener">' + e(t(m.title)) + ' ↗</a>') + '</h3>' +
				(m.note ? '<p class="tk-note">' + e(t(m.note)) + '</p>' : '') +
				(id ? '<a class="tk-out" href="' + e(m.url) + '" target="_blank" rel="noopener">YouTube ↗</a>' : '<span class="tk-out">' + e(host(m.url)) + '</span>') +
				'</div></article>';
		}).join('') || '<p class="tk-sum">' + e(L('لا شيء هنا.', 'Nothing here.')) + '</p>';
	}
};

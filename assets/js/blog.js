/* blog.html — his writings as collected on the fan archive aktowfik.blogspot.com.
   The archive: years as piles of cards (Codrops' Stapel, demo 3: wide gutter, staggered
   delays, random angles), rebuilt without jQuery. Open a year and its months fan out;
   open a month and its articles do. blog.html?post=<id> shows one article as a newspaper
   page (after a CodePen "CSS Grid newspaper"), or a comic as clickable animated panels
   (after a CodePen "animated comic"). */
window.PAGE = {
	id: 'blog',
	title: { ar: 'المدونة', en: 'Blog' },
	strings: {
		eyebrow: { ar: 'مقالات وقصص وكوميكس', en: 'Columns, stories and comics' },
		title: { ar: 'المدونة', en: 'The Blog' },
		lead: {
			ar: 'مقالاته وقصصه القصيرة والكوميكس التي كتبها، كما جمعها عمرو عبيد في مدونة «أحمد خالد توفيق»، مرتّبة بالسنة والشهر. اضغط على سنة لتنفتح شهورها، ثم على شهر لتنفتح مقالاته.',
			en: 'His columns, short stories and comics, as collected by Amr Ebaid on the "Ahmed Khaled Tawfik" blog, arranged by year and month. Open a year to fan out its months, then a month to fan out its articles.'
		}
	},
	MONTHS: {
		ar: ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'],
		en: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
	},
	kind: 'all',

	img: function (u) { var b = (window.App.data().blog || {}); return !u ? '' : u.indexOf('g:') === 0 ? b.img + u.slice(2) : u; },
	url: function (p) { var b = (window.App.data().blog || {}); return !p.url ? '' : /^https?:/.test(p.url) ? p.url : b.source + p.url; },
	kindOf: function (p) {
		var l = p.l || [];
		if (p.comic || l.indexOf('كوميكس') >= 0) return 'comics';
		if (l.some(function (x) { return /قصة|قصص|روايات|الرواية/.test(x); })) return 'stories';
		return 'articles';
	},

	render: function () {
		var App = window.App, blog = App.data().blog || { posts: [] };
		var id = new URLSearchParams(location.search).get('post');
		var post = id && blog.posts.filter(function (p) { return p.id === id; })[0];
		document.body.classList.toggle('blog-reading', !!post);
		if (post) return post.comic ? this.renderComic(post) : this.renderArticle(post);
		this.renderArchive();
	},

	/* ---------------- the archive: years → months → articles ---------------- */

	renderArchive: function () {
		var App = window.App, e = App.esc, L = App.L, self = this;
		var blog = App.data().blog || { posts: [] };
		var KINDS = [['all', L('الكل', 'All')], ['articles', L('مقالات', 'Columns')], ['stories', L('قصص', 'Stories')], ['comics', L('كوميكس', 'Comics')]];
		var count = function (k) { return blog.posts.filter(function (p) { return k === 'all' || self.kindOf(p) === k; }).length; };
		document.getElementById('content').innerHTML = '<section class="section"><div class="wrap">' +
			'<div class="section-head"><div class="chips" id="bl-kinds" role="group" aria-label="' + e(L('النوع', 'Kind')) + '">' +
				KINDS.map(function (k) { return '<button type="button" class="chip" data-k="' + k[0] + '" aria-pressed="' + (k[0] === self.kind) + '">' + e(k[1]) + '<span class="count">' + App.num(count(k[0])) + '</span></button>'; }).join('') +
			'</div><label class="bl-search"><span class="sr-only">' + L('ابحث في العناوين', 'Search titles') + '</span><input type="search" id="bl-q" placeholder="' + e(L('ابحث في العناوين…', 'Search titles…')) + '"></label></div>' +
			'<div class="tp-bar"><button type="button" class="tp-back" id="tp-back" hidden aria-label="' + e(L('رجوع', 'Back')) + '">' + (App.lang === 'ar' ? '→' : '←') + '</button>' +
				'<h2 id="tp-crumb">' + L('الأرشيف', 'The archive') + '</h2><span id="tp-sub"></span></div>' +
			'<div class="tp-wrap"><ul class="tp-grid" id="tp-grid"></ul></div>' +
			'<p class="bl-credit">' + L('المصدر: ', 'Source: ') + '<a href="' + e(blog.source) + '" target="_blank" rel="noopener">aktowfik.blogspot.com ↗</a> — ' +
				L('أرشيف جمعه ' + (blog.curator === 'Amr Ebaid' ? 'عمرو عبيد' : blog.curator) + '. هنا العنوان ومقتطف قصير، والنص الكامل في المدونة.', 'an archive collected by ' + blog.curator + '. Here: the title and a short excerpt; the full text is on the blog.') + '</p>' +
		'</div></section>';

		document.getElementById('bl-kinds').onclick = function (ev) {
			var b = ev.target.closest('.chip'); if (!b) return;
			self.kind = b.getAttribute('data-k');
			this.querySelectorAll('.chip').forEach(function (c) { c.setAttribute('aria-pressed', String(c === b)); });
			self.level = null; self.show();
		};
		var q = document.getElementById('bl-q'), qt;
		q.oninput = function () { clearTimeout(qt); qt = setTimeout(function () { self.query = q.value.trim(); self.level = null; self.show(); }, 200); };
		document.getElementById('tp-back').onclick = function () { self.back(); };
		this.query = '';
		this.stapel = new this.Stapel(document.getElementById('tp-grid'), { gutter: 70, pileAngles: 5, delay: 50, randomAngle: true });
		this.level = this.restore();
		this.show();
	},

	/* the posts after the kind filter and the search, grouped by year and month */
	groups: function () {
		var self = this, q = (this.query || '').toLowerCase();
		var posts = (window.App.data().blog || { posts: [] }).posts.filter(function (p) {
			return (self.kind === 'all' || self.kindOf(p) === self.kind) && (!q || p.t.toLowerCase().indexOf(q) >= 0);
		});
		var years = {};
		posts.forEach(function (p) {
			var y = p.d.slice(0, 4), m = +p.d.slice(5, 7);
			var Y = years[y] = years[y] || { y: y, months: {} };
			(Y.months[m] = Y.months[m] || []).push(p);
		});
		return Object.keys(years).sort().reverse().map(function (y) { return years[y]; });
	},

	/* where we are: null (years), {y} (a year's months), {y, m} (a month's articles) */
	show: function () {
		var App = window.App, L = App.L, self = this, lv = this.level;
		var years = this.groups(), MON = this.MONTHS[App.lang === 'ar' ? 'ar' : 'en'];
		var crumb = document.getElementById('tp-crumb'), sub = document.getElementById('tp-sub'), back = document.getElementById('tp-back');
		var thumb = function (p) { return p && p.img ? self.img(p.img) : ''; };
		var withImg = function (list) { return list.filter(function (p) { return p.img; }).concat(list.filter(function (p) { return !p.img; })); };
		this.save();

		if (!years.length) { crumb.textContent = L('لا نتائج', 'No results'); sub.textContent = ''; back.hidden = true; this.stapel.set([], null); return; }

		if (lv && lv.m) {
			var Yx = years.filter(function (Y) { return Y.y === lv.y; })[0], list = Yx && Yx.months[lv.m];
			if (!list) { this.level = null; return this.show(); }
			crumb.textContent = MON[lv.m - 1] + ' ' + App.num(lv.y);
			sub.textContent = App.num(list.length) + ' ' + L('منشورًا', 'posts');
			back.hidden = false;
			this.stapel.set([{ key: lv.y + '-' + lv.m, label: crumb.textContent, items: list.map(function (p) {
				return { href: 'blog.html?post=' + p.id, img: thumb(p), title: p.t, sub: p.src || '', kind: self.kindOf(p) };
			}) }], lv.y + '-' + lv.m);
			return;
		}

		/* years as piles; an open year fans out its months */
		var piles = years.map(function (Y) {
			var ms = Object.keys(Y.months).map(Number).sort(function (a, b) { return b - a; });
			var n = ms.reduce(function (s, m) { return s + Y.months[m].length; }, 0);
			return { key: Y.y, label: App.num(Y.y), count: n, items: ms.map(function (m) {
				var list = withImg(Y.months[m]);
				return { month: m, img: thumb(list[0]), title: MON[m - 1], sub: App.num(Y.months[m].length) + ' ' + L('منشورًا', 'posts'), stack: list.slice(0, 3).map(thumb) };
			}) };
		});
		back.hidden = !lv;
		crumb.textContent = lv ? App.num(lv.y) : L('الأرشيف', 'The archive');
		sub.textContent = lv ? '' : App.num(years.length) + ' ' + L('سنة', 'years');
		this.stapel.set(piles, lv ? lv.y : null, function (pileKey, item) {
			/* clicking a closed pile opens the year; clicking a month opens the month */
			if (item && item.month) { self.level = { y: pileKey, m: item.month }; self.show(); }
			else { self.level = { y: pileKey }; crumb.textContent = App.num(pileKey); back.hidden = false; sub.textContent = ''; self.save(); }
		});
	},
	back: function () {
		var App = window.App;
		/* from a month back to its year (fanned out); from a year back to the closed piles */
		if (this.level && this.level.m) { this.level = { y: this.level.y }; this.show(); return; }
		this.level = null;
		this.stapel.close();
		document.getElementById('tp-back').hidden = true;
		document.getElementById('tp-crumb').textContent = App.L('الأرشيف', 'The archive');
		document.getElementById('tp-sub').textContent = App.num(this.groups().length) + ' ' + App.L('سنة', 'years');
		this.save();
	},
	save: function () { try { sessionStorage.setItem('akt-blog-level', JSON.stringify({ l: this.level, k: this.kind })); } catch (e) {} },
	restore: function () {
		try { var s = JSON.parse(sessionStorage.getItem('akt-blog-level') || 'null'); if (s) { this.kind = s.k || 'all'; return s.l; } } catch (e) {}
		return null;
	},

	/* ---------------- the Stapel piles (vanilla) ---------------- */

	Stapel: function (ul, opt) {
		var piles = [], openKey = null, onPick = null, items = [];
		var cardW = 190, cardH = 240;
		var rnd = function (seed) { var x = Math.sin(seed * 9301 + 49297) * 233280; return x - Math.floor(x); };

		function cols() {
			var w = ul.clientWidth, g = w < 600 ? 24 : opt.gutter;
			var cw = w < 600 ? Math.min(150, (w - g) / 2) : cardW;
			return { n: Math.max(1, Math.floor((w + g) / (cw + g))), g: g, cw: cw, ch: cw * cardH / cardW };
		}
		function build() {
			var App = window.App, e = App.esc, L = App.L;
			ul.innerHTML = ''; items = [];
			piles.forEach(function (p, pi) {
				p.items.forEach(function (it, ii) {
					var li = document.createElement('li');
					li.className = 'tp-item' + (it.kind ? ' tp-' + it.kind : '');
					li.dataset.pile = p.key; li.dataset.i = ii;
					var inner = it.img ? '<img src="' + e(it.img) + '" alt="" loading="lazy" referrerpolicy="no-referrer" onerror="this.remove()">' : '<span class="tp-noimg">' + e(it.title) + '</span>';
					li.innerHTML = '<a ' + (it.href ? 'href="' + e(it.href) + '"' : 'href="#" role="button"') + ' tabindex="-1">' + inner +
						'<span class="tp-info"><b>' + e(it.title) + '</b>' + (it.sub ? '<small>' + e(it.sub) + '</small>' : '') + '</span></a>';
					if (ii === 0) {
						var t = document.createElement('span');
						t.className = 'tp-title';
						t.innerHTML = '<b>' + e(p.label) + '</b>' + (p.count != null ? '<span>' + App.num(p.count) + '</span>' : '');
						li.appendChild(t);
					}
					ul.appendChild(li);
					items.push({ el: li, pile: pi, i: ii, it: it });
				});
			});
			layout(false);
		}
		function layout(animate) {
			var c = cols(), open = openKey != null && piles.length > 1 ? openKey : (piles.length === 1 ? piles[0].key : null);
			var openPile = piles.filter(function (p) { return p.key === open; })[0];
			var rowsUsed = 0;
			items.forEach(function (x) {
				var p = piles[x.pile], el = x.el, pos, rot = 0, z = 1, visible = true, delay = 0;
				el.style.width = c.cw + 'px'; el.style.height = c.ch + 'px';
				if (openPile) {
					if (p !== openPile) { visible = false; pos = cell(x.pile, c); }
					else {
						pos = cell(x.i, c); rowsUsed = Math.max(rowsUsed, Math.floor(x.i / c.n) + 1);
						rot = opt.randomAngle ? (rnd(x.i + x.pile * 31) * 6 - 3) : 0;
						delay = opt.delay * x.i; z = 2;
					}
				} else {
					pos = cell(x.pile, c); rowsUsed = Math.max(rowsUsed, Math.floor(x.pile / c.n) + 1);
					/* a pile: the first three cards, the 2nd and 3rd turned a little */
					if (x.i > 2) visible = false;
					rot = x.i === 1 ? -opt.pileAngles : x.i === 2 ? opt.pileAngles : 0;
					z = 10 - x.i;
				}
				el.classList.toggle('tp-hidden', !visible);
				el.style.zIndex = z;
				el.style.transitionDelay = animate ? delay + 'ms' : '0ms';
				el.style.transform = 'translate(' + pos.x + 'px,' + pos.y + 'px) rotate(' + rot + 'deg)';
				el.querySelector('a').tabIndex = visible && (openPile || x.i === 0) ? 0 : -1;
			});
			ul.style.height = Math.max(1, rowsUsed) * (c.ch + c.g) + 'px';
			ul.classList.toggle('tp-open', !!openPile);
		}
		function cell(n, c) {
			var w = ul.clientWidth, row = Math.floor(n / c.n), col = n % c.n;
			var total = c.n * c.cw + (c.n - 1) * c.g, left = (w - total) / 2;
			var x = left + col * (c.cw + c.g);
			if (document.documentElement.dir === 'rtl') x = w - x - c.cw;
			return { x: x, y: row * (c.ch + c.g) };
		}
		ul.addEventListener('click', function (ev) {
			var li = ev.target.closest('.tp-item'); if (!li) return;
			var x = items.filter(function (k) { return k.el === li; })[0]; if (!x) return;
			var p = piles[x.pile], isOpen = openKey === p.key || piles.length === 1;
			if (x.it.href && isOpen) return; /* an article: follow the link */
			ev.preventDefault();
			if (!isOpen) { openKey = p.key; layout(true); if (onPick) onPick(p.key, null); return; }
			if (onPick) onPick(p.key, x.it);
		});
		var rt; window.addEventListener('resize', function () { clearTimeout(rt); rt = setTimeout(function () { if (ul.isConnected) layout(false); }, 150); });

		this.set = function (list, open, pick) { piles = list; openKey = open; onPick = pick || null; build(); requestAnimationFrame(function () { ul.classList.add('tp-ready'); }); };
		this.close = function () { openKey = null; layout(true); };
	},

	/* ---------------- one article, as a newspaper page ---------------- */

	renderArticle: function (p) {
		var App = window.App, e = App.esc, L = App.L, self = this;
		var blog = App.data().blog, posts = blog.posts;
		this.title = { ar: p.t, en: p.t };
		App.applyLang();
		var MON = this.MONTHS[App.lang === 'ar' ? 'ar' : 'en'];
		var outlet = p.src ? p.src.split(' - ')[0] : (p.l || []).filter(function (x) { return !/مقالات|رأي|قصة|كوميكس|مما سبق/.test(x); })[0] || '';
		var when = p.src ? p.src.split(' - ').slice(1).join(' - ') : '';
		var posted = App.num(+p.d.slice(8, 10)) + ' ' + MON[+p.d.slice(5, 7) - 1] + ' ' + App.num(p.d.slice(0, 4));
		var i = posts.indexOf(p), newer = posts[i - 1], older = posts[i + 1];
		var same = posts.filter(function (x) { return x !== p && x.d.slice(0, 7) === p.d.slice(0, 7); }).slice(0, 6);
		var sameOutlet = outlet ? posts.filter(function (x) { return x !== p && x.src && x.src.indexOf(outlet) === 0; }).slice(0, 5) : [];
		var link = function (x) { return '<a href="blog.html?post=' + e(x.id) + '"><h5>' + e(x.t) + '</h5>' + (x.src ? '<small>' + e(x.src) + '</small>' : '') + '</a>'; };
		var body = p.body ? App.paras({ ar: p.body, en: p.body }) : '<p>' + e(p.ex) + '</p>';

		document.getElementById('content').innerHTML = '<section class="section np-section"><div class="wrap">' +
			'<p class="np-crumbs"><a href="blog.html">' + L('→ المدونة', '← The blog') + '</a> · <a href="blog.html" data-goto="' + e(p.d.slice(0, 4)) + '-' + (+p.d.slice(5, 7)) + '">' + e(MON[+p.d.slice(5, 7) - 1] + ' ' + App.num(p.d.slice(0, 4))) + '</a></p>' +
			'<article class="np">' +
				'<h1 class="np-mast">' + L('أحمد خالد توفيق', 'Ahmed Khaled Tawfik') + '</h1>' +
				'<aside class="np-bar"><div>' +
					'<div>' + e(outlet || L('من المدونة', 'From the blog')) + '</div>' +
					'<div>' + e(when || posted) + '</div>' +
					'<div>' + e((p.l || []).slice(0, 2).join(' · ')) + '</div>' +
				'</div></aside>' +
				'<h2 class="np-title">' + e(p.t) + '</h2>' +
				'<div class="np-text np-cols" id="np-text">' + body +
					(p.body ? '' : '<p class="np-loading">' + L('يُحمَّل النص الكامل من المدونة…', 'Loading the full text from the blog…') + '</p>') +
				'</div>' +
				(p.img ? '<figure class="np-fig"><img src="' + e(self.img(p.img).replace(/\/s640\//, '/s1000/')) + '" alt="" referrerpolicy="no-referrer" onerror="this.parentNode.remove()"><figcaption>' + e(p.t) + '</figcaption></figure>' : '') +
				'<div class="np-side">' +
					(same.length ? '<h3>' + L('في الشهر نفسه', 'Same month') + '</h3>' + same.map(link).join('') : '') +
					(sameOutlet.length ? '<h3>' + L('من ', 'More from ') + e(outlet) + '</h3>' + sameOutlet.map(link).join('') : '') +
				'</div>' +
				'<nav class="np-nav">' +
					(older ? '<a href="blog.html?post=' + e(older.id) + '" class="np-older"><small>' + L('الأقدم', 'Older') + '</small>' + e(older.t) + '</a>' : '<span></span>') +
					(newer ? '<a href="blog.html?post=' + e(newer.id) + '" class="np-newer"><small>' + L('الأحدث', 'Newer') + '</small>' + e(newer.t) + '</a>' : '<span></span>') +
				'</nav>' +
				'<p class="np-credit">' + L('نُشر في المدونة: ', 'Posted on the blog: ') + e(posted) + ' · <a href="' + e(self.url(p)) + '" target="_blank" rel="noopener">aktowfik.blogspot.com ↗</a></p>' +
			'</article></div></section>';
		this.wireGoto();
		if (!p.body) this.loadFull(p);
	},

	/* the full text, read from the blog's public feed when the article opens (JSONP: the feed
	   sends no CORS headers). Its HTML is rebuilt from a short list of safe tags. */
	loadFull: function (p) {
		var App = window.App, L = App.L, e = App.esc, self = this;
		var box = document.getElementById('np-text');
		var fail = function () {
			if (!box || !box.isConnected) return;
			var w = box.querySelector('.np-loading');
			if (w) w.outerHTML = '<p class="np-more"><a href="' + e(self.url(p)) + '" target="_blank" rel="noopener">' + L('تعذّر تحميل النص — اقرأه في المدونة ↗', 'Could not load the text — read it on the blog ↗') + '</a></p>';
		};
		var cb = '__aktPost' + p.id;
		var s = document.createElement('script');
		var timer = setTimeout(function () { cleanup(); fail(); }, 12000);
		var cleanup = function () { clearTimeout(timer); try { delete window[cb]; } catch (x) { window[cb] = undefined; } s.remove(); };
		window[cb] = function (data) {
			cleanup();
			var html = data && data.entry && data.entry.content && data.entry.content.$t;
			var clean = html && self.sanitize(html);
			if (!clean || !box || !box.isConnected) return fail();
			box.innerHTML = clean;
			/* the first line names the paper and date, already shown in the bar above */
			var first = box.firstElementChild;
			if (first && p.src && first.textContent.trim().indexOf(p.src.split(' - ')[0]) === 0 && first.textContent.length < 80) first.remove();
			/* the blog's feed stops at its "read more" break: say so and link to the rest */
			var more = [].slice.call(box.querySelectorAll('a')).filter(function (a) { return /#more$/.test(a.getAttribute('href') || ''); });
			more.forEach(function (a) { var par = a.closest('p'); (par && par.textContent.trim() === a.textContent.trim() ? par : a).remove(); });
			box.insertAdjacentHTML('beforeend', more.length
				? '<p class="np-more"><a href="' + e(self.url(p)) + '#more" target="_blank" rel="noopener">' + L('بقية المقال في المدونة ↗', 'The rest of the article is on the blog ↗') + '</a></p>'
				: '<p class="np-via">' + L('النص من أرشيف المدونة: ', 'Text from the blog archive: ') + '<a href="' + e(self.url(p)) + '" target="_blank" rel="noopener">aktowfik.blogspot.com ↗</a></p>');
		};
		s.onerror = function () { cleanup(); fail(); };
		s.src = (App.data().blog || {}).source + 'feeds/posts/default/' + encodeURIComponent(p.id) + '?alt=json-in-script&callback=' + cb;
		document.head.appendChild(s);
	},

	/* keep text and basic formatting only: no scripts, styles, frames or attributes,
	   images only from Blogger, links only to http(s) addresses */
	sanitize: function (html) {
		var doc = new DOMParser().parseFromString('<div>' + html + '</div>', 'text/html');
		var KEEP = { P: 'p', B: 'b', STRONG: 'b', I: 'i', EM: 'i', U: 'u', BLOCKQUOTE: 'blockquote', H1: 'h3', H2: 'h3', H3: 'h3', H4: 'h4', UL: 'ul', OL: 'ol', LI: 'li', HR: 'hr', BR: 'br' };
		var BLOCK = { DIV: 1, P: 1, H1: 1, H2: 1, H3: 1, H4: 1, BLOCKQUOTE: 1, UL: 1, OL: 1, TABLE: 1, TR: 1 };
		var out = document.createElement('div');
		var para = null;
		var ensure = function () { if (!para) { para = document.createElement('p'); out.appendChild(para); } return para; };
		var walk = function (node, into) {
			node.childNodes.forEach(function (n) {
				if (n.nodeType === 3) { if (n.nodeValue.replace(/\s+/g, '')) (into || ensure()).appendChild(document.createTextNode(n.nodeValue)); return; }
				if (n.nodeType !== 1) return;
				var tag = n.tagName;
				if (/^(SCRIPT|STYLE|IFRAME|OBJECT|EMBED|FORM|INPUT|BUTTON|NOSCRIPT|SVG|VIDEO|AUDIO)$/.test(tag)) return;
				if (tag === 'IMG') {
					var src = n.getAttribute('src') || '';
					if (/^https:\/\/(blogger\.googleusercontent\.com|\d\.bp\.blogspot\.com|lh\d\.googleusercontent\.com)\//.test(src)) {
						var fig = document.createElement('figure'); fig.className = 'np-inline';
						var im = document.createElement('img'); im.src = src; im.alt = ''; im.loading = 'lazy'; im.referrerPolicy = 'no-referrer';
						fig.appendChild(im); out.appendChild(fig); para = null;
					}
					return;
				}
				if (tag === 'A') {
					var href = n.getAttribute('href') || '';
					if (n.querySelector('img')) { walk(n, into); return; }
					if (/^https?:\/\//.test(href)) { var a = document.createElement('a'); a.href = href; a.target = '_blank'; a.rel = 'noopener nofollow'; (into || ensure()).appendChild(a); walk(n, a); return; }
					walk(n, into); return;
				}
				if (tag === 'BR') { if (into) into.appendChild(document.createElement('br')); else para = null; return; }
				if (BLOCK[tag] && !into) {
					para = null;
					if (KEEP[tag] && tag !== 'P') { var b = document.createElement(KEEP[tag]); out.appendChild(b); walk(n, b); return; }
					walk(n, null); para = null; return;
				}
				if (KEEP[tag]) { var k = document.createElement(KEEP[tag]); (into || ensure()).appendChild(k); walk(n, k); return; }
				walk(n, into); /* span, font and the like: keep the text, drop the tag */
			});
		};
		walk(doc.body.firstChild, null);
		/* drop empty paragraphs */
		out.querySelectorAll('p').forEach(function (x) { if (!x.textContent.trim() && !x.querySelector('img')) x.remove(); });
		return out.innerHTML.trim();
	},

	/* "back to this month" from an article or comic */
	wireGoto: function () {
		var self = this;
		document.querySelectorAll('[data-goto]').forEach(function (a) {
			a.addEventListener('click', function () {
				var v = a.getAttribute('data-goto').split('-');
				try { sessionStorage.setItem('akt-blog-level', JSON.stringify({ l: { y: v[0], m: +v[1] }, k: self.kind || 'all' })); } catch (e) {}
			});
		});
	},

	/* ---------------- a comic, as animated panels ---------------- */

	renderComic: function (p) {
		var App = window.App, e = App.esc, L = App.L, self = this;
		this.title = { ar: p.t, en: p.t };
		App.applyLang();
		var MON = this.MONTHS[App.lang === 'ar' ? 'ar' : 'en'];
		document.getElementById('content').innerHTML = '<section class="section"><div class="wrap">' +
			'<p class="np-crumbs"><a href="blog.html">' + L('→ المدونة', '← The blog') + '</a> · <a href="blog.html" data-goto="' + e(p.d.slice(0, 4)) + '-' + (+p.d.slice(5, 7)) + '">' + e(MON[+p.d.slice(5, 7) - 1] + ' ' + App.num(p.d.slice(0, 4))) + '</a></p>' +
			'<div class="cx">' +
				'<h1 class="cx-title">' + e(p.t) + '</h1>' +
				'<p class="cx-meta">' + e([p.src, p.ex].filter(Boolean).join(' — ')) + '</p>' +
				'<p class="cx-hint">' + L('اضغط على كل لوحة لتتحرك.', 'Click each panel to bring it to life.') + '</p>' +
				'<div class="cx-panels" id="cx-panels">' + p.comic.map(function (u, i) {
					return '<button type="button" class="cx-tile" data-i="' + i + '" aria-label="' + e(L('اللوحة ', 'Panel ') + App.num(i + 1)) + '">' +
						'<img src="' + e(self.img(u)) + '" alt="" referrerpolicy="no-referrer" loading="' + (i < 2 ? 'eager' : 'lazy') + '">' +
						'<span class="cx-num">' + App.num(i + 1) + '</span></button>';
				}).join('') + '</div>' +
				'<div class="cx-actions"><button type="button" class="cx-btn" id="cx-play">' + L('شغّل الكل', 'Play all') + '</button>' +
					'<button type="button" class="cx-btn" id="cx-reset">' + L('إعادة', 'Reset') + '</button></div>' +
				'<p class="np-credit">' + L('من أرشيف المدونة: ', 'From the blog archive: ') + '<a href="' + e(self.url(p)) + '" target="_blank" rel="noopener">aktowfik.blogspot.com ↗</a></p>' +
			'</div></div></section>';

		var box = document.getElementById('cx-panels');
		/* a whole comic page is cut into strips, one panel each; wide images take a full row,
		   squarer ones share it — like the comic's mixed tiles */
		var renumber = function () { box.querySelectorAll('.cx-num').forEach(function (n, k) { n.textContent = App.num(k + 1); }); };
		box.querySelectorAll('img').forEach(function (img) {
			var fit = function () {
				var tile = img.closest('.cx-tile'), w = img.naturalWidth, h = img.naturalHeight;
				var strips = h > w * 1.3 ? Math.min(5, Math.round(h / (w * 0.62))) : 1;
				if (strips < 2) { tile.classList.add(w > h * 1.25 || p.comic.length === 1 ? 'cx-wide' : 'cx-tall'); return; }
				var frag = document.createDocumentFragment();
				for (var k = 0; k < strips; k++) {
					var t = document.createElement('button');
					t.type = 'button'; t.className = 'cx-tile cx-wide cx-strip';
					t.style.aspectRatio = w + ' / ' + (h / strips);
					t.innerHTML = '<span class="cx-in"><img src="' + e(img.src) + '" alt="" referrerpolicy="no-referrer" style="height:' + (strips * 100) + '%;top:-' + (k * 100) + '%"></span><span class="cx-num"></span>';
					frag.appendChild(t);
				}
				tile.replaceWith(frag);
				renumber();
			};
			if (img.complete && img.naturalWidth) fit(); else img.addEventListener('load', fit);
			img.addEventListener('error', function () { img.closest('.cx-tile').remove(); renumber(); });
		});
		box.addEventListener('click', function (ev) { var t = ev.target.closest('.cx-tile'); if (t) t.classList.add('animated'); });
		document.getElementById('cx-reset').onclick = function () { box.querySelectorAll('.cx-tile').forEach(function (t) { t.classList.remove('animated'); void t.offsetWidth; }); };
		document.getElementById('cx-play').onclick = function () {
			box.querySelectorAll('.cx-tile').forEach(function (t, i) { t.classList.remove('animated'); setTimeout(function () { t.classList.add('animated'); }, 400 * i); });
		};
		this.wireGoto();
	}
};

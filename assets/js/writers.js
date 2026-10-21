window.PAGE = {
	id: 'writers',
	title: { ar: 'الكُتّاب', en: 'Writers' },
	strings: {
		eyebrow: { ar: 'حول العرّاب', en: 'Around the Godfather' },
		title: { ar: 'الكُتّاب', en: 'The Writers' },
		lead: {
			ar: 'رفاق الطريق، ومن شاركوه الغلاف، ومن قدّم لهم وقدّموا له، والجيل الذي خرج من عباءته. اسحب كتابًا من الرف لتقرأ قصته.',
			en: 'Fellow travellers, co-authors, the writers he introduced and who introduced him, and the generation that grew up reading him. Pull a book off the shelf to read its story.'
		}
	},

	shelves: [
		{ key: 'collaborators', title: { ar: 'كتبوا معه', en: 'Wrote with him' }, text: { ar: 'كُتّاب شاركوه تأليف كتاب أو سلسلة.', en: 'Writers who co-authored a book or series with him.' }, palette: ['#6e1a14', '#8a3b12', '#4f2a1c'] },
		{ key: 'introductions', title: { ar: 'المقدّمات', en: 'Introductions' }, text: { ar: 'كتب قدّم لها العرّاب أو كتب كلمة على غلافها، وكُتّاب قدّموا لكتبه.', en: 'Books he wrote forewords or back-cover words for, and writers who wrote forewords for his.' }, palette: ['#1f4e5a', '#2c3e64', '#3d5a4a'] },
		{ key: 'dedications', title: { ar: 'أهدوا إليه', en: 'Dedicated to him' }, text: { ar: 'كُتّاب ومترجمون أهدوا كتبهم إلى العرّاب.', en: 'Writers and translators who dedicated a book to him.' }, palette: ['#5a1f3a', '#3a2a5a', '#6b3a1c'] },
		{ key: 'influenced', title: { ar: 'تأثّروا به', en: 'Influenced by him' }, text: { ar: 'كُتّاب يقولون بأنفسهم إنهم خرجوا من عباءته.', en: 'Writers who, in their own words, grew up under his influence.' }, palette: ['#7a5a1c', '#5b3a6e', '#8c2f39'] },
		{ key: 'contemporaries', title: { ar: 'رفاق الطريق', en: 'Contemporaries' }, text: { ar: 'زملاء جيله ورفاقه في عالم كتب الجيب.', en: 'Peers from his generation and from the world of pocket books.' }, palette: ['#334155', '#4b3b2a', '#2f4f3f'] },
		{ key: 'translated', title: { ar: 'ترجم لهم', en: 'Authors he translated' }, text: { ar: 'كُتّاب عالميون نقل أعمالهم إلى العربية.', en: 'Foreign authors whose work he brought into Arabic.' }, palette: ['#3b3b58', '#5a3d2b', '#28485a'] }
	],

	render: function () {
		var App = window.App, d = App.data(), e = App.esc, t = App.t, tx = App.tx;
		var W = d.writers || {};
		var L = function (ar, en) { return App.lang === 'ar' ? ar : en; };

		var html = '<section class="section"><div class="wrap">' + this.shelves.map(function (sh, si) {
			var list = W[sh.key] || [];
			if (!list.length) return '';
			return '<div class="shelf-block rise" data-shelf="' + si + '">' +
				'<h3>' + tx(sh.title) + ' <small style="color:var(--muted);font-family:var(--f-latin)">(' + App.num(list.length) + ')</small></h3>' +
				'<p>' + tx(sh.text) + '</p>' +
				'<div class="shelf">' + list.map(function (w, i) {
					var h = 160 + ((i * 37 + si * 13) % 60);
					var c = sh.palette[i % sh.palette.length];
					return '<button type="button" class="spine" id="wr-' + sh.key + '-' + i + '" aria-expanded="false" aria-controls="card-' + si + '" data-i="' + i + '" style="--h:' + h + 'px;--c:' + c + '"><span>' + tx(w.name) + '</span></button>';
				}).join('') + '</div>' +
				'<div class="shelf-card" id="card-' + si + '" aria-live="polite"></div>' +
			'</div>';
		}).join('') +
		'<div class="shelf-block rise" id="sources-block"></div>' +
		'</div></section>';

		document.getElementById('content').innerHTML = html;
		this.wave();

		var shelves = this.shelves;
		document.querySelectorAll('.shelf-block[data-shelf]').forEach(function (block) {
			var sh = shelves[+block.getAttribute('data-shelf')];
			var list = W[sh.key] || [];
			var card = block.querySelector('.shelf-card');
			block.querySelector('.shelf').addEventListener('click', function (ev) {
				var b = ev.target.closest('.spine');
				if (!b) return;
				var open = b.getAttribute('aria-expanded') === 'true';
				block.querySelectorAll('.spine').forEach(function (x) { x.setAttribute('aria-expanded', 'false'); });
				if (open) { card.classList.remove('is-open'); return; }
				b.setAttribute('aria-expanded', 'true');
				var w = list[+b.getAttribute('data-i')];
				var meta = '';
				if (w.work) meta = L('العمل: ', 'Work: ') + t(w.work) + (w.year ? ' (' + App.num(w.year) + ')' : '');
				if (w.book) meta = (w.direction === 'by_akt' ? L('قدّم له العرّاب: ', 'Foreword by AKT: ') : w.direction === 'back_akt' ? L('كلمة العرّاب على غلافه: ', 'AKT on the back cover: ') : w.direction === 'dedication' ? L('أهدى إليه: ', 'Dedicated to him: ') : L('كتب مقدّمة: ', 'Wrote the foreword to: ')) + t(w.book) + (w.year ? ' (' + App.num(w.year) + ')' : '');
				card.innerHTML =
					(w.cover ? '<figure class="wr-photo wr-cover"><img src="' + e(w.cover) + '" alt="' + e(t(w.book)) + '"></figure>' : '') +
					/* the back cover with his words, or the dedication page, opens at full size */
					(w.back ? '<figure class="wr-photo wr-cover wr-back"><a href="' + e(w.back) + '" target="_blank" rel="noopener"><img src="' + e(w.back) + '" alt="' + e((w.direction === 'dedication' ? L('صفحة الإهداء — ', 'Dedication page — ') : L('الغلاف الخلفي — ', 'Back cover — ')) + t(w.book)) + '" loading="lazy"></a><figcaption>' + (w.direction === 'dedication' ? L('صفحة الإهداء ↗', 'Dedication page ↗') : L('الغلاف الخلفي ↗', 'Back cover ↗')) + '</figcaption></figure>' : '') +
					(w.photo ? '<figure class="wr-photo"><img src="' + e(w.photo.url) + '" alt="' + e(t(w.name)) + '" referrerpolicy="no-referrer"><figcaption><a href="' + e(w.photo.file) + '" target="_blank" rel="noopener">' + e(w.photo.license) + ' · Wikimedia Commons</a></figcaption></figure>' : '') +
					'<h4>' + tx(w.name) + '</h4>' +
					'<p class="sub">' + e(App.alt(w.name)) + '</p>' +
					(meta ? '<p class="meta">' + e(meta) + '</p>' : '') +
					App.paras(w.text) +
					(w.source ? '<a href="' + e(w.source) + '" target="_blank" rel="noopener">' + L('المصدر ↗', 'Source ↗') + '</a>' : '') + ' ' + App.fixLink(t(w.name));
				card.classList.remove('is-open');
				void card.offsetWidth;
				card.classList.add('is-open');
			});
		});

		/* sources */
		var src = d.sources || [];
		var sb = document.getElementById('sources-block');
		if (src.length) {
			sb.innerHTML = '<h3>' + L('المراجع', 'Sources') + '</h3><p>' + L('المصادر العامة التي جُمعت منها بيانات الموقع.', 'Public sources used to compile this site.') + '</p>' +
				'<ul style="margin:0;padding-inline-start:20px;font-family:var(--f-latin);font-size:15px">' +
				src.map(function (s) { return '<li><a href="' + e(s.url) + '" target="_blank" rel="noopener">' + e(s.label || s.url) + '</a></li>'; }).join('') + '</ul>';
		} else sb.remove();

		/* #wr-shelf-i pulls that writer's book off the shelf */
		this.onHash = function () {
			App.focusHash(function (el) { if (el.getAttribute('aria-expanded') !== 'true') el.click(); });
		};
		this.onHash();
	},

	/* the wave of people under the page title: every writer as a circle with their initials,
	   linking to their book on the shelf below */
	wave: function () {
		var App = window.App, d = App.data(), e = App.esc, t = App.t, W = d.writers || {};
		var hero = document.querySelector('.page-hero .wrap');
		if (!hero) return;
		var old = hero.querySelector('.people-wave');
		if (old) old.remove();
		var people = [];
		this.shelves.forEach(function (sh) {
			(W[sh.key] || []).forEach(function (w, i) { people.push({ w: w, id: 'wr-' + sh.key + '-' + i, shelf: t(sh.title) }); });
		});
		if (!people.length) return;
		/* first letter of the first two words, skipping the Arabic article */
		var initials = function (name) {
			return name.split(/\s+/).filter(Boolean).slice(0, 2).map(function (p) {
				return p.charAt(/^ال./.test(p) ? 2 : 0);
			}).join(App.lang === 'ar' ? ' ' : '');
		};
		var div = document.createElement('div');
		div.className = 'people-wave';
		div.innerHTML = '<div class="pw-rows">' +
			'<ul class="pw-row pw-main">' + people.map(function (p, i) {
				var name = t(p.w.name);
				return '<li style="--i:' + i + '"><a class="pw-person" href="#' + p.id + '" data-name="' + e(name) + '" aria-label="' + e(name + ' — ' + p.shelf) + '"' + (p.w.photo ? ' style="background-image:url(&quot;' + e(p.w.photo.url) + '&quot;)"' : '') + '>' + (p.w.photo ? '' : e(initials(name))) + '</a></li>';
			}).join('') + '</ul>' +
			'<ul class="pw-row pw-ghost" aria-hidden="true">' + people.map(function (p, i) { return '<li style="--i:' + i + '"></li>'; }).join('') + '</ul>' +
		'</div>';
		hero.insertBefore(div, hero.firstChild);
	}
};

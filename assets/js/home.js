window.PAGE = {
	id: 'home',
	title: { ar: 'العرّاب', en: 'The Godfather' },
	strings: {
		bioEyebrow: { ar: 'السيرة', en: 'Biography' },
		bioTitle: { ar: 'طبيب كتب لجيلٍ كامل', en: 'The doctor who wrote for a generation' },
		lifeEyebrow: { ar: 'خط الزمن', en: 'Timeline' },
		lifeTitle: { ar: 'حياة في محطات', en: 'A life in moments' },
		exploreEyebrow: { ar: 'استكشف', en: 'Explore' },
		exploreTitle: { ar: 'ادخل المكتبة', en: 'Enter the library' }
	},

	render: function () {
		var App = window.App, d = App.data(), e = App.esc, t = App.t, tx = App.tx;
		var bio = d.bio || {};
		var series = d.series || [], works = d.works || [], chars = d.characters || [], w = d.writers || {};

		var year = function (iso) { return iso ? App.num(String(iso).slice(0, 4)) : ''; };
		/* the issues of his own series as the data has them (an issue in two parts counts once) */
		var S = window.WorksShared;
		var issues = series.reduce(function (n, s) { return n + (S ? S.seriesIssues(s.id).filter(function (is) { return !(is.part > 1); }).length : (+s.count || 0)); }, 0);
		var writersCount = ['collaborators', 'introductions', 'influenced', 'contemporaries', 'translated']
			.reduce(function (n, k) { return n + ((w[k] || []).length); }, 0);
		/* every recording once, on every platform: Audiohat's episodes, Storytel's and Iqraaly's audiobooks, the videos on YouTube */
		var au = d.audio || {}, heard = {};
		var hear = function (where, eps, at) { (eps || []).forEach(function (ep) { heard[where + ':' + ep[at || 0]] = 1; }); };
		Object.keys(au.issues || {}).forEach(function (k) { hear('ah', au.issues[k]); });
		hear('ah', au.midnight, 1);
		(au.seasons || []).concat(au.lasheenBooks || [], au.midnightSpoofs ? [au.midnightSpoofs] : []).forEach(function (x) { hear('ah', x.eps); });
		[au.storytel, au.iqraaly].forEach(function (P, k) { if (P && P.items) Object.keys(P.items).forEach(function (key) { hear(k ? 'iq' : 'st', P.items[key]); }); });
		if (au.youtube) { Object.keys(au.youtube.issues || {}).forEach(function (k) { hear('yt', au.youtube.issues[k]); }); if (au.youtube.eslamAdel) hear('yt', au.youtube.eslamAdel.eps); }
		var audioCount = Object.keys(heard).length;

		/* hero text */
		document.getElementById('hero-text').innerHTML =
			'<p class="eyebrow">' + (App.lang === 'ar' ? 'سيرة وببليوغرافيا' : 'A literary Bio-bibliography') + '</p>' +
			/* his name as lettered on the Ma Wara' al-Tabi'a covers — always in Arabic, the English name sits under it */
			'<h1><span class="name-ar name-cover" role="img" aria-label="د. أحمد خالد توفيق" lang="ar" dir="rtl">د. أحمد خالد توفيق</span>' +
			'<span class="name-en" lang="en">Dr. Ahmed Khaled Tawfik</span></h1>' +
			'<div class="godfather"><small>العرّاب</small>The Godfather</div>' +
			'<p class="dates">' + year(bio.born && bio.born.date) + ' — ' + year(bio.died && bio.died.date) +
				(bio.profession ? ' · ' + tx(bio.profession) : '') + '</p>' +
			(bio.motto ? '<blockquote class="grave-quote" tabindex="0" aria-describedby="grave-hint">' + tx(bio.motto) + '<cite>— ' + tx(bio.name) + '</cite>' +
				'<span class="grave-hint" id="grave-hint">' + App.L('مرّر المؤشر لترى قبره اليوم', 'Hover to see his grave today') + '</span></blockquote>' : '') +
			'<div class="stats">' +
				stat(issues, { ar: 'عددًا في السلاسل', en: 'series issues' }) +
				stat(series.length, { ar: 'سلسلة', en: 'series' }) +
				stat(works.length, { ar: 'كتابًا مستقلًا', en: 'standalone books' }) +
				stat(chars.length, { ar: 'شخصية', en: 'characters' }) +
			'</div>';

		this.initGrave();

		function stat(n, label) { return '<div class="stat"><b>' + App.num(n) + '</b><span>' + tx(label) + '</span></div>'; }

		/* hero portrait (linked from Youm7, credited under the photo) */
		var photo = bio.photo || {
			src: 'assets/img/photos/youm7-e94d8bd9a946.jpg',
			credit: { ar: 'الصورة: اليوم السابع', en: 'Photo: Youm7' }
		};
		document.getElementById('hero-photo').innerHTML =
			'<figure class="portrait">' +
				'<div class="portrait-frame"><img src="' + e(photo.src) + '" alt="' + e(App.L('أحمد خالد توفيق', 'Ahmed Khaled Tawfik')) + '" referrerpolicy="no-referrer" ' +
					'onerror="this.closest(\'.portrait\').classList.add(\'no-img\')"></div>' +
				'<span class="portrait-seal" aria-hidden="true">العرّاب</span>' +
				'<figcaption>' + tx(photo.credit) + '</figcaption>' +
			'</figure>';

		/* bio */
		document.getElementById('bio').innerHTML = App.paras(bio.summary);

		/* timeline */
		document.getElementById('timeline').innerHTML = (d.timeline || []).map(function (ev) {
			var pics = (ev.images || []).map(function (im) {
				return '<button type="button" class="tl-pic' + (im.w > im.h * 1.2 ? ' wide' : '') + '" data-src="' + e(im.src) + '" data-alt="' + e(t(im.alt)) + '">' +
					'<img src="' + e(im.src) + '" width="' + im.w + '" height="' + im.h + '" alt="' + e(t(im.alt)) + '" loading="lazy" decoding="async"></button>';
			}).join('');
			return '<li class="rise"><div class="yr">' + App.num(ev.year) + '</div><h3>' + tx(ev.title) + '</h3><p>' + tx(ev.text) + '</p>' +
				(pics ? '<div class="tl-pics">' + pics + '</div>' : '') + '</li>';
		}).join('');

		/* a timeline picture opens full size */
		document.getElementById('timeline').addEventListener('click', function (ev) {
			var b = ev.target.closest('.tl-pic');
			if (!b) return;
			App.showPic(b.dataset.src, b.dataset.alt);
		});

		/* explore */
		var cards = [
			{ href: 'guide.html', big: '?', title: { ar: 'من أين أبدأ؟', en: 'Where to start' },
			  text: { ar: 'جديد على عالمه؟ مسارات قراءة مقترحة حسب ذوقك.', en: 'New to his world? Suggested reading paths for every taste.' } },
			{ href: 'works.html', big: series.length + works.length, title: { ar: 'الأعمال', en: 'The Works' },
			  text: { ar: 'السلاسل والروايات والمقالات والترجمات — كتب ثلاثية الأبعاد تتصفحها من الداخل.', en: 'Series, novels, essays and translations — 3D books you can open and leaf through.' } },
			{ href: 'characters.html', big: chars.length, title: { ar: 'الشخصيات', en: 'The Characters' },
			  text: { ar: 'رفعت إسماعيل وعبير وعلاء عبد العظيم ومن عاش معهم بين الصفحات.', en: 'Refaat Ismail, Abeer, Alaa Abdel Azim and everyone who lived beside them on the page.' } },
			{ href: 'writers.html', big: window.People ? window.People.all().length : writersCount, title: { ar: 'الكُتّاب', en: 'The Writers' },
			  text: { ar: 'من كتب معه، ومن قدّم لهم وقدّموا له، ومن خرج من عباءته — على رفوفهم، ثم كلهم أبجديًا.', en: 'Who wrote with him, who he introduced and who introduced him, and who grew up reading him — on their shelves, then all of them A to Z.' } },
			{ href: 'publishers.html', big: window.WorksShared ? window.WorksShared.publishers().length : (d.publishers || []).length, title: { ar: 'دور النشر', en: 'Publishers' },
			  text: { ar: 'الدور التي نشرت له، من «روايات مصرية للجيب» إلى آخر طبعاته — ولكل دار صفحتها.', en: 'The houses that published him, from the Egyptian Pocket Novels to his latest editions — each with its own page.' } },
			{ href: 'quotes.html', big: (d.quotes || []).length || '«»', title: { ar: 'اقتباسات', en: 'Quotes' },
			  text: { ar: 'كلماته الموثّقة فقط — كل اقتباس بمصدره.', en: 'Only his verified words — every quote with its source.' } },
			{ href: 'legacy.html', big: (d.media || []).length || '∞', title: { ar: 'الإرث', en: 'The legacy' },
			  text: { ar: 'الوداع والتكريم، ولقاءاته ومحاضراته بصوته.', en: 'The farewell, the tributes, and his interviews and talks.' } },
			{ href: 'audio.html', big: audioCount || '▶', title: { ar: 'مسموع', en: 'Audio' },
			  text: { ar: 'أعداده وكتبه مسموعة على Audiohat وStorytel و«اقرألي» وYouTube، على شريط كاسيت واحد.', en: 'His issues and books as recordings on Audiohat, Storytel, Iqraaly and YouTube, on one cassette.' } },
			{ href: 'tributes.html', big: (d.tributes || []).length || '❝', title: { ar: 'قالوا عنه', en: 'Tributes' },
			  text: { ar: 'ما قاله عنه كُتّاب ومشاهير، يوم رحيله وبعده.', en: 'What well-known people said about him when he left, and after.' } },
			{ href: 'blog.html', big: (d.blog && d.blog.posts || []).length || '✒', title: { ar: 'المدونة', en: 'The Blog' },
			  text: { ar: 'مقالاته وقصصه القصيرة وكوميكسه، مجموعة من أرشيف المدونة.', en: 'His columns, short stories and comics, gathered from the blog archive.' } }
		];
		this.onThisDay();
		document.getElementById('explore').innerHTML = cards.map(function (c) {
			return '<a class="rise" href="' + c.href + '"><span class="big">' + e(c.big) + '</span><h3>' + tx(c.title) + '</h3><p>' + tx(c.text) + '</p><span class="go">' + (App.lang === 'ar' ? 'ادخل ←' : 'Enter →') + '</span></a>';
		}).join('');
	},

	/* «في مثل هذا اليوم»: what happened on today's date in other years — his birth or death, the legacy, a book or an issue that came
	   out, the articles the papers printed (assets/data/days/<MM>.json, tools/build-days.js); on a day with none, the next one that has */
	onThisDay: function () {
		var App = window.App, e = App.esc, t = App.t, L = App.L, box = document.getElementById('otd');
		if (!box) return;
		var MONTHS = { ar: ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'],
			en: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'] };
		var KIND = { born: { ar: 'ميلاد', en: 'Born' }, died: { ar: 'رحيل', en: 'Farewell' }, legacy: { ar: 'الإرث', en: 'Legacy' },
			book: { ar: 'صدر كتاب', en: 'A book came out' }, issue: { ar: 'صدر عدد', en: 'An issue came out' }, article: { ar: 'مقال', en: 'Article' } };
		var ORDER = ['born', 'died', 'legacy', 'book', 'issue', 'article'];
		var ago = function (n) {
			return App.lang === 'en' ? (n === 1 ? 'a year ago' : n + ' years ago')
				: n === 1 ? 'منذ عام' : n === 2 ? 'منذ عامين' : n <= 10 ? 'منذ ' + App.num(n) + ' أعوام' : 'منذ ' + App.num(n) + ' عامًا';
		};
		var now = new Date(), pad = function (n) { return (n < 10 ? '0' : '') + n; };
		var month = function (m) {
			var self = window.PAGE; self._days = self._days || {};
			if (!self._days[m]) self._days[m] = fetch('assets/data/days/' + pad(m) + '.json').then(function (r) { return r.ok ? r.json() : {}; }).catch(function () { return {}; });
			return self._days[m];
		};
		/* today, or the first of the next ten days with something */
		var tries = [];
		for (var i = 0; i < 10; i++) { var dt = new Date(now.getFullYear(), now.getMonth(), now.getDate() + i); tries.push(dt); }
		var months = tries.map(function (x) { return x.getMonth() + 1; }).filter(function (m, k, all) { return all.indexOf(m) === k; });
		Promise.all(months.map(month)).then(function (got) {
			var by = {}; months.forEach(function (m, k) { by[m] = got[k] || {}; });
			var day = null, list = [];
			for (var k = 0; k < tries.length && !list.length; k++) { day = tries[k]; list = (by[day.getMonth() + 1] || {})[pad(day.getDate())] || []; }
			if (!list.length) { box.hidden = true; return; }
			var today = day.getDate() === now.getDate() && day.getMonth() === now.getMonth();
			list = list.slice().sort(function (a, b) { return ORDER.indexOf(a[0]) - ORDER.indexOf(b[0]) || a[1] - b[1]; });
			var card = function (x) {
				var years = now.getFullYear() - x[1];
				return '<a class="otd-card otd-' + e(x[0]) + '" href="' + e(x[3]) + '">' +
					'<span class="otd-y">' + e(App.num(x[1])) + '</span><span class="otd-ago">' + e(years > 0 ? ago(years) : '') + '</span>' +
					'<span class="otd-k">' + e(t(KIND[x[0]] || x[0])) + (x[4] ? ' · ' + e(t(x[4])) : '') + '</span>' +
					'<b>' + e(t(x[2])) + '</b></a>';
			};
			var first = list.slice(0, 6), rest = list.slice(6);
			box.querySelector('.eyebrow').textContent = today ? L('في مثل هذا اليوم', 'On this day') : L('في مثل هذا الأسبوع', 'This week');
			box.querySelector('h2').textContent = App.num(day.getDate()) + ' ' + MONTHS[App.lang === 'en' ? 'en' : 'ar'][day.getMonth()];
			box.querySelector('.otd-list').innerHTML = first.map(card).join('') +
				(rest.length ? '<div class="otd-more" hidden>' + rest.map(card).join('') + '</div>' : '');
			var more = box.querySelector('.otd-all');
			more.hidden = !rest.length;
			more.textContent = L('كل ما في هذا اليوم (' + App.num(list.length) + ')', 'Everything on this day (' + list.length + ')');
			more.onclick = function () { var m = box.querySelector('.otd-more'); if (m) { m.hidden = false; m.style.display = 'contents'; } more.hidden = true; };
			box.hidden = false;
		});
	},

	/* hovering (or tapping) his grave wish fills the screen with a photo of his grave today,
	   where readers did write it, and slowly zooms in on the inscription */
	initGrave: function () {
		var App = window.App, L = App.L;
		var q = document.querySelector('.grave-quote');
		if (!q) return;
		var ov = document.getElementById('grave-overlay');
		if (!ov) {
			ov = document.createElement('div');
			ov.id = 'grave-overlay';
			ov.className = 'grave-overlay';
			ov.setAttribute('aria-hidden', 'true');
			document.body.appendChild(ov);
			ov.addEventListener('click', function () { close(true); });
		}
		ov.innerHTML =
			'<div class="grave-bg"></div>' +
			'<img class="grave-img" src="assets/img/grave.webp" alt="' + App.esc(L('قبر أحمد خالد توفيق، مغطّى برسائل قرّائه، وعليه «جعل الشباب يقرأون»', 'The grave of Ahmed Khaled Tawfik, covered in notes from his readers, inscribed “He made the young read”')) + '">' +
			'<div class="grave-cap"><p class="g-line">' + L('وهكذا كُتب على قبره', 'And so it was written on his grave') + '</p>' +
				'<p class="g-quote">' + L('«جعل الشباب يقرأون»', '“He made the young read”') + '</p>' +
				'<p class="g-sub">' + L('قبره اليوم، مغطّى برسائل قرّائه', 'His grave today, covered in notes from his readers') + '</p></div>';
		var pinned = false, t = 0;
		function open() { clearTimeout(t); ov.classList.add('on'); ov.setAttribute('aria-hidden', 'false'); }
		function close(force) { if (pinned && !force) return; pinned = false; ov.classList.remove('pinned'); clearTimeout(t); t = setTimeout(function () { ov.classList.remove('on'); ov.setAttribute('aria-hidden', 'true'); }, 120); }
		var fine = window.matchMedia && window.matchMedia('(hover: hover)').matches;
		if (fine) {
			q.addEventListener('mouseenter', open);
			q.addEventListener('mouseleave', function () { close(false); });
		}
		q.addEventListener('focus', open);
		q.addEventListener('blur', function () { close(true); });
		q.addEventListener('click', function () { pinned = !pinned; if (pinned) { open(); ov.classList.add('pinned'); } else close(true); });
		document.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(true); });
	}
};

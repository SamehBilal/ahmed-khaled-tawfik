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
		/* every recording once, on every platform: Audiohat's episodes, Storytel's, Iqraaly's and StoriaPod's audiobooks, the videos on YouTube */
		var au = d.audio || {}, heard = {};
		var hear = function (where, eps, at) { (eps || []).forEach(function (ep) { heard[where + ':' + ep[at || 0]] = 1; }); };
		Object.keys(au.issues || {}).forEach(function (k) { hear('ah', au.issues[k]); });
		hear('ah', au.midnight, 1);
		(au.seasons || []).concat(au.lasheenBooks || [], au.midnightSpoofs ? [au.midnightSpoofs] : []).forEach(function (x) { hear('ah', x.eps); });
		[au.storytel, au.iqraaly, au.storiapod].forEach(function (P, k) { if (P && P.items) Object.keys(P.items).forEach(function (key) { hear(['st', 'iq', 'sp'][k], P.items[key]); }); });
		((au.storiapod || {}).dramas || []).forEach(function (x) { hear('sp', x.eps); });
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

		/* explore: the site's main sections, as its menu has them (his works, his world, his life, his writing, his legacy, and
		   adding to it), each card's figure the count of what that page holds, as numbers.html counts it */
		var st = d.stats || {}, editions = 0;
		[d.issueInfo, d.bookInfo].forEach(function (store) { Object.keys(store || {}).forEach(function (k) { editions += ((store[k] || {}).editions || []).length; }); });
		var cards = [
			{ href: 'guide.html', big: '?', title: { ar: 'من أين أبدأ؟', en: 'Where to start' },
			  text: { ar: 'جديد على عالمه؟ مسارات قراءة مقترحة حسب ذوقك.', en: 'New to his world? Suggested reading paths for every taste.' } },
			{ href: 'works.html', big: issues + works.length, title: { ar: 'الأعمال', en: 'The Works' },
			  text: { ar: App.num(issues) + ' عددًا في ' + App.num(series.length) + ' سلاسل، و' + App.num(works.length) + ' كتابًا مستقلًا من روايات وقصص ومقالات وترجمات — كتب ثلاثية الأبعاد تتصفحها من الداخل.',
			          en: issues + ' issues in ' + series.length + ' series and ' + works.length + ' standalone novels, stories, essays and translations — 3D books you can open and leaf through.' } },
			{ href: 'characters.html', big: chars.length, title: { ar: 'الشخصيات', en: 'The Characters' },
			  text: { ar: 'رفعت إسماعيل وعبير وعلاء عبد العظيم ومن عاش معهم بين الصفحات.', en: 'Refaat Ismail, Abeer, Alaa Abdel Azim and everyone who lived beside them on the page.' } },
			{ href: 'talks.html', big: App.num(6), title: { ar: 'سيرته', en: 'His life' },
			  text: { ar: 'حياته في ستة فصول، من طنطا إلى ما بعد رحيله.', en: 'His life in six chapters, from Tanta to what came after him.' } },
			{ href: 'interviews.html', big: (d.media || []).length || '▶', title: { ar: 'لقاءاته', en: 'Interviews' },
			  text: { ar: 'بصوته وصورته: لقاءات ومحاضرات وأفلام عنه.', en: 'In his own voice: interviews, talks and films about him.' } },
			{ href: 'numbers.html', big: '#', title: { ar: 'بالأرقام والأسلوب', en: 'Numbers & style' },
			  text: { ar: 'ربع قرن من الكتابة في أرقام، وأسلوبه نفسه: كلماته وجمله ونقاطه «..».', en: 'A quarter-century of writing in figures, and his style itself: his words, his sentences, his “..”.' } },
			{ href: 'audio.html', big: audioCount || '▶', title: { ar: 'مسموع', en: 'Audio' },
			  text: { ar: 'أعداده وكتبه مسموعة على Audiohat وStorytel و«اقرألي» وYouTube، على شريط كاسيت واحد.', en: 'His issues and books as recordings on Audiohat, Storytel, Iqraaly and YouTube, on one cassette.' } },
			/* (the blog's and the map's totals from the data build, tools/build-data.js: this page loads neither the blog nor the map) */
			{ href: 'blog.html', big: st.posts || '✒', title: { ar: 'المدونة', en: 'The Blog' },
			  text: { ar: 'مقالاته وقصصه القصيرة وكوميكسه، مجموعة من أرشيف المدونة.', en: 'His columns, short stories and comics, gathered from the blog archive.' } },
			{ href: 'blog.html#papers', big: st.papers || '📰', title: { ar: 'في الصحف', en: 'In the papers' },
			  text: { ar: 'مقالاته وقصصه في ' + App.num(st.outlets || 0) + ' جريدة ومجلة وموقعًا، عامًا عامًا: التحرير وبص وطل وإضاءات والدستور وغيرها.', en: 'His pieces in ' + (st.outlets || 0) + ' papers, magazines and sites, year by year: Al-Tahrir, Bos w Tol, Ida2at, Al-Dostour and more.' } },
			{ href: 'covers.html', big: editions || '▦', title: { ar: 'الأغلفة والطبعات', en: 'Covers & editions' },
			  text: { ar: 'كل غلاف على جدار واحد، وكل طبعة مسجّلة بدارها وعامها.', en: 'Every cover on one wall, and every edition recorded with its publisher and year.' } },
			{ href: 'quotes.html', big: (d.quotes || []).length || '«»', title: { ar: 'اقتباسات', en: 'Quotes' },
			  text: { ar: 'كلماته الموثّقة فقط — كل اقتباس بمصدره.', en: 'Only his verified words — every quote with its source.' } },
			{ href: 'writers.html', big: window.People ? window.People.all().length : writersCount, title: { ar: 'دائرته', en: 'His circle' },
			  text: { ar: 'من كتب معه، ومن قدّم لهم وقدّموا له، ومن خرج من عباءته — على رفوفهم، ثم كلهم أبجديًا.', en: 'Who wrote with him, who he introduced and who introduced him, and who grew up reading him — on their shelves, then all of them A to Z.' } },
			{ href: 'publishers.html', big: (d.publishers || []).length, title: { ar: 'دور النشر', en: 'Publishers' },
			  text: { ar: 'الدور والمنصات التي نشرته، من «روايات مصرية للجيب» إلى آخر طبعاته — ولكل دار صفحتها.', en: 'The houses and platforms that published him, from the Egyptian Pocket Novels to his latest editions — each with its own page.' } },
			{ href: 'legacy.html', big: (d.legacy || []).length || '∞', title: { ar: 'الإرث', en: 'The legacy' },
			  text: { ar: 'ما تركه في جيل كامل من القرّاء: الوداع والتكريم وما جرى بعد رحيله.', en: 'What he left a whole generation of readers: the farewell, the honours, and what came after him.' } },
			{ href: 'tributes.html', big: (d.tributes || []).length || '❝', title: { ar: 'قالوا عنه', en: 'Tributes' },
			  text: { ar: 'ما قاله عنه كُتّاب وفنانون، يوم رحيله وفي ذكراه.', en: 'What writers and artists said about him when he left, and on his anniversaries.' } },
			{ href: 'map.html', big: st.places || '✦', title: { ar: 'الخريطة', en: 'The map' },
			  text: { ar: 'الأماكن التي تذكرها كتبه على خريطة العالم، من غابات رومانيا إلى نهر الأمازون.', en: 'The places his books name, on a map of the world, from the forests of Romania to the Amazon.' } },
			{ href: 'calendar.html', big: App.num(366), title: { ar: 'تقويم العرّاب', en: 'The calendar' },
			  text: { ar: 'كل يوم من أيام السنة، وما جرى فيه من حياته وكتبه.', en: 'Every day of the year, and what happened on it in his life and books.' } },
			{ href: 'wanted.html', big: '+', title: { ar: 'ما ينقص الأرشيف', en: 'What the archive lacks' },
			  text: { ar: 'غلاف أو طبعة أو إهداء بخط يده أو تسجيل — ما نبحث عنه الآن، وكيف تضيفه.', en: 'A cover, an edition, an inscription in his hand, a recording — what we are looking for now, and how to add it.' } }
		];
		document.getElementById('explore').innerHTML = cards.map(function (c) {
			return '<a class="rise" href="' + c.href + '"><span class="big">' + e(c.big) + '</span><h3>' + tx(c.title) + '</h3><p>' + tx(c.text) + '</p><span class="go">' + (App.lang === 'ar' ? 'ادخل ←' : 'Enter →') + '</span></a>';
		}).join('');
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
			'<img class="grave-img" src="assets/img/grave.webp" loading="lazy" decoding="async" alt="' + App.esc(L('قبر أحمد خالد توفيق، مغطّى برسائل قرّائه، وعليه «جعل الشباب يقرأون»', 'The grave of Ahmed Khaled Tawfik, covered in notes from his readers, inscribed “He made the young read”')) + '">' +
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

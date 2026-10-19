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
		var issues = series.reduce(function (n, s) { return n + (+s.count || 0); }, 0);
		var writersCount = ['collaborators', 'introductions', 'influenced', 'contemporaries', 'translated']
			.reduce(function (n, k) { return n + ((w[k] || []).length); }, 0);

		/* hero text */
		document.getElementById('hero-text').innerHTML =
			'<p class="eyebrow">' + (App.lang === 'ar' ? 'ديسكوغرافيا أدبية' : 'A literary discography') + '</p>' +
			/* his name as lettered on the Ma Wara' al-Tabi'a covers — always in Arabic, the English name sits under it */
			'<h1><span class="name-ar name-cover" lang="ar" dir="rtl">د. أحمد خالد توفيق</span>' +
			'<span class="name-en" lang="en">Dr. Ahmed Khaled Tawfik</span></h1>' +
			'<div class="godfather"><small>العرّاب</small>The Godfather</div>' +
			'<p class="dates">' + year(bio.born && bio.born.date) + ' — ' + year(bio.died && bio.died.date) +
				(bio.profession ? ' · ' + tx(bio.profession) : '') + '</p>' +
			(bio.motto ? '<blockquote>' + tx(bio.motto) + '<cite>— ' + tx(bio.name) + '</cite></blockquote>' : '') +
			'<div class="stats">' +
				stat(issues, { ar: 'عددًا في السلاسل', en: 'series issues' }) +
				stat(series.length, { ar: 'سلسلة', en: 'series' }) +
				stat(works.length, { ar: 'كتابًا مستقلًا', en: 'standalone books' }) +
				stat(chars.length, { ar: 'شخصية', en: 'characters' }) +
			'</div>';

		function stat(n, label) { return '<div class="stat"><b>' + App.num(n) + '</b><span>' + tx(label) + '</span></div>'; }

		/* hero portrait (linked from Youm7, credited under the photo) */
		var photo = bio.photo || {
			src: 'https://img.youm7.com/ArticleImgs/2018/4/6/112144-%D8%A7%D9%84%D8%B9%D8%B1%D8%A7%D8%A8-%D8%A3%D8%AD%D9%85%D8%AF-%D8%AE%D8%A7%D9%84%D8%AF-%D8%AA%D9%88%D9%81%D9%8A%D9%82.jpg',
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
			return '<li class="rise"><div class="yr">' + App.num(ev.year) + '</div><h3>' + tx(ev.title) + '</h3><p>' + tx(ev.text) + '</p></li>';
		}).join('');

		/* explore */
		var cards = [
			{ href: 'guide.html', big: '?', title: { ar: 'من أين أبدأ؟', en: 'Where to start' },
			  text: { ar: 'جديد على عالمه؟ مسارات قراءة مقترحة حسب ذوقك.', en: 'New to his world? Suggested reading paths for every taste.' } },
			{ href: 'works.html', big: series.length + works.length, title: { ar: 'الأعمال', en: 'The Works' },
			  text: { ar: 'السلاسل والروايات والمقالات والترجمات — كتب ثلاثية الأبعاد تتصفحها من الداخل.', en: 'Series, novels, essays and translations — 3D books you can open and leaf through.' } },
			{ href: 'characters.html', big: chars.length, title: { ar: 'الشخصيات', en: 'The Characters' },
			  text: { ar: 'رفعت إسماعيل وعبير وعلاء عبد العظيم ومن عاش معهم بين الصفحات.', en: 'Refaat Ismail, Abeer, Alaa Abdel Azim and everyone who lived beside them on the page.' } },
			{ href: 'writers.html', big: writersCount, title: { ar: 'الكُتّاب', en: 'The Writers' },
			  text: { ar: 'من كتب معه، ومن قدّم لهم وقدّموا له، ومن خرج من عباءته.', en: 'Who wrote with him, who he introduced and who introduced him, and who grew up reading him.' } },
			{ href: 'quotes.html', big: (d.quotes || []).length || '«»', title: { ar: 'اقتباسات', en: 'Quotes' },
			  text: { ar: 'كلماته الموثّقة فقط — كل اقتباس بمصدره.', en: 'Only his verified words — every quote with its source.' } },
			{ href: 'legacy.html', big: (d.media || []).length || '∞', title: { ar: 'الإرث', en: 'The legacy' },
			  text: { ar: 'الوداع والتكريم، ولقاءاته ومحاضراته بصوته.', en: 'The farewell, the tributes, and his interviews and talks.' } }
		];
		document.getElementById('explore').innerHTML = cards.map(function (c) {
			return '<a class="rise" href="' + c.href + '"><span class="big">' + e(c.big) + '</span><h3>' + tx(c.title) + '</h3><p>' + tx(c.text) + '</p><span class="go">' + (App.lang === 'ar' ? 'ادخل ←' : 'Enter →') + '</span></a>';
		}).join('');
	}
};

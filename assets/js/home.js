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
			'<h1><span class="name-ar">' + tx(bio.name || { ar: 'أحمد خالد توفيق', en: 'Ahmed Khaled Tawfik' }) + '</span>' +
			'<span class="name-en">' + e(App.alt(bio.name || { ar: 'أحمد خالد توفيق', en: 'Ahmed Khaled Tawfik' })) + '</span></h1>' +
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

		/* hero book: the first series, as a 3D showcase book */
		var hero = document.getElementById('hero-book');
		var s0 = series[0];
		if (s0) {
			hero.innerHTML = window.Books.showcase(window.WorksShared.seriesBook(s0));
			window.Books.initShowcase(hero);
		}

		/* bio */
		document.getElementById('bio').innerHTML = App.paras(bio.summary);

		/* timeline */
		document.getElementById('timeline').innerHTML = (d.timeline || []).map(function (ev) {
			return '<li class="rise"><div class="yr">' + App.num(ev.year) + '</div><h3>' + tx(ev.title) + '</h3><p>' + tx(ev.text) + '</p></li>';
		}).join('');

		/* explore */
		var cards = [
			{ href: 'works.html', big: series.length + works.length, title: { ar: 'الأعمال', en: 'The Works' },
			  text: { ar: 'السلاسل والروايات والمقالات والترجمات — كتب ثلاثية الأبعاد تتصفحها من الداخل.', en: 'Series, novels, essays and translations — 3D books you can open and leaf through.' } },
			{ href: 'characters.html', big: chars.length, title: { ar: 'الشخصيات', en: 'The Characters' },
			  text: { ar: 'رفعت إسماعيل وعبير وعلاء عبد العظيم ومن عاش معهم بين الصفحات.', en: 'Refaat Ismail, Abeer, Alaa Abdel Azim and everyone who lived beside them on the page.' } },
			{ href: 'writers.html', big: writersCount, title: { ar: 'الكُتّاب', en: 'The Writers' },
			  text: { ar: 'من كتب معه، ومن قدّم لهم وقدّموا له، ومن خرج من عباءته.', en: 'Who wrote with him, who he introduced and who introduced him, and who grew up reading him.' } }
		];
		document.getElementById('explore').innerHTML = cards.map(function (c) {
			return '<a class="rise" href="' + c.href + '"><span class="big">' + e(c.big) + '</span><h3>' + tx(c.title) + '</h3><p>' + tx(c.text) + '</p><span class="go">' + (App.lang === 'ar' ? 'ادخل ←' : 'Enter →') + '</span></a>';
		}).join('');
	}
};

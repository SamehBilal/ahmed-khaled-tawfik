/* Shared runtime: language, theme, header/footer, search, deep links, helpers.
   Each page sets window.PAGE = { id, render() } before this file loads. */
(function () {
	'use strict';

	var LANG_KEY = 'akt-lang';
	var THEME_KEY = 'akt-theme';
	var REPO = 'https://github.com/SamehBilal/ahmed-khaled-tawfik';

	var UI = {
		nav: [
			{ id: 'home', href: 'index.html', ar: 'الرئيسية', en: 'Home' },
			{ id: 'guide', href: 'guide.html', ar: 'من أين أبدأ؟', en: 'Start here' },
			{ id: 'works', href: 'works.html', ar: 'الأعمال', en: 'Works' },
			{ id: 'characters', href: 'characters.html', ar: 'الشخصيات', en: 'Characters' },
			{ id: 'writers', href: 'writers.html', ar: 'دائرته', en: 'His circle' },
			{ id: 'quotes', href: 'quotes.html', ar: 'اقتباسات', en: 'Quotes' },
			{ id: 'audio', href: 'audio.html', ar: 'مسموع', en: 'Audio' },
			{ id: 'legacy', href: 'legacy.html', ar: 'الإرث', en: 'Legacy' },
			{ id: 'tributes', href: 'tributes.html', ar: 'قالوا عنه', en: 'Tributes' },
			{ id: 'blog', href: 'blog.html', ar: 'المدونة', en: 'Blog' },
			/* in the phone menu only (on a wider screen the «My lists» button is always at hand) */
			{ id: 'lists', href: 'lists.html', ar: 'قوائمي ورحلتي', en: 'My lists & journey', phone: true },
			/* and the pages made from the data, which on a wider screen the footer lists */
			{ id: 'numbers', href: 'numbers.html', ar: 'بالأرقام والأسلوب', en: 'Numbers & style', phone: true },
			{ id: 'quiz', href: 'quiz.html', ar: 'ركن القرّاء', en: 'Readers’ corner', phone: true },
			{ id: 'map', href: 'map.html', ar: 'الخريطة', en: 'The map', phone: true },
			{ id: 'world', href: 'world.html', ar: 'حول العالم', en: 'Around the world', phone: true },
			{ id: 'screen', href: 'screen.html', ar: 'على الشاشة', en: 'On screen', phone: true },
			{ id: 'covers', href: 'covers.html', ar: 'الأغلفة والطبعات', en: 'Covers & editions', phone: true },
			{ id: 'talks', href: 'talks.html', ar: 'سيرته ولقاءاته', en: 'His life & interviews', phone: true },
			{ id: 'awards', href: 'awards.html', ar: 'الجوائز', en: 'Awards', phone: true },
			{ id: 'translations', href: 'translations.html', ar: 'ترجماته', en: 'His translations', phone: true },
			{ id: 'library', href: 'library.html', ar: 'مكتبته', en: 'His library', phone: true },
			/* «عالم العرّاب» (the footer's block of its own) */
			{ id: 'creatures', href: 'creatures.html', ar: 'وحوش وأساطير', en: 'Monsters & legends', phone: true },
			{ id: 'refaat-life', href: 'refaat-life.html', ar: 'يوميات رفعت إسماعيل', en: 'Refaat Ismail’s life', phone: true },
			{ id: 'network', href: 'network.html', ar: 'شبكة العرّاب', en: 'The Godfather’s web', phone: true },
			{ id: 'handwriting', href: 'handwriting.html', ar: 'بخط يده', en: 'In his hand', phone: true },
			{ id: 'worlds', href: 'worlds.html', ar: 'عوالم فانتازيا', en: 'Fantasia’s worlds', phone: true },
			{ id: 'clinic', href: 'clinic.html', ar: 'عيادة سافاري', en: 'The Safari clinic', phone: true },
			{ id: 'names', href: 'names.html', ar: 'أعلام في حكاياته', en: 'Figures in his tales', phone: true },
			{ id: 'calendar', href: 'calendar.html', ar: 'تقويم العرّاب', en: 'The Godfather’s calendar', phone: true },
			{ id: 'compare', href: 'compare.html', ar: 'السلاسل جنبًا إلى جنب', en: 'The series side by side', phone: true },
			{ id: 'era', href: 'era.html', ar: 'زمن العرّاب', en: 'The Godfather’s times', phone: true },
			{ id: 'remembrance', href: 'remembrance.html', ar: 'ذكراه كل عام', en: 'Remembered every year', phone: true },
			{ id: 'reader-stories', href: 'reader-stories.html', ar: 'حكايات القرّاء', en: 'Readers’ stories', phone: true }
		],
		toggle: { ar: 'English', en: 'العربية' },
		motto: { ar: 'جعل الشباب يقرؤون', en: 'He made the young read' },
		/* the publishers directory and the pages made from the data, linked from the footer (and the home page), not the header —
		   the directory among the main pages, the rest under «اكتشف أكثر» */
		more: [
			{ href: 'publishers.html', ar: 'دور النشر', en: 'Publishers', main: true },
			/* and beside it, the books and films he loved */
			{ href: 'library.html', ar: 'مكتبته', en: 'His library', main: true },
			/* the pages made from the data: his work and his style in numbers, the quiz, the map */
			{ href: 'numbers.html', ar: 'بالأرقام والأسلوب', en: 'Numbers & style' },
			{ href: 'quiz.html', ar: 'ركن القرّاء', en: 'Readers’ corner' },
			/* the reader's own lists and journey: the «My lists» button's page, in the footer too */
			{ href: 'lists.html', ar: 'قوائمي ورحلتي', en: 'My lists & journey' },
			{ href: 'map.html', ar: 'الخريطة', en: 'The map' },
			/* and seven more: his books in translation, on screen, every cover, your own journey, the editions, his interviews, his awards */
			{ href: 'world.html', ar: 'حول العالم', en: 'Around the world' },
			{ href: 'screen.html', ar: 'على الشاشة', en: 'On screen' },
			{ href: 'covers.html', ar: 'الأغلفة والطبعات', en: 'Covers & editions' },
			{ href: 'talks.html', ar: 'سيرته ولقاءاته', en: 'His life & interviews' },
			{ href: 'awards.html', ar: 'الجوائز', en: 'Awards' },
			{ href: 'translations.html', ar: 'ترجماته', en: 'His translations' },
			/* his handwriting (his city is a part of «سيرته» on talks.html) */
			{ href: 'handwriting.html', ar: 'بخط يده', en: 'In his hand' },
			/* the whole year, a day at a time */
			{ href: 'calendar.html', ar: 'تقويم العرّاب', en: 'The Godfather’s calendar' },
			/* his series in one table, and his work beside the world it came out in */
			{ href: 'compare.html', ar: 'السلاسل جنبًا إلى جنب', en: 'The series side by side' },
			{ href: 'era.html', ar: 'زمن العرّاب', en: 'The Godfather’s times' },
			/* his memory each year since, and his readers' own stories */
			{ href: 'remembrance.html', ar: 'ذكراه كل عام', en: 'Remembered every year' },
			{ href: 'reader-stories.html', ar: 'حكايات القرّاء', en: 'Readers’ stories' }
		],
		/* «عالم العرّاب»: the pages inside his world, a block of their own under «صفحات الموقع» */
		world: [
			{ href: 'creatures.html', ar: 'وحوش وأساطير', en: 'Monsters & legends' },
			{ href: 'refaat-life.html', ar: 'يوميات رفعت إسماعيل', en: 'Refaat Ismail’s life' },
			{ href: 'network.html', ar: 'شبكة العرّاب', en: 'The Godfather’s web' },
			{ href: 'worlds.html', ar: 'عوالم فانتازيا', en: 'Fantasia’s worlds' },
			{ href: 'clinic.html', ar: 'عيادة سافاري', en: 'The Safari clinic' },
			{ href: 'names.html', ar: 'أعلام في حكاياته', en: 'Figures in his tales' }
		],
		/* pages linked only from the footer, not the header */
		legal: [
			{ href: 'about.html', ar: 'عن الموقع والأسئلة', en: 'About & FAQ' },
			{ href: 'sources.html', ar: 'المصادر', en: 'Sources' },
			{ href: 'privacy.html', ar: 'الخصوصية', en: 'Privacy' },
			{ href: 'terms.html', ar: 'حقوق الاستخدام', en: 'Rights & use' },
			{ href: 'contact.html', ar: 'تواصل وساهم', en: 'Contact & contribute' },
			{ href: 'wanted.html', ar: 'ما ينقص الأرشيف', en: 'Wanted for the archive' },
			{ href: 'changelog.html', ar: 'سجل التحديثات', en: 'Changelog' },
			{ href: 'story.html', ar: 'قصة الموقع', en: 'The site’s story' },
			{ href: 'sitemap.html', ar: 'خريطة الموقع', en: 'Site map' }
		],
		/* the pages that are now a section of another, in no menu but found by the search and named on the site map */
		sections: [
			{ href: 'blog.html#papers', ar: 'في الصحف', en: 'In the papers' },
			{ href: 'quotes.html#glossary', ar: 'قاموس العرّاب', en: 'The phrasebook' }
		],
		fix: { ar: 'وجدت خطأً أو لديك إضافة؟ اقترح تصحيحًا ↗', en: 'Spotted a mistake or have an addition? Suggest a correction ↗' },
		/* the footer's last column: who made the site (the notes and credits live on about.html) */
		maker: {
			line: { ar: 'موقع محبّين غير رسمي، صُنع تقديرًا لأحمد خالد توفيق <span style="white-space:nowrap">(1962–2018)</span>. البيانات مجمّعة من مصادر عامة — راجع <a href="sources.html">صفحة المصادر</a>.', en: 'An unofficial fan tribute to Ahmed Khaled Tawfik <span style="white-space:nowrap">(1962–2018)</span>. Data compiled from public sources — see the <a href="sources.html">Sources page</a>.' },
			email: 'sameh.bilal@outlook.com',
			github: 'https://github.com/SamehBilal',
			portfolio: 'https://samehbilal.github.io/portfolio/',
			whatsapp: 'https://wa.me/201064444286'
		}
	};

	/* the footer's night, shared with the main menu's cards: Safari's sunset in the shape of Africa (its ids prefixed, p,
	   so the footer's and the menu's copies do not meet) and the three bats */
	function ftAfrica(p) {
		return ('<svg class="ft-africa" viewBox="0 0 100 110"><defs>' +
			'<linearGradient id="ft-sun" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#b4c86a"/><stop offset=".55" stop-color="#86a045"/><stop offset="1" stop-color="#5a6b2a"/></linearGradient>' +
			'<mask id="ft-bands"><rect width="100" height="110" fill="#fff"/><g fill="#000"><rect x="0" y="15" width="64" height="1.6"/><rect x="10" y="23" width="70" height="1.6"/><rect x="0" y="31" width="58" height="1.6"/><rect x="20" y="39" width="70" height="1.4"/></g></mask></defs>' +
			'<g mask="url(#ft-bands)" fill="url(#ft-sun)"><path d="M18 6 40 2 55 6 62 4 70 10 76 26 86 34 98 36 90 48 82 60 80 72 76 80 72 92 64 104 52 108 46 100 42 86 40 72 38 60 36 52 30 50 18 52 8 46 2 36 4 24 10 14Z"/>' +
			'<ellipse cx="88" cy="84" rx="3" ry="7" transform="rotate(20 88 84)"/></g></svg>').replace(/ft-(sun|bands|africa)/g, p + '-$1');
	}
	/* the bats: after Calleb's CodePen "Halloween" (codepen.io/Calleb/pen/vYZqgwz, MIT) —
	   three of them, wings flapping, eyes glowing, each on its own flight path */
	function penBat(k) {
		return '<g class="pb pb' + k + '">' +
			'<path d="M306.9,145.4l-7.3,7.3l-7.3-7.3c-0.6-0.6-1.6-0.2-1.6,0.6v7.9h7.6h2.5h7.6V146C308.5,145.2,307.5,144.8,306.9,145.4z"/>' +
			'<path class="pb-w" d="M408.4,167.5c-3.3-2.7-7.6-4.4-12.2-4.4c-9.3,0-17.1,6.6-18.9,15.4c-2.8-1.6-6.1-2.5-9.6-2.5c-8.5,0-15.7,5.5-18.3,13.1c-3-6.6-9.7-11.3-17.5-11.3c-7.7,0-14.4,4.6-17.5,11.1c-6.9-4.7-11-10.7-11-17.1c0-2.4,0.6-4.7,1.6-6.9c0.2,0,0.4,0,0.7,0c24.7,0,45.4-9,51.2-21.1C383,144.1,404.5,154.3,408.4,167.5z"/>' +
			'<path class="pb-w1" d="M191.6,167.5c3.3-2.7,7.6-4.4,12.2-4.4c9.3,0,17.1,6.6,18.9,15.4c2.8-1.6,6.1-2.5,9.6-2.5c8.5,0,15.7,5.5,18.3,13.1c3-6.6,9.7-11.3,17.5-11.3c7.7,0,14.4,4.6,17.5,11.1c6.9-4.7,11-10.7,11-17.1c0-2.4-0.6-4.7-1.6-6.9c-0.2,0-0.4,0-0.7,0c-24.7,0-45.4-9-51.2-21.1C217,144.1,195.5,154.3,191.6,167.5z"/>' +
			'<path d="M312.3,158.2c0,5.2-6,27.3-12.9,27.3c-7,0-12.3-22.1-12.3-27.3s5.7-9.5,12.6-9.5C306.6,148.8,312.3,153,312.3,158.2z"/>' +
			'<ellipse class="pb-eye" cx="295.2" cy="161.8" rx="1.5" ry="3"/><ellipse class="pb-eye" cx="304.2" cy="161.8" rx="1.5" ry="3"/>' +
		'</g>';
	}
	function ftBats(cls) { return '<svg class="' + cls + '" viewBox="0 0 600 400" preserveAspectRatio="xMidYMid meet">' + penBat(0) + penBat(1) + penBat(2) + '</svg>'; }

	/* ---------- the main menu on a wider screen: six words, four of them opening a large panel ----------
	   «أعماله» his three series as covers and the rest as a list, with «من أين أبدأ؟» along its foot; «عالمه» the pages
	   inside his stories beside three of his heroes standing; «حياته» his life and his writing in two columns beside his
	   photograph and his wish for his headstone; «إرثه» what he left, a still from the Netflix series and his books year
	   by year. (On a phone the links fold into the contents page instead: UI.nav.) The pictures load on the first move
	   towards the menu, not with the page. */
	var MEGA_ICONS = {
		books: '<path d="M4 19V5h4v14zM8 5h4v14H8M13 6l3.6-1 3.4 13.5-3.6 1z"/>',
		columns: '<path d="M4 4h4v16H4zM10 4h4v16h-4zM16 4h4v16h-4z"/>',
		image: '<path d="M4 5h16v14H4z"/><path d="m4 16 5-5 4 4 2-2 5 5"/><circle cx="15.5" cy="9" r="1.5"/>',
		translate: '<path d="M4 6h9M8.5 4v2M6 6c1 4 4 7 7 8M11 6c-1 4-4 7-7 8M14 20l3.5-9 3.5 9M15.2 17h4.6"/>',
		headphones: '<path d="M4 15v-3a8 8 0 0 1 16 0v3M4 15h3v5H5a1 1 0 0 1-1-1zM20 15h-3v5h2a1 1 0 0 0 1-1z"/>',
		building: '<path d="M5 20V6l7-3 7 3v14M3 20h18M9 9h1M14 9h1M9 13h1M14 13h1M10 20v-3h4v3"/>',
		people: '<circle cx="9" cy="8" r="3"/><path d="M3 20c0-3 3-5 6-5s6 2 6 5M16 5a3 3 0 0 1 0 6M18 15c2 .5 3 2.2 3 5"/>',
		bat: '<path d="M12 9c-1.6-2.2-4.6-3.3-9-2.2 1.8 1.4 2 3.6 1 6 2-1.1 4-.9 5 1 .8-1.5 2-1.6 3-.6 1-1 2.2-.9 3 .6 1-1.9 3-2.1 5-1-1-2.4-.8-4.6 1-6-4.4-1.1-7.4 0-9 2.2Z"/>',
		diary: '<path d="M6 3h12v18H6zM9 3v18M12 8h3M12 12h3"/>',
		bookOpen: '<path d="M12 6.5C10 5 7 4.5 4 5v14c3-.5 6 0 8 1.5 2-1.5 5-2 8-1.5V5c-3-.5-6 0-8 1.5ZM12 6.5V20"/>',
		clinic: '<path d="M6 3v6a4 4 0 0 0 8 0V3M10 13v1.5a5 5 0 0 0 10 0V12"/><circle cx="20" cy="10" r="2"/>',
		star: '<path d="m12 3 2.6 5.3 5.9.9-4.3 4.1 1 5.8-5.2-2.8-5.2 2.8 1-5.8-4.3-4.1 5.9-.9z"/>',
		map: '<path d="m3 6 6-2 6 2 6-2v14l-6 2-6-2-6 2zM9 4v14M15 6v14"/>',
		web: '<circle cx="12" cy="5" r="2"/><circle cx="5" cy="18" r="2"/><circle cx="19" cy="18" r="2"/><path d="M12 7v4m0 0-5.5 5.6M12 11l5.5 5.6M7 18h10"/>',
		mic: '<path d="M12 3a3 3 0 0 1 3 3v5a3 3 0 0 1-6 0V6a3 3 0 0 1 3-3ZM5 11a7 7 0 0 0 14 0M12 18v3"/>',
		clock: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7v5l3.5 2"/>',
		calendar: '<path d="M4 6h16v14H4zM4 10h16M8 3v4M16 3v4"/>',
		award: '<circle cx="12" cy="9" r="5.5"/><path d="m9 14-2 7 5-2.6 5 2.6-2-7"/>',
		pen: '<path d="M4 20h4L19 9l-4-4L4 16zM13 7l4 4"/>',
		quote: '<path d="M6 8h4v4c0 3-1.6 4.6-4 5.5M14 8h4v4c0 3-1.6 4.6-4 5.5"/>',
		hand: '<path d="M14 4l6 6-8.5 8.5-6-6zM5.5 12.5 3 21l8.5-2.5"/><circle cx="9.5" cy="14.5" r="1.3"/>',
		shelf: '<path d="M4 4v16M8 4v16M3 20h18M12 6l3.6-1.2 3.4 14-3.6 1.2z"/>',
		sprout: '<path d="M12 21v-9M12 12C12 7 8.5 4.5 4 4.5 4 9 7 12 12 12ZM12 14c0-4 3-6.5 8-6.5 0 4.5-3 6.5-8 6.5Z"/>',
		heart: '<path d="M12 20s-7.5-4.6-7.5-10A4.3 4.3 0 0 1 12 7.3 4.3 4.3 0 0 1 19.5 10c0 5.4-7.5 10-7.5 10Z"/>',
		film: '<path d="M4 5h16v14H4zM8 5v14M16 5v14M4 9h4M4 15h4M16 9h4M16 15h4"/>',
		globe: '<circle cx="12" cy="12" r="8.5"/><path d="M3.5 12h17M12 3.5c2.6 2.5 3.8 5.3 3.8 8.5S14.6 18 12 20.5C9.4 18 8.2 15.2 8.2 12S9.4 6 12 3.5Z"/>',
		puzzle: '<path d="M5 8h3.5a2 2 0 1 1 4 0H16v3.5a2 2 0 1 1 0 4V19H12.5a2 2 0 1 0-4 0H5v-3.5a2 2 0 1 0 0-4z"/>',
		bookmark: '<path d="M7 3h10v18l-5-3.5L7 21z"/>',
		pin: '<path d="M12 21s-6.5-6.2-6.5-11.2a6.5 6.5 0 0 1 13 0C18.5 14.8 12 21 12 21Z"/><circle cx="12" cy="9.8" r="2.3"/>',
		skull: '<path d="M12 3a7.5 7.5 0 0 0-7.5 7.5c0 2.7 1.3 4.5 3 5.6V20h9v-3.9c1.7-1.1 3-2.9 3-5.6A7.5 7.5 0 0 0 12 3Z"/><circle cx="9.2" cy="11" r="1.6"/><circle cx="14.8" cy="11" r="1.6"/><path d="M10.5 20v-2.5M13.5 20v-2.5"/>',
		flame: '<path d="M12 21c-3.6 0-6-2.5-6-5.8 0-2.6 1.6-4.3 3.1-6 .4 1.6 1.2 2.6 2.2 3 0-3.2 1.4-6 3.7-8.2-.2 2.9.8 4.8 1.9 6.4 1 1.4 1.1 2.7 1.1 4.6 0 3.4-2.4 6-6 6Z"/>',
		chat: '<path d="M4 5h16v11H9l-5 4z"/><path d="M8 9h8M8 12.5h5"/>',
		candle: '<path d="M9 10h6v11H9zM12 10V7.5M12 3.5c1.2 1.2 1.6 2.2 1 3.2-.5.8-1.5.8-2 0-.6-1 .1-2 1-3.2ZM6 21h12"/>'
	};
	function megaIcon(k) {
		return '<span class="mg-ic" aria-hidden="true"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">' + MEGA_ICONS[k] + '</svg></span>';
	}
	var MEGA = {
		/* the series' own numbers (AKT.series), written here because not every page loads the data */
		series: [
			{ id: 'mwt', ar: 'ما وراء الطبيعة', en: 'Ma Wara’ al-Tabi’a', sar: '81 عددًا · 1993–2014', sen: '81 issues · 1993–2014', c: '#6e1c1c', img: 'assets/img/covers/fronts/mwt.webp' },
			{ id: 'fantasia', ar: 'فانتازيا', en: 'Fantasia', sar: '64 عددًا · 1995–2017', sen: '64 issues · 1995–2017', c: '#4b2f7a', img: 'assets/img/covers/fronts/fantasia.webp' },
			{ id: 'safari', ar: 'سافاري', en: 'Safari', sar: '53 عددًا · 1996–2018', sen: '53 issues · 1996–2018', c: '#5a6b2a', img: 'assets/img/covers/fronts/safari.webp' }
		],
		worksMore: [
			{ href: 'works.html', ic: 'books', ar: 'كل أعماله', en: 'All his works' },
			{ href: 'compare.html', ic: 'columns', ar: 'السلاسل جنبًا إلى جنب', en: 'The series side by side' },
			{ href: 'covers.html', ic: 'image', ar: 'الأغلفة والطبعات', en: 'Covers & editions' },
			{ href: 'translations.html', ic: 'translate', ar: 'ترجماته', en: 'His translations' },
			{ href: 'audio.html', ic: 'headphones', ar: 'مسموع', en: 'Audio' },
			{ href: 'publishers.html', ic: 'building', ar: 'دور النشر', en: 'Publishers' }
		],
		world: [
			{ href: 'characters.html', ic: 'people', ar: 'الشخصيات', en: 'Characters', dar: 'أبطاله ومن حولهم', den: 'His heroes and those around them' },
			{ href: 'creatures.html', ic: 'bat', ar: 'وحوش وأساطير', en: 'Monsters & legends', dar: 'ما واجهه أبطاله في الظلام', den: 'What his heroes met in the dark' },
			{ href: 'refaat-life.html', ic: 'diary', ar: 'يوميات رفعت إسماعيل', en: 'Refaat Ismail’s life', dar: 'حياة الراوي عامًا بعام', den: 'The narrator’s life, year by year' },
			{ href: 'worlds.html', ic: 'bookOpen', ar: 'عوالم فانتازيا', en: 'Fantasia’s worlds', dar: 'الحكايات التي دخلتها عبير', den: 'The stories Abeer stepped into' },
			{ href: 'clinic.html', ic: 'clinic', ar: 'عيادة سافاري', en: 'The Safari clinic', dar: 'أوبئة أفريقيا وأمراضها', den: 'Africa’s epidemics and diseases' },
			{ href: 'names.html', ic: 'star', ar: 'أعلام في حكاياته', en: 'Figures in his tales', dar: 'شخصيات حقيقية مرّت بقصصه', den: 'Real people who pass through' },
			{ href: 'map.html', ic: 'map', ar: 'الخريطة', en: 'The map', dar: 'أماكن حكاياته على الأرض', den: 'Where his tales take place' },
			{ href: 'network.html', ic: 'web', ar: 'شبكة العرّاب', en: 'The Godfather’s web', dar: 'كيف يتصل كل شيء', den: 'How it all connects' },
			/* and two parts of other pages that belong here */
			{ href: 'compare.html#villains', ic: 'skull', ar: 'أعداء وأشرار', en: 'Enemies & villains', dar: 'من واجههم أبطاله، سلسلةً سلسلة', den: 'Whom his heroes faced, series by series' },
			{ href: 'library.html#refaat', ic: 'candle', ar: 'مكتبة رفعت إسماعيل', en: 'Refaat Ismail’s library', dar: 'ما يقرؤه أبطاله داخل الحكايات', den: 'What his heroes read inside the tales' }
		],
		heroes: [
			{ id: 'refaat', ar: 'رفعت إسماعيل', en: 'Refaat Ismail', sar: 'ما وراء الطبيعة', sen: 'Ma Wara’ al-Tabi’a', c: '#6e1c1c', img: 'assets/img/characters/refaat-lantern.webp' },
			{ id: 'abeer', ar: 'عبير عبد الرحمن', en: 'Abeer Abdel Rahman', sar: 'فانتازيا', sen: 'Fantasia', c: '#4b2f7a', img: 'assets/img/characters/abeer-figure.webp' },
			{ id: 'alaa', ar: 'علاء عبد العظيم', en: 'Alaa Abdel Azim', sar: 'سافاري', sen: 'Safari', c: '#5a6b2a', img: 'assets/img/characters/alaa-figure.webp' }
		],
		life: [
			{ href: 'talks.html', ic: 'mic', ar: 'سيرته ولقاءاته', en: 'His life & interviews', dar: 'من طنطا إلى الكتابة، بصوته', den: 'From Tanta to writing, in his words' },
			{ href: 'era.html', ic: 'clock', ar: 'زمن العرّاب', en: 'The Godfather’s times', dar: 'حياته بجوار أحداث عصره', den: 'His life beside the world’s' },
			{ href: 'calendar.html', ic: 'calendar', ar: 'تقويم العرّاب', en: 'The Godfather’s calendar', dar: 'كل يوم من أيام السنة', den: 'Every day of the year' },
			{ href: 'awards.html', ic: 'award', ar: 'الجوائز', en: 'Awards', dar: 'ما ناله وما سُمّي باسمه', den: 'What he won and what bears his name' },
			{ href: 'talks.html#tanta', ic: 'pin', ar: 'طنطا، مدينته', en: 'Tanta, his city', dar: 'المدينة التي وُلد فيها وعاش ودُفن', den: 'Where he was born, lived and lies' }
		],
		writing: [
			{ href: 'blog.html', ic: 'pen', ar: 'المدونة', en: 'Blog', dar: 'مقالاته وأعمدته', den: 'His articles and columns' },
			{ href: 'quotes.html', ic: 'quote', ar: 'اقتباسات', en: 'Quotes', dar: 'جمل من كتبه', den: 'Lines from his books' },
			{ href: 'handwriting.html', ic: 'hand', ar: 'بخط يده', en: 'In his hand', dar: 'رسائله وإهداءاته', den: 'His letters and dedications' },
			{ href: 'library.html', ic: 'shelf', ar: 'مكتبته', en: 'His library', dar: 'ما أحبه ونصح به', den: 'What he loved and recommended' },
			{ href: 'writers.html', ic: 'people', ar: 'دائرته', en: 'His circle', dar: 'رفاقه ومن حملوا عالمه', den: 'His companions and heirs' }
		],
		legacy: [
			{ href: 'legacy.html', ic: 'sprout', ar: 'الإرث', en: 'Legacy', dar: 'ما تركه في جيل كامل من القرّاء', den: 'What he left a whole generation of readers' },
			{ href: 'tributes.html', ic: 'heart', ar: 'قالوا عنه', en: 'Tributes', dar: 'كتّاب وفنانون عند رحيله وفي ذكراه', den: 'Writers and artists, at his death and since' },
			{ href: 'screen.html', ic: 'film', ar: 'على الشاشة', en: 'On screen', dar: 'من نتفليكس إلى الإذاعة', den: 'From Netflix to the radio' },
			{ href: 'world.html', ic: 'globe', ar: 'حول العالم', en: 'Around the world', dar: 'كتبه بلغات أخرى', den: 'His books in other languages' },
			{ href: 'quiz.html', ic: 'puzzle', ar: 'ركن القرّاء', en: 'Readers’ corner', dar: 'اختبارات وألعاب ومن قال هذا؟', den: 'Quizzes, games and who said it?' },
			{ href: 'remembrance.html', ic: 'flame', ar: 'ذكراه كل عام', en: 'Remembered every year', dar: 'كل 2 أبريل منذ رحيله', den: 'Every 2 April since he died' },
			{ href: 'reader-stories.html', ic: 'chat', ar: 'حكايات القرّاء', en: 'Readers’ stories', dar: 'كيف عرفوه، بأقلامهم', den: 'How they found him, in their words' },
			{ href: 'lists.html', ic: 'bookmark', ar: 'قوائمي ورحلتي', en: 'My lists & journey', dar: 'ما قرأته وما تريد قراءته', den: 'What you have read and want to' }
		],
		/* the books floating along «من أين أبدأ؟»: the series' fronts, his novels and two more series (small copies, covers-s) */
		books: [
			{ href: 'series.html?id=mwt', ar: 'ما وراء الطبيعة', en: 'Ma Wara’ al-Tabi’a', img: 'assets/img/covers/fronts/mwt.webp' },
			{ href: 'series.html?id=fantasia', ar: 'فانتازيا', en: 'Fantasia', img: 'assets/img/covers/fronts/fantasia.webp' },
			{ href: 'series.html?id=safari', ar: 'سافاري', en: 'Safari', img: 'assets/img/covers/fronts/safari.webp' },
			{ href: 'book.html?id=utopia', ar: 'يوتوبيا', en: 'Utopia', img: 'novels/utopia-53524902' },
			{ href: 'book.html?id=senga', ar: 'السنجة', en: 'Al-Senga', img: 'novels/openlibrary-8b37322cd6fa' },
			{ href: 'book.html?id=icarus', ar: 'مثل إيكاروس', en: 'Like Icarus', img: 'novels/abjjad-d28ae02b1015' },
			{ href: 'book.html?id=rats', ar: 'في ممر الفئران', en: 'In the Rats’ Passage', img: 'karma/9789776467552' },
			{ href: 'book.html?id=shaabeeb', ar: 'شآبيب', en: 'Shaabeeb', img: 'novels/abjjad-0130dee0b332' },
			{ href: 'book.html?id=mirante', ar: 'الميرانتي', en: 'Al-Mirante', img: 'novels/abjjad-86a9f6dcbee1' },
			{ href: 'series.html?id=www', ar: 'WWW', en: 'WWW', img: 'series/www/abjjad-c790bc32b24a' },
			{ href: 'series.html?id=rwg', ar: 'روايات عالمية للجيب', en: 'World Fiction', img: 'assets/img/covers/fronts/rwg.webp' }
		],
		/* his own books (AKT.works) a year at a time, 2005–2018 */
		bars: [2, 2, 5, 8, 5, 3, 0, 6, 1, 5, 3, 1, 2, 3]
	};
	/* the series cards carry the footer's night, each its own part of it, and the heroes those of character.html — Refaat's fog and his lantern's breathing glow with moths circling it,
	   Abeer's stars and portal, Alaa's heartbeat (they move only while the panel is open) */
	var MEGA_FX = {
		/* Ma Wara' al-Tabi'a: the footer's haunted hill with its lit castle, its bats, eyes in the dark and fog */
		mwt: '<span class="mg-fx fx-mwt" aria-hidden="true"><i class="fog"></i><img class="hill" data-src="assets/img/footer/haunted-hill.webp" alt="">' +
			'<b class="eyes"><i></i><i></i></b><b class="eyes e2"><i></i><i></i></b>' + ftBats('ft-bats mg-bats') + '<i class="fog f2"></i></span>',
		/* Fantasia: its stars, the moon with the witch riding across it, and sparks rising from the book */
		fantasia: '<span class="mg-fx fx-fan" aria-hidden="true"><i class="stars"></i><span class="ft-luna"><span class="ft-moon"></span><img class="ft-witch" data-src="assets/img/footer/witch.webp" alt=""></span>' +
			'<i class="spark s1"></i><i class="spark s2"></i><i class="spark s3"></i><i class="spark s4"></i></span>',
		/* Safari: the sunset in the shape of Africa behind the savanna, its acacias, elephant, giraffes and car */
		safari: '<span class="mg-fx fx-saf" aria-hidden="true">' + ftAfrica('mg') + '<img class="ft-savanna" data-src="assets/img/footer/savanna.webp" alt=""></span>',
		refaat: '<span class="mg-fx fx-ghosts" aria-hidden="true"><i class="fog"></i><i class="fog f2"></i></span>',
		'refaat-in': '<span class="mg-lantern" aria-hidden="true"><b class="glow"></b>' + [0, 1, 2].map(function (i) { return '<i class="moth" style="--i:' + i + '"><b></b></i>'; }).join('') + '</span>',
		abeer: '<span class="mg-fx fx-fantasy" aria-hidden="true"><i class="stars"></i><i class="portal"></i></span>',
		alaa: '<span class="mg-fx fx-medicine" aria-hidden="true"><svg class="ecg" viewBox="0 0 240 60" preserveAspectRatio="none"><path d="M0 30H8L13 30 17 17 22 45 27 4 32 56 36 30H58L62 24 66 36 70 30H240"/></svg></span>'
	};
	/* «حياته»'s photograph carries one of his lines, a new one each time the panel opens: his wish for his headstone, or one of
	   the short quotes from his books (AKT.quotes, on the pages that load the data) with the book it is from */
	var MEGA_WISH = { text: { ar: 'أما أنا فأريد أن يُكتب على قبري: «جعل الشباب يقرؤون»', en: 'I want my headstone to say: “He made the young read”' } };
	var megaLastQuote = -1;
	function megaQuoteHTML(App) {
		var list = [MEGA_WISH].concat(((window.AKT && window.AKT.quotes) || []).filter(function (q) {
			var t = q.text && q.text[App.lang];
			return t && t.length <= 120;
		}));
		var k = list.length > 1 ? Math.floor(Math.random() * list.length) : 0;
		if (k === megaLastQuote && list.length > 1) k = (k + 1) % list.length;
		megaLastQuote = k;
		var q = list[k], from = q.from ? App.t(q.from) : '';
		return '<q>' + App.esc(App.t(q.text)) + '</q><small>' + App.esc(App.L('د. أحمد خالد توفيق', 'Dr. Ahmed Khaled Tawfik')) +
			(from ? ' · ' + App.esc(from) : ' · 1962–2018') + '</small>';
	}
	/* which panel holds this page: its own pages, and the pages made one per series, book, character or writer */
	function megaGroupOf(file) {
		var g = { 'series.html': 'works', 'book.html': 'works', 'publisher.html': 'works', 'character.html': 'world', 'writer.html': 'life', 'numbers.html': 'legacy' }[file];
		if (g) return g;
		var groups = { works: MEGA.worksMore, world: MEGA.world, life: MEGA.life.concat(MEGA.writing), legacy: MEGA.legacy };
		for (var k in groups) if (groups[k].some(function (n) { return n.href === file; })) return k;
		return '';
	}
	function megaHTML(App, file) {
		var L = App.L, e = App.esc;
		var cur = function (href) { return href === file ? ' aria-current="page"' : ''; };
		var arrow = '<span class="mg-arr" aria-hidden="true">' + (App.lang === 'ar' ? '←' : '→') + '</span>';
		var item = function (n, cls) {
			return '<a class="' + (cls || 'mg-item') + '" href="' + n.href + '"' + cur(n.href) + '>' + (n.ic ? megaIcon(n.ic) : '') +
				'<span class="mg-tx"><b>' + e(L(n.ar, n.en)) + '</b>' + (n.dar ? '<small>' + e(L(n.dar, n.den)) + '</small>' : '') + '</span></a>';
		};
		var img = function (src, cls) { return '<img class="' + cls + '" data-src="' + src + '" alt="" decoding="async">'; };
		var panel = function (id, label, inner) {
			return '<div class="mega mega-' + id + '" id="mega-' + id + '" role="group" aria-label="' + e(label) + '"><div class="mega-in">' + inner + '</div></div>';
		};
		var top = function (id, ar, en) {
			var on = megaGroupOf(file) === id;
			return '<button class="mnav-btn' + (on ? ' is-here' : '') + '" type="button" aria-expanded="false" aria-controls="mega-' + id + '" data-mega="' + id + '">' + e(L(ar, en)) +
				'<svg class="mnav-chev" viewBox="0 0 12 12" width="10" height="10" aria-hidden="true"><path d="M2.5 4.5 6 8l3.5-3.5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg></button>';
		};
		var link = function (href, ar, en, cls) { return '<a class="mnav-link' + (cls ? ' ' + cls : '') + '" href="' + href + '"' + cur(href) + '>' + e(L(ar, en)) + '</a>'; };

		var works = panel('works', L('أعماله', 'His works'),
			'<div class="mg-cards">' + MEGA.series.map(function (s) {
				return '<a class="mg-card" href="series.html?id=' + s.id + '" style="--c:' + s.c + '"' + (file === 'series.html' && /[?&]id=/.test(location.search) && new RegExp('[?&]id=' + s.id + '(&|$)').test(location.search) ? ' aria-current="page"' : '') + '>' +
					MEGA_FX[s.id] + '<span class="mg-card-t"><b>' + e(L(s.ar, s.en)) + '</b><small>' + e(L(s.sar, s.sen)) + '</small></span>' + img(s.img, 'mg-cover') + '</a>';
			}).join('') +
			'</div>' +
			'<div class="mg-more"><p class="mg-h">' + L('المزيد', 'More') + '</p>' + MEGA.worksMore.map(function (n) {
				return '<a class="mg-row" href="' + n.href + '"' + cur(n.href) + '>' + megaIcon(n.ic) + '<b>' + e(L(n.ar, n.en)) + '</b>' + arrow + '</a>';
			}).join('') + '</div>' +
			/* along the foot: the way in for a new reader, and his books floating beside it — the three series' first covers,
			   his novels and two more series — each opening its own page */
			'<div class="mg-band"><a class="mg-band-tx" href="guide.html"' + cur('guide.html') + '><b>' + L('من أين أبدأ؟', 'Where to start?') + ' <em>' + L('للقارئ الجديد', 'New reader') + '</em></b>' +
				'<small>' + L('مسارات قراءة مقترحة حسب ذوقك', 'Reading paths to suit your taste') + ' ' + arrow + '</small></a>' +
				'<span class="mg-band-art">' + MEGA.books.map(function (b, i) {
					return '<a class="mg-chip" href="' + b.href + '" title="' + e(L(b.ar, b.en)) + '" style="--x:' + (i * 100 / (MEGA.books.length - 1)).toFixed(1) + '%;--y:' + [6, 20, 2, 16, 8, 22, 4, 18, 10, 24, 0][i % 11] + 'px;--r:' + [-9, 6, -4, 8, -6, 4, -8, 7, -3, 9, -5][i % 11] + 'deg;--d:' + (-i * 0.55).toFixed(2) + 's">' +
						img(b.img.indexOf('assets/') === 0 ? b.img : 'assets/img/covers-s/' + b.img + '.webp', 'mg-chip-img') + '<span class="visually-hidden">' + e(L(b.ar, b.en)) + '</span></a>';
				}).join('') + '</span></div>');

		var world = panel('world', L('عالمه', 'His world'),
			'<div class="mg-list">' + MEGA.world.map(function (n) { return item(n); }).join('') + '</div>' +
			'<div class="mg-figs">' + MEGA.heroes.map(function (h) {
				return '<a class="mg-fig mg-fig-' + h.id + '" href="character.html?id=' + h.id + '" style="--c:' + h.c + '">' + (MEGA_FX[h.id] || '') +
					'<span class="mg-fig-box">' + img(h.img, 'mg-fig-img') + (MEGA_FX[h.id + '-in'] || '') + '</span>' +
					'<span class="mg-fig-t"><b>' + e(L(h.ar, h.en)) + '</b><small>' + e(L(h.sar, h.sen)) + '</small></span></a>';
			}).join('') + '</div>');

		var life = panel('life', L('حياته', 'His life'),
			'<div class="mg-col"><p class="mg-h">' + L('سيرته', 'His life') + '</p>' + MEGA.life.map(function (n) { return item(n); }).join('') + '</div>' +
			'<div class="mg-col"><p class="mg-h">' + L('كتاباته ودائرته', 'His writing & circle') + '</p>' + MEGA.writing.map(function (n) { return item(n); }).join('') + '</div>' +
			'<a class="mg-photo" href="quotes.html">' + img('assets/img/photos/akt-portrait-cafe.webp', 'mg-photo-img') +
				'<span class="mg-photo-tx">' + megaQuoteHTML(App) + '</span></a>');

		var max = Math.max.apply(null, MEGA.bars);
		var legacy = panel('legacy', L('إرثه', 'His legacy'),
			'<div class="mg-text">' + MEGA.legacy.map(function (n) { return item(n); }).join('') + '</div>' +
			'<a class="mg-tall" href="screen.html"' + cur('screen.html') + '>' + img('assets/img/photos/refaat-lantern-netflix.webp', 'mg-tall-img') + '<span>' + L('رفعت إسماعيل على نتفليكس', 'Refaat Ismail on Netflix') + '</span></a>' +
			'<a class="mg-data" href="numbers.html"' + cur('numbers.html') + '><span class="mg-new">' + L('بالأرقام', 'In numbers') + '</span>' +
				'<span class="mg-bars" aria-hidden="true">' + MEGA.bars.map(function (v, i) { return '<i style="height:' + Math.max(4, Math.round(v / max * 100)) + '%"' + (v === max ? ' class="hi"' : i === 7 ? ' class="hi2"' : '') + '></i>'; }).join('') + '</span>' +
				'<small class="mg-eye">' + L('كتبه عامًا بعام، 2005–2018', 'His books, year by year, 2005–2018') + '</small>' +
				'<b>' + L('عمله وأسلوبه بالأرقام', 'His work and style in numbers') + '</b>' +
				'<small>' + L('كم كتب، ومتى، وبأي الكلمات', 'How much he wrote, when, and in which words') + '</small>' +
				'<span class="mg-go">' + L('اكتشف الأرقام', 'Explore the numbers') + ' ' + arrow + '</span></a>');

		return '<nav class="mnav" aria-label="' + L('التنقل الرئيسي', 'Main') + '">' +
			link('index.html', 'الرئيسية', 'Home') +
			top('works', 'أعماله', 'His works') + top('world', 'عالمه', 'His world') + top('life', 'حياته', 'His life') + top('legacy', 'إرثه', 'His legacy') +
			link('guide.html', 'من أين أبدأ؟', 'Start here', 'mnav-start') +
			works + world + life + legacy + '</nav>';
	}
	/* open on a hover with a mouse (after a moment, at once when moving from one panel to the next), on a click or a tap,
	   on Enter or ↓; close on leaving the header, Escape, a click outside, or focus moving out */
	function wireMega(header) {
		var nav = header.querySelector('.mnav');
		if (!nav) return;
		var btns = [].slice.call(nav.querySelectorAll('.mnav-btn'));
		var openId = '', timer = 0, openedAt = 0, hydrated = false;
		var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
		var hydrate = function () {
			if (hydrated) return;
			hydrated = true;
			[].forEach.call(nav.querySelectorAll('img[data-src]'), function (im) { im.src = im.getAttribute('data-src'); im.removeAttribute('data-src'); });
		};
		var set = function (id) {
			clearTimeout(timer);
			if (id) hydrate();
			/* a new line of his on the photograph each time «حياته» opens */
			if (id === 'life' && openId !== 'life') {
				var tx = nav.querySelector('.mg-photo-tx');
				if (tx && window.App) tx.innerHTML = megaQuoteHTML(window.App);
			}
			openId = id;
			btns.forEach(function (b) {
				var on = b.dataset.mega === id;
				b.setAttribute('aria-expanded', String(on));
				document.getElementById('mega-' + b.dataset.mega).classList.toggle('is-open', on);
			});
			header.classList.toggle('mega-open', !!id);
			if (id) openedAt = Date.now();
		};
		nav.addEventListener('pointerenter', hydrate);
		nav.addEventListener('focusin', hydrate);
		btns.forEach(function (b) {
			var id = b.dataset.mega;
			b.addEventListener('click', function () {
				/* a click just after the hover opened it keeps it open */
				if (openId === id && Date.now() - openedAt > 450) set('');
				else set(id);
			});
			b.addEventListener('keydown', function (ev) {
				if (ev.key === 'ArrowDown') {
					ev.preventDefault(); set(id);
					var first = document.getElementById('mega-' + id).querySelector('a');
					if (first) first.focus();
				}
			});
			b.addEventListener('pointerenter', function (ev) {
				if (ev.pointerType !== 'mouse' || !finePointer.matches) return;
				clearTimeout(timer);
				timer = setTimeout(function () { set(id); }, openId ? 0 : 110);
			});
			b.addEventListener('pointerleave', function () { if (!openId) clearTimeout(timer); });
		});
		[].forEach.call(nav.querySelectorAll('.mnav-link'), function (a) {
			a.addEventListener('pointerenter', function (ev) { if (ev.pointerType === 'mouse' && openId) { clearTimeout(timer); timer = setTimeout(function () { set(''); }, 140); } });
		});
		header.addEventListener('pointerleave', function (ev) {
			if (ev.pointerType !== 'mouse' || !openId) return;
			clearTimeout(timer);
			timer = setTimeout(function () { set(''); }, 260);
		});
		header.addEventListener('pointerenter', function (ev) {
			if (ev.pointerType === 'mouse' && openId) { clearTimeout(timer); }
		});
		nav.addEventListener('click', function (ev) { if (ev.target.closest('.mega a')) set(''); });
		nav.addEventListener('focusout', function (ev) { if (openId && ev.relatedTarget && !nav.contains(ev.relatedTarget)) set(''); });
		/* the header is drawn again when the language changes: the page-wide listeners are added once and reach the menu of the moment */
		header._mega = { nav: nav, set: set, open: function () { return openId; } };
		if (header.dataset.megaWired) return;
		header.dataset.megaWired = '1';
		document.addEventListener('keydown', function (ev) {
			var m = header._mega;
			if (ev.key !== 'Escape' || !m.open()) return;
			var b = m.nav.querySelector('[data-mega="' + m.open() + '"]');
			m.set(''); if (b) b.focus();
		});
		document.addEventListener('click', function (ev) { var m = header._mega; if (m.open() && !m.nav.contains(ev.target)) m.set(''); });
		var mq = window.matchMedia('(max-width: 760px)');
		(mq.addEventListener ? mq.addEventListener.bind(mq, 'change') : mq.addListener.bind(mq))(function () { header._mega.set(''); });
	}

	function store(k, v) {
		try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) { return null; }
	}

	/* Arabic-aware normalisation for search: strip diacritics/tatweel, unify letter variants */
	function norm(s) {
		return String(s || '').toLowerCase()
			.replace(/[ً-ٰٟـ]/g, '')
			.replace(/[أإآٱ]/g, 'ا').replace(/ة/g, 'ه').replace(/ى/g, 'ي').replace(/ؤ/g, 'و').replace(/ئ/g, 'ي')
			.replace(/[٠-٩]/g, function (d) { return String(d.charCodeAt(0) - 0x0660); })
			.replace(/['’`".,:;!?()«»\-–—_/\\]/g, ' ')
			.replace(/\s+/g, ' ').trim();
	}

	var App = {
		lang: store(LANG_KEY) === 'en' ? 'en' : 'ar',
		UI: UI,
		REPO: REPO,
		/* the newest change in «سجل التحديثات» (written here by tools/build-changelog.js), and the newest a reader has seen there:
		   on a first visit what is there now counts as seen, so the changelog's link shows a dot only for what came after */
		/* a number with its Arabic noun in the right form: [one, two, three to ten, eleven and more] — «تحديث واحد», «تحديثان», «3 تحديثات», «12 تحديثًا» */
		count: function (n, f) { var m = n % 100; return n === 1 ? f[0] : n === 2 ? f[1] : App.num(n) + ' ' + (m >= 3 && m <= 10 ? f[2] : f[3]); },
		LATEST: '3de2509',
		isNew: function () {
			var seen = store('akt-cl-seen');
			if (!App.LATEST) return false;
			if (!seen) { store('akt-cl-seen', App.LATEST); return false; }
			return seen !== App.LATEST;
		},
		norm: norm,

		/* pick a localized string from {ar, en} (or return plain strings as-is) */
		t: function (o) {
			if (o == null) return '';
			if (typeof o === 'string' || typeof o === 'number') return String(o);
			return o[App.lang] || o.ar || o.en || '';
		},
		/* the "other" language — used for subtitles */
		alt: function (o) {
			if (!o || typeof o !== 'object') return '';
			return App.lang === 'ar' ? (o.en || '') : (o.ar || '');
		},
		esc: function (s) {
			return String(s == null ? '' : s)
				.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
				.replace(/"/g, '&quot;').replace(/'/g, '&#39;');
		},
		/* localized + escaped */
		tx: function (o) { return App.esc(App.t(o)); },
		L: function (ar, en) { return App.lang === 'ar' ? ar : en; },
		paras: function (o) {
			return App.t(o).split(/\n\s*\n/).filter(Boolean).map(function (p) {
				return '<p>' + App.esc(p.trim()) + '</p>';
			}).join('');
		},
		num: function (n) {
			if (n == null || n === '') return '';
			return App.digits(n);
		},
		/* Western digits (0-9) everywhere, in Arabic too */
		digits: function (s) {
			return String(s).replace(/[٠-٩]/g, function (d) { return d.charCodeAt(0) - 0x0660; }).replace(/[۰-۹]/g, function (d) { return d.charCodeAt(0) - 0x06F0; });
		},
		data: function () { return window.AKT || {}; },
		/* the data, for the few pages that draw nothing from it (privacy, contact, the changelog, 404) and so do not load it:
		   fetched when search, the lists or "Save for offline" first need it; then() runs once it is there (at once where it is) */
		needData: function (then) {
			var q = App.needData.q || (App.needData.q = []);
			if (window.AKT && window.AKT.works) return then && then();
			if (then) q.push(then);
			if (q.loading) return;
			q.loading = true;
			var s = document.createElement('script');
			s.src = 'assets/js/data-built.js';
			s.onload = function () { document.dispatchEvent(new CustomEvent('akt-data')); q.splice(0).forEach(function (f) { f(); }); };
			document.head.appendChild(s);
		},
		/* a cover's small copy, for the grids (assets/img/covers-s/, tools/build-thumbs.js); anything else as it is */
		thumb: function (src) {
			var m = /^assets\/img\/covers\/(.+)\.(webp|jpe?g|png)$/i.exec(src || '');
			return m ? 'assets/img/covers-s/' + m[1] + '.webp' : src;
		},
		byId: function (list, id) {
			list = list || [];
			for (var i = 0; i < list.length; i++) if (list[i].id === id) return list[i];
			return null;
		},
		/* find the series or standalone work a character / adaptation belongs to */
		findWork: function (id) {
			var d = App.data();
			return App.byId(d.series, id) || App.byId(d.works, id) || App.byId(d.otherSeries, id);
		},
		isSeries: function (id) { return !!App.byId(App.data().series, id); },

		/* ---------- deep links ---------- */
		workHref: function (id) {
			var d = App.data();
			return (App.isSeries(id) || App.byId(d.otherSeries, id) ? 'series.html?id=' : 'book.html?id=') + encodeURIComponent(id);
		},
		issueHref: function (sid, is) { if (is._special) return 'book.html?id=specials-' + is.n; if (is.work) return 'book.html?id=' + encodeURIComponent(is.work); return 'book.html?id=' + sid + '-' + (is.n != null ? is.n : 'x' + (is._idx || 0)) + (is.part ? '-' + is.part : ''); },
		/* only the leads (main: true) have a page of their own; anyone else is their card on the characters page */
		charHasPage: function (id) { var c = App.byId(App.data().characters, id); return !!(c && c.main); },
		charHref: function (id) { return App.charHasPage(id) ? 'character.html?id=' + encodeURIComponent(id) : 'characters.html#c-' + encodeURIComponent(id); },
		workLink: function (id) {
			var w = App.findWork(id);
			return w ? '<a href="' + App.workHref(id) + '">' + App.tx(w.title) + '</a>' : '';
		},
		charLink: function (id) {
			var c = App.byId(App.data().characters, id);
			if (!c) return '';
			return c.main ? '<a href="' + App.charHref(id) + '">' + App.tx(c.name) + '</a>' : '<span class="char-plain">' + App.tx(c.name) + '</span>';
		},
		/* scroll to #hash after a render, and let the page react (open / flip) */
		/* a picture full size in a dialog, with its caption (the home timeline, a book's back cover) */
		showPic: function (src, alt) {
			var e = App.esc, dlg = document.getElementById('pic-dialog');
			if (!dlg) {
				dlg = document.createElement('dialog');
				dlg.id = 'pic-dialog';
				dlg.className = 'pic-dialog';
				document.body.appendChild(dlg);
				dlg.addEventListener('click', function (x) { if (x.target === dlg || x.target.closest('.close')) dlg.close(); });
				dlg.addEventListener('close', function () { dlg.innerHTML = ''; });
			}
			dlg.innerHTML = '<figure><img src="' + e(src) + '" alt="' + e(alt || '') + '">' + (alt ? '<figcaption>' + e(alt) + '</figcaption>' : '') + '</figure>' +
				'<button type="button" class="close" aria-label="' + e(App.L('إغلاق', 'Close')) + '">×</button>';
			dlg.showModal();
		},

		/* the side menu of the pages about the site (info.js, changelog.js, sitemap-page.js): each a page, the one open marked (site.css .info-tabs) */
		INFO_PAGES: [['about', { ar: 'عن الموقع والأسئلة الشائعة', en: 'About & FAQ' }], ['sources', { ar: 'المصادر', en: 'Sources' }],
			['privacy', { ar: 'الخصوصية', en: 'Privacy' }], ['terms', { ar: 'حقوق الاستخدام', en: 'Rights & use' }],
			['contact', { ar: 'تواصل وساهم', en: 'Contact & contribute' }],
			['wanted', { ar: 'ما ينقص الأرشيف', en: 'Wanted for the archive' }], ['changelog', { ar: 'سجل التحديثات', en: 'Changelog' }], ['story', { ar: 'قصة الموقع', en: 'The site’s story' }],
			['sitemap', { ar: 'خريطة الموقع', en: 'Site map' }]],
		infoTabs: function (current) {
			return '<nav class="info-tabs" aria-label="' + App.esc(App.L('عن الموقع', 'About the site')) + '">' + App.INFO_PAGES.map(function (p) {
				return '<a href="' + p[0] + '.html"' + (p[0] === current ? ' aria-current="page"' : '') + (p[0] === 'changelog' && p[0] !== current && App.isNew() ? ' class="is-new"' : '') + '>' + App.esc(App.t(p[1])) + '</a>';
			}).join('') + '</nav>';
		},

		focusHash: function (onTarget) {
			var id = decodeURIComponent(location.hash.slice(1));
			if (!id) return;
			var el = document.getElementById(id);
			if (!el) return;
			el.classList.add('rise', 'in');
			if (onTarget) onTarget(el, id);
			/* an entry is brought to the middle of the window; a whole section taller than the window (a menu's link to
			   «أعداء وأشرار» or «مكتبة رفعت إسماعيل») to its top, under the header — centred, its top would be far above sight */
			var block = function () { return el.getBoundingClientRect().height > window.innerHeight * 0.7 ? 'start' : 'center'; };
			setTimeout(function () {
				el.scrollIntoView({ behavior: 'smooth', block: block() });
				el.classList.remove('is-target'); void el.offsetWidth; el.classList.add('is-target');
			}, 60);
			/* a smooth scroll begun while the page is still loading is cut short as the rest comes in (a link from another page to an
			   entry far down, as the awards page's to the Legacy timeline): once it has loaded, if the entry is not in sight, straight there */
			if (document.readyState !== 'complete') window.addEventListener('load', function () {
				setTimeout(function () {
					var r = el.getBoundingClientRect();
					if (r.bottom < 0 || r.top > window.innerHeight || (block() === 'start' && Math.abs(r.top - 90) > 60)) el.scrollIntoView({ behavior: 'instant', block: block() });
				}, 120);
			}, { once: true });
		},

		/* search and sharing for a page drawn from the data (a book, a series, a person, an article): its own address as the
		   canonical one, its title, a description from its text, its picture, and what it is for search engines (JSON-LD),
		   with the trail to it. o = { path, desc, image, ld: {…schema.org…}, crumbs: [[name, path], …] } */
		seo: function (o) {
			var SITE = 'https://samehbilal.github.io/ahmed-khaled-tawfik/';
			var abs = function (u) { return !u ? '' : /^https?:/.test(u) ? u : SITE + String(u).replace(/^\.?\//, ''); };
			var url = abs(o.path);
			var text = function (v) { return String(v == null ? '' : typeof v === 'object' ? App.t(v) : v).replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim(); };
			var head = document.head, d0 = head.querySelector('meta[name="description"]');
			/* the page's own description, for when it shows no one item (the blog's archive after an article) */
			if (d0 && App._desc0 == null) App._desc0 = d0.getAttribute('content');
			var desc = text(o.desc);
			if (desc.length > 160) desc = desc.slice(0, 157).replace(/\s+\S*$/, '') + '…';
			desc = desc || App._desc0 || '';
			var set = function (sel, make, attr, val) {
				var m = head.querySelector(sel);
				if (!val) { if (m && make) m.remove(); return; }
				if (!m) { m = document.createElement(make ? make[0] : 'meta'); make && m.setAttribute(make[1], make[2]); head.appendChild(m); }
				m.setAttribute(attr, val);
			};
			set('link[rel="canonical"]', ['link', 'rel', 'canonical'], 'href', url);
			set('meta[property="og:url"]', ['meta', 'property', 'og:url'], 'content', url);
			set('meta[property="og:title"]', null, 'content', document.title);
			set('meta[name="twitter:title"]', null, 'content', document.title);
			if (desc) ['meta[name="description"]', 'meta[property="og:description"]', 'meta[name="twitter:description"]'].forEach(function (s) { set(s, null, 'content', desc); });
			var img = abs(o.image);
			if (img) {
				/* its own picture is not the 1200×630 card the page carries, so its size and alt go with the card's */
				['meta[property="og:image:width"]', 'meta[property="og:image:height"]', 'meta[property="og:image:type"]'].forEach(function (s) { var m = head.querySelector(s); if (m) m.remove(); });
				['meta[property="og:image"]', 'meta[property="og:image:secure_url"]', 'meta[name="twitter:image"]'].forEach(function (s) { set(s, null, 'content', img); });
				['meta[property="og:image:alt"]', 'meta[name="twitter:image:alt"]'].forEach(function (s) { set(s, null, 'content', text(o.imageAlt) || document.title); });
			}
			var graph = [];
			if (o.ld) graph.push(Object.assign({ '@context': 'https://schema.org', url: url, mainEntityOfPage: url }, desc && !o.ld.description ? { description: desc } : {}, img && !o.ld.image ? { image: img } : {}, o.ld));
			if (o.crumbs) graph.push({ '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [[App.L('الرئيسية', 'Home'), '']].concat(o.crumbs).map(function (c, i) {
				return { '@type': 'ListItem', position: i + 1, name: text(c[0]), item: c[1] == null ? url : SITE + c[1] };
			}) });
			var ld = document.getElementById('ld-page');
			if (!graph.length) { if (ld) ld.remove(); return; }
			if (!ld) { ld = document.createElement('script'); ld.type = 'application/ld+json'; ld.id = 'ld-page'; head.appendChild(ld); }
			ld.textContent = JSON.stringify(graph.length === 1 ? graph[0] : graph);
		},
		/* the address to share for this page: a book's, series', character's, writer's, publisher's or article's own small page
		   (share/<kind>/<id>.html, tools/build-share.js), which gives WhatsApp, Facebook and X its title and picture and opens
		   the page; any other page, its own address */
		shareUrl: function () {
			var SITE = 'https://samehbilal.github.io/ahmed-khaled-tawfik/', q = new URLSearchParams(location.search);
			var page = location.pathname.split('/').pop().replace(/\.html$/, '');
			var kind = { book: 'book', series: 'series', character: 'character', writer: 'writer', publisher: 'publisher' }[page];
			var id = kind ? q.get('id') : page === 'blog' ? q.get('post') : null;
			if (page === 'blog' && id) kind = 'post';
			return kind && id && /^[\w.-]+$/.test(id) ? SITE + 'share/' + kind + '/' + id + '.html' : SITE + (page && page !== 'index' ? page + '.html' : '') + location.search;
		},
		shareButton: function () {
			return '<button type="button" class="share-btn" data-share><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="18" cy="5" r="2.6"/><circle cx="6" cy="12" r="2.6"/><circle cx="18" cy="19" r="2.6"/><path d="M8.3 10.8l7.4-4.3M8.3 13.2l7.4 4.3"/></svg>' +
				App.esc(App.L('شارك', 'Share')) + '</button>';
		},
		/* «استشهد»: this page's reference, ready to copy, on the terms page («كيف تستشهد بالموقع», info.js) */
		citeButton: function () {
			var page = (location.pathname.split('/').pop() || 'index.html') + location.search;
			return '<a class="share-btn" href="terms.html?cite=' + encodeURIComponent(page) + '#cite">' + App.esc(App.L('استشهد', 'Cite')) + '</a>';
		},
		/* him, as the books' author in their JSON-LD: the Person the home page describes */
		seoAuthor: { '@type': 'Person', '@id': 'https://samehbilal.github.io/ahmed-khaled-tawfik/#akt', name: 'أحمد خالد توفيق', alternateName: 'Ahmed Khaled Tawfik' },

		/* "suggest a correction" link to a pre-filled GitHub issue */
		/* the site's address and its repository, for the pages that ask readers to write (reader-stories.js) */
		EMAIL: UI.maker.email,
		REPO: REPO,
		fixHref: function (subject) {
			var title = (App.lang === 'ar' ? 'تصحيح: ' : 'Correction: ') + (subject || document.title);
			var body = (App.lang === 'ar'
				? 'الصفحة: ' + location.href + '\n\nما الخطأ؟\n\nالتصحيح المقترح:\n\nالمصدر (رابط):\n'
				: 'Page: ' + location.href + '\n\nWhat is wrong?\n\nSuggested fix:\n\nSource (link):\n');
			return REPO + '/issues/new?title=' + encodeURIComponent(title) + '&body=' + encodeURIComponent(body);
		},
		fixLink: function (subject) {
			return '<a class="fix-link" href="' + App.esc(App.fixHref(subject)) + '" target="_blank" rel="noopener">' + App.L('اقترح تصحيحًا ↗', 'Suggest a fix ↗') + '</a>';
		},

		/* ---------- language / theme ---------- */
		setLang: function (l) {
			App.lang = l;
			store(LANG_KEY, l);
			App.applyLang();
			App.renderChrome();
			App.fillStrings();
			if (window.PAGE && typeof window.PAGE.render === 'function') window.PAGE.render();
			App.observeRise();
		},

		applyLang: function () {
			var html = document.documentElement;
			html.lang = App.lang;
			html.dir = App.lang === 'ar' ? 'rtl' : 'ltr';
			var p = window.PAGE || {};
			if (p.title) document.title = App.t(p.title) + ' — ' + (App.lang === 'ar' ? 'أحمد خالد توفيق' : 'Ahmed Khaled Tawfik');
		},

		theme: function () { return document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark'; },
		setTheme: function (th) {
			document.documentElement.setAttribute('data-theme', th);
			store(THEME_KEY, th);
			var b = document.querySelector('.theme-toggle');
			if (b) b.setAttribute('aria-pressed', String(th === 'light'));
		},

		renderChrome: function () {
			var pageId = (window.PAGE && window.PAGE.id) || '';
			var header = document.getElementById('site-header');
			if (header) {
				header.className = 'site-header';
				header.innerHTML =
					'<div class="wrap">' +
						/* the phone menu's button stands just before the brand (hidden on wider screens) */
						'<button class="icon-btn menu-btn" type="button" aria-expanded="false" aria-controls="site-nav" aria-label="' + App.L('القائمة', 'Menu') + '">' +
							'<span class="stack" aria-hidden="true"><i></i><i></i><i></i></span>' +
						'</button>' +
						'<a class="brand" href="index.html"><span class="brand-ar">العرّاب</span><span class="brand-en">The Godfather</span></a>' +
						'<nav class="nav" id="site-nav" aria-label="' + App.L('التنقل الرئيسي', 'Main') + '" data-title="' + App.L('الفهرس', 'Contents') + '">' +
							UI.nav.map(function (n, i) {
								/* the empty span is the dotted leader to the page number in the phone menu */
								return '<a href="' + n.href + '" style="--i:' + i + '"' + (n.phone ? ' class="nav-phone"' : '') + (n.id === pageId ? ' aria-current="page"' : '') + '>' + App.esc(n[App.lang]) + '<span aria-hidden="true"></span></a>';
							}).join('') +
						'</nav>' +
						/* on a wider screen, the main menu with its four panels (the links above are the phone's contents page) */
						megaHTML(App, location.pathname.split('/').pop() || 'index.html') +
						'<div class="tools">' +
							'<button class="icon-btn search-open" type="button" aria-label="' + App.L('بحث', 'Search') + '" title="' + App.L('بحث (/)', 'Search (/)') + '">' +
								'<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5" fill="none" stroke="currentColor" stroke-width="2"/><path d="M15.5 15.5 21 21" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>' +
							'</button>' +
							'<button class="icon-btn theme-toggle" type="button" aria-pressed="' + (App.theme() === 'light') + '" aria-label="' + App.L('الوضع الورقي', 'Paper theme') + '" title="' + App.L('الوضع الورقي / الليلي', 'Paper / night theme') + '">' +
								'<svg class="i-moon" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5Z" fill="currentColor"/></svg>' +
								'<svg class="i-page" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M6 3h9l4 4v14H6z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M9 11h7M9 15h7" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>' +
							'</button>' +
							'<button class="lang-toggle" type="button" lang="' + (App.lang === 'ar' ? 'en' : 'ar') + '">' + App.tx(UI.toggle) + '</button>' +
						'</div>' +
					'</div>';
				/* the phone menu: opens and closes on its button, and closes on a link, Escape, a tap outside the header,
				   or when the screen grows past the phone layout */
				var setMenu = function (open) {
					header.classList.toggle('menu-open', open);
					header.querySelector('.menu-btn').setAttribute('aria-expanded', String(open));
				};
				header.querySelector('.menu-btn').addEventListener('click', function () { setMenu(!header.classList.contains('menu-open')); });
				header.querySelector('.nav').addEventListener('click', function (ev) { if (ev.target.closest('a')) setMenu(false); });
				if (!header.dataset.menuWired) {
					header.dataset.menuWired = '1';
					document.addEventListener('keydown', function (ev) {
						if (ev.key === 'Escape' && header.classList.contains('menu-open')) { setMenu(false); header.querySelector('.menu-btn').focus(); }
					});
					document.addEventListener('click', function (ev) { if (!header.contains(ev.target)) setMenu(false); });
					var mq = window.matchMedia('(max-width: 760px)');
					(mq.addEventListener ? mq.addEventListener.bind(mq, 'change') : mq.addListener.bind(mq))(function () { setMenu(false); });
				}
				wireMega(header);
				header.querySelector('.lang-toggle').addEventListener('click', function () { App.setLang(App.lang === 'ar' ? 'en' : 'ar'); });
				header.querySelector('.theme-toggle').addEventListener('click', function () { App.setTheme(App.theme() === 'light' ? 'dark' : 'light'); });
				header.querySelector('.search-open').addEventListener('click', function () { Search.open(); });
			}
			var footer = document.getElementById('site-footer');
			if (footer) {
				footer.className = 'site-footer';
				/* one night for his three series, on one hilly horizon: Ma Wara' al-Tabi'a's haunted hill (a castle
				   with lit windows, a path, bare trees, old graves and a fence — from Vecteezy), bats, fog and eyes
				   in the dark; Safari's savanna (Vecteezy) against a sunset in the shape of Africa; Fantasia's open
				   book adrift among the stars. Then his motto on a headstone, and the pocket books' last line */
				var stars = [[6, 18], [11, 52], [19, 30], [24, 8], [29, 64], [38, 22], [44, 46], [51, 12], [57, 36], [63, 58], [69, 16], [74, 42], [81, 26], [86, 60], [92, 12], [96, 40]]
					.map(function (s, i) { return '<i style="inset-inline-start:' + s[0] + '%;top:' + s[1] + 'px;animation-delay:-' + (i * 0.7 % 5).toFixed(1) + 's"></i>'; }).join('');
				var book = '<svg class="ft-book" viewBox="0 0 80 40"><defs><linearGradient id="ft-pg" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#fbf1d2"/><stop offset="1" stop-color="#cdb98a"/></linearGradient></defs>' +
					'<path d="M40 36Q22 28 4 32V8Q22 4 40 12Z" fill="url(#ft-pg)"/><path d="M40 36Q58 28 76 32V8Q58 4 40 12Z" fill="url(#ft-pg)"/>' +
					'<g fill="none" stroke="#9c8a62" stroke-width=".8" opacity=".7"><path d="M10 13Q22 10 34 15M10 18Q22 15 34 20M10 23Q22 20 34 25"/><path d="M46 15Q58 10 70 13M46 20Q58 15 70 18M46 25Q58 20 70 23"/></g>' +
					'<path d="M40 12V36" stroke="#7d6c48" stroke-width="1"/></svg>';
				var africa = ftAfrica('ft');
				var bat = '<svg viewBox="0 0 20 10"><path fill="currentColor" d="M10 4C8 1 5 0 0 2c3 1 3 3 2 5 2-1 4-1 5 1 1-2 2-2 3-1 1-1 2-1 3 1 1-2 3-2 5-1-1-2-1-4 2-5-5-2-8-1-10 2Z"/></svg>';
				var bats = ftBats('ft-bats');
				/* hills with grass along the top edge; the same curve sets how high each thing stands */
				var hillPts = [[0, 30], [110, 18], [220, 30], [400, 26], [600, 32], [790, 24], [1000, 28]];
				var hillY = function (x) {
					for (var k = 1; k < hillPts.length; k++) if (x <= hillPts[k][0]) {
						var a = hillPts[k - 1], b = hillPts[k], t = (x - a[0]) / (b[0] - a[0]);
						return a[1] + (b[1] - a[1]) * (1 - Math.cos(t * Math.PI)) / 2;
					}
					return 28;
				};
				var hill = 'M0 60';
				for (var hx = 0, hi = 0; hx <= 1000; hx += 4, hi++) hill += 'L' + hx + ' ' + (hillY(hx) - (hi % 3 === 0 ? 3 + (hi * 7) % 5 : 0)).toFixed(1);
				hill += 'L1000 60Z';
				footer.innerHTML =
					'<div class="ft-night" aria-hidden="true">' +
						'<span class="ft-stars">' + stars + '</span><span class="ft-shoot"></span>' +
						/* Fantasia's sky: a big moon with a witch on her broom crossing it (from a Vecteezy Halloween
						   scene, free licence), and a flying saucer with its beam */
						/* the three worlds, each in its own zone: on wide screens a zone covers the whole scene, below 1200px each takes its side */
						'<div class="ft-zone z-fantasy">' +
						'<span class="ft-luna"><span class="ft-moon"></span><img class="ft-witch" src="assets/img/footer/witch.webp" alt="" loading="lazy"></span>' +
						/* Fantasia's citadel on its hill: a black silhouette like the rest, lilac windows, a violet rim from the moon */
						'<svg class="ft-citadel" viewBox="0 0 200 180" aria-hidden="true"><defs><linearGradient id="citStone" x1="1" y1="0" x2="0" y2="0"><stop offset="0" stop-color="#1c1030"/><stop offset=".35" stop-color="#0b0614"/><stop offset="1" stop-color="#050309"/></linearGradient></defs><path d="M0 180c18-30 52-46 100-48s84 18 100 48z" fill="#050507"/><g fill="url(#citStone)" stroke="#2a1848" stroke-opacity=".55" stroke-width="1" stroke-linejoin="round"><path d="M58 140v-38h84v38z"/><path d="M58 102v-7h7v7h7v-7h7v7h7v-7h7v7h6v-7h7v7h7v-7h7v7h7v-7h7v7h7v-7h6v7"/><path d="M40 142V78h22v64z"/><path d="M36 78l15-40 15 40z"/><path d="M138 142V86h22v56z"/><path d="M134 86l15-34 15 34z"/><path d="M80 142V52h40v90z"/><path d="M74 52l26-50 26 50z"/><path d="M66 102V72h12v30z"/><path d="M63 72l9-18 9 18z"/><path d="M122 102V74h12v28z"/><path d="M119 74l9-17 9 17z"/></g><g fill="#050309"><path d="M100 2v-8l9 3-9 3"/><path d="M51 38v-7l7 2.5-7 2.5"/><path d="M149 52v-7l7 2.5-7 2.5"/></g><path d="M100 2v-9M51 38v-8M149 52v-8" stroke="#050309" stroke-width="1.2"/><g class="cit-lit" fill="#d9c4ff"><path class="fl" d="M94 142v-14a6 6 0 0 1 12 0v14z"/><path d="M96 76v-8a4 4 0 0 1 8 0v8z"/><path class="fl2" d="M96 100v-8a4 4 0 0 1 8 0v8z"/><path d="M48 100v-7a3 3 0 0 1 6 0v7z"/><path class="fl" d="M48 122v-7a3 3 0 0 1 6 0v7z"/><path class="fl2" d="M146 106v-7a3 3 0 0 1 6 0v7z"/><path d="M146 126v-7a3 3 0 0 1 6 0v7z"/><path d="M70 90v-6a2 2 0 0 1 4 0v6z"/><path d="M126 92v-6a2 2 0 0 1 4 0v6z"/></g></svg>' +
						'<svg class="ft-ufo" viewBox="0 0 160 210" aria-hidden="true"><defs>' +
							'<linearGradient id="ufoBeam" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#bfa0f0" stop-opacity=".45"/><stop offset="1" stop-color="#cdb0ff" stop-opacity="0"/></linearGradient>' +
							'<radialGradient id="ufoDome" cx=".42" cy=".35" r=".7"><stop offset="0" stop-color="#cdb6f0"/><stop offset="1" stop-color="#3c2566"/></radialGradient></defs>' +
							'<path class="ufo-beam" d="M64 54h32l46 156H18z" fill="url(#ufoBeam)"/>' +
							'<ellipse cx="80" cy="38" rx="25" ry="21" fill="url(#ufoDome)"/>' +
							'<ellipse cx="80" cy="47" rx="74" ry="14" fill="#0b0614" stroke="#7a5ab8" stroke-opacity=".55" stroke-width="1.4"/>' +
							'<ellipse cx="80" cy="44" rx="58" ry="7" fill="#160c28"/>' +
							'<ellipse cx="80" cy="56" rx="20" ry="5" fill="#bfa0f0"/>' +
							'<g class="ufo-lights" fill="#ecdcff"><ellipse cx="28" cy="49" rx="5" ry="2.4"/><ellipse cx="50" cy="53" rx="6" ry="2.6"/><ellipse cx="80" cy="54.5" rx="6" ry="2.6"/><ellipse cx="110" cy="53" rx="6" ry="2.6"/><ellipse cx="132" cy="49" rx="5" ry="2.4"/></g>' +
						'</svg>' +
						'<span class="ft-fantasia">' + book + '<span class="ft-sparks"><i></i><i></i><i></i><i></i><i></i><i></i></span></span>' +
						'</div>' +
						'<span class="ft-fog f1"></span><span class="ft-fog f2"></span>' +
						/* Safari: the savanna from Vecteezy (free licence, credited below) in front of the Africa-shaped sunset */
						'<div class="ft-zone z-safari"><span class="ft-safari">' + africa + '<img class="ft-savanna" src="assets/img/footer/savanna.webp" alt="" loading="lazy">' +
							'<span class="ft-lamp" aria-hidden="true"><i class="beam"></i></span></span></div>' +
						'<div class="ft-zone z-horror"><img class="ft-haunt" src="assets/img/footer/haunted-hill.webp" alt="" loading="lazy">' + bats +
						'<span class="ft-eyes e2"><i></i><i></i></span><span class="ft-eyes e3"><i></i><i></i></span></div>' +
						'<svg class="ft-hills" viewBox="0 0 1000 60" preserveAspectRatio="none"><path d="' + hill + '"/></svg>' +
					'</div>' +
					'<div class="ft-body"><div class="wrap">' +
						'<div class="ft-stone">' +
							/* the headstone itself, drawn after the two pictures sent in (no cross, bats or trees) */
							'<svg class="ft-stone-art" viewBox="0 0 260 320" preserveAspectRatio="none" aria-hidden="true"><defs><linearGradient id="stoneFace" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#4a4a4d"/><stop offset=".45" stop-color="#2c2c30"/><stop offset="1" stop-color="#17171a"/></linearGradient><linearGradient id="stoneSide" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#1b1b1e"/><stop offset="1" stop-color="#0c0c0e"/></linearGradient><linearGradient id="stoneBase" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3a3a3e"/><stop offset="1" stop-color="#18181b"/></linearGradient><radialGradient id="stoneMoss" cx=".5" cy="1" r=".6"><stop offset="0" stop-color="#4f6a3a" stop-opacity=".55"/><stop offset="1" stop-color="#4f6a3a" stop-opacity="0"/></radialGradient></defs><path d="M30 248V104C30 44 74 14 130 14s100 30 100 90v42l-9 7 6 12-12 10 9 15-7 9 6 13-9 8 8 14v24Z" fill="url(#stoneFace)" stroke="#050507" stroke-width="3" stroke-linejoin="round"/><path d="M30 248V104C30 60 52 30 86 20 56 38 42 66 42 104v144Z" fill="url(#stoneSide)" opacity=".85"/><path d="M46 236V108c0-48 36-78 84-78s84 30 84 78v34" fill="none" stroke="#000" stroke-opacity=".35" stroke-width="2"/><path d="M47 236V108c0-47 35-77 83-77s83 30 83 77v34" fill="none" stroke="#fff" stroke-opacity=".06" stroke-width="1"/><path d="M150 16l-6 22 8 14-10 20 6 16-9 18" fill="none" stroke="#050507" stroke-width="2" stroke-linecap="round"/><path d="M151 17l-6 22 8 14-10 20 6 16-9 18" fill="none" stroke="#fff" stroke-opacity=".08" stroke-width="1"/><path d="M70 248l6-14-4-10 7-12" fill="none" stroke="#050507" stroke-width="1.6" stroke-linecap="round"/><path d="M20 248h220v18H20z" fill="url(#stoneBase)" stroke="#050507" stroke-width="3" stroke-linejoin="round"/><path d="M8 264h244v22H8z" fill="url(#stoneBase)" stroke="#050507" stroke-width="3" stroke-linejoin="round"/><path d="M10 266h240" stroke="#fff" stroke-opacity=".07"/><ellipse cx="130" cy="262" rx="120" ry="16" fill="url(#stoneMoss)"/><g fill="#2b2b2f" stroke="#050507" stroke-width="2" stroke-linejoin="round"><path d="M36 292l38-10 34 9-36 12z"/><path d="M150 288l44-12 40 10-42 14z"/><path d="M118 300l18-6 14 5-17 7z"/></g><path d="M48 291l20-5M164 288l26-7" stroke="#fff" stroke-opacity=".1"/><g fill="#3c3c41" stroke="#050507" stroke-width="1.4"><circle cx="20" cy="298" r="4"/><circle cx="104" cy="306" r="3"/><circle cx="242" cy="300" r="5"/><circle cx="226" cy="310" r="3"/><circle cx="60" cy="310" r="2.6"/><circle cx="196" cy="310" r="2.4"/></g><g fill="none" stroke="#0a0a0c" stroke-width="2" stroke-linecap="round"><path d="M4 286c2-10 6-16 10-20M10 287c0-8 2-14 6-18M246 286c1-9-1-15-4-20M252 288c2-8 1-13-1-17M22 285c1-6 4-10 7-12M234 286c0-6-2-10-5-13"/></g></svg>' +
							'<span class="ft-name">' + App.L('د. أحمد خالد توفيق', 'Dr. Ahmed Khaled Tawfik') + '</span>' +
							'<div class="motto">' + App.tx(UI.motto) + '</div>' +
							'<span class="ft-dates" dir="ltr">1962 — 2018</span>' +
						'</div>' +
						'<div class="ft-col"><nav class="ft-links" aria-labelledby="ft-links-h"><h2 id="ft-links-h">' + App.L('صفحات الموقع', 'Site pages') + '</h2>' +
							/* (the phone menu's own entries are the footer's own pages already, or the «My lists» button) */
							UI.nav.filter(function (n) { return !n.phone; }).concat(UI.more.filter(function (n) { return n.main; })).map(function (n) { return '<a href="' + n.href + '">' + App.esc(n[App.lang]) + '</a>'; }).join('') +
						'</nav>' +
						/* and under them, the pages inside his world */
						'<nav class="ft-links ft-world" aria-labelledby="ft-world-h"><h2 id="ft-world-h">' + App.L('عالم العرّاب', 'The Godfather’s world') + '</h2>' +
							UI.world.map(function (n) { return '<a href="' + n.href + '">' + App.esc(n[App.lang]) + '</a>'; }).join('') +
						'</nav></div>' +
						/* the pages made from the data (and, under them, pwa.js's «احفظ الموقع دون اتصال») */
						'<div class="ft-side">' +
							'<nav class="ft-legal ft-more" aria-labelledby="ft-more-h"><h2 id="ft-more-h">' + App.L('اكتشف أكثر', 'Discover more') + '</h2>' +
								UI.more.filter(function (n) { return !n.main; }).map(function (n) { return '<a href="' + n.href + '">' + App.esc(n[App.lang]) + '</a>'; }).join('') +
							'</nav>' +
							/* then the site's own pages */
							'<nav class="ft-legal" aria-labelledby="ft-legal-h"><h2 id="ft-legal-h">' + App.L('خلف الكواليس', 'Behind the site') + '</h2>' +
								UI.legal.map(function (n) { return '<a href="' + n.href + '"' + (n.href === 'changelog.html' && App.isNew() ? ' class="is-new" title="' + App.esc(App.L('جديد منذ زيارتك', 'New since your visit')) + '"' : '') + '>' + App.esc(n[App.lang]) + '</a>'; }).join('') +
							'</nav>' +
						'</div>' +
						'<div class="ft-maker">' +
							'<p class="ft-maker-line">' + App.t(UI.maker.line) + '</p>' +
							'<div class="ft-maker-links">' +
								'<a href="mailto:' + UI.maker.email + '"><svg viewBox="0 0 16 16" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="1.4" d="M1.5 3.5h13v9h-13zM1.5 3.5l6.5 5.5 6.5-5.5"/></svg>' + App.L('Email me', 'Email me') + '</a>' +
								'<a class="wa" href="' + UI.maker.whatsapp + '" target="_blank" rel="noopener"><svg viewBox="0 0 16 16" aria-hidden="true"><path fill="currentColor" d="M13.6 2.3A7.9 7.9 0 0 0 1.1 11.8L0 16l4.3-1.1a7.9 7.9 0 0 0 3.8 1A7.9 7.9 0 0 0 13.6 2.3M8 14.5a6.6 6.6 0 0 1-3.3-.9l-.3-.2-2.5.7.7-2.5-.2-.3A6.6 6.6 0 1 1 8 14.5m3.6-4.9c-.2-.1-1.2-.6-1.4-.7s-.3-.1-.5.1l-.6.8c-.1.1-.2.2-.4.1a5.4 5.4 0 0 1-2.7-2.3c-.2-.4.2-.4.6-1.2.1-.1 0-.3 0-.4l-.6-1.5c-.2-.4-.3-.3-.5-.3h-.4a.8.8 0 0 0-.6.3 2.4 2.4 0 0 0-.7 1.8 4.2 4.2 0 0 0 .9 2.2 9.6 9.6 0 0 0 3.7 3.2c1.4.6 1.9.6 2.6.5a2.2 2.2 0 0 0 1.4-1c.2-.5.2-.9.1-1z"/></svg>WhatsApp</a>' +
								'<a href="' + UI.maker.github + '" target="_blank" rel="noopener"><svg viewBox="0 0 16 16" aria-hidden="true"><path fill="currentColor" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8"/></svg>GitHub</a>' +
								'<a href="' + UI.maker.portfolio + '" target="_blank" rel="noopener"><svg viewBox="0 0 16 16" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="1.4" d="M1.5 5.5h13v8h-13zM5.5 5.5v-2h5v2M1.5 9h13"/></svg>' + 'Portfolio</a>' +
							'</div>' +
							/* the copyright line from Sameh Bilal's portfolio, with its ASCII owl (App.owl) */
							(App.lang === 'ar'
								? '<p class="ft-copy is-ar" dir="rtl">حقوق النشر @2026، <span class="ascii owl" aria-hidden="true">,___,\n[o,o]\n/)__)\n~"--"~</span>' +
									'<span class="visually-hidden">بومة متحركة للزينة تدل على نشاط الموقع</span>جميع الحقوق محفوظة. ' +
									'<span>صُنع بـ <span style="color: #F9812E;">🧡</span> سامح بلال</span></p>'
								: '<p class="ft-copy" dir="ltr">Copyright @2026, <span class="ascii owl" aria-hidden="true">,___,\n[o,o]\n/)__)\n~"--"~</span>' +
									'<span class="visually-hidden">Decorative owl animation indicating site activity</span>All Rights Reserved. ' +
									'<span>Crafted with <span style="color: #F9812E;">🧡</span> Sameh Bilal</span></p>') +
						'</div>' +
					'</div>' +
					'<p class="ft-end">' + App.L('تمّت…', 'The end…') + ' <span>' + App.L('أو هكذا يبدو', 'or so it seems') + '</span></p></div>';
			}
			App.owl();
		},

		/* the footer owl, after Sameh Bilal's portfolio: it blinks while idle, wakes under the pointer,
		   glances when the page scrolls; one timer for the whole page, whichever owl is on it now */
		owl: function () {
			var F = {
				idle: [',___,\n[o,o]\n/)__)\n~"--"~', ',___,\n[o,-]\n/)__)\n~"--"~', ',___,\n[-,o]\n/)__)\n~"--"~'],
				scroll: [',___,\n[o,o]\n<(__)\n~"--"~', ',___,\n[o,o]\n/)__>\n~"--"~']
			};
			var still = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
			var get = function () { return document.querySelector('.site-footer .owl'); };
			var o = App._owl;
			if (!o) {
				o = App._owl = { timer: null, last: 0 };
				o.play = function (set, speed, once) {
					clearInterval(o.timer);
					var i = 0;
					o.timer = setInterval(function () {
						var el = get();
						if (!el) return;
						el.textContent = set[i++];
						if (i >= set.length) { if (once) o.idle(); else i = 0; }
					}, speed);
				};
				o.idle = function () { if (!still) o.play(F.idle, 1400); };
				window.addEventListener('scroll', function () {
					var now = Date.now();
					if (still || now - o.last < 1200) return;
					o.last = now;
					o.play(F.scroll, 200, true);
				}, { passive: true });
				document.addEventListener('visibilitychange', function () { if (document.hidden) clearInterval(o.timer); else o.idle(); });
			}
			var el = get();
			if (!el) return;
			el.addEventListener('mouseenter', function () { if (!still) o.play(F.idle, 300); });
			el.addEventListener('mouseleave', o.idle);
			o.idle();
		},

		/* fill static [data-i18n] slots from PAGE.strings */
		fillStrings: function () {
			var s = (window.PAGE && window.PAGE.strings) || {};
			document.querySelectorAll('[data-i18n]').forEach(function (el) {
				var k = el.getAttribute('data-i18n');
				if (s[k]) el.textContent = App.t(s[k]);
			});
			/* (the page has them in Arabic, tools/build-meta.js; an English reader's are hidden until now: site.css) */
			document.documentElement.classList.add('i18n');
		},

		/* fade/rise elements with .rise when they scroll into view */
		observeRise: function () {
			var els = document.querySelectorAll('.rise:not(.in)');
			if (!('IntersectionObserver' in window)) {
				els.forEach(function (el) { el.classList.add('in'); });
				return;
			}
			if (!App._io) {
				App._io = new IntersectionObserver(function (entries) {
					entries.forEach(function (e) {
						if (e.isIntersecting) { e.target.classList.add('in'); App._io.unobserve(e.target); }
					});
				}, { rootMargin: '0px 0px -8% 0px' });
			}
			els.forEach(function (el) { App._io.observe(el); });
		},

		/* a row of covers that runs past the page gets previous / next buttons at its ends, a page of covers at a time;
		   they hide when the row fits and dim at either end (in Arabic the row runs right to left). Rows already done are skipped. */
		carousels: function (root) {
			(root || document).querySelectorAll('.cover-row').forEach(function (row) {
				if (row.parentNode && row.parentNode.classList.contains('row-car')) return;
				var box = document.createElement('div');
				box.className = 'row-car';
				row.parentNode.insertBefore(box, row);
				box.appendChild(row);
				var rtl = getComputedStyle(row).direction === 'rtl';
				var btn = function (dir, label, glyph) {
					var b = document.createElement('button');
					b.type = 'button';
					b.className = 'row-car-btn row-car-' + dir;
					b.setAttribute('aria-label', label);
					/* the arrow in a span of its own, set left to right, so right-to-left text doesn't mirror it */
					var g = document.createElement('span');
					g.setAttribute('aria-hidden', 'true');
					g.textContent = glyph;
					b.appendChild(g);
					b.addEventListener('click', function () {
						var step = Math.max(row.clientWidth * 0.85, 140) * (dir === 'next' ? 1 : -1) * (rtl ? -1 : 1);
						row.scrollBy({ left: step, behavior: 'smooth' });
					});
					box.appendChild(b);
					return b;
				};
				var prev = btn('prev', App.L('السابق', 'Previous'), rtl ? '›' : '‹');
				var next = btn('next', App.L('التالي', 'Next'), rtl ? '‹' : '›');
				var update = box._upd = function () {
					var max = row.scrollWidth - row.clientWidth, at = Math.abs(row.scrollLeft);
					box.classList.toggle('is-scrollable', max > 4);
					prev.disabled = at <= 4;
					next.disabled = at >= max - 4;
				};
				row.addEventListener('scroll', update, { passive: true });
				update();
				/* covers load lazily, so measure again once they have */
				setTimeout(update, 600);
			});
		},

		boot: function () {
			App.applyLang();
			App.renderChrome();
			App.fillStrings();
			if (window.PAGE && typeof window.PAGE.render === 'function') window.PAGE.render();
			App.observeRise();
			/* «شارك»: the phone's share sheet where there is one, else the address copied */
			document.addEventListener('click', function (ev) {
				var b = ev.target.closest && ev.target.closest('[data-share]');
				if (!b) return;
				var url = App.shareUrl(), title = document.title;
				var copied = function () { if (window.Notify) window.Notify(App.L('نُسخ الرابط؛ الصقه حيث تريد.', 'Link copied; paste it anywhere.'), { type: 'success' }); };
				if (navigator.share) navigator.share({ title: title, url: url }).catch(function () {});
				else if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(url).then(copied, function () { window.prompt(App.L('انسخ الرابط:', 'Copy the link:'), url); });
				else window.prompt(App.L('انسخ الرابط:', 'Copy the link:'), url);
			});
			/* rows of covers show their scrollbar only while they are being scrolled */
			document.addEventListener('scroll', function (ev) {
				var el = ev.target;
				if (!el.classList || !el.classList.contains('cover-row')) return;
				el.classList.add('is-scrolling');
				clearTimeout(el._sbt);
				el._sbt = setTimeout(function () { el.classList.remove('is-scrolling'); }, 900);
			}, true);
			/* rows of covers become carousels, now and whenever a page draws new ones */
			App.carousels(document);
			var pend = 0;
			new MutationObserver(function () { if (!pend) pend = setTimeout(function () { pend = 0; App.carousels(document); }, 60); })
				.observe(document.body, { childList: true, subtree: true });
			window.addEventListener('resize', function () { document.querySelectorAll('.row-car').forEach(function (b) { if (b._upd) b._upd(); }); });
			window.addEventListener('hashchange', function () {
				if (window.PAGE && window.PAGE.onHash) window.PAGE.onHash(); else App.focusHash();
			});
			document.addEventListener('keydown', function (e) {
				var tag = (e.target.tagName || '').toLowerCase();
				var typing = tag === 'input' || tag === 'textarea' || e.target.isContentEditable;
				if ((e.key === '/' && !typing) || ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k')) {
					e.preventDefault(); Search.open();
				}
			});
		}
	};

	/* ---------- search ---------- */

	var Search = {
		index: null,

		build: function () {
			var d = App.data(), items = [];
			var add = function (kind, title, sub, href, extra) {
				items.push({
					kind: kind, title: title, sub: sub || '', href: href,
					key: norm([title && title.ar, title && title.en].join(' ')),
					body: norm(extra || '')
				});
			};
			var both = function (o) { return o ? [o.ar, o.en].join(' ') : ''; };
			var K = {
				series: { ar: 'سلسلة', en: 'Series' }, work: { ar: 'كتاب', en: 'Book' }, issue: { ar: 'عدد', en: 'Issue' },
				character: { ar: 'شخصية', en: 'Character' }, writer: { ar: 'كاتب', en: 'Writer' }, quote: { ar: 'اقتباس', en: 'Quote' },
				legacy: { ar: 'الإرث', en: 'Legacy' }, tribute: { ar: 'قالوا عنه', en: 'Tribute' }, blog: { ar: 'المدونة', en: 'Blog' }, media: { ar: 'لقاء / مقال', en: 'Media' },
				about: { ar: 'كتاب عنه', en: 'Book about him' }, near: { ar: 'كتاب من حوله', en: 'Related book' }, publisher: { ar: 'دار نشر', en: 'Publisher' },
				award: { ar: 'جائزة', en: 'Award' }, audio: { ar: 'مسموع', en: 'Audio' }, page: { ar: 'صفحة', en: 'Page' },
				phrase: { ar: 'عبارة', en: 'Phrase' }
			};
			var S = window.WorksShared;

			(d.series || []).forEach(function (s) { add(K.series, s.title, s.years, 'series.html?id=' + s.id, both(s.tagline) + ' ' + both(s.synopsis)); });
			(d.works || []).forEach(function (w) { add(K.work, w.title, w.year, 'book.html?id=' + w.id, both(w.synopsis)); });
			Object.keys(d.issues || {}).forEach(function (sid) {
				var s = App.byId(d.series, sid);
				(d.issues[sid] || []).forEach(function (is) {
					add(K.issue, is.title, (s ? s.title : null), App.issueHref(sid, is), String(is.n));
				});
			});
			(d.otherSeries || []).forEach(function (s) {
				add(K.series, s.title, s.owner || s.years, 'series.html?id=' + s.id, both(s.description));
				(s.issues || []).forEach(function (is, i) { add(K.issue, is.title, s.title, App.issueHref(s.id, Object.assign({ _idx: i }, is)), both(is.original)); });
			});
			(d.characters || []).forEach(function (c) { add(K.character, c.name, App.findWork(c.work) ? App.findWork(c.work).title : '', App.charHref(c.id), both(c.role) + ' ' + both(c.desc)); });
			/* each writer once, on their own page (as people.js names it), with every work they share with him */
			var W = d.writers || {}, people = {};
			var slugOf = function (name) {
				return String((name && name.en) || '').replace(/^Dr\.\s*/, '').toLowerCase()
					.normalize('NFKD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'writer';
			};
			Object.keys(W).forEach(function (k) {
				(W[k] || []).forEach(function (w) {
					var id = slugOf(w.name), p = people[id] = people[id] || { name: w.name, work: w.work || w.book || '', body: [] };
					p.body.push(both(w.work), both(w.book), both(w.text));
				});
			});
			Object.keys(people).forEach(function (id) { var p = people[id]; add(K.writer, p.name, p.work, 'writer.html?id=' + encodeURIComponent(id), p.body.join(' ')); });
			/* the other writers' books with his words or dedicated to him, and the books about him: each has its page */
			if (S && S.entryBooks) S.entryBooks().forEach(function (x) { add(K.near, x.w.book, x.w.name, S.bookHref(x.id), both(x.w.text)); });
			(d.aboutBooks || []).forEach(function (b) { add(K.about, b.title, b.by, 'book.html?id=' + encodeURIComponent(b.id), both(b.by) + ' ' + both(b.publisher)); });
			if (S && S.publishers) S.publishers().forEach(function (x) { var p = x.p || x; add(K.publisher, p.name, p.city || '', 'publisher.html?id=' + encodeURIComponent(p.id), both(p.note) + ' ' + both(p.about)); });
			(d.awards || []).forEach(function (a) { add(K.award, a.title, a.year, a.work ? 'book.html?id=' + encodeURIComponent(a.work) : 'works.html#awards-section', both(a.text)); });
			/* the Audio page's own rows: Eslam Adel's readings, the After Midnight programme, its later seasons and their episodes */
			var au = d.audio || {};
			if (au.youtube && au.youtube.eslamAdel) au.youtube.eslamAdel.eps.forEach(function (ep) { add(K.audio, ep[2], { ar: 'بصوت إسلام عادل', en: 'Read by Eslam Adel' }, 'audio.html', 'بصوت إسلام عادل Eslam Adel YouTube'); });
			(au.midnight || []).forEach(function (m) { add(K.audio, { ar: m[0], en: m[0] }, { ar: 'بعد منتصف الليل', en: 'After Midnight' }, 'audio.html', 'audiohat'); });
			(au.seasons || []).forEach(function (se) {
				add(K.audio, { ar: 'بعد منتصف الليل — الموسم ' + se.n, en: 'After Midnight — season ' + se.n }, { ar: String(se.year || ''), en: String(se.year || '') }, 'audio.html',
					se.eps.map(function (ep) { return ep[2] || ''; }).join(' '));
			});
			if (au.midnightSpoofs) add(K.audio, au.midnightSpoofs.title, { ar: au.midnightSpoofs.years || '', en: au.midnightSpoofs.years || '' }, 'audio.html', 'audiohat');
			(d.quotes || []).forEach(function (q, i) { add(K.quote, q.text, q.from, 'quotes.html#q-' + i, both(q.from)); });
			/* «قاموس العرّاب»'s phrases, each to its card under the quotes (built into data-built.js) */
			(d.glossary || []).forEach(function (g, i) { add(K.phrase, { ar: g.phrase, en: g.en }, { ar: 'قاموس العرّاب', en: 'The phrasebook' }, 'quotes.html#g-' + i, g.phrase + ' ' + g.en + ' ' + both(g.meaning)); });
			/* the site's own pages, the header's and the footer's, found by their names and what they hold */
			var PAGE_WORDS = { papers: 'مقالات صحف جرائد التحرير الدستور إضاءات columns newspapers', numbers: 'أرقام إحصاءات إحصاءات الموقع أسلوب لغة كلمات جمل statistics site numbers style language words', quiz: 'اختبار مسابقة أسئلة شخصية بطاقة القارئ اقرأ معنا نادي القراءة quiz character reader card reading club',
				map: 'خريطة أماكن map places', world: 'ترجمة مترجم لغات translations languages', screen: 'مسلسل فيلم نتفليكس netflix series film adaptation',
				covers: 'أغلفة غلاف طبعات طبعة covers editions', lists: 'قوائم رحلتي قراءة تقدم lists journey reading progress',
				talks: 'سيرة حياة لقاءات حوارات فيديو طنطا مدينته بيته قبره biography life interviews videos Tanta city', awards: 'جوائز جائزة تكريم awards prizes', translations: 'ترجمة ترجمات مترجم روايات عالمية للجيب رجفة الخوف نادي القتال translation translator fight club',publishers: 'دور نشر ناشر publishers',
				library: 'كتب أفلام موسيقى مفضلة نصح books films music favourite', glossary: 'عبارات قاموس لزمات حتى تحترق النجوم phrases glossary',
				creatures: 'وحوش أساطير مصاص دماء مذءوب نداهة مومياء monsters legends vampire werewolf', 'refaat-life': 'رفعت إسماعيل حياة سيرة يوميات Refaat life',
				network: 'شبكة شخصيات علاقات characters web relations', handwriting: 'خط يده إهداء توقيع مخطوط handwriting dedication signature',
				style: 'أسلوب لغة كلمات style language words', writers: 'كتاب رسامون مخرجون ممثلون دائرة writers artists directors actors circle',
				changelog: 'تحديثات جديد سجل changelog updates', sitemap: 'خريطة الموقع صفحات sitemap pages', about: 'عن الموقع أسئلة شائعة about faq', contact: 'تواصل ساهم مساهمة contact contribute' };
			UI.nav.concat(UI.more, UI.world, UI.legal, UI.sections).forEach(function (n) {
				var id = n.href.split('#')[1] || n.href.replace(/\.html$/, '');
				if (n.href !== 'index.html') add(K.page, { ar: n.ar, en: n.en }, '', n.href, PAGE_WORDS[id] || '');
			});
			(d.legacy || []).forEach(function (l, i) { add(K.legacy, l.title, l.date, 'legacy.html#l-' + i, both(l.text)); });
			(d.tributes || []).forEach(function (p, i) { add(K.tribute, p.name, p.role, 'tributes.html#t-' + i, both(p.quote) + ' ' + both(p.context)); });
			(d.media || []).forEach(function (m, i) { add(K.media, m.title, m.outlet, 'legacy.html#m-' + i, both(m.note)); });
			/* his columns, stories and comics from the blog archive (loaded on first search) */
			((d.blog && d.blog.posts) || []).forEach(function (p) { add(K.blog, { ar: p.t, en: p.t }, { ar: p.src || p.d, en: p.src || p.d }, 'blog.html?post=' + p.id, (p.l || []).join(' ') + ' ' + (p.ex || '')); });
			Search.index = items;
		},

		query: function (q) {
			var nq = norm(q);
			if (!nq) return [];
			var terms = nq.split(' ');
			return Search.index.map(function (it) {
				var score = 0;
				for (var i = 0; i < terms.length; i++) {
					var t = terms[i];
					if (it.key.indexOf(t) >= 0) score += it.key.indexOf(t) === 0 ? 6 : 4;
					else if (it.body.indexOf(t) >= 0) score += 1;
					else return null;
				}
				if (it.key.indexOf(nq) >= 0) score += 5;
				return { it: it, score: score };
			}).filter(Boolean).sort(function (a, b) { return b.score - a.score; }).slice(0, 40).map(function (r) { return r.it; });
		},

		open: function () {
			if (!Search.index) Search.build();
			var refresh = function () {
				Search.build();
				var inp = document.querySelector('#search-dialog input');
				if (inp && inp.value.trim()) inp.dispatchEvent(new Event('input'));
			};
			/* (a page without the data fetches it first, the blog's after it, as the data sets window.AKT afresh) */
			var lazy = !App.data().works;
			App.needData(function () {
				if (lazy) refresh();
				/* the blog index is large, so pages other than the blog fetch it only when search opens */
				[['blog', 'data-blog.js']].forEach(function (x) {
					if (App.data()[x[0]] || (Search.loading || (Search.loading = {}))[x[0]]) return;
					Search.loading[x[0]] = true;
					var bs = document.createElement('script');
					bs.src = 'assets/js/' + x[1];
					bs.onload = refresh;
					document.head.appendChild(bs);
				});
			});
			var dlg = document.getElementById('search-dialog');
			if (!dlg) {
				dlg = document.createElement('dialog');
				dlg.id = 'search-dialog';
				dlg.className = 'search-dialog';
				document.body.appendChild(dlg);
				dlg.addEventListener('click', function (e) { if (e.target === dlg) dlg.close(); });
			}
			dlg.innerHTML =
				'<form method="dialog" class="search-box" role="search">' +
					'<input type="search" autocomplete="off" placeholder="' + App.L('ابحث عن كتاب، عدد، شخصية، كاتب، اقتباس، مقال…', 'Search books, issues, characters, writers, quotes, articles…') + '" aria-label="' + App.L('بحث', 'Search') + '">' +
					'<button type="submit" class="search-close" aria-label="' + App.L('إغلاق', 'Close') + '">Esc</button>' +
				'</form>' +
				'<ul class="search-results" role="listbox"></ul>' +
				'<p class="search-hint">' + App.L('اكتب للبحث — يعمل بالعربية والإنجليزية.', 'Type to search — works in Arabic and English.') + '</p>';
			var input = dlg.querySelector('input'), list = dlg.querySelector('.search-results'), hint = dlg.querySelector('.search-hint');
			var render = function () {
				var res = Search.query(input.value);
				hint.hidden = !!input.value.trim();
				if (input.value.trim() && !res.length) { list.innerHTML = '<li class="none">' + App.L('لا نتائج.', 'No results.') + '</li>'; return; }
				list.innerHTML = res.map(function (it, i) {
					var sub = typeof it.sub === 'object' ? App.t(it.sub) : App.num(it.sub);
					return '<li><a href="' + App.esc(it.href) + '"' + (i === 0 ? ' class="active"' : '') + '>' +
						'<span class="kind">' + App.tx(it.kind) + '</span>' +
						'<span class="ttl">' + App.tx(it.title) + '</span>' +
						(sub ? '<span class="sub">' + App.esc(sub) + '</span>' : '') +
					'</a></li>';
				}).join('');
			};
			input.addEventListener('input', render);
			input.addEventListener('keydown', function (e) {
				var links = [].slice.call(list.querySelectorAll('a'));
				var cur = links.findIndex(function (a) { return a.classList.contains('active'); });
				if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
					e.preventDefault();
					if (!links.length) return;
					if (cur >= 0) links[cur].classList.remove('active');
					cur = (cur + (e.key === 'ArrowDown' ? 1 : -1) + links.length) % links.length;
					links[cur].classList.add('active');
					links[cur].scrollIntoView({ block: 'nearest' });
				} else if (e.key === 'Enter') {
					e.preventDefault();
					if (cur >= 0) { dlg.close(); location.href = links[cur].href; }
				}
			});
			list.addEventListener('click', function (e) { if (e.target.closest('a')) dlg.close(); });
			dlg.showModal();
			input.focus();
		}
	};

	App.Search = Search;
	window.App = App;

	if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', App.boot);
	else App.boot();
})();

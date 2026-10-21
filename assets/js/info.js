/* The pages linked only from the footer: about, sources & method, privacy, rights, contact.
   One script for all five; each page says which it is with <main data-info="…">. */
(function () {
	var id = (document.getElementById('main') || {}).getAttribute ? document.getElementById('main').getAttribute('data-info') : '';
	var REPO = 'https://github.com/SamehBilal/ahmed-khaled-tawfik';
	var ext = function (href, text) { return '<a href="' + href + '" target="_blank" rel="noopener">' + text + '</a>'; };

	var PAGES = {
		about: {
			title: { ar: 'عن الموقع', en: 'About this site' },
			eyebrow: { ar: 'من صنع هذا؟', en: 'Who made this?' },
			lead: {
				ar: 'موقع محبّين غير رسمي عن د. أحمد خالد توفيق: حياته وسلاسله ورواياته وشخصياته والكتّاب من حوله، بالعربية والإنجليزية.',
				en: 'An unofficial fan site about Dr. Ahmed Khaled Tawfik: his life, series, novels, characters and the writers around him, in Arabic and English.'
			},
			sections: [
				{ h: { ar: 'لماذا هذا الموقع؟', en: 'Why this site?' },
					p: { ar: '<p>جعل أحمد خالد توفيق جيلًا كاملًا يقرأ. أعماله موزّعة على مئات الأعداد والطبعات والناشرين، ولم يكن هناك مكان واحد يجمعها مرتّبة: كل سلسلة بأعدادها وأغلفتها، وكل كتاب بطبعاته، وكل شخصية بمواضع ظهورها. هذا الموقع محاولة لصنع ذلك المكان، ولقارئ جديد يسأل: من أين أبدأ؟</p>',
						en: '<p>Ahmed Khaled Tawfik made a whole generation read. His work is spread over hundreds of issues, editions and publishers, and there was no single place that laid it out in order: each series with its issues and covers, each book with its editions, each character with where they appear. This site tries to be that place — and to answer a new reader asking where to start.</p>' } },
				{ h: { ar: 'من صنعه', en: 'Who built it' },
					p: { ar: '<p>صمّمه وبناه <strong>سامح بلال</strong>، قارئ نشأ على «ما وراء الطبيعة» و«فانتازيا» و«سافاري». لا يمثّل الموقع أسرة الكاتب، ولا أيًّا من ناشريه، ولا الجهات التي أنتجت أعماله للشاشة أو بالصوت، ولا يربح منها شيئًا: لا إعلانات ولا روابط تسويق.</p><p>' + ext('https://github.com/SamehBilal', 'صفحته على GitHub ↗') + '</p>',
						en: '<p>Designed and built by <strong>Sameh Bilal</strong>, a reader who grew up on Ma Wara’ al-Tabi’a, Fantasia and Safari. The site does not speak for the author’s family, any of his publishers, or the companies that brought his work to screen or audio, and it earns nothing from them: no ads, no affiliate links.</p><p>' + ext('https://github.com/SamehBilal', 'His GitHub profile ↗') + '</p>' } },
				{ h: { ar: 'كيف بُني', en: 'How it is built' },
					p: { ar: '<p>صفحات HTML وCSS وJavaScript بسيطة، دون خوادم ولا قواعد بيانات: كل المحتوى في ملفات بيانات نصّية مفتوحة. يُستضاف على GitHub Pages، ويمكن تثبيته تطبيقًا يعمل دون إنترنت. شيفرته كاملة منشورة على ' + ext(REPO, 'GitHub ↗') + '، ويمكن لأي أحد أن يقترح عليها تصحيحًا أو إضافة.</p>',
						en: '<p>Plain HTML, CSS and JavaScript, with no servers or databases: all the content lives in open, plain-text data files. It is hosted on GitHub Pages and installs as an app that works offline. All of its code is public on ' + ext(REPO, 'GitHub ↗') + ', where anyone can suggest a correction or an addition.</p>' } },
				{ h: { ar: 'شكر وإسناد', en: 'Credits' },
					p: { ar: '<ul><li>الكتب ثلاثية الأبعاد مبنية على عروض Codrops (Marco Barría)، ومعها خامات الورق والخشب.</li><li>مشغّل الكاسيت مقتبس من عرض Codrops «Old School Cassette Player»، ورسم الشريط لـ Mauricio Estrella، وأصواته لـ Pogotron على Freesound.</li><li>افتتاحية الصفحة الرئيسية مقتبسة من حركة «Believe» لـ GSAP.</li><li>خط The Godfather من تصميم Jeff Bell، وبقية الخطوط من Google Fonts (رخصة SIL المفتوحة).</li><li>خفافيش التذييل عن عرض Calleb على CodePen (رخصة MIT).</li><li>التلّ المسكون ومشهد السافاري والساحرة في التذييل من ' + ext('https://www.vecteezy.com/', 'Vecteezy.com') + '.</li><li>الأغلفة والصور ملك أصحابها: الناشرين والرسّامين والمصوّرين — راجع ' + '<a href="terms.html">حقوق الاستخدام</a>.</li></ul>',
						en: '<ul><li>The 3D books are built on Codrops demos (Marco Barría), with their paper and wood textures.</li><li>The cassette player is adapted from Codrops’ “Old School Cassette Player”; tape artwork by Mauricio Estrella, tape sounds by Pogotron on Freesound.</li><li>The home page opening is adapted from the GSAP “Believe” animation.</li><li>“The Godfather” font by Jeff Bell; the other fonts from Google Fonts (SIL Open Font License).</li><li>The footer bats after Calleb on CodePen (MIT licence).</li><li>The footer’s haunted hill, savanna scene and witch from ' + ext('https://www.vecteezy.com/', 'Vecteezy.com') + '.</li><li>Covers and photos belong to their owners — publishers, illustrators and photographers. See <a href="terms.html">Rights &amp; use</a>.</li></ul>' } }
			]
		},

		sources: {
			title: { ar: 'المصادر وطريقة الجمع', en: 'Sources & method' },
			eyebrow: { ar: 'من أين جاءت البيانات؟', en: 'Where the data comes from' },
			lead: {
				ar: 'كل ما في الموقع مجمّع يدويًا من مصادر عامة يمكن الرجوع إليها. هنا كيف جُمع، وكيف يُراجع، وقائمة المراجع كاملة.',
				en: 'Everything here was gathered by hand from public sources you can check. Here is how it was collected, how it is checked, and the full list of references.'
			},
			sections: [
				{ h: { ar: 'كيف جُمعت', en: 'How it was collected' },
					p: { ar: '<ul><li><strong>السيرة والتواريخ:</strong> من ويكيبيديا بالعربية والإنجليزية، ومن حواراته ومقالات الصحف عند رحيله.</li><li><strong>الأعداد والطبعات:</strong> من قوائم أعداد السلاسل، وفهارس الناشرين، ومتاجر الكتب (أبجد، جرير، بيت الكتاب، أمازون)، ومن Goodreads وOpen Library.</li><li><strong>الأغلفة:</strong> من صفحات الكتب في تلك المتاجر والفهارس؛ وحين لا نجد غلافًا يرسم الموقع غلافًا بلون الكتاب.</li><li><strong>الاقتباسات:</strong> من كتبه ومقالاته، ولكل اقتباس مصدره.</li><li><strong>المسموع والشاشة:</strong> روابط إلى YouTube وAudiohat والمنصّات؛ لا يستضيف الموقع أي صوت أو فيديو.</li></ul>',
						en: '<ul><li><strong>Life and dates:</strong> Arabic and English Wikipedia, his interviews, and press articles written when he died.</li><li><strong>Issues and editions:</strong> series issue lists, publishers’ catalogues, bookstores (Abjjad, Jarir, The Book Home, Amazon), Goodreads and Open Library.</li><li><strong>Covers:</strong> from the book pages of those stores and catalogues; where none is found, the site draws a cover in the book’s colour.</li><li><strong>Quotes:</strong> from his books and articles, each with its source.</li><li><strong>Audio and screen:</strong> links to YouTube, Audiohat and the platforms; the site hosts no audio or video.</li></ul>' } },
				{ h: { ar: 'كيف تُراجع', en: 'How it is checked' },
					p: { ar: '<p>تُقارَن العناوين وأرقام الأعداد وسنوات الصدور بأكثر من مصدر حين يمكن ذلك، والمعلومة التي تقوم على مصدر واحد تحمل رابطه في صفحة الكتاب أو السلسلة. قد تختلف المصادر في سنة طبعة أو ترتيب عدد، وقد تكون بعض الطبعات النادرة ناقصة. إن وجدت خطأً فأرسله مع رابط المصدر من <a href="contact.html">صفحة التواصل</a>.</p>',
						en: '<p>Titles, issue numbers and years are compared across more than one source where possible, and anything resting on a single source carries its link on the book or series page. Sources sometimes disagree on an edition’s year or an issue’s order, and some rare editions may be missing. If you find a mistake, send it with a link to your source from the <a href="contact.html">contact page</a>.</p>' } }
			],
			extra: function (App) {
				var A = window.AKT || {}, L = App.L, e = App.esc;
				var seen = {}, main = [];
				(A.sources || []).concat(A.issuesSources || []).forEach(function (s) { if (s && s.url && !seen[s.url]) { seen[s.url] = 1; main.push(s); } });
				/* the links cited on book, issue and series pages, counted by site */
				var hosts = {}, cited = 0;
				var take = function (u) {
					if (typeof u !== 'string' || seen[u]) return;
					seen[u] = 1; cited++;
					var h = (u.match(/^https?:\/\/(?:www\.)?([^\/]+)/) || [])[1];
					if (h) hosts[h] = (hosts[h] || 0) + 1;
				};
				[A.bookInfo, A.issueInfo, A.seriesInfo].forEach(function (o) {
					Object.keys(o || {}).forEach(function (k) { ((o[k] || {}).sources || []).forEach(function (s) { take(s && s.url || s); }); });
				});
				var top = Object.keys(hosts).sort(function (a, b) { return hosts[b] - hosts[a]; }).slice(0, 14);
				return '<section class="info-sec"><h2>' + L('المراجع الرئيسية', 'Main references') + '</h2>' +
					'<ul class="info-refs">' + main.map(function (s) { return '<li><a href="' + e(s.url) + '" target="_blank" rel="noopener">' + e(s.label || s.url) + '</a></li>'; }).join('') + '</ul></section>' +
					(cited ? '<section class="info-sec"><h2>' + L('ومراجع في صفحات الكتب', 'And on the book pages') + '</h2>' +
						'<p>' + L('إلى جانبها ', 'Besides these, ') + App.num(cited) + L(' رابطًا آخر مذكورًا في صفحات الكتب والسلاسل، أكثرها من:', ' more links are cited on book and series pages, most of them from:') + '</p>' +
						'<ul class="info-hosts">' + top.map(function (h) { return '<li><span dir="ltr">' + e(h) + '</span> <b>' + App.num(hosts[h]) + '</b></li>'; }).join('') + '</ul></section>' : '');
			}
		},

		privacy: {
			title: { ar: 'الخصوصية', en: 'Privacy' },
			eyebrow: { ar: 'ماذا يعرف الموقع عنك؟', en: 'What the site knows about you' },
			lead: {
				ar: 'باختصار: لا شيء تقريبًا. لا حسابات، ولا إعلانات، ولا أدوات تتبّع أو إحصاء، ولا ملفات ارتباط (كوكيز) يضعها الموقع.',
				en: 'In short: almost nothing. No accounts, no ads, no tracking or analytics, and no cookies set by the site.'
			},
			sections: [
				{ h: { ar: 'ما يُحفظ في متصفحك فقط', en: 'What stays in your browser' },
					p: { ar: '<p>يحفظ الموقع بعض التفضيلات في متصفحك نفسه (localStorage)، ولا تُرسل إلى أي مكان:</p><ul><li>اللغة التي اخترتها، والمظهر (ليلي أو ورقي).</li><li>قوائمك («أريد قراءته»، «قرأته»…) إن استخدمتها، ويمكنك تصديرها أو مسحها.</li><li>أنك شاهدت الافتتاحية في هذه الجلسة، وموعد آخر حفظ للأغلفة دون إنترنت.</li></ul><p>تمسحها كلها بمسح بيانات هذا الموقع من إعدادات متصفحك.</p>',
						en: '<p>The site keeps a few preferences in your own browser (localStorage); they are never sent anywhere:</p><ul><li>The language you chose, and the theme (night or paper).</li><li>Your lists (“want to read”, “read”…) if you use them — you can export or clear them.</li><li>That you saw the opening in this session, and when you last saved the covers for offline.</li></ul><p>Clearing this site’s data in your browser settings removes all of it.</p>' } },
				{ h: { ar: 'العمل دون إنترنت', en: 'Working offline' },
					p: { ar: '<p>ليعمل الموقع دون إنترنت يحفظ متصفحك نسخة من صفحاته وصوره (Service Worker). هذه النسخة على جهازك وحده، ويمكنك حذفها بمسح بيانات الموقع أو بإلغاء تثبيت التطبيق.</p>',
						en: '<p>To work offline, your browser keeps a copy of the site’s pages and images (a service worker). That copy lives only on your device; clearing the site’s data or uninstalling the app removes it.</p>' } },
				{ h: { ar: 'الخدمات الخارجية', en: 'Outside services' },
					p: { ar: '<ul><li><strong>الاستضافة:</strong> الموقع على GitHub Pages، وقد تحتفظ GitHub بسجلّات تقنية (مثل عنوان IP) لأغراض الأمان، وفق ' + ext('https://docs.github.com/site-policy/privacy-policies/github-general-privacy-statement', 'سياسة خصوصيتها') + '.</li><li><strong>مكتبات الحركة:</strong> تُحمَّل في بعض الصفحات من شبكات CDN عامة (jsDelivr وcdnjs وunpkg).</li><li><strong>YouTube:</strong> في صفحة «مسموع» تُحمَّل أداة المشغّل وصور الحلقات من YouTube، وتُعرض المقاطع من نطاق youtube-nocookie.com؛ وقد يضع YouTube ملفاته الخاصة حين تشغّل مقطعًا.</li><li><strong>الروابط:</strong> روابط المتاجر وAudiohat والمواقع الأخرى تفتح مواقعها، ولكلٍّ منها سياسته.</li></ul>',
						en: '<ul><li><strong>Hosting:</strong> the site runs on GitHub Pages; GitHub may keep technical logs (such as IP addresses) for security, under its ' + ext('https://docs.github.com/site-policy/privacy-policies/github-general-privacy-statement', 'privacy statement') + '.</li><li><strong>Animation libraries:</strong> some pages load them from public CDNs (jsDelivr, cdnjs, unpkg).</li><li><strong>YouTube:</strong> on the Audio page the player script and episode thumbnails load from YouTube, and videos play from youtube-nocookie.com; YouTube may set its own cookies when you play one.</li><li><strong>Links:</strong> store, Audiohat and other links open those sites, each under its own policy.</li></ul>' } },
				{ h: { ar: 'إن راسلتنا', en: 'If you write to us' },
					p: { ar: '<p>التصحيحات تُرسل عبر GitHub، فتكون علنية ويظهر فيها اسم حسابك هناك. لا تكتب فيها بيانات شخصية لا تريد نشرها.</p>',
						en: '<p>Corrections go through GitHub, so they are public and show your account name there. Don’t include personal details you don’t want published.</p>' } }
			]
		},

		terms: {
			title: { ar: 'حقوق الاستخدام', en: 'Rights & use' },
			eyebrow: { ar: 'لمن هذه الكتب والصور؟', en: 'Whose books and images are these?' },
			lead: {
				ar: 'الأعمال لأصحابها. هذا الموقع فهرس ودليل، لا مكتبة تحميل.',
				en: 'The works belong to their owners. This site is a catalogue and a guide, not a download library.'
			},
			sections: [
				{ h: { ar: 'حقوق الأعمال', en: 'Rights in the works' },
					p: { ar: '<p>حقوق كتب أحمد خالد توفيق ونصوصه لورثته ولناشريه. لا ينشر الموقع نصوص الكتب، ولا يقدّم روابط لنسخ مقرصنة؛ بل يدلّك على أماكن شرائها أو قراءتها أو الاستماع إليها بشكل قانوني. الاقتباسات قصيرة، ومذكور مصدرها، للتعريف والتذكّر.</p>',
						en: '<p>The rights to Ahmed Khaled Tawfik’s books and writing belong to his heirs and his publishers. The site does not publish the books’ text and does not link to pirated copies; it points you to where you can buy, read or listen to them legally. Quotes are short and sourced, for reference and remembrance.</p>' } },
				{ h: { ar: 'الأغلفة والصور', en: 'Covers and images' },
					p: { ar: '<p>الأغلفة ملك ناشريها ورسّاميها، وتُعرض صغيرة للتعريف بالكتاب، كما في أي فهرس أو متجر. الملصقات وصور الشاشة لمنتجيها، والصور الشخصية لمصوّريها ومصادرها. أسماء المنصّات والعلامات التجارية لأصحابها.</p>',
						en: '<p>Covers belong to their publishers and illustrators and are shown small to identify the book, as in any catalogue or store. Posters and stills belong to their producers, photos to their photographers and sources. Platform names and trademarks belong to their owners.</p>' } },
				{ h: { ar: 'طلب الإزالة', en: 'Removal requests' },
					p: { ar: '<p>إن كنت صاحب حق في صورة أو نص هنا وتريد إزالته أو تعديل إسناده، فراسلنا من <a href="contact.html">صفحة التواصل</a> وسنستجيب في أقرب وقت.</p>',
						en: '<p>If you hold the rights to an image or text here and want it removed or its credit changed, write to us from the <a href="contact.html">contact page</a> and we will act on it as soon as we can.</p>' } },
				{ h: { ar: 'دقّة المعلومات', en: 'Accuracy' },
					p: { ar: '<p>جُمع المحتوى بعناية، لكنه عمل محبّين يقدَّم كما هو، وقد يحتوي أخطاء. للبحث الأكاديمي ارجع دائمًا إلى المصادر المذكورة في <a href="sources.html">صفحة المصادر</a>.</p>',
						en: '<p>The content was gathered with care, but it is a fan project offered as is and may contain mistakes. For academic work, always go back to the sources listed on the <a href="sources.html">sources page</a>.</p>' } },
				{ h: { ar: 'الموقع نفسه', en: 'The site itself' },
					p: { ar: '<p>تصميم الموقع وشيفرته منشوران على ' + ext(REPO, 'GitHub ↗') + '. المكوّنات المقتبسة من غيرنا تبقى تحت رخص أصحابها (انظر <a href="about.html#credits">شكر وإسناد</a>).</p>',
						en: '<p>The site’s design and code are public on ' + ext(REPO, 'GitHub ↗') + '. Parts adapted from others stay under their owners’ licences (see <a href="about.html#credits">Credits</a>).</p>' } }
			]
		},

		contact: {
			title: { ar: 'تواصل', en: 'Contact' },
			eyebrow: { ar: 'لديك تصحيح أو إضافة؟', en: 'A correction or an addition?' },
			lead: {
				ar: 'الموقع يكبر بقرّائه. غلاف ناقص، تاريخ خاطئ، اقتباس بلا مصدر، أو طلب من صاحب حق — كلها مرحّب بها.',
				en: 'The site grows with its readers. A missing cover, a wrong date, an unsourced quote, or a request from a rights holder — all welcome.'
			},
			sections: []
		}
	};

	var cfg = PAGES[id] || PAGES.about;
	window.PAGE = {
		id: 'info-' + id,
		title: cfg.title,
		strings: { eyebrow: cfg.eyebrow, title: cfg.title, lead: cfg.lead },

		render: function () {
			var App = window.App, L = App.L, t = App.t, e = App.esc;
			var tabs = ['about', 'sources', 'privacy', 'terms', 'contact'].map(function (k) {
				return '<a href="' + k + '.html"' + (k === id ? ' aria-current="page"' : '') + '>' + e(t(PAGES[k].title)) + '</a>';
			}).join('');
			var body = cfg.sections.map(function (s, i) {
				var sid = id === 'about' && i === cfg.sections.length - 1 ? ' id="credits"' : '';
				return '<section class="info-sec"' + sid + '><h2>' + e(t(s.h)) + '</h2>' + t(s.p) + '</section>';
			}).join('');

			if (id === 'contact') {
				var card = function (icon, h, p, href, btn) {
					return '<div class="info-card"><span class="info-ic" aria-hidden="true">' + icon + '</span><h2>' + h + '</h2><p>' + p + '</p>' +
						'<a class="buy-btn" href="' + e(href) + '" target="_blank" rel="noopener">' + btn + '</a></div>';
				};
				var issue = function (title, body) { return REPO + '/issues/new?title=' + encodeURIComponent(title) + '&body=' + encodeURIComponent(body); };
				body = '<div class="info-cards">' +
					card('✎', L('تصحيح أو إضافة', 'A correction or addition'),
						L('افتح بلاغًا على GitHub فيه الصفحة والخطأ والتصحيح ورابط المصدر. ستجد زرًّا مثله أسفل كل صفحة وفي صفحات الكتب.', 'Open an issue on GitHub with the page, the mistake, the fix and a link to your source. There is a button like this at the foot of every page and on book pages.'),
						App.fixHref(L('', '')), L('اقترح تصحيحًا ↗', 'Suggest a fix ↗')) +
					card('⚖', L('طلب من صاحب حق', 'From a rights holder'),
						L('لإزالة صورة أو نص أو تعديل إسناده، اذكر العمل والصفحة وصفتك.', 'To remove an image or text or change its credit, name the work, the page, and your role.'),
						issue(L('طلب حقوق: ', 'Rights request: '), L('الصفحة:\n\nالعمل:\n\nالمطلوب (إزالة / تعديل الإسناد):\n\nصفتك:\n', 'Page:\n\nWork:\n\nRequest (remove / change credit):\n\nYour role:\n')),
						L('أرسل الطلب ↗', 'Send the request ↗')) +
					card('✉', L('فكرة أو رسالة', 'An idea or a note'),
						L('اقتراح لصفحة جديدة، أو ذكرى مع كتبه تحب أن تشاركها، أو مجرد تحية.', 'An idea for a new page, a memory of his books you’d like to share, or just hello.'),
						REPO + '/issues/new', L('اكتب لنا ↗', 'Write to us ↗')) +
				'</div>' +
				'<p class="info-note">' + L('الرسائل تُرسل عبر GitHub وتحتاج حسابًا مجانيًا هناك، وتكون علنية — انظر ', 'Messages go through GitHub, need a free account there, and are public — see ') + '<a href="privacy.html">' + L('الخصوصية', 'Privacy') + '</a>.</p>';
			}

			document.getElementById('content').innerHTML =
				'<div class="wrap info-wrap"><nav class="info-tabs" aria-label="' + L('عن الموقع', 'About the site') + '">' + tabs + '</nav>' +
				'<div class="info-body">' + body + (cfg.extra ? cfg.extra(App) : '') + '</div></div>';
		}
	};
})();

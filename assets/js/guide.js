window.PAGE = {
	id: 'guide',
	title: { ar: 'من أين أبدأ؟', en: 'Start here' },
	strings: {
		eyebrow: { ar: 'دليل القراءة', en: 'Reading guide' },
		title: { ar: 'من أين أبدأ؟', en: 'Where do I start?' },
		lead: {
			ar: 'أكثر من مئتي كتاب قد تُربك القارئ الجديد. هذه مسارات مقترحة حسب ذوقك — ليست قوائم رسمية، بل نقطة انطلاق.',
			en: 'More than two hundred books can overwhelm a new reader. These are suggested paths by taste — not official lists, just a way in.'
		}
	},

	/* Each step points at a series or work id (optionally a series issue number). Titles and years come from the data. */
	paths: [
		{
			id: 'horror', color: '#8c2318',
			for: { ar: 'لمحبّي الرعب — ولمن شاهد المسلسل', en: 'For horror fans — and anyone who watched the show' },
			title: { ar: 'عالم رفعت إسماعيل', en: 'The world of Refaat Ismail' },
			text: { ar: 'هنا بدأ كل شيء: رعب مصري بلسان عجوز ساخر لا يصدّق الخوارق، ثم توسّع العالم إلى قصص قصيرة ومسلسلات.', en: 'Where it all began: Egyptian horror told by a sardonic old sceptic, before the world spread into story collections and TV.' },
			steps: [
				{ ref: 'mwt', note: { ar: 'ابدأ من العدد الأول واقرأ بالترتيب؛ رفعت يكبر مع السلسلة وتتراكم حكايته.', en: 'Start at issue one and read in order — Refaat ages with the series and his story builds up.' } },
				{ ref: 'fantasia', issue: 35, note: { ar: 'لقاء نادر بين عالمين: عبير تقابل رفعت إسماعيل.', en: 'A rare crossover: Abeer meets Refaat Ismail.' } },
				{ ref: 'room207', note: { ar: 'غرفة فندق ملعونة واثنتا عشرة حكاية — وأساس مسلسل «الغرفة 207».', en: 'One cursed hotel room, twelve stories — and the basis of the series Room 207.' } },
				{ ref: 'hazzak', note: { ar: 'لعنة الأبراج الاثني عشر — وعنها مسلسل «زودياك».', en: 'A curse in twelve star signs — adapted as Zodiac.' } },
				{ ref: 'mawsoua', note: { ar: 'حين تريد أن تعرف أصل الأساطير التي كتب عنها.', en: 'For when you want the real lore behind the legends he wrote about.' } },
				{ ref: 'qessa-tokmeloha-anta', note: { ar: 'قصة رعب تفاعلية بدأها هو وأكملها كُتّاب شباب.', en: 'An interactive horror story he began and young writers carried on.' } },
				{ ref: 'afrah', note: { ar: 'تسع قصص صدرت بعد رحيله.', en: 'Nine stories, published after his death.' } },
				{ ref: 'rufaqa', note: { ar: 'اثنتا عشرة قصة نُشرت بعد رحيله.', en: 'Twelve stories, published after he died.' } }
			]
		},
		{
			id: 'novels', color: '#5b3a6e',
			for: { ar: 'لقرّاء الرواية الحديثة', en: 'For readers of the modern novel' },
			title: { ar: 'الروايات الكبيرة', en: 'The big novels' },
			text: { ar: 'الوجه الأكثر قتامة ونضجًا: مصر المستقبل المنقسمة، والعنف، وأحلام الطيران. اقرأها بترتيب صدورها.', en: 'His darkest, most grown-up side: a divided future Egypt, violence, and dreams of flight. Read them in publication order.' },
			steps: [
				{ ref: 'utopia', note: { ar: 'نقطة البداية المثالية للكبار؛ قصيرة وصادمة، وتُرجمت إلى لغات عدة.', en: 'The ideal adult entry point — short, shocking, and widely translated.' } },
				{ ref: 'senga' },
				{ ref: 'icarus' },
				{ ref: 'rats', note: { ar: 'رواية كاملة وُلدت من عالم «ما وراء الطبيعة».', en: 'A full novel grown out of the Beyond Nature universe.' } },
				{ ref: 'shaabeeb' }
			]
		},
		{
			id: 'essays', color: '#1f5a5a',
			for: { ar: 'لمن يحب السخرية والمقال', en: 'For lovers of satire and essays' },
			title: { ar: 'الطبيب الذي يكتب مقالات', en: 'The doctor who writes essays' },
			text: { ar: 'خفة الظل التي عرفها قرّاء مقالاته: عن مصر والناس والسينما والكتابة نفسها.', en: 'The wit his column readers knew: on Egypt, people, cinema — and writing itself.' },
			steps: [
				{ ref: 'zaghazigh', note: { ar: 'ابدأ بالسخرية الخالصة.', en: 'Start with pure satire.' } },
				{ ref: 'dahakat', note: { ar: 'أربعون مقالًا ساخرًا.', en: 'Forty satirical essays.' } },
				{ ref: 'demaghi' },
				{ ref: 'qahwa' },
				{ ref: 'shay' },
				{ ref: 'aflam', note: { ar: 'لمحبّي السينما: كتاب كامل عن الأفلام.', en: 'For film lovers: a whole book on cinema.' } },
				{ ref: 'laghz', note: { ar: 'لمن يحلم بالكتابة: خلاصة خبرته في الحرفة.', en: 'For aspiring writers: his thoughts on the craft.' } },
				{ ref: 'tweets-medieval', note: { ar: 'شذرات قصيرة، ساخرة وسياسية وحانية بالتناوب.', en: 'Short fragments, by turns satirical, political and tender.' } },
			]
		},
		{
			id: 'adventure', color: '#2f5a2a',
			for: { ar: 'لمحبّي المغامرة والطب والخيال العلمي', en: 'For adventure, medicine and sci-fi' },
			title: { ar: 'من أدغال أفريقيا إلى الإنترنت', en: 'From the African bush to the internet' },
			text: { ar: 'الطبيب في داخله يظهر هنا بوضوح: أوبئة وأسرار في الكاميرون، ثم خيال علمي يرويه فيروس.', en: 'The doctor in him shows most here: epidemics and secrets in Cameroon, then sci-fi narrated by a virus.' },
			steps: [
				{ ref: 'safari', note: { ar: 'علاء عبد العظيم ووحدة سافاري؛ الطب في قلب المغامرة.', en: 'Alaa Abdel Azim and the Safari unit — medicine at the heart of adventure.' } },
				{ ref: 'www' },
				{ ref: 'sandoq', note: { ar: 'قصص قصيرة متنوعة كتبها لمجلة الشباب.', en: 'Varied short stories written for Al-Shabab magazine.' } },
				{ ref: 'sharba', note: { ar: 'ثلاثون مقالًا عن العلم والعلم الزائف.', en: 'Thirty essays on science and pseudoscience.' } },
				{ ref: 'al-hafa', note: { ar: 'حقائق وظواهر غريبة على حافة المألوف، مع سند راشد دخيل.', en: 'Strange facts and phenomena at the edge of the ordinary, with Sanad Rashed Dakheel.' } },
				{ ref: 'hadem-al-asateer', note: { ar: 'يفكك الخرافات الشائعة والمفاهيم الخاطئة.', en: 'Takes apart popular myths and misconceptions.' } }
			]
		},
		{
			id: 'young', color: '#7a5a1c',
			for: { ar: 'للقرّاء الصغار والعائلة', en: 'For young readers and families' },
			title: { ar: 'خيال بلا حدود', en: 'Imagination without limits' },
			text: { ar: 'بوابة لطيفة إلى عالمه: فتاة عادية تعيش الحكايات، ورحلات في الزمن.', en: 'A gentle way in: an ordinary girl living inside stories, and journeys through time.' },
			steps: [
				{ ref: 'fantasia', note: { ar: 'كل عدد عالم جديد؛ اقرأ بأي ترتيب.', en: 'Every issue is a new world — read in any order.' } },
				{ ref: 'mirante' },
				{ ref: 'graveyard', note: { ar: 'ترجمته لرواية نيل جايمان عن صبي تربّيه الأشباح.', en: 'His translation of Neil Gaiman\'s boy-raised-by-ghosts novel.' } }
			]
		},
		{
			id: 'stories', color: '#5a2a4a',
			for: { ar: 'لمن يقرأ في جلسة واحدة', en: 'For reading in one sitting' },
			title: { ar: 'مجموعاته القصصية', en: 'The story collections' },
			text: { ar: 'قصص قصيرة بين الرعب والغرابة والحياة اليومية — كل مجموعة تُقرأ بأي ترتيب.', en: 'Short stories between horror, the uncanny and everyday life — read each collection in any order.' },
			steps: [
				{ ref: 'aql', note: { ar: 'اثنتان وعشرون قصة.', en: 'Twenty-two stories.' } },
				{ ref: 'esp', note: { ar: 'اثنتان وعشرون قصة أخرى.', en: 'Another twenty-two stories.' } },
				{ ref: 'anfham' },
				{ ref: 'lastwahdak' },
				{ ref: 'aquarelle' },
				{ ref: 'alhool' },
				{ ref: 'qaws', note: { ar: 'سبع قصص كتبها مع تامر إبراهيم.', en: 'Seven stories co-written with Tamer Ibrahim.' } }
			]
		},
		{
			id: 'translations', color: '#3b3b58',
			for: { ar: 'لمن يريد العرّاب مترجمًا', en: 'For the Godfather as translator' },
			title: { ar: 'العالم بالعربية', en: 'The world, in Arabic' },
			text: { ar: 'اختار أن ينقل إلى العربية أعمالًا جريئة وغير متوقعة.', en: 'He chose to bring bold, unexpected books into Arabic.' },
			steps: [
				{ ref: 'fightclub' },
				{ ref: 'dermaphoria' },
				{ ref: 'kiterunner' },
				{ ref: 'che' },
				{ ref: 'nashawat-qadima', note: { ar: 'كلمات أغانيه المفضلة وترجمتها، صدرت بعد رحيله.', en: 'The lyrics of his favourite songs and his translations of them, published after his death.' } },
				{ ref: 'rwg', note: { ar: 'روائع الأدب العالمي مختصرة بحجم الجيب؛ ترجم أعدادها من 7 إلى 83.', en: 'World classics abridged to pocket size; he translated issues 7 to 83.' } }
			]
		}
	],

	/* title for "issue N of series X": from the full issue list, else from the series' notable list */
	issueTitle: function (sid, n) {
		var d = window.App.data();
		var list = (d.issues && d.issues[sid]) || [];
		for (var i = 0; i < list.length; i++) if (+list[i].n === n && (list[i].part || 1) === 1) return list[i].title;
		var s = window.App.byId(d.series, sid);
		var hit = s && (s.notable || []).filter(function (x) { return new RegExp('\\(' + n + '\\)').test(x.ar || ''); })[0];
		if (hit) return { ar: hit.ar.replace(/\s*\(\d+\)\s*/, ' ').trim(), en: (hit.en || '').replace(/\s*\(\d+\)\s*/, ' ').trim() };
		return null;
	},

	render: function () {
		var App = window.App, e = App.esc, tx = App.tx, L = App.L, self = this, d = App.data(), S = window.WorksShared;
		/* a small cover beside each book: for a standalone book, the cover of its latest edition that has a back cover too
		   (the one a reader is likeliest to hold), else its first known cover; else a drawn one in the book's colour */
		var latestWithBack = function (info) {
			var key = function (ed) { return String(ed.date || ed.year || ''); };
			return ((info && info.editions) || []).filter(function (ed) { return ed.cover && ed.back; })
				.sort(function (a, b) { return key(b).localeCompare(key(a)); }).map(function (ed) { return ed.cover; })[0] || '';
		};
		var thumb = function (st, w, title) {
			if (!S) return '';
			var img = '';
			if (st.issue) {
				var is = S.seriesIssues(st.ref).filter(function (x) { return +x.n === st.issue && !(x.part > 1); })[0];
				img = is ? S.issueCover(st.ref, is) : '';
			} else if (App.byId(d.works, st.ref)) img = latestWithBack((d.bookInfo || {})[st.ref]) || S.coverOf((d.bookInfo || {})[st.ref]);
			else img = S.seriesBook(w).img;
			return S.miniCover({ img: img, color: w.color, title: title });
		};

		/* the paths as chips to jump to, then each path: its header, and its books as cover cards in reading order */
		var chips = '<nav class="path-chips" aria-label="' + e(L('طرق القراءة', 'Reading paths')) + '">' + this.paths.map(function (p) {
			return '<a href="#p-' + p.id + '" style="--c:' + p.color + '"><i></i>' + tx(p.title) + '</a>';
		}).join('') + '</nav>';
		var html = '<section class="section"><div class="wrap">' + chips + '<div class="paths">' + this.paths.map(function (p) {
			var n = 0;
			var steps = p.steps.map(function (st) {
				var w = App.findWork(st.ref);
				if (!w) return '';
				var href = App.workHref(st.ref), title = App.t(w.title), meta = w.year ? App.num(w.year) : (w.years ? App.num(w.years) : '');
				if (st.issue) {
					var it = self.issueTitle(st.ref, st.issue);
					href = 'book.html?id=' + st.ref + '-' + st.issue;
					title = App.t(w.title) + ' ' + App.num('#' + st.issue) + (it ? ': ' + App.t(it) : '');
					meta = '';
				}
				n++;
				return '<li class="step"><a href="' + href + '">' +
					'<span class="step-cover">' + thumb(st, w, App.t(w.title)) + '<b class="step-n">' + App.num(n) + '</b></span>' +
					'<span class="step-t">' + e(title) + '</span>' +
					(meta ? '<span class="step-y">' + e(meta) + '</span>' : '') +
					'<span class="step-note">' + (st.note ? tx(st.note) : tx(w.synopsis || w.tagline)) + '</span>' +
				'</a></li>';
			}).join('');
			return '<article class="path rise" id="p-' + p.id + '" style="--c:' + p.color + '">' +
				'<header class="path-head"><div class="for">' + tx(p.for) + '</div><h3>' + tx(p.title) + '</h3><p>' + tx(p.text) + '</p>' +
					'<span class="path-count">' + App.num(n) + ' ' + (n === 1 ? L('كتاب', 'book') : n === 2 ? L('كتابان', 'books') : L(n <= 10 ? 'كتب' : 'كتابًا', 'books')) + '</span></header>' +
				'<ol class="steps" style="--n:' + n + '">' + steps + '</ol>' +
			'</article>';
		}).join('') + '</div>' +
		'<p class="issues-note">' + L('لا تعرف ماذا تختار؟ استخدم البحث (اضغط /) أو تصفّح ', 'Still unsure? Use search (press /) or browse ') +
			'<a href="works.html">' + L('كل الأعمال', 'all the works') + '</a>.</p>' +
		'</div></section>';

		document.getElementById('content').innerHTML = html;
		/* the bookshelf at the top (assets/js/shelf-hero.js) */
		if (window.ShelfHero) window.ShelfHero.render(document.getElementById('shelf-hero'));
		App.focusHash();
	}
};

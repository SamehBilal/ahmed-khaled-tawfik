/* The people around him (writers, artists, those who carried his worlds on and brought them to the screen): every entry in AKT.writers merged by name, so each person is one
   card per shelf and one page (writer.html?id=<id>), with all they did with him in one place.
   Bios are short summaries, each linked to its source (Wikipedia or the author's page on Aseer Al Kotb);
   people the sources do not cover are introduced only by what they did with him. */
(function () {
	'use strict';

	var SHELVES = ['collaborators', 'introductions', 'dedications', 'influenced', 'contemporaries', 'artists', 'continued', 'screen', 'translated', 'about'];
	var WP = function (t) { return 'https://ar.wikipedia.org/wiki/' + encodeURIComponent(t.replace(/ /g, '_')); };
	var EN = function (t) { return 'https://en.wikipedia.org/wiki/' + encodeURIComponent(t.replace(/ /g, '_')); };
	var AK = function (s) { return 'https://www.aseeralkotb.com/ar/authors/' + encodeURIComponent(s); };

	var BIOS = {
		'tamer-ibrahim': { src: WP('تامر إبراهيم'),
			ar: 'كاتب مصري من أبرز كتّاب الرعب في العالم العربي. بدأ في سلسلة «سلة الروايات»، ثم كتب الرواية والقصة القصيرة وسيناريو المسلسلات.',
			en: 'An Egyptian writer, one of the best-known names in Arabic horror. He started in the Sallat al-Riwayat series, then wrote novels, short stories and television scripts.' },
		'sanad-rashed-dakhil': { src: WP('سند راشد دخيل'),
			ar: 'كاتب وباحث ومهندس كويتي، من أوائل من كتبوا الرعب والخيال العلمي بالعربية، وله دراسات في الغرائب والظواهر الخارقة.',
			en: 'A Kuwaiti writer, researcher and engineer, among the first to write horror and science fiction in Arabic, with studies of the strange and the paranormal.' },
		'mohamed-fathy': { src: AK('محمد-فتحي'),
			ar: 'أكاديمي وكاتب ساخر مصري من القاهرة، حاصل على الدكتوراه في إدارة المؤسسات الإعلامية، ويدرّس الإعلام بجامعة حلوان.',
			en: 'An Egyptian academic and satirist from Cairo, with a doctorate in media management; he teaches media at Helwan University.' },
		'nabil-farouk': { src: WP('نبيل فاروق'), srcEn: EN('Nabil Farouk'),
			ar: 'كاتب مصري اشتهر بالأدب البوليسي والخيال العلمي، وصدرت له عن المؤسسة العربية الحديثة سلاسل الجيب «رجل المستحيل» و«ملف المستقبل».',
			en: 'An Egyptian novelist known for spy fiction and science fiction, author of the Modern Arab Association pocket series Ragol al-Mostaheel and Malaf al-Mostaqbal.' },
		'michel-hanna': { src: AK('ميشيل-حنا'),
			ar: 'كاتب وروائي وقاص مصري، يكتب المقال والقصة القصيرة والقصة المصوّرة والسيناريو، وله أكثر من خمسة عشر كتابًا.',
			en: 'An Egyptian novelist and short-story writer who also writes essays, comics and screenplays, with more than fifteen books.' },
		'tamer-ahmed': { src: AK('تامر-أحمد'),
			ar: 'طبيب أسنان وكاتب ساخر مصري، شارك في «مجانين»، أول سلسلة ساخرة في مصر، تحت إشراف نبيل فاروق.',
			en: 'An Egyptian dentist and satirist who wrote for Maganeen, the first satirical series in Egypt, under Nabil Farouk.' },
		'ashraf-hamdy': { src: WP('أشرف حمدي'),
			ar: 'رسام كاريكاتير ومخرج رسوم متحركة وطبيب أسنان مصري، رسم في «روزاليوسف» و«صباح الخير» و«الأهرام»، وأسّس قناة «إيجيبتون» للكرتون على يوتيوب.',
			en: 'An Egyptian cartoonist, animator and dentist who drew for Rose al-Youssef, Sabah al-Kheir and Al-Ahram, and founded the Egyptoon cartoon channel on YouTube.' },
		'ahmed-sabry-ghabashi': { src: WP('أحمد صبري غباشي'),
			ar: 'ممثل ومخرج مسرحي وكاتب مصري، درس في المعهد العالي للفنون المسرحية، وأسّس فرقة «ميلوفرينيا» للمسرح الحر، وله مجموعات قصصية ومقالات.',
			en: 'An Egyptian actor, stage director and writer, a graduate of the Higher Institute of Dramatic Arts and founder of the Melophrenia free-theatre troupe, with books of stories and essays.' },
		'ghada-abdel-aal': { src: WP('غادة عبد العال'),
			ar: 'كاتبة وسيناريست وصيدلانية مصرية من المحلة الكبرى، بدأت مدوّنةً بـ«عايزة أتجوز» (2006) التي صارت كتابًا عن دار الشروق (2009) ثم مسلسلًا (2010)، وتكتب المقال الساخر في الصحف.',
			en: 'An Egyptian writer, screenwriter and pharmacist from Mahalla al-Kubra whose blog Ayza Atgawez (2006) became a Dar El Shorouk book (2009) and then a TV series (2010); she writes satirical columns for the press.' },
		'ismail-diab': { src: WP('إسماعيل دياب'),
			ar: 'رسّام مصري (1936–2005) من الإسماعيلية، تخرّج في كلية الفنون الجميلة عام 1962 وعمل في «روز اليوسف»، ثم رسم أغلفة سلاسل «روايات مصرية للجيب» للمؤسسة العربية الحديثة.',
			en: 'An Egyptian painter (1936–2005) from Ismailia, a 1962 graduate of the Faculty of Fine Arts who worked at Rose al-Youssef, then painted the covers of the Modern Arab Association’s Egyptian Pocket Novels series.' },
		'walid-fekry': { src: AK('وليد-فكري'),
			ar: 'كاتب صحفي وباحث في التاريخ ومدوّن من الإسكندرية، وُلد عام 1980 وتخرّج في كلية الحقوق.',
			en: 'A journalist, independent researcher in history and blogger from Alexandria, born in 1980 and a law graduate.' },
		'sherine-hanaey': { src: WP('شيرين هنائي'), srcEn: EN('Sherin Hanaey'),
			ar: 'روائية وكاتبة سيناريو مصرية، تخرّجت في قسم الجرافيك والرسوم المتحركة بكلية الفنون الجميلة، وتكتب الرعب الفلسفي، وصاحبة سلسلة «لاشين».',
			en: 'An Egyptian novelist and screenwriter, a graduate in graphics and animation from the Faculty of Fine Arts, who writes philosophical horror; author of the Lasheen series.' },
		'ahmed-mourad': { src: WP('أحمد مراد'), srcEn: EN('Ahmed Mourad'),
			ar: 'روائي وكاتب سيناريو ومصوّر مصري، صاحب «فيرتيجو» و«الفيل الأزرق» و«1919»، وكتب سيناريوهات الأفلام المأخوذة عن رواياته.',
			en: 'An Egyptian novelist, screenwriter and photographer, author of Vertigo, The Blue Elephant and 1919, who wrote the screenplays of the films made from them.' },
		'wesam-saeed': { src: AK('وسام-سعيد'),
			ar: 'كاتب صحفي وروائي مصري، بدأ في أدب الرعب برباعية «مسارات الرعب».',
			en: 'An Egyptian journalist and novelist whose horror writing began with the Horror Paths quartet.' },
		'mohamed-essmat': { src: AK('محمد-عصمت'),
			ar: 'كاتب ومترجم مصري يكتب الرعب، من أعماله سلسلة «حدث بالفعل» و«الممسوس»، ومن ترجماته «ديكستر».',
			en: 'An Egyptian horror writer and translator, author of the It Really Happened series and The Possessed, translator of Dexter.' },
		'amr-salama': { src: WP('عمرو سلامة'), srcEn: EN('Amr Salama'),
			ar: 'مخرج وكاتب سيناريو ومؤلف مصري، أخرج مسلسل «ما وراء الطبيعة» على نتفليكس عام 2020.',
			en: 'An Egyptian film director, screenwriter and author, who directed the Netflix series Paranormal in 2020.' },
		'sally-adel': { src: WP('سالي عادل'),
			ar: 'كاتبة روايات وقصص مصرية تُلقَّب بملكة الرعب، وصاحبة سلسلة «الحب والرعب» عن المؤسسة العربية الحديثة.',
			en: 'An Egyptian novelist and short-story writer known as the queen of horror, author of the Love and Horror series at the Modern Arab Association.' },
		'ahmed-salah-al-mahdi': { src: WP('أحمد صلاح المهدي'),
			ar: 'كاتب ومترجم وناقد مصري من أسيوط، يكتب الفانتازيا والخيال العلمي وأدب الأطفال.',
			en: 'An Egyptian writer, translator and critic from Assiut, writing fantasy, science fiction and children\'s books.' },
		'amr-abdel-hamid': { src: AK('عمرو-عبد-الحميد'),
			ar: 'روائي وطبيب مصري من الدقهلية، وُلد عام 1987 وتخصص في جراحة الأنف والأذن والحنجرة، واشتهر بثلاثية «أرض زيكولا».',
			en: 'An Egyptian novelist and doctor from Dakahlia, born in 1987, an ear, nose and throat surgeon best known for the Land of Zicola trilogy.' },
		'mohamed-soliman-abdel-malek': { src: WP('محمد سليمان عبد المالك'),
			ar: 'روائي وكاتب سيناريو مصري بدأ في الصحافة، ومن أعماله للتلفزيون مسلسل «ممالك النار».',
			en: 'An Egyptian novelist and screenwriter who began in journalism; his television work includes Kingdoms of Fire.' },
		'ahmed-younis': { src: WP('أحمد يونس'),
			ar: 'مذيع راديو وتلفزيون مصري وراوي حكايات رعب، وُلد عام 1981 وبدأ مع إذاعة «نجوم إف إم» عام 2003.',
			en: 'An Egyptian radio and television presenter and horror storyteller, born in 1981, who started with Nogoum FM in 2003.' },
		'abdulwahab-al-rifai': { src: AK('عبد-الوهاب-السيد-الرفاعي'),
			ar: 'كاتب وروائي كويتي، من أشهر كتّاب الرعب والتشويق في الكويت، وصاحب سلسلة «حالات نادرة».',
			en: 'A Kuwaiti novelist, one of the best-known horror and suspense writers in Kuwait, author of the Rare Cases series.' },
		'ashraf-fagih': { src: EN('Ashraf Fagih'),
			ar: 'روائي وأكاديمي سعودي، من القلائل الذين يكتبون الخيال العلمي بالعربية، وصاحب «المخوزق».',
			en: 'A Saudi novelist and academic, one of the few notable writers of science fiction in Arabic, author of The Impaler.' },
		'hassan-el-gendy': { src: AK('حسن-الجندي'),
			ar: 'روائي رعب مصري وُلد عام 1989، درس الفلسفة بجامعة عين شمس، ومن أعماله سلسلة «مخطوطة ابن إسحاق».',
			en: 'An Egyptian horror novelist, born in 1989, who studied philosophy at Ain Shams University; his books include the Ibn Ishaq Manuscript series.' },
		'chuck-palahniuk': { src: WP('تشاك بولانيك'), srcEn: EN('Chuck Palahniuk'),
			ar: 'روائي وصحفي أمريكي يصف أعماله بأدب التجاوز، وصاحب «نادي القتال».',
			en: 'An American novelist and journalist who describes his work as transgressive fiction; author of Fight Club.' },
		'craig-clevenger': { src: WP('كريج كليفنجر'), srcEn: EN('Craig Clevenger'),
			ar: 'روائي أمريكي وُلد في دالاس عام 1964 ونشأ في جنوب كاليفورنيا.',
			en: 'An American novelist, born in Dallas in 1964 and raised in Southern California.' },
		'khaled-hosseini': { src: WP('خالد حسيني'), srcEn: EN('Khaled Hosseini'),
			ar: 'روائي وطبيب أفغاني أمريكي وُلد في كابل عام 1965، وتصدّرت روايته الأولى «عدّاء الطائرة الورقية» قوائم الأكثر مبيعًا.',
			en: 'An Afghan-American novelist and doctor, born in Kabul in 1965, whose first novel The Kite Runner became a bestseller.' },
		'neil-gaiman': { src: EN('Neil Gaiman'),
			ar: 'كاتب إنجليزي للرواية والقصة القصيرة والقصص المصوّرة، وصاحب «ساندمان» و«كتاب المقبرة».',
			en: 'An English author of novels, short fiction and comics, creator of The Sandman and author of The Graveyard Book.' },
		'spain-rodriguez': { src: EN('Spain Rodriguez'),
			ar: 'رسام قصص مصوّرة أمريكي من رواد الكوميكس الأمريكي «الأندرغراوند».',
			en: 'An American cartoonist, one of the leading figures of underground comix.' },
		'mahmoud-abdel-shakour': { src: WP('محمود عبد الشكور'),
			ar: 'كاتب وناقد سينمائي وأدبي مصري وُلد عام 1965، تخرّج في كلية الإعلام، وكتب في صحف ومجلات مصرية وعربية كثيرة، وكان نائبًا لرئيس تحرير مجلة «أكتوبر».',
			en: 'An Egyptian writer and film and literary critic, born in 1965, a graduate of the Faculty of Mass Communication who has written for many Egyptian and Arab papers and magazines and was deputy editor-in-chief of October magazine.' },
		'ahmed-khaled-mostafa': { src: AK('أحمد-خالد-مصطفى'),
			ar: 'روائي مصري وُلد في المدينة المنورة عام 1984 ودرس الصيدلة بجامعة القاهرة، وصاحب «أنتيخريستوس» و«أرض السافلين».',
			en: 'An Egyptian novelist, born in Medina in 1984, who studied pharmacy at Cairo University; author of Antichristus and Land of the Lowly.' }
	};

	/* works an entry names in other words than the site's title */
	var EXTRA_WORKS = {
		'tamer-ibrahim': ['oshaq-al-adrenaline', 'room207'],
		'sanad-rashed-dakhil': ['oshaq-al-adrenaline'],
		'spain-rodriguez': ['che']
	};

	/* the women, so Arabic speaks of them in the feminine */
	var FEMALE = ['sherine-hanaey', 'sally-adel', 'hanan-el-karargy', 'madiha-mohamed', 'reham-ibrahim', 'engy-khaled-ahmed', 'ghada-abdel-aal'];

	var cache = null;
	var key = function (name) { return String((name && name.ar) || '').replace(/^د\.\s*/, '').trim(); };
	var slugOf = function (name) {
		return String((name && name.en) || '').replace(/^Dr\.\s*/, '').toLowerCase()
			.normalize('NFKD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'writer';
	};
	/* Arabic titles compared loosely: no diacritics, quotes or hamza forms */
	var norm = function (s) {
		return String(s || '').replace(/[ً-ْـ]/g, '').replace(/[إأآ]/g, 'ا').replace(/ى/g, 'ي').replace(/ة/g, 'ه')
			.replace(/[«»"'()\[\]،,.:]/g, ' ').replace(/\s+/g, ' ').trim();
	};

	function build() {
		var A = window.AKT || {}, W = A.writers || {}, byKey = {}, list = [];
		SHELVES.forEach(function (sh) {
			(W[sh] || []).forEach(function (w) {
				var k = key(w.name);
				var p = byKey[k];
				if (!p) {
					p = byKey[k] = { id: slugOf(w.name), key: k, name: w.name, photo: null, entries: [], shelves: [] };
					list.push(p);
				}
				if (!p.photo && w.photo) p.photo = w.photo;
				if (/^(Dr\.|د\.)/.test(w.name.en || '') || /^د\./.test(w.name.ar || '')) p.name = w.name;
				p.entries.push({ shelf: sh, w: w });
				if (p.shelves.indexOf(sh) < 0) p.shelves.push(sh);
			});
		});
		/* the site's works and series each person's entries name */
		var works = (A.works || []).filter(function (w) { return w.title && w.title.ar; });
		var series = [].concat(A.series || [], A.otherSeries || []).filter(function (s) { return s.title && s.title.ar && !s.inspired; });
		list.forEach(function (p) {
			p.bio = BIOS[p.id] || null;
			p.female = FEMALE.indexOf(p.id) >= 0;
			var hay = norm(p.entries.map(function (x) { var w = x.w; return [(w.work || {}).ar, (w.book || {}).ar, (w.text || {}).ar].join(' '); }).join(' '));
			p.works = works.filter(function (w) { var t = norm(w.title.ar.replace(/\s*\(.*\)\s*$/, '')); return (t.length > 2 && hay.indexOf(t) >= 0) || (EXTRA_WORKS[p.id] || []).indexOf(w.id) >= 0; }).map(function (w) { return w.id; });
			p.series = series.filter(function (s) { var t = norm(s.title.ar); return t.length > 2 && hay.indexOf(t) >= 0; }).map(function (s) { return s.id; })
				.filter(function (id, i, all) { return all.indexOf(id) === i; });
			/* and the books whose pages credit them as an author, and the series that name them among its writers */
			var same = function (a) { var k = key(a); return k && (k === p.key || k.indexOf(p.key + ' ') === 0 || p.key.indexOf(k + ' ') === 0); };
			works.forEach(function (w) { if (p.works.indexOf(w.id) < 0 && ((A.bookInfo || {})[w.id] || {}).authors && A.bookInfo[w.id].authors.some(same)) p.works.push(w.id); });
			Object.keys(A.seriesInfo || {}).forEach(function (sid) {
				if (p.series.indexOf(sid) < 0 && (A.seriesInfo[sid].with || []).some(function (x) { return x.id === p.id; })) p.series.push(sid);
			});
			p.tribute = (A.tributes || []).filter(function (t) { return key(t.name) === p.key; })[0] || null;
			if (!p.photo && p.tribute && p.tribute.photo) p.photo = { url: p.tribute.photo, file: p.tribute.photoSource || '' };
		});
		return { list: list, byKey: byKey };
	}

	window.People = {
		SHELVES: SHELVES,
		/* each shelf's name (feminine in Arabic where it differs) and colour */
		LABELS: {
			collaborators: { ar: 'كتب معه', arF: 'كتبت معه', en: 'Wrote with him', c: '#8a3b12' },
			introductions: { ar: 'المقدّمات', en: 'Introductions', c: '#2c5a68' },
			dedications: { ar: 'أهدى إليه', arF: 'أهدت إليه', en: 'Dedicated a book to him', c: '#5a1f3a' },
			influenced: { ar: 'تأثّر به', arF: 'تأثّرت به', en: 'Influenced by him', c: '#7a5a1c' },
			contemporaries: { ar: 'رفيق الطريق', arF: 'رفيقة الطريق', en: 'Contemporary', c: '#334155' },
			artists: { ar: 'رسم عالمه', arF: 'رسمت عالمه', en: 'Drew his world', c: '#6a2c5a' },
			continued: { ar: 'أكمل عالمه', arF: 'أكملت عالمه', en: 'Carried his world on', c: '#2f5a3a' },
			screen: { ar: 'على الشاشة', en: 'On screen', c: '#5a3a1c' },
			translated: { ar: 'ترجم له', en: 'He translated them', c: '#3b3b58' },
			about: { ar: 'كتب عنه', arF: 'كتبت عنه', en: 'Wrote about him', c: '#6b4a1c' }
		},
		key: key,
		all: function () { if (!cache) cache = build(); return cache.list; },
		byId: function (id) { return this.all().filter(function (p) { return p.id === id; })[0] || null; },
		ofEntry: function (w) { this.all(); return cache.byKey[key(w.name)] || null; },
		href: function (p) { return 'writer.html?id=' + encodeURIComponent(p.id); },
		/* first letter of the first two words, skipping the Arabic article */
		initials: function (name, lang) {
			return String(name).replace(/^(د\.|Dr\.)\s*/, '').split(/\s+/).filter(Boolean).slice(0, 2).map(function (s) {
				return s.charAt(/^ال./.test(s) ? 2 : 0);
			}).join(lang === 'ar' ? ' ' : '');
		},
		/* one line for an entry: what the book was and which way the words went */
		meta: function (w) {
			var App = window.App, t = App.t, L = App.L;
			if (w.book) return (w.direction === 'by_akt' ? L('قدّم له العرّاب: ', 'Foreword by AKT: ') : w.direction === 'back_akt' ? L('كلمة العرّاب على غلافه: ', 'AKT on the back cover: ') : w.direction === 'dedication' ? L('أهدى إليه: ', 'Dedicated to him: ') : w.direction === 'about' ? L('كتاب عنه: ', 'A book about him: ') : L('كتب مقدّمة: ', 'Wrote the foreword to: ')) + t(w.book) + (w.year ? ' (' + App.num(w.year) + ')' : '');
			/* a title that already names its years keeps them; otherwise the year goes after it */
			if (w.work) return L('العمل: ', 'Work: ') + t(w.work) + (w.year && !/\d{4}/.test(t(w.work)) ? ' (' + App.num(w.year) + ')' : '');
			return '';
		}
	};
})();

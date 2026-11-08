/* Five things to do with his world, a page each (once «ركن القرّاء», quiz.html, with «اختبر نفسك», now test.html / quiz.js) —
   «أي شخصية أنت؟» (which-character.html: seven questions; the answers lean to one of six of his characters, with a picture to share),
   «البدايات» (first-lines.html: a first line, and which book or issue it opens),
   «بطاقة القارئ» (reader-card.html: the reader's first book, favourite book and character, and how much they have read, as a card to share),
   «صمّم غلافك» (cover-maker.html: a pocket-book cover with the reader's title, name, number and picture, drawn as they type),
   and «اقرأ معنا» (read-with-us.html: a book a month, the same for everyone, with questions to talk over). Nothing is sent anywhere.
   Each page is named by <main data-corner="who|openings|card|cover|club">, and Corner.PAGES gives it its strings and its band. */
(function () {
	'use strict';

	/* a searchable picker (the reader's card): typing narrows the list, Arabic matched loosely (with or without its marks,
	   أ/إ/آ as ا, ة as ه, ى as ي); each choice with its cover or picture. A title may also be typed freely; a character must be
	   one of the list, kept in the hidden field beside it */
	function fold(s) {
		return String(s || '').toLowerCase().replace(/[ً-ْـ]/g, '').replace(/[أإآ]/g, 'ا').replace(/ة/g, 'ه').replace(/ى/g, 'ي');
	}
	function wirePicker(p, items, A) {
		var e = A.esc, q = p.querySelector('.cr-pick-q'), hid = p.querySelector('input[type="hidden"]'), list = p.querySelector('.cr-pick-list'), ic = p.querySelector('.cr-pick-ic');
		var shown = [], at = -1, keys = items.map(function (x) { return fold(x.v); });
		var face = function (x) {
			var mono = '<b class="cr-pick-mono">' + e(x.v.replace(/^د\.\s*/, '').slice(0, 1)) + '</b>';
			return '<span class="cr-pick-av' + (x.round ? ' is-round' : '') + '">' + (x.img ? '<img src="' + e(A.thumb ? A.thumb(x.img) : x.img) + '" alt="" loading="lazy" onerror="this.remove()">' : '') + mono + '</span>';
		};
		var mark = function (x) {
			ic.innerHTML = x ? face(x) : '';
			p.classList.toggle('has-pick', !!x);
		};
		var render = function () {
			var k = fold(q.value.trim());
			shown = [];
			for (var i = 0; i < items.length && shown.length < 80; i++) if (!k || keys[i].indexOf(k) > -1) shown.push(items[i]);
			at = -1;
			list.innerHTML = shown.length ? shown.map(function (x, i) {
				return '<li role="option" id="' + p.dataset.kind + '-' + i + '" data-i="' + i + '">' + face(x) + '<span>' + e(x.v) + '</span></li>';
			}).join('') : '<li class="cr-pick-none">' + e(A.L('لا شيء بهذا الاسم', 'Nothing by that name')) + '</li>';
		};
		var open = function (on) { list.hidden = !on; q.setAttribute('aria-expanded', String(on)); p.classList.toggle('is-open', on); };
		var choose = function (x) {
			q.value = x.v;
			if (hid) hid.value = x.id;
			mark(x);
			open(false);
		};
		var move = function (d) {
			if (!shown.length) return;
			at = (at + d + shown.length) % shown.length;
			[].forEach.call(list.children, function (li, i) { li.classList.toggle('is-at', i === at); });
			var li = list.children[at];
			q.setAttribute('aria-activedescendant', li.id);
			li.scrollIntoView({ block: 'nearest' });
		};
		q.addEventListener('focus', function () { render(); open(true); });
		q.addEventListener('input', function () {
			var x = items.filter(function (y) { return y.v === q.value; })[0];
			if (hid) hid.value = x ? x.id : '';
			mark(x);
			render(); open(true);
		});
		q.addEventListener('keydown', function (ev) {
			if (ev.key === 'ArrowDown' || ev.key === 'ArrowUp') { ev.preventDefault(); if (list.hidden) { render(); open(true); } move(ev.key === 'ArrowDown' ? 1 : -1); }
			else if (ev.key === 'Enter' && !list.hidden && at > -1) { ev.preventDefault(); choose(shown[at]); }
			else if (ev.key === 'Escape' && !list.hidden) { ev.preventDefault(); open(false); }
		});
		list.addEventListener('mousedown', function (ev) { ev.preventDefault(); });
		list.addEventListener('click', function (ev) { var li = ev.target.closest('[data-i]'); if (li) choose(shown[+li.getAttribute('data-i')]); });
		q.addEventListener('blur', function () {
			open(false);
			/* a character must be one of the list: a name typed and left half-way is cleared */
			if (hid && !hid.value) { q.value = ''; mark(null); }
		});
	}

	/* the six characters a reader can be, each with what makes them so */
	var WHO = {
		refaat: { ar: 'الساخر المتشكك: تؤمن بالعقل وتسخر من كل شيء، حتى من نفسك، لكنك أشجع مما تظن حين يجدّ الجد.', en: 'The sardonic sceptic: you trust reason and mock everything, yourself included, but you are braver than you think when it counts.' },
		maggie: { ar: 'الهادئة العاقلة: رقة وهدوء وعلم؛ وجودك يطمئن من حولك ويعيد الأشياء إلى حجمها.', en: 'The calm mind: gentle, quiet and learned; around you, people settle and things shrink back to size.' },
		abeer: { ar: 'الحالمة القارئة: تعيش ألف حياة في الكتب، والخيال عندك باب لا مهرب.', en: 'The dreaming reader: you live a thousand lives in books, and imagination is a door for you, not an escape.' },
		alaa: { ar: 'الطبيب المثالي: تترك الراحة لتكون حيث يحتاجك الناس، ولو في قلب إفريقيا.', en: 'The idealist doctor: you leave comfort behind to be where people need you, even in the heart of Africa.' },
		bernadette: { ar: 'الرقيقة الشجاعة: رحيمة وصلبة معًا، تمسك يد الخائف وتواجه الخطر بهدوء.', en: 'Gentle and brave: kind and steady at once, you hold the frightened hand and face danger calmly.' },
		gaber: { ar: 'المثقف الغاضب: ترى الظلم بوضوح، وتقف في صف الضعفاء ولو كنت منهم.', en: 'The angry thinker: you see injustice clearly and stand with the weak, even when you are one of them.' }
	};
	/* [question, [answer, characters it leans to]...] */
	var QS = [
		[{ ar: 'ليلة إجازة، ماذا تفعل؟', en: 'A free evening. What do you do?' }, [
			[{ ar: 'أقرأ رواية رعب وأسخر منها', en: 'Read a horror novel and poke fun at it' }, ['refaat']],
			[{ ar: 'أغرق في كتاب خيال حتى الفجر', en: 'Sink into a fantasy book till dawn' }, ['abeer']],
			[{ ar: 'أساعد أحدًا يحتاجني', en: 'Help someone who needs me' }, ['alaa', 'bernadette']],
			[{ ar: 'أجلس مع أصدقاء نتناقش في أحوال البلد', en: 'Sit with friends arguing about the state of things' }, ['gaber']]]],
		[{ ar: 'سمعت صوتًا غريبًا في البيت ليلًا', en: 'You hear a strange sound in the house at night' }, [
			[{ ar: '«هراء، إنها الريح»… ثم لا أنام', en: '“Nonsense, it’s the wind”… then I don’t sleep' }, ['refaat']],
			[{ ar: 'أفكر فيه بهدوء حتى أجد تفسيرًا', en: 'Think it through calmly till I find a reason' }, ['maggie']],
			[{ ar: 'أتخيل قصة كاملة عن شبح', en: 'Imagine a whole ghost story' }, ['abeer']],
			[{ ar: 'أقوم لأطمئن أن الجميع بخير', en: 'Get up to check everyone is all right' }, ['bernadette', 'alaa']]]],
		[{ ar: 'أي مكان تحلم به؟', en: 'Which place do you dream of?' }, [
			[{ ar: 'بيت هادئ على بحيرة في اسكتلندا', en: 'A quiet house by a Scottish loch' }, ['maggie']],
			[{ ar: 'قرية في قلب إفريقيا', en: 'A village in the heart of Africa' }, ['alaa', 'bernadette']],
			[{ ar: 'عالم داخل كتاب', en: 'A world inside a book' }, ['abeer']],
			[{ ar: 'حي شعبي حقيقي بلا أقنعة', en: 'A real old neighbourhood with no masks' }, ['gaber']]]],
		[{ ar: 'بماذا يصفك أصدقاؤك؟', en: 'How do your friends describe you?' }, [
			[{ ar: 'لسان ساخر', en: 'A sharp tongue' }, ['refaat']],
			[{ ar: 'قلب طيب', en: 'A kind heart' }, ['bernadette', 'maggie']],
			[{ ar: 'خيال واسع', en: 'A wild imagination' }, ['abeer']],
			[{ ar: 'ضمير حي', en: 'A living conscience' }, ['gaber', 'alaa']]]],
		[{ ar: 'أمام الظلم، أنت…', en: 'Faced with injustice, you…' }, [
			[{ ar: 'أكتب عنه بلسان لاذع', en: 'Write about it with a biting pen' }, ['refaat', 'gaber']],
			[{ ar: 'أعالج ما أستطيع بيدي', en: 'Mend what I can with my own hands' }, ['alaa']],
			[{ ar: 'أحاول التهدئة والإصلاح', en: 'Try to calm things and set them right' }, ['maggie', 'bernadette']],
			[{ ar: 'أهرب إلى حكاية أعدل', en: 'Escape into a fairer story' }, ['abeer']]]],
		[{ ar: 'مشروبك المفضل', en: 'Your drink' }, [
			[{ ar: 'قهوة سادة، كثيرة', en: 'Black coffee, lots of it' }, ['refaat']],
			[{ ar: 'شاي بالحليب في فنجان أنيق', en: 'Tea with milk in a fine cup' }, ['maggie']],
			[{ ar: 'كاكاو ساخن بجوار كتاب', en: 'Hot cocoa beside a book' }, ['abeer']],
			[{ ar: 'شاي في كوب زجاجي على المقهى', en: 'Tea in a glass at the café' }, ['gaber', 'alaa']]]],
		[{ ar: 'ما الذي يخيفك أكثر؟', en: 'What frightens you most?' }, [
			[{ ar: 'أن أكون مخطئًا وأن الخوارق حقيقية', en: 'Being wrong, and the uncanny being real' }, ['refaat']],
			[{ ar: 'أن أفقد من أحب', en: 'Losing the people I love' }, ['maggie', 'bernadette']],
			[{ ar: 'أن تنتهي الكتب', en: 'Running out of books' }, ['abeer']],
			[{ ar: 'أن يعتاد الناس الظلم', en: 'People getting used to injustice' }, ['gaber', 'alaa']]]]
	];

	/* «اقرأ معنا»: a book a month, the same for everyone — [key, questions]; the month picks it (it began in October 2026) */
	var CLUB = [
		['b:mwt-1', [{ ar: 'لماذا يرفض رفعت إسماعيل الخوارق وهو يراها بعينه؟', en: 'Why does Refaat Ismail reject the uncanny when he sees it with his own eyes?' }, { ar: 'ما الذي يجعل الراوي العجوز المريض بطلًا محبوبًا؟', en: 'What makes an old, ailing narrator such a loved hero?' }, { ar: 'أي مشهد أخافك أكثر، ولماذا؟', en: 'Which scene scared you most, and why?' }]],
		['b:utopia', [{ ar: 'هل ما زالت «يوتوبيا» نبوءة، أم صارت وصفًا؟', en: 'Is Utopia still a prophecy, or has it become a description?' }, { ar: 'كيف يتغير صوت الرواية بين علاء وجابر؟', en: 'How does the voice change between Alaa and Gaber?' }, { ar: 'من الضحية الحقيقية في الرواية؟', en: 'Who is the real victim of the novel?' }]],
		['b:fantasia-1', [{ ar: 'لماذا تختار عبير الهروب إلى الحكايات؟', en: 'Why does Abeer choose to escape into stories?' }, { ar: 'ما الكتاب الذي تتمنى أن تدخله كما دخلت عبير؟', en: 'Which book would you like to step into, as Abeer does?' }, { ar: 'هل الخيال هروب أم مواجهة؟', en: 'Is imagination escape or confrontation?' }]],
		['b:safari-1', [{ ar: 'ماذا يضيف الطب إلى قصة المغامرة؟', en: 'What does medicine add to an adventure story?' }, { ar: 'كيف تُرى إفريقيا في عيني علاء عبد العظيم؟', en: 'How does Africa look through Alaa Abdel Azim’s eyes?' }, { ar: 'هل الوباء في القصة أخطر من الخوف منه؟', en: 'Is the epidemic in the story more dangerous than the fear of it?' }]],
		['b:sandoq', [{ ar: 'أي قصة في المجموعة بقيت معك بعد أن أغلقت الكتاب؟', en: 'Which story in the collection stayed with you after you closed the book?' }, { ar: 'كيف تبني القصة القصيرة رعبها في صفحات قليلة؟', en: 'How does a short story build its dread in a few pages?' }, { ar: 'ما الذي يجمع القصص كلها؟', en: 'What ties all the stories together?' }]],
		['b:icarus', [{ ar: 'من هو إيكاروس في الرواية، ومن الشمس؟', en: 'Who is Icarus in the novel, and who is the sun?' }, { ar: 'هل نهاية الرواية عقاب أم خلاص؟', en: 'Is the ending a punishment or a release?' }, { ar: 'ما الذي يقوله عن الطموح والغرور؟', en: 'What does it say about ambition and pride?' }]],
		['b:shay', [{ ar: 'أي مقال ضحكت منه أكثر، وأيها أحزنك؟', en: 'Which essay made you laugh most, and which saddened you?' }, { ar: 'كيف يجمع بين السخرية والجد في سطر واحد؟', en: 'How does he hold irony and earnest in one line?' }, { ar: 'أي مقال ما زال صالحًا لليوم؟', en: 'Which essay still fits today?' }]],
		['b:senga', [{ ar: 'كيف يرسم الحيّ الشعبي في «السنجة»؟', en: 'How does he draw the old neighbourhood in Al-Senga?' }, { ar: 'من يحكي الحقيقة في الرواية؟', en: 'Who tells the truth in the novel?' }, { ar: 'ما الذي تقوله الرواية عن العنف؟', en: 'What does the novel say about violence?' }]],
		['b:mwt-80', [{ ar: 'هل كانت نهاية رفعت إسماعيل كما توقعتها؟', en: 'Was Refaat Ismail’s ending what you expected?' }, { ar: 'ماذا يعني أن يودّع الكاتب بطله؟', en: 'What does it mean for a writer to say goodbye to his hero?' }, { ar: 'ما الأسطورة التي تتمنى لو كتبها لرفعت بعد ذلك؟', en: 'Which legend do you wish he had written for Refaat afterwards?' }]],
		['b:rats', [{ ar: 'ماذا يحدث لمدينة يغيب عنها الضوء؟', en: 'What happens to a city when the light goes?' }, { ar: 'لماذا يرى الناس في الشرقاوي مخلّصهم؟', en: 'Why do people see Sharqawi as their saviour?' }, { ar: 'هل الفئران في الرواية حيوانات أم بشر؟', en: 'Are the rats in the novel animals or people?' }]],
		['b:room207', [{ ar: 'أي غرفة أخافتك أكثر؟', en: 'Which room frightened you most?' }, { ar: 'كيف يبني الكاتب رعبًا من مكان واحد؟', en: 'How does he build fear out of one place?' }, { ar: 'هل شاهدت المسلسل؟ ماذا تغير؟', en: 'Have you seen the series? What changed?' }]],
		['b:shaabeeb', [{ ar: 'لماذا يبحث العرب عن وطن في «شآبيب»؟', en: 'Why do the Arabs search for a homeland in Shaabeeb?' }, { ar: 'كيف تقرأ الرواية وقد كانت آخر ما كتب؟', en: 'How do you read the novel knowing it was his last?' }, { ar: 'هل في الرواية أمل؟', en: 'Is there hope in the novel?' }]]
	];
	var CLUB_FROM = 2026 * 12 + 9; /* October 2026: the first month */

	function App() { return window.App; }
	function esc(s) { return App().esc(s); }

	var Corner = {
		/* one part, on its own page: its box in a section of the page's (#who, #openings, #card, #cover, #club) */
		mount: function (el, key) {
			this.el = el;
			var P = Corner.PAGES[key];
			if (!P) return;
			el.innerHTML = '<section class="section cr" id="' + key + '"><div class="wrap"><div class="' + P.box + '"></div></div></section>';
			({ who: this.who, openings: this.openings, card: this.card, cover: this.cover, club: this.club })[key].call(this);
		},

		/* «البدايات»: the lines in a shuffled order, each with four books to choose from (of its own kind: an issue among issues,
		   a book among books, where there are enough), the answer and a link to it; and how many were right */
		openings: function (at, right, order) {
			var A = App(), S = window.WorksShared, t = A.t, L = A.L, box = this.el.querySelector('.cr-open'), self = this, all = A.data().openings || [];
			if (!box || !S) return;
			var shuffle = function (a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), x = a[i]; a[i] = a[j]; a[j] = x; } return a; };
			at = at || 0; right = right || 0; order = order || shuffle(all.map(function (x, i) { return i; }));
			var key = function (o) { return o.book + (o.part ? '-' + o.part : ''); };
			var info = function (o) {
				var r = S.resolveBook(key(o));
				if (!r) return null;
				return r.series ? { href: 'book.html?id=' + key(o), img: S.issueCover(r.series.s.id, r.item), title: t(r.item.title), sub: t(r.series.s.title) + ' ' + A.num(r.item.n), issue: true }
					: { href: A.workHref(o.book), img: S.coverOf(r.info), title: t(r.item.title), sub: '', issue: false };
			};
			if (at >= order.length) {
				box.innerHTML = '<div class="cr-open-end"><p class="cr-step">' + esc(L('النتيجة', 'Your score')) + '</p><h3>' + esc(A.num(right) + ' / ' + A.num(order.length)) + '</h3>' +
					'<button type="button" class="share-btn" data-again>' + esc(L('العب مرة أخرى', 'Play again')) + '</button></div>';
				box.querySelector('[data-again]').onclick = function () { self.openings(); };
				return;
			}
			var o = all[order[at]], me = info(o);
			if (!me) return this.openings(at + 1, right, order);
			var others = shuffle(all.filter(function (x) { return x.book !== o.book; })).map(function (x) { return { o: x, i: info(x) }; }).filter(function (x) { return x.i; });
			var same = others.filter(function (x) { return x.i.issue === me.issue; }), pick = (same.length >= 3 ? same : others).slice(0, 3);
			var opts = shuffle([{ o: o, i: me }].concat(pick));
			box.innerHTML = '<p class="cr-step">' + esc(A.num(at + 1) + ' / ' + A.num(order.length)) + ' · ' + esc(L('أصبت ', 'Right: ') + A.num(right)) + '</p>' +
				'<blockquote class="cr-line">' + esc(o.line) + (A.lang === 'en' && o.en ? '<span dir="ltr">' + esc(o.en) + '</span>' : '') + '</blockquote>' +
				'<div class="cr-open-opts">' + opts.map(function (x, k) {
					return '<button type="button" data-k="' + k + '">' + S.miniCover({ img: x.i.img, color: '#3a1414', title: x.i.title }) + '<span><b>' + esc(x.i.title) + '</b>' + (x.i.sub ? '<small>' + esc(x.i.sub) + '</small>' : '') + '</span></button>';
				}).join('') + '</div><p class="cr-open-say" aria-live="polite"></p>';
			box.onclick = function (ev) {
				var b = ev.target.closest('button[data-k]');
				if (!b || box.classList.contains('is-done')) return;
				var good = opts[+b.getAttribute('data-k')].o === o;
				box.classList.add('is-done');
				box.querySelectorAll('button[data-k]').forEach(function (x) { x.disabled = true; if (opts[+x.getAttribute('data-k')].o === o) x.classList.add('is-right'); });
				if (!good) b.classList.add('is-wrong');
				box.querySelector('.cr-open-say').innerHTML = esc(good ? L('أصبت! ', 'Right! ') : L('ليس هذا. ', 'Not that one. ')) + esc(L('إنها بداية ', 'It is the opening of ')) +
					'<a href="' + esc(me.href) + '">' + esc((me.sub ? me.sub + ': ' : '') + me.title) + '</a>' + (A.lang === 'en' || !o.en ? '' : '<span class="cr-open-en" dir="ltr">' + esc(o.en) + '</span>') +
					' <button type="button" class="share-btn" data-next>' + esc(at + 1 < order.length ? L('السطر التالي', 'Next line') : L('النتيجة', 'Your score')) + '</button>';
				box.querySelector('[data-next]').onclick = function () { box.classList.remove('is-done'); self.openings(at + 1, right + (good ? 1 : 0), order); };
			};
		},

		/* «أي شخصية أنت؟» */
		who: function (at, score) {
			var A = App(), t = A.t, L = A.L, box = this.el.querySelector('.cr-who'), self = this;
			at = at || 0; score = score || {};
			if (at < QS.length) {
				var q = QS[at];
				box.innerHTML = '<p class="cr-step">' + esc(A.num(at + 1) + ' / ' + A.num(QS.length)) + '</p><h3>' + esc(t(q[0])) + '</h3><div class="cr-opts">' +
					q[1].map(function (o, i) { return '<button type="button" data-i="' + i + '">' + esc(t(o[0])) + '</button>'; }).join('') + '</div>';
				box.onclick = function (ev) {
					var b = ev.target.closest('button[data-i]');
					if (!b) return;
					q[1][+b.getAttribute('data-i')][1].forEach(function (id, k) { score[id] = (score[id] || 0) + (k ? 1 : 2); });
					self.who(at + 1, score);
				};
				return;
			}
			var best = Object.keys(WHO).sort(function (a, b) { return (score[b] || 0) - (score[a] || 0); })[0];
			var c = (A.data().characters || []).filter(function (x) { return x.id === best; })[0] || { name: { ar: best, en: best } };
			var pic = (A.data().charFigures || {})[best] || c.image || '';
			box.innerHTML = '<div class="cr-res">' + (pic ? '<img src="' + esc(pic) + '" alt="">' : '<span class="cr-mono">' + esc(t(c.name).replace(/^د\.\s*/, '').slice(0, 1)) + '</span>') +
				'<div><p class="cr-step">' + esc(L('أنت', 'You are')) + '</p><h3><a href="character.html?id=' + esc(best) + '">' + esc(t(c.name)) + '</a></h3>' +
				'<p class="cr-why">' + esc(t(WHO[best])) + '</p>' + (c.desc ? '<p class="cr-desc">' + esc(t(c.desc)) + '</p>' : '') +
				'<p class="cr-act"><button type="button" class="share-btn" data-act="pic">' + esc(L('شاركها صورة', 'Share as a picture')) + '</button> <button type="button" class="share-btn" data-act="again">' + esc(L('أعد الأسئلة', 'Try again')) + '</button></p></div></div>';
			box.onclick = function (ev) {
				var b = ev.target.closest('[data-act]');
				if (!b) return;
				if (b.getAttribute('data-act') === 'again') self.who(0, {});
				else self.picture('who', [L('في عالم العرّاب، أنا', 'In the Godfather’s world, I am'), t(c.name), t(WHO[best]).split(':')[0]], pic);
			};
		},

		/* «بطاقة القارئ»: titles to choose from, the reader's own count from their lists */
		card: function () {
			var A = App(), d = A.data(), t = A.t, L = A.L, S = window.WorksShared, self = this, box = this.el.querySelector('.cr-card');
			var titles = [];
			(d.works || []).filter(function (w) { return w.type !== 'translation'; }).forEach(function (w) { titles.push([t(w.title), S.bookHref(w.id), S.coverOf((d.bookInfo || {})[w.id])]); });
			['mwt', 'fantasia', 'safari'].forEach(function (sid) {
				var s = S.anySeries(sid).s;
				S.seriesIssues(sid).forEach(function (is, i) { if (!(is.part > 1)) titles.push([t(s.title) + ' ' + A.num(is.n) + ': ' + t(is.title), A.issueHref(sid, Object.assign({ _idx: i }, is)), S.issueCover(sid, is)]); });
			});
			this._titles = titles;
			var st = window.Lists ? window.Lists.state() : { lists: {} }, read = (st.lists.read || []).length;
			/* the three choices are searchable pickers: the titles each with its cover, the characters each with their picture
			   (or the first letter of their name on a disc when there is none) */
			var figs = d.charFigures || {};
			var bookItems = titles.map(function (x) { return { v: x[0], img: x[2] }; });
			var charItems = (d.characters || []).map(function (c) { return { v: t(c.name), id: c.id, img: figs[c.id] || c.image || '', round: true }; });
			var pick = function (label, name, ph, kind) {
				return '<div class="cr-pick" data-kind="' + kind + '"><label>' + esc(label) + '<span class="cr-pick-f"><span class="cr-pick-ic" aria-hidden="true"></span>' +
					'<input class="cr-pick-q"' + (kind === 'char' ? '' : ' name="' + name + '"') + ' maxlength="90" placeholder="' + esc(ph) + '" role="combobox" aria-autocomplete="list" aria-expanded="false">' +
					(kind === 'char' ? '<input type="hidden" name="' + name + '">' : '') +
					'<svg class="cr-pick-chev" viewBox="0 0 12 12" width="12" height="12" aria-hidden="true"><path d="M2.5 4.5 6 8l3.5-3.5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg></span></label>' +
					'<ul class="cr-pick-list" role="listbox" hidden></ul></div>';
			};
			box.innerHTML = '<form class="cr-form" autocomplete="off">' +
				'<label>' + esc(L('اسمك (كما تريده على البطاقة)', 'Your name (as you want it on the card)')) + '<input name="name" maxlength="40"></label>' +
				pick(L('أول ما قرأت له', 'The first thing of his you read'), 'first', L('ابحث بالعنوان أو اكتبه', 'Search a title or type it'), 'book') +
				pick(L('أحب كتبه إليك', 'Your favourite of his'), 'fav', L('ابحث بالعنوان أو اكتبه', 'Search a title or type it'), 'book') +
				pick(L('شخصيتك المفضلة', 'Your favourite character'), 'char', L('ابحث بالاسم', 'Search a name'), 'char') +
				'<label>' + esc(L('كم قرأت له؟', 'How many have you read?')) + '<input name="count" type="number" min="0" max="999" value="' + (read || '') + '"></label>' +
				'<p class="cr-act"><button type="submit" class="share-btn">' + esc(L('ارسم بطاقتي', 'Draw my card')) + '</button>' +
				(read ? ' <span class="cr-hint">' + esc(L('العدد من «قرأته» في قوائمك.', 'The count comes from “Read” in your lists.')) + '</span>' : '') + '</p></form>';
			[].forEach.call(box.querySelectorAll('.cr-pick'), function (p) { wirePicker(p, p.getAttribute('data-kind') === 'char' ? charItems : bookItems, A); });
			box.querySelector('form').onsubmit = function (ev) {
				ev.preventDefault();
				var f = ev.target, c = (d.characters || []).filter(function (x) { return x.id === f.char.value; })[0];
				var fav = titles.filter(function (x) { return x[0] === f.fav.value; })[0];
				self.picture('card', [f.name.value.trim(), f.first.value.trim(), f.fav.value.trim(), c ? t(c.name) : '', f.count.value], fav && fav[2]);
			};
		},

		/* «صمّم غلافك»: a 780×1200 pocket-book cover drawn as the reader types — the series' band at the top, the issue's number
		   in its disc, the reader's picture (read from the device, never sent) or a moonlit sky, the title and «بقلم» below */
		cover: function () {
			var A = App(), L = A.L, self = this, box = this.el.querySelector('.cr-cover'), pic = null;
			var LOOKS = {
				mwt: [L('ما وراء الطبيعة', 'Ma Wara’ al-Tabi’a'), '#0b0b0b', '#a8121b', '#f2c14e'],
				fantasia: [L('فانتازيا', 'Fantasia'), '#1d1036', '#6b3fa0', '#f6d79a'],
				safari: [L('سافاري', 'Safari'), '#0f2a1a', '#2f7d3a', '#f4d03f'],
				own: [L('سلسلتي', 'My series'), '#1a1410', '#e0633a', '#f6d79a']
			};
			box.innerHTML = '<div class="cr-cv"><form class="cr-form" autocomplete="off">' +
				'<label>' + esc(L('عنوان العدد', 'The title')) + '<input name="title" maxlength="60" value="' + esc(L('أسطورة القارئ', 'The Legend of the Reader')) + '"></label>' +
				'<label>' + esc(L('اسمك', 'Your name')) + '<input name="name" maxlength="40"></label>' +
				'<label>' + esc(L('رقم العدد', 'Issue number')) + '<input name="n" type="number" min="1" max="999" value="1"></label>' +
				'<label>' + esc(L('على طريقة', 'In the manner of')) + '<select name="look">' + Object.keys(LOOKS).map(function (k) { return '<option value="' + k + '">' + esc(LOOKS[k][0]) + '</option>'; }).join('') + '</select></label>' +
				'<label>' + esc(L('اسم سلسلتك', 'Your series’ name')) + '<input name="series" maxlength="30" placeholder="' + esc(L('اتركه لاسم السلسلة', 'Leave it for the series’ name')) + '"></label>' +
				'<label>' + esc(L('صورة الغلاف', 'Cover picture')) + '<input name="pic" type="file" accept="image/*"></label>' +
				'<p class="cr-act"><button type="button" class="share-btn" data-act="save">' + esc(L('احفظ الغلاف', 'Save the cover')) + '</button></p></form>' +
				'<canvas class="cr-cv-art" width="780" height="1200" aria-label="' + esc(L('الغلاف', 'The cover')) + '"></canvas></div>';
			var form = box.querySelector('form'), c = box.querySelector('canvas'), x = c.getContext('2d');
			var fonts = document.fonts && document.fonts.load ? Promise.all(['400 90px Lalezar', '600 40px "Reem Kufi"'].map(function (f) { return document.fonts.load(f).catch(function () {}); })) : Promise.resolve();
			var draw = function () {
				var f = form.elements, look = LOOKS[f.look.value], rtl = A.lang !== 'en';
				var bg = look[1], band = look[2], gold = look[3], W = 780, H = 1200;
				x.direction = rtl ? 'rtl' : 'ltr'; x.textAlign = 'center';
				x.fillStyle = bg; x.fillRect(0, 0, W, H);
				/* the picture, filling its window */
				x.save(); x.beginPath(); x.rect(30, 180, W - 60, 760); x.clip();
				if (pic) {
					var k = Math.max((W - 60) / pic.width, 760 / pic.height), pw = pic.width * k, ph = pic.height * k;
					x.drawImage(pic, W / 2 - pw / 2, 560 - ph / 2, pw, ph);
				} else {
					var g = x.createLinearGradient(0, 180, 0, 940); g.addColorStop(0, band); g.addColorStop(1, bg);
					x.fillStyle = g; x.fillRect(30, 180, W - 60, 760);
					x.fillStyle = 'rgba(255,240,200,.85)'; x.beginPath(); x.arc(520, 400, 110, 0, Math.PI * 2); x.fill();
					x.fillStyle = bg; x.beginPath(); x.moveTo(30, 940); x.lineTo(30, 800); x.lineTo(160, 760); x.lineTo(230, 640); x.lineTo(300, 760); x.lineTo(420, 700); x.lineTo(560, 820); x.lineTo(W - 30, 760); x.lineTo(W - 30, 940); x.fill();
				}
				var sh = x.createLinearGradient(0, 700, 0, 940); sh.addColorStop(0, 'rgba(0,0,0,0)'); sh.addColorStop(1, bg);
				x.fillStyle = sh; x.fillRect(30, 700, W - 60, 240);
				x.restore();
				/* the band, the number's disc, the frame */
				x.fillStyle = band; x.fillRect(0, 0, W, 170);
				var series = f.series.value.trim() || look[0];
				x.fillStyle = gold; x.font = '400 ' + fitSize(series, 640, 92, 'Lalezar, sans-serif') + 'px Lalezar, sans-serif'; x.fillText(series, W / 2, 112);
				x.fillStyle = '#fff'; x.font = '600 26px "Reem Kufi", sans-serif'; x.fillText(L('قصص للجيب', 'Pocket stories'), W / 2, 152);
				var nx = rtl ? 100 : W - 100;
				x.fillStyle = gold; x.beginPath(); x.arc(nx, 262, 62, 0, Math.PI * 2); x.fill();
				x.fillStyle = bg; x.font = '400 64px Lalezar, sans-serif'; x.fillText(A.num(Math.max(1, +f.n.value || 1)), nx, 286);
				/* the title and the pen */
				var title = f.title.value.trim() || L('بلا عنوان', 'Untitled');
				x.fillStyle = gold; x.font = '400 ' + fitSize(title, 700, 110, 'Lalezar, sans-serif') + 'px Lalezar, sans-serif';
				x.shadowColor = 'rgba(0,0,0,.7)'; x.shadowBlur = 18; x.fillText(title, W / 2, 1040); x.shadowBlur = 0;
				x.fillStyle = '#efe6d2'; x.font = '600 38px "Reem Kufi", sans-serif'; x.fillText(L('بقلم: ', 'by ') + (f.name.value.trim() || L('قارئ العرّاب', 'a reader of the Godfather')), W / 2, 1110);
				x.fillStyle = 'rgba(239,230,210,.55)'; x.font = '400 18px Georgia, serif'; x.direction = 'ltr'; x.fillText('samehbilal.github.io/ahmed-khaled-tawfik', W / 2, 1172);
				x.strokeStyle = gold; x.lineWidth = 6; x.strokeRect(14, 14, W - 28, H - 28);
			};
			var fitSize = function (s, max, size, fam) { var f = size; do { x.font = '400 ' + f + 'px ' + fam; f -= 2; } while (x.measureText(s).width > max && f > 24); return f + 2; };
			form.addEventListener('input', function (ev) {
				if (ev.target.name !== 'pic') return draw();
				var file = ev.target.files && ev.target.files[0];
				if (!file) { pic = null; return draw(); }
				var img = new Image();
				img.onload = function () { pic = img; draw(); };
				img.src = URL.createObjectURL(file);
			});
			box.querySelector('[data-act="save"]').onclick = function () { self.save(c, 'akt-my-cover.png'); };
			fonts.then(draw);
			draw();
		},

		/* «اقرأ معنا»: this month's book, its questions, and the year ahead */
		club: function () {
			var A = App(), t = A.t, L = A.L, box = this.el.querySelector('.cr-club'), Ls = window.Lists;
			var now = new Date(), idx = now.getFullYear() * 12 + now.getMonth();
			var at = function (k) { return CLUB[((k - CLUB_FROM) % CLUB.length + CLUB.length) % CLUB.length]; };
			var MONTHS = A.lang === 'en' ? ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
				: ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
			var rec = function (k) { return Ls ? Ls.describe(k) : { title: { ar: k, en: k }, href: '#' }; };
			var cur = at(idx), r = rec(cur[0]);
			var shelf = [];
			for (var i = 1; i <= 5; i++) shelf.push([idx + i, rec(at(idx + i)[0])]);
			box.innerHTML = '<article class="cr-month">' +
				'<a class="cr-month-cover" href="' + esc(r.href) + '">' + window.WorksShared.miniCover({ img: r.img, color: r.color || '#3a1414', title: t(r.title), sub: r.series ? t(r.series) : '' }) + '</a>' +
				'<div><p class="cr-step">' + esc(L('كتاب ' + MONTHS[now.getMonth()] + ' ' + A.num(now.getFullYear()), 'The book for ' + MONTHS[now.getMonth()] + ' ' + now.getFullYear())) + '</p>' +
				'<h3><a href="' + esc(r.href) + '">' + esc(t(r.title)) + '</a>' + (r.series ? ' <small>' + esc(t(r.series)) + (r.n != null ? ' ' + esc(A.num(r.n)) : '') + '</small>' : '') + '</h3>' +
				'<ol class="cr-qs">' + cur[1].map(function (q) { return '<li>' + esc(t(q)) + '</li>'; }).join('') + '</ol>' +
				'<p class="cr-act">' + (Ls ? '<button type="button" class="share-btn" data-club="toread">' + esc(L('أضفه إلى «سأقرؤه»', 'Add to “Want to read”')) + '</button> <button type="button" class="share-btn" data-club="read">' + esc(L('قرأته', 'I have read it')) + '</button> ' : '') +
				'<button type="button" class="share-btn" data-club="share">' + esc(L('ادعُ صديقًا', 'Invite a friend')) + '</button></p></div></article>' +
				'<h3 class="cr-next-h">' + esc(L('الشهور القادمة', 'The months ahead')) + '</h3><ol class="cr-next">' + shelf.map(function (x) {
					return '<li><a href="' + esc(x[1].href) + '">' + window.WorksShared.miniCover({ img: x[1].img, color: x[1].color || '#3a1414', title: t(x[1].title) }) + '<b>' + esc(MONTHS[x[0] % 12]) + '</b><span>' + esc(t(x[1].title)) + '</span></a></li>';
				}).join('') + '</ol>';
			box.onclick = function (ev) {
				var b = ev.target.closest('[data-club]');
				if (!b) return;
				var k = b.getAttribute('data-club');
				if (k === 'share') {
					var text = L('اقرأ معي هذا الشهر «' + t(r.title) + '» لأحمد خالد توفيق', 'Read “' + t(r.title) + '” by Ahmed Khaled Tawfik with me this month'), url = 'https://samehbilal.github.io/ahmed-khaled-tawfik/read-with-us.html';
					if (navigator.share) navigator.share({ text: text, url: url }).catch(function () {});
					else if (navigator.clipboard) navigator.clipboard.writeText(text + ' ' + url).then(function () { if (window.Notify) window.Notify(L('نُسخت الدعوة.', 'Invitation copied.'), { type: 'success' }); });
					return;
				}
				Ls.add(k, rec(cur[0]));
				if (window.Notify) window.Notify(k === 'read' ? L('أُضيف إلى «قرأته».', 'Added to “Read”.') : L('أُضيف إلى «سأقرؤه».', 'Added to “Want to read”.'), { type: 'success', title: L('قوائمي', 'My lists') });
			};
		},

		/* a 1080×1350 picture in the night look of the quiz's: lines = [eyebrow, big, line] (who) or [name, first, fav, character, count] (card) */
		picture: function (kind, lines, img) {
			var A = App(), L = A.L, rtl = A.lang !== 'en', self = this;
			var c = document.createElement('canvas'); c.width = 1080; c.height = 1350;
			var x = c.getContext('2d');
			var pic = new Image(), ready = new Promise(function (res) { if (!img) return res(); pic.onload = res; pic.onerror = function () { img = ''; res(); }; pic.src = img; });
			var fonts = document.fonts && document.fonts.load ? Promise.all(['600 54px "Reem Kufi"', '400 90px Lalezar', '700 120px "Cormorant Garamond"'].map(function (f) { return document.fonts.load(f).catch(function () {}); })) : Promise.resolve();
			Promise.all([fonts, ready]).then(function () {
				var g = x.createRadialGradient(760, 260, 40, 540, 640, 1100); g.addColorStop(0, '#2a1a14'); g.addColorStop(1, '#0b0c10');
				x.fillStyle = g; x.fillRect(0, 0, 1080, 1350);
				x.strokeStyle = '#e0633a'; x.lineWidth = 4; x.strokeRect(48, 48, 984, 1254);
				x.textAlign = 'center';
				var text = function (s, y, font, col, dir) { x.direction = dir || (rtl ? 'rtl' : 'ltr'); x.font = font; x.fillStyle = col; x.fillText(s, 540, y); };
				var fit = function (s, max, size, fam) { var f = size; do { x.font = '600 ' + f + 'px ' + fam; f -= 2; } while (x.measureText(s).width > max && f > 18); return x.font; };
				if (img) {
					var h = kind === 'who' ? 520 : 420, w = Math.min(760, pic.width * h / pic.height);
					x.drawImage(pic, 540 - w / 2, kind === 'who' ? 120 : 110, w, h);
				}
				if (kind === 'who') {
					text(lines[0], 740, '600 44px "Reem Kufi", sans-serif', '#c9b48e');
					text(lines[1], 850, '400 96px Lalezar, sans-serif', '#f6d79a');
					text(lines[2], 940, fit(lines[2], 880, 48, '"Reem Kufi", sans-serif'), '#efe6d2');
					text(L('وأنت؟ أي شخصية أنت؟', 'And you? Which one are you?'), 1050, '400 36px "Reem Kufi", sans-serif', '#c9b48e');
				} else {
					var y = img ? 590 : 230;
					text(L('بطاقة قارئ', 'A reader’s card'), y, '600 42px "Reem Kufi", sans-serif', '#c9b48e');
					if (lines[0]) text(lines[0], y + 100, fit(lines[0], 880, 80, 'Lalezar, sans-serif'), '#f6d79a');
					var rows = [[L('أول ما قرأت', 'First read'), lines[1]], [L('الأحب إليّ', 'Favourite'), lines[2]], [L('شخصيتي', 'My character'), lines[3]], [L('قرأت له', 'Books read'), lines[4] ? A.num(lines[4]) : '']].filter(function (r) { return r[1]; });
					rows.forEach(function (r, i) {
						var yy = y + 200 + i * 110;
						text(r[0], yy, '400 30px "Reem Kufi", sans-serif', '#c9b48e');
						text(r[1], yy + 52, fit(r[1], 900, 46, '"Reem Kufi", sans-serif'), '#efe6d2');
					});
				}
				text('العرّاب', 1210, '400 48px Lalezar, sans-serif', '#e0633a');
				text('samehbilal.github.io/ahmed-khaled-tawfik/' + (kind === 'who' ? 'which-character' : 'reader-card') + '.html', 1262, '400 24px "Cormorant Garamond", Georgia, serif', '#c9b48e', 'ltr');
				self.save(c, kind === 'who' ? 'akt-character.png' : 'akt-reader-card.png');
			});
		},

		/* a drawn picture, shared where the device can share files, else saved */
		save: function (c, name) {
			c.toBlob(function (blob) {
				var file = new File([blob], name, { type: 'image/png' });
				if (navigator.canShare && navigator.canShare({ files: [file] })) navigator.share({ files: [file] }).catch(function () {});
				else { var a = document.createElement('a'); a.download = name; a.href = URL.createObjectURL(blob); a.click(); }
			}, 'image/png');
		}
	};

	/* the five pages of their own (once the parts of «ركن القرّاء», quiz.html, which now leads to them): each its strings, its
	   band and its section; the page says which with <main data-corner="…">, and corner.js gives it its PAGE */
	var LOOK = { mwt: ['#0b0b0b', '#a8121b', '#f2c14e'], fantasia: ['#1d1036', '#6b3fa0', '#f6d79a'], safari: ['#0f2a1a', '#2f7d3a', '#f4d03f'], own: ['#1a1410', '#e0633a', '#f6d79a'] };
	/* one of a band's pieces lit in turn, as the pointer lights any; a click goes down to the page's section */
	function spotlight(box, sel, to) {
		if (!box || box._wired) return;
		box._wired = true;
		var items = [].slice.call(box.querySelectorAll(sel)), at = Math.floor(items.length / 2), hold = false;
		var show = function (i) { items.forEach(function (c, j) { c.classList.toggle('is-on', j === i); }); };
		box.addEventListener('pointerover', function (ev) { var c = ev.target.closest(sel); if (c) { hold = true; show(items.indexOf(c)); } });
		box.addEventListener('pointerleave', function () { hold = false; });
		box.addEventListener('click', function (ev) { ev.preventDefault(); var el = document.getElementById(to); if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' }); });
		show(at);
		if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
		setInterval(function () { if (!hold && !document.hidden) show(at = (at + 1) % items.length); }, 2400);
	}
	function heroOf(id) {
		var A = App(), c = (A.data().characters || []).filter(function (x) { return x.id === id; })[0] || { name: { ar: id, en: id } };
		return { c: c, pic: (A.data().charFigures || {})[id] || c.image || '' };
	}

	Corner.PAGES = {
		/* «أي شخصية أنت؟»: the six he might find in you, in oval frames like old portraits, one lit at a time with what makes them so */
		who: {
			id: 'which-character', box: 'cr-who',
			title: { ar: 'أي شخصية أنت؟', en: 'Which character are you?' },
			eyebrow: { ar: 'العب', en: 'Play' },
			lead: { ar: 'سبعة أسئلة عن ليلتك وخوفك ومشروبك، وفي آخرها شخصية من عالم العرّاب تشبهك، وصورة تشاركها.', en: 'Seven questions about your evenings, your fears and your drink, and at the end one of the Godfather’s characters who is like you, with a picture to share.' },
			band: function (d, A) {
				var e = A.esc, t = A.t;
				setTimeout(function () { spotlight(document.querySelector('.cbw'), '.cbw-f', 'who'); }, 0);
				return '<div class="cbw">' + Object.keys(WHO).map(function (id, i) {
					var h = heroOf(id);
					return '<a class="cbw-f" href="#who" style="--i:' + i + '"><span class="cbw-pic">' + (h.pic ? '<img src="' + e(h.pic) + '" alt="" loading="lazy" decoding="async">' : '<b>' + e(t(h.c.name).replace(/^د\.\s*/, '').slice(0, 1)) + '</b>') + '</span>' +
						'<span class="cbw-n">' + e(t(h.c.name)) + '</span><small>' + e(t(WHO[id]).split(':')[0]) + '</small></a>';
				}).join('') + '</div>';
			}
		},
		/* «البدايات»: a sheet in a typewriter, a first line typed on it a letter at a time, then the question */
		openings: {
			id: 'first-lines', box: 'cr-open',
			title: { ar: 'البدايات', en: 'First lines' },
			eyebrow: { ar: 'العب', en: 'Play' },
			lead: { ar: 'أول سطر في كتاب أو عدد من أعداده: من أي كتاب هو؟ أربعة أغلفة تختار منها، والجواب برابط صفحته.', en: 'The first line of one of his books or issues: which one does it open? Four covers to choose from, and the answer with a link to its page.' },
			band: function (d, A) {
				var e = A.esc, L = A.L, lines = (d.openings || []).map(function (o) { return o.line; }).filter(function (s) { return s && s.length < 150; });
				setTimeout(function () { Corner.typewriter(lines); }, 0);
				return '<a class="cbo" href="#openings"><span class="cbo-roll" aria-hidden="true"></span><span class="cbo-sheet"><span class="cbo-line" dir="rtl"></span><i class="cbo-caret" aria-hidden="true"></i>' +
					'<span class="cbo-ask">' + e(L('…من أي كتاب؟', '…which book?')) + '</span></span><span class="cbo-body" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i></span></a>';
			}
		},
		/* «بطاقة القارئ»: a library's borrowing card, his books down it with their years stamped in red, and a round stamp */
		card: {
			id: 'reader-card', box: 'cr-card',
			title: { ar: 'بطاقة القارئ', en: 'Reader’s card' },
			eyebrow: { ar: 'شارك', en: 'Share' },
			lead: { ar: 'أول ما قرأت له، وأحب كتبه إليك، وشخصيتك المفضلة، وكم قرأت له، في بطاقة تشاركها. لا يُرسل شيء؛ البطاقة تُرسم على جهازك.', en: 'The first thing of his you read, your favourite book and character, and how many you have read, on a card to share. Nothing is sent; the card is drawn on your device.' },
			band: function (d, A) {
				var e = A.esc, L = A.L, t = A.t;
				var rows = [['mwt', 1993], ['fantasia', 1995], ['safari', 1996], ['utopia', 2008], ['rats', 2016]].map(function (x) {
					var w = A.findWork(x[0]), s = (d.series || []).filter(function (y) { return y.id === x[0]; })[0];
					return [w ? t(w.title) : s ? t(s.title) : x[0], x[1]];
				});
				return '<a class="cbc" href="#card"><span class="cbc-card"><span class="cbc-h"><b>' + e(L('بطاقة استعارة', 'Borrowing card')) + '</b><small>' + e(L('مكتبة العرّاب', 'The Godfather’s library')) + '</small></span>' +
					'<span class="cbc-name">' + e(L('اسم القارئ: ', 'Reader: ')) + '<i>' + e(L('اسمك هنا', 'your name here')) + '</i></span>' +
					rows.map(function (r, i) { return '<span class="cbc-row" style="--i:' + i + '"><span>' + e(r[0]) + '</span><em>' + e(A.num(r[1])) + '</em></span>'; }).join('') +
					'<span class="cbc-seal">' + e(L('قارئ', 'Reader')) + '<small>' + e(L('العرّاب', 'Al-Arrab')) + '</small></span></span></a>';
			}
		},
		/* «صمّم غلافك»: pocket-book covers in his series' looks, untitled, and in the middle the reader's, its title still a caret */
		cover: {
			id: 'cover-maker', box: 'cr-cover',
			title: { ar: 'صمّم غلافك', en: 'Design your cover' },
			eyebrow: { ar: 'اصنع', en: 'Make' },
			lead: { ar: 'غلاف كتاب جيب على طريقة سلاسله: عنوانك واسمك ورقم العدد وصورتك. لا تُرفع الصورة إلى أي مكان؛ الغلاف يُرسم على جهازك.', en: 'A pocket-book cover in the manner of his series: your title, your name, an issue number and your picture. The picture goes nowhere; the cover is drawn on your device.' },
			band: function (d, A) {
				var e = A.esc, L = A.L;
				var set = [['safari', L('سافاري', 'Safari'), 7], ['mwt', L('ما وراء الطبيعة', 'Ma Wara’'), 33], ['own', L('سلسلتك', 'Your series'), 1], ['fantasia', L('فانتازيا', 'Fantasia'), 12], ['mwt', L('ما وراء الطبيعة', 'Ma Wara’'), 80]];
				setTimeout(function () { spotlight(document.querySelector('.cbv'), '.cbv-c', 'cover'); }, 0);
				return '<div class="cbv">' + set.map(function (s, i) {
					var lk = LOOK[s[0]], me = s[0] === 'own';
					return '<a class="cbv-c' + (me ? ' is-me' : '') + '" href="#cover" style="--bg:' + lk[0] + ';--band:' + lk[1] + ';--gold:' + lk[2] + ';--k:' + (i - 2) + ';--ak:' + Math.abs(i - 2) + '">' +
						'<span class="cbv-band">' + e(s[1]) + '</span><span class="cbv-n">' + e(A.num(s[2])) + '</span><span class="cbv-moon" aria-hidden="true"></span>' +
						'<span class="cbv-t">' + (me ? e(L('عنوانك', 'Your title')) + '<i class="cbv-caret" aria-hidden="true"></i>' : '<i class="cbv-blank"></i>') + '</span>' +
						'<span class="cbv-by">' + e(me ? L('بقلم: أنت', 'by: you') : L('بقلم: ؟', 'by: ?')) + '</span></a>';
				}).join('') + '</div>';
			}
		},
		/* «اقرأ معنا»: the months as a row of covers, the month's book raised and lit, the ones before faded, the ones to come ahead */
		club: {
			id: 'read-with-us', box: 'cr-club',
			title: { ar: 'اقرأ معنا', en: 'Read with us' },
			eyebrow: { ar: 'اقرأ', en: 'Read' },
			lead: { ar: 'كتاب كل شهر، الكتاب نفسه لكل القرّاء، وأسئلة تتحدث فيها مع أصدقائك؛ وكتب الشهور القادمة لتستعد لها.', en: 'A book a month, the same one for every reader, with questions to talk over with your friends; and the books of the months ahead, to get ready.' },
			band: function (d, A) {
				var e = A.esc, L = A.L, t = A.t, Ls = window.Lists, S = window.WorksShared;
				if (!Ls || !S) return '';
				var now = new Date(), idx = now.getFullYear() * 12 + now.getMonth();
				var MON = A.lang === 'en' ? ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'] : ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
				var out = [];
				for (var k = idx - 3; k <= idx + 5; k++) {
					if (k < CLUB_FROM) continue;
					var r = Ls.describe(CLUB[((k - CLUB_FROM) % CLUB.length + CLUB.length) % CLUB.length][0]);
					out.push('<a class="cbk-m' + (k === idx ? ' is-now' : k < idx ? ' is-past' : '') + '" href="#club" title="' + e(t(r.title)) + '">' +
						S.miniCover({ img: r.img, color: r.color || '#3a1414', title: t(r.title) }) +
						'<b>' + e(k === idx ? L('هذا الشهر', 'This month') : MON[k % 12]) + '</b></a>');
				}
				return '<div class="cbk">' + out.join('') + '</div>';
			}
		}
	};

	/* «البدايات»'s band: a first line typed out, held, cleared, and the next */
	Corner.typewriter = function (lines) {
		var el = document.querySelector('.cbo-line'), box = document.querySelector('.cbo');
		if (!el || !lines.length) return;
		var order = lines.slice().sort(function () { return Math.random() - 0.5; }), n = 0;
		if (matchMedia('(prefers-reduced-motion: reduce)').matches) { el.textContent = order[0]; box.classList.add('is-asked'); return; }
		var line = function () {
			var s = order[n++ % order.length], i = 0;
			box.classList.remove('is-asked');
			var tick = setInterval(function () {
				if (!el.isConnected) return clearInterval(tick);
				if (document.hidden) return;
				el.textContent = s.slice(0, ++i);
				if (i >= s.length) { clearInterval(tick); box.classList.add('is-asked'); setTimeout(line, 3600); }
			}, 55);
		};
		line();
	};

	/* the page this is, if it is one of the five */
	var host = document.querySelector('[data-corner]'), key = host && host.getAttribute('data-corner'), P = key && Corner.PAGES[key];
	if (P && !window.PAGE) window.PAGE = {
		id: P.id, title: P.title,
		strings: { eyebrow: P.eyebrow, title: P.title, lead: P.lead },
		band: P.band,
		render: function () { Corner.mount(document.getElementById('content'), key); window.App.focusHash(); }
	};

	window.Corner = Corner;
})();

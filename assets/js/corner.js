/* quiz.html, «ركن القرّاء»: after «اختبر نفسك» (quiz.js), three more things to do with his world —
   «أي شخصية أنت؟» (seven questions; the answers lean to one of six of his characters, with a picture to share),
   «بطاقة القارئ» (the reader's first book, favourite book and character, and how much they have read, as a card to share),
   and «اقرأ معنا» (a book a month, the same for everyone, with questions to talk over). Nothing is sent anywhere. */
(function () {
	'use strict';

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
		mount: function (el) {
			this.el = el;
			var L = App().L;
			el.innerHTML =
				'<section class="section cr" id="who"><div class="wrap"><h2 class="cr-h">' + esc(L('أي شخصية أنت؟', 'Which character are you?')) + '</h2>' +
					'<p class="cr-lead">' + esc(L('سبعة أسئلة، وفي آخرها شخصية من عالمه تشبهك.', 'Seven questions, and at the end one of his characters who is like you.')) + '</p><div class="cr-who"></div></div></section>' +
				'<section class="section cr" id="card"><div class="wrap"><h2 class="cr-h">' + esc(L('بطاقة القارئ', 'Reader’s card')) + '</h2>' +
					'<p class="cr-lead">' + esc(L('أول ما قرأت له، وأحب كتبه إليك، وشخصيتك المفضلة، في بطاقة تشاركها. لا يُرسل شيء؛ البطاقة تُرسم على جهازك.', 'The first thing of his you read, your favourite book and character, on a card to share. Nothing is sent; the card is drawn on your device.')) + '</p><div class="cr-card"></div></div></section>' +
				'<section class="section cr" id="club"><div class="wrap"><h2 class="cr-h">' + esc(L('اقرأ معنا', 'Read with us')) + '</h2>' +
					'<p class="cr-lead">' + esc(L('كتاب كل شهر، الكتاب نفسه لكل القرّاء، وأسئلة تتحدث فيها مع أصدقائك.', 'A book a month, the same one for every reader, with questions to talk over with your friends.')) + '</p><div class="cr-club"></div></div></section>';
			this.who(); this.card(); this.club();
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
			var chars = (d.characters || []).map(function (c) { return '<option value="' + esc(c.id) + '">' + esc(t(c.name)) + '</option>'; }).join('');
			box.innerHTML = '<form class="cr-form" autocomplete="off">' +
				'<label>' + esc(L('اسمك (كما تريده على البطاقة)', 'Your name (as you want it on the card)')) + '<input name="name" maxlength="40"></label>' +
				'<label>' + esc(L('أول ما قرأت له', 'The first thing of his you read')) + '<input name="first" list="cr-titles" maxlength="90"></label>' +
				'<label>' + esc(L('أحب كتبه إليك', 'Your favourite of his')) + '<input name="fav" list="cr-titles" maxlength="90"></label>' +
				'<label>' + esc(L('شخصيتك المفضلة', 'Your favourite character')) + '<select name="char"><option value=""></option>' + chars + '</select></label>' +
				'<label>' + esc(L('كم قرأت له؟', 'How many have you read?')) + '<input name="count" type="number" min="0" max="999" value="' + (read || '') + '"></label>' +
				'<datalist id="cr-titles">' + titles.map(function (x) { return '<option value="' + esc(x[0]) + '">'; }).join('') + '</datalist>' +
				'<p class="cr-act"><button type="submit" class="share-btn">' + esc(L('ارسم بطاقتي', 'Draw my card')) + '</button>' +
				(read ? ' <span class="cr-hint">' + esc(L('العدد من «قرأته» في قوائمك.', 'The count comes from “Read” in your lists.')) + '</span>' : '') + '</p></form>';
			box.querySelector('form').onsubmit = function (ev) {
				ev.preventDefault();
				var f = ev.target, c = (d.characters || []).filter(function (x) { return x.id === f.char.value; })[0];
				var fav = titles.filter(function (x) { return x[0] === f.fav.value; })[0];
				self.picture('card', [f.name.value.trim(), f.first.value.trim(), f.fav.value.trim(), c ? t(c.name) : '', f.count.value], fav && fav[2]);
			};
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
					var text = L('اقرأ معي هذا الشهر «' + t(r.title) + '» لأحمد خالد توفيق', 'Read “' + t(r.title) + '” by Ahmed Khaled Tawfik with me this month'), url = 'https://samehbilal.github.io/ahmed-khaled-tawfik/quiz.html#club';
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
			var A = App(), L = A.L, rtl = A.lang !== 'en';
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
				text('samehbilal.github.io/ahmed-khaled-tawfik/quiz.html', 1262, '400 24px "Cormorant Garamond", Georgia, serif', '#c9b48e', 'ltr');
				c.toBlob(function (blob) {
					var name = kind === 'who' ? 'akt-character.png' : 'akt-reader-card.png', file = new File([blob], name, { type: 'image/png' });
					if (navigator.canShare && navigator.canShare({ files: [file] })) navigator.share({ files: [file] }).catch(function () {});
					else { var a = document.createElement('a'); a.download = name; a.href = URL.createObjectURL(blob); a.click(); }
				}, 'image/png');
			});
		}
	};
	window.Corner = Corner;
})();

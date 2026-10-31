/* quiz.html — «ركن القرّاء»: «اختبر نفسك» first (here), then the character quiz, the reader's card, the cover maker and the reading club (corner.js).
   «اختبر نفسك»: ten questions drawn from the site's own data each round — a cover and its issue, a quote and its
   book, a character and their series, an issue and its series, a book and its year, a description and the character —
   four answers each, the right one shown with a link to its page; then the score, and the score as a picture to share. */
window.PAGE = {
	id: 'quiz',
	title: { ar: 'ركن القرّاء', en: 'Readers’ corner' },
	strings: {
		eyebrow: { ar: 'العب واقرأ', en: 'Play and read' },
		title: { ar: 'ركن القرّاء', en: 'Readers’ corner' },
		lead: {
			ar: 'اختبر معرفتك بعالم العرّاب، واعرف أي شخصياته أنت، وارسم بطاقتك قارئًا، واقرأ معنا كتاب الشهر.',
			en: 'Test what you know of the Godfather’s world, find which of his characters you are, draw your reader’s card, and read this month’s book with us.'
		}
	},
	ROUND: 10,

	shuffle: function (a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), x = a[i]; a[i] = a[j]; a[j] = x; } return a; },
	pick: function (a) { return a[Math.floor(Math.random() * a.length)]; },
	/* the right answer and three others, distinct, shuffled */
	options: function (right, pool) {
		var seen = {}, out = [right];
		seen[right] = 1;
		this.shuffle(pool).forEach(function (o) { if (out.length < 4 && o && !seen[o]) { seen[o] = 1; out.push(o); } });
		return out.length === 4 ? this.shuffle(out) : null;
	},

	/* one question of each kind; null when the data cannot make it */
	makers: function () {
		var App = window.App, d = App.data(), S = window.WorksShared, t = App.t, L = App.L, self = this;
		var heroSeries = ['mwt', 'fantasia', 'safari'];
		var chars = (d.characters || []).filter(function (c) { return App.findWork(c.work); });
		var titleOf = function (id) { var w = App.findWork(id); return w ? t(w.title) : ''; };
		return [
			/* a cover: which issue? */
			function () {
				var sid = self.pick(heroSeries), list = S.seriesIssues(sid).filter(function (is) { return !(is.part > 1) && S.issueCover(sid, is); });
				var is = self.pick(list), opts = self.options(t(is.title), list.map(function (x) { return t(x.title); }));
				return opts && { kind: L('غلاف', 'Cover'), q: L('أي عدد هذا الغلاف؟', 'Which issue has this cover?'), img: S.issueCover(sid, is), tall: true,
					opts: opts, a: t(is.title), href: App.issueHref(sid, is), more: t(S.anySeries(sid).s.title) + (is.n != null ? ' #' + App.num(is.n) : '') };
			},
			/* a quote: which book? */
			function () {
				var qs = (d.quotes || []).filter(function (q) { return q.work && titleOf(q.work) && t(q.text).length < 240; });
				var q = self.pick(qs), opts = self.options(titleOf(q.work), qs.map(function (x) { return titleOf(x.work); }).concat((d.works || []).map(function (w) { return t(w.title); })));
				return opts && { kind: L('اقتباس', 'Quote'), q: L('من أي كتاب هذا الاقتباس؟', 'Which book is this quote from?'), quote: t(q.text), opts: opts, a: titleOf(q.work), href: App.workHref(q.work) };
			},
			/* a character: which series or book? */
			function () {
				var c = self.pick(chars), opts = self.options(titleOf(c.work), chars.map(function (x) { return titleOf(x.work); }).concat((d.series || []).map(function (s) { return t(s.title); })));
				return opts && { kind: L('شخصية', 'Character'), q: L('في أي سلسلة أو رواية تظهر هذه الشخصية: ', 'Which series or novel is this character from: ') + t(c.name) + L('؟', '?'),
					opts: opts, a: titleOf(c.work), href: App.charHref(c.id) };
			},
			/* an issue's title: which series? */
			function () {
				var all = (d.series || []).filter(function (s) { return S.seriesIssues(s.id).length > 3; });
				var s = self.pick(all), is = self.pick(S.seriesIssues(s.id)), opts = self.options(t(s.title), all.map(function (x) { return t(x.title); }));
				return opts && { kind: L('عنوان', 'Title'), q: L('«' + t(is.title) + '» عدد من أي سلسلة؟', '“' + t(is.title) + '” is an issue of which series?'),
					opts: opts, a: t(s.title), href: App.issueHref(s.id, is) };
			},
			/* a book: which year? */
			function () {
				var ws = (d.works || []).filter(function (w) { return /\d{4}/.test(String(w.year || '')); });
				var w = self.pick(ws), y = +String(w.year).match(/\d{4}/)[0];
				var near = [-4, -3, -2, -1, 1, 2, 3, 4].map(function (k) { return String(y + k); });
				var opts = self.options(String(y), near);
				return opts && { kind: L('سنة', 'Year'), q: L('في أي عام صدر «' + t(w.title) + '»؟', 'In which year did “' + t(w.title) + '” come out?'),
					opts: opts, a: String(y), href: App.workHref(w.id), more: t(w.title) };
			},
			/* a description: who is it? */
			function () {
				var c = self.pick(chars.filter(function (x) { return t(x.desc).length > 40; })), text = t(c.desc), name = t(c.name);
				/* the name itself is hidden from the description */
				var bare = name.replace(/^(د\.|Dr\.)\s*/, '').split(' ')[0];
				text = text.split(name).join('…').split(bare).join('…');
				if (text.length > 260) text = text.slice(0, 257).replace(/\s+\S*$/, '') + '…';
				var opts = self.options(name, chars.map(function (x) { return t(x.name); }));
				return opts && { kind: L('من هو؟', 'Who?'), q: L('عمّن يتحدث هذا الوصف؟', 'Who does this describe?'), quote: text, opts: opts, a: name, href: App.charHref(c.id) };
			}
		];
	},

	/* the kinds in turn, each pass in a new order, so a round mixes them all */
	round: function () {
		var makers = this.makers(), out = [], seen = {}, order = [];
		while (order.length < this.ROUND * 6) order = order.concat(this.shuffle(makers.map(function (m, i) { return i; })));
		for (var k = 0; k < order.length && out.length < this.ROUND; k++) {
			var q = null;
			try { q = makers[order[k]](); } catch (e) {}
			if (q && !seen[q.q + q.a]) { seen[q.q + q.a] = 1; out.push(q); }
		}
		return out;
	},

	render: function () {
		this.qs = this.round();
		this.at = 0; this.score = 0;
		var L = window.App.L, e = window.App.esc;
		document.getElementById('content').innerHTML = '<nav class="chips cr-jump wrap"><a class="chip" href="#quiz">' + e(L('اختبر نفسك', 'Test yourself')) + '</a><a class="chip" href="#who">' + e(L('أي شخصية أنت؟', 'Which character are you?')) + '</a><a class="chip" href="#card">' + e(L('بطاقة القارئ', 'Reader’s card')) + '</a><a class="chip" href="#cover">' + e(L('صمّم غلافك', 'Design your cover')) + '</a><a class="chip" href="#club">' + e(L('اقرأ معنا', 'Read with us')) + '</a></nav>' +
			'<section class="section qz" id="quiz"><div class="wrap"><h2 class="cr-h">' + e(L('اختبر نفسك', 'Test yourself')) + '</h2><p class="cr-lead">' + e(L('عشرة أسئلة عن عالم العرّاب، تتغيّر في كل جولة: أغلفة واقتباسات وشخصيات وسنوات. كم تعرف؟', 'Ten questions on the Godfather’s world, new each round: covers, quotes, characters and years. How much do you know?')) + '</p><div class="qz-box"></div></div></section><div id="corner"></div>';
		if (window.Corner) window.Corner.mount(document.getElementById('corner'));
		var self = this;
		document.querySelector('.qz-box').addEventListener('click', function (ev) {
			var b = ev.target.closest('button');
			if (!b) return;
			if (b.hasAttribute('data-opt') && !self.answered) self.answer(b);
			else if (b.classList.contains('qz-next')) { self.at++; self.show(); }
			else if (b.classList.contains('qz-again')) self.render();
			else if (b.classList.contains('qz-pic')) self.picture(b.getAttribute('data-act'));
		});
		this.show();
	},

	show: function () {
		var App = window.App, e = App.esc, L = App.L, box = document.querySelector('.qz-box');
		if (this.at >= this.qs.length) return this.end();
		var q = this.qs[this.at];
		this.answered = false;
		box.innerHTML =
			'<div class="qz-top"><span class="qz-kind">' + e(q.kind) + '</span><span class="qz-count">' + e(App.num(this.at + 1)) + ' / ' + e(App.num(this.qs.length)) + '</span>' +
				'<span class="qz-bar"><i style="width:' + (this.at / this.qs.length * 100) + '%"></i></span></div>' +
			'<div class="qz-q' + (q.img ? ' has-img' : '') + '">' +
				(q.img ? '<img class="qz-img' + (q.tall ? ' is-tall' : '') + '" src="' + e(q.img) + '" alt="">' : '') +
				'<div><h2>' + e(q.q) + '</h2>' + (q.quote ? '<blockquote>' + e(q.quote) + '</blockquote>' : '') + '</div></div>' +
			'<div class="qz-opts">' + q.opts.map(function (o, i) { return '<button type="button" data-opt="' + i + '">' + e(o) + '</button>'; }).join('') + '</div>' +
			'<div class="qz-after" hidden></div>';
		var first = box.querySelector('[data-opt]');
		if (first) first.focus({ preventScroll: true });
	},

	answer: function (b) {
		var App = window.App, e = App.esc, L = App.L, q = this.qs[this.at], box = document.querySelector('.qz-box');
		this.answered = true;
		var right = b.textContent === q.a;
		if (right) this.score++;
		box.querySelectorAll('[data-opt]').forEach(function (x) {
			x.disabled = true;
			if (x.textContent === q.a) x.classList.add('is-right');
			else if (x === b) x.classList.add('is-wrong');
		});
		var after = box.querySelector('.qz-after');
		after.innerHTML = '<p class="' + (right ? 'qz-yes' : 'qz-no') + '">' + e(right ? this.pick([L('أحسنت!', 'Right!'), L('صحيح!', 'Correct!'), L('برافو!', 'Bravo!')]) : L('الإجابة: ', 'The answer: ') + q.a) + '</p>' +
			'<a href="' + e(q.href) + '" target="_blank" rel="noopener">' + e(L('صفحته ↗', 'Its page ↗')) + (q.more ? ' · ' + e(q.more) : '') + '</a>' +
			'<button type="button" class="share-btn qz-next">' + e(this.at + 1 < this.qs.length ? L('السؤال التالي ←', 'Next question →') : L('النتيجة ←', 'Your score →')) + '</button>';
		after.hidden = false;
		after.querySelector('.qz-next').focus({ preventScroll: true });
	},

	verdict: function (n, of) {
		var L = window.App.L, r = n / of;
		return r === 1 ? L('عرّابيّ أصيل! لا يفوتك شيء.', 'A true Godfather fan: nothing gets past you.')
			: r >= .8 ? L('قارئ قديم يعرف عالمه جيدًا.', 'An old reader who knows his world well.')
			: r >= .5 ? L('بداية طيبة، والمكتبة في انتظارك.', 'A good start; the library awaits.')
			: L('لا بأس، فلتبدأ من «من أين أبدأ؟».', 'No matter: start with “Start here”.');
	},

	end: function () {
		var App = window.App, e = App.esc, L = App.L, box = document.querySelector('.qz-box');
		var canShare = !!(navigator.canShare && window.File && navigator.canShare({ files: [new File([''], 'q.png', { type: 'image/png' })] }));
		box.innerHTML = '<div class="qz-end"><p class="eyebrow">' + e(L('نتيجتك', 'Your score')) + '</p>' +
			'<div class="qz-score"><b>' + e(App.num(this.score)) + '</b><span>/ ' + e(App.num(this.qs.length)) + '</span></div>' +
			'<p class="qz-verdict">' + e(this.verdict(this.score, this.qs.length)) + '</p>' +
			'<div class="qz-end-act">' +
				'<button type="button" class="share-btn qz-again">' + e(L('جولة جديدة', 'Another round')) + '</button>' +
				(canShare ? '<button type="button" class="share-btn qz-pic" data-act="share">' + e(L('شارك النتيجة صورةً', 'Share your score')) + '</button>' : '') +
				'<button type="button" class="share-btn qz-pic" data-act="save">' + e(L('تحميل الصورة', 'Download the picture')) + '</button>' +
				(this.score / this.qs.length < .5 ? '<a class="share-btn" href="guide.html">' + e(L('من أين أبدأ؟', 'Start here')) + '</a>' : '') +
			'</div></div>';
	},

	/* the score as a 1080×1080 card, in the night look of the quote pictures */
	picture: function (act) {
		var App = window.App, L = App.L, self = this, rtl = App.lang !== 'en';
		var c = document.createElement('canvas'); c.width = 1080; c.height = 1080;
		var x = c.getContext('2d');
		var fonts = document.fonts && document.fonts.load ? Promise.all(['400 300px "Cormorant Garamond"', '600 54px "Reem Kufi"', '400 44px Lalezar']
			.map(function (f) { return document.fonts.load(f).catch(function () {}); })) : Promise.resolve();
		fonts.then(function () {
			var g = x.createRadialGradient(760, 220, 40, 540, 540, 900);
			g.addColorStop(0, '#2a1a14'); g.addColorStop(1, '#0b0c10');
			x.fillStyle = g; x.fillRect(0, 0, 1080, 1080);
			x.strokeStyle = '#e0633a'; x.lineWidth = 4; x.strokeRect(48, 48, 984, 984);
			x.textAlign = 'center'; x.direction = rtl ? 'rtl' : 'ltr';
			x.fillStyle = '#c9b48e'; x.font = '600 50px "Reem Kufi", sans-serif';
			x.fillText(L('اختبرت معرفتي بعالم العرّاب', 'I tested my knowledge of the Godfather’s world'), 540, 230);
			x.direction = 'ltr'; x.fillStyle = '#e0633a'; x.font = '700 300px "Cormorant Garamond", Georgia, serif';
			x.fillText(self.score + '/' + self.qs.length, 540, 600);
			x.direction = rtl ? 'rtl' : 'ltr'; x.fillStyle = '#efe6d2'; x.font = '600 44px "Reem Kufi", sans-serif';
			x.fillText(self.verdict(self.score, self.qs.length), 540, 730);
			x.fillStyle = '#c9b48e'; x.font = '400 34px "Reem Kufi", sans-serif';
			x.fillText(L('وأنت؟ كم تعرف؟', 'And you? How much do you know?'), 540, 810);
			x.font = '400 44px Lalezar, sans-serif'; x.fillStyle = '#e0633a';
			x.fillText('العرّاب', 540, 920);
			x.font = '400 24px "Cormorant Garamond", Georgia, serif'; x.fillStyle = '#c9b48e'; x.direction = 'ltr';
			x.fillText('samehbilal.github.io/ahmed-khaled-tawfik/quiz.html', 540, 970);
			if (act === 'share') {
				c.toBlob(function (blob) {
					navigator.share({ files: [new File([blob], 'akt-quiz.png', { type: 'image/png' })],
						text: L('حصلت على ' + self.score + ' من ' + self.qs.length + ' في «اختبر نفسك» عن عالم أحمد خالد توفيق.', 'I scored ' + self.score + '/' + self.qs.length + ' on the Ahmed Khaled Tawfik quiz.'),
						url: 'https://samehbilal.github.io/ahmed-khaled-tawfik/quiz.html' }).catch(function () {});
				}, 'image/png');
			} else {
				var a = document.createElement('a'); a.download = 'akt-quiz.png'; a.href = c.toDataURL('image/png'); a.click();
			}
		});
	}
};

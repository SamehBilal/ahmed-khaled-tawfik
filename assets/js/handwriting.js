/* handwriting.html — «بخط يده», a page of its own again (it was the second half of «حكايات القرّاء» for a while, whose old
   #hand, #dedications and #send lead here): what he wrote by hand for his readers, as they and reporters told of it, linked
   where it was published (AKT.handwriting, data-pages.js); his books' printed dedications (#dedications, AKT.dedications); and a
   form for a dedication of one's own (#send). The band: a ruled sheet, a pen writing a dedication on it and signing it. */
window.PAGE = {
	id: 'handwriting',
	title: { ar: 'بخط يده', en: 'In his hand' },
	strings: {
		eyebrow: { ar: 'إهداءات وتوقيعات', en: 'Dedications and signatures' },
		title: { ar: 'بخط يده', en: 'In his hand' },
		lead: { ar: 'ما كتبه بيده لقرّائه: إهداءات على نسخهم وتوقيعات في حفلات التوقيع وقصاصات جيبه، كما رواها أصحابها؛ وإهداءات كتبه المطبوعة، وإن كان عندك إهداء منه فأرسله.',
			en: 'What he wrote by hand for his readers: dedications in their copies, signatures at signings, the notes in his pocket, as their owners told of them; his books’ printed dedications; and, if you have a dedication from him, a way to send it.' }
	},

	/* the band: the ruled sheet, a pen writing a dedication across it and signing it (page-handwriting.css); it leads to the form */
	band: function (d, A) {
		var e = A.esc;
		return '<a class="hw-page" href="#send" aria-label="' + e(A.L('أرسل إهداءك', 'Send your dedication')) + '"><p class="hw-line"><span>' + e(A.L('إلى القارئ العزيز.. ابق حيًا حتى اللقاء القادم', 'To the dear reader.. stay alive till we meet again')) + '</span></p>' +
			'<p class="hw-sign"><span>' + e(A.L('أحمد خالد توفيق', 'Ahmed Khaled Tawfik')) + '</span></p></a>';
	},

	render: function () {
		var A = window.App;
		document.getElementById('content').innerHTML = this.hand();
		this.wire();
		setTimeout(function () { var ph = document.querySelector('.ph[data-ph="handwriting"]'); if (ph) ph.removeAttribute('aria-hidden'); }, 0); /* (its sheet is a link) */
		A.focusHash();
	},

	/* the kinds of thing in his hand */
	KIND: { dedication: { ar: 'إهداء', en: 'Dedication' }, signature: { ar: 'توقيع', en: 'Signature' }, note: { ar: 'قصاصة', en: 'Note' }, letter: { ar: 'رسالة', en: 'Letter' }, manuscript: { ar: 'مخطوط', en: 'Manuscript' } },

	/* what he wrote by hand for his readers, as they and reporters told of it, linked where it was published;
	   then his books' printed dedications, and the call and form for a dedication of one's own */
	hand: function () {
		var App = window.App, e = App.esc, t = App.t, L = App.L, self = this, list = App.data().handwriting || [];
		/* (the page's title and lead say what it is) */
		return '<section class="section hw" id="hand"><div class="wrap">' +
			'<div class="hw-list">' + list.map(function (x) {
				return '<article class="hw-card"><p class="hw-kind">' + e(t(self.KIND[x.kind] || { ar: x.kind, en: x.kind })) + (x.year ? ' · ' + e(App.num(x.year)) : '') + '</p>' +
					'<h3>' + e(t(x.title)) + '</h3><p>' + e(t(x.text)) + '</p>' +
					'<a class="hw-src" href="' + e(x.url) + '" target="_blank" rel="noopener">' + e(t(x.outlet || { ar: 'المصدر', en: 'Source' })) + ' ↗</a></article>';
			}).join('') + '</div>' +
			this.dedications() +
			'<aside class="hw-call"><h2>' + e(L('هل عندك إهداء منه؟', 'Do you have a dedication from him?')) + '</h2>' +
				'<p>' + e(L('قلّما نُشر خطه: لم نجد بعد مخطوطًا أو رسالة بخطه في مكان عام. إن كتب لك إهداءً على نسختك، أو عندك ورقة بخطه، فصوّرها وأرسلها، واكتب سطرًا عن اليوم؛ تُنشر هنا باسمك إن أردت.', 'His hand was seldom published: we have yet to find a manuscript or a letter of his shown anywhere public. If he wrote a dedication in your copy, or you have a page in his hand, photograph it and send it with a line about the day; it goes up here, under your name if you wish.')) + '</p>' +
				this.form() +
			'</aside>' +
		'</div></section>';
	},

	/* «إهداءات كتبه» (#dedications): the printed dedication at the front of his books and issues — to whom, its words where a
	   source gives them, and what it tells (AKT.dedications, data-pages.js) */
	dedications: function () {
		var App = window.App, S = window.WorksShared, e = App.esc, t = App.t, L = App.L, list = App.data().dedications || [];
		if (!list.length || !S) return '';
		return '<section class="hw-ded" id="dedications"><h2>' + e(L('إهداءات كتبه', 'His books’ dedications')) + ' <small>' + e(App.num(list.length)) + '</small></h2>' +
			'<p class="hw-ded-lead">' + e(L('وفي أول صفحة من بعض كتبه إهداء مطبوع: لمن أهدى الكتاب، وبماذا، كما نقلته المصادر. أكثر كتبه وأعداده بلا إهداء.', 'And on the first page of some of his books, a printed dedication: to whom he gave the book, and in what words, as the sources quote it. Most of his books and issues have none.')) + '</p>' +
			'<div class="hw-ded-list">' + list.map(function (x) {
				var r = S.resolveBook(x.book);
				if (!r) return '';
				var title = r.series ? t(r.series.s.title) + ' ' + App.num(r.item.n) + ': ' + t(r.item.title) : t(r.item.title);
				var img = r.series ? S.issueCover(r.series.s.id, r.item) : S.coverOf(r.info), href = r.series ? 'book.html?id=' + x.book : App.workHref(x.book);
				return '<article class="hw-ded-card"><a class="hw-ded-cv" href="' + e(href) + '">' + S.miniCover({ img: img, color: '#3a2a1f', title: t(r.item.title) }) + '</a><div>' +
					'<h3><a href="' + e(href) + '">' + e(title) + '</a></h3><p class="hw-ded-to">' + e(L('إلى ', 'To ')) + e(t(x.to)) + '</p>' +
					(x.text ? '<blockquote dir="rtl" lang="ar">' + e(x.text) + '</blockquote>' : '') +
					(x.note ? '<p class="hw-ded-note">' + e(t(x.note)) + '</p>' : '') +
					(x.src || []).map(function (u, i) { return '<a class="hw-src" href="' + e(u) + '" target="_blank" rel="noopener">' + e(L('المصدر', 'Source') + ((x.src || []).length > 1 ? ' ' + App.num(i + 1) : '') + ' ↗') + '</a>'; }).join(' ') +
				'</div></article>';
			}).join('') + '</div></section>';
	},

	/* the form, after Muhammed Erdem's «Credit Card Form» on CodePen (made there with Vue; here in plain script): above the boxes, a
	   card that fills in as you write — not a bank card but the dedication itself, a book's first page over its cover: the book's
	   name where the card's number would be, «إلى» and your name where its holder's, when and where for its date, and what you
	   have (a dedication, a signature…) where its make. A frame glides to the part of the card the box you are in fills; the
	   words slide in as they are written; and for the story of the day the card turns over to its back, where the story is
	   written above his signature */
	form: function () {
		var App = window.App, e = App.esc, t = App.t, L = App.L, self = this;
		var nib = '<svg class="dc-nib" viewBox="0 0 40 40" aria-hidden="true"><path d="M20 3 31 17 24 37h-8L9 17Z"/><path class="cut" d="M20 14v12"/><circle class="cut" cx="20" cy="13" r="2.4"/></svg>';
		return '<div class="hw-form-wrap">' +
			'<div class="dc" aria-hidden="true"><div class="dc-card">' +
				'<div class="dc-side dc-front"><div class="dc-cover"></div><div class="dc-focus"></div>' +
					'<div class="dc-top">' + nib + '<span class="dc-kind" data-for="kind"><b>' + e(t(self.KIND.dedication)) + '</b></span></div>' +
					'<p class="dc-book" data-for="book"><span class="dc-ph">' + e(L('اسم الكتاب أو العدد', 'The book or issue')) + '</span></p>' +
					'<div class="dc-foot"><p class="dc-to" data-for="name"><small>' + e(L('إلى', 'To')) + '</small><span class="dc-val"><span class="dc-ph">' + e(L('اسمك', 'Your name')) + '</span></span></p>' +
						'<p class="dc-when" data-for="when"><small>' + e(L('متى وأين', 'When & where')) + '</small><span class="dc-val"><span class="dc-ph">—</span></span></p></div></div>' +
				'<div class="dc-side dc-back"><div class="dc-cover"></div><div class="dc-band"></div>' +
					'<div class="dc-story"><small>' + e(L('حكاية اليوم', 'The story of that day')) + '</small><p class="dc-story-t"><span class="dc-ph">…</span></p></div>' +
					'<p class="dc-sign">' + e(L('أحمد خالد توفيق', 'Ahmed Khaled Tawfik')) + '</p></div>' +
			'</div></div>' +
			'<form class="hw-form" id="send">' +
				'<label class="hw-wide">' + e(L('الكتاب أو العدد', 'The book or issue')) + '<input name="book" autocomplete="off" placeholder="' + e(L('مثال: يوتوبيا، أو ما وراء الطبيعة ٣٣', 'e.g. Utopia, or Paranormal 33')) + '"></label>' +
				'<label>' + e(L('اسمك كما تحب أن يظهر', 'Your name as you’d like it shown')) + '<input name="name" autocomplete="off" placeholder="' + e(L('اتركه فارغًا إن لم ترد ذكره', 'Leave it empty to stay unnamed')) + '"></label>' +
				'<label>' + e(L('ما الذي عندك؟', 'What do you have?')) + '<select name="kind">' + ['dedication', 'signature', 'note', 'letter'].map(function (k) { return '<option value="' + k + '">' + e(t(self.KIND[k])) + '</option>'; }).join('') + '</select></label>' +
				'<label class="hw-wide">' + e(L('متى وأين؟', 'When and where?')) + '<input name="when" autocomplete="off" placeholder="' + e(L('مثال: معرض القاهرة للكتاب، يناير 2014', 'e.g. Cairo Book Fair, January 2014')) + '"></label>' +
				'<label class="hw-wide">' + e(L('حكاية اليوم', 'The story of that day')) + '<textarea name="story" rows="4"></textarea></label>' +
				'<label class="hw-wide hw-check"><input type="checkbox" name="credit" checked> ' + e(L('اذكروا اسمي مع الصورة', 'Show my name with it')) + '</label>' +
				'<p class="hw-wide hw-how">' + e(L('اختر طريقة الإرسال، ثم أرفق صور الإهداء هناك: على GitHub اسحب الصور إلى خانة «الصور»، وفي البريد أرفقها بالرسالة.', 'Pick how to send it, then attach the photos there: on GitHub drag them into the «Photos» box; by email, attach them to the message.')) + '</p>' +
				'<p class="hw-wide hw-acts"><button type="submit" class="buy-btn" value="github">' + e(L('أرسل عبر GitHub ↗', 'Send on GitHub ↗')) + '</button>' +
				'<button type="submit" class="share-btn" value="mail">' + e(L('أرسل بالبريد', 'Send by email')) + '</button></p>' +
			'</form></div>';
	},

	/* the card at work, and the sending */
	wire: function () {
		var App = window.App, d = App.data(), S = window.WorksShared, t = App.t, L = App.L, e = App.esc, self = this;
		var form = document.getElementById('send'), card = document.querySelector('.dc'), focus = card.querySelector('.dc-focus');
		/* the card's picture: the cover of the book named, if it is one of his best known, or else one of them in turn */
		var COVERS = [['ما وراء|رفعت|paranormal', S && S.seriesCover('mwt')], ['فانتازيا|fantasia', S && S.seriesCover('fantasia')], ['سافاري|safari', S && S.seriesCover('safari')],
			['يوتوبيا|utopia', S && S.coverOf((d.bookInfo || {}).utopia)]].filter(function (c) { return c[1]; });
		var setCover = function (src) { [].forEach.call(card.querySelectorAll('.dc-cover'), function (c) { c.style.backgroundImage = 'url("' + new URL(src, document.baseURI).href + '")'; }); };
		var base = COVERS.length ? COVERS[Math.floor(Math.random() * COVERS.length)][1] : '';
		if (base) setCover(base);
		/* a value onto the card: its words, the new ones sliding in (words, not letters: Arabic letters held apart would lose their joins) */
		var shown = {};
		var put = function (key, el, ph) {
			var v = (form.elements[key].value || '').replace(/\s+/g, ' ').trim(), old = shown[key] || '';
			if (v === old) return;
			var ow = old ? old.split(' ') : [], nw = v ? v.split(' ') : [], same = 0;
			while (same < ow.length && same < nw.length && ow[same] === nw[same]) same++;
			el.innerHTML = v ? nw.map(function (w, i) { return '<span class="dc-w' + (i >= same ? ' is-new' : '') + '">' + e(w) + '</span>'; }).join(' ') : '<span class="dc-ph is-new">' + e(ph) + '</span>';
			shown[key] = v;
		};
		var PH = { book: L('اسم الكتاب أو العدد', 'The book or issue'), name: L('اسمك', 'Your name'), when: '—', story: '…' };
		var target = { book: card.querySelector('.dc-book'), name: card.querySelector('.dc-to .dc-val'), when: card.querySelector('.dc-when .dc-val'), story: card.querySelector('.dc-story-t') };
		var update = function (key) {
			if (key === 'kind') {
				var k = card.querySelector('.dc-kind');
				k.innerHTML = '<b class="is-new">' + e(t(self.KIND[form.elements.kind.value])) + '</b>';
				return;
			}
			if (!target[key]) return;
			put(key, target[key], PH[key]);
			if (key === 'book') {
				var v = form.elements.book.value.toLowerCase(), hit = COVERS.filter(function (c) { return new RegExp(c[0]).test(v); })[0];
				setCover(hit ? hit[1] : base);
			}
		};
		/* the frame over the part of the card the box fills; on the story, the card turns over */
		var place = function (key) {
			var el = key && card.querySelector('.dc-front [data-for="' + key + '"]');
			card.classList.toggle('is-back', key === 'story');
			if (!el) { focus.classList.remove('is-on'); return; }
			var front = card.querySelector('.dc-front').getBoundingClientRect(), r = el.getBoundingClientRect();
			focus.style.width = r.width + 'px'; focus.style.height = r.height + 'px';
			focus.style.transform = 'translate(' + (r.left - front.left) + 'px,' + (r.top - front.top) + 'px)';
			focus.classList.add('is-on');
		};
		[].forEach.call(form.elements, function (el) {
			if (!el.name || el.type === 'checkbox' || el.type === 'submit') return;
			el.addEventListener('input', function () { update(el.name); place(el.name); });
			el.addEventListener('change', function () { update(el.name); });
			el.addEventListener('focus', function () { place(el.name); });
			el.addEventListener('blur', function () { setTimeout(function () { if (!form.contains(document.activeElement) || !document.activeElement.name) place(null); }, 0); });
		});
		form.addEventListener('submit', function (ev) {
			ev.preventDefault();
			var f = form.elements, v = function (n) { return f[n].value.trim(); }, kind = t(self.KIND[v('kind')]), how = ev.submitter ? ev.submitter.value : 'github';
			var title = L('بخط يده: ', 'In his hand: ') + kind + (v('book') ? ' — ' + v('book') : '');
			if (how === 'mail') {
				var body = [L('الاسم: ', 'Name: ') + (v('name') || '—'), L('النوع: ', 'Kind: ') + kind, L('الكتاب أو العدد: ', 'Book or issue: ') + (v('book') || '—'), L('متى وأين: ', 'When and where: ') + (v('when') || '—'),
					L('الحكاية: ', 'The story: ') + (v('story') || '—'), L('ذكر الاسم: ', 'Name shown: ') + (f.credit.checked ? L('نعم', 'yes') : L('لا', 'no')), '', L('(أرفق الصور بهذه الرسالة)', '(attach the photos to this message)')].join('\n');
				location.href = 'mailto:' + self.EMAIL + '?subject=' + encodeURIComponent(title) + '&body=' + encodeURIComponent(body);
				return;
			}
			/* GitHub's issue form (.github/ISSUE_TEMPLATE/handwriting.yml), its boxes filled from this one; the photos are dropped in there */
			var q = { template: 'handwriting.yml', title: title, name: v('name'), book: v('book'), when: v('when'), story: v('story') };
			window.open(self.REPO + '/issues/new?' + Object.keys(q).filter(function (k) { return q[k]; }).map(function (k) { return k + '=' + encodeURIComponent(q[k]); }).join('&'), '_blank', 'noopener');
		});
	},
	REPO: 'https://github.com/SamehBilal/ahmed-khaled-tawfik',
	EMAIL: 'sameh.bilal@outlook.com'
};

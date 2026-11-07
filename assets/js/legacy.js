window.PAGE = {
	id: 'legacy',
	title: { ar: 'الإرث', en: 'Legacy' },
	strings: {
		eyebrow: { ar: 'ما بعد 2 أبريل 2018', en: 'After 2 April 2018' },
		title: { ar: 'الإرث', en: 'The Legacy' },
		lead: {
			ar: 'رحل العرّاب، وبقي جيلٌ تعلّم القراءة على يديه. هنا الوداع والتكريم، يومًا بيوم.',
			en: 'The Godfather is gone, but a generation that learned to read through him remains. Here are the farewell and the tributes, as they came.'
		}
	},

	render: function () {
		var App = window.App, d = App.data(), e = App.esc, tx = App.tx, L = App.L;
		/* an old link to one of the interviews that were listed here (#m-<n>) goes to it on «لقاءاته» */
		var old = /^#m-(\d+)$/.exec(location.hash), om = old && (d.media || [])[+old[1]];
		if (om) { var oy = this.youtubeId(om.url); location.replace('interviews.html#' + (oy ? 'v-' + oy : 'm-' + old[1])); return; }
		var legacy = d.legacy || [], media = d.media || [];
		var fmtDate = function (s) {
			if (!s) return '';
			var p = String(s).split('-');
			var months = App.lang === 'ar'
				? ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر']
				: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
			if (p.length === 3) return App.num(+p[2]) + ' ' + months[+p[1] - 1] + ' ' + App.num(p[0]);
			if (p.length === 2) return months[+p[1] - 1] + ' ' + App.num(p[0]);
			return App.num(p[0]);
		};

		var self = this;
		var html = '';
		if (legacy.length) {
			html += '<section class="section tlx-section"><div class="tlx" id="tlx">' +
				'<div class="tlx-bg" aria-hidden="true">' + legacy.map(function (l) {
					var im = self.image(l.photo || l.image, true);
					return '<img src="' + e(im.src) + '" alt="" loading="lazy" referrerpolicy="no-referrer">';
				}).join('') + '</div>' +
				'<div class="wrap">' +
				'<div class="section-head"><div><h2>' + L('الوداع والتكريم', 'Farewell & tributes') + '</h2>' +
					'<p>' + L('مرّر لأسفل لتتبّع ما جرى بعد الرحيل.', 'Scroll down to follow what came after.') + '</p></div></div>' +
				'<ol class="tlx-list">' + legacy.map(function (l, i) {
					/* its picture opens full size, as on the home timeline; its video (the picture itself, or beside a photo) plays here */
					var vid = self.image(l.image, false), im = l.photo ? self.image(l.photo, false) : vid, title = App.t(l.title);
					var pic = '<img src="' + e(im.src) + '" alt="' + e(title) + '" loading="lazy" referrerpolicy="no-referrer">';
					var mi = vid.yt ? media.findIndex(function (m) { return self.youtubeId(m.url) === vid.yt; }) : -1;
					var big = im.yt ? 'https://i.ytimg.com/vi/' + im.yt + '/hqdefault.jpg' : im.src;
					return '<li class="tlx-item" id="l-' + i + '" data-text="' + e(fmtDate(l.date)) + '"><div class="tlx-content">' +
						(!im.src ? '' : (im.yt && mi >= 0)
							? '<button type="button" class="tlx-media" data-yt="' + e(im.yt) + '" data-i="' + mi + '" aria-label="' + e(L('شاهد: ', 'Watch: ') + App.t(media[mi].title)) + '">' + pic + '</button>'
							: '<button type="button" class="tlx-media tlx-pic' + (im.tall ? ' tall' : '') + '" data-src="' + e(big) + '" data-alt="' + e(title) + '" aria-label="' + e(L('تكبير الصورة: ', 'Enlarge the picture: ') + title) + '">' + pic + '</button>') +
						/* the year under the picture, its foot on the picture's bottom edge, as in the CodePen this follows */
						'<div class="tlx-yr' + (im.src ? ' on-pic' : '') + '">' + e(App.num(String(l.date).slice(0, 4))) + '</div>' +
						'<h3>' + tx(l.title) + '</h3><p>' + tx(l.text) + '</p>' +
						(l.photo && mi >= 0 ? '<button type="button" class="tlx-watch" data-yt="' + e(vid.yt) + '" data-i="' + mi + '">▶ ' + L('شاهد', 'Watch') + '</button> ' : '') +
						(l.source ? '<a class="src" href="' + e(l.source) + '" target="_blank" rel="noopener">' + L('المصدر ↗', 'Source ↗') + '</a>' : '') +
					'</div></li>';
				}).join('') + '</ol>' +
			'</div></div></section>';
		}

		/* (the adaptations on screen are no longer shown here) */

		/* his interviews and talks, the films and the articles about him (AKT.media) are on their own page, «لقاءاته» (interviews.html);
		   the farewell above still plays the videos it names */
		html += '<section class="section"><div class="wrap"><p class="lg-more">' + L('لقاءاته ومحاضراته بصوته وصورته، والأفلام والمقالات التي كُتبت عنه، في ', 'His interviews and talks, in his own voice, and the films and articles about him, are in ') +
			'<a href="interviews.html">' + L('«لقاءاته» ←', 'His interviews →') + '</a></p></div></section>';

		if (!html) html = '<section class="section"><div class="wrap"><p class="empty-note">' + L('لم تُضف بيانات بعد.', 'Nothing added yet.') + '</p></div></section>';
		document.getElementById('content').innerHTML = html;
		var onPlay = function (ev) {
			var b = ev.target.closest('[data-yt]');
			if (b) self.play(media[+b.getAttribute('data-i')], b.getAttribute('data-yt'));
		};
		var tl = document.getElementById('tlx');
		if (tl) {
			tl.onclick = function (ev) {
				var p = ev.target.closest('.tlx-pic');
				if (p) App.showPic(p.getAttribute('data-src'), p.getAttribute('data-alt'));
				else onPlay(ev);
			};
			this.focusTimeline(tl);
		}
		this.voice();
		App.focusHash();
	},

	/* his voice reading one of his best-known lines (AKT.legacyVoice: the file and its words), started by the first scroll.
	   Browsers let a page make sound only after a click, tap or key, so if the scroll is refused it starts on the first of those.
	   A small key pauses and replays it; if the file is missing the key never shows. */
	voice: function () {
		var App = window.App, d = App.data(), L = App.L, e = App.esc;
		var v = d.legacyVoice;
		if (!v || !v.src || this._voice) return;
		var a = new Audio(v.src), started = false, self = this;
		a.preload = 'auto';
		var box = document.createElement('div');
		box.className = 'lv';
		box.hidden = true;
		box.innerHTML = '<button type="button" class="lv-key" aria-pressed="false"><span class="lv-ic" aria-hidden="true"></span></button>' +
			'<span class="lv-q"><span class="lv-lines"><span class="lv-line lv-idle is-in">' + e(App.t(v.quote || (d.bio || {}).motto || {})) + '</span>' +
			(v.lines || []).map(function (ln) {
				return '<span class="lv-line">' + e(L(ln[1], ln[2])).replace(/\{([^}]+)\}/g, '<span class="lv-em">$1</span>') + '</span>';
			}).join('') + '</span>' +
			(v.source ? '<small class="lv-src">— ' + e(App.t(v.source)) + '</small>' : '') + '</span>';
		document.body.appendChild(box);
		this._voice = box;
		var key = box.querySelector('.lv-key');
		/* the words follow the voice, like the intro's quote: each line rises in and drifts up as the next arrives, and the last one stays */
		var lines = [].slice.call(box.querySelectorAll('.lv-line')), times = [-1].concat((v.lines || []).map(function (ln) { return ln[0]; })), shownAt = 0, raf = 0;
		var sync = function () {
			var k = 0;
			if (a.currentTime > 0 || !a.paused) for (var j = 1; j < times.length; j++) if (a.currentTime >= times[j]) k = j;
			if (k === 0 && !a.paused) k = -1;
			if (k !== shownAt) {
				lines.forEach(function (el, j) { var was = el.classList.contains('is-in'); el.classList.toggle('is-in', j === k); el.classList.toggle('is-out', j !== k && was); });
				shownAt = k;
				box.classList.toggle('lv-last', k === lines.length - 1 && k > 0);
			}
			raf = !a.paused ? requestAnimationFrame(sync) : 0;
		};
		if (times.length > 1) {
			a.addEventListener('play', function () { if (!raf) raf = requestAnimationFrame(sync); });
			['pause', 'seeked'].forEach(function (t) { a.addEventListener(t, sync); });
			/* at the end the last line stays */
			a.addEventListener('ended', function () { cancelAnimationFrame(raf); raf = 0; });
		}
		var mark = function () {
			var on = !a.paused;
			box.classList.toggle('on', on);
			key.setAttribute('aria-pressed', String(on));
			key.setAttribute('aria-label', on ? L('أوقف صوته', 'Pause his voice') : L('استمع إلى صوته', 'Play his voice'));
		};
		a.addEventListener('canplay', function () { box.hidden = false; }, { once: true });
		a.addEventListener('error', function () { box.remove(); self._voice = null; });
		['play', 'pause', 'ended'].forEach(function (t) { a.addEventListener(t, mark); });
		key.onclick = function () { started = true; off(); if (a.paused) { if (a.ended) a.currentTime = 0; a.play().catch(function () {}); } else a.pause(); };
		var start = function () {
			if (started) return off();
			var p = a.play();
			if (p && p.then) p.then(function () { started = true; off(); }, function () { /* refused: wait for a click, tap or key */ });
		};
		var events = ['scroll', 'pointerdown', 'keydown', 'touchend'];
		var off = function () { events.forEach(function (t) { window.removeEventListener(t, start, true); }); };
		events.forEach(function (t) { window.addEventListener(t, start, { capture: true, passive: true }); });
		mark();
	},

	/* an event's picture: "portrait", "yt:<id>" (a video thumbnail), "cover:<book id>" or a path.
	   Backdrops use the larger YouTube frame; cards use the 16:9 one, which has no letterbox bars. */
	image: function (spec, big) {
		spec = spec || '';
		if (spec === 'portrait') return { src: 'assets/img/photos/youm7-e94d8bd9a946.jpg' };
		if (spec.indexOf('yt:') === 0) {
			var id = spec.slice(3);
			return { src: 'https://i.ytimg.com/vi/' + id + (big ? '/hqdefault.jpg' : '/mqdefault.jpg'), yt: id };
		}
		if (spec.indexOf('cover:') === 0) {
			return { src: window.WorksShared.coverOf((window.App.data().bookInfo || {})[spec.slice(6)] || {}), tall: true };
		}
		/* posters and book covers stand upright */
		return { src: spec, tall: /\/(posters|covers)\//.test(spec) };
	},

	/* the event nearest the middle of the screen is in focus and lends the section its backdrop */
	focusTimeline: function (root) {
		if (this._onScroll) { window.removeEventListener('scroll', this._onScroll); window.removeEventListener('resize', this._onScroll); }
		var items = [].slice.call(root.querySelectorAll('.tlx-item'));
		var bgs = [].slice.call(root.querySelectorAll('.tlx-bg img'));
		var current = -1, queued = false;
		var update = function () {
			queued = false;
			if (!root.isConnected) return;
			var mid = window.innerHeight * 0.55, pick = 0;
			items.forEach(function (it, i) { if (it.getBoundingClientRect().top < mid) pick = i; });
			if (pick === current) return;
			if (current >= 0) { items[current].classList.remove('active'); bgs[current].classList.remove('on'); }
			current = pick;
			items[pick].classList.add('active');
			var bg = bgs[pick];
			bg.loading = 'eager';
			bg.classList.add('on');
			/* warm the next backdrop so it is ready when its event arrives */
			if (bgs[pick + 1]) bgs[pick + 1].loading = 'eager';
		};
		this._onScroll = function () { if (!queued) { queued = true; requestAnimationFrame(update); } };
		window.addEventListener('scroll', this._onScroll, { passive: true });
		window.addEventListener('resize', this._onScroll);
		update();
	},

	/* YouTube id from watch / youtu.be / embed / shorts links */
	youtubeId: function (url) {
		var m = /(?:youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{11})/.exec(url || '');
		return m ? m[1] : '';
	},

	/* pop-up player; the iframe is created on open and removed on close so the video stops */
	play: function (m, id) {
		var App = window.App, e = App.esc, L = App.L;
		var dlg = document.getElementById('video-dialog');
		if (!dlg) {
			dlg = document.createElement('dialog');
			dlg.id = 'video-dialog';
			dlg.className = 'video-dialog';
			document.body.appendChild(dlg);
			dlg.addEventListener('click', function (ev) { if (ev.target === dlg) dlg.close(); });
			dlg.addEventListener('close', function () { dlg.innerHTML = ''; });
		}
		dlg.innerHTML =
			'<div class="frame"><iframe src="https://www.youtube-nocookie.com/embed/' + e(id) + '?autoplay=1&rel=0" title="' + e(App.t(m.title)) + '" ' +
				'allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen referrerpolicy="strict-origin-when-cross-origin"></iframe></div>' +
			'<div class="bar"><span class="ttl">' + App.tx(m.title) + '</span>' +
				'<a href="' + e(m.url) + '" target="_blank" rel="noopener">YouTube ↗</a>' +
				'<button type="button">' + L('إغلاق', 'Close') + '</button></div>';
		dlg.querySelector('.bar button').onclick = function () { dlg.close(); };
		dlg.showModal();
	}
};

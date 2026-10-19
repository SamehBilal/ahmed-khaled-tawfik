/* Cassette player — a vanilla rebuild of Codrops' "Old School Cassette Player".
   The tracks are Audiohat episodes and YouTube radio-drama episodes (Safari: Tasgeel channel).
   ▶ / ❚❚  plays the episode's sample inside the cassette when we have one (track.sample: a file in
           assets/audio/ or a permanent URL, added in data-audio.js). Audiohat's own sample links
           expire daily and can't be fetched from another site, so without a sample ▶ falls back
           to opening the episode on Audiohat.
   YouTube episodes (track.yt) play in a visible YouTube player that opens under the cassette, as
   YouTube's terms require; when the uploader has switched embedding off, ▶ opens YouTube instead.
   ◀◀ / ▶▶ wind the tape to the previous / next episode; ■ stops; the last key always opens the source page.

   Cassette.mount(el, { tracks: [{ title, sub, url, mins, sample }], index }) -> { load(i) } */
(function () {
	'use strict';

	var W = 586, H = 379;
	var SOUND = {};
	function sound(name) {
		try {
			var a = SOUND[name] || (SOUND[name] = new Audio('assets/audio/' + name + '.mp3'));
			a.currentTime = 0;
			a.volume = name === 'click' ? 0.7 : 0.35;
			var p = a.play();
			if (p && p.catch) p.catch(function () {});
			return a;
		} catch (e) { return null; }
	}

	var ICON = {
		rew: 'M11 6v12L2.5 12zM21 6v12l-8.5-6z',
		play: 'M7 5v14l12-7z',
		pause: 'M6 5h4v14H6zM14 5h4v14h-4z',
		ff: 'M13 6v12l8.5-6zM3 6v12l8.5-6z',
		stop: 'M6 6h12v12H6z',
		out: 'M14 4h6v6h-2V7.4l-7.3 7.3-1.4-1.4L16.6 6H14zM5 6h6v2H6v10h10v-5h2v7H4V6z'
	};
	function svg(name) { return '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="' + ICON[name] + '" fill="currentColor"/></svg>'; }

	/* YouTube IFrame API, loaded once and only when a cassette has YouTube tracks */
	var ytWaiting = [];
	function loadYT() {
		if (window.YT && window.YT.Player) return;
		if (document.getElementById('yt-iframe-api')) return;
		var prev = window.onYouTubeIframeAPIReady;
		window.onYouTubeIframeAPIReady = function () {
			if (prev) prev();
			var q = ytWaiting; ytWaiting = [];
			q.forEach(function (f) { f(); });
		};
		var sc = document.createElement('script');
		sc.id = 'yt-iframe-api'; sc.src = 'https://www.youtube.com/iframe_api'; sc.async = true;
		document.head.appendChild(sc);
	}
	function whenYT(f) {
		if (window.YT && window.YT.Player) f(); else { ytWaiting.push(f); loadYT(); }
	}

	function clock(sec) {
		sec = Math.max(0, Math.floor(sec || 0));
		var m = Math.floor(sec / 60), s = sec % 60;
		return window.App.num(m + ':' + (s < 10 ? '0' : '') + s);
	}

	function mount(el, opts) {
		var App = window.App, e = App.esc, L = App.L;
		var tracks = opts.tracks || [];
		var i = Math.max(0, Math.min(tracks.length - 1, opts.index || 0));
		var windTimer = 0;
		var audio = new Audio();
		audio.preload = 'none';

		el.classList.add('cassette');
		el.innerHTML =
			'<div class="cs-stage"><div class="cs-tape">' +
				'<div class="cs-back"><div class="cs-wheel cs-l"><div></div></div><div class="cs-wheel cs-r"><div></div></div></div>' +
				'<div class="cs-front"></div>' +
				'<div class="cs-label" dir="rtl"><span class="cs-t"></span><span class="cs-s"></span></div>' +
				'<span class="cs-side">' + L('أ', 'A') + '</span>' +
			'</div></div>' +
			'<ul class="cs-controls" role="toolbar" aria-label="' + L('أزرار المسجل', 'Tape deck') + '">' +
				'<li><button type="button" data-act="rew" aria-label="' + L('الحلقة السابقة', 'Previous episode') + '"><span class="ic">' + svg('rew') + '</span></button></li>' +
				'<li class="cs-play"><button type="button" data-act="play"><span class="ic">' + svg('play') + '</span><span class="lb"></span></button></li>' +
				'<li><button type="button" data-act="ff" aria-label="' + L('الحلقة التالية', 'Next episode') + '"><span class="ic">' + svg('ff') + '</span></button></li>' +
				'<li><button type="button" data-act="stop" aria-label="' + L('إيقاف', 'Stop') + '"><span class="ic">' + svg('stop') + '</span></button></li>' +
				'<li class="cs-out"><a role="button" data-act="out" target="_blank" rel="noopener"><span class="ic">' + svg('out') + '</span><span class="lb">Audiohat</span></a></li>' +
			'</ul>' +
			'<div class="cs-progress" aria-hidden="true"><span></span></div>' +
			'<div class="cs-video" hidden><div class="cs-yt"></div></div>' +
			'<p class="cs-meta"><span class="cs-count"></span> · <span class="cs-dur"></span>' +
				'<span class="cs-note"></span></p>';

		var stage = el.querySelector('.cs-stage'), tape = el.querySelector('.cs-tape');
		var playBtn = el.querySelector('[data-act="play"]'), outBtn = el.querySelector('[data-act="out"]');
		var bar = el.querySelector('.cs-progress span');
		var vbox = el.querySelector('.cs-video'), yt = null, ytPoll = 0;
		var isYT = function (tr) { return !!(tr && tr.yt); };
		if (tracks.some(isYT)) loadYT();

		function fit() {
			var k = Math.min(1, (el.clientWidth || W) / W);
			tape.style.transform = 'scale(' + k + ')';
			stage.style.height = Math.round(H * k) + 'px';
		}

		function state(s) {
			el.classList.remove('is-playing', 'is-ff', 'is-rew');
			if (s) el.classList.add(s);
			el.querySelectorAll('.cs-controls li').forEach(function (li) { li.classList.remove('on'); });
			var map = { 'is-playing': 'play', 'is-ff': 'ff', 'is-rew': 'rew' };
			if (map[s]) el.querySelector('[data-act="' + map[s] + '"]').parentNode.classList.add('on');
		}

		function setPlayIcon(playing) {
			var tr = tracks[i] || {};
			playBtn.querySelector('.ic').innerHTML = svg(playing ? 'pause' : 'play');
			var inDeck = tr.sample || (tr.yt && tr.ytEmbed);
			playBtn.querySelector('.lb').textContent = inDeck
				? (playing ? L('إيقاف مؤقت', 'Pause') : (tr.yt ? L('تشغيل', 'Play') : L('تشغيل العيّنة', 'Play sample')))
				: (tr.yt ? L('شاهد على YouTube', 'Watch on YouTube') : L('استمع على Audiohat', 'Listen on Audiohat'));
			playBtn.setAttribute('aria-label', (inDeck ? (playing ? L('إيقاف مؤقت لـ «', 'Pause “') : L('تشغيل عيّنة «', 'Play the sample of “')) : L('استمع إلى «', 'Listen to “')) +
				(tr.title || '') + (inDeck ? L('»', '”') : (tr.yt ? L('» على YouTube', '” on YouTube') : L('» على Audiohat', '” on Audiohat'))));
		}

		function render() {
			var tr = tracks[i] || {};
			el.querySelector('.cs-t').textContent = tr.title || '';
			el.querySelector('.cs-s').textContent = tr.sub || '';
			el.querySelector('.cs-count').textContent = L(App.num(i + 1) + ' من ' + App.num(tracks.length), (i + 1) + ' / ' + tracks.length);
			el.querySelector('.cs-dur').textContent = tr.mins ? App.num(tr.mins) + ' ' + L('دقيقة', 'min') : L('مدة غير معروفة', 'length unknown');
			el.querySelector('.cs-note').textContent = tr.yt
				? (tr.ytEmbed ? L('من قناة «' + (tr.channel || 'YouTube') + '» على YouTube — يظهر المشغّل تحت الشريط', 'From the “' + (tr.channel || 'YouTube') + '” channel on YouTube — the player opens under the tape')
					: L('صاحب الفيديو لا يسمح بتشغيله خارج YouTube، فالتشغيل يفتحه هناك', 'The uploader does not allow playing it outside YouTube, so play opens it there'))
				: tr.sample
				? L('عيّنة قصيرة — الحلقة كاملة على Audiohat', 'A short sample — the full episode is on Audiohat')
				: L('لا توجد عيّنة محفوظة هنا بعد، فالتشغيل يفتح Audiohat في نافذة جديدة', 'No sample saved here yet, so play opens Audiohat in a new tab');
			el.classList.toggle('has-sample', !!(tr.sample || (tr.yt && tr.ytEmbed)));
			outBtn.querySelector('.lb').textContent = tr.yt ? 'YouTube' : 'Audiohat';
			outBtn.href = tr.url || '#';
			outBtn.setAttribute('aria-label', L('افتح «', 'Open “') + (tr.title || '') + (tr.yt ? L('» على YouTube', '” on YouTube') : L('» على Audiohat', '” on Audiohat')));
			/* tape moves from the left reel to the right one as you go through the episodes */
			var p = tracks.length > 1 ? i / (tracks.length - 1) : 0;
			el.style.setProperty('--tl', Math.round(14 + 56 * (1 - p)) + 'px');
			el.style.setProperty('--tr', Math.round(14 + 56 * p) + 'px');
			el.querySelector('[data-act="rew"]').disabled = i === 0;
			el.querySelector('[data-act="ff"]').disabled = i >= tracks.length - 1;
			bar.style.width = '0%';
			setPlayIcon(false);
		}

		function stopAudio(rewind) {
			audio.pause();
			if (yt && yt.pauseVideo) { try { rewind ? yt.stopVideo() : yt.pauseVideo(); } catch (x) {} }
			if (rewind) { vbox.hidden = true; clearInterval(ytPoll); }
			if (rewind) { try { audio.currentTime = 0; } catch (x) {} }
		}

		function wind(dir) {
			var j = i + dir;
			if (j < 0 || j >= tracks.length) return;
			clearTimeout(windTimer);
			stopAudio(true);
			audio.removeAttribute('src');
			sound('click');
			var s = sound(dir > 0 ? 'fforward' : 'rewind');
			state(dir > 0 ? 'is-ff' : 'is-rew');
			windTimer = setTimeout(function () {
				if (s) s.pause();
				i = j; render(); state('');
			}, 700);
		}

		function play() {
			var tr = tracks[i];
			if (!tr) return;
			sound('click');
			if (tr.yt && tr.ytEmbed) { playYT(tr); return; }
			if (!tr.sample) {
				state('is-playing');
				/* opened synchronously in the click so pop-up blockers allow it */
				window.open(tr.url, '_blank', 'noopener');
				return;
			}
			if (!audio.paused) { audio.pause(); return; }
			if (audio.getAttribute('src') !== tr.sample) audio.src = tr.sample;
			var p = audio.play();
			if (p && p.catch) p.catch(function () {
				state('');
				el.querySelector('.cs-note').textContent = L('تعذّر التشغيل هنا — جرّب الزر الأخير لفتح المصدر', 'Could not play here — try the last key to open the source');
			});
		}

		/* ---------- YouTube ---------- */
		function note(ar, en) { el.querySelector('.cs-note').textContent = L(ar, en); }

		function playYT(tr) {
			/* YouTube refuses embeds on pages opened from disk (file://, "Error 153"): open it there instead */
			if (location.protocol === 'file:') {
				state('is-playing');
				window.open(tr.url, '_blank', 'noopener');
				note('مشغّل YouTube لا يعمل والصفحة مفتوحة كملف من الجهاز، ففتحناه على YouTube. على الموقع المنشور يعمل هنا تحت الشريط.',
					'The YouTube player does not work when the page is opened as a file from disk, so it opened on YouTube. On the published site it plays here, under the tape.');
				return;
			}
			vbox.hidden = false;
			note('جارٍ تشغيل YouTube… قد يبدأ بإعلان قصير قبل الحلقة.', 'Starting YouTube… it may play a short ad before the episode.');
			if (yt && yt.getVideoData) {
				var cur = (yt.getVideoData() || {}).video_id;
				if (cur === tr.yt) {
					var st = yt.getPlayerState();
					if (st === 1) yt.pauseVideo(); else yt.playVideo();
				} else yt.loadVideoById(tr.yt);
				return;
			}
			whenYT(function () {
				yt = new window.YT.Player(el.querySelector('.cs-yt'), {
					videoId: tr.yt, host: 'https://www.youtube-nocookie.com',
					playerVars: { autoplay: 1, playsinline: 1, rel: 0 },
					events: {
						onReady: function (ev) { ev.target.playVideo(); },
						onError: function () {
							state(''); setPlayIcon(false); clearInterval(ytPoll);
							note('تعذّر تشغيل الحلقة هنا — اضغط زر YouTube لمشاهدتها هناك.', 'The episode could not play here — press the YouTube key to watch it there.');
						},
						onStateChange: function (ev) {
							var st = ev.data;
							if (st === 1) { state('is-playing'); setPlayIcon(true); clearInterval(ytPoll); ytPoll = setInterval(tick, 500); var ch = (tracks[i] || {}).channel || 'YouTube'; note('من قناة «' + ch + '» على YouTube', 'From the “' + ch + '” channel on YouTube'); }
							else if (st === 2 || st === 0) { state(''); setPlayIcon(false); clearInterval(ytPoll); tick(); }
						}
					}
				});
			});
		}
		function tick() {
			if (!yt || !yt.getDuration) return;
			var d = yt.getDuration(), c = yt.getCurrentTime();
			if (!d) return;
			bar.style.width = (c / d * 100).toFixed(2) + '%';
			el.querySelector('.cs-dur').textContent = clock(c) + ' / ' + clock(d);
		}

		audio.addEventListener('playing', function () { state('is-playing'); setPlayIcon(true); });
		audio.addEventListener('pause', function () { if (!el.classList.contains('is-ff') && !el.classList.contains('is-rew')) state(''); setPlayIcon(false); });
		audio.addEventListener('ended', function () { state(''); setPlayIcon(false); bar.style.width = '100%'; });
		audio.addEventListener('timeupdate', function () {
			if (!audio.duration) return;
			bar.style.width = (audio.currentTime / audio.duration * 100).toFixed(2) + '%';
			el.querySelector('.cs-dur').textContent = clock(audio.currentTime) + ' / ' + clock(audio.duration);
		});

		el.querySelector('.cs-controls').addEventListener('click', function (ev) {
			var b = ev.target.closest('[data-act]');
			if (!b || b.disabled) return;
			var act = b.getAttribute('data-act');
			if (act === 'play') play();
			else if (act === 'stop') { clearTimeout(windTimer); sound('click'); stopAudio(true); state(''); bar.style.width = '0%'; render(); }
			else if (act === 'ff') wind(1);
			else if (act === 'rew') wind(-1);
			else if (act === 'out') { sound('click'); stopAudio(false); }
		});

		if (window.ResizeObserver) new ResizeObserver(fit).observe(el); else window.addEventListener('resize', fit);
		fit(); render();

		return {
			load: function (j, focus) {
				clearTimeout(windTimer); stopAudio(true); audio.removeAttribute('src');
				i = Math.max(0, Math.min(tracks.length - 1, j)); state(''); render();
				if (focus) playBtn.focus();
			},
			index: function () { return i; }
		};
	}

	/* Audiohat slug -> their page URL (parentheses stay literal, as on their site) */
	function pageUrl(A, slug) { return A.base + encodeURIComponent(slug).replace(/%28/g, '(').replace(/%29/g, ')'); }

	/* episodes of an issue (book.html id like "mwt-12") -> tracks.
	   data entries: [slug, minutes, sample?] */
	function issueTracks(key, issueTitle) {
		var A = (window.App.data().audio) || null;
		if (!A || !A.issues || !A.issues[key]) return [];
		var eps = A.issues[key], L = window.App.L;
		return eps.map(function (ep, k) {
			return {
				title: issueTitle,
				sub: eps.length > 1 ? L('الحلقة ', 'Episode ') + window.App.num(k + 1) + L(' من ', ' of ') + window.App.num(eps.length) : 'Audiohat',
				url: pageUrl(A, ep[0]),
				mins: ep[1],
				sample: ep[2] || ''
			};
		});
	}

	/* Safari radio-drama episodes on YouTube -> tracks. data entries: [videoId] or [videoId, 0] (no embedding) */
	function youtubeTracks(key, issueTitle) {
		var A = (window.App.data().audio) || null;
		var Y = A && A.youtube;
		if (!Y || !Y.issues || !Y.issues[key]) return [];
		var eps = Y.issues[key], L = window.App.L;
		var ch = (Y.channels && Y.channels[key]) || Y.channel || {};
		return eps.map(function (ep, k) {
			return {
				title: issueTitle,
				sub: ep[2] ? ep[2] : L('دراما إذاعية', 'Radio drama') + (eps.length > 1 ? ' · ' + L('الجزء ', 'Part ') + window.App.num(k + 1) : ''),
				channel: ch.name || 'YouTube',
				url: 'https://www.youtube.com/watch?v=' + ep[0],
				yt: ep[0], ytEmbed: ep[1] !== 0
			};
		});
	}

	window.Cassette = { mount: mount, issueTracks: function (key, title) { return issueTracks(key, title).concat(youtubeTracks(key, title)); }, youtubeTracks: youtubeTracks, pageUrl: pageUrl };
})();

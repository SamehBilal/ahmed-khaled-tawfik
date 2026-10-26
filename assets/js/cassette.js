/* Cassette player — a vanilla rebuild of Codrops' "Old School Cassette Player".
   The tracks are Audiohat episodes and YouTube radio-drama episodes (Safari: Tasgeel channel).
   The site plays no sound of its own: for an Audiohat episode the main key reads «استمع على Audiohat» and opens
   the episode's page there.
   YouTube episodes (track.yt) play in a visible YouTube player that opens under the cassette, as
   YouTube's terms require; when the uploader has switched embedding off, ▶ opens YouTube instead.
   ◀◀ / ▶▶ wind the tape to the previous / next episode; ■ stops; for YouTube the last key opens the video there.

   Cassette.mount(el, { tracks: [{ title, sub, url, mins }], index }) -> { load(i) } */
(function () {
	'use strict';

	var W = 586, H = 379;

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

		el.classList.add('cassette');
		el.innerHTML =
			'<div class="cs-stage"><div class="cs-tape">' +
				'<div class="cs-back"><div class="cs-wheel cs-l"><div></div></div><div class="cs-wheel cs-r"><div></div></div></div>' +
				'<div class="cs-front"></div>' +
				'<div class="cs-label" dir="rtl"><span class="cs-art" aria-hidden="true"><img alt="" referrerpolicy="no-referrer"></span><span class="cs-tx"><span class="cs-t"></span><span class="cs-s"></span></span></div>' +
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
			var inDeck = tr.yt && tr.ytEmbed, where = tr.provider || 'Audiohat';
			/* only a YouTube episode plays here; an Audiohat or Storytel one is listened to on its page there */
			playBtn.querySelector('.ic').innerHTML = svg(inDeck ? (playing ? 'pause' : 'play') : 'out');
			playBtn.querySelector('.lb').textContent = inDeck
				? (playing ? L('إيقاف مؤقت', 'Pause') : L('تشغيل', 'Play'))
				: (tr.yt ? L('شاهد على YouTube', 'Watch on YouTube') : L('استمع على ' + where, 'Listen on ' + where));
			playBtn.setAttribute('aria-label', (inDeck ? (playing ? L('إيقاف مؤقت لـ «', 'Pause “') : L('تشغيل «', 'Play “')) : L('استمع إلى «', 'Listen to “')) +
				(tr.title || '') + (inDeck ? L('»', '”') : (tr.yt ? L('» على YouTube', '” on YouTube') : L('» على ' + where, '” on ' + where))));
		}

		function render() {
			var tr = tracks[i] || {};
			el.querySelector('.cs-t').textContent = tr.title || '';
			/* the tape takes its series' colour, and the sticker carries the episode's picture:
			   the YouTube thumbnail, or the issue's cover for Audiohat episodes */
			el.setAttribute('data-skin', tr.skin || '');
			var art = tr.art || (tr.yt ? 'https://i.ytimg.com/vi/' + tr.yt + '/hqdefault.jpg' : '');
			var artImg = el.querySelector('.cs-art img');
			el.classList.toggle('has-art', !!art);
			el.classList.toggle('art-wide', !!(art && (tr.yt || /ytimg/.test(art))));
			el.classList.toggle('art-sq', !!(art && /img\/audio\//.test(art)));
			if (art && artImg.getAttribute('src') !== art) artImg.setAttribute('src', art);
			el.querySelector('.cs-s').textContent = tr.sub || '';
			el.querySelector('.cs-count').textContent = L(App.num(i + 1) + ' من ' + App.num(tracks.length), (i + 1) + ' / ' + tracks.length);
			el.querySelector('.cs-dur').textContent = tr.mins ? App.num(tr.mins) + ' ' + L('دقيقة', 'min') : L('مدة غير معروفة', 'length unknown');
			el.querySelector('.cs-note').textContent = tr.yt
				? (tr.ytEmbed ? L('من قناة «' + (tr.channel || 'YouTube') + '» على YouTube — يظهر المشغّل تحت الشريط', 'From the “' + (tr.channel || 'YouTube') + '” channel on YouTube — the player opens under the tape')
					: L('صاحب الفيديو لا يسمح بتشغيله خارج YouTube، فالتشغيل يفتحه هناك', 'The uploader does not allow playing it outside YouTube, so play opens it there'))
				: tr.provider === 'Storytel'
				? L('الكتاب الصوتي على Storytel' + (tr.by ? ' بصوت ' + tr.by : '') + ' — الزر يفتح صفحته هناك في نافذة جديدة', 'The audiobook is on Storytel' + (tr.by ? ', read by ' + tr.by : '') + ' — the key opens its page there in a new tab')
				: L('الحلقة على Audiohat — الزر يفتح صفحتها هناك في نافذة جديدة', 'The episode is on Audiohat — the key opens its page there in a new tab');
			el.classList.toggle('has-sample', !!(tr.yt && tr.ytEmbed));
			/* the separate source key is for YouTube; for Audiohat the main key already opens it */
			outBtn.parentNode.hidden = !tr.yt;
			outBtn.querySelector('.lb').textContent = 'YouTube';
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
			if (yt && yt.pauseVideo) { try { rewind ? yt.stopVideo() : yt.pauseVideo(); } catch (x) {} }
			if (rewind) { vbox.hidden = true; clearInterval(ytPoll); }
		}

		function wind(dir) {
			var j = i + dir;
			if (j < 0 || j >= tracks.length) return;
			clearTimeout(windTimer);
			stopAudio(true);
			state(dir > 0 ? 'is-ff' : 'is-rew');
			windTimer = setTimeout(function () {
				i = j; render(); state('');
			}, 700);
		}

		function play() {
			var tr = tracks[i];
			if (!tr) return;
			if (tr.yt && tr.ytEmbed) { playYT(tr); return; }
			/* Audiohat (or a YouTube video that can't be embedded): opened synchronously in the click so pop-up blockers allow it */
			window.open(tr.url, '_blank', 'noopener');
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

		el.querySelector('.cs-controls').addEventListener('click', function (ev) {
			var b = ev.target.closest('[data-act]');
			if (!b || b.disabled) return;
			var act = b.getAttribute('data-act');
			if (act === 'play') play();
			else if (act === 'stop') { clearTimeout(windTimer); stopAudio(true); state(''); bar.style.width = '0%'; render(); }
			else if (act === 'ff') wind(1);
			else if (act === 'rew') wind(-1);
			else if (act === 'out') stopAudio(false);
		});

		if (window.ResizeObserver) new ResizeObserver(fit).observe(el); else window.addEventListener('resize', fit);
		fit(); render();

		return {
			load: function (j, focus) {
				clearTimeout(windTimer); stopAudio(true);
				i = Math.max(0, Math.min(tracks.length - 1, j)); state(''); render();
				if (focus) playBtn.focus();
			},
			index: function () { return i; }
		};
	}

	/* Audiohat slug -> their page URL (parentheses stay literal, as on their site) */
	function pageUrl(A, slug) { return A.base + encodeURIComponent(slug).replace(/%28/g, '(').replace(/%29/g, ')'); }

	/* episodes of an issue (book.html id like "mwt-12") -> tracks.
	   data entries: [slug, minutes, (unused), label?] — a label names the episode in place of "Episode n of m" */
	function issueTracks(key, issueTitle) {
		var A = (window.App.data().audio) || null;
		if (!A || !A.issues || !A.issues[key]) return [];
		var eps = A.issues[key], L = window.App.L;
		return eps.map(function (ep, k) {
			return {
				title: issueTitle,
				sub: ep[3] ? ep[3] : eps.length > 1 ? L('الحلقة ', 'Episode ') + window.App.num(k + 1) + L(' من ', ' of ') + window.App.num(eps.length) : 'Audiohat',
				url: pageUrl(A, ep[0]),
				mins: ep[1],
				skin: key.split('-')[0]
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
				yt: ep[0], ytEmbed: ep[1] !== 0,
				skin: key.split('-')[0]
			};
		});
	}

	/* audiobooks on Storytel (data-storytel.js) -> tracks. key: an issue (a special issue under its hero, "mwt-s2", is "specials-2"),
	   "work:<id>", "series:www" or "story:<title>"; data entries: [slug, minutes, narrator, year, part?] */
	function storytelTracks(key, title) {
		var A = (window.App.data().audio) || null, S = A && A.storytel;
		if (!S || !S.items) return [];
		var k = String(key).replace(/^(mwt|fantasia|safari)-s(\d+)$/, 'specials-$2');
		var eps = S.items[k] || [], L = window.App.L, num = window.App.num;
		return eps.map(function (ep) {
			var label = [ep[4] || '', ep[2] ? L('بصوت ', 'read by ') + ep[2] : '', ep[3] ? num(ep[3]) : ''].filter(Boolean).join(' · ');
			return { title: title, ep: label || 'Storytel', sub: 'Storytel' + (label ? ' · ' + label : ''), url: S.base + encodeURIComponent(ep[0]),
				mins: ep[1] || null, by: ep[2] || '', provider: 'Storytel', skin: k.split('-')[0] };
		});
	}

	window.Cassette = { mount: mount, issueTracks: function (key, title) { return issueTracks(key, title).concat(youtubeTracks(key, title), storytelTracks(key, title)); },
		youtubeTracks: youtubeTracks, storytelTracks: storytelTracks, pageUrl: pageUrl };
})();

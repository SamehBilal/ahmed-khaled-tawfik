/* Cassette player — a vanilla rebuild of Codrops' "Old School Cassette Player".
   The tracks here are Audiohat episodes. Audiohat's sample links are temporary, so ▶ opens
   the episode on Audiohat in a new tab (where their own sample plays) while the reels spin.
   ◀◀ / ▶▶ wind the tape to the previous / next episode; ■ stops the reels.

   Cassette.mount(el, { tracks: [{ title, sub, url, mins }], index }) -> { load(i) } */
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
				'<div class="cs-label" dir="rtl"><span class="cs-t"></span><span class="cs-s"></span></div>' +
				'<span class="cs-side">' + L('أ', 'A') + '</span>' +
			'</div></div>' +
			'<ul class="cs-controls" role="toolbar" aria-label="' + L('أزرار المسجل', 'Tape deck') + '">' +
				'<li><button type="button" data-act="rew" aria-label="' + L('الحلقة السابقة', 'Previous episode') + '"><span class="ic"><svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M11 6v12L2.5 12zM21 6v12l-8.5-6z" fill="currentColor"/></svg></span></button></li>' +
				'<li class="cs-play"><button type="button" data-act="play"><span class="ic"><svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M7 5v14l12-7z" fill="currentColor"/></svg></span><span class="lb">' + L('استمع على Audiohat', 'Listen on Audiohat') + '</span></button></li>' +
				'<li><button type="button" data-act="ff" aria-label="' + L('الحلقة التالية', 'Next episode') + '"><span class="ic"><svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M13 6v12l8.5-6zM3 6v12l8.5-6z" fill="currentColor"/></svg></span></button></li>' +
				'<li><button type="button" data-act="stop" aria-label="' + L('إيقاف', 'Stop') + '"><span class="ic"><svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M6 6h12v12H6z" fill="currentColor"/></svg></span></button></li>' +
			'</ul>' +
			'<p class="cs-meta"><span class="cs-count"></span> · <span class="cs-dur"></span>' +
				'<span class="cs-note">' + L('العيّنة تعمل على موقع Audiohat في نافذة جديدة', 'The sample plays on Audiohat in a new tab') + '</span></p>';

		var stage = el.querySelector('.cs-stage'), tape = el.querySelector('.cs-tape');
		var playBtn = el.querySelector('[data-act="play"]');

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

		function render() {
			var tr = tracks[i] || {};
			el.querySelector('.cs-t').textContent = tr.title || '';
			el.querySelector('.cs-s').textContent = tr.sub || '';
			el.querySelector('.cs-count').textContent = L(App.num(i + 1) + ' من ' + App.num(tracks.length), (i + 1) + ' / ' + tracks.length);
			el.querySelector('.cs-dur').textContent = tr.mins ? App.num(tr.mins) + ' ' + L('دقيقة', 'min') : L('مدة غير معروفة', 'length unknown');
			/* tape moves from the left reel to the right one as you go through the episodes */
			var p = tracks.length > 1 ? i / (tracks.length - 1) : 0;
			el.style.setProperty('--tl', Math.round(14 + 56 * (1 - p)) + 'px');
			el.style.setProperty('--tr', Math.round(14 + 56 * p) + 'px');
			el.querySelector('[data-act="rew"]').disabled = i === 0;
			el.querySelector('[data-act="ff"]').disabled = i >= tracks.length - 1;
			playBtn.setAttribute('aria-label', L('استمع إلى «', 'Listen to “') + (tr.title || '') + L('» على Audiohat', '” on Audiohat'));
		}

		function wind(dir) {
			var j = i + dir;
			if (j < 0 || j >= tracks.length) return;
			clearTimeout(windTimer);
			sound('click');
			var s = sound(dir > 0 ? 'fforward' : 'rewind');
			state(dir > 0 ? 'is-ff' : 'is-rew');
			windTimer = setTimeout(function () {
				if (s) s.pause();
				i = j; render(); state('');
			}, 700);
		}

		el.querySelector('.cs-controls').addEventListener('click', function (ev) {
			var b = ev.target.closest('button');
			if (!b || b.disabled) return;
			var act = b.getAttribute('data-act');
			if (act === 'play') {
				var tr = tracks[i];
				if (!tr) return;
				sound('click');
				state('is-playing');
				/* opened synchronously in the click so pop-up blockers allow it */
				window.open(tr.url, '_blank', 'noopener');
			} else if (act === 'stop') { clearTimeout(windTimer); sound('click'); state(''); }
			else if (act === 'ff') wind(1);
			else if (act === 'rew') wind(-1);
		});

		if (window.ResizeObserver) new ResizeObserver(fit).observe(el); else window.addEventListener('resize', fit);
		fit(); render();

		return {
			load: function (j, autoplay) { i = Math.max(0, Math.min(tracks.length - 1, j)); state(''); render(); if (autoplay) playBtn.focus(); },
			index: function () { return i; }
		};
	}

	/* episodes of an issue (book.html id like "mwt-12") -> tracks */
	function issueTracks(key, issueTitle) {
		var A = (window.App.data().audio) || null;
		if (!A || !A.issues || !A.issues[key]) return [];
		var eps = A.issues[key], L = window.App.L;
		return eps.map(function (ep, k) {
			return {
				title: issueTitle,
				sub: eps.length > 1 ? L('الحلقة ', 'Episode ') + window.App.num(k + 1) + L(' من ', ' of ') + window.App.num(eps.length) : 'Audiohat',
				url: A.base + encodeURIComponent(ep[0]).replace(/%28/g, '(').replace(/%29/g, ')'),
				mins: ep[1]
			};
		});
	}

	window.Cassette = { mount: mount, issueTracks: issueTracks };
})();

/* 3D figures (AKT.figures3d): a statue's still picture and a button; only when pressed does the page fetch Google's
   <model-viewer> and the model, to turn it with a finger or the mouse — and, on a phone, set it in one's own room (AR:
   Scene Viewer on Android, Quick Look on iPhone, from the same GLB). Used on the character pages and on «المتحف». */
(function () {
	'use strict';
	var MV = 'https://cdn.jsdelivr.net/npm/@google/model-viewer@3.5.0/dist/model-viewer.min.js', loading = null;
	function lib() {
		if (window.customElements && customElements.get('model-viewer')) return Promise.resolve();
		if (!loading) loading = new Promise(function (ok, no) {
			var s = document.createElement('script'); s.type = 'module'; s.src = MV;
			s.onload = function () { customElements.whenDefined('model-viewer').then(ok); }; s.onerror = no;
			document.head.appendChild(s);
		});
		return loading;
	}
	function A() { return window.App; }

	/* the block: { id } of AKT.figures3d; opt.big for a larger stage */
	function html(id, opt) {
		var App = A(), f = (App.data().figures3d || {})[id], e = App.esc, L = App.L;
		if (!f) return '';
		opt = opt || {};
		return '<figure class="f3d' + (opt.big ? ' is-big' : '') + '" data-f3d="' + e(id) + '">' +
			'<div class="f3d-stage"><img class="f3d-poster" src="' + e(f.poster) + '" alt="' + e(App.t(f.title)) + '" loading="lazy">' +
				'<button type="button" class="f3d-go"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2 3 7v10l9 5 9-5V7z M3 7l9 5 9-5 M12 12v10" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>' +
				e(L('اعرض المجسم', 'View in 3D')) + '</button></div>' +
			'<figcaption><b>' + e(App.t(f.title)) + '</b>' + (f.text ? '<span>' + e(App.t(f.text)) + '</span>' : '') +
				'<small>' + e(L('تصوّر فني من صنع محرر الموقع، وليس عملًا رسميًا', 'An artistic impression by the site’s editor, not an official work')) + '</small></figcaption></figure>';
	}

	/* a press on any figure on the page swaps its picture for the model */
	document.addEventListener('click', function (ev) {
		var b = ev.target.closest && ev.target.closest('.f3d-go');
		if (!b) return;
		var box = b.closest('.f3d'), App = A(), f = (App.data().figures3d || {})[box.getAttribute('data-f3d')], L = App.L;
		if (!f || box.classList.contains('is-on')) return;
		b.disabled = true; b.textContent = L('يُحمَّل…', 'Loading…');
		lib().then(function () {
			var mv = document.createElement('model-viewer');
			var at = { src: f.src, poster: f.poster, alt: App.t(f.title), 'camera-controls': '', 'auto-rotate': '', 'auto-rotate-delay': '1500', 'rotation-per-second': '18deg',
				'shadow-intensity': '1', 'shadow-softness': '.8', exposure: '1.15', 'environment-image': 'neutral', 'interaction-prompt': 'auto', 'touch-action': 'pan-y',
				ar: '', 'ar-modes': 'webxr scene-viewer quick-look', 'ar-placement': 'floor', 'ar-scale': 'auto' };
			Object.keys(at).forEach(function (k) { mv.setAttribute(k, at[k]); });
			mv.className = 'f3d-mv';
			mv.innerHTML = '<button slot="ar-button" class="f3d-ar"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7V4h3M17 4h3v3M20 17v3h-3M7 20H4v-3M12 7l5 3v5l-5 3-5-3v-5z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>' +
				App.esc(L('ضعه في غرفتك', 'See it in your room')) + '</button>';
			var stage = box.querySelector('.f3d-stage');
			stage.innerHTML = ''; stage.appendChild(mv);
			box.classList.add('is-on');
		}, function () { b.disabled = false; b.textContent = L('تعذّر التحميل — حاول مجددًا', 'Could not load — try again'); });
	});

	window.Figure3D = { html: html };
})();

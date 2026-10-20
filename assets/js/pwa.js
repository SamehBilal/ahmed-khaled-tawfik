/* The site as an app: registers sw.js, adds an install button to the header (or install
   steps on iPhone/iPad), says when a new version is ready, when the connection drops or
   comes back, and offers "Save for offline", which stores every cover and photo in advance.
   Loaded on every page after app.js. */
(function () {
	'use strict';
	var App = window.App;
	if (!App) return;
	var L = App.L, Notify = window.Notify || function () { return { dismiss: function () {}, el: document.createElement('div') }; };
	var html = document.documentElement;
	var standalone = matchMedia('(display-mode: standalone)').matches || navigator.standalone === true;
	var ios = /iphone|ipad|ipod/i.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
	var deferred = null;
	if (standalone) html.classList.add('is-app');

	/* ---------- the browser bar follows the theme ---------- */
	function syncThemeColor() {
		var m = document.querySelector('meta[name="theme-color"]');
		if (!m) return;
		m.setAttribute('content', html.getAttribute('data-theme') === 'light' ? '#efe6d2' : '#0e0f13');
	}
	new MutationObserver(syncThemeColor).observe(html, { attributes: true, attributeFilter: ['data-theme'] });
	syncThemeColor();

	/* ---------- install ---------- */
	var ICON = '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M12 4v11m0 0-4.5-4.5M12 15l4.5-4.5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M5 19h14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';
	function canOffer() { return !standalone && (deferred || ios); }
	function placeButton() {
		var tools = document.querySelector('.site-header .tools');
		if (!tools) return;
		var b = tools.querySelector('.install-app');
		if (!canOffer()) { if (b) b.remove(); return; }
		if (b) return;
		b = document.createElement('button');
		b.type = 'button';
		b.className = 'icon-btn install-app';
		b.setAttribute('aria-label', L('ثبّت الموقع كتطبيق', 'Install as an app'));
		b.title = L('ثبّت الموقع كتطبيق', 'Install as an app');
		b.innerHTML = ICON;
		b.addEventListener('click', install);
		tools.insertBefore(b, tools.firstChild);
	}
	function install() {
		if (deferred) {
			deferred.prompt();
			deferred.userChoice.then(function () { deferred = null; placeButton(); });
			return;
		}
		if (ios) {
			Notify(L('في سفاري: اضغط زر المشاركة <b>⎋</b> ثم «إضافة إلى الشاشة الرئيسية».',
				'In Safari, tap Share <b>⎋</b>, then “Add to Home Screen”.'), { title: L('ثبّت العرّاب', 'Install the Godfather'), html: true, ttl: 9000 });
		}
	}
	window.addEventListener('beforeinstallprompt', function (ev) { ev.preventDefault(); deferred = ev; placeButton(); });
	window.addEventListener('appinstalled', function () {
		deferred = null; standalone = true; placeButton();
		Notify(L('صار العرّاب على شاشتك الرئيسية.', 'The Godfather is on your home screen now.'), { type: 'success' });
	});
	/* the header is rebuilt when the language changes */
	var header = document.getElementById('site-header');
	if (header) new MutationObserver(placeButton).observe(header, { childList: true, subtree: true });
	placeButton();

	/* ---------- connection ---------- */
	window.addEventListener('offline', function () {
		Notify(L('انقطع الاتصال. الصفحات التي فتحتها من قبل ما زالت تعمل.', 'You’re offline. Pages you’ve opened before still work.'), { type: 'warning', ttl: 6000 });
	});
	window.addEventListener('online', function () {
		Notify(L('عاد الاتصال.', 'Back online.'), { type: 'success', ttl: 2500 });
	});

	/* ---------- save every image for offline ---------- */
	function localImages() {
		var set = {};
		(function walk(o) {
			if (!o) return;
			if (typeof o === 'string') { if (/^assets\/img\/.+\.(png|jpe?g|webp|gif|svg)$/i.test(o)) set[o] = 1; return; }
			if (typeof o === 'object') for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) walk(o[k]);
		})(App.data());
		return Object.keys(set);
	}
	var saving = false;
	function saveOffline() {
		if (saving || !('caches' in window)) return;
		var list = localImages();
		if (!confirm(L('سيُحفظ ' + App.num(list.length) + ' غلافًا وصورة (نحو 100 ميجابايت) على هذا الجهاز لتعمل دون إنترنت. متابعة؟',
			'This saves ' + list.length + ' covers and photos (about 100 MB) on this device so they work offline. Continue?'))) return;
		saving = true;
		var n = Notify(L('جارٍ الحفظ…', 'Saving…'), { title: L('حفظ للقراءة دون اتصال', 'Saving for offline'), ttl: 0 });
		var p = n.el.querySelector('p');
		var done = 0, failed = 0, i = 0;
		caches.open('akt-images').then(function (c) {
			function next() {
				if (i >= list.length) return Promise.resolve();
				var u = list[i++];
				return c.match(u).then(function (hit) { return hit || c.add(u); })
					.catch(function () { failed++; })
					.then(function () { done++; if (p && done % 10 === 0) p.textContent = App.num(done) + ' / ' + App.num(list.length); return next(); });
			}
			return Promise.all([next(), next(), next(), next()]);
		}).then(function () {
			saving = false; n.dismiss();
			try { localStorage.setItem('akt-offline-saved', String(Date.now())); } catch (e) {}
			Notify(failed ? L('حُفظ معظمها؛ تعذّر ' + App.num(failed) + '.', 'Mostly saved; ' + failed + ' could not be.') : L('كل الأغلفة والصور محفوظة الآن على جهازك.', 'Every cover and photo is saved on this device.'), { type: failed ? 'warning' : 'success' });
		});
	}
	function placeSaveLink() {
		var links = document.querySelector('.site-footer .ft-links');
		if (!links || links.querySelector('.save-offline') || !('caches' in window) || !('serviceWorker' in navigator)) return;
		var b = document.createElement('button');
		b.type = 'button';
		b.className = 'save-offline';
		b.textContent = L('احفظ الموقع دون اتصال', 'Save for offline');
		b.addEventListener('click', saveOffline);
		links.appendChild(b);
	}
	var footer = document.getElementById('site-footer');
	if (footer) new MutationObserver(placeSaveLink).observe(footer, { childList: true });
	placeSaveLink();

	/* ---------- service worker and updates ---------- */
	if (!('serviceWorker' in navigator) || location.protocol === 'file:') return;
	var reloading = false;
	navigator.serviceWorker.addEventListener('controllerchange', function () { if (reloading) location.reload(); });
	function offerUpdate(worker) {
		var n = Notify(L('نسخة أحدث من الموقع جاهزة. <button type="button" class="ns-action">حدّث الآن</button>',
			'A newer version of the site is ready. <button type="button" class="ns-action">Update now</button>'), { title: L('تحديث', 'Update'), html: true, ttl: 0 });
		var btn = n.el.querySelector('.ns-action');
		if (btn) btn.addEventListener('click', function () { reloading = true; worker.postMessage('skipWaiting'); n.dismiss(); });
	}
	window.addEventListener('load', function () {
		navigator.serviceWorker.register('sw.js', { scope: './' }).then(function (reg) {
			if (reg.waiting && navigator.serviceWorker.controller) offerUpdate(reg.waiting);
			reg.addEventListener('updatefound', function () {
				var w = reg.installing;
				if (!w) return;
				w.addEventListener('statechange', function () {
					/* only an update, not the first install */
					if (w.state === 'installed' && navigator.serviceWorker.controller) offerUpdate(w);
				});
			});
			/* look for a new version when the app comes back to the front */
			document.addEventListener('visibilitychange', function () { if (document.visibilityState === 'visible') reg.update().catch(function () {}); });
		}).catch(function () {});
	});
})();

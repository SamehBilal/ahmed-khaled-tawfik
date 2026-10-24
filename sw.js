/* Service worker: the site works offline and installs as an app.
   - Pages: network first (3 s), then the saved copy, then offline.html. Pages like
     book.html?id=… are one page filled in from the data, so they're matched without the query.
   - Code, styles and fonts: served from the cache at once and refreshed in the background.
   - Images (covers, photos, blog pictures): from the cache once seen; "Save for offline"
     in the footer stores every cover ahead of time.
   VERSION and PRECACHE are rewritten by tools/build-sw.js — run it after changing files. */
'use strict';

var VERSION = 'akt-788f4b3808';
var PRECACHE = [
	'./',
	'about.html',
	'audio.html',
	'authors.html',
	'blog.html',
	'book.html',
	'character.html',
	'characters.html',
	'contact.html',
	'guide.html',
	'index.html',
	'legacy.html',
	'offline.html',
	'privacy.html',
	'publisher.html',
	'publishers.html',
	'quotes.html',
	'series.html',
	'sources.html',
	'terms.html',
	'tributes.html',
	'works.html',
	'writer.html',
	'writers.html',
	'manifest.webmanifest',
	'favicon.ico',
	'assets/js/app.js',
	'assets/js/audio-page.js',
	'assets/js/blog.js',
	'assets/js/book-page.js',
	'assets/js/books.js',
	'assets/js/cassette.js',
	'assets/js/character-page.js',
	'assets/js/characters.js',
	'assets/js/data-audio.js',
	'assets/js/data-blog.js',
	'assets/js/data-blurbs.js',
	'assets/js/data-books-a.js',
	'assets/js/data-books-b.js',
	'assets/js/data-heroes.js',
	'assets/js/data-issues.js',
	'assets/js/data-legacy.js',
	'assets/js/data-more.js',
	'assets/js/data-quotes.js',
	'assets/js/data-series-more.js',
	'assets/js/data-tributes.js',
	'assets/js/data.js',
	'assets/js/guide.js',
	'assets/js/home.js',
	'assets/js/info.js',
	'assets/js/intro.js',
	'assets/js/legacy.js',
	'assets/js/lists.js',
	'assets/js/mosaic.js',
	'assets/js/notfound.js',
	'assets/js/notify.js',
	'assets/js/page-hero.js',
	'assets/js/people.js',
	'assets/js/publisher-page.js',
	'assets/js/publishers-page.js',
	'assets/js/pwa.js',
	'assets/js/quotes.js',
	'assets/js/series-page.js',
	'assets/js/shared.js',
	'assets/js/shelf-hero.js',
	'assets/js/tributes.js',
	'assets/js/works.js',
	'assets/js/writer-page.js',
	'assets/js/writers.js',
	'assets/css/blog.css',
	'assets/css/books.css',
	'assets/css/cassette.css',
	'assets/css/char-cards.css',
	'assets/css/character.css',
	'assets/css/detail.css',
	'assets/css/extras.css',
	'assets/css/fonts.css',
	'assets/css/legacy-timeline.css',
	'assets/css/lists.css',
	'assets/css/mosaic.css',
	'assets/css/notfound.css',
	'assets/css/notify.css',
	'assets/css/page-hero.css',
	'assets/css/people-wave.css',
	'assets/css/quote-bubble.css',
	'assets/css/shelf-hero.css',
	'assets/css/site.css',
	'assets/css/tributes.css',
	'assets/css/writer.css',
	'assets/fonts/gf/CormorantGaramond-latin-1.woff2',
	'assets/fonts/gf/CormorantGaramond-latin-3.woff2',
	'assets/fonts/gf/CormorantGaramond-latin-ext-0.woff2',
	'assets/fonts/gf/CormorantGaramond-latin-ext-2.woff2',
	'assets/fonts/gf/Lalezar-arabic-4.woff2',
	'assets/fonts/gf/Lalezar-latin-6.woff2',
	'assets/fonts/gf/Lalezar-latin-ext-5.woff2',
	'assets/fonts/gf/NotoNaskhArabic-arabic-7.woff2',
	'assets/fonts/gf/NotoNaskhArabic-latin-9.woff2',
	'assets/fonts/gf/NotoNaskhArabic-latin-ext-8.woff2',
	'assets/fonts/gf/Poppins-500-latin-ext.woff2',
	'assets/fonts/gf/Poppins-500-latin.woff2',
	'assets/fonts/gf/ReemKufi-arabic-10.woff2',
	'assets/fonts/gf/ReemKufi-latin-12.woff2',
	'assets/fonts/gf/ReemKufi-latin-ext-11.woff2',
	'assets/fonts/thegodfather-v2-webfont.ttf',
	'assets/fonts/thegodfather-v2-webfont.woff',
	'assets/img/icons/apple-touch-icon.png',
	'assets/img/icons/favicon-32.png',
	'assets/img/icons/favicon-48.png',
	'assets/img/icons/icon-192.png',
	'assets/img/icons/icon-512.png',
	'assets/img/icons/maskable-192.png',
	'assets/img/icons/maskable-512.png',
	'assets/img/cassette/cs_back.png',
	'assets/img/cassette/cs_front.png',
	'assets/img/cassette/cs_wheel.png',
	'assets/img/cassette/metal.jpg',
	'assets/img/cassette/metal_dark.jpg',
	'assets/img/favicon.svg',
	'assets/img/grave.webp',
	'assets/img/icon-maskable.svg',
	'assets/img/icon.svg',
	'assets/img/name-lettering.jpg',
	'assets/img/name-lettering.svg',
	'assets/img/paper.jpg',
	'assets/img/refaat.jpg',
	'assets/img/wood.jpg'
];

var SHELL = 'akt-shell-' + VERSION;
var RUNTIME = 'akt-runtime';
var IMAGES = 'akt-images';
var REMOTE_IMAGES = 'akt-remote-images';
var REMOTE_MAX = 400;

self.addEventListener('install', function (ev) {
	ev.waitUntil(caches.open(SHELL).then(function (c) {
		/* one missing file shouldn't stop the whole install */
		return Promise.all(PRECACHE.map(function (u) {
			return c.add(new Request(u, { cache: 'reload' })).catch(function () {});
		}));
	}));
});

self.addEventListener('activate', function (ev) {
	ev.waitUntil(caches.keys().then(function (keys) {
		return Promise.all(keys.filter(function (k) { return k.indexOf('akt-shell-') === 0 && k !== SHELL; }).map(function (k) { return caches.delete(k); }));
	}).then(function () { return self.clients.claim(); }));
});

self.addEventListener('message', function (ev) {
	if (ev.data === 'skipWaiting') self.skipWaiting();
});

function timeout(ms, p) {
	return new Promise(function (resolve, reject) {
		var t = setTimeout(function () { reject(new Error('timeout')); }, ms);
		p.then(function (r) { clearTimeout(t); resolve(r); }, function (e) { clearTimeout(t); reject(e); });
	});
}

function fromCache(req, opts) {
	return caches.match(req, opts);
}

function page(req) {
	var net = fetch(req).then(function (res) {
		if (res && res.ok) {
			var copy = res.clone();
			/* keep one copy per page, without the query */
			var url = new URL(req.url); url.search = '';
			caches.open(RUNTIME).then(function (c) { c.put(url.href, copy); });
		}
		return res;
	});
	return timeout(3000, net).catch(function () {
		return fromCache(req, { ignoreSearch: true }).then(function (hit) {
			return hit || net.catch(function () { return fromCache('offline.html'); });
		});
	});
}

function staleWhileRevalidate(req, cacheName) {
	return caches.open(cacheName).then(function (c) {
		return c.match(req, { ignoreSearch: req.url.indexOf(self.location.origin) === 0 }).then(function (hit) {
			var net = fetch(req).then(function (res) {
				if (res && (res.ok || res.type === 'opaque')) c.put(req, res.clone());
				return res;
			}).catch(function () { return hit; });
			return hit || net;
		});
	});
}

function cacheFirst(req, cacheName, max) {
	return caches.open(cacheName).then(function (c) {
		return c.match(req).then(function (hit) {
			if (hit) return hit;
			return fetch(req).then(function (res) {
				if (res && (res.ok || res.type === 'opaque')) {
					c.put(req, res.clone());
					if (max) c.keys().then(function (keys) { if (keys.length > max) c.delete(keys[0]); });
				}
				return res;
			}).catch(function () { return new Response('', { status: 504 }); });
		});
	});
}

self.addEventListener('fetch', function (ev) {
	var req = ev.request;
	if (req.method !== 'GET') return;
	var url = new URL(req.url);
	var same = url.origin === self.location.origin;

	if (req.mode === 'navigate') { ev.respondWith(page(req)); return; }
	if (same && /\.(png|jpe?g|webp|gif|svg|jfif|ico)$/i.test(url.pathname)) { ev.respondWith(cacheFirst(req, IMAGES)); return; }
	if (same) {
		/* the latest copy fetched (runtime), else the install-time copy, refreshed quietly each time */
		ev.respondWith(caches.open(RUNTIME).then(function (c) { return c.match(req, { ignoreSearch: true }); }).then(function (hit) {
			return hit || fromCache(req, { ignoreSearch: true });
		}).then(function (hit) {
			var fresh = staleWhileRevalidate(req, RUNTIME);
			return hit || fresh;
		}));
		return;
	}
	if (req.destination === 'image') { ev.respondWith(cacheFirst(req, REMOTE_IMAGES, REMOTE_MAX)); return; }
	if (req.destination === 'script' || req.destination === 'style' || req.destination === 'font') { ev.respondWith(staleWhileRevalidate(req, RUNTIME)); return; }
});

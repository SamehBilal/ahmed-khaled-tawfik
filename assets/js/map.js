/* map.html — «الخريطة»: the places his books and issues name, on a map of the world (assets/data/world.json, drawn once from
   Natural Earth by tools/build-world.js) with a pin for each place in assets/data/places.json (tools/build-places.js): a pin
   as big as the number of books that name it; open it for those books, each with the sentence that names the place. The
   same places as a list under the map, for the keyboard and for reading. */
window.PAGE = {
	id: 'map',
	title: { ar: 'الخريطة', en: 'The map' },
	strings: {
		eyebrow: { ar: 'أين تدور الحكايات', en: 'Where the stories go' },
		title: { ar: 'الخريطة', en: 'The map' },
		lead: {
			ar: 'الأماكن التي تسمّيها أوصاف كتبه وأعداده وأغلفتها الخلفية في هذا الموقع، من غابات رومانيا إلى نهر الأمازون. افتح أي مكان لترى كتبه والجملة التي ذكرته.',
			en: 'The places his books’ and issues’ descriptions and back covers on this site name, from the forests of Romania to the Amazon. Open a place for its books and the sentence that names it.'
		}
	},

	render: function () {
		var self = this, App = window.App, L = App.L;
		document.getElementById('content').innerHTML = '<section class="section mp"><div class="wrap">' +
			'<figure class="mp-map"><div class="mp-stage"><p class="mp-wait">' + App.esc(L('تُرسم الخريطة…', 'Drawing the map…')) + '</p></div><aside class="mp-panel" hidden></aside></figure>' +
			'<p class="mp-note">' + App.esc(L('الأماكن هنا هي ما تذكره نصوص الموقع عن كل كتاب؛ قد يُذكر المكان عابرًا لا مسرحًا للحكاية، والجملة تحت كل كتاب تقول كيف ذُكر.',
				'These are the places the site’s texts name for each book; a place may be named in passing rather than as the setting — the sentence under each book shows how.')) + '</p>' +
			'<div class="mp-list"></div></div></section>';
		var get = function (u) { return fetch(u).then(function (r) { return r.json(); }); };
		Promise.all([this._world || get('assets/data/world.json'), this._places || get('assets/data/places.json')]).then(function (got) {
			self._world = got[0]; self._places = got[1];
			self.draw();
		}).catch(function () {
			document.querySelector('.mp-wait').textContent = L('تعذّر تحميل الخريطة.', 'The map could not be loaded.');
		});
	},

	/* d3's naturalEarth1Raw, scaled as tools/build-world.js drew the world */
	project: function (lon, lat) {
		var w = this._world, R = Math.PI / 180, lam = lon * R, phi = lat * R, p2 = phi * phi, p4 = p2 * p2;
		var x = lam * (0.8707 - 0.131979 * p2 + p4 * (-0.013791 + p4 * (0.003971 * p2 - 0.001529 * p4)));
		var y = phi * (1.007226 + p2 * (0.015085 + p4 * (-0.044475 + 0.028874 * p2 - 0.005916 * p4)));
		return [w.tx + w.k * x, w.ty - w.k * y];
	},

	name: function (p) { return window.App.lang === 'en' ? p.en : p.ar; },

	draw: function () {
		var App = window.App, e = App.esc, L = App.L, self = this, w = this._world, places = this._places;
		var max = Math.max.apply(null, places.map(function (p) { return p.items.length; }));
		var r = function (n) { return 5 + 9 * Math.sqrt(n / max); };
		/* the biggest pins underneath, so a small one beside a big one stays clickable */
		var pins = places.slice().sort(function (a, b) { return b.items.length - a.items.length; }).map(function (p) {
			var xy = self.project(p.lon, p.lat), i = places.indexOf(p);
			return '<g class="mp-pin" data-i="' + i + '" transform="translate(' + xy[0].toFixed(1) + ',' + xy[1].toFixed(1) + ')" tabindex="-1">' +
				'<circle class="mp-halo" r="' + (r(p.items.length) + 6).toFixed(1) + '"/><circle class="mp-dot" r="' + r(p.items.length).toFixed(1) + '"/>' +
				(p.items.length > 1 ? '<text class="mp-n" dy="4">' + e(App.num(p.items.length)) + '</text>' : '') +
				'<title>' + e(self.name(p)) + ' · ' + e(App.num(p.items.length)) + '</title></g>';
		}).join('');
		document.querySelector('.mp-stage').innerHTML = '<svg viewBox="0 0 ' + w.w + ' ' + w.h + '" role="img" aria-label="' + e(L('خريطة العالم بالأماكن المذكورة في كتبه', 'World map of the places his books name')) + '">' +
			'<path class="mp-grid" d="' + w.grid + '"/><path class="mp-land" d="' + w.countries + '"/>' + pins + '</svg>';
		/* the list: every place, the most named first */
		document.querySelector('.mp-list').innerHTML = '<h2 class="pp-h">' + e(L('كل الأماكن', 'Every place')) + ' <small>(' + e(App.num(places.length)) + ')</small></h2>' +
			'<div class="mp-chips">' + places.map(function (p, i) {
				return '<button type="button" class="chip" data-i="' + i + '">' + e(self.name(p)) + ' <b>' + e(App.num(p.items.length)) + '</b></button>';
			}).join('') + '</div>';
		var open = function (i) { self.open(i); };
		document.querySelector('.mp-stage svg').addEventListener('click', function (ev) {
			var g = ev.target.closest('.mp-pin');
			if (g) open(+g.getAttribute('data-i')); else self.close();
		});
		document.querySelector('.mp-chips').addEventListener('click', function (ev) {
			var b = ev.target.closest('[data-i]');
			if (!b) return;
			open(+b.getAttribute('data-i'));
			document.querySelector('.mp-map').scrollIntoView({ behavior: 'smooth', block: 'start' });
		});
		/* the place in the address (map.html#Romania) opens on load */
		var hash = decodeURIComponent(location.hash.slice(1));
		var at = places.findIndex(function (p) { return p.en === hash || p.ar === hash; });
		if (at >= 0) open(at);
	},

	open: function (i) {
		var App = window.App, e = App.esc, L = App.L, self = this, p = this._places[i];
		document.querySelectorAll('.mp-pin').forEach(function (g) { g.classList.toggle('is-on', +g.getAttribute('data-i') === i); });
		document.querySelectorAll('.mp-chips .chip').forEach(function (b) { b.setAttribute('aria-pressed', String(+b.getAttribute('data-i') === i)); });
		var panel = document.querySelector('.mp-panel');
		/* the place's name marked in each sentence */
		var mark = function (s) {
			var name = p.ar.replace(/^ال/, '');
			return e(s).split(e(name)).join('<mark>' + e(name) + '</mark>');
		};
		panel.innerHTML = '<button type="button" class="mp-x" aria-label="' + e(L('إغلاق', 'Close')) + '">×</button>' +
			'<h3>' + e(this.name(p)) + '</h3><p class="mp-sub">' + e(p.items.length === 1 ? L('كتاب واحد يذكره', 'Named in one book') : L('يذكره ' + App.num(p.items.length) + ' من كتبه وأعداده', 'Named in ' + p.items.length + ' of his books and issues')) + '</p>' +
			'<ul>' + p.items.map(function (it) {
				return '<li><a href="' + e(it.h) + '">' + (it.c ? '<img src="' + e(it.c) + '" alt="" loading="lazy">' : '<i class="mp-nocover"></i>') +
					'<span><b>' + e(it.t) + '</b>' + (it.k ? '<small>' + e(it.k) + '</small>' : '') + '<q>' + mark(it.s) + '</q></span></a></li>';
			}).join('') + '</ul>';
		panel.hidden = false;
		panel.querySelector('.mp-x').onclick = function () { self.close(); };
		try { history.replaceState(null, '', '#' + encodeURIComponent(p.en)); } catch (err) {}
	},

	close: function () {
		var panel = document.querySelector('.mp-panel');
		if (panel) panel.hidden = true;
		document.querySelectorAll('.mp-pin.is-on').forEach(function (g) { g.classList.remove('is-on'); });
		document.querySelectorAll('.mp-chips .chip').forEach(function (b) { b.setAttribute('aria-pressed', 'false'); });
		try { history.replaceState(null, '', location.pathname + location.search); } catch (err) {}
	},

	onHash: function () {}
};

/* world.html — «حول العالم»: his books in other languages, from the editions the site records (AKT.bookInfo[...].editions with
   a lang other than Arabic). A shelf a language — its name in its own script, the books, each edition's cover, title as
   printed, translator, publisher and year — linked to the book's page. */
window.PAGE = {
	id: 'world',
	title: { ar: 'حول العالم', en: 'Around the world' },
	strings: {
		eyebrow: { ar: 'مترجمًا', en: 'In translation' },
		title: { ar: 'حول العالم', en: 'Around the world' },
		lead: {
			ar: 'كتبه بلغات أخرى: «يوتوبيا» بالإنجليزية والفرنسية والألمانية والإيطالية والفنلندية، ومقالاته وقصصه بالفارسية والمالايالامية — كل طبعة بغلافها ومترجمها وناشرها.',
			en: 'His books in other languages: Utopia in English, French, German, Italian and Finnish, his essays and stories in Persian and Malayalam — each edition with its cover, translator and publisher.'
		}
	},
	LANGS: {
		en: { ar: 'الإنجليزية', en: 'English', own: 'English' }, fr: { ar: 'الفرنسية', en: 'French', own: 'Français' },
		de: { ar: 'الألمانية', en: 'German', own: 'Deutsch' }, it: { ar: 'الإيطالية', en: 'Italian', own: 'Italiano' },
		fi: { ar: 'الفنلندية', en: 'Finnish', own: 'Suomi' }, fa: { ar: 'الفارسية', en: 'Persian', own: 'فارسی' },
		ml: { ar: 'المالايالامية', en: 'Malayalam', own: 'മലയാളം' }
	},

	/* every foreign edition: { lang, id, w (the book), ed } */
	editions: function () {
		var d = window.App.data(), out = [];
		Object.keys(d.bookInfo || {}).forEach(function (id) {
			var w = window.App.findWork(id);
			if (!w) return;
			(d.bookInfo[id].editions || []).forEach(function (ed) { if (ed.lang && ed.lang !== 'ar') out.push({ lang: ed.lang, id: id, w: w, ed: ed }); });
		});
		return out;
	},

	/* the country each language's editions went to, for the band's globe */
	LAND: { en: 'GB', fr: 'FR', de: 'DE', it: 'IT', fi: 'FI', fa: 'IR', ml: 'IN' },

	/* the band: amCharts' «Map Sankey» pen (codepen.io/amcharts/pen/OPRwxBd) — a globe turning slowly, a stream from Egypt to the
	   land of each language he was translated into, as wide as its editions, small books travelling along it; a switch from the
	   globe to a flat map, and back. amCharts 5 comes from its own CDN on this page only; the globe alone, fading in once drawn */
	band: function (d, A) {
		var self = window.PAGE; /* (page-hero.js calls this unbound) */
		setTimeout(function () { self.globe(A); }, 0);
		/* (dir=ltr: amCharts draws on a canvas, which takes the page's right-to-left and set every Arabic label off to one side of
		   its place; Arabic still reads right to left within it) */
		return '<div class="wd-chart" id="wd-chart" dir="ltr"></div>';
	},

	/* amCharts' scripts, once, one after the other */
	AM: ['index.js', 'map.js', 'geodata/worldLow.js', 'themes/Animated.js'],
	load: function () {
		if (this._load) return this._load;
		var AM = this.AM;
		return (this._load = AM.reduce(function (p, f) {
			return p.then(function () {
				return new Promise(function (ok, no) {
					var s = document.createElement('script');
					s.src = 'https://cdn.amcharts.com/lib/5/' + f; s.async = false;
					s.onload = ok; s.onerror = no;
					document.head.appendChild(s);
				});
			});
		}, Promise.resolve()));
	},

	globe: function (A) {
		var self = this, el = document.getElementById('wd-chart');
		if (!el) return;
		this.load().then(function () {
			if (!document.body.contains(el) || !window.am5 || !window.am5map || !am5map.MapSankeySeries) return;
			if (self.root) { self.root.dispose(); self.root = null; }
			self.draw(el, A);
			el.closest('.ph').classList.add('wd-live');
			el.closest('.ph').removeAttribute('aria-hidden'); /* (this band is a control, not a decoration) */
		}).catch(function () {});
	},

	draw: function (el, A) {
		var L = A.L, self = this, light = document.documentElement.getAttribute('data-theme') === 'light';
		var still = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
		var root = this.root = am5.Root.new(el, { tapToActivate: true, tapToActivateTimeout: 3000 });
		var c = function (x) { return am5.color(x); };
		/* the site's colours: the night's ink, the paper, the ember */
		var ink = c(light ? 0x2a2017 : 0xefe6d2), sea = c(light ? 0xdfd2bb : 0x10141c), land = c(light ? 0xf3ebdc : 0x1b2029),
			edge = c(light ? 0xc8b79a : 0x2c3440), ember = c(0xe0633a), deep = c(0xb8451f), lit = c(light ? 0xe8b48f : 0x6b3a26), egypt = c(0xe0633a);
		var theme = am5.Theme.new(root);
		theme.rule('InterfaceColors').setAll({
			primaryButton: deep, primaryButtonHover: ember, primaryButtonDown: deep, primaryButtonActive: ember, primaryButtonText: c(0xffffff),
			secondaryButton: c(light ? 0xe9dcc4 : 0x262c36), secondaryButtonHover: c(light ? 0xdccbb0 : 0x323a46), secondaryButtonDown: deep,
			secondaryButtonText: ink, background: c(light ? 0xe9dcc4 : 0x1b2029), text: ink
		});
		theme.rule('Label').setAll({ fontFamily: getComputedStyle(document.body).fontFamily });
		root.setThemes(still ? [theme] : [am5themes_Animated.new(root), theme]);

		var chart = root.container.children.push(am5map.MapChart.new(root, {
			panX: 'rotateX', panY: 'rotateY', wheelY: 'none', projection: am5map.geoOrthographic(),
			rotationX: -30, rotationY: -25, minZoomLevel: 0.5, zoomLevel: 0.9
		}));
		/* the sea, the lines of the globe, the countries */
		var bg = chart.series.push(am5map.MapPolygonSeries.new(root, {}));
		bg.mapPolygons.template.setAll({ fill: sea, fillOpacity: 1, strokeOpacity: 0 });
		bg.data.push({ geometry: am5map.getGeoRectangle(90, 180, -90, -180) });
		var grat = chart.series.push(am5map.GraticuleSeries.new(root, {}));
		grat.mapLines.template.setAll({ stroke: edge, strokeOpacity: 0.5, strokeWidth: 0.5 });
		var countries = chart.series.push(am5map.MapPolygonSeries.new(root, { geoJSON: am5geodata_worldLow, exclude: ['AQ'] }));
		countries.mapPolygons.template.setAll({ fill: land, stroke: edge, strokeWidth: 0.5, strokeOpacity: 0.9 });

		/* the streams: Egypt to each language's land, its editions */
		var by = {};
		this.editions().forEach(function (x) { by[x.lang] = (by[x.lang] || 0) + 1; });
		var name = function (k) { var l = self.LANGS[k] || { ar: k, en: k }; return L(l.ar, l.en); };
		var flows = Object.keys(by).filter(function (k) { return self.LAND[k]; }).map(function (k) { return { sourceId: 'EG', targetId: self.LAND[k], value: by[k], lang: name(k) }; });
		var lands = {}; flows.forEach(function (f) { lands[f.targetId] = f.lang; });
		countries.events.on('datavalidated', function () {
			am5.array.each(countries.dataItems, function (di) {
				var id = di.get('id');
				if (id === 'EG') di.get('mapPolygon').setAll({ fill: egypt });
				else if (lands[id]) di.get('mapPolygon').setAll({ fill: lit });
			});
		});
		var sankey = chart.series.push(am5map.MapSankeySeries.new(root, { polygonSeries: countries, maxWidth: 3, controlPointDistance: 0.35, resolution: 60, nodePadding: 0.3 }));
		/* each Arabic line marked right to left (U+202B … U+202C) in the chart's left-to-right box, or «4 طبعات» reads «طبعات 4» */
		var rl = function (x) { return A.lang === 'en' ? x : '‫' + x + '‬'; };
		var eds = function (v) { return A.num(v) + ' ' + L(v === 1 ? 'طبعة' : v === 2 ? 'طبعتان' : v <= 10 ? 'طبعات' : 'طبعة', v === 1 ? 'edition' : 'editions'); };
		sankey.mapPolygons.template.setAll({ fill: ember, fillOpacity: 0.7, strokeOpacity: 0, tooltipText: '{lang}' });
		sankey.mapPolygons.template.adapters.add('tooltipText', function (text, target) {
			var x = target.dataItem && target.dataItem.dataContext;
			return x ? rl(L('من مصر إلى ', 'From Egypt into ') + x.lang) + '\n' + rl(eds(x.value)) : text;
		});
		sankey.nodes.mapPolygons.template.setAll({ fill: deep, stroke: ink, strokeWidth: 1, fillOpacity: 0.95, strokeOpacity: 0.8, tooltipText: '{name}' });
		/* a small book along each stream */
		if (!still) sankey.bullets.push(function () {
			return am5.Bullet.new(root, { locationX: 0, autoRotate: true, sprite: am5.Graphics.new(root, {
				svgPath: 'M-5,-3.5 L4,-3.5 L4,3.5 L-5,3.5 Z M-3.5,-3.5 L-3.5,3.5', fill: ink, stroke: deep, strokeWidth: 0.8,
				centerX: am5.p50, centerY: am5.p50, scale: 0.6, visible: false }) });
		});
		sankey.data.setAll(flows);
		sankey.events.on('datavalidated', function () {
			am5.array.each(sankey.nodes.dataItems, function (di) {
				var id = di.get('id');
				di.set('name', rl(id === 'EG' ? L('مصر، حيث كتب', 'Egypt, where he wrote') : lands[id] ? lands[id] : id));
			});
			if (still) return;
			am5.array.each(sankey.dataItems, function (di) {
				am5.array.each(di.bullets || [], function (b) {
					var dur = 3500 + Math.random() * 3000;
					setTimeout(function () {
						var s = b.get('sprite'); if (s) s.set('visible', true);
						b.animate({ key: 'locationX', from: 0, to: 1, duration: dur, easing: am5.ease.linear, loops: Infinity });
					}, Math.random() * dur);
				});
			});
		});

		/* the globe / map switch, as the pen's — the site's own button, in the band beside the chart (amCharts' labels do not measure
		   Arabic well at this size) */
		var rtl = A.lang !== 'en';
		var btn = document.createElement('button');
		btn.type = 'button'; btn.className = 'wd-switch'; btn.setAttribute('aria-pressed', 'false');
		btn.innerHTML = '<span>' + A.esc(L('كرة', 'Globe')) + '</span><i aria-hidden="true"></i><span>' + A.esc(L('خريطة', 'Map')) + '</span>';
		el.parentNode.appendChild(btn);
		var ease = am5.ease.inOut(am5.ease.cubic), dur = 1500, fade = 300;
		var toGlobe = function () {
			chart.set('projection', am5map.geoOrthographic()); chart.set('panX', 'rotateX'); chart.set('panY', 'rotateY');
			chart.animate({ key: 'rotationX', to: -30, duration: dur, easing: ease }); chart.animate({ key: 'rotationY', to: -25, duration: dur, easing: ease });
			bg.mapPolygons.template.set('fillOpacity', 1); chart.set('minZoomLevel', 0.9); chart.set('homeGeoPoint', undefined); chart.set('homeZoomLevel', 0.9);
			setTimeout(function () { chart.goHome(dur); }, 120); /* (centred again: the flat map's pan is left over) */ chart.animate({ key: 'zoomLevel', to: 0.9, duration: dur, easing: ease });
		};
		var toMap = function () {
			chart.set('projection', am5map.geoMercator()); chart.set('panX', 'translateX'); chart.set('panY', 'translateY');
			chart.set('rotationX', 0); chart.set('rotationY', 0); /* (at once, while it is faded out: its home is found on the flat map) */
			bg.mapPolygons.template.set('fillOpacity', 0); chart.set('minZoomLevel', 1);
			/* (the band is wide and low: its home closer in, on where all the streams run, from Europe to India — and there once the
			   flat projection has taken) */
			chart.set('homeGeoPoint', { longitude: 40, latitude: 40 }); chart.set('homeZoomLevel', 2.4);
			setTimeout(function () { chart.goHome(dur); }, 120);
		};
		btn.addEventListener('click', function () {
			var on = btn.getAttribute('aria-pressed') !== 'true';
			btn.setAttribute('aria-pressed', String(on));
			stop();
			/* fade out, change the projection, fade in (each sets its own turn and zoom) */
			chart.seriesContainer.animate({ key: 'opacity', to: 0, duration: fade });
			setTimeout(function () { if (on) toMap(); else toGlobe(); chart.seriesContainer.animate({ key: 'opacity', to: 1, duration: fade }); }, fade);
		});
		var zc = chart.set('zoomControl', am5map.ZoomControl.new(root, { x: am5.percent(rtl ? 11 : 89), centerX: rtl ? 0 : am5.percent(100) }));
		zc.homeButton.set('visible', true);
		if (el.offsetWidth < 640) zc.set('forceHidden', true); /* (on a phone they cover the globe; a pinch zooms) */

		/* it turns by itself until the reader takes hold of it */
		var spin = still ? null : chart.animate({ key: 'rotationX', from: -30, to: 330, duration: 120000, loops: Infinity, easing: am5.ease.linear });
		var stop = function () { if (spin) { spin.stop(); spin = null; } };
		chart.chartContainer.events.on('pointerdown', stop);
		chart.appear(1000, 100);
	},

	render: function () {
		var App = window.App, S = window.WorksShared, e = App.esc, t = App.t, L = App.L, self = this;
		var all = this.editions(), by = {};
		all.forEach(function (x) { (by[x.lang] = by[x.lang] || []).push(x); });
		var langs = Object.keys(by).sort(function (a, b) { return by[b].length - by[a].length; });
		var books = {}; all.forEach(function (x) { books[x.id] = 1; });
		var name = function (k) { var l = self.LANGS[k] || { ar: k, en: k, own: k }; return L(l.ar, l.en); };
		document.getElementById('content').innerHTML = '<section class="section wd"><div class="wrap">' +
			'<div class="wd-sum">' +
				'<div><b>' + e(App.num(langs.length)) + '</b><span>' + e(L('لغات', 'languages')) + '</span></div>' +
				'<div><b>' + e(App.num(Object.keys(books).length)) + '</b><span>' + e(L('كتب مترجمة', 'books translated')) + '</span></div>' +
				'<div><b>' + e(App.num(all.length)) + '</b><span>' + e(L('طبعة', 'editions')) + '</span></div>' +
			'</div>' +
			'<nav class="wd-langs chips">' + langs.map(function (k) {
				return '<a class="chip" href="#wd-' + k + '">' + e(name(k)) + ' <b>' + e(App.num(by[k].length)) + '</b></a>';
			}).join('') + '</nav>' +
			langs.map(function (k) {
				var l = self.LANGS[k] || {};
				return '<section class="wd-lang" id="wd-' + k + '"><h2>' + e(name(k)) + ' <span lang="' + k + '">' + e(l.own || '') + '</span></h2><div class="wd-row">' +
					by[k].slice().sort(function (a, b) { return (a.ed.year || 9999) - (b.ed.year || 9999); }).map(function (x) {
						var ed = x.ed, cover = S.coverOf(ed);
						return '<article class="wd-ed">' +
							'<a class="wd-cover" href="' + e(S.bookHref(x.id)) + '">' + (cover ? '<img src="' + e(cover) + '" alt="" loading="lazy">' : '<i></i>') + '</a>' +
							'<div><h3 lang="' + k + '" dir="auto">' + e(t(ed.title) || t(x.w.title)) + '</h3>' +
							'<p class="wd-of">' + e(L('ترجمة «', 'A translation of ')) + '<a href="' + e(S.bookHref(x.id)) + '">' + e(t(x.w.title)) + '</a>' + e(L('»', '')) + '</p>' +
							(ed.translator ? '<p>' + e(L('ترجمة: ', 'Translated by ')) + e(t(ed.translator)) + '</p>' : '') +
							'<p class="wd-pub">' + e(t(ed.publisher)) + (ed.year ? ' · ' + e(App.num(ed.year)) : '') + '</p>' +
							(ed.source ? '<a class="wd-src" href="' + e(ed.source) + '" target="_blank" rel="noopener">' + e(L('المصدر ↗', 'Source ↗')) + '</a>' : '') +
							'</div></article>';
					}).join('') + '</div></section>';
			}).join('') +
			'<p class="wd-note">' + e(L('هذه الطبعات التي عرفها الموقع؛ إن كانت لديك طبعة مترجمة غيرها فاقترح إضافتها من صفحة «تواصل».', 'These are the editions the site knows of; if you know another translation, suggest it from the Contact page.')) + '</p>' +
		'</div></section>';
	}
};

/* My lists — for readers (want to read / read) and collectors (in my collection / looking for).
   Adapted from Codrops' "Drag and Drop Interaction Ideas" (bottom slide): start dragging any
   book or issue cover and a panel slides up from the bottom with the lists to drop it on.
   Rebuilt with pointer events instead of Draggabilly (a long press starts the drag on touch).
   Collectors say which editions they have or look for, and a shelf of every book and issue lights up what is in the lists.
   The lists live in this browser (localStorage) and can be exported as JSON, CSV or text,
   and imported back. Loaded on every page after app.js. */
(function () {
	'use strict';

	var KEY = 'akt-lists';
	var LISTS = {
		toread: { mode: 'reader', ar: 'سأقرؤه', en: 'Want to read', icon: 'M6 3h12v18l-6-4-6 4z' },
		read: { mode: 'reader', ar: 'قرأته', en: 'Read', icon: 'M5 12.5l4.5 4.5L19 7.5' },
		own: { mode: 'collector', ar: 'في مكتبتي', en: 'In my collection', icon: 'M4 4h4v16H4zM10 4h4v16h-4zM16.5 4.5l3.6 1-3.9 15-3.6-1z' },
		want: { mode: 'collector', ar: 'أبحث عنه', en: 'Looking for it', icon: 'M10.5 4a6.5 6.5 0 1 1 0 13 6.5 6.5 0 0 1 0-13zM15.5 15.5L20 20' }
	};
	var MODES = {
		reader: { ar: 'قارئ', en: 'Reader', lists: ['toread', 'read'], done: 'read' },
		collector: { ar: 'مقتنٍ', en: 'Collector', lists: ['own', 'want'], done: 'own' }
	};

	var state = load();
	function blank() { return { mode: 'reader', lists: { toread: [], read: [], own: [], want: [] } }; }
	function load() {
		var s = blank();
		try {
			var raw = JSON.parse(localStorage.getItem(KEY) || 'null');
			if (raw && raw.lists) {
				if (MODES[raw.mode]) s.mode = raw.mode;
				Object.keys(s.lists).forEach(function (k) { if (Array.isArray(raw.lists[k])) s.lists[k] = raw.lists[k].filter(function (x) { return x && x.key; }); });
			}
		} catch (e) {}
		return s;
	}
	function save() { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) {} }

	var App = function () { return window.App; };
	var L = function (ar, en) { return App() && App().lang === 'en' ? en : ar; };
	var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
	var tt = function (o) { return !o ? '' : typeof o === 'string' ? o : (App() && App().lang === 'en' ? (o.en || o.ar) : (o.ar || o.en)) || ''; };
	var icon = function (k) { return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="' + LISTS[k].icon + '" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>'; };

	/* ---------- items ---------- */

	/* a link to a book, an issue or a series → its list key */
	function keyOf(a) {
		var k = a && a.getAttribute && a.getAttribute('data-ls-key');
		if (k && /^[bs]:/.test(k)) return k;
		var href = a && a.getAttribute('href') || '';
		var m = /(?:^|\/)(book|series)\.html\?id=([^&#]+)/.exec(href);
		return m ? (m[1] === 'book' ? 'b:' : 's:') + decodeURIComponent(m[2]) : '';
	}

	/* a snapshot of the item, so the lists can be shown (and exported) on any page */
	function describe(key, a) {
		var S = window.WorksShared, d = App() ? App().data() : {}, id = key.slice(2);
		var rec = { key: key, href: (key[0] === 'b' ? 'book.html?id=' : 'series.html?id=') + encodeURIComponent(id), title: null, series: null, sid: '', n: null, img: '', color: '', added: new Date().toISOString() };
		try {
			if (S && key[0] === 'b') {
				var r = S.resolveBook(id);
				if (r && r.kind === 'work') { rec.title = r.item.title; rec.img = S.coverOf(r.info); rec.color = r.item.color || ''; }
				else if (r) {
					rec.title = r.item.title; rec.series = r.series.s.title; rec.sid = r.series.s.id;
					rec.n = r.special ? null : (r.item.n != null ? r.item.n : null);
					rec.img = S.coverOf(r.info) || r.item.cover || ''; rec.color = r.series.s.color || '';
				}
			} else if (S && key[0] === 's') {
				var ser = S.anySeries(id);
				if (ser) { rec.title = ser.s.title; rec.series = { ar: 'سلسلة', en: 'Series' }; rec.sid = id; rec.img = S.coverOf(ser.info); rec.color = ser.s.color || ''; }
			}
		} catch (e) {}
		if (!rec.title) {
			/* not in the data (or shared.js not loaded): take what the link shows */
			var im = a && a.querySelector('img');
			var text = a && ((a.getAttribute('aria-label') || '').trim() || (im && im.alt) || (a.textContent || '').replace(/\s+/g, ' ').trim()) || id;
			rec.title = { ar: text, en: text };
			if (im && !rec.img) rec.img = im.currentSrc || im.src;
		}
		if (rec.img && !/^(https?:|data:)/.test(rec.img)) rec.img = new URL(rec.img, location.href).href.replace(location.href.replace(/[^/]*$/, ''), '');
		return rec;
	}

	function has(list, key) { return state.lists[list].some(function (x) { return x.key === key; }); }
	function add(list, rec) {
		if (has(list, rec.key)) return false;
		/* "want to read" and "read" exclude each other, so do "looking for it" and "in my collection" */
		var other = { toread: 'read', read: 'toread', own: 'want', want: 'own' }[list];
		state.lists[other] = state.lists[other].filter(function (x) { return x.key !== rec.key; });
		state.lists[list].unshift(rec);
		save(); changed();
		return true;
	}
	function remove(list, key) { state.lists[list] = state.lists[list].filter(function (x) { return x.key !== key; }); save(); changed(); }
	/* put an item at a position in a list (the same list to reorder, the other one to move it) */
	function move(from, key, to, index) {
		var rec = null;
		state.lists[from] = state.lists[from].filter(function (x) { if (x.key === key) { rec = x; return false; } return true; });
		if (!rec) return;
		state.lists[to] = state.lists[to].filter(function (x) { return x.key !== key; });
		index = Math.max(0, Math.min(index, state.lists[to].length));
		state.lists[to].splice(index, 0, rec);
		save(); changed();
	}
	function total() { var n = 0; Object.keys(state.lists).forEach(function (k) { n += state.lists[k].length; }); return n; }

	/* ---------- the panel ---------- */

	var panel, overlay, fab, live, dragging = false;

	function build() {
		overlay = document.createElement('div');
		overlay.className = 'ls-overlay';
		overlay.addEventListener('click', close);

		panel = document.createElement('div');
		panel.className = 'ls-panel';
		panel.id = 'ls-panel';
		panel.setAttribute('role', 'dialog');
		panel.setAttribute('aria-modal', 'true');
		panel.setAttribute('aria-hidden', 'true');
		panel.addEventListener('click', onPanelClick);
		panel.addEventListener('pointerdown', onGripDown);
		panel.addEventListener('keydown', onGripKey);
		panel.addEventListener('change', onImport);
		panel.addEventListener('toggle', function (ev) {
			var g = ev.target.closest && ev.target.closest('.ls-shelf-g');
			if (g) { shelfOpen = shelfOpen || {}; shelfOpen[g.getAttribute('data-g')] = g.open; }
		}, true);
		panel.addEventListener('keydown', function (ev) { if (ev.key === 'Escape') close(); });

		fab = document.createElement('button');
		fab.type = 'button';
		fab.className = 'ls-fab';
		fab.setAttribute('aria-controls', 'ls-panel');
		fab.addEventListener('click', function () { open(); });

		live = document.createElement('div');
		live.className = 'ls-live';
		live.setAttribute('aria-live', 'polite');

		document.body.appendChild(panel);
		document.body.appendChild(overlay);
		document.body.appendChild(fab);
		document.body.appendChild(live);
		renderFab();
	}

	function renderFab() {
		if (!fab) return;
		var n = total();
		fab.innerHTML = icon(state.mode === 'reader' ? 'toread' : 'own') + '<span class="ls-fab-t">' + L('قوائمي', 'My lists') + '</span>' +
			(n ? '<span class="ls-fab-n">' + esc(App() ? App().num(n) : n) + '</span>' : '');
		fab.setAttribute('aria-label', L('قوائمي', 'My lists') + (n ? ' (' + n + ')' : ''));
	}

	function itemHtml(list, x) {
		var App_ = App();
		var num = x.n != null ? '#' + (App_ ? App_.num(x.n) : x.n) : '';
		/* a collector's item: which editions, and a key to choose them when the book has more than one */
		var eds = LISTS[list].mode === 'collector' && x.key[0] === 'b' ? editionsOf(x.key) : [];
		var edLine = (x.eds || []).length ? tt(x.eds[0].label) + (x.eds.length > 1 ? L(' و', ' + ') + (App_ ? App_.num(x.eds.length - 1) : x.eds.length - 1) + L(' غيرها', ' more') : '') : '';
		return '<li class="ls-item" data-key="' + esc(x.key) + '">' +
			'<button type="button" class="ls-grip" data-grip="' + esc(list) + '" data-key="' + esc(x.key) + '" aria-label="' + esc(L('حرّك «', 'Move “') + tt(x.title) + L('» — الأسهم للترتيب والنقل', '” — arrow keys reorder and move')) + '">' +
				'<svg viewBox="0 0 12 20" aria-hidden="true"><g fill="currentColor"><circle cx="3" cy="4" r="1.6"/><circle cx="9" cy="4" r="1.6"/><circle cx="3" cy="10" r="1.6"/><circle cx="9" cy="10" r="1.6"/><circle cx="3" cy="16" r="1.6"/><circle cx="9" cy="16" r="1.6"/></g></svg></button>' +
			'<a href="' + esc(x.href) + '" class="ls-thumb" style="--c:' + esc(x.color || '#3a1414') + '">' +
				(x.img ? '<img src="' + esc(x.img) + '" alt="" loading="lazy" referrerpolicy="no-referrer" onerror="this.remove()">' : '') +
				(num ? '<span>' + esc(num) + '</span>' : '') + '</a>' +
			'<span class="ls-item-t"><a href="' + esc(x.href) + '">' + esc(tt(x.title)) + '</a>' +
				(x.series ? '<small>' + esc(tt(x.series)) + (num && x.sid ? ' ' + esc(num) : '') + '</small>' : '') +
				(eds.length > 1 ? '<button type="button" class="ls-ed-key" data-eds="' + esc(list) + '" data-key="' + esc(x.key) + '">' +
					(edLine ? esc(L('الطبعة: ', 'Edition: ') + edLine) : esc(L('أي طبعة؟', 'Which edition?'))) + ' <span aria-hidden="true">✎</span></button>'
					: edLine ? '<small>' + esc(edLine) + '</small>' : '') + '</span>' +
			'<button type="button" class="ls-x" data-remove="' + esc(list) + '" data-key="' + esc(x.key) + '" aria-label="' + esc(L('إزالة ', 'Remove ') + tt(x.title)) + '">×</button>' +
		'</li>';
	}

	/* the shelf: every book of his and every issue of his series, a place each; what is read (or owned) is lit,
	   what is wanted glows faintly, the rest waits in the dark. Each group shows how far along it is. */
	var shelfOpen = null;
	function shelfGroups() {
		var S = window.WorksShared, A = App();
		if (!S || !A) return [];
		var d = A.data(), groups = [];
		var works = (d.works || []).slice().sort(function (a, b) { return (a.year || 9999) - (b.year || 9999); });
		groups.push({ id: 'works', title: { ar: 'كتبه', en: 'His books' }, items: works.map(function (w) {
			return { key: 'b:' + w.id, title: w.title, img: S.coverOf((d.bookInfo || {})[w.id]), color: w.color || '' };
		}) });
		/* his own series, then the series he wrote or translated for (a book already on the shelf keeps its one place) */
		var placed = {};
		groups[0].items.forEach(function (x) { placed[x.key] = 1; });
		S.ownSeries().map(function (ser) { return [ser, false]; }).concat(S.contributedSeries().map(function (ser) { return [ser, true]; })).forEach(function (sc) {
			var ser = sc[0];
			var items = S.seriesIssues(ser.id).map(function (is) {
				var m = /book\.html\?id=([^&#]+)/.exec(A.issueHref(ser.id, is));
				var key = m ? 'b:' + decodeURIComponent(m[1]) : '';
				if (!key || placed[key]) return null;
				placed[key] = 1;
				return { key: key, title: is.title, n: is.n, img: S.issueCover(ser.id, is), color: ser.color || '' };
			}).filter(Boolean);
			if (items.length) groups.push({ id: ser.id, title: ser.title, items: items, part: sc[1] ? 'contrib' : '' });
		});
		/* a collector's shelf holds every book on the site: the series that grew out of his work, the books about him,
		   and the other writers' books he introduced, that introduced him or that were dedicated to him */
		if (state.mode === 'collector') {
			var more = function (id, title, list) {
				list = list.filter(function (x) { if (placed[x.key]) return false; placed[x.key] = 1; return true; });
				if (list.length) groups.push({ id: id, title: title, items: list, part: 'more' });
			};
			S.inspiredSeries().forEach(function (ser) {
				more(ser.id, ser.title, S.seriesIssues(ser.id).map(function (is) {
					var m = /book\.html\?id=([^&#]+)/.exec(A.issueHref(ser.id, is));
					return m ? { key: 'b:' + decodeURIComponent(m[1]), title: is.title, n: is.n, img: S.issueCover(ser.id, is), color: ser.color || '' } : null;
				}).filter(Boolean));
			});
			more('about', { ar: 'كتب عنه', en: 'Books about him' }, (d.aboutBooks || []).map(function (b) {
				return { key: 'b:' + b.id, title: b.title, img: b.cover || S.coverOf((d.bookInfo || {})[b.id]), color: '#3a2a1f' };
			}));
			var eb = S.entryBooks();
			[['introductions', { ar: 'كتب قدّم لها أو قُدّمت له', en: 'Books he introduced, or that introduced him' }], ['dedications', { ar: 'كتب أُهديت إليه', en: 'Books dedicated to him' }]].forEach(function (sh) {
				more('entry-' + sh[0], sh[1], eb.filter(function (x) { return x.shelf === sh[0]; }).map(function (x) {
					return { key: 'b:' + x.id, title: x.w.book, img: x.w.cover || '', color: '#3a2a1f' };
				}));
			});
		}
		return groups;
	}
	function shelfHtml() {
		var A = App(), mode = MODES[state.mode], wishList = mode.lists.filter(function (k) { return k !== mode.done; })[0];
		var done = {}, wish = {};
		state.lists[mode.done].forEach(function (x) { done[x.key] = 1; });
		state.lists[wishList].forEach(function (x) { wish[x.key] = 1; });
		var groups = shelfGroups();
		if (!groups.length) return '';
		return '<section class="ls-shelf"><h3>' + (state.mode === 'reader' ? L('رفّ القارئ', 'The reader’s shelf') : L('رفّ المقتني', 'The collector’s shelf')) + '</h3>' +
			'<p class="ls-hint">' + (state.mode === 'reader'
				? L('كل كتبه وأعداده في أماكنها: ما قرأته مضيء، وما تنوي قراءته يلمع خافتًا، والباقي ينتظرك في الظل.', 'All his books and issues in their places: what you have read is lit, what you mean to read glows faintly, and the rest waits in the dark.')
				: L('كل كتبه وأعداده في أماكنها: ما في مكتبتك مضيء، وما تبحث عنه يلمع خافتًا، والباقي ينتظرك في الظل.', 'All his books and issues in their places: what is in your collection is lit, what you are looking for glows faintly, and the rest waits in the dark.')) + '</p>' +
			groups.map(function (g, gi) {
				var lit = g.items.filter(function (x) { return done[x.key]; }).length, all = g.items.length;
				var isOpen = shelfOpen && g.id in shelfOpen ? shelfOpen[g.id] : lit > 0;
				var SUB = { contrib: L('سلاسل شارك فيها', 'Series he contributed to'), more: L('كتب من عالمه وعنه', 'Books from his world, and about him') };
				var sub = g.part && g.part !== (groups[gi - 1] || {}).part ? '<h4 class="ls-shelf-sub">' + SUB[g.part] + '</h4>' : '';
				return sub + '<details class="ls-shelf-g" data-g="' + esc(g.id) + '"' + (isOpen ? ' open' : '') + '><summary>' +
					'<span class="ls-p-t">' + esc(tt(g.title)) + '</span><span class="ls-bar" style="--p:' + Math.round(lit / all * 100) + '%"></span>' +
					'<span class="ls-p-n">' + esc(A.num(lit)) + ' / ' + esc(A.num(all)) + '</span></summary>' +
					'<div class="ls-slots">' + g.items.map(function (x) {
						var cls = done[x.key] ? ' is-lit' : wish[x.key] ? ' is-wish' : '';
						var label = (x.n != null ? '#' + A.num(x.n) + ' ' : '') + tt(x.title) + (done[x.key] ? ' — ' + tt(LISTS[mode.done]) : wish[x.key] ? ' — ' + tt(LISTS[wishList]) : '');
						return '<a class="ls-slot' + cls + '" href="' + esc('book.html?id=' + encodeURIComponent(x.key.slice(2))) + '" title="' + esc(label) + '" aria-label="' + esc(label) + '" style="--c:' + esc(x.color || '#3a1414') + '">' +
							(x.img ? '<img src="' + esc(x.img) + '" alt="" loading="lazy" decoding="async" referrerpolicy="no-referrer" onerror="this.remove()">' : '') +
							(x.n != null ? '<span>' + esc(A.num(x.n)) + '</span>' : '') + '</a>';
					}).join('') + '</div></details>';
			}).join('') + '</section>';
	}

	/* one list, a place to drop covers on */
	function zoneHtml(k) {
		var items = state.lists[k];
		return '<section class="ls-zone" data-list="' + k + '">' +
			'<h3>' + icon(k) + '<span>' + esc(tt(LISTS[k])) + '</span><b>' + esc(App() ? App().num(items.length) : items.length) + '</b></h3>' +
			'<ul class="ls-items">' + items.map(function (x) { return itemHtml(k, x); }).join('') + '</ul>' +
			(items.length ? '' : '<p class="ls-empty">' + L('لا شيء هنا بعد.', 'Nothing here yet.') + '</p>') +
			'<span class="ls-check" aria-hidden="true">✓</span>' +
		'</section>';
	}

	var dragView = false;
	function render() {
		if (!panel) return;
		panel.setAttribute('aria-label', L('قوائمي', 'My lists'));
		panel.innerHTML = '<div class="ls-inner">' +
			'<header class="ls-head">' +
				'<h2>' + L('قوائمي', 'My lists') + '</h2>' +
				'<div class="ls-mode" role="group" aria-label="' + esc(L('أنا', 'I am a')) + '">' + Object.keys(MODES).map(function (m) {
					return '<button type="button" data-mode="' + m + '" aria-pressed="' + (m === state.mode) + '">' + esc(tt(MODES[m])) + '</button>';
				}).join('') + '</div>' +
				'<button type="button" class="ls-close" data-close aria-label="' + esc(L('إغلاق', 'Close')) + '">×</button>' +
			'</header>' +
			'<p class="ls-hint ls-hint-drag">' + L('أفلِت الغلاف في القائمة التي تريدها.', 'Drop the cover on a list.') + '</p>' +
			'<p class="ls-hint ls-hint-browse">' + L('اسحب أي غلاف في الموقع (أو اضغط عليه مطوّلًا على الهاتف) لتضيفه إلى قائمة.', 'Drag any cover on the site (or long-press it on a phone) to add it to a list.') + '</p>' +
			/* while a cover is dragged, all four lists wait for it — the reader's two and the collector's two — each pair under its name */
			(dragView ? '<div class="ls-pairs">' : '') + (dragView ? Object.keys(MODES) : [state.mode]).map(function (m) {
				return (dragView ? '<div class="ls-pair"><h4>' + esc(tt(MODES[m])) + '</h4>' : '') + '<div class="ls-zones">' + MODES[m].lists.map(zoneHtml).join('') + '</div>' + (dragView ? '</div>' : '');
			}).join('') + (dragView ? '</div>' : '') +
			shelfHtml() +
			'<footer class="ls-tools">' +
				'<span class="ls-tools-l">' + L('تصدير', 'Export') + '</span>' +
				'<button type="button" data-export="json">JSON</button>' +
				'<button type="button" data-export="csv">CSV</button>' +
				'<button type="button" data-export="txt">' + L('نص', 'Text') + '</button>' +
				'<button type="button" data-export="copy">' + L('نسخ', 'Copy') + '</button>' +
				'<label class="ls-import">' + L('استيراد', 'Import') + '<input type="file" accept=".json,application/json"></label>' +
				(total() ? '<button type="button" class="ls-clear" data-clear>' + L('مسح القوائم', 'Clear lists') + '</button>' : '') +
			'</footer>' +
		'</div>';
	}

	function changed() { renderFab(); if (panel && panel.classList.contains('show')) render(); }

	var lastFocus = null;
	function open(drag) {
		if (!panel) return;
		dragView = !!drag;
		render();
		document.body.classList.toggle('ls-dragging', !!drag);
		panel.classList.add('show');
		overlay.classList.add('show');
		panel.setAttribute('aria-hidden', 'false');
		if (!drag) {
			lastFocus = document.activeElement;
			setTimeout(function () { var b = panel.querySelector('.ls-close'); if (b) b.focus(); }, 50);
		}
	}
	function close() {
		if (!panel) return;
		panel.classList.remove('show');
		overlay.classList.remove('show');
		panel.setAttribute('aria-hidden', 'true');
		document.body.classList.remove('ls-dragging');
		dragView = false;
		if (lastFocus && lastFocus.focus) { lastFocus.focus(); lastFocus = null; }
	}

	function onPanelClick(ev) {
		var b = ev.target.closest('button');
		if (!b) return;
		if (b.hasAttribute('data-close')) close();
		else if (b.hasAttribute('data-mode')) { state.mode = b.getAttribute('data-mode'); save(); render(); renderFab(); }
		else if (b.hasAttribute('data-remove')) remove(b.getAttribute('data-remove'), b.getAttribute('data-key'));
		else if (b.hasAttribute('data-eds')) chooseEditions(b.getAttribute('data-eds'), b.getAttribute('data-key'));
		else if (b.hasAttribute('data-export')) exportAs(b.getAttribute('data-export'), b);
		else if (b.hasAttribute('data-clear')) {
			if (window.confirm(L('مسح كل القوائم؟ صدّرها أولًا إن أردت الاحتفاظ بها.', 'Clear all lists? Export them first if you want to keep them.'))) {
				state.lists = blank().lists; save(); changed();
			}
		}
	}

	/* ---------- editions (collectors) ---------- */

	/* the editions we know of a book or issue, each told apart by its ISBN or ASIN, else by publisher, year and format */
	function editionsOf(key) {
		var S = window.WorksShared, r = null;
		if (!S || key[0] !== 'b') return [];
		try { r = S.resolveBook(key.slice(2)); } catch (e) {}
		var seen = {};
		return ((r && r.info && r.info.editions) || []).map(function (ed) {
			var both = function (lang) {
				var g = function (o) { return !o ? '' : typeof o === 'string' ? o : o[lang] || o.ar || o.en || ''; };
				return [g(ed.publisher), ed.year || '', g(ed.edition) || g(ed.format), ed.lang && ed.lang !== 'ar' ? ed.lang.toUpperCase() : ''].filter(Boolean).join(' · ');
			};
			var id = ed.isbn || ed.asin || both('ar');
			while (seen[id]) id += '+';
			seen[id] = 1;
			return { id: id, label: { ar: both('ar'), en: both('en') }, img: ed.cover || '' };
		});
	}

	/* after a book goes into a collector's list (or from its key there): which editions you have, or are looking for */
	var edBox = null;
	function chooseEditions(list, key) {
		var x = state.lists[list].filter(function (y) { return y.key === key; })[0], eds = editionsOf(key);
		if (!x || !eds.length) return;
		if (eds.length === 1) { x.eds = [{ id: eds[0].id, label: eds[0].label }]; save(); changed(); return; }
		var picked = {};
		(x.eds || []).forEach(function (e) { picked[e.id] = 1; });
		if (edBox) edBox.remove();
		edBox = document.createElement('div');
		edBox.className = 'ls-eds';
		edBox.setAttribute('role', 'dialog');
		edBox.setAttribute('aria-modal', 'true');
		edBox.setAttribute('aria-label', L('الطبعات', 'Editions'));
		edBox.innerHTML = '<div class="ls-eds-card">' +
			'<h3>' + L('أي طبعة من «', 'Which edition of “') + esc(tt(x.title)) + (list === 'own' ? L('» في مكتبتك؟', '” do you have?') : L('» تبحث عنها؟', '” are you looking for?')) + '</h3>' +
			'<p class="ls-hint">' + L('اختر طبعة أو أكثر، أو «أي طبعة» إن كانت أيها تكفي.', 'Pick one edition or more, or “Any edition” if any will do.') + '</p>' +
			'<div class="ls-ed-grid">' + eds.map(function (ed) {
				return '<label class="ls-ed"><input type="checkbox" value="' + esc(ed.id) + '"' + (picked[ed.id] ? ' checked' : '') + '>' +
					'<span class="ls-ed-c" style="--c:' + esc(x.color || '#3a1414') + '">' + (ed.img ? '<img src="' + esc(ed.img) + '" alt="" loading="lazy" referrerpolicy="no-referrer" onerror="this.remove()">' : '') + '<i aria-hidden="true">✓</i></span>' +
					'<span class="ls-ed-t">' + esc(tt(ed.label)) + '</span></label>';
			}).join('') + '</div>' +
			'<div class="ls-eds-act"><button type="button" class="ls-eds-save">' + L('حفظ', 'Save') + '</button>' +
			'<button type="button" class="ls-eds-any">' + L('أي طبعة', 'Any edition') + '</button></div></div>';
		document.body.appendChild(edBox);
		var done = function (chosen) {
			if (chosen) {
				x.eds = eds.filter(function (ed) { return chosen.indexOf(ed.id) >= 0; }).map(function (ed) { return { id: ed.id, label: ed.label }; });
				save(); changed();
				say(x.eds.length ? L('حُفظت الطبعة: ', 'Edition saved: ') + x.eds.map(function (e) { return tt(e.label); }).join(L('، ', ', ')) : L('أي طبعة تكفي.', 'Any edition will do.'));
			}
			edBox.remove(); edBox = null;
		};
		edBox.addEventListener('click', function (ev) {
			if (ev.target === edBox) done(null);
			else if (ev.target.closest('.ls-eds-save')) done([].map.call(edBox.querySelectorAll('input:checked'), function (i) { return i.value; }));
			else if (ev.target.closest('.ls-eds-any')) done([]);
		});
		edBox.addEventListener('keydown', function (ev) { if (ev.key === 'Escape') { ev.stopPropagation(); done(null); } });
		setTimeout(function () { var f = edBox && edBox.querySelector('input'); if (f) f.focus(); }, 30);
	}

	/* ---------- export / import ---------- */

	function rowsFor(list) {
		return state.lists[list].map(function (x) {
			return { list: list, title_ar: (x.title || {}).ar || '', title_en: (x.title || {}).en || '', series_ar: (x.series || {}).ar || '', series_en: (x.series || {}).en || '', number: x.n != null ? x.n : '', editions: (x.eds || []).map(function (e) { return tt(e.label); }).join(' / '), url: new URL(x.href, location.href).href, added: (x.added || '').slice(0, 10) };
		});
	}
	function download(name, type, text) {
		var a = document.createElement('a');
		a.href = URL.createObjectURL(new Blob([text], { type: type }));
		a.download = name;
		document.body.appendChild(a); a.click(); a.remove();
		setTimeout(function () { URL.revokeObjectURL(a.href); }, 2000);
	}
	function asText() {
		var out = [L('قوائمي — أحمد خالد توفيق', 'My lists — Ahmed Khaled Tawfik'), ''];
		Object.keys(MODES).forEach(function (m) {
			MODES[m].lists.forEach(function (k) {
				var items = state.lists[k];
				if (!items.length) return;
				out.push(tt(MODES[m]) + ' · ' + tt(LISTS[k]) + ' (' + items.length + ')');
				items.forEach(function (x) { out.push('- ' + tt(x.title) + (x.series ? ' — ' + tt(x.series) + (x.n != null ? ' #' + x.n : '') : '') + ((x.eds || []).length ? ' [' + x.eds.map(function (e) { return tt(e.label); }).join(' / ') + ']' : '')); });
				out.push('');
			});
		});
		return out.join('\n');
	}
	function exportAs(kind, btn) {
		var stamp = new Date().toISOString().slice(0, 10);
		if (kind === 'json') {
			download('akt-lists-' + stamp + '.json', 'application/json', JSON.stringify({ app: 'akt-lists', version: 1, exported: new Date().toISOString(), lists: state.lists }, null, 2));
		} else if (kind === 'csv') {
			var cols = ['list', 'title_ar', 'title_en', 'series_ar', 'series_en', 'number', 'editions', 'url', 'added'];
			var rows = [].concat.apply([], Object.keys(state.lists).map(rowsFor));
			var q = function (v) { v = String(v); return /[",\n]/.test(v) ? '"' + v.replace(/"/g, '""') + '"' : v; };
			/* a BOM so spreadsheet apps read the Arabic as UTF-8 */
			download('akt-lists-' + stamp + '.csv', 'text/csv;charset=utf-8', '﻿' + [cols.join(',')].concat(rows.map(function (r) { return cols.map(function (c) { return q(r[c]); }).join(','); })).join('\r\n'));
		} else if (kind === 'txt') {
			download('akt-lists-' + stamp + '.txt', 'text/plain;charset=utf-8', asText());
		} else if (kind === 'copy') {
			var text = asText(), old = btn.textContent;
			var done = function () { btn.textContent = L('تم ✓', 'Done ✓'); setTimeout(function () { btn.textContent = old; }, 1400); };
			if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(done, function () {});
		}
	}
	function onImport(ev) {
		var input = ev.target;
		if (!input.files || !input.files[0]) return;
		var reader = new FileReader();
		reader.onload = function () {
			try {
				var data = JSON.parse(reader.result);
				if (!data || data.app !== 'akt-lists' || !data.lists) throw new Error('format');
				var added = 0;
				Object.keys(state.lists).forEach(function (k) {
					(data.lists[k] || []).forEach(function (x) {
						if (x && typeof x.key === 'string' && /^[bs]:/.test(x.key) && !has(k, x.key)) {
							state.lists[k].push({ key: x.key, href: (x.key[0] === 'b' ? 'book.html?id=' : 'series.html?id=') + encodeURIComponent(x.key.slice(2)), title: x.title, series: x.series || null, sid: x.sid || '', n: x.n != null ? x.n : null, img: typeof x.img === 'string' && /^(https:|assets\/)/.test(x.img) ? x.img : '', color: typeof x.color === 'string' && /^#[0-9a-f]{3,8}$/i.test(x.color) ? x.color : '', added: x.added || '',
									eds: Array.isArray(x.eds) ? x.eds.filter(function (e) { return e && typeof e.id === 'string' && e.label; }).map(function (e) { return { id: e.id, label: { ar: String(e.label.ar || ''), en: String(e.label.en || '') } }; }) : [] });
							added++;
						}
					});
				});
				save(); changed();
				say(L('استُورد ' + added + ' عنصرًا.', 'Imported ' + added + ' items.'));
			} catch (e) { say(L('هذا الملف ليس تصديرًا من قوائمي.', 'That file is not a My lists export.'), 'error'); }
		};
		reader.readAsText(input.files[0]);
	}
	/* messages go to the shared jelly notification; the old line stays as a fallback */
	function say(msg, type) {
		if (window.Notify) { window.Notify(msg, { type: type || 'success', title: L('قوائمي', 'My lists') }); return; }
		if (live) { live.textContent = msg; live.classList.add('show'); clearTimeout(say.t); say.t = setTimeout(function () { live.classList.remove('show'); }, 2600); }
	}

	/* ---------- drag (pointer events) ---------- */

	var DRAG_SEL = 'a[href*="book.html?id="], a[href*="series.html?id="], [data-ls-key]:not(.ls-buttons)';
	var pending = null, ghost = null, hot = null, suppressClick = false;

	function candidate(target) {
		var a = target.closest && target.closest(DRAG_SEL);
		if (!a || a.closest('.ls-panel, .ls-buttons, .site-header, .crumbs, .search-panel')) return null;
		/* the 3D books' own buttons (flip, look inside) stay buttons */
		var ctl = target.closest('button, input, select, textarea, label');
		if (ctl && ctl !== a) return null;
		return keyOf(a) ? a : null;
	}

	function onDown(ev) {
		if (ev.button !== 0 || dragging) return;
		var a = candidate(ev.target);
		if (!a) return;
		pending = { a: a, x: ev.clientX, y: ev.clientY, id: ev.pointerId, touch: ev.pointerType !== 'mouse' };
		if (pending.touch) pending.timer = setTimeout(function () { if (pending) start(pending.x, pending.y); }, 420);
	}
	function onMove(ev) {
		if (sorting) { ev.preventDefault(); sortMove(ev.clientX, ev.clientY); return; }
		if (dragging) { ev.preventDefault(); moveGhost(ev.clientX, ev.clientY); return; }
		if (!pending || ev.pointerId !== pending.id) return;
		var dx = ev.clientX - pending.x, dy = ev.clientY - pending.y, far = dx * dx + dy * dy > 64;
		if (pending.touch) { if (far) cancelPending(); else { pending.x = ev.clientX; pending.y = ev.clientY; } return; }
		if (far) start(ev.clientX, ev.clientY);
	}
	function onUp(ev) {
		if (sorting) { sortEnd(); return; }
		if (dragging) { finish(ev.clientX, ev.clientY); return; }
		cancelPending();
	}
	function cancelPending() { if (pending && pending.timer) clearTimeout(pending.timer); pending = null; }

	function start(x, y) {
		var a = pending.a;
		var key = keyOf(a);
		cancelPending();
		if (!key) return;
		dragging = { a: a, key: key, rec: describe(key, a) };
		/* the ghost: the cover if there is one, otherwise a small card with the title */
		var vis = a.querySelector('.mini-cover, img, .bk-cover, .hc-cover, .sh-image') || a;
		ghost = document.createElement('div');
		ghost.className = 'ls-ghost';
		var r = dragging.rec;
		ghost.innerHTML = r.img ? '<img src="' + esc(r.img) + '" alt="" referrerpolicy="no-referrer">' : '<span style="--c:' + esc(r.color || '#3a1414') + '">' + esc(tt(r.title)) + '</span>';
		if (vis) { var b = vis.getBoundingClientRect(); ghost.style.setProperty('--w', Math.max(60, Math.min(120, b.width)) + 'px'); }
		document.body.appendChild(ghost);
		moveGhost(x, y);
		document.body.classList.add('ls-drag-active');
		if (navigator.vibrate && a.matches(':active')) { try { navigator.vibrate(12); } catch (e) {} }
		open(true);
	}
	function moveGhost(x, y) {
		if (!ghost) return;
		ghost.style.transform = 'translate(' + (x - 30) + 'px,' + (y - 40) + 'px) rotate(-6deg)';
		var el = document.elementFromPoint(x, y);
		var z = el && el.closest('.ls-zone');
		if (z !== hot) { if (hot) hot.classList.remove('highlight'); hot = z; if (hot) hot.classList.add('highlight'); }
	}
	function finish(x, y) {
		var d = dragging, zone = hot;
		dragging = false; hot = null;
		suppressClick = true; setTimeout(function () { suppressClick = false; }, 60);
		document.body.classList.remove('ls-drag-active');
		if (zone) {
			zone.classList.remove('highlight');
			var list = zone.getAttribute('data-list');
			var isNew = add(list, d.rec);
			var z2 = panel.querySelector('.ls-zone[data-list="' + list + '"]') || zone;
			z2.classList.add('drop-feedback');
			say((isNew ? L('أُضيف «', 'Added “') : L('موجود بالفعل في «', 'Already in “')) + tt(d.rec.title) + (isNew ? L('» إلى ', '” to ') : L('» — ', '” — ')) + tt(LISTS[list]), isNew ? 'success' : 'notice');
			if (ghost) { ghost.classList.add('is-dropped'); }
			setTimeout(function () {
				close();
				if (LISTS[list].mode === 'collector') chooseEditions(list, d.key);
			}, 650);
		} else close();
		var g = ghost; ghost = null;
		if (g) setTimeout(function () { g.remove(); }, zone ? 300 : 0);
	}

	/* ---------- rearranging inside the panel ---------- */

	/* drag an item by its grip: up and down to reorder, across to the other list to move it */
	var sorting = null;
	function onGripDown(ev) {
		var g = ev.target.closest('.ls-grip');
		if (!g || ev.button !== 0) return;
		ev.preventDefault();
		var li = g.closest('.ls-item'), r = li.getBoundingClientRect();
		var ghostLi = li.cloneNode(true);
		ghostLi.className = 'ls-item ls-sort-ghost';
		ghostLi.style.width = r.width + 'px';
		document.body.appendChild(ghostLi);
		li.classList.add('ls-placeholder');
		document.body.classList.add('ls-sorting');
		sorting = { from: g.getAttribute('data-grip'), key: g.getAttribute('data-key'), li: li, ghost: ghostLi, dx: ev.clientX - r.left, dy: ev.clientY - r.top };
		try { g.setPointerCapture(ev.pointerId); } catch (e) {}
		sortMove(ev.clientX, ev.clientY);
	}
	function sortMove(x, y) {
		var s = sorting;
		s.ghost.style.transform = 'translate(' + (x - s.dx) + 'px,' + (y - s.dy) + 'px)';
		var el = document.elementFromPoint(x, y);
		var zone = el && el.closest('.ls-zone');
		if (zone) {
			var ul = zone.querySelector('.ls-items'), before = null;
			var items = [].slice.call(ul.children).filter(function (n) { return n !== s.li; });
			for (var i = 0; i < items.length; i++) {
				var b = items[i].getBoundingClientRect();
				if (y < b.top + b.height / 2) { before = items[i]; break; }
			}
			if (before) { if (s.li.nextSibling !== before) ul.insertBefore(s.li, before); }
			else if (ul.lastElementChild !== s.li) ul.appendChild(s.li);
			panel.querySelectorAll('.ls-zone').forEach(function (z) { z.classList.toggle('sort-target', z === zone); });
		}
		/* near the top or bottom edge, scroll the panel */
		if (y < 70) panel.scrollTop -= 14; else if (y > window.innerHeight - 70) panel.scrollTop += 14;
	}
	function sortEnd(cancel) {
		var s = sorting;
		sorting = null;
		s.ghost.remove();
		document.body.classList.remove('ls-sorting');
		if (cancel) { render(); return; }
		var ul = s.li.parentNode, to = ul.closest('.ls-zone').getAttribute('data-list');
		var index = [].indexOf.call(ul.children, s.li);
		move(s.from, s.key, to, index);
		if (to !== s.from) say(L('نُقل إلى ', 'Moved to ') + tt(LISTS[to]));
		focusGrip(to, s.key);
	}
	function focusGrip(list, key) {
		var g = [].slice.call(panel.querySelectorAll('.ls-zone[data-list="' + list + '"] .ls-grip')).filter(function (b) { return b.getAttribute('data-key') === key; })[0];
		if (g) g.focus();
	}

	/* the same from the keyboard: up / down reorder, left / right move to the other list */
	function onGripKey(ev) {
		var g = ev.target.closest && ev.target.closest('.ls-grip');
		if (!g) return;
		var from = g.getAttribute('data-grip'), key = g.getAttribute('data-key');
		var i = state.lists[from].map(function (x) { return x.key; }).indexOf(key), n = state.lists[from].length;
		var other = MODES[state.mode].lists.filter(function (k) { return k !== from; })[0];
		var to = from, at = i;
		if (ev.key === 'ArrowUp') at = i - 1;
		else if (ev.key === 'ArrowDown') at = i + 1;
		else if (ev.key === 'Home') at = 0;
		else if (ev.key === 'End') at = n - 1;
		else if (ev.key === 'ArrowLeft' || ev.key === 'ArrowRight') { to = other; at = 0; }
		else return;
		ev.preventDefault();
		if (to === from && (at < 0 || at >= n || at === i)) return;
		move(from, key, to, at);
		say(to !== from ? L('نُقل إلى ', 'Moved to ') + tt(LISTS[to])
			: L('الترتيب ', 'Position ') + App().num(at + 1) + L(' من ', ' of ') + App().num(n));
		focusGrip(to, key);
	}

	/* ---------- the buttons on a book page ---------- */

	function buttons(key) {
		return '<div class="ls-buttons" data-ls-key="' + esc(key) + '">' + Object.keys(MODES).map(function (m) {
			return '<span class="ls-btn-group"><span class="ls-btn-l">' + esc(tt(MODES[m])) + '</span>' + MODES[m].lists.map(function (k) {
				return '<button type="button" data-ls-toggle="' + k + '" aria-pressed="' + has(k, key) + '">' + icon(k) + esc(tt(LISTS[k])) + '</button>';
			}).join('') + '</span>';
		}).join('') + '</div>';
	}
	function syncButtons() {
		document.querySelectorAll('.ls-buttons').forEach(function (box) {
			var key = box.getAttribute('data-ls-key');
			box.querySelectorAll('[data-ls-toggle]').forEach(function (b) { b.setAttribute('aria-pressed', String(has(b.getAttribute('data-ls-toggle'), key))); });
		});
	}
	function onToggle(ev) {
		var b = ev.target.closest('[data-ls-toggle]');
		if (!b) return;
		var key = b.closest('.ls-buttons').getAttribute('data-ls-key'), list = b.getAttribute('data-ls-toggle');
		if (has(list, key)) remove(list, key);
		else {
			var a = document.querySelector('a[href="' + (key[0] === 'b' ? 'book.html?id=' : 'series.html?id=') + key.slice(2) + '"]');
			add(list, describe(key, a));
			say(L('أُضيف إلى ', 'Added to ') + tt(LISTS[list]));
			if (LISTS[list].mode === 'collector') chooseEditions(list, key);
		}
	}
	var _changed = changed;
	changed = function () { _changed(); syncButtons(); };

	/* ---------- boot ---------- */

	function init() {
		build();
		document.addEventListener('pointerdown', onDown);
		document.addEventListener('pointermove', onMove, { passive: false });
		document.addEventListener('pointerup', onUp);
		document.addEventListener('pointercancel', function () { if (sorting) sortEnd(true); else if (dragging) finish(-1, -1); else cancelPending(); });
		/* while dragging on touch, the finger moves the cover, not the page */
		document.addEventListener('touchmove', function (ev) { if (dragging || sorting) ev.preventDefault(); }, { passive: false });
		document.addEventListener('contextmenu', function (ev) { if (pending || dragging) ev.preventDefault(); });
		/* the browser's own link dragging would fight ours */
		document.addEventListener('dragstart', function (ev) { if (candidate(ev.target)) ev.preventDefault(); });
		document.addEventListener('click', function (ev) {
			if (suppressClick && ev.target.closest(DRAG_SEL)) { ev.preventDefault(); ev.stopPropagation(); }
		}, true);
		document.addEventListener('click', onToggle);
		document.addEventListener('keydown', function (ev) { if (ev.key === 'Escape' && panel.classList.contains('show')) close(); });
		/* the language toggle re-renders pages: keep the button's label in step */
		new MutationObserver(function () { renderFab(); if (panel.classList.contains('show')) render(); }).observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
	}
	if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();

	window.Lists = { buttons: buttons, open: open, add: add, has: has, editions: chooseEditions, state: function () { return state; } };
})();

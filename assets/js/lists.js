/* My lists — for readers (want to read / read) and collectors (in my collection / looking for).
   Adapted from Codrops' "Drag and Drop Interaction Ideas" (bottom slide): start dragging any
   book or issue cover and a panel slides up from the bottom with the lists to drop it on.
   Rebuilt with pointer events instead of Draggabilly (a long press starts the drag on touch).
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
		panel.addEventListener('change', onImport);
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
		return '<li class="ls-item">' +
			'<a href="' + esc(x.href) + '" class="ls-thumb" style="--c:' + esc(x.color || '#3a1414') + '">' +
				(x.img ? '<img src="' + esc(x.img) + '" alt="" loading="lazy" referrerpolicy="no-referrer" onerror="this.remove()">' : '') +
				(num ? '<span>' + esc(num) + '</span>' : '') + '</a>' +
			'<span class="ls-item-t"><a href="' + esc(x.href) + '">' + esc(tt(x.title)) + '</a>' +
				(x.series ? '<small>' + esc(tt(x.series)) + (num && x.sid ? ' ' + esc(num) : '') + '</small>' : '') + '</span>' +
			'<button type="button" class="ls-x" data-remove="' + esc(list) + '" data-key="' + esc(x.key) + '" aria-label="' + esc(L('إزالة ', 'Remove ') + tt(x.title)) + '">×</button>' +
		'</li>';
	}

	/* collectors and readers: how far along each series they are */
	function progressHtml() {
		var S = window.WorksShared, done = MODES[state.mode].done;
		if (!S) return '';
		var by = {};
		state.lists[done].forEach(function (x) { if (x.sid && x.key[0] === 'b') (by[x.sid] = by[x.sid] || []).push(x); });
		var rows = Object.keys(by).map(function (sid) {
			var ser = S.anySeries(sid), all = S.seriesIssues(sid).length;
			if (!ser || !all) return '';
			var have = Math.min(by[sid].length, all), pct = Math.round(have / all * 100);
			return '<li><span class="ls-p-t">' + esc(tt(ser.s.title)) + '</span>' +
				'<span class="ls-bar" style="--p:' + pct + '%"></span>' +
				'<span class="ls-p-n">' + esc(App().num(have)) + ' / ' + esc(App().num(all)) + '</span></li>';
		}).filter(Boolean);
		if (!rows.length) return '';
		return '<section class="ls-progress"><h3>' + (state.mode === 'reader' ? L('قرأت من السلاسل', 'Series read so far') : L('ما تملكه من السلاسل', 'Series collected so far')) + '</h3><ul>' + rows.join('') + '</ul></section>';
	}

	function render() {
		if (!panel) return;
		var mode = MODES[state.mode];
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
			'<div class="ls-zones">' + mode.lists.map(function (k) {
				var items = state.lists[k];
				return '<section class="ls-zone" data-list="' + k + '">' +
					'<h3>' + icon(k) + '<span>' + esc(tt(LISTS[k])) + '</span><b>' + esc(App() ? App().num(items.length) : items.length) + '</b></h3>' +
					(items.length ? '<ul class="ls-items">' + items.map(function (x) { return itemHtml(k, x); }).join('') + '</ul>'
						: '<p class="ls-empty">' + L('لا شيء هنا بعد.', 'Nothing here yet.') + '</p>') +
					'<span class="ls-check" aria-hidden="true">✓</span>' +
				'</section>';
			}).join('') + '</div>' +
			progressHtml() +
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
		if (lastFocus && lastFocus.focus) { lastFocus.focus(); lastFocus = null; }
	}

	function onPanelClick(ev) {
		var b = ev.target.closest('button');
		if (!b) return;
		if (b.hasAttribute('data-close')) close();
		else if (b.hasAttribute('data-mode')) { state.mode = b.getAttribute('data-mode'); save(); render(); renderFab(); }
		else if (b.hasAttribute('data-remove')) remove(b.getAttribute('data-remove'), b.getAttribute('data-key'));
		else if (b.hasAttribute('data-export')) exportAs(b.getAttribute('data-export'), b);
		else if (b.hasAttribute('data-clear')) {
			if (window.confirm(L('مسح كل القوائم؟ صدّرها أولًا إن أردت الاحتفاظ بها.', 'Clear all lists? Export them first if you want to keep them.'))) {
				state.lists = blank().lists; save(); changed();
			}
		}
	}

	/* ---------- export / import ---------- */

	function rowsFor(list) {
		return state.lists[list].map(function (x) {
			return { list: list, title_ar: (x.title || {}).ar || '', title_en: (x.title || {}).en || '', series_ar: (x.series || {}).ar || '', series_en: (x.series || {}).en || '', number: x.n != null ? x.n : '', url: new URL(x.href, location.href).href, added: (x.added || '').slice(0, 10) };
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
				items.forEach(function (x) { out.push('- ' + tt(x.title) + (x.series ? ' — ' + tt(x.series) + (x.n != null ? ' #' + x.n : '') : '')); });
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
			var cols = ['list', 'title_ar', 'title_en', 'series_ar', 'series_en', 'number', 'url', 'added'];
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
							state.lists[k].push({ key: x.key, href: (x.key[0] === 'b' ? 'book.html?id=' : 'series.html?id=') + encodeURIComponent(x.key.slice(2)), title: x.title, series: x.series || null, sid: x.sid || '', n: x.n != null ? x.n : null, img: typeof x.img === 'string' && /^(https:|assets\/)/.test(x.img) ? x.img : '', color: typeof x.color === 'string' && /^#[0-9a-f]{3,8}$/i.test(x.color) ? x.color : '', added: x.added || '' });
							added++;
						}
					});
				});
				save(); changed();
				say(L('استُورد ' + added + ' عنصرًا.', 'Imported ' + added + ' items.'));
			} catch (e) { say(L('هذا الملف ليس تصديرًا من قوائمي.', 'That file is not a My lists export.')); }
		};
		reader.readAsText(input.files[0]);
	}
	function say(msg) { if (live) { live.textContent = msg; live.classList.add('show'); clearTimeout(say.t); say.t = setTimeout(function () { live.classList.remove('show'); }, 2600); } }

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
		if (dragging) { ev.preventDefault(); moveGhost(ev.clientX, ev.clientY); return; }
		if (!pending || ev.pointerId !== pending.id) return;
		var dx = ev.clientX - pending.x, dy = ev.clientY - pending.y, far = dx * dx + dy * dy > 64;
		if (pending.touch) { if (far) cancelPending(); else { pending.x = ev.clientX; pending.y = ev.clientY; } return; }
		if (far) start(ev.clientX, ev.clientY);
	}
	function onUp(ev) {
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
			say((isNew ? L('أُضيف «', 'Added “') : L('موجود بالفعل في «', 'Already in “')) + tt(d.rec.title) + (isNew ? L('» إلى ', '” to ') : L('» — ', '” — ')) + tt(LISTS[list]));
			if (ghost) { ghost.classList.add('is-dropped'); }
			setTimeout(close, 650);
		} else close();
		var g = ghost; ghost = null;
		if (g) setTimeout(function () { g.remove(); }, zone ? 300 : 0);
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
		document.addEventListener('pointercancel', function () { if (dragging) finish(-1, -1); else cancelPending(); });
		/* while dragging on touch, the finger moves the cover, not the page */
		document.addEventListener('touchmove', function (ev) { if (dragging) ev.preventDefault(); }, { passive: false });
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

	window.Lists = { buttons: buttons, open: open, add: add, has: has, state: function () { return state; } };
})();

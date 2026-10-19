/* audio.html — every Audiohat audiobook of his, on one cassette */
window.PAGE = {
	id: 'audio',
	title: { ar: 'مسموع', en: 'Audiobooks' },
	strings: {
		eyebrow: { ar: 'كتب مسموعة', en: 'Audiobooks' },
		title: { ar: 'العرّاب مسموعًا', en: 'The Godfather, out loud' },
		lead: {
			ar: 'أعداد «ما وراء الطبيعة» و«فانتازيا» وحكايات «بعد منتصف الليل» كما سجّلتها Audiohat. اختر شريطًا، ثم اضغط تشغيل لتسمع العيّنة على موقعهم.',
			en: 'Beyond Nature and Fantasia issues, and the “After Midnight” stories, as recorded by Audiohat. Pick a tape, then press play to hear the sample on their site.'
		}
	},

	render: function () {
		var App = window.App, d = App.data(), S = window.WorksShared, e = App.esc, t = App.t, tx = App.tx, L = App.L;
		var A = d.audio;
		var root = document.getElementById('content');
		if (!A) { root.innerHTML = ''; return; }

		/* one long playlist: issues in series order, then the midnight programme */
		var tracks = [], groups = [];
		['mwt', 'fantasia'].forEach(function (sid) {
			var s = App.byId(d.series, sid);
			var rows = [];
			S.seriesIssues(sid).forEach(function (is) {
				var key = sid + '-' + is.n;
				if (!A.issues[key] || is.part > 1) return;
				var start = tracks.length;
				window.Cassette.issueTracks(key, t(is.title)).forEach(function (tr) { tr.sub = t(s.title) + ' #' + App.num(is.n) + (tr.sub !== 'Audiohat' ? ' · ' + tr.sub : ''); tracks.push(tr); });
				rows.push({ n: is.n, title: is.title, href: App.issueHref(sid, is), start: start, count: tracks.length - start, mins: A.issues[key].reduce(function (m, ep) { return m + (ep[1] || 0); }, 0) });
			});
			if (rows.length) groups.push({ title: s.title, total: S.seriesIssues(sid).length, rows: rows });
		});
		var midStart = tracks.length;
		A.midnight.forEach(function (m) {
			tracks.push({ title: m[0], sub: L('برنامج «بعد منتصف الليل»', 'After Midnight programme'), url: A.base + encodeURIComponent(m[1]).replace(/%28/g, '(').replace(/%29/g, ')'), mins: m[2] });
		});
		groups.push({
			title: { ar: 'بعد منتصف الليل', en: 'After Midnight' },
			note: { ar: 'برنامج من Audiohat لقصص قصيرة له.', en: 'An Audiohat programme of his short stories.' },
			rows: A.midnight.map(function (m, k) { return { title: { ar: m[0], en: m[0] }, start: midStart + k, count: 1, mins: m[2] }; })
		});

		root.innerHTML =
			'<section class="section"><div class="wrap audio-hero">' +
				'<div><h2 class="d-head" style="font-family:var(--f-display);font-size:32px;margin:0 0 10px">' + L('على الشريط الآن', 'On the tape now') + '</h2>' +
					'<p style="color:var(--paper-dim);margin:0 0 14px">' + L('◀◀ و ▶▶ ينقلانك بين الحلقات، و ▶ يفتح الحلقة على Audiohat.', '◀◀ and ▶▶ wind between episodes; ▶ opens the episode on Audiohat.') + '</p>' +
					'<p style="color:var(--muted);margin:0">' + App.num(tracks.length) + ' ' + L('حلقة', 'episodes') + ' · ' +
						'<a href="' + e(A.author) + '" target="_blank" rel="noopener">' + L('صفحته على Audiohat ↗', 'His page on Audiohat ↗') + '</a></p></div>' +
				'<div id="a-cassette"></div>' +
			'</div></section>' +
			'<section class="section"><div class="wrap"><div class="ep-groups">' + groups.map(function (g) {
				return '<div class="ep-group"><h3>' + tx(g.title) + ' <small style="color:var(--muted);font-family:var(--f-latin);font-size:15px">(' + App.num(g.rows.length) + (g.total ? ' / ' + App.num(g.total) : '') + ')</small></h3>' +
					(g.note ? '<p style="color:var(--muted);margin:-6px 0 12px">' + tx(g.note) + '</p>' : '') +
					'<ul class="ep-list">' + g.rows.map(function (r) {
						return '<li data-start="' + r.start + '">' +
							(r.n != null ? '<span class="no">' + e(App.num(r.n)) + '</span>' : '<span class="no">♪</span>') +
							'<span class="tt">' + (r.href ? '<a href="' + r.href + '">' + tx(r.title) + '</a>' : tx(r.title)) +
								'<small>' + (r.count > 1 ? App.num(r.count) + ' ' + L('حلقات', 'episodes') + ' · ' : '') + (r.mins ? App.num(r.mins) + ' ' + L('دقيقة', 'min') : '') + '</small></span>' +
							'<button type="button" data-start="' + r.start + '">' + L('ضعه في المسجل', 'Load tape') + '</button>' +
						'</li>';
					}).join('') + '</ul></div>';
			}).join('') + '</div>' +
			'<p class="audio-credit">' + L('التسجيلات وحقوقها لـ Audiohat و«شركة سلاح التلميذ للطباعة والنشر». هذا الموقع يربط إليها فقط ولا يستضيف أي صوت منها.',
				'Recordings and rights belong to Audiohat and Salah El Telmeez for Printing & Publishing. This site only links to them and hosts none of their audio.') + '</p>' +
			'</div></section>';

		var deck = window.Cassette.mount(document.getElementById('a-cassette'), { tracks: tracks });
		var lists = root.querySelectorAll('.ep-list li');
		function mark(i) { lists.forEach(function (li) { var s = +li.getAttribute('data-start'); li.classList.toggle('cur', s === i); }); }
		root.addEventListener('click', function (ev) {
			var b = ev.target.closest('button[data-start]');
			if (!b) return;
			var i = +b.getAttribute('data-start');
			deck.load(i, true);
			mark(i);
			document.getElementById('a-cassette').scrollIntoView({ behavior: 'smooth', block: 'center' });
		});
	}
};

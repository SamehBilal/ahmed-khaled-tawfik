/* audio.html — every Audiohat audiobook of his, on one cassette */
window.PAGE = {
	id: 'audio',
	title: { ar: 'مسموع', en: 'Audiobooks' },
	strings: {
		eyebrow: { ar: 'كتب مسموعة', en: 'Audiobooks' },
		title: { ar: 'العرّاب مسموعًا', en: 'The Godfather, out loud' },
		lead: {
			ar: 'أعداد «ما وراء الطبيعة» و«فانتازيا» وحكايات «بعد منتصف الليل» كما سجّلتها Audiohat، و«سافاري» دراما إذاعية على YouTube. اختر شريطًا ثم اضغط تشغيل.',
			en: 'Beyond Nature and Fantasia issues and the “After Midnight” stories as recorded by Audiohat, plus Safari as a radio drama on YouTube. Pick a tape, then press play.'
		}
	},

	render: function () {
		var App = window.App, d = App.data(), S = window.WorksShared, e = App.esc, t = App.t, tx = App.tx, L = App.L;
		var A = d.audio;
		var root = document.getElementById('content');
		if (!A) { root.innerHTML = ''; return; }

		/* one long playlist: issues in series order, then the midnight programme */
		var tracks = [], groups = [];
		var Y = (A.youtube && A.youtube.issues) || {}, TH = A.thumbs || {};
		/* a row's picture: Audiohat's own, else the YouTube still, else the book cover */
		function ytThumb(v) { return 'https://i.ytimg.com/vi/' + v + '/mqdefault.jpg'; }
		var shown = {};
		['mwt', 'fantasia', 'safari'].forEach(function (sid) {
			var s = App.byId(d.series, sid);
			var rows = [];
			S.seriesIssues(sid).forEach(function (is) {
				var key = sid + '-' + is.n;
				if ((!A.issues[key] && !Y[key]) || is.part > 1) return;
				var start = tracks.length;
				var cover = S.issueCover(sid, is), eps = A.issues[key] || [];
				window.Cassette.issueTracks(key, t(is.title)).forEach(function (tr, k) { tr.sub = t(s.title) + ' #' + App.num(is.n) + (tr.sub !== 'Audiohat' ? ' · ' + tr.sub : ''); tr.skin = sid; if (!tr.yt) tr.art = (eps[k] && TH[eps[k][0]]) || cover || ''; tracks.push(tr); });
				var thumb = (eps[0] && TH[eps[0][0]]) || (Y[key] ? ytThumb(Y[key][0][0]) : '') || cover;
				rows.push({ n: is.n, title: is.title, href: App.issueHref(sid, is), thumb: thumb, start: start, count: tracks.length - start, mins: (A.issues[key] || []).reduce(function (m, ep) { return m + (ep[1] || 0); }, 0), yt: !!Y[key] });
			});
			if (rows.length) groups.push({ title: s.title, total: S.seriesIssues(sid).length, rows: rows });
			/* special issues of the series (e.g. «في كهوف دراجوسان»), one row each, all their videos on the tape */
			var srows = [];
			S.specialIssues(sid).forEach(function (is) {
				var key = sid + '-s' + is.n;
				var start = tracks.length;
				window.Cassette.issueTracks(key, t(is.title)).forEach(function (tr) { tr.sub = L('عدد خاص ', 'Special ') + App.num(is.n) + ' · ' + tr.sub; tr.skin = 'specials'; tracks.push(tr); });
				if (tracks.length > start) srows.push({ n: is.n, title: is.title, href: App.issueHref(sid, is), thumb: (tracks[start].yt ? ytThumb(tracks[start].yt) : '') || S.issueCover(sid, is), start: start, count: tracks.length - start, mins: (A.issues[key] || []).reduce(function (m, ep) { return m + (ep[1] || 0); }, 0), yt: !!Y[key] });
			});
			/* issues of other series that count as its specials (e.g. «ثلاثة» in «كتاب الصيف»), listed once, under the first of their series */
			S.contributedSeries().forEach(function (x) {
				S.seriesIssues(x.id).forEach(function (is) {
					var key = S.issueKey(x.id, is);
					if (!is.asSpecial || [].concat(is.related || []).indexOf(sid) < 0 || shown[key]) return;
					var start = tracks.length;
					window.Cassette.issueTracks(key, t(is.title)).forEach(function (tr) { tr.sub = t(x.title) + ' · ' + tr.sub; tr.skin = 'specials'; tracks.push(tr); });
					if (tracks.length === start) return;
					shown[key] = 1;
					srows.push({ n: is.n, title: is.title, href: App.issueHref(x.id, is), thumb: (tracks[start].yt ? ytThumb(tracks[start].yt) : '') || S.issueCover(x.id, is), start: start, count: tracks.length - start, mins: (A.issues[key] || []).reduce(function (m, ep) { return m + (ep[1] || 0); }, 0), yt: !!Y[key] });
				});
			});
			if (srows.length) groups.push({ title: { ar: t(s.title) + ' — الأعداد الخاصة', en: (s.title.en || '') + ' — special issues' }, rows: srows });
		});
		var midStart = tracks.length;
		A.midnight.forEach(function (m) {
			tracks.push({ title: m[0], sub: L('برنامج «بعد منتصف الليل»', 'After Midnight programme'), url: window.Cassette.pageUrl(A, m[1]), mins: m[2], sample: m[3] || '', skin: 'midnight', art: TH[m[1]] || '' });
		});
		groups.push({
			title: { ar: 'بعد منتصف الليل', en: 'After Midnight' },
			note: { ar: 'برنامج من Audiohat لقصص قصيرة له.', en: 'An Audiohat programme of his short stories.' },
			rows: A.midnight.map(function (m, k) { return { title: { ar: m[0], en: m[0] }, thumb: TH[m[1]] || '', start: midStart + k, count: 1, mins: m[2] }; })
		});

		var hero = document.querySelector('.page-hero');
		var deckSec = document.getElementById('audio-deck');
		if (!deckSec) {
			deckSec = document.createElement('section');
			deckSec.id = 'audio-deck';
			deckSec.className = 'audio-deck';
			hero.parentNode.insertBefore(deckSec, hero);
		}
		deckSec.innerHTML = '<div class="wrap"><div id="a-cassette"></div></div>';

		root.innerHTML =
			'<section class="section audio-help"><div class="wrap">' +
				'<div><h2 class="d-head" style="font-family:var(--f-display);font-size:28px;margin:0 0 10px">' + L('على الشريط الآن', 'On the tape now') + '</h2>' +
					'<p style="color:var(--paper-dim);margin:0 0 14px">' + L('◀◀ و ▶▶ ينقلانك بين الحلقات، و ▶ يشغّل العيّنة على الشريط إن وُجدت، وزر Audiohat يفتح الحلقة على موقعهم.', '◀◀ and ▶▶ wind between episodes; ▶ plays the sample on the tape when there is one; the Audiohat key opens the episode on their site.') + '</p>' +
					'<p style="color:var(--muted);margin:0">' + App.num(tracks.length) + ' ' + L('حلقة', 'episodes') + ' · ' +
						'<a href="' + e(A.author) + '" target="_blank" rel="noopener">' + L('صفحته على Audiohat ↗', 'His page on Audiohat ↗') + '</a></p></div>' +
			'</div></section>' +
			'<section class="section"><div class="wrap"><div class="ep-groups">' + groups.map(function (g) {
				return '<div class="ep-group"><h3>' + tx(g.title) + ' <small style="color:var(--muted);font-family:var(--f-latin);font-size:15px">(' + App.num(g.rows.length) + (g.total ? ' / ' + App.num(g.total) : '') + ')</small></h3>' +
					(g.note ? '<p style="color:var(--muted);margin:-6px 0 12px">' + tx(g.note) + '</p>' : '') +
					'<ul class="ep-list">' + g.rows.map(function (r) {
						return '<li data-start="' + r.start + '">' +
							(r.n != null ? '<span class="no">' + e(App.num(r.n)) + '</span>' : '<span class="no">♪</span>') +
							'<span class="th' + (r.thumb ? '' : ' none') + '" aria-hidden="true">' + (r.thumb ? '<img src="' + e(r.thumb) + '" alt="" loading="lazy" decoding="async" referrerpolicy="no-referrer">' : '') + '</span>' +
							'<span class="tt">' + (r.href ? '<a href="' + r.href + '">' + tx(r.title) + '</a>' : tx(r.title)) +
								'<small>' + (r.count > 1 ? App.num(r.count) + ' ' + L('حلقات', 'episodes') + ' · ' : '') + (r.mins ? App.num(r.mins) + ' ' + L('دقيقة', 'min') : '') + '</small></span>' +
							'<button type="button" data-start="' + r.start + '">' + L('ضعه في المسجل', 'Load tape') + '</button>' +
						'</li>';
					}).join('') + '</ul></div>';
			}).join('') + '</div>' +
			'<p class="audio-credit">' + L('التسجيلات وحقوقها لـ Audiohat و«شركة سلاح التلميذ للطباعة والنشر»، ودراما «سافاري» الإذاعية من قناة «تسجيل» على YouTube. هذا الموقع يربط إليها أو يعرضها عبر مشغّل YouTube فقط، ولا يستضيف أي صوت منها.',
				'Recordings and rights belong to Audiohat and Salah El Telmeez for Printing & Publishing; the Safari radio drama is from the Tasgeel channel on YouTube. This site only links to them or plays them through the YouTube player, and hosts none of their audio.') + '</p>' +
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

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
				window.Cassette.issueTracks(key, t(is.title)).forEach(function (tr, k) { tr.ep = tr.sub; tr.sub = t(s.title) + ' #' + App.num(is.n) + (tr.sub !== 'Audiohat' ? ' · ' + tr.sub : ''); tr.skin = sid; if (!tr.yt) tr.art = (eps[k] && TH[eps[k][0]]) || cover || ''; tracks.push(tr); });
				var thumb = (eps[0] && TH[eps[0][0]]) || (Y[key] ? ytThumb(Y[key][0][0]) : '') || cover;
				rows.push({ n: is.n, title: is.title, href: App.issueHref(sid, is), thumb: thumb, start: start, count: tracks.length - start, mins: (A.issues[key] || []).reduce(function (m, ep) { return m + (ep[1] || 0); }, 0), yt: !!Y[key] });
			});
			if (rows.length) groups.push({ title: s.title, total: S.seriesIssues(sid).length, rows: rows });
			/* special issues of the series (e.g. «في كهوف دراجوسان»), one row each, all their videos on the tape */
			var srows = [];
			S.specialIssues(sid).forEach(function (is) {
				var key = sid + '-s' + is.n;
				var start = tracks.length;
				window.Cassette.issueTracks(key, t(is.title)).forEach(function (tr) { tr.ep = tr.sub; tr.sub = L('عدد خاص ', 'Special ') + App.num(is.n) + ' · ' + tr.sub; tr.skin = 'specials'; tracks.push(tr); });
				if (tracks.length > start) srows.push({ n: is.n, title: is.title, href: App.issueHref(sid, is), thumb: (tracks[start].yt ? ytThumb(tracks[start].yt) : '') || S.issueCover(sid, is), start: start, count: tracks.length - start, mins: (A.issues[key] || []).reduce(function (m, ep) { return m + (ep[1] || 0); }, 0), yt: !!Y[key] });
			});
			/* issues of other series that count as its specials (e.g. «ثلاثة» in «كتاب الصيف»), listed once, under the first of their series */
			S.contributedSeries().forEach(function (x) {
				S.seriesIssues(x.id).forEach(function (is) {
					var key = S.issueKey(x.id, is);
					if (!is.asSpecial || [].concat(is.related || []).indexOf(sid) < 0 || shown[key]) return;
					var start = tracks.length;
					window.Cassette.issueTracks(key, t(is.title)).forEach(function (tr) { tr.ep = tr.sub; tr.sub = t(x.title) + ' · ' + tr.sub; tr.skin = 'specials'; tracks.push(tr); });
					if (tracks.length === start) return;
					shown[key] = 1;
					srows.push({ n: is.n, title: is.title, href: App.issueHref(x.id, is), thumb: (tracks[start].yt ? ytThumb(tracks[start].yt) : '') || S.issueCover(x.id, is), start: start, count: tracks.length - start, mins: (A.issues[key] || []).reduce(function (m, ep) { return m + (ep[1] || 0); }, 0), yt: !!Y[key] });
				});
			});
			if (srows.length) groups.push({ title: { ar: t(s.title) + ' — الأعداد الخاصة', en: (s.title.en || '') + ' — special issues' }, rows: srows });
		});
		var midStart = tracks.length;
		(A.midnight || []).forEach(function (m) {
			tracks.push({ title: m[0], sub: L('برنامج «بعد منتصف الليل»', 'After Midnight programme'), url: window.Cassette.pageUrl(A, m[1]), mins: m[2], sample: m[3] || '', skin: 'midnight', art: TH[m[1]] || '' });
		});
		if ((A.midnight || []).length) groups.push({
			title: { ar: 'بعد منتصف الليل', en: 'After Midnight' },
			note: { ar: 'برنامج من Audiohat لقصص قصيرة له.', en: 'An Audiohat programme of his short stories.' },
			rows: A.midnight.map(function (m, k) { return { title: { ar: m[0], en: m[0] }, thumb: TH[m[1]] || '', start: midStart + k, count: 1, mins: m[2] }; })
		});
		/* the show's later seasons by Sherine Hanaey, out of which the Lasheen novels grew: one row a season, its episodes inside */
		var srows2 = (A.seasons || []).map(function (se) {
			var start = tracks.length, name = L('بعد منتصف الليل ', 'After Midnight ') + App.num(se.n);
			se.eps.forEach(function (ep, k) {
				var label = ep[2] || L('الحلقة ', 'Episode ') + App.num(k + 1);
				tracks.push({ title: name, ep: label, sub: L('الموسم ', 'Season ') + App.num(se.n) + ' · ' + label, url: window.Cassette.pageUrl(A, ep[0]), mins: ep[1] || null, skin: 'midnight', art: ep[3] || se.art });
			});
			return { title: { ar: 'الموسم ' + App.num(se.n) + ' (' + App.num(se.year) + ')', en: 'Season ' + se.n + ' (' + se.year + ')' }, thumb: se.art, start: start, count: se.eps.length,
				mins: se.eps.reduce(function (m, ep) { return m + (ep[1] || 0); }, 0) };
		});
		/* and the Lasheen novels Audiohat has as audiobooks, one row a book, its parts inside */
		(A.lasheenBooks || []).forEach(function (b) {
			var is = (S.seriesIssues('lasheen') || []).filter(function (x) { return +x.n === b.n; })[0];
			if (!is) return;
			var start = tracks.length, name = L('لاشين ', 'Lasheen ') + App.num(b.n) + ': ' + t(is.title);
			b.eps.forEach(function (ep, k) {
				var label = L('الجزء ', 'Part ') + App.num(k + 1);
				tracks.push({ title: name, ep: label, sub: L('كتاب مسموع', 'Audiobook') + ' · ' + label, url: window.Cassette.pageUrl(A, ep[0]), mins: ep[1] || null, skin: 'midnight', art: b.art });
			});
			srows2.push({ n: b.n, title: { ar: 'لاشين: ' + is.title.ar + ' (كتاب مسموع، ' + App.num(b.year) + ')', en: 'Lasheen: ' + (is.title.en || is.title.ar) + ' (audiobook, ' + b.year + ')' },
				href: App.issueHref('lasheen', is), thumb: b.art, start: start, count: b.eps.length, mins: b.eps.reduce(function (m, ep) { return m + (ep[1] || 0); }, 0) });
		});
		/* and the comic episodes made after the show, «قبل منتصف الليل!» */
		var sp = A.midnightSpoofs;
		if (sp && sp.eps.length) {
			var spStart = tracks.length;
			sp.eps.forEach(function (ep) {
				tracks.push({ title: t(sp.title), ep: ep[2], sub: L('حلقة ساخرة', 'Comic episode') + ' · ' + ep[2], url: window.Cassette.pageUrl(A, ep[0]), mins: ep[1] || null, skin: 'midnight', art: ep[3] || sp.art });
			});
			srows2.push({ title: { ar: sp.title.ar + ' (' + sp.years + ')', en: sp.title.en + ' (' + sp.years + ')' }, thumb: sp.art, start: spStart, count: sp.eps.length,
				mins: sp.eps.reduce(function (m, ep) { return m + (ep[1] || 0); }, 0) });
		}
		if (srows2.length) groups.push({
			title: { ar: 'بعد منتصف الليل — مواسم «لاشين»', en: 'After Midnight — the Lasheen seasons' },
			note: { ar: 'عاد البرنامج الذي كتب عنه في «أسطورة بعد منتصف الليل» بمواسم جديدة على Audiohat من تأليف شيرين هنائي، ومنها خرجت روايات «لاشين».',
				en: 'The radio show he wrote of in “The Legend of After Midnight” came back on Audiohat in new seasons written by Sherine Hanaey, out of which the Lasheen novels grew.' },
			rows: srows2
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
						return '<li data-start="' + r.start + '" data-count="' + r.count + '">' +
							(r.n != null ? '<span class="no">' + e(App.num(r.n)) + '</span>' : '<span class="no">♪</span>') +
							'<span class="th' + (r.thumb ? '' : ' none') + '" aria-hidden="true">' + (r.thumb ? '<img src="' + e(r.thumb) + '" alt="" loading="lazy" decoding="async" referrerpolicy="no-referrer">' : '') + '</span>' +
							'<span class="tt">' + (r.href ? '<a href="' + r.href + '">' + tx(r.title) + '</a>' : tx(r.title)) +
								'<small>' + (r.count > 1 ? App.num(r.count) + ' ' + L('حلقات', 'episodes') + ' · ' : '') + (r.mins ? App.num(r.mins) + ' ' + L('دقيقة', 'min') : '') + '</small></span>' +
							/* an issue or video in several episodes opens the list of all of them, each to put in the recorder */
							(r.count > 1
								? '<button type="button" data-eps aria-expanded="false">' + L('الحلقات', 'Episodes') + ' (' + App.num(r.count) + ')</button>' +
									'<ol class="ep-sub" hidden>' + tracks.slice(r.start, r.start + r.count).map(function (tr, k) {
										/* each episode with its own picture: its Audiohat art, its YouTube still, or the row's */
										var pic = tr.art || (tr.yt ? ytThumb(tr.yt) : '') || r.thumb || '';
										return '<li data-start="' + (r.start + k) + '"><span class="no">' + e(App.num(k + 1)) + '</span>' +
											'<span class="th' + (pic ? '' : ' none') + '" aria-hidden="true">' + (pic ? '<img src="' + e(pic) + '" alt="" loading="lazy" decoding="async" referrerpolicy="no-referrer">' : '') + '</span>' +
											'<span class="tt">' + e(tr.ep || tr.title) + '<small>' + (tr.yt ? e(tr.channel || 'YouTube') : 'Audiohat') + (tr.mins ? ' · ' + App.num(tr.mins) + ' ' + L('دقيقة', 'min') : '') + '</small></span>' +
											'<button type="button" data-start="' + (r.start + k) + '">' + L('ضعها في المسجل', 'Load tape') + '</button></li>';
									}).join('') + '</ol>'
								: '<button type="button" data-start="' + r.start + '">' + L('ضعه في المسجل', 'Load tape') + '</button>') +
						'</li>';
					}).join('') + '</ul></div>';
			}).join('') + '</div>' +
			'<p class="audio-credit">' + L('التسجيلات وحقوقها لـ Audiohat و«شركة سلاح التلميذ للطباعة والنشر»، ودراما «سافاري» الإذاعية من قناة «تسجيل» على YouTube. هذا الموقع يربط إليها أو يعرضها عبر مشغّل YouTube فقط، ولا يستضيف أي صوت منها.',
				'Recordings and rights belong to Audiohat and Salah El Telmeez for Printing & Publishing; the Safari radio drama is from the Tasgeel channel on YouTube. This site only links to them or plays them through the YouTube player, and hosts none of their audio.') + '</p>' +
			'</div></section>';

		var deck = window.Cassette.mount(document.getElementById('a-cassette'), { tracks: tracks });
		var lists = root.querySelectorAll('.ep-list li');
		/* the row of the issue on the tape, and in its opened list the episode itself */
		function mark(i) {
			lists.forEach(function (li) {
				var s = +li.getAttribute('data-start'), n = +(li.getAttribute('data-count') || 1);
				li.classList.toggle('cur', i >= s && i < s + n);
			});
		}
		root.addEventListener('click', function (ev) {
			var eb = ev.target.closest('button[data-eps]');
			if (eb) {
				var li = eb.closest('li'), sub = li.querySelector('.ep-sub'), open = eb.getAttribute('aria-expanded') !== 'true';
				eb.setAttribute('aria-expanded', String(open));
				sub.hidden = !open;
				li.classList.toggle('open', open);
				return;
			}
			var b = ev.target.closest('button[data-start]');
			if (!b) return;
			var i = +b.getAttribute('data-start');
			deck.load(i, true);
			mark(i);
			document.getElementById('a-cassette').scrollIntoView({ behavior: 'smooth', block: 'center' });
		});
	}
};

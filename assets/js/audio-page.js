/* audio.html — his audiobooks on Audiohat, Storytel and Iqraaly and the readings and dramas on YouTube, on one cassette, filtered by platform */
window.PAGE = {
	id: 'audio',
	title: { ar: 'مسموع', en: 'Audiobooks' },
	strings: {
		eyebrow: { ar: 'كتب مسموعة', en: 'Audiobooks' },
		title: { ar: 'العرّاب مسموعًا', en: 'The Godfather, out loud' },
		lead: {
			ar: 'كل ما سُجّل له بالصوت في مكان واحد: أعداد «ما وراء الطبيعة» و«فانتازيا» و«سافاري» وأعدادها الخاصة كما قرأتها Audiohat وStorytel؛ ورواياته ومجموعاته ومقالاته على Storytel، ومعها «WWW» كاملة وكتاب عنه وقصص تبيعها منفردة؛ وبرنامج «بعد منتصف الليل» لقصصه القصيرة، ومواسمه الجديدة من تأليف شيرين هنائي وحلقتا «قبل منتصف الليل!» الساخرتان على Audiohat؛ وروايات «لاشين» على «اقرألي» وAudiohat؛ وعلى YouTube «سافاري» و«فانتازيا» دراما إذاعية، و«في كهوف دراجوسان» و«ثلاثة»، وكتبه وقصصه بصوت إسلام عادل. اختر منصة أو قسمًا، ضع شريطًا في المسجل، ثم اضغط الزر.',
			en: 'Everything of his recorded, in one place: the Beyond Nature, Fantasia and Safari issues and their specials as read on Audiohat and Storytel; his novels, collections and essays on Storytel, with WWW in one book, a book about him and stories sold on their own; the After Midnight programme of his short stories, its new seasons written by Sherine Hanaey and the two comic episodes of “Before Midnight!” on Audiohat; the Lasheen novels on Iqraaly and Audiohat; and on YouTube, Safari and Fantasia as radio drama, In the Caves of Dragosan, Three, and his books and stories read by Eslam Adel. Pick a platform or a section, put a tape in the recorder, then press the key.'
		}
	},

	render: function () {
		var App = window.App, d = App.data(), S = window.WorksShared, e = App.esc, t = App.t, tx = App.tx, L = App.L;
		var A = d.audio;
		var root = document.getElementById('content');
		if (!A) { root.innerHTML = ''; return; }

		/* one long playlist: issues in series order, then the midnight programme */
		var tracks = [], groups = [];
		/* the platform filter: every track goes through push, which counts it for its platform and keeps it only if it is shown */
		var self = this;
		if (!this.platform) { try { this.platform = sessionStorage.getItem('akt-audio-platform') || 'all'; } catch (x) { this.platform = 'all'; } }
		var platform = this.platform, perPlatform = { all: 0, audiohat: 0, storytel: 0, iqraaly: 0, storiapod: 0, youtube: 0 };
		var platformOf = function (tr) { return tr.yt ? 'youtube' : tr.provider === 'Storytel' ? 'storytel' : tr.provider === 'Iqraaly' ? 'iqraaly' : tr.provider === 'StoriaPod' ? 'storiapod' : 'audiohat'; };
		var push0 = tracks.push, counted = {};
		tracks.push = function (tr) {
			/* (a track offered twice, as a special under two series, is counted once) */
			if (!counted[tr.url]) { counted[tr.url] = 1; perPlatform.all++; perPlatform[platformOf(tr)]++; }
			if (platform === 'all' || platformOf(tr) === platform) push0.call(tracks, tr);
			return tracks.length;
		};
		var Y = (A.youtube && A.youtube.issues) || {}, TH = A.thumbs || {};
		/* a row's picture: Audiohat's own, else the YouTube still, else the book cover */
		function ytThumb(v) { return 'https://i.ytimg.com/vi/' + v + '/mqdefault.jpg'; }
		/* the minutes of a row's tracks, whoever has them (Audiohat, YouTube, Storytel) */
		function minsFrom(start) { return tracks.slice(start).reduce(function (m, tr) { return m + (tr.mins || 0); }, 0); }
		var shown = {};
		['mwt', 'fantasia', 'safari'].forEach(function (sid) {
			var s = App.byId(d.series, sid);
			var rows = [];
			S.seriesIssues(sid).forEach(function (is) {
				var key = sid + '-' + is.n;
				if (is.part > 1) return;
				var start = tracks.length;
				var cover = S.issueCover(sid, is), eps = A.issues[key] || [];
				window.Cassette.issueTracks(key, t(is.title)).forEach(function (tr, k) { tr.ep = tr.ep || tr.sub; tr.sub = t(s.title) + ' #' + App.num(is.n) + (tr.sub !== 'Audiohat' ? ' · ' + tr.sub : ''); tr.skin = sid; if (!tr.yt) tr.art = (eps[k] && TH[eps[k][0]]) || cover || ''; tracks.push(tr); });
				if (tracks.length === start) return;
				var thumb = (eps[0] && TH[eps[0][0]]) || (Y[key] ? ytThumb(Y[key][0][0]) : '') || cover;
				rows.push({ n: is.n, title: is.title, href: App.issueHref(sid, is), thumb: thumb, start: start, count: tracks.length - start, mins: minsFrom(start), yt: !!Y[key] });
			});
			if (rows.length) groups.push({ title: s.title, total: S.seriesIssues(sid).length, rows: rows });
			/* special issues of the series (e.g. «في كهوف دراجوسان»), one row each, all their videos on the tape */
			var srows = [];
			S.specialIssues(sid).forEach(function (is) {
				var key = sid + '-s' + is.n;
				var start = tracks.length;
				window.Cassette.issueTracks(key, t(is.title)).forEach(function (tr) { tr.ep = tr.ep || tr.sub; tr.sub = L('عدد خاص ', 'Special ') + App.num(is.n) + ' · ' + tr.sub; tr.skin = 'specials'; tracks.push(tr); });
				if (tracks.length > start) srows.push({ n: is.n, title: is.title, href: App.issueHref(sid, is), thumb: (tracks[start].yt ? ytThumb(tracks[start].yt) : '') || S.issueCover(sid, is), start: start, count: tracks.length - start, mins: minsFrom(start), yt: !!Y[key] });
			});
			/* issues of other series that count as its specials (e.g. «ثلاثة» in «كتاب الصيف»), listed once, under the first of their series */
			S.contributedSeries().forEach(function (x) {
				S.seriesIssues(x.id).forEach(function (is) {
					var key = S.issueKey(x.id, is);
					if (!is.asSpecial || [].concat(is.related || []).indexOf(sid) < 0 || shown[key]) return;
					var start = tracks.length;
					window.Cassette.issueTracks(key, t(is.title)).forEach(function (tr) { tr.ep = tr.ep || tr.sub; tr.sub = t(x.title) + ' · ' + tr.sub; tr.skin = 'specials'; tracks.push(tr); });
					if (tracks.length === start) return;
					shown[key] = 1;
					srows.push({ n: is.n, title: is.title, href: App.issueHref(x.id, is), thumb: (tracks[start].yt ? ytThumb(tracks[start].yt) : '') || S.issueCover(x.id, is), start: start, count: tracks.length - start, mins: minsFrom(start), yt: !!Y[key] });
				});
			});
			if (srows.length) groups.push({ title: { ar: t(s.title) + ' — الأعداد الخاصة', en: (s.title.en || '') + ' — special issues' }, rows: srows });
		});
		/* his books on Storytel (novels, collections, articles), the WWW series in one book, books about him, and stories it sells on their own */
		var ST = (A.storytel && A.storytel.items) || {}, brows = [];
		Object.keys(ST).forEach(function (k) {
			var m = k.match(/^(work|series|story|about):(.+)$/);
			if (!m) return;
			var w = m[1] === 'work' ? App.findWork(m[2]) : null, ser = m[1] === 'series' ? S.anySeries(m[2]) : null;
			var ab = m[1] === 'about' ? (d.aboutBooks || []).filter(function (b) { return b.id === m[2]; })[0] : null;
			if ((m[1] === 'work' && !w) || (m[1] === 'about' && !ab)) return;
			var title = w ? w.title : ser ? ser.s.title : ab ? ab.title : { ar: m[2], en: m[2] };
			var start = tracks.length;
			window.Cassette.storytelTracks(k, t(title)).forEach(function (tr) {
				tr.sub = (m[1] === 'story' ? L('قصة', 'Story') : m[1] === 'series' ? L('السلسلة كاملة', 'The whole series') : m[1] === 'about' ? L('كتاب عنه', 'A book about him') : L('كتاب', 'Book')) + ' · ' + tr.sub;
				tr.skin = 'specials';
				tr.art = w ? S.coverOf((d.bookInfo || {})[w.id] || {}) : ser ? S.seriesCover(m[2]) : ab ? (ab.cover || '') : '';
				tracks.push(tr);
			});
			if (tracks.length === start) return;
			brows.push({ title: title, href: w ? S.bookHref(w.id) : ser ? S.seriesHref(m[2]) : ab ? S.bookHref(ab.id) : '', thumb: tracks[start].art || '', start: start, count: tracks.length - start, mins: minsFrom(start),
				year: w ? w.year : 0, rank: m[1] === 'work' ? 0 : m[1] === 'series' ? 1 : m[1] === 'about' ? 2 : 3 });
		});
		/* his books in the order he published them, then WWW, the books about him, and the stories */
		brows.sort(function (a, b) { return (a.rank - b.rank) || ((a.year || 9999) - (b.year || 9999)); });
		if (brows.length) groups.push({
			title: { ar: 'كتبه على Storytel', en: 'His books on Storytel' },
			note: { ar: 'كتب صوتية من رواياته ومجموعاته ومقالاته على Storytel، ومعها كتاب عنه وقصص له تبيعها منفردة؛ الزر يفتح صفحة الكتاب هناك.',
				en: 'Audiobooks of his novels, collections and essays on Storytel, with a book about him and stories of his it sells on their own; the key opens the book’s page there.' },
			rows: brows
		});
		/* his Ida2at serial stories as audio dramas on StoriaPod, one row a story, leading to its first episode in the blog archive */
		var SPI = (A.storiapod && A.storiapod.items) || {}, SPP = (A.storiapod && A.storiapod.posts) || {}, sprows = [];
		Object.keys(SPI).forEach(function (k) {
			var m = k.match(/^story:(.+)$/);
			if (!m) return;
			var start = tracks.length;
			window.Cassette.storiapodTracks(k, m[1]).forEach(function (tr) { tr.sub = L('قصة', 'Story') + ' · ' + tr.sub; tracks.push(tr); });
			if (tracks.length === start) return;
			sprows.push({ title: { ar: m[1], en: m[1] }, href: SPP[k] ? 'blog.html?post=' + SPP[k] : '', thumb: tracks[start].art || '', start: start, count: tracks.length - start, mins: minsFrom(start) });
		});
		if (sprows.length) groups.push({
			title: { ar: 'قصصه على ستوريا بود', en: 'His stories on StoriaPod' },
			note: { ar: 'قصصه المسلسلة التي نشرها في «إضاءات» (2016–2017) دراما صوتية من إنتاج فريق «رُواة»؛ العنوان يفتح حلقتها الأولى في أرشيف المدونة، والزر يفتح صفحتها هناك.',
				en: 'The serial stories he wrote for Ida2at (2016–2017) as audio dramas by the Ruwah team; the title opens the first episode in the blog archive, the key opens its page there.' },
			rows: sprows
		});

		/* his books and stories read by Eslam Adel on YouTube, one row a video, played here under the tape */
		var EA = A.youtube && A.youtube.eslamAdel, erows = [];
		(EA ? EA.eps : []).forEach(function (ep) {
			var w = ep[3] ? App.findWork(ep[3]) : null, start = tracks.length;
			tracks.push({ title: t(ep[2]), ep: L('بصوت إسلام عادل', 'read by Eslam Adel'), sub: (w && t(w.title) !== t(ep[2]) ? t(w.title) + ' · ' : '') + L('بصوت إسلام عادل', 'Read by Eslam Adel'),
				channel: EA.channel.name, url: 'https://www.youtube.com/watch?v=' + ep[0], yt: ep[0], ytEmbed: true, mins: ep[1], skin: 'specials' });
			if (tracks.length > start) erows.push({ title: ep[2], href: w ? S.bookHref(w.id) : '', thumb: ytThumb(ep[0]), start: start, count: 1, mins: ep[1], yt: true });
		});
		if (erows.length) groups.push({
			title: { ar: 'بصوت إسلام عادل على YouTube', en: 'Read by Eslam Adel on YouTube' },
			note: { ar: 'كتب وقصص ومقالات له يقرؤها إسلام عادل على قناته، وتُشغَّل هنا تحت الشريط.', en: 'His books, stories and essays read by Eslam Adel on his channel; they play here, under the tape.' },
			rows: erows
		});

		/* Dubvo's whole books on YouTube — «E.S.P» as radio drama, «شربة الحاج داوود» read essay by essay: a row each, its
		   episodes under the tape */
		[[A.youtube && A.youtube.dubvoEsp, { ar: '«E.S.P» دراما إذاعية على YouTube', en: 'E.S.P as radio drama on YouTube' },
			{ ar: 'روايته «E.S.P» في اثنتي عشرة حلقة من «دار النشر الصوتية — Dubvo»، تُشغَّل هنا تحت الشريط.', en: 'His novel E.S.P in twelve episodes from Dubvo, played here under the tape.' }],
		[A.youtube && A.youtube.dubvoSharba]].forEach(function (g) {
			var DE = g[0];
			if (!DE || !DE.eps.length) return;
			var ew = App.findWork(DE.work), eStart = tracks.length, eMins = 0;
			DE.eps.forEach(function (ep, k) {
				eMins += ep[2];
				tracks.push({ title: t(ew.title), ep: L(DE.ar || 'الحلقة', DE.en || 'Episode') + ' ' + App.num(k + 1) + ': ' + ep[1], sub: ep[1] + ' · Dubvo',
					channel: DE.channel.name, url: 'https://www.youtube.com/watch?v=' + ep[0], yt: ep[0], ytEmbed: true, mins: ep[2], skin: 'specials' });
			});
			groups.push({
				title: g[1] || DE.title, note: g[2] || DE.note,
				rows: [{ title: ew.title, href: S.bookHref(ew.id), thumb: ytThumb(DE.eps[0][0]), start: eStart, count: DE.eps.length, mins: eMins, yt: true }]
			});
		});

		var midStart = tracks.length;
		(A.midnight || []).forEach(function (m) {
			tracks.push({ title: m[0], sub: L('برنامج «بعد منتصف الليل»', 'After Midnight programme'), url: window.Cassette.pageUrl(A, m[1]), mins: m[2], skin: 'midnight', art: TH[m[1]] || '' });
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
			return { title: { ar: 'الموسم ' + App.num(se.n) + ' (' + App.num(se.year) + ')', en: 'Season ' + se.n + ' (' + se.year + ')' }, thumb: se.art, start: start, count: tracks.length - start,
				mins: minsFrom(start) };
		});
		/* the Lasheen novels as audiobooks, in their own section: books one to eight on Iqraaly, book fifteen on Audiohat */
		var lrows = [];
		/* on Iqraaly, one row a book */
		Object.keys((A.iqraaly && A.iqraaly.items) || {}).forEach(function (k) {
			var is = (S.seriesIssues('lasheen') || []).filter(function (x) { return 'lasheen-' + x.n === k; })[0];
			if (!is) return;
			var start = tracks.length;
			window.Cassette.iqraalyTracks(k, L('لاشين ', 'Lasheen ') + App.num(is.n) + ': ' + t(is.title)).forEach(function (tr) { tracks.push(tr); });
			lrows.push({ n: +is.n, title: { ar: 'لاشين ' + App.num(is.n) + ': ' + is.title.ar + ' (اقرألي)', en: 'Lasheen ' + is.n + ': ' + (is.title.en || is.title.ar) + ' (Iqraaly)' },
				href: App.issueHref('lasheen', is), thumb: ((App.data().issueInfo || {})[k] || {}).cover || '', start: start, count: tracks.length - start, mins: minsFrom(start) });
		});
		/* on StoriaPod, one row a book; then its audio dramas (of book one, and of the spin-off), one row each with its episodes inside */
		var SP = A.storiapod;
		Object.keys((SP && SP.items) || {}).forEach(function (k) {
			var is = (S.seriesIssues('lasheen') || []).filter(function (x) { return 'lasheen-' + x.n === k; })[0];
			if (!is) return;
			var start = tracks.length;
			window.Cassette.storiapodTracks(k, L('لاشين ', 'Lasheen ') + App.num(is.n) + ': ' + t(is.title)).forEach(function (tr) { tracks.push(tr); });
			lrows.push({ n: +is.n + .1, title: { ar: 'لاشين ' + App.num(is.n) + ': ' + is.title.ar + ' (ستوريا بود)', en: 'Lasheen ' + is.n + ': ' + (is.title.en || is.title.ar) + ' (StoriaPod)' },
				href: App.issueHref('lasheen', is), thumb: ((App.data().issueInfo || {})[k] || {}).cover || '', start: start, count: tracks.length - start, mins: minsFrom(start) });
		});
		((SP && SP.dramas) || []).forEach(function (dr) {
			/* lasheen-1 sits after book one; the spin-off lasheen-x18 between books 17 and 18 */
			var m = /^lasheen-(x?)(\d+)$/.exec(dr.key) || [], drStart = tracks.length;
			dr.eps.forEach(function (ep, k) {
				var label = App.num(k + 1) + '. ' + ep[2];
				tracks.push({ title: t(dr.title), ep: label, sub: L('دراما صوتية', 'Audio drama') + ' · ' + label, url: SP.episode + encodeURIComponent(ep[0]), mins: ep[1] || null,
					provider: 'StoriaPod', providerAr: 'ستوريا بود', skin: 'midnight', art: dr.art });
			});
			lrows.push({ n: m[1] ? m[2] - .5 : +m[2] + .2, title: { ar: dr.title.ar + ' — ' + dr.by.ar + ' (ستوريا بود، ' + App.num(dr.year) + ')', en: dr.title.en + ', ' + dr.by.en + ' (StoriaPod, ' + dr.year + ')' },
				href: 'book.html?id=' + encodeURIComponent(dr.key), thumb: dr.art, start: drStart, count: tracks.length - drStart, mins: minsFrom(drStart) });
		});
		/* on Audiohat, one row a book, its parts inside */
		(A.lasheenBooks || []).forEach(function (b) {
			var is = (S.seriesIssues('lasheen') || []).filter(function (x) { return +x.n === b.n; })[0];
			if (!is) return;
			var start = tracks.length, name = L('لاشين ', 'Lasheen ') + App.num(b.n) + ': ' + t(is.title);
			b.eps.forEach(function (ep, k) {
				var label = L('الجزء ', 'Part ') + App.num(k + 1);
				tracks.push({ title: name, ep: label, sub: L('كتاب مسموع', 'Audiobook') + ' · ' + label, url: window.Cassette.pageUrl(A, ep[0]), mins: ep[1] || null, skin: 'midnight', art: b.art });
			});
			lrows.push({ n: b.n, title: { ar: 'لاشين ' + App.num(b.n) + ': ' + is.title.ar + ' (Audiohat، ' + App.num(b.year) + ')', en: 'Lasheen ' + b.n + ': ' + (is.title.en || is.title.ar) + ' (Audiohat, ' + b.year + ')' },
				href: App.issueHref('lasheen', is), thumb: b.art, start: start, count: tracks.length - start, mins: minsFrom(start) });
		});
		/* and the comic episodes made after the show, «قبل منتصف الليل!» */
		var sp = A.midnightSpoofs;
		if (sp && sp.eps.length) {
			var spStart = tracks.length;
			sp.eps.forEach(function (ep) {
				tracks.push({ title: t(sp.title), ep: ep[2], sub: L('حلقة ساخرة', 'Comic episode') + ' · ' + ep[2], url: window.Cassette.pageUrl(A, ep[0]), mins: ep[1] || null, skin: 'midnight', art: ep[3] || sp.art });
			});
			srows2.push({ title: { ar: sp.title.ar + ' (' + sp.years + ')', en: sp.title.en + ' (' + sp.years + ')' }, thumb: sp.art, start: spStart, count: tracks.length - spStart,
				mins: minsFrom(spStart) });
		}
		srows2 = srows2.filter(function (r) { return r.count > 0; });
		if (srows2.length) groups.push({
			title: { ar: 'بعد منتصف الليل — مواسم «لاشين»', en: 'After Midnight — the Lasheen seasons' },
			note: { ar: 'عاد البرنامج الذي كتب عنه في «أسطورة بعد منتصف الليل» بمواسم جديدة على Audiohat من تأليف شيرين هنائي، ومنها خرجت روايات «لاشين»؛ ومعها حلقتا «قبل منتصف الليل!» الساخرتان.',
				en: 'The radio show he wrote of in “The Legend of After Midnight” came back on Audiohat in new seasons written by Sherine Hanaey, out of which the Lasheen novels grew; with them, the two comic episodes of “Before Midnight!”.' },
			rows: srows2
		});
		lrows = lrows.filter(function (r) { return r.count > 0; }).sort(function (a, b) { return a.n - b.n; });
		if (lrows.length) groups.push({
			title: { ar: 'روايات «لاشين» مسموعة', en: 'The Lasheen novels, out loud' },
			note: { ar: 'سلسلة شيرين هنائي التي خرجت من «بعد منتصف الليل»: الكتب من الأول إلى الثامن على «اقرألي» بصوت محمد خميس، ومن الأول إلى الرابع على «ستوريا بود» بصوته أيضًا ومعها مسلسل «العهد» الصوتي، والخامس عشر على Audiohat؛ الزر يفتح صفحة الكتاب هناك.',
				en: 'Sherine Hanaey’s series that grew out of After Midnight: books one to eight on Iqraaly, read by Mohamed Khamis; one to four on StoriaPod, read by him too, with the audio drama “The Covenant”; and book fifteen on Audiohat. The key opens the book’s page there.' },
			rows: lrows
		});

		/* which sections are open, kept for this visit (the first one always) */
		var openGroups = [0];
		try { var og = JSON.parse(sessionStorage.getItem('akt-audio-open') || 'null'); if (Array.isArray(og)) openGroups = og; } catch (x) {}

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
					'<p style="color:var(--paper-dim);margin:0 0 14px">' + L('◀◀ و ▶▶ ينقلانك بين الحلقات. حلقات Audiohat وكتب Storytel و«اقرألي» تُسمع على مواقعها: زر «استمع على …» يفتح صفحتها هناك، أما فيديوهات YouTube فتُشغَّل هنا تحت الشريط. «الحلقات» تفتح أجزاء العدد أو الكتاب، وكل قسم يُفتح ويُطوى من عنوانه.', '◀◀ and ▶▶ wind between episodes. Audiohat episodes and Storytel and Iqraaly audiobooks are heard on their own sites: the «Listen on …» key opens the page there, while YouTube videos play here, under the tape. «Episodes» opens an issue’s or a book’s parts, and each section opens and closes on its title.') + '</p>' +
					/* each episode once (a special listed under two series is one), as the platform chips count them */
					'<p style="color:var(--muted);margin:0">' + App.num(perPlatform[platform] || 0) + ' ' + L('حلقة', 'episodes') + ' · ' +
						'<a href="' + e(A.author) + '" target="_blank" rel="noopener">' + L('صفحته على Audiohat ↗', 'His page on Audiohat ↗') + '</a>' +
						(A.storytel ? ' · <a href="' + e(A.storytel.author) + '" target="_blank" rel="noopener">' + L('صفحته على Storytel ↗', 'His page on Storytel ↗') + '</a>' : '') +
						(A.youtube && A.youtube.eslamAdel ? ' · <a href="' + e(A.youtube.eslamAdel.channel.url) + '" target="_blank" rel="noopener">' + L('قائمة إسلام عادل على YouTube ↗', 'Eslam Adel’s list on YouTube ↗') + '</a>' : '') +
						(A.youtube && A.youtube.dubvoFantasia ? ' · <a href="' + e(A.youtube.dubvoFantasia.url) + '" target="_blank" rel="noopener">' + L('«فانتازيا» من Dubvo على YouTube ↗', 'Fantasia by Dubvo on YouTube ↗') + '</a>' : '') + '</p>' +
					/* show one platform, or all of them */
					'<div class="chips au-platforms" role="group" aria-label="' + e(L('المنصة', 'Platform')) + '">' +
						[['all', L('الكل', 'All')], ['audiohat', 'Audiohat'], ['storytel', 'Storytel'], ['iqraaly', L('اقرألي', 'Iqraaly')], ['storiapod', L('ستوريا بود', 'StoriaPod')], ['youtube', 'YouTube']].filter(function (p) { return p[0] === 'all' || perPlatform[p[0]]; }).map(function (p) {
							return '<button type="button" class="chip" data-platform="' + p[0] + '" aria-pressed="' + (platform === p[0]) + '">' + e(p[1]) + '<span class="count">' + App.num(perPlatform[p[0]]) + '</span></button>';
						}).join('') + '</div></div>' +
			'</div></section>' +
			/* each section opens and closes on its title: the first starts open, and the ones you open stay so while you browse */
			'<section class="section"><div class="wrap"><div class="ep-groups">' + groups.map(function (g, gi) {
				return '<details class="ep-group" data-g="' + gi + '"' + (gi === 0 || openGroups.indexOf(gi) >= 0 ? ' open' : '') + '><summary><h3>' + tx(g.title) + ' <small style="color:var(--muted);font-family:var(--f-latin);font-size:15px">(' + App.num(g.rows.length) + (g.total ? ' / ' + App.num(g.total) : '') + ')</small></h3></summary>' +
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
											'<span class="tt">' + e(tr.ep || tr.title) + '<small>' + (tr.yt ? e(tr.channel || 'YouTube') : (tr.provider || 'Audiohat')) + (tr.mins ? ' · ' + App.num(tr.mins) + ' ' + L('دقيقة', 'min') : '') + '</small></span>' +
											'<button type="button" data-start="' + (r.start + k) + '">' + L('ضعها في المسجل', 'Load tape') + '</button></li>';
									}).join('') + '</ol>'
								: '<button type="button" data-start="' + r.start + '">' + L('ضعه في المسجل', 'Load tape') + '</button>') +
						'</li>';
					}).join('') + '</ul></details>';
			}).join('') + '</div>' +
			'<p class="audio-credit">' + L('التسجيلات وحقوقها لـ Audiohat وStorytel و«اقرألي» وناشريها («شركة سلاح التلميذ للطباعة والنشر» وغيرها)، ودراما «سافاري» الإذاعية من قناة «تسجيل» و«فانتازيا» من «دار النشر الصوتية – Dubvo» على YouTube. هذا الموقع يربط إليها أو يعرضها عبر مشغّل YouTube فقط، ولا يستضيف أي صوت منها.',
				'Recordings and rights belong to Audiohat, Storytel, Iqraaly and their publishers (Salah El Telmeez for Printing & Publishing and others); the Safari radio drama is from the Tasgeel channel and Fantasia from Dubvo, on YouTube. This site only links to them or plays them through the YouTube player, and hosts none of their audio.') + '</p>' +
			'</div></section>';

		root.querySelectorAll('details.ep-group').forEach(function (d) {
			d.addEventListener('toggle', function () {
				var open = [].map.call(root.querySelectorAll('details.ep-group[open]'), function (x) { return +x.getAttribute('data-g'); });
				try { sessionStorage.setItem('akt-audio-open', JSON.stringify(open)); } catch (x) {}
			});
		});

		var deck = window.Cassette.mount(document.getElementById('a-cassette'), { tracks: tracks });
		var lists = root.querySelectorAll('.ep-list li');
		/* the row of the issue on the tape, and in its opened list the episode itself */
		function mark(i) {
			lists.forEach(function (li) {
				var s = +li.getAttribute('data-start'), n = +(li.getAttribute('data-count') || 1);
				li.classList.toggle('cur', i >= s && i < s + n);
			});
		}
		/* (assigned, not added: the page is drawn again when the platform changes) */
		root.onclick = function (ev) {
			var pb = ev.target.closest('button[data-platform]');
			if (pb) {
				self.platform = pb.getAttribute('data-platform');
				try { sessionStorage.setItem('akt-audio-platform', self.platform); } catch (x) {}
				self.render();
				return;
			}
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
		};
	}
};

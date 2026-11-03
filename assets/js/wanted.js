/* wanted.html — «ما ينقص الأرشيف»: what the archive is missing, counted from the data itself every time the page opens, so it is
   never out of date: the Fantasia worlds and Safari cases not known yet (data-pages.js), the issues whose back-cover text is
   only the series' own (or none: data-blurbs.js), the back covers no one has sent, the editions with no year, and the text with
   no English, and the outside links that no longer answer (assets/data/links.json, from tools/check-links.js). Each part says why it matters, lists what is missing (each to its page), and how to send it. */
window.PAGE = {
	id: 'wanted',
	title: { ar: 'ما ينقص الأرشيف', en: 'Wanted for the archive' },
	strings: {
		eyebrow: { ar: 'خلف الكواليس', en: 'Behind the site' },
		title: { ar: 'ما ينقص الأرشيف', en: 'Wanted for the archive' },
		lead: {
			ar: 'هذا الأرشيف يكمله قرّاؤه: هنا كل ما ينقصه مما نعرف أنه ينقص، محسوبًا من بياناته نفسها. إن كان عندك شيء منه، صورة أو سنة أو سطر، فأرسله.',
			en: 'This archive is finished by its readers: here is everything we know it lacks, counted from its own data. If you have any of it, a picture, a year or a line, send it.'
		}
	},

	/* the band: a shelf of the archive's covers with gaps where something is missing, each gap a question mark that lights now and then */
	band: function (d, A) {
		var S = window.WorksShared, e = A.esc, covers = [];
		['mwt', 'fantasia', 'safari'].forEach(function (sid) { S.seriesIssues(sid).slice(0, 14).forEach(function (is) { var c = S.issueCover(sid, is); if (c) covers.push(c); }); });
		var row = '';
		for (var i = 0; i < 26; i++) {
			row += (i % 4 === 2 ? '<span class="wn-gap" style="--i:' + i + '">؟</span>' : '<img class="wn-cv" src="' + e(A.thumb(covers[(i * 7) % covers.length] || '')) + '" alt="" loading="lazy">');
		}
		return '<div class="wn-shelf">' + row + '</div><i class="wn-board"></i>';
	},

	parts: function () {
		var App = window.App, S = window.WorksShared, d = App.data(), t = App.t, L = App.L, out = [];
		var label = function (k) {
			var r = S.resolveBook(k);
			if (!r) return k;
			return r.kind === 'issue' && r.series ? t(r.series.s.title) + ' ' + App.num(r.item.n) + ': ' + t(r.item.title) : t(r.item.title);
		};
		/* the Fantasia worlds and Safari cases not known yet */
		[['fantasia', 'fantasiaWorlds', 'world', 'worlds.html', { ar: 'عوالم «فانتازيا» التي لم نعرفها', en: 'Fantasia worlds not known yet' },
			{ ar: 'الأعداد التي لا يقول غلافها الخلفي إلى أي عالم تأخذ عبير. قرأت واحدًا منها؟ أخبرنا بالعالم الذي يدخله (أسطورة، رواية، فيلم، حقبة).', en: 'The issues whose back cover does not say which world Abeer goes to. Read one? Tell us the world it enters (a myth, a novel, a film, an era).' }],
		 ['safari', 'safariCases', 'case', 'clinic.html', { ar: 'حالات «سافاري» التي لم نعرفها', en: 'Safari cases not known yet' },
			{ ar: 'الأعداد التي لا يقول غلافها الخلفي ما حالتها: المرض أو القبيلة أو اللغز. قرأت واحدًا منها؟ أخبرنا بما فيه.', en: 'The issues whose back cover does not say what the case is: the disease, the tribe or the mystery. Read one? Tell us what is in it.' }]
		].forEach(function (p) {
			var items = (d[p[1]] || []).filter(function (x) { return !x[p[2]]; }).map(function (x) { return { href: p[3] + '#' + p[0] + '-' + x.n, label: label(p[0] + '-' + x.n) }; });
			out.push({ id: p[0], title: p[4], why: p[5], items: items, of: (d[p[1]] || []).length, done: { ar: p[0] === 'fantasia' ? 'عوالم «فانتازيا» معروفة' : 'حالات «سافاري» معروفة', en: p[0] === 'fantasia' ? 'Fantasia worlds known' : 'Safari cases known' } });
		});
		/* the back-cover text: none, or only the series' own words (the same text on three issues or more) */
		var seen = {}, texts = {}, bare = function (s) { return String(s || '').replace(/["“”\s]+/g, ' ').trim(); };
		var blurbOf = function (k) { var b = ((d.issueInfo || {})[k] || {}).blurb || (d.blurbs || {})[k]; return bare(t(b)); };
		var keys = [];
		(d.series || []).forEach(function (s) {
			if (s.id === 'rwg') return;
			S.seriesIssues(s.id).forEach(function (is) { if (is.n == null || is.part > 1) return; var k = s.id + '-' + is.n; if (!seen[k]) { seen[k] = 1; keys.push(k); } });
		});
		keys.forEach(function (k) { var b = blurbOf(k); if (b) texts[b] = (texts[b] || 0) + 1; });
		out.push({ id: 'blurbs', title: { ar: 'أعداد بلا نص غلافها الخلفي', en: 'Issues without their back-cover text' },
			why: { ar: 'نص الغلاف الخلفي يُعرض في صفحة العدد، ومنه نعرف ما فيه. هذه الأعداد ليس عندنا نصها، أو عندنا فقط النص العام للسلسلة. صورة واضحة للغلاف الخلفي تكفي.', en: 'The back-cover text is shown on the issue’s page, and tells what it holds. For these we have no text, or only the series’ general one. A clear photo of the back cover is enough.' },
			items: keys.filter(function (k) { var b = blurbOf(k); return !b || texts[b] >= 3; }).map(function (k) { return { href: 'book.html?id=' + k, label: label(k) }; }),
			of: keys.length, done: { ar: 'أعداد بنص غلافها الخلفي', en: 'Issues with their back-cover text' } });
		/* the back covers no one has sent */
		var noBack = [];
		keys.forEach(function (k) { if (!S.backOf(k)) noBack.push({ href: 'book.html?id=' + k, label: label(k) }); });
		(d.works || []).forEach(function (w) { if (!S.backOf(w.id)) noBack.push({ href: S.bookHref(w.id), label: t(w.title) }); });
		out.push({ id: 'backs', title: { ar: 'أغلفة خلفية لم تصلنا', en: 'Back covers we do not have' },
			why: { ar: 'صورة الغلاف الخلفي تظهر حين تقلب الكتاب في صفحته. صوّر غلاف نسختك الخلفي وأرسله، مع الطبعة وسنتها إن عرفتها.', en: 'The back cover shows when you turn the book over on its page. Photograph your copy’s back and send it, with the edition and its year if you know them.' },
			items: noBack, of: keys.length + (d.works || []).length, done: { ar: 'أعداد وكتب بغلافها الخلفي', en: 'Issues and books with their back cover' } });
		/* the editions with no year */
		var noYear = [], eds = 0;
		[d.issueInfo, d.bookInfo].forEach(function (m) {
			Object.keys(m || {}).forEach(function (k) {
				eds += (m[k].editions || []).length;
				var n = (m[k].editions || []).filter(function (ed) { return !ed.year && !ed.date; }).length;
				if (n) noYear.push({ href: 'book.html?id=' + encodeURIComponent(k), label: label(k), n: n });
			});
		});
		out.push({ id: 'dates', title: { ar: 'طبعات بلا سنة', en: 'Editions with no year' },
			why: { ar: 'السنة هي ما يرتّب الطبعات ويضعها في «تقويم العرّاب». سنة الطبع مكتوبة عادة في الصفحة الأولى من الكتاب أو آخره.', en: 'The year orders the editions and puts them in the calendar. The printing year is usually on the book’s first or last page.' },
			items: noYear, missing: noYear.reduce(function (a, x) { return a + x.n; }, 0), of: eds, done: { ar: 'طبعات بسنتها', en: 'Editions with their year' } });
		/* the series whose ending is not written yet (series-page.js endingHtml) */
		var own = S.ownSeries().filter(function (s) { return S.seriesIssues(s.id).length; }), ends = d.seriesEndings || {};
		out.push({ id: 'endings', title: { ar: 'سلاسل لم نكتب نهايتها', en: 'Series whose ending is not written' },
			why: { ar: 'في صفحة كل سلسلة قسم «النهاية»: كيف انتهت، مخفيًّا حتى يطلبه القارئ. هذه السلاسل لم نكتبه لها بعد؛ أرسل سطرين عن نهايتها ومصدرهما.', en: 'Each series page has «The ending»: how it ended, hidden until the reader asks. These series have none yet; send two lines on how it ended, and where that comes from.' },
			items: own.filter(function (s) { return !ends[s.id]; }).map(function (s) { return { href: S.seriesHref(s.id), label: t(s.title) }; }), of: own.length, done: { ar: 'سلاسل بنهايتها', en: 'Series with their ending' } });
		/* the text with no English yet (the printed back covers stay Arabic, as printed) */
		var en = {}, texts2 = 0, walk = function (o, top, depth) {
			if (!o || typeof o !== 'object' || depth > 8) return;
			if (typeof o.ar === 'string' && o.ar.trim()) texts2++;
			if (typeof o.ar === 'string' && o.ar.trim() && !String(o.en || '').trim()) en[top] = (en[top] || 0) + 1;
			for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) walk(o[k], top, depth + 1);
		};
		Object.keys(d).forEach(function (k) { if (k !== 'blurbs' && k !== 'blog') walk(d[k], k, 0); });
		var NAMES = { issueInfo: { ar: 'تفاصيل الأعداد', en: 'Issue details' }, bookInfo: { ar: 'تفاصيل الكتب', en: 'Book details' }, works: { ar: 'الكتب', en: 'Books' }, issues: { ar: 'الأعداد', en: 'Issues' },
			characters: { ar: 'الشخصيات', en: 'Characters' }, writers: { ar: 'الكتّاب', en: 'Writers' }, audio: { ar: 'المسموع', en: 'Audio' }, tributes: { ar: 'قالوا عنه', en: 'Tributes' },
			legacy: { ar: 'الإرث', en: 'Legacy' }, media: { ar: 'اللقاءات', en: 'Interviews' }, seriesInfo: { ar: 'تفاصيل السلاسل', en: 'Series details' }, quotes: { ar: 'الاقتباسات', en: 'Quotes' } };
		out.push({ id: 'english', title: { ar: 'نصوص بلا إنجليزية', en: 'Text with no English' },
			why: { ar: 'الموقع بلغتين، وهذه نصوص عربية لم تُترجم بعد. إن كنت تجيد الإنجليزية فترجمة سطر واحد تفيد.', en: 'The site is in two languages, and these are Arabic texts not translated yet. If you write English, even one line helps.' },
			of: 0, done: { ar: 'نصوص بالإنجليزية', en: 'Text in English' },
			counts: Object.keys(en).sort(function (a, b) { return en[b] - en[a]; }).map(function (k) { return { label: t(NAMES[k] || { ar: k, en: k }), n: en[k] }; }) });
		out[out.length - 1].of = texts2;
		/* «حالة الروابط»: the outside links the site cites that no longer answer (assets/data/links.json, tools/check-links.js) */
		var lk = this.links;
		if (lk && lk.total) out.push({ id: 'links', title: { ar: 'روابط لم تعد تعمل', en: 'Links that no longer work' },
			why: { ar: 'مصادر الموقع روابط إلى مواقع أخرى، وبعضها يختفي مع الوقت. هذه روابط لم تُجب حين فُحصت في ' + App.num(lk.checked) + '. إن وجدت نسخة منها في أرشيف الإنترنت أو مكانها الجديد فأرسله.', en: 'The site’s sources are links to other sites, and some vanish with time. These did not answer when checked on ' + lk.checked + '. If you find a copy in the Internet Archive, or where it moved, send it.' },
			items: lk.dead.map(function (x) {
				var host = (x.u.match(/^https?:\/\/(?:www\.)?([^\/]+)/) || [])[1] || x.u, rest = x.u.replace(/^https?:\/\/[^\/]+/, '');
				try { rest = decodeURI(rest); } catch (err) {}
				return { href: x.w[0] || x.u, label: host + (rest.length > 1 ? ' — ' + rest.slice(0, 60) : ''), alt: { href: 'https://web.archive.org/web/*/' + x.u, label: L('في الأرشيف ↗', 'archived ↗') } };
			}), of: lk.total - lk.unknown, done: { ar: 'روابط تعمل', en: 'Links that work' } });
		return out;
	},

	render: function () {
		var self = this;
		/* the link check first (a small file), then the page; without it, the page as it was */
		if (this.links === undefined) {
			fetch('assets/data/links.json').then(function (r) { return r.ok ? r.json() : null; }).catch(function () { return null; })
				.then(function (x) { self.links = x; self.render(); });
			return;
		}
		var App = window.App, e = App.esc, t = App.t, L = App.L, parts = this.parts();
		var total = function (p) { return p.missing != null ? p.missing : p.items ? p.items.length : p.counts.reduce(function (s, c) { return s + c.n; }, 0); };
		/* «حالة الأرشيف»: how far along each part is, the most nearly done first */
		var bars = parts.filter(function (p) { return p.of; }).map(function (p) { return { p: p, pc: Math.max(0, Math.min(100, Math.round((p.of - total(p)) / p.of * 100))) }; })
			.sort(function (a, b) { return b.pc - a.pc; });
		var all = bars.reduce(function (a, b) { return a + b.pc; }, 0) / (bars.length || 1);
		/* (beside the side menu of the pages about the site, app.js infoTabs) */
		document.getElementById('content').innerHTML = '<section class="section wn"><div class="wrap info-wrap">' + App.infoTabs('wanted') + '<div class="info-body">' +
			'<section class="wn-status" id="status"><h2>' + e(L('حالة الأرشيف', 'The archive’s progress')) + ' <small>' + e(App.num(Math.round(all)) + '%') + '</small></h2>' +
				'<p class="wn-why">' + e(L('ما اكتمل من كل جزء من الأرشيف، محسوبًا الآن من بياناته؛ وتحتها ما ينقص كل جزء، فما ترسله يرفع هذه الأشرطة.', 'How complete each part of the archive is, counted now from its data; below, what each part lacks, so whatever you send moves these bars.')) + '</p>' +
				'<ul class="wn-bars">' + bars.map(function (b) {
					return '<li><a href="#' + b.p.id + '"><span class="wn-bar-t">' + e(t(b.p.done)) + '</span><span class="wn-bar-n">' + e(App.num(b.p.of - total(b.p)) + ' / ' + App.num(b.p.of)) + '</span>' +
						'<span class="wn-bar" role="progressbar" aria-valuenow="' + b.pc + '" aria-valuemin="0" aria-valuemax="100"><i style="width:' + b.pc + '%"></i></span><b>' + e(App.num(b.pc) + '%') + '</b></a></li>';
				}).join('') + '</ul></section>' +
			'<nav class="wn-sum" aria-label="' + e(L('الأقسام', 'Parts')) + '">' + parts.map(function (p) {
				return '<a href="#' + p.id + '"><b>' + e(App.num(total(p))) + '</b><span>' + e(t(p.title)) + '</span></a>';
			}).join('') + '</nav>' +
			parts.map(function (p) {
				var n = total(p), list = p.items
					? '<ul class="wn-list">' + p.items.slice(0, 60).map(function (x) { return '<li><a href="' + e(x.href) + '"' + (x.alt ? ' dir="ltr"' : '') + '>' + e(x.label) + '</a>' + (x.n > 1 ? ' <small>(' + e(App.num(x.n)) + ')</small>' : '') + (x.alt ? ' <a class="wn-alt" href="' + e(x.alt.href) + '" target="_blank" rel="noopener">' + e(x.alt.label) + '</a>' : '') + '</li>'; }).join('') + '</ul>' +
						(p.items.length > 60 ? '<details class="wn-more"><summary>' + e(L('والباقي (' + App.num(p.items.length - 60) + ')', 'And the rest (' + (p.items.length - 60) + ')')) + '</summary><ul class="wn-list">' +
							p.items.slice(60).map(function (x) { return '<li><a href="' + e(x.href) + '">' + e(x.label) + '</a></li>'; }).join('') + '</ul></details>' : '')
					: '<ul class="wn-counts">' + p.counts.map(function (c) { return '<li><span>' + e(c.label) + '</span><b>' + e(App.num(c.n)) + '</b></li>'; }).join('') + '</ul>';
				return '<section class="wn-part" id="' + p.id + '"><h2>' + e(t(p.title)) + ' <small>' + e(App.num(n)) + '</small></h2><p class="wn-why">' + e(t(p.why)) + '</p>' +
					(n ? list : '<p class="wn-done">' + e(L('لا شيء ينقص هنا الآن. شكرًا لمن أرسل.', 'Nothing missing here now. Thank you to all who sent.')) + '</p>') +
					'<p class="wn-send"><a class="share-btn" href="' + e(App.fixHref(t(p.title))) + '" target="_blank" rel="noopener">' + e(L('أرسل على GitHub ↗', 'Send it on GitHub ↗')) + '</a>' +
						'<a class="share-btn" href="contact.html#contribute">' + e(L('أو بالبريد من «تواصل وساهم»', 'Or by email from Contact')) + '</a></p></section>';
			}).join('') +
			'<p class="wn-note">' + e(L('تُحسب هذه القوائم من بيانات الموقع كلما فُتحت الصفحة، فما يُضاف يختفي منها وحده.', 'These lists are counted from the site’s data each time the page opens, so whatever is added drops off them by itself.')) + '</p>' +
		'</div></div></section>';
		App.focusHash();
	}
};

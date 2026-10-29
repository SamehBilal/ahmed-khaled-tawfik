/* screen.html — «على الشاشة»: his work on screen, in the order it came — Refaat Ismail's first appearance in Amr Salama's film
   (2008), then the three series (AKT.adaptations). Each with its poster, what it was and where, the book it came from, its
   trailer (from the maker's own channel, loaded only when pressed, from youtube-nocookie) and the articles about it on the site. */
window.PAGE = {
	id: 'screen',
	title: { ar: 'على الشاشة', en: 'On screen' },
	strings: {
		eyebrow: { ar: 'من الورق إلى الشاشة', en: 'From page to screen' },
		title: { ar: 'على الشاشة', en: 'On screen' },
		lead: {
			ar: 'أعماله حين صارت صورة: من أول ظهور لرفعت إسماعيل في فيلم عام 2008، إلى «زودياك» و«ما وراء الطبيعة» على نتفليكس و«الغرفة 207».',
			en: 'His work turned into pictures: from Refaat Ismail’s first appearance in a 2008 film to Zodiac, Paranormal on Netflix, and Room 207.'
		}
	},
	/* the trailers, from the makers' own channels (checked 2026-10-30), and the articles on the site about each (by address) */
	EXTRA: {
		hazzak: { yt: 'zNfzQD0TTCk', ytLabel: { ar: 'الحلقة الأولى على قناة Viu', en: 'Episode 1, on Viu’s channel' } },
		mwt: { yt: 's9jBzFebPEM', ytLabel: { ar: 'الإعلان الرسمي — Netflix MENA', en: 'Official trailer — Netflix MENA' },
			more: [['Z5np6U8Wo9c', { ar: 'وثائقي «ما وراء القصة» — Netflix MENA', en: 'Behind the story, a documentary — Netflix MENA' }]],
			press: /nogoumfm|denofgeek|arabnews\.com\/art-culture\/inside-paranormal|birthing-the-ugly-hero|xTz5TrNKUDc|ajnet\.me\/arts\/2021\/4\/2|masrawy.*994476/ },
		room207: { yt: 'WfiTOt3CKZk', ytLabel: { ar: 'الإعلان — شاهد', en: 'Trailer — Shahid' }, press: /ahram\.org\.eg\/News\/482542/ }
	},

	items: function () {
		var App = window.App, d = App.data(), out = [];
		/* Refaat's first time on screen, kept with Amr Salama among the writers he influenced */
		var first = null;
		((d.writers || {}).influenced || []).forEach(function (w) { if (!first && /Like Today/.test((w.work || {}).en || '')) first = w; });
		if (first) out.push({ id: 'zay', year: first.year, title: { ar: 'زي النهارده', en: 'On a Day Like Today' }, kind: { ar: 'فيلم سينمائي', en: 'Feature film' },
			poster: first.cover, text: first.text, source: first.source, cameo: true, basedOn: 'mwt' });
		(d.adaptations || []).forEach(function (a) { out.push(Object.assign({ id: a.basedOn }, a)); });
		return out.sort(function (a, b) { return a.year - b.year; });
	},

	/* the band: a film strip running past, a frame for each poster, and a projector's beam */
	band: function (d, A) {
		var posters = window.PAGE.items().map(function (x) { return x.poster; }).filter(Boolean), frames = '';
		for (var k = 0; k < 3; k++) posters.forEach(function (p) { frames += '<i style="background-image:url(&quot;' + A.esc(p) + '&quot;)"></i>'; });
		return '<i class="sc-beam"></i><div class="sc-strip"><div class="sc-run">' + frames + frames + '</div></div>';
	},

	render: function () {
		var App = window.App, S = window.WorksShared, d = App.data(), e = App.esc, t = App.t, L = App.L, self = this;
		var media = d.media || [];
		var book = function (id) {
			var ser = S.anySeries(id), w = !ser && App.findWork(id);
			if (ser) return { href: S.seriesHref(id), title: t(ser.s.title), cover: S.seriesCover(id), what: L('سلسلة', 'Series') };
			if (w) return { href: S.bookHref(id), title: t(w.title), cover: S.coverOf((d.bookInfo || {})[id]), what: L('رواية', 'Novel') };
			return null;
		};
		var player = function (id, label) {
			return '<button type="button" class="sc-yt" data-yt="' + e(id) + '" style="background-image:url(&quot;https://i.ytimg.com/vi/' + e(id) + '/hqdefault.jpg&quot;)">' +
				'<span class="sc-play" aria-hidden="true">▶</span><span class="sc-yt-l">' + e(t(label)) + '</span></button>';
		};
		document.getElementById('content').innerHTML = '<section class="section sc"><div class="wrap">' +
			this.items().map(function (x) {
				var ex = self.EXTRA[x.id] || {}, b = book(x.basedOn), press = ex.press ? media.filter(function (m) { return ex.press.test(decodeURIComponent(m.url)); }) : [];
				return '<article class="sc-item' + (x.cameo ? ' is-cameo' : '') + '">' +
					'<div class="sc-poster">' + (x.poster ? '<img src="' + e(x.poster) + '" alt="' + e(t(x.title)) + '" loading="lazy">' : '') + '<b class="sc-year">' + e(App.num(x.year)) + '</b></div>' +
					'<div class="sc-body">' +
						'<p class="eyebrow">' + e(t(x.kind)) + (x.cameo ? ' · ' + e(L('أول ظهور لرفعت إسماعيل', 'Refaat Ismail’s first appearance')) : '') + '</p>' +
						'<h2>' + e(t(x.title)) + '</h2>' +
						'<p class="sc-text">' + e(t(x.text)) + '</p>' +
						(b ? '<a class="sc-from" href="' + e(b.href) + '">' + (b.cover ? '<img src="' + e(b.cover) + '" alt="" loading="lazy">' : '') +
							'<span><small>' + e(L('مأخوذ عن', 'Based on')) + ' · ' + e(b.what) + '</small><b>' + e(b.title) + '</b></span></a>' : '') +
						(ex.yt || ex.more ? '<div class="sc-videos">' + (ex.yt ? player(ex.yt, ex.ytLabel) : '') + (ex.more || []).map(function (m) { return player(m[0], m[1]); }).join('') + '</div>' : '') +
						(press.length ? '<div class="sc-press"><h3>' + e(L('كُتب عنه', 'Written about it')) + '</h3><ul>' + press.map(function (m) {
							return '<li><a href="' + e(m.url) + '" target="_blank" rel="noopener">' + e(t(m.title)) + '</a> <small>' + e(t(m.outlet)) + (m.year ? ' · ' + e(App.num(m.year)) : '') + '</small></li>';
						}).join('') + '</ul></div>' : '') +
						(x.source || x.posterSource ? '<a class="sc-src" href="' + e(x.source || x.posterSource) + '" target="_blank" rel="noopener">' + e(L('المصدر ↗', 'Source ↗')) + '</a>' : '') +
					'</div></article>';
			}).join('') +
		'</div></section>';
		/* a trailer loads only when pressed */
		document.querySelector('.sc').addEventListener('click', function (ev) {
			var b = ev.target.closest('.sc-yt');
			if (!b) return;
			var f = document.createElement('iframe');
			f.src = 'https://www.youtube-nocookie.com/embed/' + b.getAttribute('data-yt') + '?autoplay=1&rel=0';
			f.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen'; f.allowFullscreen = true; f.title = b.textContent;
			f.className = 'sc-frame';
			b.replaceWith(f);
		});
	}
};

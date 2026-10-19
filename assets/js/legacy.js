window.PAGE = {
	id: 'legacy',
	title: { ar: 'الإرث', en: 'Legacy' },
	strings: {
		eyebrow: { ar: 'ما بعد ٢ أبريل ٢٠١٨', en: 'After 2 April 2018' },
		title: { ar: 'الإرث', en: 'The Legacy' },
		lead: {
			ar: 'رحل العرّاب، وبقي جيلٌ تعلّم القراءة على يديه. هنا الوداع والتكريم وما تحوّل من أعماله إلى الشاشة، ثم لقاءاته ومحاضراته بصوته.',
			en: 'The Godfather is gone, but a generation that learned to read through him remains. Here are the farewell, the tributes, the screen adaptations — and his interviews and talks, in his own voice.'
		}
	},

	render: function () {
		var App = window.App, d = App.data(), e = App.esc, tx = App.tx, L = App.L;
		var legacy = d.legacy || [], media = d.media || [];
		var KIND = {
			interview: { ar: 'لقاء', en: 'Interview' }, talk: { ar: 'محاضرة / ندوة', en: 'Talk' },
			profile: { ar: 'بورتريه', en: 'Profile' }, documentary: { ar: 'وثائقي', en: 'Documentary' }, article: { ar: 'مقال', en: 'Article' }
		};
		var fmtDate = function (s) {
			if (!s) return '';
			var p = String(s).split('-');
			var months = App.lang === 'ar'
				? ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر']
				: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
			if (p.length === 3) return App.num(+p[2]) + ' ' + months[+p[1] - 1] + ' ' + App.num(p[0]);
			if (p.length === 2) return months[+p[1] - 1] + ' ' + App.num(p[0]);
			return App.num(p[0]);
		};

		var html = '';
		if (legacy.length) {
			html += '<section class="section"><div class="wrap">' +
				'<div class="section-head"><div><h2>' + L('الوداع والتكريم', 'Farewell & tributes') + '</h2></div></div>' +
				'<ol class="timeline">' + legacy.map(function (l, i) {
					return '<li class="rise" id="l-' + i + '"><div class="yr">' + e(fmtDate(l.date)) + '</div><h3>' + tx(l.title) + '</h3><p>' + tx(l.text) + '</p>' +
						(l.source ? '<a class="src" href="' + e(l.source) + '" target="_blank" rel="noopener">' + L('المصدر ↗', 'Source ↗') + '</a>' : '') + '</li>';
				}).join('') + '</ol>' +
			'</div></section>';
		}

		var ad = d.adaptations || [];
		if (ad.length) {
			html += '<section class="section"><div class="wrap">' +
				'<div class="section-head"><div><h2>' + L('على الشاشة', 'On screen') + '</h2></div></div>' +
				'<div class="adapt-grid">' + ad.map(function (a) {
					return '<article class="adapt rise"><div class="kind">' + tx(a.kind) + '</div><h3>' + tx(a.title) + '</h3>' +
						'<div class="yr">' + App.num(a.year || '') + (App.findWork(a.basedOn) ? ' · ' + L('عن ', 'from ') + App.workLink(a.basedOn) : '') + '</div>' +
						'<p>' + tx(a.text) + '</p></article>';
				}).join('') + '</div>' +
			'</div></section>';
		}

		if (media.length) {
			var kinds = [];
			var self = this;
			var card = function (m, i) {
				var head = '<span class="kind">' + tx(KIND[m.kind] || { ar: m.kind, en: m.kind }) + (m.lang ? '<span class="lng">' + e(m.lang === 'ar' ? 'عربي' : 'EN') + '</span>' : '') + '</span>' +
					'<h3>' + tx(m.title) + '</h3>' +
					'<span class="outlet">' + tx(m.outlet) + (m.year ? ' · ' + App.num(m.year) : '') + '</span>' +
					(m.note && App.t(m.note) ? '<p>' + tx(m.note) + '</p>' : '');
				var yt = self.youtubeId(m.url);
				if (yt) {
					return '<button type="button" class="media has-thumb rise" id="m-' + i + '" data-yt="' + e(yt) + '" data-i="' + i + '">' +
						'<span class="thumb"><img src="https://i.ytimg.com/vi/' + e(yt) + '/hqdefault.jpg" alt="" loading="lazy">' +
						'<span class="play" aria-hidden="true"><svg viewBox="0 0 24 24" width="26" height="26"><path d="M8 5v14l11-7z" fill="currentColor"/></svg></span></span>' +
						'<span class="media-body">' + head + '</span></button>';
				}
				return '<a class="media rise" id="m-' + i + '" href="' + e(m.url) + '" target="_blank" rel="noopener">' + head + '</a>';
			};
			var videos = [], reads = [];
			media.forEach(function (m, i) { (self.youtubeId(m.url) ? videos : reads).push(card(m, i)); });
			if (videos.length) {
				html += '<section class="section"><div class="wrap">' +
					'<div class="section-head"><div><h2>' + L('بصوته وصورته', 'In his own voice') + '</h2>' +
						'<p>' + L('لقاءات تلفزيونية ومحاضرات وأفلام وثائقية — اضغط لتشاهد هنا.', 'TV interviews, talks and documentaries — click to watch here.') + '</p></div></div>' +
					'<div class="media-grid" id="videos">' + videos.join('') + '</div>' +
				'</div></section>';
			}
			if (reads.length) {
				html += '<section class="section"><div class="wrap">' +
					'<div class="section-head"><div><h2>' + L('مقالات ولقاءات مكتوبة', 'Articles and written interviews') + '</h2>' +
						'<p>' + L('روابط إلى مصادرها الأصلية.', 'Linked to where they were first published.') + '</p></div></div>' +
					'<div class="media-grid">' + reads.join('') + '</div>' +
				'</div></section>';
			}
		}

		if (!html) html = '<section class="section"><div class="wrap"><p class="empty-note">' + L('لم تُضف بيانات بعد.', 'Nothing added yet.') + '</p></div></section>';
		document.getElementById('content').innerHTML = html;
		var grid = document.getElementById('videos');
		if (grid) grid.onclick = function (ev) {
			var b = ev.target.closest('[data-yt]');
			if (b) self.play(media[+b.getAttribute('data-i')], b.getAttribute('data-yt'));
		};
		App.focusHash();
	},

	/* YouTube id from watch / youtu.be / embed / shorts links */
	youtubeId: function (url) {
		var m = /(?:youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{11})/.exec(url || '');
		return m ? m[1] : '';
	},

	/* pop-up player; the iframe is created on open and removed on close so the video stops */
	play: function (m, id) {
		var App = window.App, e = App.esc, L = App.L;
		var dlg = document.getElementById('video-dialog');
		if (!dlg) {
			dlg = document.createElement('dialog');
			dlg.id = 'video-dialog';
			dlg.className = 'video-dialog';
			document.body.appendChild(dlg);
			dlg.addEventListener('click', function (ev) { if (ev.target === dlg) dlg.close(); });
			dlg.addEventListener('close', function () { dlg.innerHTML = ''; });
		}
		dlg.innerHTML =
			'<div class="frame"><iframe src="https://www.youtube-nocookie.com/embed/' + e(id) + '?autoplay=1&rel=0" title="' + e(App.t(m.title)) + '" ' +
				'allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen referrerpolicy="strict-origin-when-cross-origin"></iframe></div>' +
			'<div class="bar"><span class="ttl">' + App.tx(m.title) + '</span>' +
				'<a href="' + e(m.url) + '" target="_blank" rel="noopener">YouTube ↗</a>' +
				'<button type="button">' + L('إغلاق', 'Close') + '</button></div>';
		dlg.querySelector('.bar button').onclick = function () { dlg.close(); };
		dlg.showModal();
	}
};

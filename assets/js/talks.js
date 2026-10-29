/* talks.html — «لقاءاته»: his interviews and talks, and the films, profiles and articles about him (AKT.media — the same items
   the Legacy page lists), on a page of their own: by kind, newest first or oldest, the videos playing here (from
   youtube-nocookie, loaded only when pressed), the rest linking out. */
window.PAGE = {
	id: 'talks',
	title: { ar: 'لقاءاته', en: 'Interviews' },
	strings: {
		eyebrow: { ar: 'بصوته وعنه', en: 'In his voice, and about him' },
		title: { ar: 'لقاءاته', en: 'Interviews' },
		lead: {
			ar: 'لقاءاته التلفزيونية ومحاضراته، والأفلام والمقالات التي كُتبت عنه — الفيديو يُشاهَد هنا، والمقال يُفتح في موقعه.',
			en: 'His television interviews and talks, and the films and articles about him — the videos play here, the articles open where they were published.'
		}
	},
	KINDS: [['interview', { ar: 'لقاءات', en: 'Interviews' }], ['talk', { ar: 'محاضرات', en: 'Talks' }], ['documentary', { ar: 'أفلام وثائقية', en: 'Documentaries' }],
		['profile', { ar: 'بورتريه', en: 'Profiles' }], ['article', { ar: 'مقالات', en: 'Articles' }]],
	kind: 'all', order: 'old',

	yt: function (url) { var m = /(?:v=|youtu\.be\/|embed\/)([\w-]{11})/.exec(url || ''); return m ? m[1] : ''; },

	/* the band: a studio — two chairs under a light, a microphone, and a TV's "on air" sign */
	band: function (d, A) {
		return '<i class="tk-light"></i><i class="tk-chair a"></i><i class="tk-chair b"></i><i class="tk-mic"></i><span class="tk-air">' + A.esc(A.L('على الهواء', 'ON AIR')) + '</span>';
	},

	render: function () {
		var App = window.App, e = App.esc, L = App.L, self = this, media = App.data().media || [];
		var count = {}; media.forEach(function (m) { count[m.kind] = (count[m.kind] || 0) + 1; });
		var vids = media.filter(function (m) { return self.yt(m.url); }).length;
		var chip = function (k, label, n) { return '<button type="button" class="chip" data-k="' + k + '" aria-pressed="' + (self.kind === k) + '">' + e(label) + ' <b>' + e(App.num(n)) + '</b></button>'; };
		document.getElementById('content').innerHTML = '<section class="section tk"><div class="wrap">' +
			'<p class="tk-sum">' + e(L(App.num(media.length) + ' لقاءً وفيلمًا ومقالًا، منها ' + App.num(vids) + ' فيديو يُشاهَد هنا.', media.length + ' interviews, films and articles, ' + vids + ' of them videos you can watch here.')) + '</p>' +
			'<div class="tk-bar"><div class="chips">' + chip('all', L('الكل', 'All'), media.length) + chip('video', L('فيديو', 'Video'), vids) +
				this.KINDS.filter(function (k) { return count[k[0]]; }).map(function (k) { return chip(k[0], App.t(k[1]), count[k[0]]); }).join('') + '</div>' +
				'<button type="button" class="chip tk-order">' + e(this.order === 'old' ? L('الأقدم أولًا ↓', 'Oldest first ↓') : L('الأحدث أولًا ↓', 'Newest first ↓')) + '</button></div>' +
			'<div class="tk-list"></div></div></section>';
		var root = document.querySelector('.tk');
		root.querySelector('.tk-bar').onclick = function (ev) {
			var b = ev.target.closest('button');
			if (!b) return;
			if (b.classList.contains('tk-order')) { self.order = self.order === 'old' ? 'new' : 'old'; b.textContent = self.order === 'old' ? L('الأقدم أولًا ↓', 'Oldest first ↓') : L('الأحدث أولًا ↓', 'Newest first ↓'); }
			else { self.kind = b.getAttribute('data-k'); root.querySelectorAll('[data-k]').forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); }); }
			self.list();
		};
		root.querySelector('.tk-list').onclick = function (ev) {
			var b = ev.target.closest('.tk-play');
			if (!b) return;
			var f = document.createElement('iframe');
			f.src = 'https://www.youtube-nocookie.com/embed/' + b.getAttribute('data-yt') + '?autoplay=1&rel=0';
			f.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen'; f.allowFullscreen = true; f.className = 'tk-frame'; f.title = b.getAttribute('aria-label');
			b.replaceWith(f);
		};
		this.list();
	},

	list: function () {
		var App = window.App, e = App.esc, t = App.t, L = App.L, self = this;
		var kindName = {}; this.KINDS.forEach(function (k) { kindName[k[0]] = k[1]; });
		var list = (App.data().media || []).filter(function (m) { return self.kind === 'all' || (self.kind === 'video' ? self.yt(m.url) : m.kind === self.kind); })
			.slice().sort(function (a, b) { return self.order === 'old' ? (a.year || 9999) - (b.year || 9999) : (b.year || 0) - (a.year || 0); });
		var host = function (u) { try { return new URL(u).hostname.replace(/^www\./, ''); } catch (err) { return ''; } };
		var lastYear = null;
		document.querySelector('.tk-list').innerHTML = list.map(function (m) {
			var id = self.yt(m.url), head = '';
			if (m.year !== lastYear) { head = '<h2 class="tk-year">' + e(m.year ? App.num(m.year) : L('بلا تاريخ', 'Undated')) + '</h2>'; lastYear = m.year; }
			return head + '<article class="tk-item' + (id ? ' is-video' : '') + '">' +
				(id ? '<button type="button" class="tk-play" data-yt="' + e(id) + '" aria-label="' + e(L('شاهد: ', 'Watch: ') + t(m.title)) + '" style="background-image:url(&quot;https://i.ytimg.com/vi/' + e(id) + '/mqdefault.jpg&quot;)"><span>▶</span></button>' : '') +
				'<div class="tk-body"><p class="tk-meta">' + e(t(kindName[m.kind] || { ar: m.kind, en: m.kind })) + ' · ' + e(t(m.outlet)) + (m.lang && m.lang !== 'ar' ? ' · ' + e(m.lang === 'en' ? 'English' : m.lang) : '') + '</p>' +
				'<h3>' + (id ? e(t(m.title)) : '<a href="' + e(m.url) + '" target="_blank" rel="noopener">' + e(t(m.title)) + ' ↗</a>') + '</h3>' +
				(m.note ? '<p class="tk-note">' + e(t(m.note)) + '</p>' : '') +
				(id ? '<a class="tk-out" href="' + e(m.url) + '" target="_blank" rel="noopener">YouTube ↗</a>' : '<span class="tk-out">' + e(host(m.url)) + '</span>') +
				'</div></article>';
		}).join('') || '<p class="tk-sum">' + e(L('لا شيء هنا.', 'Nothing here.')) + '</p>';
	}
};

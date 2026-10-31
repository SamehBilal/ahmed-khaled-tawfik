/* network.html — «شبكة العرّاب»: his characters as one web — the author at the centre, his series and novels around him, each
   work's characters around it (AKT.characters), and the ties between them (REL: love, family, friends, foes). Hover or tap a
   name to light its ties; the panel tells who they are and leads to their page. */
window.PAGE = {
	id: 'network',
	title: { ar: 'شبكة العرّاب', en: 'The Godfather’s web' },
	strings: {
		eyebrow: { ar: 'من يعرف من', en: 'Who knows whom' },
		title: { ar: 'شبكة العرّاب', en: 'The Godfather’s web' },
		lead: {
			ar: 'شخصياته كلها في شبكة واحدة: كل سلسلة ورواية حول كاتبها، وأبطالها حولها، وخيوط الحب والقرابة والصداقة والعداوة بينهم. اختر اسمًا لترى خيوطه.',
			en: 'All his characters in one web: each series and novel around their author, its people around it, and the threads of love, family, friendship and enmity between them. Pick a name to see its threads.'
		}
	},
	/* the ties between characters, as the books (and the character pages) tell them: [a, b, kind, label] */
	REL: [
		['refaat', 'maggie', 'love', { ar: 'حبه الكبير', en: 'the love of his life' }],
		['refaat', 'huwaida', 'love', { ar: 'خطيبته السابقة', en: 'his former fiancée' }],
		['refaat', 'raeefa', 'family', { ar: 'أخته', en: 'his sister' }],
		['refaat', 'adel', 'friend', { ar: 'صديق طفولته', en: 'his childhood friend' }],
		['refaat', 'lucifer', 'foe', { ar: 'خصمه الأكبر', en: 'his greatest foe' }],
		['refaat', 'salem-salma', 'friend', { ar: 'رفيقا رحلاته بين العوالم', en: 'his fellow travellers between worlds' }],
		['abeer', 'sherif', 'friend', { ar: 'صاحب جهاز الأحلام', en: 'the maker of the dream machine' }],
		['abeer', 'guide', 'friend', { ar: 'مرشدها في فانتازيا', en: 'her guide in Fantasia' }],
		['alaa', 'bernadette', 'love', { ar: 'زوجته', en: 'his wife' }],
		['alaa', 'shelby', 'friend', { ar: 'أستاذه في الأمراض المعدية', en: 'his teacher in infectious disease' }],
		['alaa', 'bartelier', 'friend', { ar: 'رئيس وحدة سافاري', en: 'the head of the Safari unit' }],
		['alaa', 'boudrja', 'friend', { ar: 'مساعده ومترجمه', en: 'his aide and interpreter' }],
		['alaa', 'bassam', 'friend', { ar: 'صديقه المقرب', en: 'his close friend' }],
		['alaa-utopia', 'germinal', 'friend', { ar: 'صديقته', en: 'his girlfriend' }],
		['gaber', 'alaa-utopia', 'foe', { ar: 'يأويه وهو صيده', en: 'shelters the one hunting him' }],
		['gaber', 'safiya', 'family', { ar: 'أخته', en: 'his sister' }],
		['essam', 'afaf', 'friend', { ar: 'يطارد لغز كلمتها الأخيرة', en: 'chases the riddle of her last word' }]
	],
	KIND: { love: '#e0633a', family: '#d9a45a', friend: '#6fb8a8', foe: '#c94a4a', work: 'rgba(239,230,210,.18)' },

	/* the band: points of light joined by threads that come and go */
	band: function () {
		var out = '<svg class="nw-band" viewBox="0 0 100 40" preserveAspectRatio="none">', pts = [];
		for (var i = 0; i < 22; i++) pts.push([(i * 37) % 100, 4 + (i * 23) % 32]);
		pts.forEach(function (p, i) { var q = pts[(i * 7 + 3) % pts.length]; out += '<line x1="' + p[0] + '" y1="' + p[1] + '" x2="' + q[0] + '" y2="' + q[1] + '" style="--d:' + (-i * 0.6).toFixed(1) + 's"/>'; });
		pts.forEach(function (p) { out += '<circle cx="' + p[0] + '" cy="' + p[1] + '" r=".6"/>'; });
		return out + '</svg>';
	},

	/* the works the characters belong to, in the order they came */
	works: function () {
		var App = window.App, d = App.data(), S = window.WorksShared, seen = {}, out = [];
		(d.characters || []).forEach(function (c) {
			if (seen[c.work]) return;
			seen[c.work] = 1;
			var s = S.anySeries(c.work), w = App.findWork ? App.findWork(c.work) : null;
			out.push({ id: c.work, title: s ? s.s.title : w ? w.title : { ar: c.work, en: c.work }, color: s ? s.s.color : (w && w.color) || '#7a4e1d', href: s ? S.seriesHref(c.work) : S.bookHref(c.work) });
		});
		return out;
	},

	render: function () {
		var App = window.App, d = App.data(), e = App.esc, t = App.t, L = App.L, self = this;
		var W = this.works(), chars = d.characters || [], C = 500, R1 = 230, R2 = 420, pos = {};
		/* the works on an inner ring, each given a slice as wide as its cast; its characters fanned through the slice on
		   three staggered rings, so a crowded series still has room for every name */
		var share = W.map(function (w) { return Math.max(1.6, chars.filter(function (c) { return c.work === w.id; }).length); });
		var total = share.reduce(function (s, x) { return s + x; }, 0), at = -Math.PI / 2 - share[0] / total * Math.PI;
		W.forEach(function (w, i) {
			var slice = 2 * Math.PI * share[i] / total, a = at + slice / 2;
			at += slice;
			pos['w:' + w.id] = [C + R1 * Math.cos(a), C + R1 * Math.sin(a)];
			var mine = chars.filter(function (c) { return c.work === w.id; });
			mine.forEach(function (c, k) {
				var b = a + (mine.length > 1 ? (k / (mine.length - 1) - 0.5) * slice * 0.8 : 0), r = R2 - (k % 3) * 52;
				pos[c.id] = [C + r * Math.cos(b), C + r * Math.sin(b)];
			});
		});
		var line = function (p, q, cls, col, data) { return '<line class="' + cls + '" x1="' + p[0].toFixed(1) + '" y1="' + p[1].toFixed(1) + '" x2="' + q[0].toFixed(1) + '" y2="' + q[1].toFixed(1) + '" stroke="' + col + '"' + (data || '') + '/>'; };
		var svg = '<svg class="nw-map" viewBox="0 0 1000 1000" role="img" aria-label="' + e(L('شبكة شخصياته', 'The web of his characters')) + '">';
		W.forEach(function (w) { svg += line([C, C], pos['w:' + w.id], 'nw-l-work', self.KIND.work); });
		chars.forEach(function (c) { svg += line(pos['w:' + c.work], pos[c.id], 'nw-l-work', self.KIND.work, ' data-a="' + e(c.id) + '"'); });
		this.REL.forEach(function (r) { if (pos[r[0]] && pos[r[1]]) svg += line(pos[r[0]], pos[r[1]], 'nw-l-rel nw-' + r[2], self.KIND[r[2]], ' data-a="' + e(r[0]) + '" data-b="' + e(r[1]) + '"'); });
		svg += '<g class="nw-me"><circle cx="' + C + '" cy="' + C + '" r="62"/><text x="' + C + '" y="' + (C - 6) + '">' + e(L('أحمد خالد', 'Ahmed Khaled')) + '</text><text x="' + C + '" y="' + (C + 22) + '">' + e(L('توفيق', 'Tawfik')) + '</text></g>';
		W.forEach(function (w) {
			var p = pos['w:' + w.id];
			svg += '<a href="' + e(w.href) + '" class="nw-work"><circle cx="' + p[0].toFixed(1) + '" cy="' + p[1].toFixed(1) + '" r="44" fill="' + e(w.color) + '"/><text x="' + p[0].toFixed(1) + '" y="' + (p[1] + 6).toFixed(1) + '">' + e(t(w.title)) + '</text></a>';
		});
		chars.forEach(function (c) {
			var p = pos[c.id];
			svg += '<g class="nw-node" tabindex="0" data-id="' + e(c.id) + '"><circle cx="' + p[0].toFixed(1) + '" cy="' + p[1].toFixed(1) + '" r="9"/><text x="' + p[0].toFixed(1) + '" y="' + (p[1] - 16).toFixed(1) + '">' + e(t(c.name).replace(/^د\.\s*/, '').replace(/^المهندس\s+/, '')) + '</text></g>';
		});
		svg += '</svg>';
		document.getElementById('content').innerHTML = '<section class="section nw"><div class="wrap nw-wrap"><div class="nw-stage">' + svg + '</div>' +
			'<aside class="nw-panel" aria-live="polite"></aside></div>' +
			'<div class="wrap nw-legend">' + [['love', L('حب وزواج', 'Love')], ['family', L('قرابة', 'Family')], ['friend', L('صحبة', 'Friends and allies')], ['foe', L('عداوة وصراع', 'Foes')]].map(function (k) {
				return '<span><i style="background:' + self.KIND[k[0]] + '"></i>' + e(k[1]) + '</span>';
			}).join('') + '</div></section>';
		var stage = document.querySelector('.nw-stage'), panel = document.querySelector('.nw-panel');
		var show = function (id) {
			stage.classList.toggle('is-focus', !!id);
			stage.querySelectorAll('.nw-node').forEach(function (n) { n.classList.toggle('is-on', n.getAttribute('data-id') === id); });
			var linked = {};
			stage.querySelectorAll('.nw-l-rel').forEach(function (l) {
				var on = l.getAttribute('data-a') === id || l.getAttribute('data-b') === id;
				l.classList.toggle('is-on', on);
				if (on) { linked[l.getAttribute('data-a')] = 1; linked[l.getAttribute('data-b')] = 1; }
			});
			stage.querySelectorAll('.nw-node').forEach(function (n) { n.classList.toggle('is-linked', !!linked[n.getAttribute('data-id')]); });
			if (!id) { panel.innerHTML = '<p class="nw-hint">' + e(L('اختر اسمًا في الشبكة.', 'Pick a name in the web.')) + '</p>'; return; }
			var c = chars.filter(function (x) { return x.id === id; })[0], w = W.filter(function (x) { return x.id === c.work; })[0];
			var ties = self.REL.filter(function (r) { return r[0] === id || r[1] === id; }).map(function (r) {
				var o = chars.filter(function (x) { return x.id === (r[0] === id ? r[1] : r[0]); })[0];
				return '<li><i style="background:' + self.KIND[r[2]] + '"></i><b>' + e(t(o.name)) + '</b>' + (r[0] === id ? ' — ' + e(t(r[3])) : '') + '</li>';
			}).join('');
			panel.innerHTML = '<p class="nw-work-name"><a href="' + e(w.href) + '">' + e(t(w.title)) + '</a></p><h2>' + e(t(c.name)) + '</h2>' +
				(c.role ? '<p class="nw-role">' + e(t(c.role)) + '</p>' : '') + '<p>' + e(t(c.desc)) + '</p>' +
				(ties ? '<ul class="nw-ties">' + ties + '</ul>' : '') +
				'<a class="share-btn" href="character.html?id=' + e(c.id) + '">' + e(L('صفحة الشخصية ←', 'Character page →')) + '</a>';
		};
		stage.addEventListener('mouseover', function (ev) { var n = ev.target.closest('.nw-node'); if (n) show(n.getAttribute('data-id')); });
		stage.addEventListener('click', function (ev) { var n = ev.target.closest('.nw-node'); if (n) show(n.getAttribute('data-id')); });
		stage.addEventListener('focusin', function (ev) { var n = ev.target.closest('.nw-node'); if (n) show(n.getAttribute('data-id')); });
		show('refaat');
	}
};

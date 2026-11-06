/* «كلمة اليوم · بكلماته»: on «تقويم العرّاب» (calendar.html, #today-line), under «في مثل هذا اليوم» — from the home page, then the Works page.
   One of his quotes (AKT.quotes) or of the phrasebook's lines (AKT.glossary), in turn, the same for everyone on the same day
   (by the day of the year); each to its place on the quotes page, and «صورة» makes it a picture to post. */
(function () {
	'use strict';
	window.TodayLine = {
		mount: function (sec) {
			var App = window.App, d = App.data(), e = App.esc, t = App.t, L = App.L;
			if (!sec) return;
			var box = sec.querySelector('.today');
			sec.querySelector('.eyebrow').textContent = L('كلمة اليوم', 'Today’s line');
			sec.querySelector('h2').textContent = L('بكلماته', 'In his words');
			var all = [];
			(d.quotes || []).forEach(function (q, i) { if (t(q.text) && t(q.text).length < 260) all.push({ text: t(q.text), from: t(q.from) || t((App.findWork(q.work) || {}).title), href: 'quotes.html#q-' + i, q: q }); });
			var g = (d.glossary || []).map(function (x, i) { return { text: L(x.phrase, x.en), from: t(x.meaning), href: 'quotes.html#g-' + i, phrase: x }; });
			/* quotes and phrases interleaved, so the days take them in turn */
			var mix = [];
			for (var i = 0; i < Math.max(all.length, g.length); i++) { if (all[i]) mix.push(all[i]); if (g[i]) mix.push(g[i]); }
			if (!mix.length) { sec.hidden = true; return; }
			var now = new Date(), day = Math.floor((Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()) - Date.UTC(now.getFullYear(), 0, 0)) / 864e5);
			var x = mix[(day + now.getFullYear() * 7) % mix.length];
			box.className = 'today rise' + (x.phrase ? ' is-phrase' : '');
			box.innerHTML = '<span class="today-kind">' + e(x.phrase ? L('من «قاموس العرّاب»', 'From the phrasebook') : L('اقتباس', 'Quote')) + '</span>' +
				'<blockquote>' + e(x.text) + '</blockquote>' +
				'<figcaption>' + (x.from ? '<span>' + e(x.phrase ? x.from : '— ' + x.from) + '</span>' : '') +
				'<a href="' + e(x.href) + '">' + e(x.phrase ? L('في القاموس ←', 'In the phrasebook →') : L('في الاقتباسات ←', 'Among the quotes →')) + '</a>' +
				'<button type="button" class="today-pic">' + e(L('صورة', 'Image')) + '</button></figcaption>';
			sec.hidden = false;
			/* «صورة»: the line as a picture to post — quote-image.js (and, for a phrase, glossary.js, which says whose it is), fetched only now */
			box.querySelector('.today-pic').onclick = function () {
				var need = (window.QuoteImage ? [] : ['quote-image.js']).concat(x.phrase && !window.GlossarySection ? ['glossary.js'] : []);
				var go = function () {
					if (x.phrase) window.GlossarySection.picture(x.phrase);
					else window.QuoteImage.open(x.q, { cite: x.from });
				};
				(function next() {
					if (!need.length) return go();
					var s = document.createElement('script');
					s.src = 'assets/js/' + need.shift();
					s.onload = next;
					document.head.appendChild(s);
				})();
			};
		}
	};
})();

/* studies.html — «دراسات ورسائل عنه»: what has been written about him in universities and peer-reviewed journals — doctoral and
   master's theses, then journal articles (AKT.studies, data-tributes.js), each with where and when, its link, and the book it
   reads; by country. (Once the last part of «قالوا عنه», tributes.html#studies, which now leads here.) The band: the theses
   bound in cloth on a shelf, their years in gold on the spines, and the journals stacked beside them; each leads to its entry. */
window.PAGE = {
	id: 'studies',
	title: { ar: 'دراسات ورسائل عنه', en: 'Studies and theses about him' },
	strings: {
		eyebrow: { ar: 'في الجامعات والمجلات', en: 'In universities and journals' },
		title: { ar: 'دراسات ورسائل عنه', en: 'Studies and theses about him' },
		lead: {
			ar: 'رسائل ماجستير ودكتوراه وأبحاث محكّمة عن أحمد خالد توفيق وكتبه، أكثرها عن «يوتوبيا». كل عنوان يفتح سجلّه في الجامعة أو المجلة.',
			en: 'Master’s and doctoral theses and peer-reviewed articles on Ahmed Khaled Tawfik and his books, most of them on Utopia. Each title opens its record at the university or the journal.'
		}
	},
	COUNTRY: { Egypt: 'مصر', Algeria: 'الجزائر', 'Saudi Arabia': 'السعودية', Jordan: 'الأردن', Ukraine: 'أوكرانيا', USA: 'الولايات المتحدة', Iraq: 'العراق', Iran: 'إيران', Turkey: 'تركيا', Brazil: 'البرازيل' },
	CLOTH: ['#5b1e1e', '#1f3b2e', '#1e2a4a', '#4a2a14', '#3b1f3f', '#2a3a3f', '#5a3a1a', '#26304a', '#46201c'],
	land: 'all',

	isThesis: function (x) { return x.kind === 'phd' || x.kind === 'ma'; },
	/* the order they are listed in, and the ids their entries take (#s-<n>) */
	sorted: function (d) {
		var self = this, byYear = function (a, b) { return (b.year || 0) - (a.year || 0); };
		var list = (d.studies || []).slice();
		return list.filter(self.isThesis).sort(byYear).concat(list.filter(function (x) { return !self.isThesis(x); }).sort(byYear));
	},

	band: function (d, A) {
		var self = window.PAGE, e = A.esc, L = A.L, all = self.sorted(d);
		var theses = all.filter(self.isThesis), papers = all.filter(function (x) { return !self.isThesis(x); });
		var vols = theses.map(function (x, i) {
			var n = all.indexOf(x);
			return '<a class="st-vol' + (x.kind === 'phd' ? ' is-phd' : '') + '" href="#s-' + n + '" style="--c:' + self.CLOTH[i % self.CLOTH.length] + ';--h:' + (x.kind === 'phd' ? 196 : 150 + (i * 23) % 34) + 'px" title="' + e(x.title) + '">' +
				'<i class="st-band" aria-hidden="true"></i><span class="st-vt" dir="auto">' + e(x.title) + '</span>' +
				'<b>' + e(x.year ? A.num(x.year) : (x.kind === 'phd' ? L('دكتوراه', 'PhD') : L('ماجستير', 'MA'))) + '</b></a>';
		}).join('');
		var stack = papers.slice(0, 14).map(function (x, i) {
			return '<a class="st-jr" href="#s-' + all.indexOf(x) + '" style="--c:' + self.CLOTH[(i + 3) % self.CLOTH.length] + ';--x:' + (((i * 37) % 11) - 5) + 'px;--w:' + (150 + (i * 29) % 40) + 'px" title="' + e(x.title) + '"></a>';
		}).join('');
		return '<div class="st-room"><div class="st-shelf"><div class="st-vols">' + vols + '</div>' +
			'<div class="st-stack"><span class="st-count"><b>' + e(A.num(papers.length)) + '</b>' + e(L('بحثًا محكّمًا', 'journal articles')) + '</span>' + stack + '</div></div>' +
			'<i class="st-board" aria-hidden="true"></i></div>';
	},

	render: function () {
		var App = window.App, d = App.data(), e = App.esc, L = App.L, self = this, all = this.sorted(d);
		var where = function (c) { return App.lang === 'en' ? c : (self.COUNTRY[c] || c); };
		var lands = {}; all.forEach(function (x) { lands[x.country] = (lands[x.country] || 0) + 1; });
		var order = Object.keys(lands).sort(function (a, b) { return lands[b] - lands[a]; });
		var chip = function (k, label, n) { return '<button type="button" class="chip" data-land="' + e(k) + '" aria-pressed="' + (self.land === k) + '">' + e(label) + ' <b>' + e(App.num(n)) + '</b></button>'; };
		document.getElementById('content').innerHTML = '<section class="section tb-st" id="studies"><div class="wrap">' +
			'<div class="chips st-bar">' + chip('all', L('كل البلدان', 'All countries'), all.length) + order.map(function (c) { return chip(c, where(c), lands[c]); }).join('') + '</div>' +
			'<div class="st-body"></div>' +
			'<p class="tb-st-lead">' + e(L('تعرف رسالة أو بحثًا عنه لم يُذكر هنا؟', 'Know a thesis or a study about him that is not here?')) + ' <a href="' + e(App.fixHref(L('دراسات ورسائل عنه', 'Studies and theses about him'))) + '" target="_blank" rel="noopener">' + e(L('أخبرنا ↗', 'Tell us ↗')) + '</a>' +
				e(L(' وما قاله الكتّاب والفنانون عنه، والكتب التي كُتبت عنه، في ', ' And what writers and artists said of him, and the books written about him, are in ')) + '<a href="tributes.html">' + e(L('«قالوا عنه»', 'Tributes')) + '</a>.</p>' +
			'</div></section>';
		document.querySelector('.st-bar').onclick = function (ev) {
			var b = ev.target.closest('[data-land]');
			if (!b) return;
			self.land = b.getAttribute('data-land');
			document.querySelectorAll('.st-bar [data-land]').forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
			self.list();
		};
		this.list();
		/* a volume or a journal on the shelf above goes to its entry, whatever country is chosen */
		if (!this.wired) {
			this.wired = true;
			document.addEventListener('click', function (ev) {
				var a = ev.target.closest('.st-vol, .st-jr');
				if (!a) return;
				ev.preventDefault();
				var id = a.getAttribute('href').slice(1);
				if (!document.getElementById(id)) { var allB = document.querySelector('.st-bar [data-land="all"]'); if (allB) allB.click(); }
				var li = document.getElementById(id);
				if (li) { li.scrollIntoView({ behavior: 'smooth', block: 'center' }); li.classList.remove('is-target'); void li.offsetWidth; li.classList.add('is-target'); history.replaceState(null, '', '#' + id); }
			});
		}
		App.focusHash();
	},

	list: function () {
		var App = window.App, d = App.data(), e = App.esc, t = App.t, L = App.L, self = this, all = this.sorted(d);
		var KIND = { phd: L('دكتوراه', 'PhD'), ma: L('ماجستير', 'Master’s'), article: L('بحث محكّم', 'Journal article'), paper: L('ورقة مؤتمر', 'Conference paper'), chapter: L('فصل في كتاب', 'Book chapter') };
		var where = function (c) { return App.lang === 'en' ? c : (self.COUNTRY[c] || c); };
		var shown = all.filter(function (x) { return self.land === 'all' || x.country === self.land; });
		var row = function (x) {
			var w = (d.works || []).filter(function (b) { return b.id === x.about; })[0], ser = !w && x.about ? (d.series || []).filter(function (s) { return s.id === x.about; })[0] : null;
			var rtl = /[؀-ۿ]/.test(x.title);
			return '<li id="s-' + all.indexOf(x) + '"><p class="tb-st-k">' + e(KIND[x.kind] || x.kind) + ' · ' + e(where(x.country)) + (x.year ? ' · ' + e(App.num(x.year)) : '') + '</p>' +
				'<a class="tb-st-t" href="' + e(x.url) + '" target="_blank" rel="noopener" dir="' + (rtl ? 'rtl' : 'ltr') + '">' + e(x.title) + ' ↗</a>' +
				(App.lang === 'en' && x.titleEn ? '<p class="tb-st-en" dir="ltr">' + e(x.titleEn) + '</p>' : '') +
				'<p class="tb-st-by">' + (x.author ? e(x.author) + ' — ' : '') + e(t(x.where)) + '</p>' +
				(w || ser ? '<p class="tb-st-on">' + e(L('عن ', 'On ')) + '<a href="' + e(w ? App.workHref(w.id) : 'series.html?id=' + ser.id) + '">' + e(t((w || ser).title)) + '</a></p>' : '') + '</li>';
		};
		var theses = shown.filter(this.isThesis), papers = shown.filter(function (x) { return !self.isThesis(x); });
		var col = function (h, items) { return items.length ? '<div><h2>' + e(h) + ' <small>' + e(App.num(items.length)) + '</small></h2><ul class="tb-st-list">' + items.map(row).join('') + '</ul></div>' : ''; };
		document.querySelector('.st-body').innerHTML = '<div class="tb-st-cols' + (theses.length && papers.length ? '' : ' is-one') + '">' +
			col(L('رسائل جامعية', 'Theses'), theses) + col(L('أبحاث في المجلات', 'Journal articles'), papers) + '</div>';
	}
};

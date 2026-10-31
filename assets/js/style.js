/* style.html — «اللغة والأسلوب»: his writing in numbers (assets/data/style.json, tools/build-style.js): the words he used most in
   the articles the archive holds, his columns year by year with his sentences and his famous «..», the titles of his series,
   and the kinds of writing beside the column. */
window.PAGE = {
	id: 'style',
	title: { ar: 'اللغة والأسلوب', en: 'Language & style' },
	strings: {
		eyebrow: { ar: 'كيف كان يكتب', en: 'How he wrote' },
		title: { ar: 'اللغة والأسلوب', en: 'Language & style' },
		lead: {
			ar: 'أسلوبه بالأرقام: الكلمات التي تكررت في مقالاته، وطول جمله ونقاطه المتتالية «..» عامًا بعد عام، وعناوين سلاسله، وما كتبه غير المقال.',
			en: 'His style in numbers: the words that recur in his columns, the length of his sentences and his trailing “..” year by year, the titles of his series, and what else he wrote besides the column.'
		}
	},

	/* the band: his trailing dots, typed and erased */
	band: function (d, A) {
		var lines = [A.L('ثم حدث ما حدث..', 'Then it happened..'), A.L('لكن هذه قصة أخرى..', 'But that is another story..'), A.L('ولا أعرف لماذا..', 'And I do not know why..')];
		return '<div class="st-type">' + lines.map(function (l, i) { return '<p style="--d:' + (i * 3) + 's"><span>' + A.esc(l) + '</span></p>'; }).join('') + '</div>';
	},

	render: function () {
		var App = window.App, e = App.esc, L = App.L, self = this;
		document.getElementById('content').innerHTML = '<section class="section st"><div class="wrap"><p class="st-note">…</p></div></section>';
		fetch('assets/data/style.json').then(function (r) { return r.json(); }).then(function (s) { self.draw(s); }).catch(function () {
			document.querySelector('.st .wrap').innerHTML = '<p class="st-note">' + e(L('تعذّر تحميل الأرقام الآن.', 'The numbers could not be loaded just now.')) + '</p>';
		});
	},

	draw: function (s) {
		var App = window.App, S = window.WorksShared, e = App.esc, t = App.t, L = App.L;
		var max = s.words[0][1], minW = s.words[s.words.length - 1][1];
		/* the cloud: bigger for more, in a steady shuffle so the biggest are not all in one corner */
		var cloud = s.words.map(function (w, i) { return [w, (i * 37) % s.words.length]; }).sort(function (a, b) { return a[1] - b[1]; }).map(function (x) {
			var w = x[0], f = (w[1] - minW) / (max - minW || 1);
			return '<span style="--f:' + f.toFixed(2) + '" title="' + e(App.num(w[1])) + '">' + e(w[0]) + '</span>';
		}).join(' ');
		var years = s.years.filter(function (y) { return y[1] >= 4; }), ymax = Math.max.apply(null, years.map(function (y) { return y[1]; }));
		var dmax = Math.max.apply(null, years.map(function (y) { return y[4]; })), smax = Math.max.apply(null, years.map(function (y) { return y[5]; }));
		var bars = function (val, mx, fmt) {
			return '<div class="st-bars">' + years.map(function (y) {
				return '<span title="' + e(App.num(y[0]) + ' · ' + fmt(y)) + '"><i style="height:' + (val(y) / mx * 100).toFixed(0) + '%"></i><b>' + e(fmt(y)) + '</b><small>' + e(App.num(String(y[0]).slice(2))) + '</small></span>';
			}).join('') + '</div>';
		};
		var mwt = s.series.filter(function (x) { return x.id === 'mwt'; })[0];
		var leg = mwt && mwt.first[0] && /اسطورة/.test(mwt.first[0][0]) ? mwt.first[0][1] : 0;
		var kmax = Math.max.apply(null, s.kinds.map(function (k) { return k[1]; }));
		var KIND = { 'قصة قصيرة': 'Short stories', 'كوميكس': 'Comics', 'مسلسلات إذاعية': 'Radio serials', 'أشعار': 'Poems', 'قرأت مؤخرا': 'Recent reads', 'هلاوس': 'Hallucinations', 'مقالات': 'Columns' };
		document.querySelector('.st .wrap').innerHTML =
			'<section class="st-sec"><h2>' + e(L('الكلمات الأكثر تكرارًا', 'The words he used most')) + '</h2>' +
				'<p class="st-lead">' + e(L('من عناوين ' + App.num(s.posts) + ' مقالًا ومقتطفاتها في أرشيف المدونة حتى 2018، بلا حروف الجر والضمائر. «عندما» أولها: كاتب يبدأ بحكاية.', 'From the titles and excerpts of ' + s.posts + ' articles in the blog archive up to 2018, leaving out particles and pronouns. “When” comes first: a writer who begins with a story.')) + '</p>' +
				'<div class="st-cloud" dir="rtl">' + cloud + '</div></section>' +
			'<section class="st-sec"><h2>' + e(L('مقالاته عامًا بعد عام', 'His columns, year by year')) + '</h2>' +
				'<p class="st-lead">' + e(L('عدد ما يحفظه الأرشيف من مقالاته كل عام.', 'How many of his columns the archive holds for each year.')) + '</p>' +
				bars(function (y) { return y[1]; }, ymax, function (y) { return App.num(y[1]); }) + '</section>' +
			'<section class="st-sec"><h2>' + e(L('النقاط المتتالية «..»', 'The trailing “..”')) + '</h2>' +
				'<p class="st-lead">' + e(L('علامته الأشهر: كم مرة يترك الجملة معلّقة بنقطتين أو أكثر في كل ألف حرف.', 'His best-known mark: how often he leaves a sentence hanging on two dots or more, per thousand characters.')) + '</p>' +
				bars(function (y) { return y[4]; }, dmax, function (y) { return App.num(y[4]); }) + '</section>' +
			'<section class="st-sec"><h2>' + e(L('طول الجملة', 'Sentence length')) + '</h2>' +
				'<p class="st-lead">' + e(L('متوسط عدد الكلمات في الجملة: جمل قصيرة تمضي بسرعة، كما في حكي المقاهي.', 'The average words in a sentence: short sentences that move fast, like café talk.')) + '</p>' +
				bars(function (y) { return y[5]; }, smax, function (y) { return App.num(y[5]); }) + '</section>' +
			'<section class="st-sec"><h2>' + e(L('عناوين سلاسله', 'His series’ titles')) + '</h2><div class="st-titles">' + s.series.map(function (x) {
				var ser = S.anySeries(x.id);
				return '<article style="--c:' + e((ser && ser.s.color) || '#7a4e1d') + '"><h3><a href="' + e(S.seriesHref(x.id)) + '">' + e(ser ? t(ser.s.title) : x.id) + '</a></h3>' +
					'<b>' + e(App.num(x.avg)) + '</b><span>' + e(L('كلمات في العنوان في المتوسط', 'words a title on average')) + '</span>' +
					(x.id === 'mwt' && leg ? '<p>' + e(L(App.num(leg) + ' من ' + App.num(x.n) + ' عنوانًا تبدأ بكلمة «أسطورة».', leg + ' of ' + x.n + ' titles begin with “The Legend”.')) + '</p>' : '') + '</article>';
			}).join('') + '</div></section>' +
			'<section class="st-sec"><h2>' + e(L('غير المقال', 'Besides the column')) + '</h2>' +
				'<p class="st-lead">' + e(L('ما يصنّفه الأرشيف من كتابته: قصص قصيرة وكوميكس ومسلسلات إذاعية وشعر.', 'What the archive files his writing under: short stories, comics, radio serials and poems.')) + '</p>' +
				'<ul class="st-kinds">' + s.kinds.map(function (k) {
					return '<li><span>' + e(L(k[0], KIND[k[0]] || k[0])) + '</span><i style="width:' + (k[1] / kmax * 100).toFixed(0) + '%"></i><b>' + e(App.num(k[1])) + '</b></li>';
				}).join('') + '</ul></section>' +
			'<p class="st-note">' + e(L('الأرقام من مقتطفات المقالات لا من نصوصها كاملة، فهي تقريبية؛ تُحسب من جديد كلما زاد الأرشيف.', 'The numbers come from the articles’ excerpts, not their full texts, so they are approximate; they are counted afresh as the archive grows.')) + ' <a href="blog.html">' + e(L('المدونة ←', 'The blog →')) + '</a></p>';
	}
};

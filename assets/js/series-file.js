/* What «عوالم فانتازيا» (worlds.js) and «عيادة سافاري» (clinic.js) share: a card per issue of a series — its cover, number and
   title, its kind, its line (from AKT.fantasiaWorlds / AKT.safariCases, data-pages.js), a note under some — filtered by kind,
   each card at #<series>-<n>. An issue whose line is not known yet says so and asks for it («ما ينقص الأرشيف», wanted.html).
   SeriesFile.render(page, { sid, list, field, note, kinds }) draws it into #content; page.kind keeps the filter. */
window.SeriesFile = {
	render: function (page, o) {
		var App = window.App, e = App.esc, L = App.L, list = o.list();
		var count = {}; list.forEach(function (x) { count[x.kind] = (count[x.kind] || 0) + 1; });
		document.getElementById('content').innerHTML = '<section class="section sf"><div class="wrap">' +
			'<div class="chips sf-bar"><button type="button" class="chip" data-k="all" aria-pressed="true">' + e(L('الكل', 'All')) + ' <b>' + e(App.num(list.length)) + '</b></button>' +
				o.kinds.filter(function (k) { return count[k[0]]; }).map(function (k) {
					return '<button type="button" class="chip" data-k="' + k[0] + '" aria-pressed="false">' + e(App.t(k[1])) + ' <b>' + e(App.num(count[k[0]])) + '</b></button>';
				}).join('') + '</div>' +
			'<div class="sf-grid"></div>' +
			'<p class="sf-note">' + e(App.t(o.note)) + ' <a href="wanted.html#' + e(o.sid) + '">' + e(L('ما ينقص منها ←', 'What is missing →')) + '</a></p>' +
		'</div></section>';
		page.kind = 'all';
		var self = this;
		document.querySelector('.sf-bar').onclick = function (ev) {
			var b = ev.target.closest('[data-k]');
			if (!b) return;
			page.kind = b.getAttribute('data-k');
			document.querySelectorAll('.sf-bar [data-k]').forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
			self.list(page, o);
		};
		this.list(page, o);
		/* a link to one issue (#fantasia-25) goes to its card */
		App.focusHash();
	},

	list: function (page, o) {
		var App = window.App, S = window.WorksShared, e = App.esc, t = App.t, L = App.L;
		var kindName = {}; o.kinds.forEach(function (k) { kindName[k[0]] = k[1]; });
		var issues = {}; S.seriesIssues(o.sid).forEach(function (is, i) { if (!issues[is.n]) issues[is.n] = [is, i]; });
		document.querySelector('.sf-grid').innerHTML = o.list().filter(function (x) { return page.kind === 'all' || x.kind === page.kind; }).map(function (x) {
			var hit = issues[x.n];
			if (!hit) return '';
			var is = hit[0], href = App.issueHref(o.sid, Object.assign({ _idx: hit[1] }, is)), line = x[o.field], img = S.issueCover(o.sid, is);
			return '<article class="sf-card sf-' + e(x.kind) + '" id="' + e(o.sid + '-' + x.n) + '">' +
				'<a class="sf-cover" href="' + e(href) + '">' + S.miniCover({ img: img, color: '#3a1414', title: t(is.title), num: App.num(is.n) }) + '</a>' +
				'<div class="sf-body"><p class="sf-kind">' + e(App.num(is.n)) + ' · ' + e(t(kindName[x.kind] || {})) + '</p>' +
					'<h3><a href="' + e(href) + '">' + e(t(is.title)) + '</a></h3>' +
					(line ? '<p class="sf-line">' + e(t(line)) + '</p>' + (x.from === 'title' ? '<p class="sf-from">' + e(L('من عنوانه وحده؛ غلافه الخلفي لا يقول.', 'From its title alone; its back cover does not say.')) + '</p>' : '')
						: '<p class="sf-line sf-none">' + e(L('غلافه الخلفي لا يقول، ولم نعرف بعد. قرأته؟', 'Its back cover does not say, and we do not know yet. Read it?')) +
							' <a href="' + e(App.fixHref(L('عدد ', 'Issue ') + t(is.title))) + '" target="_blank" rel="noopener">' + e(L('أخبرنا ↗', 'Tell us ↗')) + '</a></p>') +
					(x.fact ? '<p class="sf-fact"><b>' + e(L('طبيًّا: ', 'Medically: ')) + '</b>' + e(t(x.fact)) + '</p>' : '') +
				'</div></article>';
		}).join('');
	}
};

// «حالة الروابط»: asks every outside link the data cites (sources, stores, interviews, recordings, the papers) whether it is still
// there, and writes the ones that are gone to assets/data/links.json, which «ما ينقص الأرشيف» lists (wanted.js) so readers can
// send a copy from the Wayback Machine or a new home for it. A site that turns robots away (403, 429, a challenge page) is counted
// as "could not tell", not as dead; a link is dead when the page is not found (404, 410), or its host is gone (a slow one only could not tell).
// It reaches the internet, so it is not part of the build: .github/workflows/links.yml runs it on the 1st of every month (and opens an
// issue for the links that died since), or run it from the repo root:  node tools/check-links.js
const fs = require('fs'), path = require('path');
const load = require('./load-data.js'), root = load.root;
const { d } = load(['data-built', 'data-detail', 'data-pages', 'books', 'shared', 'app']);

/* where each link is cited, as the page that shows it */
const PAGE = { legacy: 'legacy.html', tributes: 'tributes.html', media: 'interviews.html', tanta: 'talks.html#tanta', writers: 'writers.html', quotes: 'quotes.html',
	glossary: 'glossary.html', library: 'library.html', handwriting: 'reader-stories.html#hand', awards: 'awards.html', creatures: 'creatures.html',
	refaatLife: 'refaat-life.html', publishers: 'publishers.html', audio: 'audio.html', adaptations: 'screen.html', sources: 'sources.html',
	issuesSources: 'sources.html', issues: 'works.html' };
const where = (p, item) => {
	const top = p[0];
	if (top === 'bookInfo' || top === 'issueInfo' || top === 'abjjad') return 'book.html?id=' + encodeURIComponent(p[1]);
	if (top === 'seriesInfo' || top === 'seriesCovers' || top === 'seriesEndings') return 'series.html?id=' + encodeURIComponent(p[1]);
	if ((top === 'series' || top === 'otherSeries') && item && item.id) return 'series.html?id=' + encodeURIComponent(item.id);
	return PAGE[top] || '';
};
const urls = {};
const walk = (o, p, item) => {
	if (typeof o === 'string') {
		(o.match(/https?:\/\/[^\s"'<>»]+/g) || []).forEach(u => {
			/* a closing bracket is the link's own when it has its opening one, as Wikipedia's «(سلسلة)» */
			u = u.replace(/[.,;:]+$/, '');
			while (/\)$/.test(u) && (u.match(/\(/g) || []).length < (u.match(/\)/g) || []).length) u = u.slice(0, -1).replace(/[.,;:]+$/, '');
			const w = where(p, item);
			(urls[u] = urls[u] || new Set());
			if (w) urls[u].add(w);
		});
		return;
	}
	if (o && typeof o === 'object') for (const k in o) walk(o[k], p.concat(k), p.length === 1 && o[k] && o[k].id ? o[k] : item);
};
for (const k in d) walk(d[k], [k], null);

/* (a bare folder another link is built on, as a store's «/show/» that the data adds each title to, is not a link of its own) */
const list = Object.keys(urls).filter((u, i, all) => !(/\/$/.test(u) && all.some(v => v !== u && v.indexOf(u) === 0)));
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36';
const ask = async (u, method) => {
	const c = new AbortController(), timer = setTimeout(() => c.abort(), 20000);
	try {
		const r = await fetch(u, { method, redirect: 'follow', signal: c.signal, headers: { 'user-agent': UA, 'accept-language': 'ar,en;q=0.8', accept: 'text/html,*/*' } });
		if (method === 'GET') r.body && r.body.cancel().catch(() => {});
		return { s: r.status };
	} catch (e) {
		const code = (e.cause && e.cause.code) || e.name;
		return { s: 0, e: code };
	} finally { clearTimeout(timer); }
};
const check = async (u) => {
	let r = await ask(u, 'HEAD');
	if (r.s === 0 || r.s === 405 || r.s === 403 || r.s === 404 || r.s >= 500) r = await ask(u, 'GET');
	if (r.s === 0 && r.e === 'AbortError') r = await ask(u, 'GET');
	return r;
};
const kind = (r) => {
	if (r.s >= 200 && r.s < 400) return 'ok';
	if (r.s === 404 || r.s === 410) return 'dead';
	/* a host that is gone; a slow one (a timeout) may only be turning robots away, so it is not counted dead */
	if (r.s === 0 && /ENOTFOUND|ECONNREFUSED|CERT/.test(r.e || '')) return 'dead';
	return 'unknown';
};

(async () => {
	/* a few at a time, and one at a time on each site, so no site is hammered */
	const byHost = {};
	list.forEach(u => { const h = u.split('/')[2]; (byHost[h] = byHost[h] || []).push(u); });
	const out = {}, hosts = Object.keys(byHost);
	let done = 0;
	const worker = async () => {
		for (let h; (h = hosts.shift());) {
			for (const u of byHost[h]) {
				out[u] = await check(u);
				if (++done % 100 === 0) console.log(done + ' / ' + list.length);
			}
		}
	};
	await Promise.all(Array.from({ length: 8 }, worker));
	/* each link that seemed dead is asked once more, slowly, so a busy moment (a name lookup that failed) does not count */
	for (const u of list.filter(u => kind(out[u]) === 'dead')) { await new Promise(r => setTimeout(r, 400)); out[u] = await check(u); }
	/* a host «not found» here is asked of a public name server too: only one that does not exist there is dead */
	const gone = {};
	for (const u of list.filter(u => out[u].e === 'ENOTFOUND')) {
		const h = u.split('/')[2];
		if (!(h in gone)) {
			try { gone[h] = (await (await fetch('https://cloudflare-dns.com/dns-query?type=A&name=' + h, { headers: { accept: 'application/dns-json' } })).json()).Status === 3; }
			catch (e) { gone[h] = false; }
		}
		if (!gone[h]) out[u] = { s: 0, e: 'DNS' };
	}
	const dead = list.filter(u => kind(out[u]) === 'dead').sort().map(u => ({ u, s: out[u].s || out[u].e, w: [...urls[u]] }));
	const res = { checked: new Date().toISOString().slice(0, 10), total: list.length,
		ok: list.filter(u => kind(out[u]) === 'ok').length, unknown: list.filter(u => kind(out[u]) === 'unknown').length, dead };
	const file = path.join(root, 'assets/data/links.json');
	let before = [];
	try { before = JSON.parse(fs.readFileSync(file, 'utf8')).dead.map(x => x.u); } catch (e) {}
	fs.writeFileSync(file, JSON.stringify(res));
	console.log('links.json', res.total, 'links:', res.ok, 'fine,', res.unknown, 'could not tell,', dead.length, 'dead');
	/* with --report=FILE (the monthly check, .github/workflows/links.yml): the links that died since the last check, as an issue's text */
	const report = (process.argv.find(a => a.indexOf('--report=') === 0) || '').slice(9);
	if (report) {
		const fresh = dead.filter(x => before.indexOf(x.u) < 0);
		fs.writeFileSync(report, fresh.length ? 'The monthly link check (' + res.checked + ') found ' + fresh.length + ' outside link' + (fresh.length > 1 ? 's' : '') + ' that no longer answer' + (fresh.length > 1 ? '' : 's') +
			'. Each is listed on «ما ينقص الأرشيف» (wanted.html#links) until it is mended: point it to the page’s new home, or to a copy on the Wayback Machine, in the data.\n\n' +
			'| Link | Answer | Cited on | Wayback Machine |\n|---|---|---|---|\n' +
			fresh.map(x => '| ' + x.u + ' | ' + x.s + ' | ' + (x.w.join(', ') || '—') + ' | [copies](https://web.archive.org/web/*/' + x.u + ') |').join('\n') +
			'\n\nIn all: ' + res.total + ' links, ' + res.ok + ' fine, ' + res.unknown + ' could not tell, ' + dead.length + ' dead.\n' : '');
		console.log(fresh.length, 'newly dead');
	}
})();

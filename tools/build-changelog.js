// «سجل التحديثات» (changelog.html): the site's history from git — each change's date and its first line, newest first, with what it
// touched sorted into kinds (a new page, pictures, data, design, a fix) — written to assets/data/changelog.json. Each change's
// Arabic line comes from an «ar: …» line in the commit's body, or else from tools/changelog-ar.json (keyed by the short hash).
// A change that puts a fact right («سجل التصحيحات») says so in a «correction: …» line (with «correction-en: …» and «by: …»),
// or is listed in tools/corrections.json. The newest change's hash is written into app.js (App.LATEST), so every page can tell
// a returning reader there is something new since they last looked («ما الجديد منذ زيارتك»).
// Run by tools/build-sw.js; on its own:  node tools/build-changelog.js
const fs = require('fs'), path = require('path'), cp = require('child_process');
const root = path.resolve(__dirname, '..');
let log = '';
try { log = cp.execSync('git log --no-merges --format=%h%x1f%ad%x1f%s%x1f%b%x1e --date=short', { cwd: root, encoding: 'utf8', maxBuffer: 64 << 20 }); }
catch (e) { console.log('changelog: no git history here, kept as it was'); }
if (log) {
	/* a change's kinds, from the words of its message */
	const KINDS = [
		['page', /\bnew page\b|\bpage of its own\b|\.html\)|«[^»]+» \(\w+\.html/i],
		['pics', /\bphoto|\bpicture|\bcover|\bportrait|\bposter|\bimage|\bart\b|\bthumbnail/i],
		['audio', /\baudio|\bepisode|\bstorytel|\baudiohat|\biqraaly|\bstoriapod|\bvideo|\byoutube|\bcassette/i],
		['data', /\bissue|\bbook|\bedition|\barticle|\binterview|\bquote|\btribute|\bsource|\bwriter|\bpublisher|\baward/i],
		['design', /\bband\b|\bfooter|\bheader|\bmenu|\blayout|\bcss\b|\bstyle|\btheme|\bdesign|\banimation|\b3d\b/i],
		['fix', /\bfix|\bbroken|\bwrong|\bcorrect|\bno longer|\binstead\b/i]
	];
	let AR = {};
	try { AR = JSON.parse(fs.readFileSync(path.join(__dirname, 'changelog-ar.json'), 'utf8')); } catch (e) {}
	let FIX = {};
	try { FIX = JSON.parse(fs.readFileSync(path.join(__dirname, 'corrections.json'), 'utf8')); } catch (e) {}
	const line = (body, k) => { const m = new RegExp('^' + k + ':\\s*(.+)$', 'im').exec(body || ''); return m ? m[1].trim() : ''; };
	const out = log.split('\x1e').map(l => l.trim()).filter(Boolean).map(l => {
		const [h, d, msg, body] = l.split('\x1f').map(x => (x || '').trim()), ar = /^ar:\s*(.+)$/im.exec(body || '');
		const x = { h: h, d: d, s: msg, k: KINDS.filter(k => k[1].test(msg)).map(k => k[0]) }, a = ar ? ar[1].trim() : AR[h.slice(0, 7)];
		if (a) x.a = a;
		/* a fact put right: what it says now, in both languages, and who sent it */
		const c = FIX[h.slice(0, 7)] || (line(body, 'correction') ? { ar: line(body, 'correction'), en: line(body, 'correction-en'), by: line(body, 'by') } : null);
		if (c) { x.c = { ar: c.ar, en: c.en || msg }; if (c.by) x.c.by = c.by; }
		return x;
	}).filter(x => x.s);
	fs.mkdirSync(path.join(root, 'assets/data'), { recursive: true });
	fs.writeFileSync(path.join(root, 'assets/data/changelog.json'), JSON.stringify(out));
	console.log('changelog.json', out.length, 'changes,', out.filter(x => x.a).length, 'in Arabic,', out.filter(x => x.c).length, 'corrections');
	/* the newest change, for the footer's «new since your visit» dot */
	const appPath = path.join(root, 'assets/js/app.js'), app = fs.readFileSync(appPath, 'utf8');
	const stamped = app.replace(/LATEST: '[^']*'/, "LATEST: '" + (out[0] ? out[0].h : '') + "'");
	if (stamped !== app) fs.writeFileSync(appPath, stamped);
}

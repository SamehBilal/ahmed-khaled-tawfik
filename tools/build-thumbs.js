// Writes assets/img/covers-s/: a WebP copy at most 320 px wide of every cover in assets/img/covers/, at the same path
// (its extension .webp), for the grids, which show a cover at 100–200 px (App.thumb gives a cover's copy). A copy is made
// again when its cover changes, and removed when its cover is gone. The book pages still show the cover itself.
// Needs Python with Pillow (tools/thumbs.py); without it the copies are left as they are.
// Run from the repo root:  node tools/build-thumbs.js  (tools/build-sw.js runs it too)
const fs = require('fs'), path = require('path'), cp = require('child_process');
const root = path.resolve(__dirname, '..'), FROM = path.join(root, 'assets/img/covers'), TO = path.join(root, 'assets/img/covers-s');
const PY = ['py', 'python3', 'python'].find(c => { try { return cp.spawnSync(c, (c === 'py' ? ['-3'] : []).concat(['-c', 'import PIL']), { stdio: 'ignore' }).status === 0; } catch (e) { return false; } });
const want = new Set(), todo = [];
(function walk(dir) {
	fs.readdirSync(dir, { withFileTypes: true }).forEach(d => {
		const p = path.join(dir, d.name);
		if (d.isDirectory()) return walk(p);
		if (!/\.(webp|jpe?g|png)$/i.test(d.name)) return;
		const out = path.join(TO, path.relative(FROM, p)).replace(/\.(webp|jpe?g|png)$/i, '.webp');
		want.add(out);
		if (!fs.existsSync(out) || fs.statSync(out).mtimeMs < fs.statSync(p).mtimeMs) todo.push([p, out]);
	});
})(FROM);
if (todo.length && PY) {
	const r = cp.spawnSync(PY, (PY === 'py' ? ['-3'] : []).concat([path.join(__dirname, 'thumbs.py')]), { input: JSON.stringify(todo), encoding: 'utf8', env: Object.assign({}, process.env, { PYTHONIOENCODING: 'utf-8' }) });
	console.log('cover copies:', (r.stdout || '').trim(), 'made' + (r.stderr ? ' — ' + r.stderr.trim() : ''));
} else if (todo.length) console.warn('cover copies: ' + todo.length + ' to make, but no Python with Pillow');
let gone = 0;
(function walk(dir) {
	if (!fs.existsSync(dir)) return;
	fs.readdirSync(dir, { withFileTypes: true }).forEach(d => {
		const p = path.join(dir, d.name);
		if (d.isDirectory()) { walk(p); if (!fs.readdirSync(p).length) fs.rmdirSync(p); }
		else if (!want.has(p)) { fs.unlinkSync(p); gone++; }
	});
})(TO);
console.log('covers-s/', want.size, 'copies,', todo.length, 'made,', gone, 'removed');

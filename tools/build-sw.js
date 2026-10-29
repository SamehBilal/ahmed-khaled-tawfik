// Rewrites PRECACHE and VERSION in sw.js: every page, script, stylesheet, font, icon and
// site image (not the covers, which are cached as they're seen or with "Save for offline").
// Run from the repo root after changing files:  node tools/build-sw.js
const fs = require('fs'), path = require('path'), crypto = require('crypto');
const root = path.resolve(__dirname, '..');

const list = ['./'];
const add = (rel) => list.push(rel.split(path.sep).join('/'));
fs.readdirSync(root).filter(f => /\.html$/.test(f) && f !== '404.html').sort().forEach(add);
add('manifest.webmanifest');
add('favicon.ico');
const walk = (dir, test) => fs.readdirSync(path.join(root, dir), { withFileTypes: true }).forEach(d => {
	const rel = path.join(dir, d.name);
	if (d.isDirectory()) walk(rel, test); else if (test(rel)) add(rel);
});
walk('assets/js', f => /\.js$/.test(f));
walk('assets/css', f => /\.css$/.test(f));
walk('assets/fonts', f => /\.(woff2?|ttf)$/.test(f));
walk('assets/img/icons', () => true);
walk('assets/img/cassette', f => /\.(png|jpe?g|webp)$/.test(f));
fs.readdirSync(path.join(root, 'assets/img')).filter(f => /\.(png|jpe?g|webp|svg)$/.test(f) && f !== 'og.png').forEach(f => add('assets/img/' + f));

const hash = crypto.createHash('sha1');
list.slice(1).forEach(f => hash.update(f).update(fs.readFileSync(path.join(root, f))));
const version = 'akt-' + hash.digest('hex').slice(0, 10);

const swPath = path.join(root, 'sw.js');
let sw = fs.readFileSync(swPath, 'utf8');
sw = sw.replace(/var VERSION = '[^']*';/, "var VERSION = '" + version + "';")
	.replace(/var PRECACHE = \[[\s\S]*?\n\];/, 'var PRECACHE = [\n' + list.map(f => "\t'" + f + "'").join(',\n') + '\n];');
fs.writeFileSync(swPath, sw);
console.log(version, list.length, 'files');

// the sitemap is read from the same data, so it is rebuilt with every change too
require('./build-sitemap.js');

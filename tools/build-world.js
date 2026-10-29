// Writes assets/data/world.json, the world drawn once for «الخريطة» (map.html): land and country outlines from Natural Earth
// (public domain, via the world-atlas package's countries-110m.json) in the Natural Earth projection, 1000 wide, Antarctica
// left out — so the page needs no map library and no map tiles from anyone's server. map.js projects its pins the same way.
// Run once (the outlines do not change):  node tools/build-world.js path/to/countries-110m.json
const fs = require('fs'), path = require('path');
const topo = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
const W = 1000, TOP = 84, BOTTOM = -58;

/* d3's naturalEarth1Raw */
const raw = (lam, phi) => {
	const p2 = phi * phi, p4 = p2 * p2;
	return [lam * (0.8707 - 0.131979 * p2 + p4 * (-0.013791 + p4 * (0.003971 * p2 - 0.001529 * p4))),
		phi * (1.007226 + p2 * (0.015085 + p4 * (-0.044475 + 0.028874 * p2 - 0.005916 * p4)))];
};
const R = Math.PI / 180, k = W / (2 * raw(Math.PI, 0)[0]);
const yTop = raw(0, TOP * R)[1], yBot = raw(0, BOTTOM * R)[1];
const H = Math.round(k * (yTop - yBot)), tx = W / 2, ty = k * yTop;
const project = (lon, lat) => { const p = raw(lon * R, lat * R); return [tx + k * p[0], ty - k * p[1]]; };

/* the arcs, their quantized deltas summed and placed */
const T = topo.transform;
const arcs = topo.arcs.map(a => { let x = 0, y = 0; return a.map(p => { x += p[0]; y += p[1]; return [x * T.scale[0] + T.translate[0], y * T.scale[1] + T.translate[1]]; }); });
const ring = (ids) => {
	let pts = [];
	ids.forEach(i => { const a = i < 0 ? arcs[~i].slice().reverse() : arcs[i]; pts = pts.concat(pts.length ? a.slice(1) : a); });
	return pts;
};
/* whole pixels: finer is invisible at this size and doubles the file */
const r1 = (v) => Math.round(v);
/* a ring as a path, broken where it jumps across the date line */
const ringPath = (pts) => {
	if (pts.every(p => p[1] < BOTTOM)) return '';
	let d = '', prev = null, last = '';
	pts.forEach(p => {
		const lat = Math.max(BOTTOM - 2, Math.min(TOP, p[1])), q = project(p[0], lat), jump = !prev || Math.abs(p[0] - prev[0]) > 180;
		const xy = r1(q[0]) + ',' + r1(q[1]);
		/* (a point that rounds onto the one before it adds nothing) */
		if (jump || xy !== last) d += (jump ? 'M' : 'L') + xy;
		last = xy; prev = p;
	});
	return d + 'Z';
};
const polys = (obj) => [].concat(...obj.geometries.map(g => g.type === 'Polygon' ? [g.arcs] : g.type === 'MultiPolygon' ? g.arcs : []));
/* (the countries, filled and outlined, are the land: no separate land shape) */
const borders = polys(topo.objects.countries).map(p => p.map(r => ringPath(ring(r))).join('')).join('');
/* the graticule: every 30° of longitude and latitude */
let grid = '';
for (let lon = -180; lon <= 180; lon += 30) { let d = ''; for (let lat = BOTTOM; lat <= TOP; lat += 2) { const q = project(lon, lat); d += (d ? 'L' : 'M') + r1(q[0]) + ',' + r1(q[1]); } grid += d; }
for (let lat = -30; lat <= 60; lat += 30) { let d = ''; for (let lon = -180; lon <= 180; lon += 3) { const q = project(lon, lat); d += (d ? 'L' : 'M') + r1(q[0]) + ',' + r1(q[1]); } grid += d; }

const out = { w: W, h: H, k: k, tx: tx, ty: ty, top: TOP, bottom: BOTTOM, countries: borders, grid: grid };
const file = path.join(__dirname, '..', 'assets/data/world.json');
fs.writeFileSync(file, JSON.stringify(out));
console.log('world.json', W + '×' + H, Math.round(fs.statSync(file).size / 1024) + ' KB');

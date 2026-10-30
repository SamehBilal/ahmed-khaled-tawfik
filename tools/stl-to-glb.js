// Turns a 3D-printing STL (shape only, no colour) into a light GLB for the web: the shared corners welded, the mesh simplified
// by vertex clustering to about the size asked for, smooth normals, stood upright on the ground and centred, quantized
// (KHR_mesh_quantization) and given one material — a statue's bronze — since an STL carries no paint.
// node tools/stl-to-glb.js <in.stl> <out.glb> [grid cells along the tallest side, default 220] [colour hex, default bronze]
const fs = require('fs');
const [inp, out, gridArg, colArg] = process.argv.slice(2);
const b = fs.readFileSync(inp), n = b.readUInt32LE(80);
if (b.length !== 84 + n * 50) throw new Error('not a binary STL');

/* the triangles' corners */
const P = new Float32Array(n * 9);
for (let i = 0; i < n; i++) for (let k = 0; k < 9; k++) P[i * 9 + k] = b.readFloatLE(84 + i * 50 + 12 + k * 4);
let min = [Infinity, Infinity, Infinity], max = [-Infinity, -Infinity, -Infinity];
for (let i = 0; i < P.length; i += 3) for (let a = 0; a < 3; a++) { min[a] = Math.min(min[a], P[i + a]); max[a] = Math.max(max[a], P[i + a]); }
const size = max.map((v, a) => v - min[a]);
/* which way is up: the STL's tallest side (Meshy writes Z up; glTF wants Y up) */
const up = size.indexOf(Math.max.apply(null, size));
const G = +gridArg || 220, cell = Math.max.apply(null, size) / G;

/* vertex clustering: every corner falls into a grid cell; the cell's corners become one vertex, at their average */
const cellOf = new Map(), sum = [];
const vid = new Uint32Array(n * 3);
for (let c = 0; c < n * 3; c++) {
	const x = P[c * 3], y = P[c * 3 + 1], z = P[c * 3 + 2];
	const key = Math.floor((x - min[0]) / cell) + ',' + Math.floor((y - min[1]) / cell) + ',' + Math.floor((z - min[2]) / cell);
	let v = cellOf.get(key);
	if (v === undefined) { v = sum.length; cellOf.set(key, v); sum.push([0, 0, 0, 0]); }
	const s = sum[v]; s[0] += x; s[1] += y; s[2] += z; s[3]++;
	vid[c] = v;
}
const V = sum.length, pos = new Float32Array(V * 3);
sum.forEach((s, v) => { pos[v * 3] = s[0] / s[3]; pos[v * 3 + 1] = s[1] / s[3]; pos[v * 3 + 2] = s[2] / s[3]; });
/* the triangles that still have three corners, each once */
const tris = [], seen = new Set();
for (let i = 0; i < n; i++) {
	const a = vid[i * 3], c1 = vid[i * 3 + 1], c2 = vid[i * 3 + 2];
	if (a === c1 || c1 === c2 || a === c2) continue;
	const k = [a, c1, c2].sort((x, y) => x - y).join(',');
	if (seen.has(k)) continue;
	seen.add(k); tris.push(a, c1, c2);
}

/* Y up, feet on the ground (y = 0), centred, 1 unit tall */
/* (Z up, facing −Y, as Meshy writes it, becomes Y up facing +Z — the viewer's front — by a turn, (x, y, z) → (x, z, −y),
   which keeps the triangles' winding and so their outward faces) */
const ax = up === 2 ? [0, 2, 1] : up === 0 ? [1, 0, 2] : [0, 1, 2], sz = up === 2 ? -1 : 1;
const out3 = new Float32Array(V * 3);
for (let v = 0; v < V; v++) { out3[v * 3] = pos[v * 3 + ax[0]]; out3[v * 3 + 1] = pos[v * 3 + ax[1]]; out3[v * 3 + 2] = sz * pos[v * 3 + ax[2]]; }
let lo = [Infinity, Infinity, Infinity], hi = [-Infinity, -Infinity, -Infinity];
for (let i = 0; i < out3.length; i += 3) for (let a = 0; a < 3; a++) { lo[a] = Math.min(lo[a], out3[i + a]); hi[a] = Math.max(hi[a], out3[i + a]); }
const H = hi[1] - lo[1], cx = (lo[0] + hi[0]) / 2, cz = (lo[2] + hi[2]) / 2;
for (let i = 0; i < out3.length; i += 3) { out3[i] = (out3[i] - cx) / H; out3[i + 1] = (out3[i + 1] - lo[1]) / H; out3[i + 2] = (out3[i + 2] - cz) / H; }

/* smooth normals, weighted by the faces' areas */
const nor = new Float32Array(V * 3);
for (let i = 0; i < tris.length; i += 3) {
	const [a, c1, c2] = [tris[i], tris[i + 1], tris[i + 2]];
	const ux = out3[c1 * 3] - out3[a * 3], uy = out3[c1 * 3 + 1] - out3[a * 3 + 1], uz = out3[c1 * 3 + 2] - out3[a * 3 + 2];
	const wx = out3[c2 * 3] - out3[a * 3], wy = out3[c2 * 3 + 1] - out3[a * 3 + 1], wz = out3[c2 * 3 + 2] - out3[a * 3 + 2];
	const nx = uy * wz - uz * wy, ny = uz * wx - ux * wz, nz = ux * wy - uy * wx;
	[a, c1, c2].forEach(v => { nor[v * 3] += nx; nor[v * 3 + 1] += ny; nor[v * 3 + 2] += nz; });
}

/* quantized: positions as normalized int16 within the box (a node scale and offset restore them), normals as int8 */
let qlo = [Infinity, Infinity, Infinity], qhi = [-Infinity, -Infinity, -Infinity];
for (let i = 0; i < out3.length; i += 3) for (let a = 0; a < 3; a++) { qlo[a] = Math.min(qlo[a], out3[i + a]); qhi[a] = Math.max(qhi[a], out3[i + a]); }
const ext = Math.max(qhi[0] - qlo[0], qhi[1] - qlo[1], qhi[2] - qlo[2]);
const posQ = Buffer.alloc(V * 8), norQ = Buffer.alloc(V * 4);
let pmin = [32767, 32767, 32767], pmax = [-32768, -32768, -32768];
for (let v = 0; v < V; v++) {
	for (let a = 0; a < 3; a++) {
		const q = Math.round((out3[v * 3 + a] - qlo[a]) / ext * 65534 - 32767);
		posQ.writeInt16LE(q, v * 8 + a * 2); pmin[a] = Math.min(pmin[a], q); pmax[a] = Math.max(pmax[a], q);
	}
	const l = Math.hypot(nor[v * 3], nor[v * 3 + 1], nor[v * 3 + 2]) || 1;
	for (let a = 0; a < 3; a++) norQ.writeInt8(Math.round(nor[v * 3 + a] / l * 127), v * 4 + a);
}
const idx = V < 65536 ? Buffer.alloc(tris.length * 2) : Buffer.alloc(tris.length * 4);
tris.forEach((t, i) => V < 65536 ? idx.writeUInt16LE(t, i * 2) : idx.writeUInt32LE(t, i * 4));
const pad4 = (buf) => buf.length % 4 ? Buffer.concat([buf, Buffer.alloc(4 - buf.length % 4)]) : buf;
const bin = Buffer.concat([posQ, norQ, pad4(idx)]);
/* the positions' int16 range back to the model's units: x = q * s + o, with q in [-1, 1] */
const s = ext / 2, o = qlo.map(v => v + ext / 2);
const hex = (colArg || '#6e4c2c').replace('#', ''), rgb = [0, 2, 4].map(i => Math.pow(parseInt(hex.slice(i, i + 2), 16) / 255, 2.2));
const gltf = {
	asset: { version: '2.0', generator: 'tools/stl-to-glb.js' }, extensionsUsed: ['KHR_mesh_quantization'], extensionsRequired: ['KHR_mesh_quantization'],
	scene: 0, scenes: [{ nodes: [0] }],
	nodes: [{ mesh: 0, scale: [s, s, s], translation: o }],
	meshes: [{ primitives: [{ attributes: { POSITION: 0, NORMAL: 1 }, indices: 2, material: 0 }] }],
	materials: [{ name: 'bronze', pbrMetallicRoughness: { baseColorFactor: rgb.concat([1]), metallicFactor: 0.7, roughnessFactor: 0.48 } }],
	buffers: [{ byteLength: bin.length }],
	bufferViews: [{ buffer: 0, byteOffset: 0, byteLength: posQ.length, byteStride: 8, target: 34962 },
		{ buffer: 0, byteOffset: posQ.length, byteLength: norQ.length, byteStride: 4, target: 34962 },
		{ buffer: 0, byteOffset: posQ.length + norQ.length, byteLength: idx.length, target: 34963 }],
	accessors: [{ bufferView: 0, componentType: 5122, normalized: true, count: V, type: 'VEC3', min: pmin.map(q => q / 32767), max: pmax.map(q => q / 32767) },
		{ bufferView: 1, componentType: 5120, normalized: true, count: V, type: 'VEC3' },
		{ bufferView: 2, componentType: V < 65536 ? 5123 : 5125, count: tris.length, type: 'SCALAR' }]
};
const json = pad4(Buffer.from(JSON.stringify(gltf), 'utf8'));
const jsonP = Buffer.concat([json.slice(0, Buffer.from(JSON.stringify(gltf)).length), Buffer.alloc(json.length - Buffer.from(JSON.stringify(gltf)).length, 0x20)]);
const glb = Buffer.alloc(12 + 8 + jsonP.length + 8 + bin.length);
glb.writeUInt32LE(0x46546C67, 0); glb.writeUInt32LE(2, 4); glb.writeUInt32LE(glb.length, 8);
glb.writeUInt32LE(jsonP.length, 12); glb.writeUInt32LE(0x4E4F534A, 16); jsonP.copy(glb, 20);
glb.writeUInt32LE(bin.length, 20 + jsonP.length); glb.writeUInt32LE(0x004E4942, 24 + jsonP.length); bin.copy(glb, 28 + jsonP.length);
fs.writeFileSync(out, glb);
console.log(out, n, '→', tris.length / 3, 'triangles,', V, 'vertices,', Math.round(glb.length / 1024) + ' KB', '(up axis ' + 'XYZ'[up] + ')');

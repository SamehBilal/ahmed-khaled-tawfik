// Tells Bing, Yandex, Seznam and Naver (IndexNow: https://www.indexnow.org) about every address in sitemap.xml, so they crawl
// new and changed pages without waiting. No account: the key file at the site's root (<key>.txt, holding the key) proves the
// site is ours; since the site lives under /ahmed-khaled-tawfik/, the key is given with its location there.
// Google does not take IndexNow: submit sitemap.xml in Google Search Console instead.
// Run from the repo root after publishing (the key file must already be live):  node tools/indexnow.js
const fs = require('fs'), path = require('path');
const root = path.resolve(__dirname, '..'), SITE = 'https://samehbilal.github.io/ahmed-khaled-tawfik/';
const keyFile = fs.readdirSync(root).filter(f => /^[0-9a-f]{32}\.txt$/.test(f))[0];
if (!keyFile) { console.error('no key file'); process.exit(1); }
const key = keyFile.slice(0, 32);
const urls = [...fs.readFileSync(path.join(root, 'sitemap.xml'), 'utf8').matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1].replace(/&amp;/g, '&'));
/* sent to Bing, which shares it with the other IndexNow engines (the shared api.indexnow.org refused the key at first) */
fetch('https://www.bing.com/indexnow', {
	method: 'POST', headers: { 'Content-Type': 'application/json; charset=utf-8' },
	body: JSON.stringify({ host: 'samehbilal.github.io', key: key, keyLocation: SITE + keyFile, urlList: urls })
}).then(r => console.log('IndexNow', r.status, r.statusText, urls.length, 'addresses'), e => console.error(e.message));

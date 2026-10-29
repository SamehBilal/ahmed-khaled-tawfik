// The site's data and helpers, loaded as the pages load them, in a bare window where no page is drawn: for the build
// tools (sitemap, share pages, data checks). require('./load-data.js')() → { win, App, S: WorksShared, P: People, d: AKT }
const fs = require('fs'), path = require('path'), vm = require('vm');
const root = path.resolve(__dirname, '..');
const SITE = 'https://samehbilal.github.io/ahmed-khaled-tawfik/';
const FILES = ['data', 'data-issues', 'data-quotes', 'data-legacy', 'data-books-a', 'data-books-b', 'data-series-more', 'data-audio', 'data-storytel',
	'data-tributes', 'data-more', 'data-blurbs', 'data-blog', 'data-heroes', 'people', 'books', 'shared', 'app'];

module.exports = function load(files) {
	const noop = () => {};
	const el = () => ({ style: {}, classList: { add: noop, remove: noop, toggle: noop, contains: () => false }, setAttribute: noop, getAttribute: () => null, appendChild: noop, addEventListener: noop });
	const win = {
		console, setTimeout, clearTimeout, URLSearchParams,
		document: { readyState: 'loading', addEventListener: noop, documentElement: el(), body: el(), head: el(), querySelector: () => null, querySelectorAll: () => [], getElementById: () => null, createElement: el },
		location: { search: '', hash: '', pathname: '/', href: SITE },
		history: { replaceState: noop, pushState: noop },
		navigator: { userAgent: 'node' },
		localStorage: { getItem: () => null, setItem: noop, removeItem: noop },
		matchMedia: () => ({ matches: false, addEventListener: noop }),
		addEventListener: noop, requestAnimationFrame: noop
	};
	win.window = win; win.self = win;
	const ctx = vm.createContext(win);
	(files || FILES).forEach(f => vm.runInContext(fs.readFileSync(path.join(root, 'assets/js', f + '.js'), 'utf8'), ctx, { filename: f + '.js' }));
	return { win, App: win.App, S: win.WorksShared, P: win.People, d: win.App ? win.App.data() : win.AKT };
};
module.exports.SITE = SITE;
module.exports.root = root;
module.exports.FILES = FILES;

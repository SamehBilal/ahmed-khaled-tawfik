/* Opening reveal — adapted from the "Believe" GSAP animation.
   "العراب" drops in and squashes like the "i" (with no mark above it: #iDot is only the point the rings and the reveal start from),
   the three words of his name spring in from the centre, coloured rings bloom
   inside the letters, then a growing hole opens the page underneath.
   Plays once per browser session; click / Esc / the Skip button ends it. */
(function () {
	'use strict';

	var KEY = 'akt-intro-seen';
	var overlay = document.getElementById('intro');
	if (!overlay) return;

	function seen() { try { return sessionStorage.getItem(KEY) === '1'; } catch (e) { return false; } }
	function markSeen() { try { sessionStorage.setItem(KEY, '1'); } catch (e) {} }

	var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
	var forced = /[?&]intro=1/.test(location.search);

	function remove() {
		if (!overlay.parentNode) return;
		if (window.gsap) window.gsap.set('.home-hero .wrap > *', { clearProps: 'all' });
		overlay.parentNode.removeChild(overlay);
		document.documentElement.classList.remove('intro-on');
		markSeen();
	}

	if ((seen() && !forced) || reduce || !window.gsap) { remove(); return; }

	document.documentElement.classList.add('intro-on');

	var gsap = window.gsap;
	if (window.CustomEase) gsap.registerPlugin(window.CustomEase);
	if (window.CustomWiggle) gsap.registerPlugin(window.CustomWiggle);

	var tl;
	function finish() {
		if (tl) tl.kill();
		gsap.to(overlay, { autoAlpha: 0, duration: 0.35, onComplete: remove });
	}
	overlay.querySelector('.intro-skip').addEventListener('click', function (e) { e.stopPropagation(); finish(); });
	overlay.addEventListener('click', finish);
	document.addEventListener('keydown', function onKey(e) {
		if (e.key === 'Escape') { document.removeEventListener('keydown', onKey); finish(); }
	});

	var fontsReady = (document.fonts && document.fonts.load)
		? Promise.all([document.fonts.load('150px Lalezar', 'العرّاب'), document.fonts.load('40px "Reem Kufi"', 'جعل الشباب يقرؤون')]).catch(function () {})
		: Promise.resolve();

	/* never wait for fonts more than 1.5s */
	Promise.race([fontsReady, new Promise(function (r) { setTimeout(r, 1500); })]).then(play);

	function play() {
		if (!overlay.parentNode) return;

		var ringEase = window.CustomEase ? window.CustomEase.create('ringEase', 'M0,0 C0.484,0.274 0.79,0.698 1,1 ') : 'power1.in';
		var ringRadialEase = window.CustomEase ? window.CustomEase.create('ringRadial', 'M0,0 C0,0.908 0.78,1 1,1 ') : 'expo.out';
		var wiggle = window.CustomWiggle ? 'wiggle({wiggles: 7})' : 'elastic(1, 0.3)';

		var colors = ['#f6d79a', '#f2b56b', '#eb9250', '#e0703a', '#cf4f25', '#b3361e', '#922418', '#6e1a14', '#4a1210', '#2b0f0e'];

		gsap.set('#introSVG', { visibility: 'visible' });
		gsap.set('#introSVG .ring', { fill: gsap.utils.wrap(colors) });
		/* explicit SVG origins: these elements live in <defs>, where bounding boxes are unreliable */
		gsap.utils.toArray('#introSVG [data-o]').forEach(function (el) { gsap.set(el, { smoothOrigin: false, svgOrigin: el.getAttribute('data-o') }); });

		tl = window.__introTL = gsap.timeline({ onComplete: finish });

		tl.add('drop')
		.fromTo('#iWord', { y: -420 }, { y: 0, duration: 0.14, ease: 'sine.in' }, 'drop')
		.fromTo('#iWord', { scaleX: 0.3, scaleY: 1.7 }, { scaleX: 1, scaleY: 1, duration: 1.4, ease: 'elastic(0.83, 0.3)' }, 'drop')

		.add('dot', '-=1')
		.fromTo('#iDot', { y: -320 }, { y: 0, duration: 0.14, ease: 'sine.in' }, 'dot')
		.fromTo('#iDot', { scaleX: 1.5, scaleY: 0.5 }, { scaleX: 1, scaleY: 1, duration: 1, ease: 'elastic(0.83, 0.13)' }, 'dot')
		.to('#iWord', { duration: 0.2, scaleX: 1.12, scaleY: 0.84, ease: 'sine', repeat: 1, yoyo: true }, 'dot+=0.12')

		.add('endDot', '-=0.5')
		.add('name', '-=0.1')
		/* name words spring out from the centre line (أحمد ← right, توفيق ← left) */
		.fromTo('#iName > g', { x: gsap.utils.wrap([-190, 0, 190]), scale: 0.4, opacity: 0 }, { x: 0, scale: 1, opacity: 1, duration: 0.9, stagger: 0.07, ease: 'expo.out' }, 'name')
		.fromTo('#iName .w', { rotation: gsap.utils.wrap([-40, 18, 40]), scaleX: 1.5, scaleY: 0.5 }, { rotation: 0, scaleX: 1, scaleY: 1, duration: 1.4, ease: 'elastic(0.9, 0.4)', stagger: 0.08 }, 'name')

		/* dot hops, word wiggles */
		.to('#iDot', { duration: 0.2, scaleX: 0.8, scaleY: 1.3, y: -90, ease: 'power1.inOut' }, 'endDot')
		.to('#iDot', { duration: 0.2, y: 0, ease: 'power3.in' }, 'endDot+=0.2')
		.to('#iDot', { duration: 1, scaleX: 1, scaleY: 1, ease: 'elastic(1, 0.52)' }, 'endDot+=0.2')
		.to('#iWord', { duration: 1.2, scaleX: 1.08, scaleY: 0.92, ease: wiggle }, 'endDot+=0.4')

		/* rings bloom inside the letters */
		.to('#introSVG .ring', {
			duration: 2,
			attr: { r: gsap.utils.distribute({ base: 10, amount: 420, from: 'end', ease: ringEase }) },
			stagger: { each: 0.1 },
			opacity: 1,
			ease: ringRadialEase
		}, '-=1.7')
		/* «حتى تحترق النجوم…»: each line rises in and drifts up as the next arrives,
		   then the last two lines stay and «ربما» swells in ember */
		.add('quote', '-=1.4');
		var qLines = gsap.utils.toArray('#iQuote .ql'), STEP = 1.05;
		qLines.forEach(function (ln, k) {
			tl.fromTo(ln, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' }, 'quote+=' + (k * STEP))
				.to(ln, { opacity: 0, y: -14, duration: 0.35, ease: 'power1.in' }, 'quote+=' + (k * STEP + 0.75));
		});
		tl.add('qend', 'quote+=' + (qLines.length * STEP))
		.to('#qEnd', { opacity: 1, duration: 0.5 }, 'qend')
		.from('#qEnd text:first-child', { y: 12, duration: 0.5, ease: 'power2.out' }, 'qend')
		.from('#qMaybe', { opacity: 0, scale: 0.6, transformOrigin: '50% 50%', duration: 0.7, ease: 'back.out(2)' }, 'qend+=0.9')
		.to('#qEnd text:first-child', { opacity: 0.45, duration: 0.6 }, 'qend+=1.5');

		/* reveal: a hole grows from the dot and uncovers the page */
		tl.add('reveal', '+=1.2')
		.call(centreHole, null, 'reveal')
		.to('#introSVG', { scale: 1.25, duration: 1.1, ease: 'power2.in' }, 'reveal')
		.fromTo(overlay, { '--hole': '-1%' }, { '--hole': '150%', duration: 1.1, ease: 'power3.in' }, 'reveal')
		.from('.home-hero .wrap > *', { y: 40, opacity: 0, stagger: 0.12, duration: 0.9, ease: 'power3.out' }, 'reveal+=0.7');

		tl.timeScale(0.8);
	}

	/* centre the reveal hole on the shadda's on-screen position */
	function centreHole() {
		var svg = document.getElementById('introSVG');
		var c = document.getElementById('iDot').getAttribute('data-c').split(' ');
		var ctm = svg.getScreenCTM();
		if (!ctm) return;
		var pt = svg.createSVGPoint();
		pt.x = +c[0]; pt.y = +c[1];
		pt = pt.matrixTransform(ctm);
		var o = overlay.getBoundingClientRect();
		var s = svg.getBoundingClientRect();
		overlay.style.setProperty('--hx', ((pt.x - o.left) / o.width * 100).toFixed(2) + '%');
		overlay.style.setProperty('--hy', ((pt.y - o.top) / o.height * 100).toFixed(2) + '%');
		gsap.set(svg, { transformOrigin: (pt.x - s.left) + 'px ' + (pt.y - s.top) + 'px' });
	}
})();

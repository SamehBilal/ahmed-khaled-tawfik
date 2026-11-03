# Small WebP copies of the covers for the grids (tools/build-thumbs.js runs this). Reads JSON [[source, target], …] on stdin;
# each copy at most 320 px wide. Needs Pillow:  py -m pip install pillow
import json, os, sys
from PIL import Image

pairs = json.load(sys.stdin)
done = 0
for src, dst in pairs:
	try:
		im = Image.open(src)
		im = im.convert('RGBA' if im.mode in ('RGBA', 'LA', 'P') else 'RGB')
		if im.width > 320:
			im = im.resize((320, round(im.height * 320 / im.width)), Image.LANCZOS)
		os.makedirs(os.path.dirname(dst), exist_ok=True)
		im.save(dst, 'WEBP', quality=78, method=6)
		done += 1
	except Exception as e:
		print('could not convert', src, e, file=sys.stderr)
print(done)

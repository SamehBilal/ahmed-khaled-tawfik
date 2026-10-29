# JPG copies of the share pages' WebP pictures (tools/build-share.js runs this): WhatsApp on older phones, LinkedIn and
# others show no preview for a WebP image. Reads JSON [[source, target], …] on stdin; each copy at most 600 px wide.
# Needs Pillow:  py -m pip install pillow
import json, os, sys
from PIL import Image

pairs = json.load(sys.stdin)
done = 0
for src, dst in pairs:
	try:
		im = Image.open(src)
		if im.mode in ('RGBA', 'LA', 'P'):
			im = im.convert('RGBA')
			bg = Image.new('RGB', im.size, (14, 15, 19))
			bg.paste(im, mask=im.split()[-1])
			im = bg
		else:
			im = im.convert('RGB')
		if im.width > 600:
			im = im.resize((600, round(im.height * 600 / im.width)), Image.LANCZOS)
		os.makedirs(os.path.dirname(dst), exist_ok=True)
		im.save(dst, 'JPEG', quality=82, optimize=True, progressive=True)
		done += 1
	except Exception as e:
		print('could not convert', src, e, file=sys.stderr)
print(done)

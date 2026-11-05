"""Small copies of every recipe photo for cards and lists (photos/t/<id>.jpg, 480x360).
The full 800x600 photo is only loaded when a recipe is opened. Run after adding photos: python3 tools/make-thumbs.py"""
import os
from PIL import Image
root = os.path.join(os.path.dirname(__file__), "..", "photos")
out = os.path.join(root, "t"); os.makedirs(out, exist_ok=True)
names = {f for f in os.listdir(root) if f.endswith(".jpg")}
for f in sorted(names):
    src, dst = os.path.join(root, f), os.path.join(out, f)
    if os.path.exists(dst) and os.path.getmtime(dst) >= os.path.getmtime(src): continue
    Image.open(src).convert("RGB").resize((480, 360), Image.LANCZOS).save(dst, "JPEG", quality=72, optimize=True, progressive=True)
for f in os.listdir(out):
    if f not in names: os.remove(os.path.join(out, f))
print(len(names), "thumbnails")

"""Screenshot the plugin window headlessly: python3 tools/shot.py out.png [w h mx my slider=value ...]"""
import os, subprocess, sys, tempfile
import numpy as np
import matplotlib
matplotlib.use("Agg")
import matplotlib.image as mpimg
HERE = os.path.dirname(os.path.abspath(__file__))
out = sys.argv[1]
w, h, mx, my = (sys.argv[2:6] + ["940", "720", "-1", "-1"][len(sys.argv[2:6]):])[:4]
extra = sys.argv[6:]
with tempfile.TemporaryDirectory() as tmp:
    raw = os.path.join(tmp, "o.bgra")
    r = subprocess.run([os.path.join(HERE, "build", "shot"), os.path.join(os.path.dirname(HERE), "Instrument-Creator.jsfx"), raw, w, h, mx, my] + extra, capture_output=True, text=True)
    if r.returncode:
        print(r.stderr); sys.exit(1)
    px = np.fromfile(raw, dtype=np.uint8).reshape(int(h), int(w), 4)
    mpimg.imsave(out, px[:, :, [2, 1, 0]])
print("wrote", out)

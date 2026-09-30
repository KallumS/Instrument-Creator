"""Age / rust: level, ring, brightness, tuning and noisiness at 0, 50, 100 %.
    python3 tools/age_test.py
"""
import re
import numpy as np
from scipy.signal import butter, sosfilt
from analyse import *
SR = 48000
src = open(PLUGIN).read()
rows = re.findall(r"^pdef\(\s*(\d+),([^)]*)\);", src, re.M)
names = re.findall(r'"([^"]+)"', re.search(r"function preset_name\(k\)\n\((.*?)\n\);", src, re.S).group(1))
hp = butter(4, 3000, "hp", fs=SR, output="sos")
print(f"{'preset':22s} {'age':>4s} {'LUFS':>6s} {'ring s':>7s} {'>3k dB':>7s} {'cents (5 notes)':>26s} {'aperiodic':>9s}")
for k, vals in rows:
    v = [float(x) for x in vals.split(",")]
    for age in (0, 50, 100):
        s = {i + 1: v[i] for i in range(19)}; s[23] = age
        cs = []; aps = []; Ls = []; rings = []; hfs = []
        for n in (48, 55, 60, 64, 67):
            y, _ = render(s, note(n, 0, 1.2, 100), 2.2, SR)
            m = y.mean(axis=1)
            f, ap = pitch(m[int(0.3 * SR):int(0.9 * SR)])
            cs.append(cents(f, hz(n)) if np.isfinite(f) else np.nan); aps.append(ap)
            Ls.append(lufs(y[:int(1.2 * SR)]))
            e = np.array([np.sqrt(np.mean(m[i:i + 2400] ** 2)) + 1e-9 for i in range(0, int(1.2 * SR), 2400)])
            db = 20 * np.log10(e / e.max())
            rings.append(np.argmax(db < -20) * 0.05 if (db < -20).any() else 1.2)
            hfs.append(10 * np.log10(np.mean(sosfilt(hp, m) ** 2) / np.mean(m ** 2)))
        print(f"{names[int(k)]:22s} {age:4d} {np.mean(Ls):6.1f} {np.mean(rings):7.2f} {np.mean(hfs):7.1f} {' '.join(f'{c:+4.0f}' for c in cs):>26s} {np.median(aps):9.2f}")

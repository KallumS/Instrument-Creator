"""Spectrogram grid of every preset playing a short phrase.
    python3 tools/spectrograms.py out.png
"""
import re, sys
import numpy as np
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
from scipy.signal import spectrogram
from analyse import *
src = open(PLUGIN).read()
rows = re.findall(r"^pdef\(\s*(\d+),([^)]*)\);", src, re.M)
names = re.findall(r'"([^"]+)"', re.search(r"function preset_name\(k\)\n\((.*?)\n\);", src, re.S).group(1))
ev = note(48, 0, 1.0) + note(55, 1.0, 2.0) + note(60, 2.0, 3.0) + note(64, 3.0, 4.0) + note(67, 4.0, 6.0) + note(72, 4.0, 6.0)
fig, axs = plt.subplots(4, 4, figsize=(18, 13))
for (k, vals), ax in zip(rows, axs.flat):
    v = [float(x) for x in vals.split(",")]
    y, _ = render({i + 1: v[i] for i in range(19)}, ev, 7.0)
    f, t, S = spectrogram(y.mean(axis=1), 48000, nperseg=2048, noverlap=1536)
    ax.pcolormesh(t, f, 10 * np.log10(S + 1e-12), vmin=-120, vmax=-30, shading="auto", cmap="magma")
    ax.set_ylim(0, 6000); ax.set_title(names[int(k)], loc="left", fontsize=10)
plt.tight_layout(); plt.savefig(sys.argv[1], dpi=60)

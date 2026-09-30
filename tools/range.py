"""Pitch and level of one combination across the keyboard.
    python3 tools/range.py slider=value ...
"""
import sys
import numpy as np
from analyse import *
s = {int(a.split("=")[0]): float(a.split("=")[1]) for a in sys.argv[1:]}
sr = 48000
for n in (36, 43, 48, 55, 60, 67, 72, 79, 84, 91):
    y, cpu = render(s, note(n, 0.0, 1.2), 1.4, sr)
    m = y.mean(axis=1)
    seg = m[int(0.5 * sr): int(1.15 * sr)]
    f, ap = pitch(seg, sr, fmax=min(4000, 3 * hz(n)))
    print(f"note {n:3d} {hz(n):7.1f} Hz -> {f:8.1f} Hz {cents(f, hz(n)):7.0f} c  ap {ap:5.2f}  LUFS {lufs(y[:int(1.2*sr)]):6.1f}  peak {np.abs(m).max():.3f}")

"""Play one note through every energy x exciter x element and report.

    python3 tools/sweep.py [note] [extra slider=value ...]
"""
import sys
import numpy as np
from analyse import *

n = int(sys.argv[1]) if len(sys.argv) > 1 and "=" not in sys.argv[1] else 60
extra = {int(a.split("=")[0]): float(a.split("=")[1]) for a in sys.argv[1:] if "=" in a}
sr = 48000
print(f"note {n} ({hz(n):.1f} Hz)")
print(f"{'energy':12s}{'exciter':10s}{'element':12s}{'LUFS':>7s}{'peak':>7s}{'f0':>8s}{'cents':>7s}{'ap':>6s}{'tail':>7s}{'CPU':>6s}")
for en in range(6):
    for ex in range(6):
        for el in range(6):
            s = {1: en, 2: ex, 3: el}
            s.update(extra)
            y, cpu = render(s, note(n, 0.0, 1.5), 2.3, sr)
            m = y.mean(axis=1)
            fin = np.all(np.isfinite(m))
            L = lufs(y[: int(1.5 * sr)])
            seg = m[int(0.5 * sr): int(1.2 * sr)]
            f, ap = pitch(seg, sr)
            c = cents(f, hz(n)) if np.isfinite(f) else float("nan")
            tail = 20 * np.log10(max(np.sqrt(np.mean(m[-int(0.2 * sr):] ** 2)), 1e-9))
            flag = "" if fin else " NONFINITE"
            if L < -45: flag += " QUIET"
            if tail > -70: flag += " TAIL"
            if el in (0, 5) and np.isfinite(c) and abs(c) > 40: flag += " PITCH"
            print(f"{ENERGY[en]:12s}{EXCITER[ex]:10s}{ELEMENT[el]:12s}{L:7.1f}{np.abs(m).max():7.3f}{f:8.1f}{c:7.0f}{ap:6.2f}{tail:7.0f}{cpu:6.1f}{flag}")

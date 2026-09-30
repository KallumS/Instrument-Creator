"""Measure loudness of every exciter x element (for a steady and a single-push
energy source) and of each coupler/resonator/radiator, and print trims.

    python3 tools/trims.py            # prints EEL lines to paste into the plugin

Loudness is the maximum momentary (400 ms) K-weighted level of one note (C4,
velocity 100), so a struck note and a held one are matched at their loudest.
"""
import sys
import numpy as np
from analyse import *

TARGET = -18.0
SR = 48000


def momentary_max(y):
    w, h = int(0.4 * SR), int(0.1 * SR)
    best = -120.0
    for i in range(0, max(1, len(y) - w), h):
        best = max(best, lufs(y[i:i + w]))
    return best


def level(s, n=60):
    y, _ = render(s, note(n, 0.0, 1.2), 1.6, SR)
    return momentary_max(y)


def level_avg(s):
    return 10 * np.log10(np.mean([10 ** (level(s, n) / 10) for n in (48, 60, 72)]))


rows = []
for cls, en in (("steady", 0), ("push", 2)):
    for ex in range(6):
        for el in range(6):
            L = level_avg({1: en, 2: ex, 3: el})
            rows.append(TARGET - L)
            print(f"{cls:7s}{EXCITER[ex]:10s}{ELEMENT[el]:12s}{L:7.1f}", file=sys.stderr)

# parts after the element, measured relative to the defaults on a few instruments
refs = [{1: 0, 2: 0, 3: 5}, {1: 2, 2: 4, 3: 0}, {1: 4, 2: 5, 3: 2}, {1: 1, 2: 3, 3: 0}]
base = [level(r) for r in refs]


def part_trims(slider, count):
    out = []
    for k in range(count):
        d = [level({**r, slider: k}) - b for r, b in zip(refs, base)]
        out.append(-float(np.mean(d)))
    return out


rs = part_trims(5, 5)
cp = part_trims(7, 4)
rd = part_trims(8, 4)
fmt = lambda xs: " ".join(f"{x:+.1f}" for x in xs)
print("// exciter x element trims (dB): steady source rows, then single-push rows")
for c in range(2):
    for ex in range(6):
        i = c * 36 + ex * 6
        print(f"trim_row({c}, {ex}, " + ", ".join(f"{x:.1f}" for x in rows[i:i + 6]) + ");")
print("// resonator, coupler, radiator:", fmt(rs), "|", fmt(cp), "|", fmt(rd))

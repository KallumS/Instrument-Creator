"""Stability sweep: nothing may blow up, anywhere.

    python3 tools/check.py            # every energy x exciter x element at 44.1/48/96 kHz,
                                      # then slider extremes and every part on a few instruments

A case fails on a non-finite sample, a crash, or a runaway: energy that keeps
growing after the key is released (late tail louder than early tail), or a tail
still loud long after release. It must report 0 failure(s).
"""
import sys
import numpy as np
from analyse import *

failures = 0


def run(s, sr, label):
    global failures
    ev = note(48, 0.0, 0.8) + note(60, 0.2, 1.0, 127) + note(72, 0.4, 1.0, 40)
    y, cpu = render(s, ev, 2.6, sr)
    m = y.mean(axis=1)
    fin = np.all(np.isfinite(m))
    n = int(0.25 * sr)
    early = np.sqrt(np.mean(m[int(1.1 * sr):int(1.1 * sr) + n] ** 2)) if fin else 0
    late = np.sqrt(np.mean(m[-n:] ** 2)) if fin else 0
    runaway = fin and late > 1.05 * early + 1e-5
    loud = fin and 20 * np.log10(late + 1e-12) > -45
    if not fin or runaway or loud:
        failures += 1
        print(f"FAIL {label} sr={sr}: finite={fin} runaway={runaway} tail={20*np.log10(late+1e-12):.0f} dB")
    return cpu


worst = 0
for sr in (44100, 48000, 96000):
    for en in range(6):
        for ex in range(6):
            for el in range(6):
                worst = max(worst, run({1: en, 2: ex, 3: el}, sr, f"{ENERGY[en]}/{EXCITER[ex]}/{ELEMENT[el]}"))
    print(f"sr {sr}: done, {failures} failure(s) so far", flush=True)

extremes = [{13: 0}, {13: 100}, {14: 25}, {14: 400}, {15: -100}, {15: 100}, {16: 10}, {16: 400},
            {17: 2}, {17: 50}, {18: 0}, {18: 100}, {19: 1}, {21: 100}, {21: -100}, {22: 12}]
insts = [{1: 0, 2: 0, 3: 5}, {1: 1, 2: 3, 3: 0}, {1: 0, 2: 1, 3: 2}, {1: 4, 2: 2, 3: 3}, {1: 5, 2: 3, 3: 1}, {1: 0, 2: 3, 3: 4}]
for inst in insts:
    for e in extremes:
        run({**inst, **e}, 48000, f"{inst} {e}")
    for sl, cnt in ((4, 31), (5, 5), (6, 31), (7, 4), (8, 4), (9, 5), (10, 4), (11, 5), (12, 5)):
        for k in range(cnt):
            run({**inst, sl: k}, 48000, f"{inst} {{{sl}: {k}}}")
print(f"extremes: done. worst CPU {worst:.1f}%")
print(f"\nsweep: {failures} failure(s)")
sys.exit(1 if failures else 0)

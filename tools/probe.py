"""Probe one combination: level over time, pitch and the strongest partials.
    python3 tools/probe.py note secs slider=value ...
"""
import sys
import numpy as np
from analyse import *
n = int(sys.argv[1]); secs = float(sys.argv[2])
s = {int(a.split("=")[0]): float(a.split("=")[1]) for a in sys.argv[3:]}
sr = 48000
y, cpu = render(s, note(n, 0.0, secs), secs + 0.8, sr)
m = y.mean(axis=1)
print(f"CPU {cpu:.1f}%  peak {np.abs(m).max():.3f}  LUFS {lufs(y[:int(secs*sr)]):.1f}")
blk = int(0.1 * sr)
print("rms dB per 100 ms:", " ".join(f"{20*np.log10(max(np.sqrt(np.mean(m[i:i+blk]**2)),1e-9)):.0f}" for i in range(0, len(m) - blk, blk)))
seg = m[int(0.4 * sr): int(min(secs, 1.4) * sr)]
f, ap = pitch(seg, sr)
print(f"pitch {f:.1f} Hz ({cents(f, hz(n)):.0f} c)  aperiodicity {ap:.2f}")
w = np.hanning(len(seg)); sp = np.abs(np.fft.rfft(seg * w)); fr = np.fft.rfftfreq(len(seg), 1 / sr)
pk = [i for i in range(2, len(sp) - 2) if sp[i] == sp[i-2:i+3].max() and fr[i] > 30]
pk = sorted(pk, key=lambda i: -sp[i])[:10]
ref = sp.max()
print("partials:", "  ".join(f"{fr[i]:.0f}({20*np.log10(sp[i]/ref):.0f})" for i in sorted(pk)))

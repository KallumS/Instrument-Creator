"""Shared helpers: render MIDI through the instrument and measure the result."""
import os
import subprocess
import tempfile

import numpy as np
from scipy.signal import lfilter

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
RENDER = os.environ.get("RENDER", os.path.join(HERE, "build", "render"))
PLUGIN = os.path.join(ROOT, "Instrument-Creator.jsfx")

ENERGY = ["Breath", "Bow", "Finger", "Plectrum", "Hammer", "Electricity"]
EXCITER = ["Reed", "Lips", "Hammer", "Bow", "Plectrum", "Mallet"]
ELEMENT = ["String", "Membrane", "Bar", "Plate", "Reed", "Air column"]
MATERIAL = ["Steel", "Brass", "Bronze", "Aluminium", "Gold", "Glass", "Crystal", "Ice",
            "Marble", "Clay", "Spruce", "Rosewood", "Bamboo", "Bone", "Gut", "Nylon",
            "Carbon fibre", "Rubber", "Paper", "Jelly", "Plastic", "PVC", "Wood", "Leather", "Cardboard",
            "Foil", "Cling film", "Tin", "Car panel", "Chain link", "Handpan steel"]
RESONATOR = ["Bore", "Soundbox", "Pipe", "Cavity", "Body"]
COUPLER = ["Bridge", "Soundpost", "Mouthpiece", "Windway"]
RADIATOR = ["Bell", "Soundboard", "Drumhead", "Cone"]


def render(sliders, events, secs, sr=48000):
    """sliders: {index: value} (1-based); events: [(t, status, d1, d2)]."""
    with tempfile.TemporaryDirectory() as tmp:
        ev = os.path.join(tmp, "ev.txt")
        with open(ev, "w") as f:
            for e in events:
                f.write("%f %d %d %d\n" % e)
        out = os.path.join(tmp, "out.f32")
        args = [RENDER, PLUGIN, out, str(sr), str(secs), ev] + [f"{k}={v}" for k, v in sliders.items()]
        r = subprocess.run(args, capture_output=True, text=True, timeout=600)
        line = r.stderr.strip().splitlines()[-1] if r.stderr.strip() else ""
        cpu = float(line.split("(")[1].split("%")[0]) if "realtime CPU" in line else float("nan")
        y = np.fromfile(out, dtype=np.float32).reshape(-1, 2) if os.path.exists(out) else np.zeros((1, 2))
        if r.returncode not in (0, 5):
            print(r.stderr)
        return y, cpu


def note(n, t0, t1, vel=100):
    return [(t0, 0x90, n, vel), (t1, 0x80, n, 0)]


def lufs(y, sr=48000):
    b1 = [1.53512485958697, -2.69169618940638, 1.19839281085285]
    a1 = [1.0, -1.69065929318241, 0.73248077421585]
    b2 = [1.0, -2.0, 1.0]
    a2 = [1.0, -1.99004745483398, 0.99007225036621]
    z = lfilter(b2, a2, lfilter(b1, a1, y, axis=0), axis=0)
    p = (z ** 2).mean(axis=0).sum()
    return -0.691 + 10 * np.log10(max(p, 1e-20))


def pitch(x, sr=48000, fmin=25, fmax=2500):
    """Fundamental by the YIN difference function (cumulative-mean normalised)."""
    x = x - x.mean()
    if np.sqrt(np.mean(x ** 2)) < 1e-6:
        return float("nan"), 1.0
    n = len(x)
    tmax = int(sr / fmin)
    w = n - tmax
    if w < 256:
        return float("nan"), 1.0
    f = np.fft.rfft(x, 2 * n)
    ac = np.fft.irfft(f * np.conj(f))[:tmax + 1]
    e = np.cumsum(x ** 2)
    e0 = e[w - 1]
    et = np.array([e[t + w - 1] - (e[t - 1] if t > 0 else 0) for t in range(tmax + 1)])
    d = e0 + et - 2 * ac
    d[0] = 0
    cm = d[1:] * np.arange(1, tmax + 1) / np.maximum(np.cumsum(d[1:]), 1e-20)
    cm = np.concatenate([[1], cm])
    tmin = int(sr / fmax)
    cand = np.where(cm[tmin:] < 0.15)[0]
    if len(cand):
        t = cand[0] + tmin
        while t + 1 < len(cm) and cm[t + 1] < cm[t]:
            t += 1
    else:
        t = np.argmin(cm[tmin:]) + tmin
    if 1 <= t < len(cm) - 1:
        a, b, c = cm[t - 1], cm[t], cm[t + 1]
        den = a - 2 * b + c
        t = t + (0.5 * (a - c) / den if den != 0 else 0)
    return sr / t, float(cm[int(round(t))])


def cents(f, ref):
    return 1200 * np.log2(f / ref)


def hz(n):
    return 440 * 2 ** ((n - 69) / 12)

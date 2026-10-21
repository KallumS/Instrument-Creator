"""Check the window against Apple's HIG Foundations as ADR 0023 applies them.

    python3 tools/hig_check.py [path/to/Instrument-Creator.jsfx]

Drives the real @gfx through tools/build/hig (ysfx, no REAPER) and checks:
words 7:1 on the pixels under them, in many states and sizes; controls 28 px
tall and 12 apart; no name cut short; one scale for everything; Tab, Shift+Tab,
Return, Space, the arrows, Delete and Esc; a visible focus ring; a second cue
besides colour on what is chosen; the controls and messages at the top; a
message that stays until dismissed; Reduce Motion; the interface size and
Reduce Motion saved with the project; the system font and nothing under 10 px.
Prints one line per check and exits 1 if any fails.
"""
import os, re, shutil, subprocess, sys, tempfile
import numpy as np

HERE = os.path.dirname(os.path.abspath(__file__))
JSFX = os.path.abspath(sys.argv[1]) if len(sys.argv) > 1 else os.path.join(os.path.dirname(HERE), "Instrument-Creator.jsfx")
HOST = os.path.join(HERE, "build", "hig")
MIN_CONTRAST = 7.0
fails = []


def check(ok, what, detail=""):
    print(("ok    " if ok else "FAIL  ") + what + (("  -- " + detail) if detail and not ok else ""))
    if not ok:
        fails.append(what)


def run(steps, w=940, h=720, scale=1, jsfx=JSFX):
    env = dict(os.environ, SHOT_SCALE=str(scale))
    r = subprocess.run([HOST, jsfx, str(w), str(h)] + steps, capture_output=True, text=True, env=env)
    if r.returncode:
        raise SystemExit("hig failed: " + r.stderr[-2000:])
    out = {"text": [], "focus": [], "var": {}, "menu": [], "sliders": None, "focused": [], "restored": None, "texts": [], "undo": []}
    for line in r.stdout.splitlines():
        p = line.split(" ")
        if p[0] == "text":
            out["text"].append(tuple(float(x) for x in p[1:]))
        elif p[0] == "focus":
            out["focus"].append(tuple(float(x) for x in p[1:]))
        elif p[0] == "focused":
            out["focused"].append(float(p[1]))
        elif p[0] == "var":
            out["var"][p[1]] = float(p[2])
        elif p[0] == "menu":
            out["menu"].append(line[5:])
        elif p[0] == "sliders":
            out["sliders"] = [float(x) for x in p[1:]]
        elif p[0] == "undo":
            out["undo"].append([float(x) for x in p[1:]])
        elif p[0] == "restored":
            out["restored"] = (float(p[2]), float(p[4]))
        elif p[0] == "scale":
            out["texts"].append(out["text"]); out["text"] = []
    return out


def pixels(path, w, h):
    return np.fromfile(path, dtype=np.uint8).reshape(h, w, 4)[:, :, [2, 1, 0]].astype(int)


tmp = tempfile.mkdtemp(prefix="hig_")
# a copy of the plugin with no picture folder beside it: the drawings and the message
bare = os.path.join(tmp, "bare", "Instrument-Creator.jsfx")
os.makedirs(os.path.dirname(bare)); shutil.copy(JSFX, bare)

# ---- 1. contrast: every string 7:1 on the pixels under it -----------------------------------
base = run(["frame=2", "focus", "audit"])
tiles = [f for f in base["focus"] if 10 <= f[0] < 40]
centres = ["mouse=%d,%d" % (f[1] + 0.75 * f[3], f[2] + 0.5 * f[4]) for f in tiles]
# the material names (their colour is the group's), hovered one by one
mats = [t for t in base["texts"][0] if abs(t[0] - 0x7F / 255) < 0.01 or abs(t[0] - 0x8E / 255) < 0.01]
states = {
    "default": (["frame=2", "audit"], 940, 720, 1, JSFX),
    "each tile hovered": (sum([[c, "audit"] for c in centres], ["frame"]), 940, 720, 1, JSFX),
    "each material hovered": (sum([["mouse=%d,%d" % (t[3] + 5, t[4] + 5), "audit"] for t in mats], ["frame"]), 940, 720, 1, JSFX),
    "More open, each control hovered": (["set=more_ctl,1", "frame=2"] + sum([["mouse=%d,%d" % (x, y), "audit"] for x, y in
                                        [(60, 70), (300, 70), (60, 125), (300, 125), (800, 125)]], []), 940, 720, 1, JSFX),
    "keyboard focus on a tile and a control": (["frame", "key=tab"] * 1 + ["key=tab"] * 4 + ["audit"] + ["key=tab"] * 9 + ["audit"], 940, 720, 1, JSFX),
    "Age 100%, playing": (["slider=23,100", "note", "set=aud_req,1", "frame=2", "audit"], 940, 720, 1, JSFX),
    "Surprise Me, twenty times": (["frame"] + sum([["mouse=%d,%d,1" % (650, 26), "mouse=%d,%d" % (650, 26), "audit"] for _ in range(20)], []), 940, 720, 1, JSFX),
    "every preset": (["frame"] + sum([["menu=%d" % (k + 1), "mouse=550,26,1", "mouse=550,26", "audit"] for k in range(19)], []), 940, 720, 1, JSFX),
    "800 x 480": (["frame=2", "audit", "set=more_ctl,1", "frame", "audit"], 800, 480, 1, JSFX),
    "every control at its widest value": (["slider=13,100", "slider=14,400", "slider=15,100", "slider=16,400", "slider=17,50",
                                           "slider=18,100", "slider=20,1000", "slider=21,-100", "slider=22,-36", "slider=23,100",
                                           "set=more_ctl,1", "frame=2", "audit"] + sum([["set=ui_zoom,%g" % z, "frame=2", "audit"] for z in (1.25, 1.5, 2)], []),
                                          940, 720, 1, JSFX),
    "every control at its widest value, 800 x 480": (["slider=15,100", "slider=13,100", "slider=21,-100", "slider=22,-36", "set=more_ctl,1", "frame=2", "audit"], 800, 480, 1, JSFX),
    "125%": (["set=ui_zoom,1.25", "frame=2", "audit"], 1175, 900, 1, JSFX),
    "150%": (["set=ui_zoom,1.5", "frame=2", "audit"], 1410, 1080, 1, JSFX),
    "200%": (["set=ui_zoom,2", "frame=2", "audit", "set=more_ctl,1", "frame", "audit"], 1880, 1440, 1, JSFX),
    "200% in the default window": (["set=ui_zoom,2", "frame=2", "audit"], 940, 720, 1, JSFX),
    "Retina": (["frame=2", "audit"], 1880, 1440, 2, JSFX),
    "no pictures (drawings and the message)": (["frame=2", "audit", "note", "frame", "audit"], 940, 720, 1, bare),
}
def overlaps(txt):
    """pairs of strings drawn on top of each other (a name running into its value)"""
    bad = []
    for i, a in enumerate(txt):
        for b in txt[i + 1:]:
            ox = min(a[3] + a[5], b[3] + b[5]) - max(a[3], b[3])
            oy = min(a[4] + a[6], b[4] + b[6]) - max(a[4], b[4])
            if ox > 1 and oy > 1:
                bad.append((a[3:7], b[3:7]))
    return bad


# names and values side by side only where they fit: every width from 960 to 1600
WIDEST = ["slider=13,100", "slider=14,400", "slider=15,100", "slider=16,400", "slider=17,50", "slider=18,100",
          "slider=20,1000", "slider=21,-100", "slider=22,-36", "slider=23,100", "set=more_ctl,1", "frame=2", "audit"]
for w in range(960, 1601, 40):
    states["widest values, %d x 720" % w] = (WIDEST, w, 720, 1, JSFX)
# 200% in windows too small for it: drawn at whatever size fits (final sweep)
for w in (900, 1000, 1105, 1300, 1500, 1700):
    states["200%% fitted to a %d x %d window, widest values" % (w, w * 3 // 4)] = (["set=ui_zoom,2"] + WIDEST, w, w * 3 // 4, 1, JSFX)

for name, (steps, w, h, sc, fx) in states.items():
    out = run(steps, w, h, sc, fx)
    worst = min(((t[7], t) for txt in out["texts"] for t in txt), default=(0, (0,) * 8))
    n = sum(len(t) for t in out["texts"])
    check(n > 20 and worst[0] >= MIN_CONTRAST, "contrast 7:1, %s (%d strings, lowest %.2f)" % (name, n, worst[0]),
          "text colour %.2f %.2f %.2f at %d,%d" % worst[1][:5])
    bad = [o for txt in out["texts"] for o in overlaps(txt)]
    check(not bad, "no words drawn over other words, %s" % name, str(bad[:2]))

# ---- 2. sizes and spacing, labels in full, at each interface size ------------------------------------
def layout_checks(name, out, w, h, S, fits=True):
    fs = out["focus"]
    short = [f for f in fs if f[4] < 28 * S - 0.5]
    check(not short, "controls at least 28 px tall, %s" % name, str(short[:3]))
    close = []
    for a in fs:
        for b in fs:
            if a is b:
                continue
            vo = min(a[2] + a[4], b[2] + b[4]) - max(a[2], b[2])
            ho = min(a[1] + a[3], b[1] + b[3]) - max(a[1], b[1])
            if vo > 0 and b[1] >= a[1] + a[3] - 0.5 and b[1] - (a[1] + a[3]) < 12 * S - 0.5:
                close.append((a[0], b[0], "side by side", round(b[1] - a[1] - a[3], 1)))
            if ho > 0 and b[2] >= a[2] + a[4] - 0.5 and b[2] - (a[2] + a[4]) < 12 * S - 0.5:
                close.append((a[0], b[0], "one above the other", round(b[2] - a[2] - a[4], 1)))
            if vo > 0.5 and ho > 0.5:
                close.append((a[0], b[0], "overlapping"))
    check(not close, "controls 12 px apart or more, %s" % name, str(close[:4]))
    texts = [t for txt in out["texts"] for t in txt]
    out_of_window = [t for t in texts if t[3] < -0.5 or t[3] + t[5] > w + 0.5]
    check(not out_of_window, "no words run off the window's side, %s" % name, str(out_of_window[:2]))
    cut = []
    for t in texts:
        for f in fs:
            if f[1] <= t[3] < f[1] + f[3] and f[2] <= t[4] < f[2] + f[4] and t[3] + t[5] > f[1] + f[3] + 0.5:
                cut.append((f[0], t[3:7]))
    check(not cut, "no name runs past the edge of its control, %s" % name, str(cut[:3]))
    if fits:
        below = [f for f in fs if f[2] + f[4] > h + 0.5]
        check(not below, "every control inside the window, %s" % name, str(below[:3]))


for name, w, h, sc, z, more in [("940 x 720", 940, 720, 1, 1, 0), ("940 x 720, More open", 940, 720, 1, 1, 1),
                                ("800 x 480", 800, 480, 1, 1, 1), ("125%", 1175, 900, 1, 1.25, 1),
                                ("150%", 1410, 1080, 1, 1.5, 1), ("200%", 1880, 1440, 1, 2, 1), ("Retina", 1880, 1440, 2, 1, 1)]:
    out = run(["set=ui_zoom,%g" % z, "set=more_ctl,%d" % more, "frame=2", "focus", "audit"], w, h, sc)
    layout_checks(name, out, w, h, sc * z)

# 200% in a window too small for it is drawn as large as the window holds
# (never below 100%), so everything is still inside it (final sweep)
for w, h, z, want in [(940, 720, 2, 1.175), (1880, 720, 2, 1.5), (1200, 900, 1.5, 1.5), (700, 420, 2, 1), (1300, 975, 2, 1.625)]:
    out = run(["set=ui_zoom,%g" % z, "set=more_ctl,1", "frame=2", "focus", "audit", "vars=gsc"], w, h)
    check(abs(out["var"]["gsc"] - want) < 0.001, "%d%% in a %d x %d window is drawn at %d%%" % (z * 100, w, h, want * 100), str(out["var"]["gsc"]))
    layout_checks("%d%% in a %d x %d window" % (z * 100, w, h), out, w, h, out["var"]["gsc"], fits=w >= 800)

# ---- 3. one scale: 200% is 100% doubled, and Retina is the same as 200% ---------------------------------
a = run(["frame=2", "focus", "audit"], 940, 720)
b = run(["set=ui_zoom,2", "frame=2", "focus", "audit"], 1880, 1440)
c = run(["frame=2", "focus", "audit"], 1880, 1440, 2)
same_ids = [f[0] for f in a["focus"]] == [f[0] for f in b["focus"]]
# the buttons are as wide as their labels, and text is measured by the font,
# which does not scale exactly, so they may be a few pixels out; nothing else
dev = max(abs(2 * fa[i] - fb[i]) for fa, fb in zip(a["focus"], b["focus"]) for i in range(1, 5) if fa[0] >= 10) if same_ids else 99
bdev = max(abs(2 * fa[i] - fb[i]) for fa, fb in zip(a["focus"], b["focus"]) for i in range(1, 5) if fa[0] < 10) if same_ids else 99
check(same_ids and dev <= 2, "every control and part at 200%% is its 100%% place and size doubled (largest difference %.1f px)" % dev)
check(same_ids and bdev <= 8, "the buttons too, give or take the font's own widths (largest difference %.1f px)" % bdev)
tdev = max(abs(2 * ta[i] - tb[i]) for ta, tb in zip(a["texts"][0], b["texts"][0]) for i in (3, 4)) if len(a["texts"][0]) == len(b["texts"][0]) else 99
check(tdev <= 6, "every string at 200%% is where its 100%% self is, doubled (largest difference %.1f px)" % tdev)
check(b["focus"] == c["focus"], "Retina draws exactly as 200% does")

# ---- 4. the keyboard ---------------------------------------------------------------------------------------------
ids = [f[0] for f in base["focus"]]
r = subprocess.run([HOST, JSFX, "940", "720", "frame"] + ["key=tab", "vars=focus_id"] * (len(ids) + 1), capture_output=True, text=True)
seq = [float(l.split()[2]) for l in r.stdout.splitlines() if l.startswith("var focus_id")]
check(seq == ids + ids[:1], "Tab visits every control once, in the order drawn, then starts again", "%s vs %s" % (seq, ids))
r = subprocess.run([HOST, JSFX, "940", "720", "frame"] + ["key=tab,shift", "vars=focus_id"] * len(ids), capture_output=True, text=True)
back = [float(l.split()[2]) for l in r.stdout.splitlines() if l.startswith("var focus_id")]
check(back == ids[::-1], "Shift+Tab goes back through them", str(back))
check(ids[:4] == [1, 2, 3, 4] and ids[4:12] == [40, 41, 42, 43, 44, 45, 50, 60] and ids[12:] == [10, 11, 12, 16, 14, 17, 18, 19, 20, 21],
      "reading order: the buttons, the controls and More, then the parts the way the diagram's arrows go", str(ids))


def tabs_to(fid, ids_=ids):
    return ["key=tab"] * (ids_.index(fid) + 1)


out = run(["frame"] + tabs_to(1) + ["key=esc", "vars=focus_id"])
check(out["var"]["focus_id"] == 0, "Esc lets go of the focus")
out = run(["frame"] + tabs_to(12) + ["mouse=300,500,1", "vars=focus_id"])
check(out["var"]["focus_id"] == 0, "a click takes over from the keyboard")
out = run(["frame", "menu=3"] + tabs_to(1) + ["key=ret", "frame", "vars=cur_preset"])
check(out["var"]["cur_preset"] == 2 and out["menu"], "Return on Presets opens the presets; choosing one applies it")
out = run(["frame", "menu=3"] + tabs_to(12) + ["key=space", "sliders"])
check(out["sliders"][2] == 2 and any("Made of" in m for m in out["menu"]), "Space on a part opens its menu, materials included; choosing Bar sets it")
r = subprocess.run([HOST, JSFX, "940", "720", "frame"] + tabs_to(10) + ["key=right", "sliders", "key=left", "key=left", "sliders"], capture_output=True, text=True)
sl = [l.split()[1:] for l in r.stdout.splitlines() if l.startswith("sliders")]
check(sl[0][0] == "1" and sl[1][0] == "5", "the arrow keys step a part's options, round the end", str([s[0] for s in sl]))
r = subprocess.run([HOST, JSFX, "940", "720", "frame"] + tabs_to(40) + ["key=right", "sliders", "key=right,shift", "sliders", "key=down", "key=down", "sliders", "key=del", "sliders", "key=up", "key=bs", "sliders"],
                   capture_output=True, text=True)
force = [float(l.split()[13]) for l in r.stdout.splitlines() if l.startswith("sliders")]
check(force == [72, 73, 69, 70, 70], "arrow keys move Force (Shift for small steps); Delete and Backspace reset it", str(force))
out = run(["frame"] + tabs_to(60) + ["key=ret", "frame", "focus", "vars=more_ctl"])
mids = [f[0] for f in out["focus"]]
check(out["var"]["more_ctl"] == 1 and mids[mids.index(60) + 1:mids.index(60) + 5] == [46, 47, 48, 49], "Return on More opens the second row, next in Tab's order", str(mids))
r = subprocess.run([HOST, JSFX, "940", "720", "set=more_ctl,1", "frame"] + ["key=tab"] * 13 + ["vars=focus_id", "key=ret", "sliders", "key=left", "sliders", "key=space", "sliders"], capture_output=True, text=True)
pm = [float(l.split()[19]) for l in r.stdout.splitlines() if l.startswith("sliders")]
check(pm == [1, 0, 1], "Return, Space and the arrows switch Play Mode", str(pm))
out = run(["frame"] + tabs_to(3) + ["key=ret", "frame", "vars=aud_on"])
check(out["var"]["aud_on"] == 1, "Return on Play C4 plays it")
out = run(["frame", "menu=4"] + tabs_to(4) + ["key=ret", "frame", "menu=5", "key=ret", "vars=ui_zoom,calm", "roundtrip"])
check(out["var"]["ui_zoom"] == 2 and out["var"]["calm"] == 1, "Options: Interface Size 200% and Reduce Motion, from the keyboard")
check(out["restored"] == (2.0, 1.0), "the interface size and Reduce Motion are saved with the project", str(out["restored"]))
out = run(["frame", "roundtrip"])
check(out["restored"] == (1.0, 0.0), "a fresh instance is 100% with motion on", str(out["restored"]))

# the ring: near-white, round the focused control, nowhere when nothing is focused
png1, png2 = os.path.join(tmp, "f1.bgra"), os.path.join(tmp, "f2.bgra")
t12 = [f for f in base["focus"] if f[0] == 12][0]
run(["frame"] + tabs_to(12) + ["frame", "png=" + png1, "key=esc", "frame", "png=" + png2])
p1, p2 = pixels(png1, 940, 720), pixels(png2, 940, 720)
x, y, w_, h_ = int(t12[1]), int(t12[2]), int(t12[3]), int(t12[4])
ring = np.array([0xF2, 0xF4, 0xF7])
edge1 = p1[y - 4:y - 2, x:x + w_].reshape(-1, 3)
edge2 = p2[y - 4:y - 2, x:x + w_].reshape(-1, 3)
check((edge1 == ring).all(axis=1).mean() > 0.95 and (edge2 == ring).all(axis=1).mean() < 0.05,
      "a near-white focus ring, two pixels, round the focused part; none without focus")

# ---- 5. not colour alone: what is chosen also has a bar ------------------------------------------------------------------
def bars(steps, fid, region):
    out = run(steps + ["focus", "set=hig_notext,1", "frame", "png=" + png1])
    f = [g for g in out["focus"] if g[0] == fid][0]
    p = pixels(png1, 940, 720)
    x0, x1 = int(f[1] + region[0] * f[3]), int(f[1] + region[1] * f[3])
    sub = p[int(f[2]):int(f[2] + f[4]), x0:x1].reshape(-1, 3)
    return int((sub.min(axis=1) > 220).sum())


poly_left, poly_right = bars(["set=more_ctl,1", "frame"], 46, (0, 0.5)), bars(["set=more_ctl,1", "frame"], 46, (0.5, 1))
mono_left, mono_right = bars(["set=more_ctl,1", "slider=19,1", "frame"], 46, (0, 0.5)), bars(["set=more_ctl,1", "slider=19,1", "frame"], 46, (0.5, 1))
check(poly_left > 10 and poly_right == 0 and mono_right > 10 and mono_left == 0,
      "Play Mode: the chosen half carries a bar as well as its colour", str((poly_left, poly_right, mono_left, mono_right)))
check(bars(["frame"], 3, (0, 1)) == 0 and bars(["set=aud_req,1", "frame"], 3, (0, 1)) > 10, "Playing… carries a bar as well as its colour")

# ---- 6. the controls and messages at the top, the message until dismissed ------------------------------------------------
top = [f for f in base["focus"] if f[0] < 10 or f[0] >= 40]
check(top and tiles and max(f[2] + f[4] for f in top) <= min(f[2] for f in tiles) and max(f[2] + f[4] for f in top) <= 0.25 * 720,
      "every button and control is in the top quarter of the window, above the diagram")
out = run(["frame=300", "vars=msg_on", "focus"], jsfx=bare)
fids = [f[0] for f in out["focus"]]
dis = [f for f in out["focus"] if f[0] == 5]
check(out["var"]["msg_on"] == 1 and dis and dis[0][2] < min(f[2] for f in out["focus"] if f[0] >= 40),
      "without the pictures a message says what to do, above the controls, and is still there 300 frames later")
r = subprocess.run([HOST, bare, "940", "720", "frame"] + ["key=tab"] * (fids.index(5) + 1) + ["key=ret", "frame=2", "vars=msg_on"], capture_output=True, text=True)
check("var msg_on 0" in r.stdout, "Dismiss, from the keyboard, takes it away")
out = run(["frame=2", "vars=msg_on"])
check(out["var"]["msg_on"] == 0, "no message when the pictures are there")

# ---- 7. Reduce Motion ------------------------------------------------------------------------------------------------------------
band = (int(min(f[2] for f in tiles)), int(max(f[2] + f[4] for f in tiles)))


def moves(fx, calm, steps=()):
    run(["set=calm,%d" % calm, "note"] + list(steps) + ["frame=2", "png=" + png1, "frame=3", "png=" + png2], jsfx=fx)
    a, b = pixels(png1, 940, 720)[band[0]:band[1]], pixels(png2, 940, 720)[band[0]:band[1]]
    return int((a != b).any(axis=2).sum())


m_draw, m_draw_calm = moves(bare, 0), moves(bare, 1)
check(m_draw > 50 and m_draw_calm == 0, "Reduce Motion stills the drawings (%d pixels moved without it, %d with)" % (m_draw, m_draw_calm))
out = run(["set=calm,1", "note", "frame=2", "set=hig_notext,1", "frame", "png=" + png1, "set=calm,0", "frame", "png=" + png2])
a, b = pixels(png1, 940, 720)[band[0]:band[1]], pixels(png2, 940, 720)[band[0]:band[1]]
check(int((a != b).any(axis=2).sum()) > 50, "without Reduce Motion the sounding element shakes; with it, it does not")

# ---- 8. type: the system font, nothing under 10 px, every word through say() -----------------------------------------------------
src = open(JSFX, encoding="utf-8").read()
gfx = src[src.index("@gfx"):]
sizes = re.findall(r"gfx_setfont\(\d+, #ui_font, ([\d.]+)\*gsc", gfx)
check(len(sizes) == 5 and min(float(s) for s in sizes) >= 10, "five fonts, all the system face, none under 10 px at 100%", str(sizes))
check(gfx.count('"Arial"') == 1 and "pick_font" in gfx, "Arial only as the fallback when neither Segoe UI nor San Francisco is there")
out = run(["frame", "vars=font_kind"])
check(out["var"]["font_kind"] == 3, "here (Linux, ysfx) neither system face is found, so Arial is used")
calls = [m.start() for m in re.finditer(r"gfx_drawstr\(", src)]
say = src.index("function say(")
check(len(calls) == 1 and say < calls[0] < say + 800, "every word is drawn through say(), so the audit sees it")

# ---- 9. the final sweep: edges, nothing cut short, a size that fits, an undo point ---------------------------
def lumi(p):
    c = np.asarray(p, dtype=float) / 255
    c = np.where(c <= 0.03928, c / 12.92, ((c + 0.055) / 1.055) ** 2.4)
    return 0.2126 * c[..., 0] + 0.7152 * c[..., 1] + 0.0722 * c[..., 2]


def ratio(a, b):
    la, lb = lumi(a), lumi(b)
    return (np.maximum(la, lb) + 0.05) / (np.minimum(la, lb) + 0.05)


def edges(name, steps, w, h, mouse=None):
    """every button, part, control cell and More: its right and bottom edges
    3:1 on the window just outside them"""
    out = run(steps + ["frame", "focus", "set=hig_notext,1"] + (["mouse=%d,%d" % mouse] if mouse else ["frame"]) + ["png=" + png1], w, h)
    p = pixels(png1, w, h)
    bad = []
    for f in out["focus"]:
        x, y, fw, fh = f[1:]
        xr, yb, xm, ym = int(x + fw), int(y + fh), int(x + fw / 2), int(y + fh / 2)
        right = max(ratio(p[ym, c], p[ym, xr + 5]) for c in range(xr - 3, xr + 2))
        bottom = max(ratio(p[rw, xm], p[yb + 5, xm]) for rw in range(yb - 3, yb + 2))
        if min(right, bottom) < 3:
            bad.append((f[0], round(float(right), 2), round(float(bottom), 2)))
    check(len(out["focus"]) > 20 and not bad, "every button, part and control has an edge 3:1 on the window, %s" % name, str(bad[:4]))


edges("940 x 720, More open", ["set=more_ctl,1"], 940, 720)
edges("940 x 720, a part hovered", [], 940, 720, (100, 200))
edges("200%", ["set=ui_zoom,2", "set=more_ctl,1"], 1880, 1440)


def inner_lines(fid, steps, half, hover):
    """the longest run of pixels 3:1 on the cell, in one row of the lower part of
    a control cell (half: 0 the whole cell, 2 its right half), as a share of the width"""
    out = run(steps + ["set=more_ctl,1", "frame", "focus"])
    f = [g for g in out["focus"] if g[0] == fid][0]
    x, y, fw, fh = f[1:]
    out = run(steps + ["set=more_ctl,1", "frame", "set=hig_notext,1"] + (["mouse=%d,%d" % (x + fw / 2, y + 0.3 * fh)] if hover else ["frame"]) + ["png=" + png1])
    p = pixels(png1, 940, 720)
    fill = p[int(y + 0.3 * fh), int(x + 0.5 * fw)]
    x0 = int(x + (0.5 * fw if half == 2 else 8)); x1 = int(x + fw - 8)
    best = 0
    for rw in range(int(y + 0.5 * fh), int(y + fh - 2)):
        best = max(best, float((ratio(p[rw, x0:x1], fill) >= 3).mean()))
    return best


for hv in (0, 1):
    tr = inner_lines(40, ["slider=13,0"], 0, hv)
    check(tr > 0.35, "a slider's track at its lowest still shows, 3:1 on the cell%s (%.0f%% of a row)" % (", hovered" if hv else "", 100 * tr))
    sw = inner_lines(46, ["slider=19,0"], 2, hv)
    check(sw > 0.6, "Play Mode's unchosen half shows its edge, 3:1 on the cell%s (%.0f%% of a row)" % (", hovered" if hv else "", 100 * sw))

# the diagram's arrows grow with the interface size
def arrow_rows(z, w, h):
    out = run(["set=ui_zoom,%g" % z, "frame", "focus", "set=hig_notext,1", "frame", "png=" + png1], w, h)
    a, b = [g for g in out["focus"] if g[0] == 10][0], [g for g in out["focus"] if g[0] == 11][0]
    p = pixels(png1, w, h)
    xc, yc = int(0.5 * (a[1] + a[3] + b[1])), int(a[2] + 0.45 * a[4])
    return int((ratio(p[yc - 12:yc + 12, xc], p[yc - 20, xc]) >= 3).sum())


a1, a2 = arrow_rows(1, 940, 720), arrow_rows(2, 1880, 1440)
check(a1 >= 2 and a2 >= 2 * a1, "the diagram's arrows are 3:1 on the window and twice as thick at 200%% (%d and %d px)" % (a1, a2))

# nothing cut short: no "…" but Playing…, and no line of a description dropped
words = re.findall(r'"([^"\n]*)"', gfx)
check([w_ for w_ in words if "…" in w_] == ["Playing…", "Playing…"], "no words are cut short with an ellipsis (only Playing…, which is not cut)",
      str([w_ for w_ in words if "…" in w_]))
cnt = [6, 6, 6, 31, 5, 31, 4, 4, 5, 4, 5, 5]
steps, n = ["set=more_ctl,1", "frame"], 0
for c, k in enumerate(cnt):
    for v in range(k):
        steps += ["slider=%d,%d" % (c + 1, v)] + (["set=focus_id,0", "set=last_cat,%d" % c] if c in (3, 5) else ["set=focus_id,%d" % (10 + c)]) + ["frame", "vars=wrap_cut"]
        n += 1
for k in range(11):
    steps += ["set=focus_id,%d" % (40 + k), "frame", "vars=wrap_cut"]; n += 1
for w, h, z in [(940, 720, 1), (860, 560, 1), (940, 720, 2), (1880, 1440, 2)]:
    r = subprocess.run([HOST, JSFX, str(w), str(h), "set=ui_zoom,%g" % z] + steps, capture_output=True, text=True)
    cut = [float(l.split()[2]) for l in r.stdout.splitlines() if l.startswith("var wrap_cut")]
    check(len(cut) == n and not any(cut), "every part's and control's description shown whole in the close-up, %d%% in %d x %d" % (z * 100, w, h),
          "%d of %d cut" % (sum(1 for c in cut if c), len(cut)))

# Options says when the size chosen is more than the window holds
def options_menu(w, h):
    f = [g for g in run(["set=ui_zoom,2", "frame", "focus"], w, h)["focus"] if g[0] == 4][0]
    at = "%d,%d" % (f[1] + f[3] / 2, f[2] + f[4] / 2)
    return run(["set=ui_zoom,2", "frame", "menu=0", "mouse=%s,1" % at, "mouse=" + at], w, h)


out, out2 = options_menu(940, 720), options_menu(1880, 1440)
check(any("#Shown at 118% Until the Window Is Larger" in m for m in out["menu"]) and out2["menu"] and not any("Shown at" in m for m in out2["menu"]),
      "Options says 200% is shown at 118% in a 940 x 720 window, and nothing when it fits", str(out["menu"]) + str(out2["menu"]))

# a preset and Surprise Me add an undo point before they change anything, and one after
out = run(["frame", "menu=3"] + tabs_to(1) + ["key=ret", "frame", "frame"])
u = out["undo"]
check(len(u) == 2 and u[0][:12] == [0, 0, 5, 12, 0, 12, 2, 0, 1, 2, 0, 0] and u[1][:12] == [4, 5, 2, 8, 2, 8, 0, 1, 4, 2, 0, 1]
      and any("#Edit → Undo Puts Your Instrument Back" in m for m in out["menu"]),
      "choosing a preset adds an undo point before the change and another after; the menu says so", str(u))
out = run(["frame", "mouse=650,26,1", "mouse=650,26", "frame"])
u = out["undo"]
check(len(u) == 2 and u[0][:12] == [0, 0, 5, 12, 0, 12, 2, 0, 1, 2, 0, 0] and u[1][:12] != u[0][:12],
      "Surprise Me adds an undo point before the change and another after", str(u))
out = run(["frame"] + tabs_to(10) + ["key=right", "frame", "mouse=60,70,1", "mouse=80,70,1", "mouse=80,70", "frame"])
check(not out["undo"], "a single part or control changed adds no extra undo point (REAPER's own covers it)", str(len(out["undo"])))

shutil.rmtree(tmp)
print("\n%d check(s) failed" % len(fails) if fails else "\nall checks passed")
sys.exit(1 if fails else 0)

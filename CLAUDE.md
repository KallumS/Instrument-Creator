# CLAUDE.md

Working notes for Instrument Creator: a JSFX instrument for REAPER that
assembles a playable instrument from ten kinds of part and two materials (31
to choose from), with an Age / rust control that wears it out. The user is
not a programmer: explain results in plain language and keep `README.md`
readable for them. The repository was created as Wind-Instrument-Creator and
is being renamed Instrument-Creator.

REAPER's JSFX reference is at https://www.reaper.fm/sdk/js/ (the user
supplied a copy in session 1; the useful parts are in SESSION-LOG §17).

Sibling projects this builds on (read-only references, clone them anonymously
if needed): Trombolese (the lip valve, air-column physics, measurement
discipline) and Reverberator (material tables, loop tuning, the ysfx test rig,
EEL2 traps).

Where things are documented:

- `README.md`: for the user. Install, the window, every part, materials,
  Age, presets, MIDI.
- `docs/PARTS-AND-MATERIALS.md`: the technical reference, written for
  agents: every model's equations as implemented (with function and constant
  names), the material table and derived values, pitch corrections, the
  validation summary, known deviations and vestigial code. Keep it in step
  with the code; it is the single source for numbers (the README only
  describes).
- `docs/adr/`: one record per design decision (index in its README). Read the
  relevant one before changing a rule below; add a new record for a new rule.
- `docs/SESSION-LOG.md`: how it was built, with measurements and dead ends,
  and the open items. Check it before re-measuring or re-trying something;
  append to it for substantial work.
- This file: the traps.

## Layout

```
Instrument-Creator.jsfx   the instrument: sliders, physics, voices, GUI (@gfx)
Instrument-Creator-images/  the part pictures (3D renders, ADR 0020), installed beside the .jsfx
blender/                  the models as .blend files for the user (render_parts.py --blend); not the source
docs/window.png           screenshot used by the README (tools/shot.py)
tools/build_host.sh       builds ysfx (with graphics) and four hosts into tools/build/
tools/render.cpp          MIDI events file -> raw float32 stereo
tools/shot.cpp            screenshot of @gfx (plays a note first); tools/shot.py -> PNG; SHOT_SCALE=2 for Retina
tools/render_parts.py     Blender (pip install bpy): models every part, renders Instrument-Creator-images/
tools/click.cpp           drive @gfx with a mouse script; prints sliders 1-23 and automation flags; CLICK_MENU=n picks menu item n
tools/inspect.cpp         dump plugin memory after N blocks of a held note
tools/analyse.py          render/measure helpers (LUFS, YIN pitch), the part and material name lists
tools/sweep.py            every energy x exciter x element: level, pitch, flags
tools/range.py            one combination across the keyboard (pitch, level)
tools/probe.py            one note: level over time, pitch, strongest partials
tools/check.py            stability sweep (age 0/100, 3 sample rates, extremes, every part and material)
tools/trims.py            loudness trims; tools/apply_trims.py adds them to the plugin
tools/age_test.py         what Age does to every preset (level, ring, brightness, tuning)
tools/spectrograms.py     spectrogram grid of the presets
```

Python tools need numpy, scipy, matplotlib (`pip install numpy scipy
matplotlib`). `tools/build/` is git-ignored.

## Sliders (1-based, as the tools take them: `3=2` means element = Bar)

```
1 energy source  2 exciter  3 vibrating element  4 element material  5 resonator
6 resonator material  7 coupler  8 radiator  9 frequency control  10 tuning
11 damping  12 modulation   (1-12 hidden; tile(c) in the window shows slider c + 1)
13 force  14 size  15 brightness  16 decay  17 excite position  18 resonator amount
19 play mode  20 glide time  21 fine tune  22 output  23 age / rust
```

All 23 are hidden from REAPER's slider list (`-` before the name) and drawn
in the window: 13-23 as the control strip (`control()`, ADR 0019; one row
and More, ADR 0021), whose
ranges, defaults and log midpoints are repeated in `ctl_min/max/def/mid`;
change both.

Option lists are append-only (ADR 0014): add new options and materials at the
end, never reorder. Presets set sliders 1-19 and never touch Age.

## Commands

```bash
tools/build_host.sh                          # ~1 min, needs cmake, g++, freetype, fontconfig
python3 tools/range.py 1=0 2=0 3=5           # one combination across the keyboard
python3 tools/sweep.py 60 > sweep.txt        # ~2 min; grep QUIET|TAIL|PITCH
python3 tools/trims.py > t.txt && python3 tools/apply_trims.py t.txt   # repeat until ~0
python3 tools/check.py                        # ~40 min: run in the background; must say 0 failure(s)
python3 tools/age_test.py                     # ~10 min
python3 tools/shot.py out.png 940 720 mx my 3=2 4=8   # then look at the PNG
SHOT_SCALE=2 python3 tools/shot.py out.png 1880 1440   # as on the user's Retina Mac
python3 tools/render_parts.py --out /tmp/x --samples 16 --mats 12 2_0   # draft one shape; no args = all (~35 min)
tools/build/click Instrument-Creator.jsfx - 940 720 85,699,0 85,699,1 40,699,1 40,699,0   # drag Force
CLICK_MENU=12 tools/build/click Instrument-Creator.jsfx - 940 720 700,140,0 700,140,1 700,140,0   # element menu: Made of > Glass
SHOT_CLICK=1 python3 tools/shot.py out.png 940 720 890 690   # click once (here: More) before the screenshot
```

## EEL2 traps (Reverberator ADR 0010, and new ones)

- **Identifiers are case-insensitive.** Memory-map constants have long names
  (`VOICE_BASE`, `LINE_BASE`); voice fields are `V_*`. Never let two names
  differ only in case.
- **No scientific notation.** Write decimals, or `200*10^9`.
- **Functions are inlined and must be defined before they are used**, and
  globals are shared: declare `local()` for everything a function uses as
  scratch.
- **`@gfx` runs in its own thread, at the same time as `@sample`.** The audio
  code and the window code must not assign the same global. Only two flags
  are shared, deliberately: `aud_req` (Play button) and `gui_dirty` (the
  window changed a slider), each set by the window and cleared in `@block`.
  A shared loop counter would corrupt the audio loop while the window is open.
- **`gfx_triangle` fills convex polygons only.** Split concave shapes.
- **`gfx_roundrect` has no fill**; `grrf` draws a filled one.
- **`gfx_loadimg(slot, "dir/f.png")`** looks beside the .jsfx, then in
  REAPER's Data folder; 128 slots, ≤ 2048 px. `gfx_setimgdim` leaves the
  contents undefined: fill it with a blit in `gfx_mode = 2` (copies alpha too).
  Never load in a loop that runs every frame without remembering failures.
- **Strings**: `#name` are global string slots; `strcpy`/`strcat`/`sprintf`
  build menus. `gfx_showmenu` items are 1-based, `!` checks an item.
- Compiling is not evidence. Render it and measure, or screenshot it and look.

## Design rules (each has an ADR)

- **The exciter and the element are the only feedback loop** (ADR 0007).
  Everything after the element is linear and feed-forward, summed across
  voices; rattle and crackle read the element's output, never feed back.
- **Sustaining exciters are reflection functions** (ADR 0005): `e = f(P, c)`,
  added to the outgoing wave, passive when P = 0. Anything that multiplies `e`
  by more than 1 must fade to exactly 1 as the drive fades (the banded
  waveguides' extra grip does, ADR 0006), or released notes self-oscillate.
- **Loss filters are fitted at the fundamental and one high frequency**
  (`op_fit2`, ADR 0008), with the implied DC gain capped below 1 and the pole
  ≤ 0.95. Frequency-dependent effects (tone holes, damping, brightness, age)
  change the target T60s; never add a filter to a loop.
- **Tune loops by phase** at the current frequency (loss filter, dispersion,
  in-loop DC blocker all included), every 16 samples (ADR 0009).
- **Dispersion has a budget** (≤ 40 % of the loop phase at the fundamental),
  none on bowed strings, and bow force follows Schelleng (ADR 0010).
- **Pitch pull is measured, then removed** (ADR 0009): the corrections in
  `voice_start` came from `range.py`. Change an exciter's constants and they
  are stale.
- **Any sound change moves loudness** (ADR 0011): re-run `trims.py` +
  `apply_trims.py` until the corrections are ~0 (usually three passes).
  Materials are not trimmed.
- **Playable beats exact** for extreme materials (ADR 0015): record the real
  value next to the one used.
- **Age scales existing physics** (ADR 0018); a new age effect should do the
  same, and its make-up gain applies to strikes, plucks and bows only.
- **Pictures are renders, drawings are the fallback** (ADR 0020). A new
  option or material needs a builder in `tools/render_parts.py` (rendered in
  every material if its part has one) and a drawing in `draw_part()`. Shapes
  are framed per shape, not per material, so a shape's versions and its rust
  layer line up: never frame on something that changes with the material.

## Memory map (keep regions disjoint; check this when adding a table, ADR 0014)

```
0      voices (8 x 512)            4600  Bessel zeros     4700 bar   4720 cantilever   4750 plate (60)
5000   body modes (24 x 8)         5300  head modes       5500 note stack   5600/5700 biquads
5900   diffusion lengths/pointers  6400  trims (72)       6480 part trims (13)
11000  scope (2048)                13100 presets (19 x 20)   13600 materials (31 x 16)
14200  picture cache (12 x 8, window only; image slots 10-105)
16384  diffusers (8 x 8192)        82000 MIDI queue (1000 x 4)
131072 delay lines (8 voices x 4 x 16384)
```

Inside a voice: fields `V_*` 0-101, modes from `MODE_OFF` = 160 (24 x 8).
Banded-waveguide descriptors live in the voice's line B, their delays in
line A.

## Measurement traps

- **`apply_trims.py` once replaced an empty string**, which inserts text
  between every character of the plugin. It now substitutes between the
  `//TRIMS_BEGIN` / `//TRIMS_END` markers only. Commit before running tools
  that rewrite the plugin.
- **YIN's pitch is meaningless for inharmonic elements** (plates, membranes,
  stiff strings, repeated strikes, tines): judge those by their partials
  (`probe.py`). It also reads odd-harmonic sounds an octave low.
- **A "quiet" element may be quiet for a reason you can see in the mode
  shapes**: the bar's first radiation point sat on a node, the plate's strike
  point favoured mode (2,2). Look at the weights before adding gain.
- A waveguide dying far too fast was the tone-hole filter applied on every
  pass, not the string. Suspect whatever is in the loop.
- **After a parameter search, restore the winner.** The bowed air column
  shipped silent because a loop-configuration search ended on the losing
  setting. And after editing a constant with sed, grep it: a replace that
  missed left `BOW_FEXP` undefined (zero) and two searches measured nothing.
- **`sleep` does not wait in this container** (a 10-minute loop returned in
  14 s). To wait for a long job, run it in the background and use the Monitor
  tool (or a background command) to be notified when it prints its result.
- `pkill -f <pattern>` matches its own shell. Never pipe a long script to `head`.

## Known limitations

- A reed on a cone (sax) does not oscillate in the reflection form, so the
  reed always plays a cylinder; the Bore resonator adds the even harmonics
  (ADR 0017).
- The most lossless steels (steel, chain link, handpan steel) bowed at
  exactly 1/5 or 1/3 of the string can flip to the octave.
- Lips on a membrane: bone 57 c flat, jelly 26 c sharp; the rest within 25 c.
- Lips driven by a single push sag in pitch as the push fades (the pull
  depends on pressure).
- Rubber, paper, cardboard, leather, jelly, PVC and cling film are less lossy
  than the real materials, so that they can be played.
- First check in REAPER (macOS, Retina): the window renders as in ysfx.
  REAPER draws any visible slider above `@gfx` and takes that height from the
  window, which is why every slider is now hidden (ADR 0019). The layout
  still fits any height (it reserves the preview panel first). Menus,
  clicking, dragging and automation in REAPER are not yet confirmed (they
  are tested in ysfx with `tools/click.cpp`).
- The 3D pictures (ADR 0020) load in ysfx from the folder beside the .jsfx;
  not yet seen in REAPER. Without the folder the window shows the drawings.

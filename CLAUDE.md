# CLAUDE.md

Working notes for Instrument Creator: a JSFX instrument for REAPER that
assembles a playable instrument from ten kinds of part and two materials. The
user is not a programmer: explain results in plain language and keep
`README.md` readable for them. The repository was created as
Wind-Instrument-Creator and is being renamed Instrument-Creator.

Sibling projects this builds on (read-only references): Trombolese (the lip
valve, air-column physics, measurement discipline) and Reverberator (material
tables, loop tuning, the ysfx test rig, EEL2 traps).

Where things are documented:

- `README.md`: for the user. Install, the window, every part, presets, MIDI.
- `docs/PARTS.md`: the physics and numbers of every part, and the measured
  pitch corrections.
- `docs/SESSION-LOG.md`: how it was built, with measurements and dead ends.
  Check it before re-measuring or re-trying something.
- This file: the traps.

## Layout

```
Instrument-Creator.jsfx   the instrument: sliders, physics, voices, GUI (@gfx)
tools/build_host.sh       builds ysfx (with graphics) and three hosts into tools/build/
tools/render.cpp          MIDI events file -> raw float32 stereo
tools/shot.cpp            screenshot of @gfx (plays a note first); tools/shot.py -> PNG
tools/inspect.cpp         dump plugin memory after N blocks of a held note
tools/analyse.py          render/measure helpers (LUFS, YIN pitch), the part name lists
tools/sweep.py            every energy x exciter x element: level, pitch, flags
tools/range.py            one combination across the keyboard (pitch, level)
tools/probe.py            one note: level over time, pitch, strongest partials
tools/check.py            stability sweep (3 sample rates, extremes, every part)
tools/trims.py            loudness trims; tools/apply_trims.py adds them to the plugin
tools/spectrograms.py     spectrogram grid of the presets
```

Python tools need numpy, scipy, matplotlib. `tools/build/` is git-ignored.

## Commands

```bash
tools/build_host.sh                          # ~1 min, needs cmake, g++, freetype, fontconfig
python3 tools/range.py 1=0 2=0 3=5           # sliders are 1-based: 1 energy, 2 exciter, 3 element...
python3 tools/sweep.py 60 > sweep.txt        # ~2 min; grep QUIET|TAIL|PITCH
python3 tools/trims.py > t.txt && python3 tools/apply_trims.py t.txt   # repeat until ~0
python3 tools/check.py                        # ~15 min, run in the background; must say 0 failure(s)
python3 tools/shot.py out.png 940 640 mx my 3=2 4=8   # then look at the PNG
```

## EEL2 traps (Reverberator ADR 0010, and new ones)

- **Identifiers are case-insensitive.** Memory-map constants have long names
  (`VOICE_BASE`, `LINE_BASE`); voice fields are `V_*`. Never let two names
  differ only in case.
- **No scientific notation.** Write decimals, or `200*10^9`.
- **Functions are inlined and must be defined before they are used**, and
  globals are shared: declare `local()` for everything a function uses as
  scratch. A function called from `@gfx` and `@sample` must not share
  scratch globals.
- **`gfx_triangle` fills convex polygons only.** Split concave shapes.
- **`gfx_roundrect` has no fill**; `grrf` draws a filled one.
- **Strings**: `#name` are global string slots; `strcpy`/`strcat`/`sprintf`
  build menus. `gfx_showmenu` items are 1-based, `!` checks an item.
- Compiling is not evidence. Render it and measure, or screenshot it and look.

## Design rules

- **The exciter and the element are the only feedback loop.** Everything
  after the element (resonator, coupler, body, radiator) is linear and
  feed-forward, summed across voices (Reverberator ADR 0008).
- **Sustaining exciters are reflection functions**: `e = f(P, c)`, returned
  as what is added to the outgoing wave, and passive when P = 0. Anything that
  multiplies `e` by more than 1 must fade to exactly 1 as the drive fades (the
  banded waveguides' extra grip does), or released notes self-oscillate.
- **Loss filters are fitted at the fundamental and one high frequency**
  (`op_fit2`), with the implied DC gain capped below 1 and the pole ≤ 0.95.
  Fitting at DC (Reverberator's `op_fit`) let a strong high-frequency loss eat
  the note itself.
- **Tune loops by phase** at the current frequency (loss filter, dispersion,
  in-loop DC blocker all included), every 16 samples, so bends and glides stay
  in tune.
- **Dispersion has a budget**: the stiffness allpasses may take at most 40 %
  of the loop phase at the fundamental. And none on bowed strings.
- **Pitch pull is measured, then removed** (the Trombolese way): lips, jets
  and bows move the pitch; the corrections in `voice_start` came from
  `range.py`. Change an exciter's constants and the corrections are stale.
- **Any sound change moves loudness**: re-run `trims.py` + `apply_trims.py`
  until the corrections are ~0 (usually three passes).

## Measurement traps

- **`apply_trims.py` once replaced an empty string**, which inserts text
  between every character of the plugin. It now substitutes between the
  `//TRIMS_BEGIN` / `//TRIMS_END` markers only. Commit before running tools
  that rewrite the plugin.
- **YIN's pitch is meaningless for inharmonic elements** (plates, membranes,
  stiff strings, repeated strikes): judge those by their partials (`probe.py`).
- **A "quiet" element may be quiet for a reason you can see in the mode
  shapes**: the bar's first radiation point sat on a node, the plate's strike
  point favoured mode (2,2). Look at the weights before adding gain.
- A waveguide dying far too fast was the tone-hole filter applied on every
  pass, not the string. Suspect whatever is in the loop.
- `pkill -f <pattern>` matches its own shell. Never pipe a long script to `head`.

## Known limitations

- A reed on a cone (sax) does not oscillate in the reflection form, so the
  reed always plays a cylinder; the Bore resonator adds the even harmonics.
- Lips driven by a single push sag in pitch as the push fades (the pull
  depends on pressure).
- ysfx is not REAPER: the GUI, menus and automation are untested in REAPER.

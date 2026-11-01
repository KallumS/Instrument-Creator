# CLAUDE.md

**Branches.** `main` is the REAPER version only. `plugin` (this branch) adds
the VST3 and CLAP plugins on top of it. Work on the REAPER version goes on `main` and is merged
into `plugin` (`git merge main`); `plugin` is never merged into `main`, so the
REAPER version never carries the build files, workflows or plugin-only code.

Working notes for Instrument Creator: a JSFX instrument for REAPER that
assembles a playable instrument from ten kinds of part and two materials (31
to choose from), with an Age / rust control that wears it out, and a window
that draws the whole instrument as one line drawing, rebuilt from the parts
chosen (ADR 0024). The user is not a programmer: explain
results in plain language and keep `README.md` readable for them. The
repository is `KallumS/Instrument-Creator` (it began as
Wind-Instrument-Creator); the user's original brief is
`docs/Instrument Creator 011026.odt`.

**Starting a session:** read this file, then the end of `docs/SESSION-LOG.md`
("Where things stand" and "Handover to the next session"). A fresh container
needs `pip install numpy scipy matplotlib` and `tools/build_host.sh` (the 3D
renders, set aside, also need `pip install bpy imagequant`).

The window follows Apple's HIG as the user's family of apps applies it: the
shared review is in the Good Idea repo (`KallumS/Good-Idea`,
`docs/apple-hig-review.md`, read-only, clone anonymously); this repo's own
verdicts are `docs/apple-hig-review.md` and ADRs 0022-0024. Good Idea's house
colour scheme (`docs/COLOUR.md` there) is not used here: this window keeps
its own palette.

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
blender/                  the 3D models as .blend files (render_parts.py --blend); set aside with the renders (ADR 0024)
docs/window.png           screenshot used by the README (tools/shot.py)
tools/build_host.sh       builds ysfx (with graphics, two key fixes) and five hosts into tools/build/
tools/render.cpp          MIDI events file -> raw float32 stereo
tools/shot.cpp            screenshot of @gfx (plays a note first); tools/shot.py -> PNG; SHOT_SCALE=2 for Retina
tools/render_parts.py     Blender (pip install bpy): the 3D renders, set aside (ADR 0024); the folder it wrote is in git history
tools/click.cpp           drive @gfx with a mouse script; prints sliders 1-23 and automation flags; CLICK_MENU=n picks menu item n
tools/hig.cpp             drive @gfx with keys and the mouse; prints the focus list, variables, the parts' boxes and labels (cats), and each string's contrast on the pixels under it
tools/hig_check.py        the window against Apple's HIG Foundations (ADR 0023, 0024): 361 checks, under a minute; must say "all checks passed"
tools/hig_bite.py         breaks each HIG rule in a temporary copy and checks hig_check.py fails (60 cases, ~15 min; all must say BIT; give words to run some)
tools/inspect.cpp         dump plugin memory after N blocks of a held note
tools/analyse.py          render/measure helpers (LUFS, YIN pitch), the part and material name lists
tools/sweep.py            every energy x exciter x element: level, pitch, flags
tools/range.py            one combination across the keyboard (pitch, level)
tools/probe.py            one note: level over time, pitch, strongest partials
tools/check.py            stability sweep (age 0/100, 3 sample rates, extremes, every part and material)
tools/trims.py            loudness trims; tools/apply_trims.py adds them to the plugin
tools/age_test.py         what Age does to every preset (level, ring, brightness, tuning)
tools/spectrograms.py     spectrogram grid of the presets
plugin/                   the VST3/CLAP plugin: the .jsfx in a JUCE wrapper run by ysfx (ADR 0025)
.github/workflows/plugin.yml   builds, validates and zips the plugins on a Mac runner
```

Python tools need numpy, scipy, matplotlib (`pip install numpy scipy
matplotlib`). `tools/build/` is git-ignored.

## Sliders (1-based, as the tools take them: `3=2` means element = Bar)

```
1 energy source  2 exciter  3 vibrating element  4 element material  5 resonator
6 resonator material  7 coupler  8 radiator  9 frequency control  10 tuning
11 damping  12 modulation   (1-12 hidden; label(c) and the picker in the window show slider c + 1)
13 force  14 size  15 brightness  16 decay  17 excite position  18 resonator amount
19 play mode  20 glide time  21 fine tune  22 output  23 age / rust
```

All 23 are hidden from REAPER's slider list (`-` before the name) and drawn
in the window: 13-23 as the control strip (`control()`, ADR 0019; one row
and More, ADR 0021; at the top, wrapping as needed, ADR 0023), whose
ranges, defaults and log midpoints are repeated in `ctl_min/max/def/mid`;
change both.

Option lists are append-only (ADR 0014): add new options and materials at the
end, never reorder. Sliders are append-only too: the plugin's parameter IDs
are `slider<n>` (ADR 0025). Presets set sliders 1-19 and never touch Age.

## Commands

```bash
tools/build_host.sh                          # ~1 min, needs cmake, g++, freetype, fontconfig
plugin/build.sh                              # VST3 + CLAP into plugin/out (~10 min first time)
EXTRA_TARGETS=jsfx_state_check plugin/build.sh && plugin/build/jsfx_state_check   # makes sound; saved state round-trips
python3 tools/range.py 1=0 2=0 3=5           # one combination across the keyboard
python3 tools/sweep.py 60 > sweep.txt        # ~2 min; grep QUIET|TAIL|PITCH
python3 tools/trims.py > t.txt && python3 tools/apply_trims.py t.txt   # repeat until ~0
python3 tools/check.py                        # ~40 min: run in the background; must say 0 failure(s)
python3 tools/age_test.py                     # ~10 min
python3 tools/shot.py out.png 940 720 mx my 3=2 4=8   # then look at the PNG
SHOT_SCALE=2 python3 tools/shot.py out.png 1880 1440   # as on the user's Retina Mac
tools/build/click Instrument-Creator.jsfx - 940 720 55,83,0 55,83,1 30,83,1 30,83,0   # drag Force
tools/build/click Instrument-Creator.jsfx - 940 720 410,510,0 410,510,1 410,510,0 414,276,0 414,276,1 414,276,0   # element's label, then Membrane in its picker
CLICK_MENU=6 tools/build/click Instrument-Creator.jsfx - 940 720 410,510,0 410,510,1 410,510,0 329,452,0 329,452,1 329,452,0   # element's picker: Made of > Glass
SHOT_CLICK=1 python3 tools/shot.py out.png 940 720 890 73   # click once (here: More) before the screenshot
python3 tools/hig_check.py                    # under a minute: contrast, edges, sizes, keyboard, the picker, Reduce Motion, undo, saving; must pass
tools/build/hig Instrument-Creator.jsfx 940 720 frame key=tab key=tab key=ret vars=focus_id png=o.bgra   # drive with keys
tools/build/hig Instrument-Creator.jsfx 940 720 frame set=pop_c,2 frame focus cats   # open the element's picker; where everything is
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
- **Named keys are big-endian multi-character constants**: `key == 'left'`,
  `'rght'`, `'up'`, `'down'`, `'del'` (REAPER's `gfx_getchar`). ysfx packed
  them the other way round and reported Shift only while a mouse button was
  down; `tools/build_host.sh` patches both in its clone so the hosts behave
  as REAPER does. A rebuilt `tools/build/` without those patches makes the
  keyboard checks fail.
- **`gfx_getchar()` is called once a frame** (into `key`); controls take the
  keys they use and set `key = 0`. Do not call it again elsewhere, or keys
  are lost. `options:want_all_kb` is deliberately not set: this is a played
  instrument, and REAPER may keep Space and others for itself.
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
- **The instrument is one line drawing** (ADR 0024), built by `wf_build`
  from the twelve choices into segments in a 900 x 360 space (y down) and
  drawn by `wf_draw`. A new option needs a builder in its `wf_*` function
  for both builds (`md` 0, in a line: a mouthpiece or windway; 1, in layers:
  a bridge or soundpost), using the pen (`wf_mv`/`wf_to`, `wf_box`,
  `wf_tube`, `wf_arc`, `wf_lineh` for hidden edges) and leaving `el_*` or
  `rz_*` set for the parts that join it. Then look at it in both builds, in
  the picker, and check `WX0..WY1` still hold it (they are the area 20,000
  random instruments reach). The drawing is rebuilt only when a part changes
  (`WF_LAST`); it is window-only memory, never touched by the audio.
- **Text follows Apple's writing guidelines** (ADR 0022): title-style part,
  material, control and slider names; sentence-case descriptions and hints;
  "…", curly quotes, em dashes. Rename a label, never reorder a list. Text
  beyond ASCII is UTF-8 and `str_getchar` reads its bytes as negative, so
  copy text with `strcpy_substr`, not `sprintf("%c")`; screenshot after.
- **The window meets Apple's HIG Foundations** (ADR 0023,
  `docs/apple-hig-review.md`). Rules for new window code, each checked by
  `tools/hig_check.py`:
  - **every size through `gsc`** (Retina × the interface size); a bare
    pixel count does not grow at 200%;
  - **every word through `say()`** (never `gfx_drawstr`), in a colour at
    least 7:1 on what it sits on: `T_MAIN`, `T_BODY`, `T_DIM` (#B0B6C0, on
    the window and the close-up only, not on the picker), `T_LABEL` (on
    labels, cells and the picker, hovered too), `T_HINT`, `T_AGE`,
    `T_ELEM`/`T_RES`. Not the house red, not a group colour as it stands;
  - **every control registers with `focusable(id, x, y, w, h)`** where it is
    drawn (Tab goes in drawing order), answers `activated(id)` (Return or
    Space) and the keys it uses, and is at least 28 px tall and 12 apart;
  - **nothing important at the bottom**: buttons and controls go at the top;
    a message, if one is ever needed again, goes in a bar under the header
    and stays until *Dismiss* (there is none now: the only one said the
    pictures were missing);
  - **the picker is modal** (ADR 0024): while `pop_c >= 0`, `ui_block` keeps
    the click, the wheel and `focusable` (ids under 70) from everything else;
    the picker's controls are ids 70 and up and use `pinbox`/`pclick`. It is
    a raised surface (`C_POP`, lighter than the window), so edges inside it
    use `C_TRACK` (3:1 on it), and `hig_forget` drops the strings it covers
    from the test audit;
  - **a chosen state carries a second cue** (a bar), not colour alone;
  - **decorative motion stops with `calm`** (Reduce Motion); the scope is
    the sound itself and keeps moving;
  - names are never cut short: a tight row moves values to the track's end,
    a tight row of labels shortens its captions, then the names' font, then
    drops the captions (`lv_`); no "…" anywhere, and `draw_wrapped` counts
    any line it had to leave out in `wrap_cut`, which the checks hold at 0;
  - **every control's boundary is 3:1** (final sweep): shapes go through
    `rbox(x, y, w, h, r, fill, edge)` (round corners, the edge thicker at
    larger sizes) or `edge()`: `C_EDGE` #6D7581 round a button, label or cell
    on the window (3.7:1), `C_TRACK` #80879A round what sits inside a cell or
    the picker (3.5:1). Marks that carry meaning (the drawing's lines, the
    labels' lines, the scope's line) grow with `gsc` too;
  - **the size fits the window**: `gsc` uses `zoom_fit`, the interface size
    cut to what the window holds (the layout needs 800 x 480 at 100%), never
    below 100%; the window has no scroll, so nothing may be pushed off it;
  - **anything that replaces the whole instrument** (a preset, Surprise Me)
    calls `sliderchange(-1)` in the frame that asks and again after the
    change, made next frame (`want_preset`, `want_rand`), so REAPER's Undo
    puts the old instrument back. `tools/build/hig` prints each undo point.
- **The window's preferences are in `@serialize`** (`ui_zoom`, `calm`):
  saved with the project, never slider values, so presets and automation
  never touch them. Only the window writes them; append new ones at the end.

## Memory map (keep regions disjoint; check this when adding a table, ADR 0014)

```
0      voices (8 x 512)            4600  Bessel zeros     4700 bar   4720 cantilever   4750 plate (60)
5000   body modes (24 x 8)         5300  head modes       5500 note stack   5600/5700 biquads
5900   diffusion lengths/pointers  6400  trims (72)       6480 part trims (13)
11000  scope (2048)                13100 presets (19 x 20)   13600 materials (31 x 16)
14200  CAT_TAB: each part's box, anchor and label (12 x 16, window only)
14400  focus list (64 x 5, window only)   14800 text audit for tools/hig.cpp (1 + 180 x 8, window only)
16384  diffusers (8 x 8192)        82000 MIDI queue (1000 x 4)
131072 delay lines (8 voices x 4 x 16384)
690000 the drawing, window only: transform stack, smoothing buffers, WF_P, WF_LAST, the picker's boxes
700000 the instrument's segments (1 + 4000 x 6)   725000 the picker's six versions (25000 each)
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
- First check in REAPER (macOS, Retina, session 1): the window rendered as
  in ysfx, but at 1× (Retina was only switched on in session 2, ADR 0021).
  REAPER draws any visible slider above `@gfx` and takes that height from the
  window, which is why every slider is now hidden (ADR 0019). The layout
  still fits any height (it reserves the preview panel first).
- **Session 5's window seen in REAPER** (macOS, Retina, 24 October): the
  drawing in both builds, the labels and lines, the picker (opened by a
  click), round corners and the system font look as in ysfx, at full
  Retina resolution. Not yet reported: how quick it feels, and the keyboard.
- **Nothing from the final HIG sweep has been seen in REAPER** (ADR 0023,
  21 October): the undo points either side of a preset or Surprise Me, the
  sizes fitted to a small window, the new edges on a Retina screen.
- **Nothing from session 3's HIG work has been seen in REAPER** (ADR 0023):
  whether REAPER passes Tab, Return and the arrows to the window, whether
  `gfx_getfont` names San Francisco or Segoe UI, the interface sizes, the
  layout with the controls at the top, and saving the preferences.
- **Nothing from session 2 has been seen in REAPER**: More, Retina mode
  (the 3D pictures and the tiles are gone since session 5). Menus, clicking,
  dragging and automation are tested only in ysfx (`tools/click.cpp`).
- The VST3 and CLAP plugins (ADR 0025, SESSION-LOG §25) have been built,
  validated (pluginval, clap-validator) and opened on GitHub's Macs, but not
  yet seen in a DAW. AU is not built.

## The plugin (ADR 0025)

- `plugin/` wraps the .jsfx unchanged. The wrapper source
  (`plugin/source/`, `plugin/wrapper.cmake`) is shared with Reverberator:
  change it in both.
- `plugin/build.sh` makes the same two ysfx key fixes as
  `tools/build_host.sh`, and asserts they applied; a ysfx update that moves
  that code fails the build rather than shipping REAPER-unlike keys.
- The GitHub archive host is blocked from the cloud container, so JUCE and
  ysfx are cloned with git. CI's artifacts and logs cannot reach the
  container as files; the workflow pushes its screenshot to a throwaway
  `ci-screenshots` branch, which can be fetched with git.

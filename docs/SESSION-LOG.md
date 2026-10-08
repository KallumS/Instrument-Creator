# Session log

**Session 1, 30 September 2026.** The whole of Instrument Creator so far was
built in this one session, in nine requests:

| # | Request | Result | Commits |
|---|---|---|---|
| 1 | "Create a REAPER ReaScript or JSFX that can create entirely new custom instruments" from ten part categories, in any material, with a preview of each part | the instrument, its window, 16 presets, docs, test rig | `dee5ecb` … `b45fe9b` |
| 2 | "An option to make the instrument plastic, brass, wooden or any of the options from Reverberator" | 11 new materials (31 in all), rattle and crackle, 3 presets, three bugs fixed | `7c95b84`, `c049115` |
| 3 | "A global age / rust slider that degrades the sound" | the Age / rust slider | `2065f71`, `9999b48` |
| 4 | "Make sure CLAUDE.md is up to date, create a session log for this session and an ADR which highlights the big decisions, and an in-depth write-up of every part and material" | this log, `docs/adr/` (18 records), `docs/PARTS-AND-MATERIALS.md`, CLAUDE.md | `bcd99e9`, `ecc039b` |
| 5 | "It can be scientific, as you're the only one that will read it" | the guide rewritten as a technical reference; `docs/PARTS.md` merged into it and removed | `b9c7ffd` |
| 6 | "Make sure all of the docs are up to date, then write me a prompt to continue in a fresh session" | docs checked against the code; this table and the handover below | `c42bd31` |
| 7 | A screenshot of the plugin running in REAPER | window fitted to any height (REAPER's slider list takes space); FX-order note | `0e350d8` |
| 8 | "Keep everything in one place" (move REAPER's sliders into the window), with REAPER's JSFX and API docs | all sliders hidden; a control strip in the window; `tools/click.cpp`; ADR 0019 | `dbe6539` |
| 9 | "Please update all of the documents and write a prompt to continue in a fresh session" | docs checked against the code; "Where things stand" and the handover moved to the end and refreshed | `4837278` |

What was built on: Trombolese and Reverberator, read from their
repositories (read-only). What was measured, what failed and what was changed
is below, in order. Numbers are from the headless rig (`tools/`), 48 kHz,
note C4 unless stated. The decisions that came out of it are in
[`adr/`](adr/README.md).

## 1. Starting point and choice of form

The request: a REAPER ReaScript or JSFX that builds instruments from parts
(energy source, exciter, vibrating element, resonator, coupler, radiator, and
four control parts), made of any material, playable from MIDI, with a preview
of each part as it is picked.

JSFX, not ReaScript: a ReaScript cannot make sound in real time, a JSFX
instrument can, and JSFX has its own drawing surface (`@gfx`) for the
previews. One file, like Reverberator, so installing is copying one file.

Reused, by reading the two sibling repositories:

- Trombolese: the outward-striking lip valve with the exactly solved Bernoulli
  flow (`reed.py`), air constants, the boundary-layer loss and 0.6133·a end
  correction, and "measure the exciter's pull on the pitch, then take it out".
- Reverberator: the material table, `t60 = 2.2/(f η)`, stiff-string B,
  `disp_solve` and the dispersion budget, `op_fit`, `loop_energy`-style
  thinking, the ysfx host and every EEL2 trap in its ADR 0010.

## 2. First sweep: 216 combinations

Every energy × exciter × element at one note. First results:

- Reed on the default air column: −42 LUFS, aperiodic. With a cylinder
  (loop −, half period) it played a clean clarinet (odd harmonics, +1 c). The
  conical configuration (loop +, full period) never oscillates with the
  reflection-function reed, at any pressure tried. Reed always plays a
  cylinder now.
- STK brass lips: noise. Replaced by Trombolese's valve (section 3).
- Bars at −46 to −69 LUFS whatever struck them: the pickup point sat near
  the node of mode 1 and the centre and end contributions cancelled. Pickup
  moved to 12 % from the end; strike position mapped to 0.5 − 0.6p from the
  middle.
- Bow on every modal element silent: section 4.

## 3. Lips

Trombolese's valve (Q 15, 0.3 mm rest, 12 mm wide, 12 kPa closing) against a
normalised waveguide (waves × 4000 Pa, Z = 2.7 MPa·s/m³). Loop +, one period.

| Lip frequency / note | Bore / note | Played |
|---|---|---|
| 0.9 | 1 | silent |
| 1.0 | 1 | +181 c |
| 1.1 | 1 | +268 c |
| 0.88 | 0.88 | −41 c |
| **0.92** | **0.88** | **+1 c** |
| 0.96 | 0.88 | +40 c |
| 0.88 | 0.92 | −9 c |

The pitch follows the lips more than the bore: the valve plays about 11 %
above its own resonance here. Across the keyboard at 0.92 / 0.88: −9 to +4 c
from C2 to C6, −33 c at G6. A two-period loop (STK's "play a harmonic")
also oscillated, +119 c before correction, but no better.

On banded modal elements the lips pulled +41 c (membrane) to +148 c (tine).
Lowering the lips alone to compensate stopped the oscillation below ~0.9 ×
(silent, as in the table); lowering only the bands made the membrane
sharper (+101 c), because the lips set the pitch. Lowering both together by
the measured pull landed every element within 2 c.

## 4. Sustaining exciters on modal elements

A bank of two-pole resonators driven by a bow: nothing (−68 to −84 LUFS). The
bow sticks, its push is a constant, and bandpass resonators reject DC; the
reflection-function bow assumes travelling waves that a resonator bank does
not have. Memory dump of the voice confirmed the band inputs sitting at a
steady −0.056.

Banded waveguides (one delay loop per mode, unit-peak bandpass inside) fixed
the structure, but a bamboo bar still did not bow: its loss per period (g ≈
0.972) beats the bow's negative slope (≈ −0.08 at slope 2). Real marimba bars
bow badly too. Grip ×3 and bow slope 3 on banded elements made all four
oscillate; grip ×8 kept them oscillating after release (tails at −23 to
−40 dB). The grip now fades to exactly 1 with the drive, which keeps the
junction passive once released: the lips' post-release runaway (−38 dB tails)
disappeared with it.

The bow first locked to high modes (bar at 2346 Hz, plate at 1050 Hz). Two
fixes: contact weights × (f₀/f)^0.7 (a bow is a patch, not a point), and the
plate strike mapped nearer the centre, where mode (1,1) dominates (2,2).

## 5. Air jet, bowed string, bowed tube

- Jet (STK flute layout) played a fifth sharp: STK tunes the bore to 2/3 of
  the note because the jet overblows. With a 1½-period loop it plays the note,
  +6 to +26 c sharp rising with pitch; corrected by 16 + 7·log₂(f/262) c to
  within 3 c. Low notes (C2, G2) play odd harmonics only, like STK's.
- Bowed steel string +20 to +35 c: the Helmholtz corner is a sharp pulse that
  travels at the group delay of the highs, which the stiffness allpasses make
  shorter. No dispersion on bowed strings: +3 to +15 c, then corrected by
  6 + 5·log₂(f/262) c. Low notes jumped an octave at bow slope 3 and 5; slope
  2 (more force) fixed C2 and G2.
- Bowed air column: (+, one period) silent; (−, half period) plays, in tune.

## 6. The tone hole and the dying strings

Plucked steel strings above C5 died in 0.3 s. Loop parameters were sane
(inspect), dispersion off made no difference. The cause was the tone-hole
filter (the default frequency control) inside every loop: a shelf losing
3.4 % per pass at 523 Hz, 157 dB/s. Moved into the loss fit (a lower T60 at
the 5 kHz partial). That then silenced the reed: a 2.3 ms T60 at 5 kHz forced
the DC-anchored one-pole to p = 0.9994, which also ate the fundamental. Two
fixes: fit the one-pole at the fundamental instead of DC (`op_fit2`, DC gain
capped below 1, pole ≤ 0.95), and floor the tone-hole factor at 0.3. Reed
and lips back to −2 … +1 c across the keyboard.

## 7. Single pushes into sustaining exciters

A finger, plectrum or hammer driving a reed, lips or bow was a short noise
burst: the push decayed before the oscillation built up. Added a hold (150,
100, 60 ms) before the decay. Now each note swells and fades; reeds stop
abruptly when the pressure falls below threshold, lips sag 70–100 c as the
push fades (the pull depends on pressure), which sounds like a brass fall-off.

## 8. Soft materials

Rubber (η 0.12), paper (0.05) and jelly (0.25) were physically right and
nearly silent: a bowed jelly string never started. Softened to 0.035, 0.03,
0.045: bowed at −24 dB (bamboo −20), plucked a short thud. Their air columns
were too lossy for the reed; the floppy-wall factor now caps at 2.2 × the
smooth-wall loss, and they play within 5 c.

## 9. Level matching

`trims.py`: max momentary loudness, notes C3/C4/C5 averaged. First pass spread
−15 to +38 dB. Capped at ±20; three passes converged (all but the capped
cases within 0.2 dB). Two presets then hit the ceiling on chords (marimba over
pipes, clay drum): a −3 dBFS peak limiter before the soft ceiling.

## 10. The window

Drawn entirely in `@gfx`, no image files. Screenshots from ysfx with graphics
(`tools/shot.py`) were checked for every option of every part and every
material. The window thread runs concurrently with audio in REAPER, so the
audio code's scratch globals were renamed where they collided with the
window's (`k`, `ay`); only the Play-button flag is shared now.

## 11. Stability

`tools/check.py`: all 216 energy × exciter × element combinations at 44.1, 48
and 96 kHz, a chord at three velocities, then slider extremes and every option
of every other part on six instruments: **0 failures**. Worst CPU in the
sweep 31 % of one core (a three-note chord at 96 kHz).

Playing checks (`range.py`-style pitch tracks): a Mono slide glides C4 → E4
in about 150 ms; valve and tone-hole legato switch cleanly; pitch bend and
the Levers mod wheel reach D4 (293.2 Hz); the sustain pedal holds a plucked
note until it is lifted; Electronics adds a 5.5 Hz vibrato.

## 12. CPU

8-note chords: bowed plate 14 %, bowed string with soundbox 8 %, struck
plate 7 %, reed 3 % of one core in real time (ysfx, same JIT as REAPER).

## 13. More materials, and three bugs found on the way

Request: plastic, brass, wood, and everything in Reverberator. Brass was
there. Reverberator's 19 options are objects; mapped to materials, eleven
were missing: Plastic, PVC, Wood, Leather, Cardboard, Foil, Cling film,
Tin, Car panel, Chain link, Handpan steel. Appended at indices 20–30 so saved
projects and presets keep their materials.

Bugs found while adding them:

- **Memory overlap.** The MIDI queue (6000–10000) sat on top of the loudness
  trims (6400) and the presets (7000): more than about 100 MIDI events in one
  block would have overwritten them. And 31 materials × 16 would have run into
  the Bessel table. Everything moved to disjoint regions (map in CLAUDE.md).
- **The bowed air column was silent in the first release.** A loop
  configuration search (section 5) ended on the configuration that does not
  oscillate, and the working one was never restored; its +20 dB trims were
  compensating for silence. Restored, re-trimmed (now +11 / +15 dB).
- **Bowed low-loss strings played the octave** at the default 20 % position
  since the loss-filter change in section 6. Grid of 6 materials × 9
  positions × 5 notes: bow slope 2 → 9 wrong, 1.5 → 7 wrong (all steels at
  exactly 1/5 or 1/3 of the string; at 1/3 the tracker is probably fooled by
  the missing third harmonic). Nudging the bow point off the fraction made it
  worse (8–15 wrong); extra high-frequency loss had no effect (the tone holes
  already damp the highs). Kept slope 1.5 with Schelleng's force-vs-position
  scaling. The first attempts at that scaling measured nothing, because an
  earlier edit had deleted the constant: always grep the constant after
  editing it.

New behaviour needed by the new materials: lossy membranes (leather,
cardboard, film) would not sustain a bow, reed or lips (a minimum driven
ring of 0.3 s fixed all three); lips were silent on cardboard, foil and tin
until their split twins were removed; the membrane lip correction had to
follow stiffness (PARTS-AND-MATERIALS.md §4.6). Rattle and crackle
were added (§6.5 there), with the gap chosen so that velocity 40 is clean.

## 14. Age / rust

A single slider that wears the instrument out. It reuses what the model
already has: the material's loss factor (up, more so at high frequencies),
irregularity (split modes), the rattle and crackle added for tin and foil,
the tuning offsets, and the drive noise. First version lost 8–9 dB at 100 %
on struck and bowed presets (piano −17.8 → −25.6 LUFS) while blown ones got
3–5 dB louder (the oscillation makes up the loss, and the hiss adds); make-up
gain now goes to strikes, plucks and bows only (+6 dB at 100 %), and the loss
was softened (η factor 3 → 2 at low frequencies, 4 → 3 extra at high). Rattle
through the same gap as tin's, so soft notes stay clean. Stability sweep
extended: every energy × exciter × element at age 0 and 100 (48 kHz) and new
at 44.1 and 96 kHz, then slider extremes (including age 50, 100, and 100 with
maximum force and decay) and every option of every part, all 31 materials, on
six instruments: 0 failures. Worst CPU 27.5 % (a three-note chord at 96 kHz).

## 15. Documentation

Request 4. `CLAUDE.md` brought up to date (slider numbers, the Age slider, the
new docs, the tools added since, the "sleep does not wait" trap, the known
limitations found in requests 2 and 3). Eighteen architecture decision
records in `docs/adr/`, each with the measurement that forced it.
`docs/PARTS-AND-MATERIALS.md`: an in-depth guide to every part and material
and the physics behind it; at the user's request (only agents read it) it
was then rewritten as a technical reference with derivations and the exact
expressions and constants, and the older `docs/PARTS.md` was merged into it
and removed. Checking it against the code corrected two more figures. The material numbers in it (ring times at 262 Hz
and 2 kHz, string inharmonicity, soundbox resonance, wall factor) were
computed from the plugin's own table, not written by hand; checking the guide
against the code caught one wrong claim (the stretched-tuning range).

## 16. First run in REAPER

The user's screenshot (REAPER on macOS, Retina) showed the window drawn
exactly as in ysfx: fonts, `gfx_ext_retina` scaling and every picture fine.
Two findings:

- **Height.** REAPER shows the visible sliders (Force … Age) above the
  `@gfx` area, leaving about 565 logical px of the 640 requested; the preview
  panel was pushed off the bottom (description clipped, hint and waveform
  hidden). The layout now reserves the preview first
  (`ph_min = max(140, 0.31·(h − header))`), sizes the six tiles and the
  control row from what is left, gives the waveform its own column, clips
  text at the panel edge, and shows the material line and the hint only when
  they fit whole. Checked at 800×480, 966×565, 940×640 and 1200×800.
- **FX order.** The title showed the instrument as FX 2 of 2 on a track
  named after Reverberator. An instrument overwrites its input, so a reverb
  before it does nothing; the instrument must be first. (The README already
  says so.)

Not yet confirmed in REAPER: menus, clicking, mouse wheel, automation.

## 17. Every control in the window

The user asked to keep everything in one place, and supplied REAPER's JSFX
programming reference and API function list. From the reference: a slider
whose name starts with `-` is hidden but still automatable; `slider(n)` is
assignable; `slider_automate(mask)` records automation and
`slider_automate(mask, 1)` (REAPER 6.74+) ends a touch; `time_precise()`
gives the time for a double-click.

- Sliders 13-23 now hidden like the part choices, so REAPER shows no slider
  list and the window gets its whole height. Default size 940×720 (was 640),
  so the area above the strip matches the old layout.
- A strip of two rows along the bottom (`control()`, ADR 0019): Force, Size,
  Brightness, Decay, Excite position, Resonator amount; Play mode (Poly/Mono
  switch), Glide, Fine tune, Output, Age. Tracks fill from the left, or from
  the middle for Brightness and Fine tune; each has its part's colour (Age
  rust). Names shorten ("Position", "Resonator") when they would hit the
  value. Hovering shows the control in the preview panel, with its part's
  picture, value, description and how to use it.
- The header's age note shortens to "(age N%)" or is left out when it would
  run under the buttons (it did at 800 px wide).
- `tools/click.cpp` (built by `build_host.sh`) runs a mouse script through
  `@gfx` and prints sliders 13-23 and the changed/automated masks. Checked:
  drag Force 70 → 19 by 63 px left (expected 0.70 − 63/124 = 0.19); a click on
  Size's track at the far left jumps to 27; double-click resets Force 30 → 70,
  two clicks 0.5 s apart do not; three wheel notches move Decay 100 → 118
  (log track); a Shift-drag of 100 px moves Age by 6 (a tenth of the speed);
  a click on the right half sets Mono. Every change is automated on the
  right slider; REAPER's visible mask is 0.
- Layout checked at 800×480 (cramped: tile names overlap their pictures),
  800×560, 940×720 and 1200×860. No DSP change, so no re-trim or re-check.

## 18. 3D-rendered pictures (session 2)

The user was happy with the sound but not the pictures, and asked for 3D
renders (preferred) or better drawings. The JSFX reference they supplied
(gfx and js pages) confirmed `gfx_loadimg` takes a path, searched beside the
effect then in Data/, into 128 slots of up to 2048 px; ysfx resolves it the
same way (`ysfx_find_data_file`) and preloads `filename:` PNGs, which ruled
out sprite sheets declared that way (ADR 0020).

- **Blender headless.** `pip install bpy` (5.2.2, ~400 MB, Python 3.13)
  renders with Cycles on the CPU: a 512×320 brass bell in 3.2 s. No GPU, so
  no EEVEE. `tools/render_parts.py` builds every model from primitives; the
  first draft of all 50 options took 90 s at 16 samples.
- **What needed a second go** (judged from contact sheets on the window's
  background colour): lips (two ellipsoids read as sausages; now swept
  ellipses pinched at the corners with a cupid's bow, against a mouthpiece
  rim), hands and the finger (spheres and capsules read as blobs; now a
  rounded-box palm and lathed fingers with knuckles and nails, oriented by
  a direction and a nail-side vector), the plectrum (hull of three circles),
  organ pipe (one pipe drawn sideways looked like a pencil; three standing
  pipes with mouths), the solid body (an electric guitar outline smoothed by
  Chaikin, pickups and bridge), brass mouthpiece (was bell-sized), pedals (a
  stray rotation pushed them into the block), soundboard ribs (stood on end),
  bow on string (string pointed at the camera), bamboo (wave scale 0.9 gave a
  node every 0.35 units; 0.24).
- **A helper named `math`** shadowed Python's module and broke every builder;
  renamed `mop`. **`rm -rf dir/*` after a `cd`** in one shell command is
  refused by the session's safety check; the script took `--out DIR` instead.
- **Size.** 360×240 RGBA renders average ~40 KB; libimagequant (`pip install
  imagequant`, pngquant's library) to a 256-colour palette makes them ~10 KB
  with no difference visible at 2× zoom (checked on chrome, glass, car paint,
  lips). Lossless oxipng saved only 12 %.
- **In the window.** `picture()` loads on change, builds three halvings (the
  list icons are ~50 px wide at 1×, a 7× reduction that bilinear `gfx_blit`
  aliases), fades the rust layer in with Age and shakes the element while it
  sounds. Missing files fall back to the drawings (checked by screenshotting
  while only two pictures existed). `tools/shot.cpp` takes `SHOT_SCALE=2` to
  draw as on a Retina screen.
- **Full set:** 671 PNGs (50 options; 19 material shapes × 31 plus their rust
  layers; 31 swatches and one rust swatch) in about 40 min at 64 samples,
  2-6 s each (glass and transmissive materials slowest); 35 MB → 11 MB after
  compression. The string was re-rendered thicker (radius 0.1) so its
  material shows.
- **Small windows.** At 800×560 the pictures ran into the tile names (the
  drawings did too, an open item from §17). The tile and control-tile
  pictures now end above the name (`pb` in `tile()`); checked at 800×560,
  940×720 and 1880×1440 with `SHOT_SCALE=2`. The control strip still drags
  as before (`click`: Force 70 → 19).

- **Blender files for the user** (asked for after the renders): there were
  none, the script builds each model in memory. `--blend` saves one `.blend`
  per option (51 files with `materials.blend`, 7.6 MB compressed), framed and
  lit as rendered, material parts in brass with all 31 materials and rust kept
  as fake users. Reopened two and rendered them: identical to the pictures.
  `materials.blend` is a labelled table of swatches (first try viewed them
  head-on and flat; now from above at an angle, scaled to fit the lights).

## Where things stand

- Every energy × exciter × element combination plays and is stable at 44.1,
  48 and 96 kHz and at age 0 and 100; all 19 presets play.
- In tune: plucked, struck and reed notes within a few cents; lips, jets and
  bows mostly within 10 c (exceptions in PARTS-AND-MATERIALS.md §4.6).
- Level-matched within 0.2 dB across parts, except three capped combinations.
- Worst CPU: a bowed-plate chord at 14 % of a core at 48 kHz; 27.5 % for a
  three-note chord at 96 kHz.

Open items:

- **Try it in REAPER.** The window has been seen in REAPER (§16), before
  the control strip existed; the strip, the popup menus, clicking, dragging
  and automation have only been checked in ysfx (`tools/click.cpp`).
- **The pictures in REAPER.** Loading PNGs from `Instrument-Creator-images/`
  beside the plugin is checked only in ysfx; confirm REAPER finds the folder
  (it should: same search order) and that Retina looks as in the
  `SHOT_SCALE=2` screenshots.
- The most lossless steels bowed at exactly 1/5 or 1/3 of the string can
  flip to the octave.
- Lips on a membrane: bone is 57 c flat, jelly 26 c sharp.
- A reed cannot play a true cone (ADR 0017).
- A single push into lips sags in pitch as it fades.

## Handover to the next session

Session 2 (8 October 2026) added the 3D pictures (§18) on the same branch,
recreated from `main` after pull request 3 merged session 1's work; a fresh
container also needs `pip install bpy imagequant` to re-render them.

State at the end of session 1 (1 October 2026): everything is committed and
pushed on `claude/reaper-custom-instrument-creator-xz08x6`; no pull request
has been opened; the GitHub repository is still named Wind-Instrument-Creator
(the user intends to rename it Instrument-Creator; the files already use the
new name). A fresh container has no `tools/build/` and no Python packages:
run `pip install numpy scipy matplotlib` and `tools/build_host.sh` first.

The user tests in REAPER on macOS (Retina) and reports back with
screenshots. The last thing they saw in REAPER was the window before the
control strip (§16); the strip (§17) is new to them.

Candidate next steps, roughly in order of value:

0. Session 2 (8 October 2026) replaced the drawn pictures with 3D renders
   (§18, ADR 0020). Ask the user how they look in REAPER, and whether any
   part's model should change: each is one function in
   `tools/render_parts.py`; re-render just that shape with
   `python3 tools/render_parts.py 4_2` (needs `pip install bpy imagequant`).
1. Feedback from REAPER on the new window: the control strip (drag, Shift,
   wheel, double-click, Poly/Mono), the part menus, automation of hidden
   sliders, window size for an instance saved at the old 940×640, CPU on the
   user's machine. Ask for a screenshot if something looks wrong.
2. The open items above (bowed steel double-slip at 1/5 and 1/3; bone and
   jelly lips on a membrane; a true conical reed; small-window tile labels).
3. Removing the vestigial code listed in PARTS-AND-MATERIALS.md §14 (then
   render, run `check.py`, commit).
4. Anything new the user asks for. Before changing a design rule, read its
   ADR; after any sound change, re-run `trims.py` / `apply_trims.py` and
   `check.py`; after a window change, screenshot it at 940×720 and 800×560
   and test the controls with `tools/build/click`; then update
   PARTS-AND-MATERIALS.md, the README, CLAUDE.md and this log.

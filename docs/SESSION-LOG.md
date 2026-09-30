# Session log

**Session 1, 30 September 2026.** The whole of Instrument Creator so far was
built in this one session, in four requests:

| # | Request | Result | Commits |
|---|---|---|---|
| 1 | "Create a REAPER ReaScript or JSFX that can create entirely new custom instruments" from ten part categories, in any material, with a preview of each part | the instrument, its window, 16 presets, docs, test rig | `dee5ecb` … `b45fe9b` |
| 2 | "An option to make the instrument plastic, brass, wooden or any of the options from Reverberator" | 11 new materials (31 in all), rattle and crackle, 3 presets, three bugs fixed | `7c95b84`, `c049115` |
| 3 | "A global age / rust slider that degrades the sound" | the Age / rust slider | `2065f71`, `9999b48` |
| 4 | "Make sure CLAUDE.md is up to date, create a session log for this session and an ADR which highlights the big decisions, and an in-depth write-up of every part and material" | this log, `docs/adr/`, `docs/PARTS-AND-MATERIALS.md`, CLAUDE.md | (this commit) |

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
follow stiffness (section on pitch pull in PARTS.md). Rattle and crackle
were added (PARTS.md), with the gap chosen so that velocity 40 is clean.

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
and the physics behind it. The material numbers in it (ring times at 262 Hz
and 2 kHz, string inharmonicity, soundbox resonance, wall factor) were
computed from the plugin's own table, not written by hand; checking the guide
against the code caught one wrong claim (the stretched-tuning range).

## Where things stand

- Every energy × exciter × element combination plays and is stable at 44.1,
  48 and 96 kHz and at age 0 and 100; all 19 presets play.
- In tune: plucked, struck and reed notes within a few cents; lips, jets and
  bows mostly within 10 c (exceptions in PARTS.md).
- Level-matched within 0.2 dB across parts, except three capped combinations.
- Worst CPU: a bowed-plate chord at 14 % of a core at 48 kHz; 27.5 % for a
  three-note chord at 96 kHz.

Open items:

- **Try it in REAPER.** Everything was verified in ysfx (same engine), not in
  REAPER: the popup menus, clicking, automation and the window's size need a
  check there.
- The most lossless steels bowed at exactly 1/5 or 1/3 of the string can
  flip to the octave.
- Lips on a membrane: bone is 57 c flat, jelly 26 c sharp.
- A reed cannot play a true cone (ADR 0017).
- A single push into lips sags in pitch as it fades.


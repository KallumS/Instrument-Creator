# Session log

How Instrument Creator was built, what was measured and what did not work.
Numbers are from the headless rig (`tools/`), 48 kHz, note C4 unless stated.

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

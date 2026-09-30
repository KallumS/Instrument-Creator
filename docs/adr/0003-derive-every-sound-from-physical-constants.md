# 0003. Derive every sound from physical constants

- Status: Accepted
- Date: 2026-09-30

## Context

The user wants instruments that do not exist (a marble violin, a jelly gong),
so there are no recordings to sample. Reverberator derived every material
reverb from Young's modulus, density and loss factor (its ADR 0002), and that
made Size, Decay and Tuning behave physically everywhere. Nobody working on
this project can listen to the output.

## Decision

Describe every material by physical quantities: stiffness E, density ρ, loss
factor η at 1 kHz and how it grows with frequency, an irregularity, wall
roughness, hardness, the thickness it would need as a string, the longest ring
its mounting allows, and (for a few) wobble, rattle and crackle. The element's
pitch is always the note played; the material decides the inharmonicity
(`B = π²Ed²/(64ρL⁴f₀²)` for strings, membrane stretch), the decay of every
partial (`T60 = 2.2/(f·η(f))`, capped), mode splitting, strike hardness, air
column wall loss and the tuning of the body resonances (`√(E/ρ)`).

## Consequences

- Any element can be made of any material, and the result is plausible
  without anyone tuning it by ear: a marble string rings like a bell because a
  marble string would have to be a thick rod.
- Results are checked by measurement (pitch, decay, loudness), not listening.
- Where physics makes something unplayable, playability wins and the change is
  recorded (ADR 0015).

## Alternatives considered

- **Sampled or convolved recordings**: impossible for impossible instruments.
- **Hand-tuned presets per material**: unverifiable without listening, and
  31 materials × 6 elements is too many.

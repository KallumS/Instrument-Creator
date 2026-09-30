# 0006. Banded waveguides when a sustaining exciter drives a modal element

- Status: Accepted
- Date: 2026-09-30

## Context

A bow on a bank of resonators made no sound: a sticking bow pushes a
constant, and bandpass resonators reject it. The reflection-function exciters
of ADR 0005 assume travelling waves, which a resonator bank does not have.

## Decision

When a reed, lips, bow or jet drives a membrane, bar, plate or tine, each mode
becomes a banded waveguide (Essl & Cook, STK `BandedWG`): a delay loop one
period long with a unit-peak bandpass inside, all loops summed at the
contact. Three extras, each measured:

- the contact weights fall as `(f₀/f)^0.7` (a bow or lip is a patch, which
  averages out high modes; without it bars and plates locked to high modes);
- the exciter's grip is ×3 while driven, fading to exactly ×1 with the drive
  (×1 would not bow a bamboo bar; a permanent ×8 kept ringing after release);
- every loop rings for at least 0.3 s × √(f₀/f) while driven, so very lossy
  materials still give the exciter something to push against;

and buzzing lips get no split twin modes (they cannot choose between two).

## Consequences

- Every sustaining exciter plays on every modal element and every material.
- Banded elements cost about twice as much as plain modes (a bowed plate
  chord is the most expensive case, 14 % of a core).
- Plain modes are still used for strikes, which keeps their decays exact.

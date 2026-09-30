# 0009. Tune by phase, then measure and remove each exciter's pitch pull

- Status: Accepted
- Date: 2026-09-30

## Context

A loop's pitch depends on the phase of everything in it: the loss filter,
dispersion allpasses, an in-loop DC blocker, the fractional delay. And a
sustaining exciter shifts the pitch further (Trombolese: lips play above
their own resonance). Nobody can tune by ear.

## Decision

- Every 16 samples, compute each loop's delay so its total phase at the
  current frequency is exactly 2π (or π, 3π, per configuration), including
  every filter, with a 4-point Lagrange read.
- Measure each sustaining exciter's pull across the keyboard (`range.py`)
  and correct it: lips on a tube (bore × 0.88, lips 0.92 × note), lips on
  modal elements (lips and element lowered together by 113–148 c; membranes
  50–100 c by stiffness), jet (16 + 7·log₂(f/262) c), bowed string
  (6 + 5·log₂(f/262) c).

## Consequences

- Plucked, struck and reed notes are within a few cents across the keyboard;
  lips, jets and bows within about 10 c, a few material-dependent exceptions
  within 60 c (listed in PARTS-AND-MATERIALS.md §4.6).
- Any change to an exciter's constants makes its correction stale: re-measure.

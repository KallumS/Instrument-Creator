# 0011. Level-match by measurement, then limit

- Status: Accepted
- Date: 2026-09-30

## Context

Combinations differ in loudness by up to 50 dB (a reed on a membrane vs a
bowed tube driven by a single push). Reverberator matched materials with
analytic normalisation plus measured trims (its ADR 0007).

## Decision

- A trim per exciter × element, for a steady source and for a single push
  (72 values), plus one per resonator, coupler and radiator, measured by
  `tools/trims.py` as the loudest 400 ms of a note at C3, C4, C5, iterated
  (`apply_trims.py`) until the corrections are about zero. Capped at ±20 dB.
- A −3 dBFS peak limiter with instant attack, then a soft ceiling.
- Age gets its own make-up gain (ADR 0018).

## Consequences

- Switching parts doesn't jump in volume (within 0.2 dB, except capped cases).
- Materials are not trimmed: a lossy material really is quieter when struck.
- Every sound change moves loudness; re-run the trims.
- `apply_trims.py` rewrites the plugin, between `//TRIMS_BEGIN` and
  `//TRIMS_END` only (an earlier version scrambled the whole file).

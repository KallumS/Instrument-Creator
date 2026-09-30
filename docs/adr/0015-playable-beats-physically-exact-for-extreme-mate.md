# 0015. Playable beats physically exact for extreme materials

- Status: Accepted
- Date: 2026-09-30

## Context

Some materials are physically near-silent as instruments: rubber
(η ≈ 0.1), jelly (η ≈ 0.25), cling film (Reverberator: 0.12 with air loading),
leather and cardboard (0.06). A bowed jelly string never started; a reed could
not drive a rubber tube.

## Decision

Make them lossy but playable: η 0.03–0.05; cap the floppy-wall loss of air
columns at 2.2 × a smooth wall; give driven modal loops a minimum ring
(ADR 0006). Record the real values next to the used ones (PARTS-AND-MATERIALS.md).

## Consequences

- Every material plays with every exciter; soft ones still thud when struck.
- The model is knowingly unphysical here, and says so.

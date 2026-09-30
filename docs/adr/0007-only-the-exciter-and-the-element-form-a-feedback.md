# 0007. Only the exciter and the element form a feedback loop

- Status: Accepted
- Date: 2026-09-30

## Context

Resonators, bodies, bells and soundboards could all be coupled back into the
element, as in a real instrument. Every feedback path is a stability risk,
and Reverberator's rule (its ADR 0008) was that nonlinear paths are
feed-forward.

## Decision

The only feedback loop is exciter ↔ element, inside each voice. Everything
after the element is linear and feed-forward: the per-voice bore or pipe
comb, then (summed over voices) the coupler filters, the shared body modes,
the radiator, a limiter and a soft ceiling. Rattle and crackle read the
element's output and add to it; they never feed back.

## Consequences

- Stability depends on the exciter–element loop alone, which is what the
  sweeps test.
- The shared stages run once for all voices, which keeps eight voices cheap.
- A coupler's effect on the element's decay is modelled as a "drain" factor on
  the element's T60 (bridge × 0.9, soundpost × 0.75), not as real coupling.

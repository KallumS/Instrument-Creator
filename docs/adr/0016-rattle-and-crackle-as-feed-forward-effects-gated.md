# 0016. Rattle and crackle as feed-forward effects gated by level

- Status: Accepted
- Date: 2026-09-30

## Context

Several of Reverberator's objects are defined by what they do when driven
hard: a tin roof's loose fixings rattle, foil crackles, cling film slaps like
a kazoo. Reverberator made these feed-forward so they cannot destabilise the
model (its ADR 0008).

## Decision

Per voice, after level matching: whatever exceeds a ±0.2 gap is high-passed
and added back (rattle, per material: cling film 1, chain link 1, tin 0.7,
car panel 0.3); foil pops at random at a rate that grows with level (crackle).
The gap was chosen so that velocity 40 stays clean.

## Consequences

- Soft playing is clean, hard playing buzzes, as the real objects do.
- Age reuses the same mechanism for loose parts and rust grit.

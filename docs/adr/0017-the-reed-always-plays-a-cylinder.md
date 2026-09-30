# 0017. The reed always plays a cylinder

- Status: Accepted (a known limitation)
- Date: 2026-09-30

## Context

A conical bore (saxophone, oboe) gives all harmonics; a cylinder
(clarinet) gives odd ones. In the reflection-function form the reed never
oscillated with the conical loop configuration, at any pressure tried.

## Decision

A reed on an air column always uses the cylinder configuration (loop −,
half a period). The Bore resonator, a per-voice comb tuned to every harmonic,
supplies the even harmonics of a conical instrument.

## Consequences

- Reed instruments are in tune across the keyboard (−2 … +1 c).
- "Bore" on a reed instrument is a colouring, not a true cone.

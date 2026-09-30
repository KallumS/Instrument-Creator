# 0004. Waveguides for strings and air columns, modes for everything else

- Status: Accepted
- Date: 2026-09-30

## Context

Strings and air columns have many nearly harmonic partials; membranes, bars,
plates and tines have a few strongly inharmonic ones with textbook ratios.
Eight voices must run in real time.

## Decision

- **String and air column**: digital waveguides. A delay loop one round trip
  long, with a one-pole loss filter and (strings) four stiffness allpasses.
  Strings use two segments either side of the exciter (STK's bowed-string
  layout) so the excite position works; tubes are driven from one end.
- **Membrane, bar, plate, tine**: a bank of up to 24 two-pole bandpass
  resonators at the shape's mode frequencies (Bessel zeros, free-free beam,
  simply supported plate, cantilever), weighted by the mode shape at the
  excite position.
- The modal gain `b = w/N` (N = samples per period) matches a waveguide's
  resonance peak `1/(1 − g)` at the same decay, so the two engines respond at
  comparable levels.

## Consequences

- Waveguides give unlimited partials for almost no CPU; modes give exact
  inharmonic ratios and per-mode decay.
- Sustaining exciters need special handling on modal elements (ADR 0006).
- Pitch bends and glides retune both engines every 16 samples: loop delays
  from phase, mode coefficients from the new frequency.

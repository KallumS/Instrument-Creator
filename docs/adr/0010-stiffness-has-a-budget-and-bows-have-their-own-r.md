# 0010. Stiffness has a budget, and bows have their own rules

- Status: Accepted
- Date: 2026-09-30

## Context

Stiffness makes high partials of a string sharp, done with four allpasses in
the loop. On short, stiff high strings the allpasses swallowed more than a
cycle of delay. Bowed strings behaved differently: dispersion made every
bowed note sharp, and low-loss strings flipped to the octave at some bow
positions.

## Decision

- The allpasses may take at most 40 % of the loop's phase at the fundamental
  (Reverberator ADR 0005 had the same lesson).
- Bowed strings get no dispersion: the stick-slip corner travels at the group
  delay of the highs.
- Bow force follows Schelleng's rule: the friction slope is 1.5 × (β/0.2)^0.5
  on strings (nearer the bridge presses harder), 2 on tubes, 3 on modal
  elements.

## Consequences

- Stiff strings (glass, marble, ice rods) ring bell-like at every pitch.
- Bowed strings: 263 of 270 positions × notes × materials play the right
  note; the rest are the most lossless steels bowed at exactly 1/5 or 1/3,
  a known degenerate case (and at 1/3 the tracker may be fooled). Documented
  as a limitation.

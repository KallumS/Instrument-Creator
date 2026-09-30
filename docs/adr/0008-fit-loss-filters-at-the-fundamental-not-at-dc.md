# 0008. Fit loss filters at the fundamental, not at DC

- Status: Accepted
- Date: 2026-09-30

## Context

Reverberator fits each loop's one-pole loss filter at DC and one high
frequency, which keeps the DC gain below one. Here the tone-hole option needs
a strong high-frequency loss; with the fit anchored at DC it forced the pole
to 0.9994 and the filter ate the fundamental: reeds went silent. Before that,
the tone-hole shelf sat in the loop as a separate filter and made high
strings die in 0.3 s.

## Decision

`op_fit2` fits the one-pole to the per-period gain at the note's fundamental
and at the ~5 kHz partial. The implied DC gain is capped below one and the
pole at 0.95. Frequency-dependent effects (tone holes, felt, mute, hand,
brightness, age) change the target T60s, never add filters to the loop.

## Consequences

- The note's own decay is exactly as designed whatever happens at high
  frequencies.
- Loops stay passive (DC gain < 1).
- Very steep high-frequency cuts are not possible with one pole; tone holes
  are floored at 0.3 × the natural T60.

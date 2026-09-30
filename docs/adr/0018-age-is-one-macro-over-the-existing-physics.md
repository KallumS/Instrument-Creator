# 0018. Age is one macro over the existing physics

- Status: Accepted
- Date: 2026-09-30

## Context

The user asked for an age / rust control that degrades the sound. Real
ageing changes loss, evenness, tuning and loose parts, all of which the model
already has as parameters.

## Decision

One slider `a` (0–100 %) scales existing quantities rather than adding a new
effect: loss η × (1 + a²(2 + 3f/2 kHz)) in the element and the bodies and a
shorter maximum ring; irregularity + 0.015a (split modes on every material);
±25a cents per note plus a slow wander; rattle and grit through the ADR 0016
gap; drive noise and hiss for sustaining exciters; a rougher bore. Make-up
gain +6a dB for strikes, plucks and bows only, because reeds and lips keep
themselves going. The pictures rust with it. Presets leave it alone.

## Consequences

- It works on every part and material with no special cases, and
  the stability sweep covers age 0 and 100.
- Loudness stays within about 3 dB from new to fully aged, except struck
  instruments at 100 % (up to about 6 dB quieter).
- An aged instrument's ring times appear in the window's material numbers.

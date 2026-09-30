# 0005. Sustaining exciters are passive reflection functions

- Status: Accepted
- Date: 2026-09-30

## Context

A bow, reed, lips or air jet sustains a note by feeding energy into the
element in step with its motion. Naive nonlinear feedback blows up. STK's
instruments use scattering forms that are passive by construction; Trombolese
built and verified a lip valve with the Bernoulli flow solved exactly against
the bore impedance.

## Decision

Each sustaining exciter is a function `e = f(P, c)`: from the drive P and the
wave arriving at the contact c, return what is added to the outgoing wave.

- **Reed**: STK clarinet reed table, `R = clip(0.7 − 0.3(c − P))`,
  `e = (P − c)(1 − R)`.
- **Lips**: Trombolese's outward-striking valve (mass–spring opening, Q 15,
  0.3 mm rest, 12 mm wide, 12 kPa closing), flow solved as a quadratic, in
  pascals against a normalised waveguide (waves × 4000 Pa).
- **Bow**: STK bow table `e = Δv(|kΔv| + 0.75)⁻⁴`.
- **Air jet**: STK flute, jet delay 0.32 of the loop, `j(j² − 1)` clipped,
  bore tuned to 2/3 of the note (it overblows).

Each is passive when P = 0. Anything that scales e above 1 must fade back to
exactly 1 as the drive fades.

## Consequences

- All sustaining combinations are stable at every setting tested, and notes
  stop when released.
- Each exciter pulls the pitch; the pulls were measured and corrected
  (ADR 0009).
- A reed on a cone (sax) does not oscillate in this form, so the reed always
  plays a cylinder (ADR 0017).

## Alternatives considered

- **STK's brass lip filter**: produced only noise here; replaced by
  Trombolese's valve.
- **Kirchhoff (force/velocity) friction and flow laws on modal banks**:
  would need calibrating per element; the reflection forms work unchanged on
  waveguides and banded waveguides.

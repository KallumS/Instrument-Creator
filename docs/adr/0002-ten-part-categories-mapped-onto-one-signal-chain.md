# 0002. Ten part categories mapped onto one signal chain

- Status: Accepted
- Date: 2026-09-30

## Context

The user gave ten categories: energy source, exciter, vibrating element,
resonator, coupler, radiator, frequency control, tuning mechanism, damping,
modulation/control, and the chain "energy source → vibrating element →
coupling mechanism → resonator → sound radiation → controls". Several
categories share option names (hammer, plectrum and bow appear as both energy
sources and exciters; slide and valves appear three times), and any
combination must make sound, including impossible ones.

## Decision

Give every category one job in a fixed chain:

- **Energy source** decides *how the power arrives*: steady (breath, bow,
  electricity) or a single push (finger, plectrum, hammer), with its attack,
  noise and velocity response.
- **Exciter** decides *what touches the element*: sustaining (reed, lips,
  bow) or striking (hammer, plectrum, mallet).
- The 2 × 2 of those two answers covers every pairing: steady + sustaining
  sustains; single push + striking rings once; steady + striking keeps
  re-striking (a roll or buzzer); single push + sustaining swells and fades.
- **Vibrating element** sets the pitch; **coupler** shapes the path from
  element to resonator; **resonator** colours it; **radiator** shapes how it
  leaves.
- The four **controls** change how notes are played (glides, tuning offsets,
  what happens on release, what the mod wheel does), not the sound chain.
- The element and the resonator each have a **material**.

## Consequences

- Every one of the 6 × 6 × 6 energy × exciter × element combinations makes
  sound (`tools/sweep.py`), and the stability sweep covers all of them.
- Duplicate names have one meaning per category, documented in the README.
- A windway coupler also changes the exciter (lips or a bow become an air
  jet), the one place a later part changes an earlier one; it is how a flute
  works and it is flagged in the window's hint line.
- The slider order is the GUI's row order, so a row index is the slider
  index minus one.

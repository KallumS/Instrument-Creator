# 0012. A window drawn entirely in code

- Status: Accepted
- Date: 2026-09-30

## Context

The user asked whether they would need to create the preview pictures. They
cannot draw in code, and shipping image files breaks the single-file rule.

## Decision

Every part option (50) and material (31) is drawn with EEL2 vector calls
(lines, triangles, circles, filled round rectangles) in a normalised 0–1 box.
The element, resonator, coupler and radiator take their material's colour;
materials have textures (grain, veins, cracks, weave, rust with age). The
window lists the twelve choices (menu, arrows, wheel), draws the instrument
as its signal chain, and previews the hovered part with a description, the
material's numbers and a live waveform. The part choices are hidden sliders
(still automatable). The continuous controls were ordinary sliders at first;
since [ADR 0019](0019-every-control-in-the-window-reaper-sliders-hidden.md)
they are hidden too and drawn in the window.

## Consequences

- Nothing to install beyond the one file; pictures always match the options.
- The window thread runs concurrently with audio in REAPER: audio code and
  window code must not share scratch globals (only the Play button's flag is
  shared).
- Pictures are simple; nicer artwork could be loaded from PNGs later.

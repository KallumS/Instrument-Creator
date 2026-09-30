# 0014. Keep memory regions disjoint, and indices append-only

- Status: Accepted
- Date: 2026-09-30

## Context

EEL2 has one flat memory. The MIDI queue was found sitting on top of the
loudness trims and the presets (a busy MIDI burst would have overwritten
them), and adding materials would have run into the Bessel table. Saved
REAPER projects store slider values, so reordering options would change
people's instruments.

## Decision

- One memory map, documented in CLAUDE.md, with every table in its own
  region; check it when adding a table.
- New options and materials are appended at the end of their lists; presets
  never change the Age slider.

## Consequences

- Projects saved with the first version keep their materials after the
  additions (new materials are indices 20–30).
- Menus are in historical rather than family order; the README groups them.

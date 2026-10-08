# 0019. Every control in the window, REAPER's slider list hidden

- Status: Accepted; amended by [0021](0021-one-diagram-materials-in-menus-four-controls-und.md) (one row of seven controls; play mode, glide, fine tune and output under More)
- Date: 2026-10-01

## Context

The first run in REAPER showed REAPER's generic slider list (the eleven
continuous controls, sliders 13-23) drawn above the `@gfx` window, taking
about 75 px of its height and splitting the instrument across two kinds of
UI. The user asked for everything in one place.

## Decision

Sliders 13-23 are hidden (`-` before the name), like the part choices, and
the window draws them as a strip of two rows along the bottom (`control()` in
`@gfx`): six sound controls, then play mode, glide, fine tune, output and
age. Each is a horizontal track: click away from the handle to jump, drag
(relative; Shift for a tenth of the speed), wheel to step, double-click
(`time_precise`, 0.35 s) to reset to the slider's default; Play mode is a
two-way switch. Log controls (size, decay, glide) map the track's middle to
`ctl_mid` and are log on each half. Every change writes `slider(13 + k)`,
calls `slider_automate` (and ends the touch on mouse-up with
`slider_automate(mask, 1)`), and sets `gui_dirty` so `@block` re-runs
`update_globals`. Hovering a control shows its description in the preview
panel. The default window grows from 940×640 to 940×720 to hold the strip.

## Consequences

- REAPER gives the window its full height; no slider list to scroll.
- All 23 parameters stay automatable and keep their indices, ranges and
  defaults, so saved projects and presets are unaffected (ADR 0014).
- The control ranges, defaults and log midpoints are written twice (the
  `sliderN:` lines and `ctl_min/ctl_max/ctl_def/ctl_mid`); change both.
- `tools/click.cpp` drives the window with a mouse script and reports the
  slider values and automation flags, so the controls are tested headlessly.

# 0025. VST3 and CLAP by wrapping the JSFX, not rewriting it

- Status: Accepted
- Date: 2026-10-24
- Reverses the setting-aside in SESSION-LOG §20 (the route is the one found there)

## Context

The user asked for Instrument Creator as a VST3 and CLAP plugin for the Mac,
built by GitHub Actions. SESSION-LOG §20 had already found the route: wrap,
because a rewrite would mean re-measuring every pitch correction, trim and
stability result, all of which were measured on the JSFX in ysfx.

## Decision

`plugin/` is a small JUCE plugin (an instrument: MIDI in, stereo out) that
compiles `Instrument-Creator.jsfx` in as data and runs it with ysfx
(JoepVanlier/ysfx, pinned in `plugin/build.sh`, with the two key fixes
`tools/build_host.sh` makes, so the keyboard behaves as in REAPER). Its
window is ysfx's `@gfx` view and nothing else, at least 800 × 480 (what the
layout needs). All 23 sliders are host parameters holding the slider's own
value, snapped to its step, so automation and saved projects round-trip
exactly; `@serialize` (Interface Size, Reduce Motion) is saved too. Sliders
the window moves, presets and Surprise Me included, are reported to the host.

The wrapper is shared with Reverberator (its ADR 0017), each repository
keeping a copy configured in `plugin/CMakeLists.txt`.

## Consequences

- Sound, tuning and window are the JSFX's; nothing to re-measure, and a JSFX
  change reaches the plugin at the next build.
- **Option lists are append-only already (ADR 0014); now slider numbers are
  too**: parameter IDs are `slider<n>`, so renumbering would break saved
  projects and automation in every DAW.
- `sliderchange(-1)` undo points (ADR 0023) have no equivalent in a plugin
  API; a DAW's undo covers parameter changes its own way.
- JUCE 8 is AGPL v3 (or commercial): the plugin binaries are AGPL-3.0 as
  well as GPL-3.0, fine while the source is public.
- Not signed or notarised: the user clears the quarantine flag once
  (INSTALL.txt).
- Mac only, as asked; Audio Unit is one word in `FORMATS` plus `auval`.
- clap-validator's `state-invalid` test is skipped: JUCE's
  `setStateInformation` cannot report a failed load.

## Alternatives considered

As in SESSION-LOG §20 and Reverberator's ADR 0017: a C++ rewrite, ysfx's own
general-purpose plugin, or CLAP with clap-wrapper and no JUCE (the user chose
JUCE).

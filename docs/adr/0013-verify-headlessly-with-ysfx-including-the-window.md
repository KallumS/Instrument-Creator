# 0013. Verify headlessly with ysfx, including the window

- Status: Accepted
- Date: 2026-09-30

## Context

REAPER is not available in the build container and nobody can listen.
Reverberator verified its plugin with ysfx, a library that runs JSFX with
REAPER's EEL2 engine (its ADR 0009).

## Decision

Build ysfx with graphics (`tools/build_host.sh`) and three hosts: `render`
(MIDI events in, audio out), `shot` (screenshot of `@gfx` after a note) and
`inspect` (memory dump of a voice). Python tools measure what a listener would
judge: loudness, pitch (YIN), decay, spectra, stability (`check.py`: every
combination at three sample rates and at age 0 and 100, slider extremes,
every option of every part on six instruments).

## Consequences

- Bugs found this way include: lips producing noise, bars cancelling their
  own fundamental, tone holes killing strings, a scrambled plugin file, a
  memory overlap, and a bowed tube that had been silent since release.
- CPU figures are from the same JIT as REAPER.
- ysfx is not REAPER: menus, automation and the real window need a check in
  REAPER itself.

# 0001. A single-file JSFX instrument, not a ReaScript

- Status: Accepted
- Date: 2026-09-30

## Context

The request allowed "a Reaper ReaScript or JSFX". The instrument has to make
sound in real time from MIDI and show a preview of each part as it is picked.
The user is not a programmer, so installing must be trivial. Reverberator,
the sibling project, is a single JSFX file for the same reasons (its ADR 0001).

## Decision

Build one file, `Instrument-Creator.jsfx`: the physics, the voices, the MIDI
handling and the window (`@gfx`) all in one place. No companion files, no
images, no compiled code.

## Consequences

- Installing is copying one file into REAPER's Effects folder.
- A ReaScript cannot produce audio in real time; a JSFX can, and runs in
  REAPER's own EEL2 JIT, so CPU cost is predictable (8-note chords take
  3–14 % of a core; see the session log).
- EEL2's limits apply everywhere: no scientific notation, case-insensitive
  names, inlined functions defined before use, one global namespace shared by
  the audio and window threads (CLAUDE.md lists the traps).
- The file is large (about 2000 lines). Sections are ordered: memory map,
  materials, physics helpers, elements, voices, exciters, shared stages, GUI,
  then `@slider`, `@block`, `@sample`, `@gfx`.

## Alternatives considered

- **ReaScript (Lua) + a JSFX**: a script could build the window with more
  freedom, but would need two files and a way to talk to the audio side.
- **A compiled plugin (VST/CLAP)**: better UI toolkits, but it needs building
  per platform, which the user cannot do.

# 0026. An Ableton device with the DSP translated to gen~

Taken 2026-11-10. Stands.

## Context

The user is moving from REAPER to Ableton Live and asked for every family REAPER project as Max for Live, each on its own branch. A JSFX cannot be loaded in Live, and Max's JavaScript cannot run on the audio thread, so the DSP has to become gen~ code.

## Decision

`ableton/` holds a Max for Live device whose sound is gen~ code translated from the `.jsfx` by `ableton/kit/jsfx2gen.js`, on the parser and the rules of Middaw's EEL2 runtime: every variable in one Data, EEL2's memory in another, a GenExpr function per EEL2 function and namespace, every effect a statement in JavaScript's order. @init (and @slider) run once, @slider again when a Param moves, @block every 32 samples, @sample between [plugin~] and [plugout~]. The plug-in's own window runs beside it on Middaw's runtime (@init, @slider and @gfx only, drawn by `ableton/kit/gfx.js`) and sends gen~ what its sliders say, with Live's tempo and transport.

The translation is held to the runtime: the tests read the gen~ code back out of the built `.maxpat`, run it as JavaScript (`ableton/kit/test/genexpr.js`) beside the runtime running the `.jsfx`, and compare every sample. Notes reach gen~ through a buffer~ the window writes, read by the plug-in's own `midirecv` loop; the window's Play C4 (`aud_req`) is answered by the device, which sends the note the same way.

## Consequences

- The gen~ code is generated at build time from the `.jsfx` in the repository root: a fix to the plug-in reaches the device by rebuilding, and the build needs `node`.
- Strings and files are not on the audio thread; their functions do nothing in gen~. What the window needs from them it does in its own copy.
- A meter or display the window draws from the sound itself stays still: the window's copy does not hear the audio.
- Nothing here has been opened in Live, and gen~ has not compiled this code. The tests prove the translation's meaning, not that gen~ accepts every line.

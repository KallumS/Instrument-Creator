# Architecture decision records

One record per design decision that shaped Instrument Creator. Read the
relevant record before changing a rule it sets; add a new record (next
number) when making a new one, and mark an old one *Superseded by NNNN*
rather than deleting it.

Format: Context (why a decision was needed), Decision, Consequences, and
where useful the alternatives that were rejected.

| # | Decision |
|---|---|
| [0001](0001-a-single-file-jsfx-instrument-not-a-reascript.md) | A single-file JSFX instrument, not a ReaScript |
| [0002](0002-ten-part-categories-mapped-onto-one-signal-chain.md) | Ten part categories mapped onto one signal chain |
| [0003](0003-derive-every-sound-from-physical-constants.md) | Derive every sound from physical constants |
| [0004](0004-waveguides-for-strings-and-air-columns-modes-for.md) | Waveguides for strings and air columns, modes for everything else |
| [0005](0005-sustaining-exciters-are-passive-reflection-funct.md) | Sustaining exciters are passive reflection functions |
| [0006](0006-banded-waveguides-when-a-sustaining-exciter-driv.md) | Banded waveguides when a sustaining exciter drives a modal element |
| [0007](0007-only-the-exciter-and-the-element-form-a-feedback.md) | Only the exciter and the element form a feedback loop |
| [0008](0008-fit-loss-filters-at-the-fundamental-not-at-dc.md) | Fit loss filters at the fundamental, not at DC |
| [0009](0009-tune-by-phase-then-measure-and-remove-each-excit.md) | Tune by phase, then measure and remove each exciter's pitch pull |
| [0010](0010-stiffness-has-a-budget-and-bows-have-their-own-r.md) | Stiffness has a budget, and bows have their own rules |
| [0011](0011-level-match-by-measurement-then-limit.md) | Level-match by measurement, then limit |
| [0012](0012-a-window-drawn-entirely-in-code.md) | A window drawn entirely in code |
| [0013](0013-verify-headlessly-with-ysfx-including-the-window.md) | Verify headlessly with ysfx, including the window |
| [0014](0014-keep-memory-regions-disjoint-and-indices-append.md) | Keep memory regions disjoint, and indices append-only |
| [0015](0015-playable-beats-physically-exact-for-extreme-mate.md) | Playable beats physically exact for extreme materials |
| [0016](0016-rattle-and-crackle-as-feed-forward-effects-gated.md) | Rattle and crackle as feed-forward effects gated by level |
| [0017](0017-the-reed-always-plays-a-cylinder.md) | The reed always plays a cylinder |
| [0018](0018-age-is-one-macro-over-the-existing-physics.md) | Age is one macro over the existing physics |
| [0019](0019-every-control-in-the-window-reaper-sliders-hidden.md) | Every control in the window, REAPER's slider list hidden |
| [0020](0020-rendered-pictures-in-a-folder-drawings-as-fallb.md) | Rendered pictures in a folder, drawings as the fallback |

Related: Reverberator's ADRs 0001 (JSFX first), 0002 (physical constants),
0005 (dispersion budget), 0007 (loudness), 0008 (feed-forward nonlinear paths),
0009 (headless ysfx) and 0010 (EEL2 naming) are the ancestors of 0001, 0003,
0010, 0011, 0007/0016, 0013 and the CLAUDE.md traps.

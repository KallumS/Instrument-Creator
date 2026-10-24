# 0024. The whole instrument as one line drawing, labelled round it

- Status: Accepted
- Date: 2026-10-24
- Supersedes: [0020](0020-rendered-pictures-in-a-folder-drawings-as-fallb.md)
  (the 3D pictures are no longer used)
- Amends: [0001](0001-a-single-file-jsfx-instrument-not-a-reascript.md) (one
  file again), [0012](0012-a-window-drawn-entirely-in-code.md) (drawn in code
  again, as one drawing), [0021](0021-one-diagram-materials-in-menus-four-controls-und.md)
  (the tiles and their menus give way to labels and a picker),
  [0023](0023-apples-hig-foundations.md) (its rules apply to the new parts;
  the missing-pictures message is gone)

## Context

The user liked the sound and the 3D renders, but found the window cluttered
and confusing: ten tiles in a grid, each with a picture, a caption, a name
and a material, joined by arrows. They asked whether the instrument could be
shown whole, with its pieces swapped as they are chosen and the labels round
it, and asked for a mock-up first.

The first mock-up used the 3D renders, arranged as an exploded view along
the signal chain. Each render had been framed for its own tile, from its own
camera, so they read as a collage, not one instrument. A render per
combination (6 × 6 × 6 × 5 × 4 × 4 × … in 31 materials) is out of reach. The
user then asked for a drawn wireframe that changes with the parts. They
approved the second mock-up (an interactive canvas, 24 October 2026), asked
to set the renders aside for now, and asked for the final window to look
modern and polished and to follow Apple's guidelines as the Good Idea repo
applies them.

## Decision

- **One line drawing of the whole instrument**, built in code from the
  twelve choices (`wf_build` and the `wf_*` part builders before `@slider`).
  Every part is a few polylines in a drawing space 900 wide and 360 tall:
  boxes and tubes seen a little from above and the right, ellipses for round
  ends, edges hidden behind a part drawn dashed. Parts are coloured by their
  group (energy and exciter orange, element blue, resonator, coupler and
  radiator green, the controls purple), the colours the tiles used.
- **The coupler decides the build.** A mouthpiece or a windway joins the
  parts end to end, like a wind instrument ("in a line": energy, exciter,
  coupler, element, resonator, radiator along one axis). A bridge or a
  soundpost holds the element over the body, like a guitar or a marimba ("in
  layers": the element across the top, the coupler under it, the resonator
  below, the exciter coming from above). The controls sit where they act:
  tone holes, frets and valves on the element, the tuning at its end, a mute
  or a hand in the bell, pedals and electronics underneath. The close-up says
  which build the coupler gives.
- **Built once, drawn every frame.** The drawing is rebuilt into a list of
  segments (`WF_GEO`, window-only memory at 700000) when a part changes,
  here, by a preset or by automation. Each frame draws it with antialiased
  lines that grow with the interface size (1.4 px at 100%, 2.4 for the part
  in hand). It is shown at one scale per build (the area 20,000 random
  instruments reach), so swapping a part never resizes the rest.
- **Labels round the drawing**, one per part, in a row above it or a row
  below it, each as near over its part as the others allow, with a line to
  the nearest point of the part. A label is a rounded card with a tab in its
  group's colour, the kind of part, the option and (for the element,
  resonator, coupler and radiator) the material. When a row is short of room
  the labels shorten their captions, then the name's font, then drop the
  caption; a name is never cut. The part in hand (hovered, focused, picked or
  last changed) is drawn heavier, its tab runs the width of its label and its
  label and line take its colour.
- **The picker.** Clicking a label or a part (or Return or Space on a label)
  opens a raised panel beside its label with every option of that part, each
  drawn on this instrument and framed on the part, the one in use edged in
  its colour with a bar under its name. Choosing one applies it at once and
  leaves the picker open, so options can be played and compared; Done, Esc
  or a click elsewhere closes it. Parts made of a material add *Made of*, a
  menu of the 31 materials. While it is open the picker has the mouse and the
  keyboard to itself (Tab cycles inside it; a click elsewhere only closes
  it), and the close-up shows the option under the mouse or the focus.
  Scrolling over a label or a part still steps it, and the arrow keys on a
  label still step it.
- **Modern and polished, within Apple's rules.** Buttons, cells, labels, the
  picker and the close-up have round corners (antialiased); the picker is
  lighter than the window, as Apple's raised dark surfaces are, with a soft
  shadow; the focus ring is rounded too. Every rule of ADR 0023 holds for the
  new parts: 7:1 words, edges 3:1 on what is round them (the picker's cells
  and buttons use the lighter edge grey, 3.5:1 on its surface), 28 px
  targets 12 apart, sizes through `gsc`, words through `say()`, focus in the
  order drawn, a second cue on what is chosen. The family's shared choices
  are the Good Idea repo's `docs/apple-hig-review.md`; the house colour scheme
  there (`docs/COLOUR.md`) is not adopted, as before: this window keeps its
  own palette.
- **The 3D pictures are set aside.** The plugin no longer loads
  `Instrument-Creator-images/`, and the folder is removed from the repository
  (it is in the history, and `tools/render_parts.py` and the `.blend` files
  in `blender/` can make it again). The old vector drawings (`draw_part`,
  `draw_mat`) and the missing-pictures message go with it.
- The element trembles while it sounds (a sine bow along its length, about
  1.4 swings a second); Reduce Motion stills it. The scope keeps moving.

## Consequences

- Installing is one file again.
- No slider, option list, range or sound changes: four instruments render
  sample-identical to the version before.
- Window-only memory: `CAT_TAB` (14200, each part's box, anchor and label,
  12 × 16) replaces the picture cache; 690000-875000 holds the drawing's
  transform stack and buffers (690000), the instrument (700000) and the
  picker's six versions (725000, 25000 each). The audio thread never touches
  them.
- A new option needs a builder in the right `wf_*` function, for both builds,
  and a look at it in the picker; there are no pictures to render.
- `tools/hig_check.py` checks the labels, the drawing (its lines 3:1, growing
  with the size), every picker (contrast, sizes, spacing, edges, inside the
  window at 800 × 480 and 200%), the picker's keyboard and mouse, and that it
  is lighter than the window; `tools/hig_bite.py` breaks each new rule on
  purpose. `tools/hig.cpp` prints the parts' boxes, anchors and labels
  (`cats`).
- **Unverified in REAPER**: the drawing's speed (a few thousand antialiased
  lines a frame; the picker adds six small drawings), and how the round
  corners and the 1.4 px lines look on the user's Retina screen.

## Alternatives considered

- **The 3D renders as an exploded view** (the first mock-up): kept the
  pictures the user liked, but the separate cameras made a collage.
- **Re-render every part in one shared Blender scene**, each in a fixed slot,
  so the layers line up: still a collage at the joins, a second set of
  hundreds of renders, and no way to show the layered build.
- **REAPER's menus for the options**, as the tiles had: native, but text
  only; the picker shows each option on the instrument, which is the point.

# 0020. Rendered pictures in a folder, drawings as the fallback

- Status: Accepted
- Date: 2026-10-08
- Amends: [0001](0001-a-single-file-jsfx-instrument-not-a-reascript.md) (no
  longer one file only), [0012](0012-a-window-drawn-entirely-in-code.md)
  (the drawings become the fallback)

## Context

The user was happy with the sound but not with the part pictures (the EEL2
vector drawings of ADR 0012), and asked for 3D renders, or failing that
better drawings. JSFX can show PNGs: `gfx_loadimg(slot, "path")` loads a file
relative to the effect's own folder (then REAPER's Data folder) into one of
128 image slots of up to 2048×2048, and `gfx_blit` scales it with alpha.
Blender installs as a Python module (`pip install bpy`) and renders headless
with Cycles on the CPU, so the models can be built by a script and re-rendered.

The parts made of a material (element, resonator, coupler, radiator, and the
material swatches) change with the material, so a picture per shape is not
enough: tinting a grey render cannot make glass transparent, metal reflective
or chain link a mesh.

## Decision

- `tools/render_parts.py` builds every option of every part from primitives
  (lathes, extruded outlines, tubes, booleans), with 31 procedural materials
  using the plugin's colours, in one studio (gradient world, key, fill and two
  rim lights so edges show on the dark window), and renders 360×240 RGBA PNGs
  into `Instrument-Creator-images/`: one per option for parts without a
  material, one per option × material for the four that have one, 31
  swatches, and one patchy-rust layer per material shape. The camera is fitted
  to each shape, not each material, so all versions of a shape line up with
  each other and with their rust layer.
- `picture()` in `@gfx` replaces the direct `draw_part()` calls. Each category
  owns eight image slots from `IMG_SLOT` (the picture and three halvings, then
  the same for its rust layer); `IMG_TAB` (12 × 8, window only) remembers
  which file each holds and whether it loaded. A file is loaded when its
  category's choice changes, so at most 18 pictures are in memory. The
  halvings are made once, with `gfx_blit` at exactly ½ into a fresh slot;
  `img_blit` draws from the smallest halving that is still at least the
  target size, so a 50 px list icon is not a 7× aliased downscale.
- Age fades the rust layer in over the part (alpha `age·0.9` for metals,
  `age·0.5` otherwise), the image counterpart of `gmat`'s tint. The element's
  picture, in its tile and the preview, gets two faint copies offset up and
  down by up to 6 % of the box while it sounds, in place of the drawn wobble.
- If a file is missing or fails to load, `picture()` calls `draw_part()`, so
  the plugin still works as a single file; a failed load is remembered and not
  retried every frame.

## Consequences

- Installing is copying a file and a folder into the same Effects folder.
- About 670 PNGs (see the session log for the size). Adding an option or a
  material means adding a builder to `render_parts.py` and rendering it as
  well as drawing it in `draw_part()` (the fallback must stay complete).
- The picture cache is window-only state in memory at `IMG_TAB` (14200-14295)
  and in image slots 10-105; the audio thread never touches either.
- Pictures no longer animate except the element's shake; breath, electronics
  and the drawn wobble animate only in the fallback.

## Alternatives considered

- **Tint one grey render per shape** with `gfx_muladdrect`: 50 files instead
  of 670, but every material would look like painted plastic.
- **Sprite sheets** loaded through `filename:` lines: fewer files, but ysfx
  (and, we believe, REAPER) loads every `filename:` PNG when the window opens:
  about 100 MB of pixels for the whole set.
- **Better vector drawings**: no install change, but nowhere near a render.

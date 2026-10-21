# 0022. The window's text follows Apple's writing guidelines

- Status: Accepted
- Date: 2026-10-14

## Context

The user asked for the text in all of their apps and plugins to follow
Apple's Human Interface Guidelines on writing
(developer.apple.com/design/human-interface-guidelines/writing), as done for
Noterator and Miderator (Noterator's decision 0053). Instrument Creator's
part and material names mixed styles ("Air column" beside "Machine head"
beside "PVC"), control names were in sentence case ("Glide time"), a button
read "Surprise me", "Playing..." used three full stops, and the descriptions
had straight quotes and apostrophes.

## Decision

- **Names and labels** in title-style capitalization: parts and materials
  (in the tiles, the menus, the preview panel and the sliders' lists — "Air
  Column", "Tone Hole", "Carbon Fibre", "Handpan Steel"), controls ("Glide
  Time", "Age / Rust"), slider names (REAPER shows them in automation and
  parameter lists although they are hidden), buttons ("Surprise Me") and the
  plugin's description line. Units in brackets stay as written.
- **Descriptions, hints and the subtitle** in sentence case; whole sentences
  end with a full stop.
- **Typography**: "…" as one character ("Playing…"), curly quotes and
  apostrophes (“bridge hill”, Trombolese’s), an em dash between phrases,
  "kg/m³", no space before % ("70%"). Modifier keys and the wheel are named
  in words ("hold Shift", "scroll"), since the plugin runs on Windows too.
- Category captions and the heading over the diagram keep their capitals,
  a deliberate look.

## Consequences

- No slider is renumbered, reordered or re-ranged, and the option lists keep
  their order (ADR 0014): saved projects, presets and automation are
  untouched. Picture files are named by number, so none changes.
- `draw_wrapped` copies the text a byte at a time with `strcpy_substr`
  rather than rebuilding each character with `sprintf("%c")`, so UTF-8
  letters survive whatever sign `str_getchar` gives a byte above 127.
- `tools/analyse.py` follows the new names. `tools/render_parts.py` keeps
  its own names for the Blender materials inside the `.blend` files; they
  are not shown in the plugin.
- New text follows the same rules; screenshot the window to check it fits.

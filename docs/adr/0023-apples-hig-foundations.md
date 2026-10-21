# 0023. The window follows the rest of Apple's HIG Foundations

- Status: Accepted
- Date: 2026-10-15
- Amends: [0019](0019-every-control-in-the-window-reaper-sliders-hidden.md)
  and [0021](0021-one-diagram-materials-in-menus-four-controls-und.md) (the
  controls move from the bottom of the window to the top; cells 44 px tall,
  12 apart)

## Context

After the writing guidelines (ADR 0022), the user asked for the window to
meet the rest of Apple's Human Interface Guidelines "Foundations", as
Transient Shuffler already does (its decision 0010). Checked against the 19
pages (`docs/apple-hig-review.md`), the window fell short in several places:
captions, hints and secondary words at 3.7 to 6.8:1 on their grounds and the chosen blue button
at 4.8:1; no keyboard use at all (the script never called `gfx_getchar`);
fixed sizes in Arial; every control along the bottom edge, which Apple
says to avoid because a window's bottom often ends up below the screen; the
chosen half of Play Mode marked only by colour; header buttons 8 px apart and
control cells 6 px apart; and no way to still the drawings' wobble and the
element's shake.

## Decision

- **Contrast.** Every line of text is at least **7:1** on the pixels it is
  drawn on. Apple's minimum for text up to 17 pt is 4.5:1; 7:1 is the
  family's bar (Transient Shuffler, the ReaImGui family's 0009), and it
  stands in for Increase Contrast, which a JSFX cannot read. The colours are
  named constants at the top of `@gfx` (`T_MAIN`, `T_BODY`, `T_DIM` #B0B6C0,
  `T_LABEL` #C4C9D2 for tiles and cells because they are lighter when
  hovered, `T_HINT`, `T_AGE`, `T_ELEM`/`T_RES` for material names, a lighter
  version of their group's hue); the chosen blue darkens from #426BA8 to
  #2B4C80. The window keeps its own palette (it was never on the house
  scheme), only lifted where it fell short. Every word goes through `say()`,
  which lets the test host measure each string against the real pixels under
  it, the pictures included.
- **Interface size.** **Options → Interface Size** 100%, 125%, 150% or 200%.
  Every size in the window goes through one factor, `gsc` = Retina × the
  interface size. The layout still fits: the controls wrap onto more rows when
  a row would be too narrow, a short part tile keeps its name first, then its
  material, then its caption, and its picture gives way before its words; when
  the parts are short of room the preview panel gives way to them. At 200% the
  window needs enlarging to show everything (about 1880 × 1440 to look as
  940 × 720 does at 100%); in a smaller window it runs off the bottom rather
  than overlapping.
- **The system font**: San Francisco (`.AppleSystemUIFont`) on a Mac, Segoe
  UI on Windows, Arial otherwise, chosen by asking `gfx_getfont` which face it
  actually got (Transient Shuffler's `pick_font`). Nothing under 10 px at 100%.
- **Controls**: header buttons 28 px tall and as wide as their labels need,
  control cells 44 px tall, all 12 apart; part tiles at least 28 px tall and
  12 apart. Two smaller targets are deliberate, both above Apple's macOS
  minimum of 20 pt and both with another way to do the same thing: the
  material name (24 px tall; also in the part's menu) and the hover-only step
  arrows (24 px each, a pair like a stepper; also the wheel, the menu and the
  arrow keys).
- **Names are never cut short.** The old `ctl_tiny` names ("Pos.", "Res.")
  are gone. Where a row of controls cannot show each short name beside its
  widest value, the whole row puts its values at the end of the tracks.
- **The keyboard alone.** Tab and Shift+Tab move a near-white ring (#F2F4F7,
  not the accent) through every button, control and part in the order they
  are drawn: the header, the message's Dismiss, the controls and More, then
  the parts the way the diagram's arrows go. Return or Space presses a
  button, opens a part's menu (materials under *Made of*) or switches Play
  Mode; the arrow keys step a part's options or move a control (Shift finer);
  Delete or Backspace puts a control back; Esc lets go. A click takes over
  from the keyboard. The preview panel follows the focus and says which keys
  work. `options:want_all_kb` stays off: this is a played instrument.
- **Not colour alone**: the chosen half of Play Mode and the Playing… button
  carry a bar under their word as well as their colour.
- **Top, not bottom**: the instrument's name and the buttons, then a message
  bar when there is something to say, then the controls; the diagram and the
  preview below. The plugin's own title is gone (REAPER's title bar already
  says it); the instrument's name takes its place.
- **No time-boxed messages**: the one message (the pictures were not found,
  and where the folder goes) stays until *Dismiss*.
- **Reduce Motion** (in Options) stills the fallback drawings' wobble and the
  element's shake while it sounds. The scope keeps moving: it is the sound.
- The interface size and Reduce Motion are **saved with the project** in a new
  `@serialize` (window-only variables, never slider values, so presets and
  automation never touch them). An older project reads back as 100% with
  motion on.

## Consequences

- No slider, option list or sound changes; four instruments render
  sample-identical to the version before. Two window-only memory regions are
  added (14400 focus list, 14800 text audit; memory map in CLAUDE.md).
- `tools/hig.cpp` drives the window with keys and reads the focus list, and
  `tools/hig_check.py` holds every rule above (139 checks). Each was broken on
  purpose in a scratch copy and watched to fail (30 sabotages, `tools/hig_bite.py`); two first
  missed and the suite grew a check for each.
- ysfx needed two fixes to stand in for REAPER here, made in
  `tools/build_host.sh`: it packed named keys (`'left'`) the other way round
  from EEL's constants, and reported Shift only while a mouse button was down.
- **Not met, because a JSFX cannot:** VoiceOver, Voice Control and Switch
  Control cannot read a window a JSFX draws itself (every setting is still a
  REAPER parameter, reachable in the FX parameter list, for example with
  OSARA); Dynamic Type, Increase Contrast, Reduce Motion and Full Keyboard
  Access in the system settings cannot be read, so the plugin has its own
  Interface Size and Reduce Motion; the window cannot follow the system's
  light appearance; it cannot be translated.
- **Unverified in REAPER**: whether REAPER passes Tab, Return, Space and the
  arrow keys to the window without *Send all keyboard input to plug-in*
  (Space is likely to start the transport); what `gfx_getfont` names on macOS
  and Windows; the layout at each interface size on the user's Retina screen;
  saving the preferences with a project.

## Final sweep (21 October 2026)

A last pass through every Foundations page, with AutoCC and Reese Basser
(`docs/apple-hig-review.md`, *Final sweep*, has one verdict per guideline).
Four rules were added; each is checked by `tools/hig_check.py` (now 193
checks) and was broken on purpose in a copy to watch it fail (19 new cases
in `tools/hig_bite.py`, all caught).

- **Every control's boundary is 3:1.** Buttons, part tiles, control cells
  and More are outlined in `#6D7581` (3.7:1 on the window; before, the
  buttons' edge was 2.2:1 and the rest had none, their fills 1.1:1). What
  sits inside a cell (a slider's track, Play Mode's halves) is outlined in
  `#80879A`, 3.5:1 even on a hovered cell. Outlines, the diagram's arrows
  and the scope's line grow with the interface size.
- **The interface size fits the window.** The window cannot scroll, so a
  size it cannot hold is drawn as large as it can (the layout needs
  800 × 480 at 100%), never below 100%; Options keeps the chosen size and
  says in a greyed line what it is shown at. This replaces "the layout
  degrades in order" above for sizes over 100%.
- **Replacing the whole instrument leaves an undo point either side.** A
  preset or Surprise Me calls `sliderchange(-1)` in the frame that asks,
  makes the change next frame and calls it again, so Edit → Undo in REAPER
  puts back the old instrument. Nothing asks first, because browsing presets
  is the main use. Single parameter changes are left to REAPER's own undo.
- **Nothing is cut short.** No "…"; `draw_wrapped` counts lines it had to
  leave out, and every description is checked whole at four sizes. A tile's
  lines keep 5 px clear of its edge.

Already met and unchanged: Esc lets go of focus first; menus are REAPER's
own; nothing flashes (the wobble is about 1.4 swings a second, smooth);
Reduce Motion stills all decoration; the system font is asked for and
confirmed through `gfx_getfont`. Not possible in a JSFX: a minimum window
size, and knowing whether the window is key.

No sound code changed. Unverified in REAPER: whether `sliderchange(-1)`
from `@gfx` makes the undo points as REAPER's documentation says, how the
fitted sizes look on the user's Retina screen, and the font REAPER gives.

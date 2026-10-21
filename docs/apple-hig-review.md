# Review against Apple's Human Interface Guidelines: Foundations

This review checks Instrument Creator's window against all 19 Foundations
pages (October 2026), as Transient Shuffler's review does for that plugin.
Apple's pages are not copied here (they are Apple's copyrighted text); each
rule is referred to by its page. The decision is
[ADR 0023](adr/0023-apples-hig-foundations.md); the writing guidelines were
done earlier, in [ADR 0022](adr/0022-the-windows-text-follows-apples-writing-guidelines.md).

The plugin draws its own window inside REAPER, so some guidance can't apply.
A JSFX can't reach macOS accessibility features (VoiceOver, Dynamic Type,
Increase Contrast, Reduce Motion, Full Keyboard Access), and can't read the
system's appearance. Where a guideline couldn't be met for that reason, this
review says so rather than counting it as met.

## What changed

| Guideline | Before | Now |
| --- | --- | --- |
| **Accessibility, Color: contrast** | Captions on the parts were 4.5:1 (3.8:1 when hovered), the preset name 5.6:1, the material facts line 6.1:1, the age note 5.5:1, Poly or Mono when not chosen 5.5:1, control names 6.7:1 when hovered, the element's material name 6.8:1 when hovered, and the chosen (blue) button's label 4.8:1. | Every line of text is at least 7:1 on the pixels it is drawn on, measured on the real window in 34 states and sizes, the 3D pictures included. Apple's minimum for small text is 4.5:1; the stricter 7:1 stands in for Increase Contrast, which a JSFX can't read. The lowest now is 7.6:1. |
| **Accessibility, Typography: larger text** | Fixed sizes. | **Options → Interface Size**: 100%, 125%, 150% or 200%, saved with the project. Every word, control and picture grows by the same factor. |
| **Typography: system font, sizes** | Arial. | San Francisco on a Mac, Segoe UI on Windows, Arial otherwise; the plugin asks which face it actually got. Body text 13 px, nothing under 10 px. |
| **Typography: keep truncation to a minimum** | Narrow controls showed "Pos.", "Res.", "Bright", "Out". | Names are never shortened to a stub. A row that is short of room puts each value at the end of its slider, and the controls wrap onto more rows when the window is narrow. A short part tile shrinks its picture, or drops it, before its words. |
| **Accessibility: keyboard alone** | Mouse only. | Tab and Shift+Tab move through every button, control and part, with a near-white ring. Return or Space presses a button, opens a part's menu (materials included) or switches Play Mode; the arrow keys step a part or move a control (Shift for small steps); Delete puts a control back; Esc lets go. The close-up panel shows what has the focus and which keys work. |
| **Layout (macOS): nothing important at the bottom of a window** | The controls ran along the bottom edge. | The buttons and controls are at the top; the diagram and the close-up panel are below them. |
| **Accessibility: control size and spacing** | Header buttons 28 px tall but 8 px apart; control cells 40 px tall, 6 px apart; the part tiles' step arrows 20 px. | Buttons 28 px tall and never narrower than their labels; control cells 44 px tall; everything 12 px apart. The hover-only step arrows and a part's material name are 24 px, above Apple's 20 pt minimum, and both have other ways in (the wheel, the menu, the keys). |
| **Color, Accessibility: not colour alone** | The chosen half of Play Mode, and Play C4 while playing, were shown only by blue. | Both also carry a bar under their word. |
| **Accessibility: time-boxed elements; Writing: say what to do** | There were no messages; a missing picture folder silently gave drawings. | A message at the top says the pictures weren't found and where the folder goes. It stays until **Dismiss**. |
| **Motion: Reduce Motion** | The drawings wobbled and the element shook while it sounded, always. | **Options → Reduce Motion** stills both. The little waveform screen still moves, because it is the sound itself. |
| **Branding: defer to content** | A large "Instrument Creator" title repeated REAPER's own title bar. | The instrument's name ("Bamboo Saxophone", or "Your Own Instrument") takes its place. |

## Already met

- **Design principles.** One window, read top to bottom; every part and
  control has a close-up that says what it does; nothing is destructive
  (REAPER's Undo covers every change, as they are parameter changes), and
  every choice can be undone by choosing again.
- **Feedback.** Hovering lights a tile, cell or button; the close-up panel
  follows the pointer or the focus; Play C4 says *Playing…* while it plays.
- **Every gesture has another way**: dragging a control (the wheel, the
  arrow keys), double-clicking to reset (Delete), the hover-only arrows (the
  wheel, the menu, the arrow keys), clicking a material name (the part's
  *Made of* menu).
- **Hierarchy.** The diagram's arrows show the order the energy flows, and
  Tab follows them. Group colours mark which kind of part a tile is, and the
  tile also says so in words.
- **Dark Mode.** The window is always dark, as Apple allows for apps built
  around media; a JSFX can't read the system's appearance.
- **Privacy.** Nothing is collected or sent. The only things stored are the
  sliders (by REAPER) and the interface size and Reduce Motion (in the
  project).
- **Writing.** Done in ADR 0022; new words follow it ("Interface Size",
  "Reduce Motion", "Dismiss", sentence-case hints).

## Not met, because a JSFX can't

- **VoiceOver, Voice Control and Switch Control** can't read a window a JSFX
  draws itself. Every setting that changes the sound is also a REAPER
  parameter, which a screen reader can reach through the FX parameter list
  (for example with the OSARA extension), with the names in the sliders'
  lists.
- **Dynamic Type, Increase Contrast, Reduce Motion and Full Keyboard Access
  settings** can't be read. The plugin's own Interface Size, 7:1 text, Reduce
  Motion and keyboard use stand in for them.
- **The keyboard in REAPER.** Without *Send all keyboard input to plug-in*,
  REAPER may keep some keys for its own actions (Space usually starts
  playback). Return does everything Space does. The plugin doesn't turn
  that option on itself, because it's an instrument you play while the
  transport runs.
- **Right to left.** A JSFX can't be translated, so the window is English
  only. The diagram runs the way the instrument's energy flows.

## Not relevant

Materials (Liquid Glass), App icons, Icons and SF Symbols (beyond the small
arrows), Images (the part pictures are content, made by
`tools/render_parts.py`), Spatial layout and Immersive experiences.

## Checked by

- `python3 tools/hig_check.py` (139 checks, about a minute) drives the real
  window through `tools/build/hig`, a headless host built on ysfx:
  - contrast of every string against the pixels under it, in 34 states: each
    tile and material hovered, More open, keyboard focus, Age at 100%,
    twenty random instruments, all 19 presets, every control at its widest
    value at every window width from 960 to 1600 px, 800 × 480, each interface
    size, Retina, and without the pictures;
  - no string drawn over another, none off the window, none past its control;
  - every control 28 px tall or more and 12 px from its neighbours;
  - 200% drawn as 100% doubled, and Retina exactly as 200%;
  - Tab's order and Shift+Tab, Esc, a click taking over, Return and Space on
    each kind of control, the arrows, Shift, Delete and Backspace;
  - the focus ring; the bars on chosen things; the controls in the top
    quarter; the message staying for 300 frames and going with Dismiss;
    Reduce Motion stilling the drawings and the shake; the preferences saved
    and restored; the fonts.
- Each rule was broken on purpose in a scratch copy and the checks watched to
  fail (30 sabotages in `tools/hig_bite.py`, all caught; two were missed at first and each gained a
  check).
- Screenshots looked at: 940 × 720 (with More, with keyboard focus), 800 ×
  480, 200% in 1880 × 1440 and in 940 × 720, Retina, and without pictures.
- **None of this has been run in REAPER.**

## Final sweep (21 October 2026)

Every guideline the shared checklist marks as doable in a window a plug-in
draws itself was taken back to its Foundations page and decided for this
window, alongside the same sweep in AutoCC and Reese Basser. Contrast is
WCAG's ratio at 100%, measured on the real `@gfx` drawing in ysfx.

### Fixed now

| Guideline (page) | Before | Now |
| --- | --- | --- |
| Non-text contrast of controls (Accessibility; Color; Dark Mode) | The buttons' edge `#4D5261` was 2.2:1 on the window. The part tiles, the control cells and More had no edge at all: their fills are 1.1:1 on the window, so only the coloured strip showed where a tile or cell was. | One edge colour, `#6D7581` from the house ramp: 3.7:1 on the window round every button, tile, cell and More (3.2:1 on a tile's own fill). It thickens at larger sizes. |
| Non-text contrast inside a control (Accessibility; Color) | A slider's empty track was `#17181C`, 1.2:1 on its cell, so a control at its lowest showed only the knob; Play Mode's unchosen half was 1.1:1 on the cell. | Both are outlined in `#80879A`, the grey the step arrows already use: 4.2:1 on the cell, 3.5:1 when it is hovered. |
| Marks grow with the text (Accessibility; Typography) | The diagram's arrows were two pixels wide at every size, and the scope's line one. | Both grow with the interface size (the arrows 4 px at 200%). The arrows are 4.0:1 on the window, the scope's line 11:1 on its screen. |
| Adapt to the window; nothing out of reach (Layout) | An interface size the window could not hold ran off its bottom (200% needs about 1880 × 1440), and the window cannot scroll. | A larger size is drawn only as large as the window holds (the layout needs 800 × 480 points at 100%), never below 100%. Options keeps the size chosen ticked and adds a greyed line, "Shown at 118% Until the Window Is Larger"; the chosen size comes back when the window grows. |
| Make mistakes cheap to recover from (Design principles; Accessibility) | Choosing a preset or Surprise Me replaced every part at once. Whether REAPER's Undo could put the old instrument back depended on whether REAPER had kept an undo point for the changes before it. | The click adds an undo point (`sliderchange(-1)`, the JSFX way) before anything changes; the next frame makes the change and adds another. So **Edit → Undo** puts back the instrument as it was, controls included. The Presets menu says so in a greyed last line. Nothing asks first: trying presets one after another is the point, and a question each time would get in the way. A single part or control changed is one REAPER parameter change, which REAPER's own Undo already covers. |
| Words clear of edges (Accessibility; Layout) | On a short tile the three lines filled it to within 3 px of its top and bottom. | Lines keep 5 px clear of the tile's edge and its coloured strip; a tile too short for that drops its caption first, as before. Play Mode's bar sits on whole pixels below its word at any size (at sizes between the four, it touched it). |

### Already met

| Guideline | Why |
| --- | --- |
| Truncation (Typography; Layout) | No word is cut with "…" (the only "…" is *Playing…*, a whole word). A short tile or row uses a shorter name ("Position" for "Excite Position") or drops a line, and the close-up shows everything. New: every description of every part, material and control was measured whole in the close-up at four sizes. |
| Esc (house rule) | Esc lets go of the keyboard focus. The plug-in never closes its own window, and draws no popup of its own. |
| Menus lighter than the window (Dark Mode) | Every menu is REAPER's own (`gfx_showmenu`), drawn by the system. |
| System font (Typography) | `pick_font` asks for Segoe UI, then `.AppleSystemUIFont`, and keeps only what `gfx_getfont` says it got; Arial otherwise. |
| Reduce Motion (Motion; Accessibility) | It stills the drawings' wobble and the element's shake, the only decoration that moves. The scope is the sound. Hover changes are instant. |
| No flashing (Motion; Color) | Nothing blinks. The wobble is a smooth swing about 1.4 times a second; the shake is a blur that grows with the level, not a flicker; *Playing…* turns on once per press. |
| Colour never alone (Accessibility; Color) | Chosen things carry a bar; a part's kind is in words on its tile and in the close-up; the group colours only repeat it. |
| Hit targets (Accessibility) | Buttons 28 px tall; cells 44; tiles 28 or more; the step arrows and a material's name 24, each with another way in. |
| Text floor (Accessibility; Typography) | 10 px or more at 100%. |
| Every gesture has another way (Accessibility) | Drag: the arrows or the wheel; double-click: Delete; hover arrows: the wheel, the menu or the arrow keys. |
| Shortcuts (Accessibility) | Only Tab, Return, Space, the arrows, Delete and Esc, inside the window; `want_all_kb` stays off. |
| Sound (Accessibility) | Nothing plays by itself: Play C4 plays one note when pressed, and says *Playing…* with a bar while it does. |
| No time limits (Accessibility) | The one message stays until *Dismiss*. |
| Words (Writing; Inclusion) | No "we", "OK", "Oops", "Click here" or idioms; the new menu lines are in title style. |
| Dark only (Dark Mode) | A media tool, which the page allows; a JSFX cannot read the system's appearance. |
| Window title (Branding) | REAPER's FX window names the plug-in; the header names the instrument. |

### Not done, and why

| Guideline | Why |
| --- | --- |
| Picture frames | The pictures are content inside a tile; the tile's new edge is what shows the target. The close-up's picture and the scope's screen are not controls. |
| A minimum window size (Layout) | A JSFX cannot set one. Below 800 × 480 at 100% the parts shrink and the close-up gives way; nothing overlaps. |
| Show selection more softly when the window isn't key (Color) | A JSFX can ask whether its window has focus, but ysfx cannot answer, so it could not be checked; nothing chosen here is shown by colour alone. |
| Let people recolour (Accessibility; Color) | The group colours mean the four kinds of part; the house scheme is the user's decision. |
| VoiceOver, Dynamic Type, Increase Contrast, the system's Reduce Motion, appearance | Unchanged: out of a JSFX's reach (see above). |

### Not relevant

Icons, SF Symbols, Images, App icons, Materials, Spatial layout, Immersive
experiences, games, right-to-left, localisation, a light page, zebra rows.

### Checked by

`tools/hig_check.py` grew from 139 to 193 checks: every button, tile, cell
and More with an edge 3:1 on the window (at 100%, hovered and 200%); a
track at its lowest and Play Mode's unchosen half 3:1 on the cell, hovered
and not; the arrows 3:1 and twice as thick at 200%; no ellipsis; every
description whole in the close-up at four sizes; 200% drawn at what five
windows hold, with contrast, overlaps and spacing checked at six more;
Options' greyed line; and an undo point either side of a preset and of
Surprise Me (`tools/build/hig` now prints each one), and none for one part.
Each rule was broken on purpose in a copy (19 new cases in
`tools/hig_bite.py`) and the suite watched to fail. Screenshots looked at:
940 × 720 with More open, 200% in 940 × 720 (drawn at 118%) and in
1880 × 1440, and Retina. **None of this has been run in REAPER.**

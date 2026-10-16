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

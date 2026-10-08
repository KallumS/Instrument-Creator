# 0021. One diagram, materials in menus, four controls under More

- Status: Accepted
- Date: 2026-10-08
- Amends: [0012](0012-a-window-drawn-entirely-in-code.md) (the part list is
  gone), [0019](0019-every-control-in-the-window-reaper-sliders-hidden.md)
  (one row of controls, not two)

## Context

With the 3D pictures (ADR 0020) the user found the window busy and asked
what could go under a tab or into a menu. Every part was shown three times:
a row in the list on the left (icon, name, arrows), a tile in the diagram,
and the preview panel. Eleven controls filled two rows, four of them
(play mode, glide, fine tune, output) usually set once.

## Decision

- **The list goes; the diagram is the one place to choose parts**, across
  the whole width. Each tile (`tile()`) puts the picture on the left and the
  category, the option and (for the element, resonator, coupler and
  radiator) the material on the right. A click opens the part's menu; arrows
  appear in the top corner on hover; the wheel steps the option. The four
  control parts use the same tile, smaller.
- **Materials live in menus.** The material name on a tile is coloured with
  a ▾: click it for the 31 materials (`part_menu(3 or 5)`), roll the wheel
  over it to step, hover it to see the material in the preview panel. The
  part's own menu ends with a "Made of" submenu. Menu ids count items only
  (REAPER's `eel_lice.h` and ysfx's `ysfx_parse_menu.cpp` agree: separators
  and submenu headings take no id), so an id above the option count is a
  material.
- **Seven controls in one row** (Force, Size, Brightness, Decay, Position,
  Resonator, Age) and a **More** button that shows a second row with Play
  mode, Glide, Fine tune and Output (`more_ctl`, window-only, not saved).
- `@init` sets `gfx_ext_retina = 1`, which REAPER needs before it draws at
  full resolution on a Retina screen; the layout already scaled by `gsc`.
  Before this the window was drawn at 1× and enlarged by macOS.

## Consequences

- Each part appears twice (tile and preview), and the pictures are larger.
- Changing the resonator material from the coupler or radiator tile changes
  all three, as before; the README says so.
- `more_ctl` resets to closed when the window is reopened.
- Narrow windows: control names fall back from full to short to tiny
  (`ctl_tiny`); tile captions to `cat_short`, option names to the small
  font.

## Alternatives considered

- **Tabs** (Build / Play): would hide the controls while choosing parts or
  the parts while playing; both are wanted at once.
- **Keep the list, drop the diagram**: the list is compact, but the diagram
  shows how the parts connect and has room for the pictures.

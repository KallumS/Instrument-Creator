# Blender files

Every part picture in Instrument Creator is a 3D model. These are the models,
one `.blend` file per part option, plus `materials.blend`, a table of all 31
materials (and the rust layer used by Age). Open them in
[Blender](https://www.blender.org/) (version 4.2 or newer; they were saved
by Blender 5.2).

Each file is set up exactly as its picture was rendered: the same camera,
lights and transparent background. Press **F12** to render it.

- **Names** follow the window: `radiator-bell.blend` is the Bell radiator,
  `vibrating-element-air-column.blend` the Air column element, and so on.
- **Materials.** Parts made of a material (vibrating element, resonator,
  coupler, radiator) are saved in brass, and all 31 materials are inside the
  file. To try another one, click the part, open the **Material** tab
  (the red ball icon on the right) and pick a material from the list next to
  its name.
- **Rust** is the material called `rust`. In the plugin it is a separate
  picture faded in over the part as Age goes up.

These files are made by `tools/render_parts.py`, which builds every model
from code and renders the pictures the plugin uses. That script is the
original: if you change a model here in Blender, the plugin's pictures don't
change. Tell Claude what you changed (or share the edited file) and it can
be built into the script and re-rendered in all the materials.

To recreate this folder: `python3 tools/render_parts.py --blend`.

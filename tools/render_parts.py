"""Render the part pictures with Blender (pip install bpy).

    python3 tools/render_parts.py                 # everything (~45 min on 4 cores)
    python3 tools/render_parts.py 2_0 4           # only element option 0, every resonator
    python3 tools/render_parts.py --mats 12 0 2_0 # only bamboo and steel versions
    python3 tools/render_parts.py --samples 16 ...# quick draft
    python3 tools/render_parts.py --out DIR ...   # somewhere else
    python3 tools/render_parts.py --compress      # only re-compress what is in the folder
    python3 tools/render_parts.py --blend         # save every model as a .blend in blender/

Each PNG is compressed after rendering to a 256-colour palette with libimagequant
(pip install imagequant; the same method as pngquant), about 4x smaller with no
visible difference. Without imagequant the full-colour PNG is kept.

Writes Instrument-Creator-images/ next to the plugin:
    c<cat>_<opt>.png          parts that have no material (energy, exciter, controls)
    c<cat>_<opt>_m<mat>.png   parts made of a material (element, resonator, coupler, radiator)
    c<cat>_<opt>_rust.png     the same shape covered in patchy rust, faded in by Age
    mat<mat>.png, mat_rust.png  material swatches
Every model is built here from primitives, so the set can be re-rendered.
Category, option and material numbers are the plugin's slider values.
"""
import math, os, sys, time
import bpy, bmesh
from mathutils import Vector, Matrix
from bpy_extras.object_utils import world_to_camera_view

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "Instrument-Creator-images")
W, H = 360, 240
SAMPLES = 64

# the plugin's material table: name, colour (mat_def cr, cg, cb)
MATS = [
    ("Steel", (0.70, 0.74, 0.80)), ("Brass", (0.88, 0.72, 0.30)), ("Bronze", (0.74, 0.50, 0.26)),
    ("Aluminium", (0.84, 0.86, 0.88)), ("Gold", (1.00, 0.82, 0.25)), ("Glass", (0.62, 0.86, 0.94)),
    ("Crystal", (0.86, 0.78, 1.00)), ("Ice", (0.80, 0.93, 1.00)), ("Marble", (0.92, 0.90, 0.88)),
    ("Clay", (0.80, 0.45, 0.30)), ("Spruce", (0.90, 0.76, 0.50)), ("Rosewood", (0.55, 0.28, 0.16)),
    ("Bamboo", (0.80, 0.78, 0.42)), ("Bone", (0.95, 0.92, 0.82)), ("Gut", (0.90, 0.84, 0.66)),
    ("Nylon", (0.96, 0.96, 0.92)), ("Carbon fibre", (0.30, 0.31, 0.36)), ("Rubber", (0.80, 0.25, 0.22)),
    ("Paper", (0.86, 0.82, 0.72)), ("Jelly", (0.95, 0.25, 0.45)), ("Plastic", (0.20, 0.55, 0.90)),
    ("PVC", (0.90, 0.90, 0.86)), ("Wood", (0.78, 0.58, 0.36)), ("Leather", (0.48, 0.30, 0.17)),
    ("Cardboard", (0.70, 0.54, 0.36)), ("Foil", (0.86, 0.88, 0.91)), ("Cling film", (0.82, 0.92, 0.96)),
    ("Tin", (0.64, 0.68, 0.70)), ("Car panel", (0.78, 0.12, 0.15)), ("Chain link", (0.62, 0.68, 0.62)),
    ("Handpan steel", (0.36, 0.38, 0.44)),
]
NMAT = len(MATS)


# ---------------------------------------------------------------- colour
def lin(c):
    """sRGB 0-1 -> linear, for colours picked by eye."""
    return tuple(((x + 0.055)/1.055)**2.4 if x > 0.04045 else x/12.92 for x in c[:3]) + (1.0,)


# ---------------------------------------------------------------- scene
def reset_scene():
    bpy.ops.wm.read_factory_settings(use_empty=True)
    sc = bpy.context.scene
    sc.render.engine = 'CYCLES'
    sc.cycles.device = 'CPU'
    sc.cycles.samples = SAMPLES
    sc.cycles.use_adaptive_sampling = True
    sc.cycles.use_denoising = True
    sc.cycles.max_bounces = 10
    sc.cycles.transmission_bounces = 10
    sc.cycles.transparent_max_bounces = 16
    sc.cycles.film_transparent_glass = True
    sc.render.resolution_x, sc.render.resolution_y = W, H
    sc.render.resolution_percentage = 100
    sc.render.film_transparent = True
    sc.render.image_settings.file_format = 'PNG'
    sc.render.image_settings.color_mode = 'RGBA'
    sc.render.image_settings.compression = 100
    sc.view_settings.view_transform = 'Standard'
    sc.view_settings.look = 'None'
    sc.view_settings.exposure = 0
    # a studio: dark floor, bright ceiling, so metals have something to reflect
    w = bpy.data.worlds.new("studio"); sc.world = w; w.use_nodes = True
    nt = w.node_tree; bg = nt.nodes['Background']
    tc = nt.nodes.new('ShaderNodeTexCoord'); sep = nt.nodes.new('ShaderNodeSeparateXYZ')
    ramp = nt.nodes.new('ShaderNodeValToRGB')
    nt.links.new(tc.outputs['Generated'], sep.inputs[0])
    mr = nt.nodes.new('ShaderNodeMapRange'); mr.inputs[1].default_value = -1; mr.inputs[2].default_value = 1
    nt.links.new(sep.outputs['Z'], mr.inputs[0]); nt.links.new(mr.outputs[0], ramp.inputs[0])
    cr = ramp.color_ramp
    cr.elements[0].position = 0.35; cr.elements[0].color = (0.015, 0.016, 0.02, 1)
    cr.elements[1].position = 0.75; cr.elements[1].color = (0.55, 0.58, 0.65, 1)
    e = cr.elements.new(0.52); e.color = (0.12, 0.12, 0.14, 1)
    nt.links.new(ramp.outputs[0], bg.inputs[0]); bg.inputs[1].default_value = 0.8
    area((-4.5, -5.5, 6.5), 1400, 4.0)       # key, above left
    area((6.0, -3.5, 1.5), 450, 3.0)         # fill, right
    area((2.5, 7.0, 5.0), 1100, 3.0)         # rim, behind, so edges show on a dark window
    area((-6.0, 4.0, -1.0), 300, 3.0)        # a little from below behind
    cam = bpy.data.cameras.new("cam"); co = bpy.data.objects.new("cam", cam)
    sc.collection.objects.link(co); sc.camera = co
    cam.lens = 60; cam.sensor_fit = 'HORIZONTAL'; cam.sensor_width = 36
    return sc


def area(loc, power, size):
    sc = bpy.context.scene
    l = bpy.data.lights.new("a", 'AREA'); l.energy = power; l.size = size
    o = bpy.data.objects.new("a", l); sc.collection.objects.link(o); o.location = loc
    o.rotation_euler = (Vector((0, 0, 0)) - Vector(loc)).to_track_quat('-Z', 'Y').to_euler()


VIEW = Vector((0.42, -1.0, 0.5)).normalized()


def frame(view=None, margin=0.06):
    """Point the camera along view and fit every visible object into the frame."""
    sc = bpy.context.scene; co = sc.camera; cam = co.data
    d = (view or VIEW).normalized()
    dg = bpy.context.evaluated_depsgraph_get()
    pts = []
    for ob in sc.objects:
        if ob.type not in ('MESH', 'CURVE') or ob.hide_render:
            continue
        ev = ob.evaluated_get(dg); me = ev.to_mesh()
        pts += [ev.matrix_world @ v.co for v in me.vertices]
        ev.to_mesh_clear()
    lo = Vector([min(p[i] for p in pts) for i in range(3)]); hi = Vector([max(p[i] for p in pts) for i in range(3)])
    tgt = 0.5*(lo + hi); dist = 3.0*(hi - lo).length
    cam.shift_x = cam.shift_y = 0
    for _ in range(6):
        co.location = tgt + d*dist
        co.rotation_euler = (-d).to_track_quat('-Z', 'Y').to_euler()
        dg.update()
        pr = [world_to_camera_view(sc, co, p) for p in pts]
        x0 = min(p.x for p in pr); x1 = max(p.x for p in pr); y0 = min(p.y for p in pr); y1 = max(p.y for p in pr)
        cam.shift_x += 0.5*(x0 + x1) - 0.5
        cam.shift_y += (0.5*(y0 + y1) - 0.5)*H/W
        s = max((x1 - x0)/(1 - 2*margin), (y1 - y0)/(1 - 2*margin*W/H))
        dist *= s
    return


# ---------------------------------------------------------------- materials
def new_mat(name):
    m = bpy.data.materials.new(name); m.use_nodes = True
    nt = m.node_tree; b = nt.nodes['Principled BSDF']
    return m, nt, b


PIN = {'base': 'Base Color', 'metal': 'Metallic', 'rough': 'Roughness', 'ior': 'IOR', 'alpha': 'Alpha',
       'trans': 'Transmission Weight', 'sss': 'Subsurface Weight', 'sss_r': 'Subsurface Radius',
       'sss_s': 'Subsurface Scale', 'coat': 'Coat Weight', 'coat_rough': 'Coat Roughness',
       'sheen': 'Sheen Weight', 'emit': 'Emission Color', 'emit_s': 'Emission Strength',
       'spec': 'Specular IOR Level', 'aniso': 'Anisotropic', 'disp': 'Dispersion', 'film': 'Thin Film Thickness'}


def setp(b, **kw):
    for k, v in kw.items():
        if k == 'base' or k == 'emit':
            v = lin(v)
        if PIN[k] in b.inputs:
            b.inputs[PIN[k]].default_value = v


def coords(nt, scale=1.0, rot=(0, 0, 0)):
    tc = nt.nodes.new('ShaderNodeTexCoord'); mp = nt.nodes.new('ShaderNodeMapping')
    nt.links.new(tc.outputs['Object'], mp.inputs['Vector'])
    mp.inputs['Scale'].default_value = (scale, scale, scale) if not isinstance(scale, tuple) else scale
    mp.inputs['Rotation'].default_value = rot
    return mp.outputs['Vector']


def ramp(nt, src, stops):
    r = nt.nodes.new('ShaderNodeValToRGB'); nt.links.new(src, r.inputs[0])
    els = r.color_ramp.elements
    els[0].position, els[0].color = stops[0][0], lin(stops[0][1])
    els[1].position, els[1].color = stops[-1][0], lin(stops[-1][1])
    for p, c in stops[1:-1]:
        e = els.new(p); e.color = lin(c)
    return r.outputs['Color']


def noise(nt, vec, scale, detail=4, rough=0.5, dist=0.0):
    n = nt.nodes.new('ShaderNodeTexNoise'); nt.links.new(vec, n.inputs['Vector'])
    n.inputs['Scale'].default_value = scale; n.inputs['Detail'].default_value = detail
    n.inputs['Roughness'].default_value = rough; n.inputs['Distortion'].default_value = dist
    return n.outputs['Fac']


def wave(nt, vec, scale, dist=4.0, detail=3, direction='X', profile='SIN', kind='BANDS'):
    n = nt.nodes.new('ShaderNodeTexWave'); nt.links.new(vec, n.inputs['Vector'])
    n.wave_type = kind; n.bands_direction = direction; n.wave_profile = profile
    n.inputs['Scale'].default_value = scale; n.inputs['Distortion'].default_value = dist
    n.inputs['Detail'].default_value = detail
    return n.outputs['Fac']


def voronoi(nt, vec, scale, feature='F1', out='Distance'):
    n = nt.nodes.new('ShaderNodeTexVoronoi'); nt.links.new(vec, n.inputs['Vector'])
    n.feature = feature; n.inputs['Scale'].default_value = scale
    return n.outputs[out]


def bump(nt, b, height, strength, dist=0.02):
    n = nt.nodes.new('ShaderNodeBump'); nt.links.new(height, n.inputs['Height'])
    n.inputs['Strength'].default_value = strength; n.inputs['Distance'].default_value = dist
    nt.links.new(n.outputs['Normal'], b.inputs['Normal'])


def mop(nt, op, a, b=None, clamp=False):
    n = nt.nodes.new('ShaderNodeMath'); n.operation = op; n.use_clamp = clamp
    if isinstance(a, (int, float)): n.inputs[0].default_value = a
    else: nt.links.new(a, n.inputs[0])
    if b is not None:
        if isinstance(b, (int, float)): n.inputs[1].default_value = b
        else: nt.links.new(b, n.inputs[1])
    return n.outputs[0]


def mix_mask(nt, mat_out_shader, mask):
    """Cut holes where mask is 0 (transparent)."""
    out = nt.nodes['Material Output']
    tr = nt.nodes.new('ShaderNodeBsdfTransparent'); mx = nt.nodes.new('ShaderNodeMixShader')
    nt.links.new(mask, mx.inputs[0]); nt.links.new(tr.outputs[0], mx.inputs[1])
    nt.links.new(mat_out_shader, mx.inputs[2]); nt.links.new(mx.outputs[0], out.inputs['Surface'])


def wood(nt, b, light, dark, scale=6.0, dist=3.0, rough=0.4, coat=0.0):
    v = coords(nt, (1.0, 6.0, 6.0))
    f = wave(nt, v, scale, dist=dist, detail=4, direction='Y', profile='SAW')
    n = noise(nt, coords(nt, (0.4, 9, 9)), 3.0, detail=6)
    g = mop(nt, 'ADD', mop(nt, 'MULTIPLY', f, 0.7), mop(nt, 'MULTIPLY', n, 0.3))
    nt.links.new(ramp(nt, g, [(0.25, light), (0.75, dark)]), b.inputs['Base Color'])
    setp(b, rough=rough, coat=coat, coat_rough=0.08)
    bump(nt, b, f, 0.08)


def mat_shader(m, name=None):
    """A Blender material for plugin material m."""
    nm, col = MATS[m]
    mat, nt, b = new_mat(name or nm)
    setp(b, base=col)
    if m in (0, 1, 2, 3, 4):                                   # metals
        setp(b, metal=1.0, rough=(0.22, 0.2, 0.28, 0.32, 0.14)[m])
        if m == 3:                                             # brushed aluminium
            setp(b, aniso=0.6)
            bump(nt, b, noise(nt, coords(nt, (1, 60, 60)), 8, detail=2), 0.05)
        if m == 2:                                             # bronze: a little patina in the low spots
            n = noise(nt, coords(nt, 3.0), 2.5, detail=6)
            nt.links.new(ramp(nt, n, [(0.45, col), (0.75, (0.55, 0.36, 0.2))]), b.inputs['Base Color'])
    elif m == 5:                                               # glass
        setp(b, trans=1.0, ior=1.5, rough=0.0, base=(0.85, 0.97, 1.0))
    elif m == 6:                                               # crystal: denser, coloured, a little fire
        setp(b, trans=1.0, ior=2.0, rough=0.0, base=(0.93, 0.86, 1.0), disp=0.4)
    elif m == 7:                                               # ice: frosted, with cracks
        setp(b, trans=1.0, ior=1.31, rough=0.12, base=(0.88, 0.96, 1.0))
        v = voronoi(nt, coords(nt, 1.0), 2.5, feature='DISTANCE_TO_EDGE')
        bump(nt, b, mop(nt, 'MINIMUM', mop(nt, 'MULTIPLY', v, 12), 1), 0.25)
    elif m == 8:                                               # polished marble with veins
        n = noise(nt, coords(nt, 1.0), 2.2, detail=8, rough=0.6, dist=1.6)
        vein = mop(nt, 'ABSOLUTE', mop(nt, 'SUBTRACT', n, 0.5))
        nt.links.new(ramp(nt, vein, [(0.0, (0.45, 0.45, 0.5)), (0.04, (0.7, 0.7, 0.72)), (0.12, (0.95, 0.94, 0.92))]), b.inputs['Base Color'])
        setp(b, rough=0.12, sss=0.15, sss_s=0.05)
    elif m == 9:                                               # fired clay
        n = noise(nt, coords(nt, 8.0), 4, detail=8)
        nt.links.new(ramp(nt, n, [(0.3, (0.7, 0.38, 0.24)), (0.7, (0.86, 0.5, 0.34))]), b.inputs['Base Color'])
        setp(b, rough=0.85)
        bump(nt, b, noise(nt, coords(nt, 30.0), 6, detail=4), 0.15)
    elif m == 10:
        wood(nt, b, (0.93, 0.8, 0.56), (0.8, 0.62, 0.36), scale=5, dist=2, rough=0.35, coat=0.3)
    elif m == 11:
        wood(nt, b, (0.55, 0.28, 0.15), (0.25, 0.1, 0.05), scale=9, dist=5, rough=0.3, coat=0.6)
    elif m == 12:                                              # bamboo: fine streaks and nodes
        v = coords(nt, 1.0)
        streak = noise(nt, coords(nt, (0.3, 40, 40)), 3, detail=3)
        nt.links.new(ramp(nt, streak, [(0.35, (0.72, 0.68, 0.32)), (0.65, (0.86, 0.82, 0.5))]), b.inputs['Base Color'])
        node = wave(nt, v, 0.24, dist=0, detail=0, direction='X', profile='SIN')
        ring = mop(nt, 'GREATER_THAN', node, 0.97)
        mx = nt.nodes.new('ShaderNodeMix'); mx.data_type = 'RGBA'
        nt.links.new(ring, mx.inputs['Factor'])
        nt.links.new(b.inputs['Base Color'].links[0].from_socket, mx.inputs[6])
        mx.inputs[7].default_value = lin((0.55, 0.5, 0.22))
        nt.links.new(mx.outputs[2], b.inputs['Base Color'])
        bump(nt, b, ring, 0.4)
        setp(b, rough=0.3, coat=0.4)
    elif m == 13:                                              # bone
        n = noise(nt, coords(nt, 4.0), 5, detail=6)
        nt.links.new(ramp(nt, n, [(0.3, (0.88, 0.84, 0.72)), (0.7, (0.97, 0.95, 0.88))]), b.inputs['Base Color'])
        setp(b, rough=0.45, sss=0.3, sss_s=0.05)
        bump(nt, b, voronoi(nt, coords(nt, 1.0), 40), 0.1)
    elif m == 14:                                              # gut: translucent, twisted
        setp(b, rough=0.35, sss=0.6, sss_s=0.1, coat=0.3)
        bump(nt, b, wave(nt, coords(nt, 1.0, (0, 0.6, 0)), 30, dist=0.5, direction='X'), 0.15)
    elif m == 15:                                              # nylon
        setp(b, rough=0.25, sss=0.7, sss_s=0.15, coat=0.4)
    elif m == 16:                                              # carbon fibre weave
        v = coords(nt, 1.0, (0.785, 0, 0.0))
        ck = nt.nodes.new('ShaderNodeTexChecker'); nt.links.new(v, ck.inputs['Vector']); ck.inputs['Scale'].default_value = 14
        ck.inputs['Color1'].default_value = lin((0.08, 0.08, 0.09)); ck.inputs['Color2'].default_value = lin((0.26, 0.27, 0.3))
        nt.links.new(ck.outputs['Color'], b.inputs['Base Color'])
        setp(b, rough=0.35, coat=1.0, coat_rough=0.03, aniso=0.5)
    elif m == 17:                                              # rubber
        setp(b, rough=0.65, spec=0.3)
        bump(nt, b, noise(nt, coords(nt, 40.0), 4), 0.04)
    elif m == 18:                                              # paper
        setp(b, rough=0.9, sss=0.2, sss_s=0.02)
        bump(nt, b, noise(nt, coords(nt, 25.0), 8, detail=8), 0.12)
    elif m == 19:                                              # jelly
        setp(b, trans=0.85, ior=1.35, rough=0.03, sss=0.3, base=(1.0, 0.35, 0.55))
        bump(nt, b, noise(nt, coords(nt, 1.5), 2, detail=1), 0.15)
    elif m == 20:                                              # ABS plastic
        setp(b, rough=0.22, coat=0.5, coat_rough=0.1)
    elif m == 21:                                              # PVC, with a printed band
        setp(b, rough=0.4)
    elif m == 22:
        wood(nt, b, (0.86, 0.68, 0.45), (0.66, 0.45, 0.25), scale=6, dist=3, rough=0.35, coat=0.4)
    elif m == 23:                                              # leather
        n = noise(nt, coords(nt, 5.0), 3, detail=5)
        nt.links.new(ramp(nt, n, [(0.3, (0.38, 0.22, 0.12)), (0.7, (0.55, 0.35, 0.2))]), b.inputs['Base Color'])
        setp(b, rough=0.55, sheen=0.3)
        bump(nt, b, voronoi(nt, coords(nt, 1.0), 35, feature='DISTANCE_TO_EDGE'), 0.3)
    elif m == 24:                                              # cardboard: kraft with flutes
        n = noise(nt, coords(nt, 6.0), 4, detail=6)
        nt.links.new(ramp(nt, n, [(0.3, (0.62, 0.46, 0.3)), (0.7, (0.74, 0.58, 0.4))]), b.inputs['Base Color'])
        setp(b, rough=0.9)
        bump(nt, b, wave(nt, coords(nt, 1.0), 25, dist=0, direction='X'), 0.08)
    elif m == 25:                                              # crumpled foil
        setp(b, metal=1.0, rough=0.08)
        bump(nt, b, voronoi(nt, coords(nt, 1.0), 6, feature='F2'), 0.8)
    elif m == 26:                                              # cling film
        setp(b, trans=1.0, ior=1.5, rough=0.02, base=(0.92, 0.98, 1.0), film=500)
        bump(nt, b, noise(nt, coords(nt, (2, 6, 6)), 2, detail=2, dist=1), 0.3)
    elif m == 27:                                              # galvanised tin: spangle
        v = voronoi(nt, coords(nt, 1.0), 9, out='Color')
        sep = nt.nodes.new('ShaderNodeSeparateColor'); nt.links.new(v, sep.inputs[0])
        nt.links.new(ramp(nt, sep.outputs[0], [(0.0, (0.55, 0.58, 0.6)), (1.0, (0.78, 0.8, 0.82))]), b.inputs['Base Color'])
        setp(b, metal=1.0, rough=0.35)
    elif m == 28:                                              # car paint: metallic flake under clear coat
        setp(b, metal=0.4, rough=0.35, coat=1.0, coat_rough=0.02)
    elif m == 29:                                              # chain link: a diamond wire mesh
        setp(b, metal=1.0, rough=0.35)
        v = coords(nt, 1.0); sep = nt.nodes.new('ShaderNodeSeparateXYZ'); nt.links.new(v, sep.inputs[0])
        x, y, z = sep.outputs[0], sep.outputs[1], sep.outputs[2]
        yz = mop(nt, 'ADD', z, mop(nt, 'MULTIPLY', y, 0.7))
        f = 16.0
        s1 = mop(nt, 'ABSOLUTE', mop(nt, 'SINE', mop(nt, 'MULTIPLY', mop(nt, 'ADD', x, yz), f)))
        s2 = mop(nt, 'ABSOLUTE', mop(nt, 'SINE', mop(nt, 'MULTIPLY', mop(nt, 'SUBTRACT', x, yz), f)))
        wire = mop(nt, 'GREATER_THAN', mop(nt, 'MAXIMUM', s1, s2), 0.82)
        mix_mask(nt, b.outputs[0], wire)
    elif m == 30:                                              # handpan: nitrided steel, hammer dimples, bronze patches
        n = noise(nt, coords(nt, 1.5), 2, detail=4)
        nt.links.new(ramp(nt, n, [(0.45, (0.33, 0.35, 0.42)), (0.7, (0.5, 0.38, 0.25))]), b.inputs['Base Color'])
        setp(b, metal=1.0, rough=0.3)
        bump(nt, b, voronoi(nt, coords(nt, 1.0), 14, feature='SMOOTH_F1'), 0.25)
    return mat


def rust_shader():
    """Patchy rust and grime, faded in over a part by the Age control."""
    mat, nt, b = new_mat("rust")
    n = noise(nt, coords(nt, 1.0), 3.0, detail=8, rough=0.65)
    col = noise(nt, coords(nt, 1.0), 14.0, detail=6)
    nt.links.new(ramp(nt, col, [(0.3, (0.32, 0.12, 0.05)), (0.55, (0.6, 0.27, 0.1)), (0.75, (0.78, 0.45, 0.2))]), b.inputs['Base Color'])
    setp(b, rough=0.95)
    bump(nt, b, col, 0.6)
    cover = nt.nodes.new('ShaderNodeMapRange'); nt.links.new(n, cover.inputs[0])
    cover.inputs[1].default_value = 0.44; cover.inputs[2].default_value = 0.54
    mix_mask(nt, b.outputs[0], cover.outputs[0])
    return mat


def plain(name, col, **kw):
    mat, nt, b = new_mat(name); setp(b, base=col, **kw); return mat


def skin():
    mat, nt, b = new_mat("skin")
    setp(b, base=(0.93, 0.72, 0.6), rough=0.45, sss=0.5, sss_s=0.08)
    b.inputs['Subsurface Radius'].default_value = (1.0, 0.35, 0.2)
    bump(nt, b, noise(nt, coords(nt, 40), 6), 0.05)
    return mat


def felt(col):
    mat, nt, b = new_mat("felt")
    setp(b, base=col, rough=1.0, sheen=1.0)
    bump(nt, b, noise(nt, coords(nt, 50), 10, detail=10), 0.3)
    return mat


def ebony():
    mat, nt, b = new_mat("ebony"); wood(nt, b, (0.12, 0.1, 0.09), (0.05, 0.04, 0.04), scale=8, rough=0.25, coat=0.5); return mat


def darkwood():
    mat, nt, b = new_mat("darkwood"); wood(nt, b, (0.42, 0.24, 0.14), (0.24, 0.12, 0.07), scale=7, rough=0.3, coat=0.5); return mat


def maple():
    mat, nt, b = new_mat("maple"); wood(nt, b, (0.88, 0.7, 0.46), (0.7, 0.5, 0.3), scale=6, rough=0.35, coat=0.4); return mat


def chrome():
    return plain("chrome", (0.86, 0.87, 0.9), metal=1.0, rough=0.08)


def nickel():
    return plain("nickel", (0.8, 0.8, 0.78), metal=1.0, rough=0.18)


def brass():
    return plain("brass", (0.9, 0.72, 0.32), metal=1.0, rough=0.16)


def black(rough=0.35):
    return plain("black", (0.05, 0.05, 0.055), rough=rough)


def pearl():
    mat, nt, b = new_mat("pearl")
    setp(b, base=(0.95, 0.93, 0.9), rough=0.2, coat=1.0, film=350, sss=0.2)
    return mat


def string_mat():
    return plain("string", (0.8, 0.8, 0.82), metal=1.0, rough=0.25)


# ---------------------------------------------------------------- geometry
def link(ob):
    bpy.context.scene.collection.objects.link(ob); return ob


def mesh_ob(name, bm, mat=None, smooth=True):
    me = bpy.data.meshes.new(name); bm.to_mesh(me); bm.free()
    if smooth:
        for p in me.polygons: p.use_smooth = True
    ob = link(bpy.data.objects.new(name, me))
    if mat: ob.data.materials.append(mat)
    return ob


def lathe(name, prof, mat=None, segs=72, closed=False, axis='X'):
    """Surface of revolution of [(x, r), ...] about the X axis."""
    bm = bmesh.new(); rings = []
    for x, r in prof:
        rings.append([bm.verts.new((x, r*math.cos(2*math.pi*j/segs), r*math.sin(2*math.pi*j/segs))) for j in range(segs)])
    pairs = list(zip(rings[:-1], rings[1:])) + ([(rings[-1], rings[0])] if closed else [])
    for a, b in pairs:
        for j in range(segs):
            try: bm.faces.new((a[j], a[(j + 1) % segs], b[(j + 1) % segs], b[j]))
            except ValueError: pass
    bmesh.ops.remove_doubles(bm, verts=bm.verts, dist=1e-5)
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
    ob = mesh_ob(name, bm, mat)
    if axis == 'Z': ob.rotation_euler = (0, -math.pi/2, 0)
    return ob


def tube_prof(prof, t, cap0=True):
    """A hollow tube of wall thickness t: outer profile out, inner back."""
    out = [(x, r) for x, r in prof]
    inn = [(x, max(0.001, r - t)) for x, r in reversed(prof)]
    return out + inn


def box(name, size, loc=(0, 0, 0), mat=None, bevel=0.03, rot=(0, 0, 0), segs=3):
    bm = bmesh.new(); bmesh.ops.create_cube(bm, size=1.0)
    bmesh.ops.scale(bm, vec=size, verts=bm.verts)
    ob = mesh_ob(name, bm, mat)
    ob.location = loc; ob.rotation_euler = rot
    if bevel > 0:
        md = ob.modifiers.new("b", 'BEVEL'); md.width = bevel; md.segments = segs; md.harden_normals = False
        md.limit_method = 'NONE'
    return ob


def cyl(name, r, length, loc=(0, 0, 0), rot=(0, 0, 0), mat=None, segs=48, bevel=0.0, r2=None):
    """A cylinder along local X."""
    r2 = r if r2 is None else r2
    prof = [(-length/2, 0), (-length/2, r), (length/2, r2), (length/2, 0)]
    if bevel > 0:
        prof = [(-length/2, 0), (-length/2, r - bevel), (-length/2 + bevel*0.3, r - bevel*0.3), (-length/2 + bevel, r),
                (length/2 - bevel, r2), (length/2 - bevel*0.3, r2 - bevel*0.3), (length/2, r2 - bevel), (length/2, 0)]
    ob = lathe(name, prof, mat, segs=segs)
    ob.location = loc; ob.rotation_euler = rot
    split_sharp(ob)
    return ob


def split_sharp(ob, angle=50):
    md = ob.modifiers.new("e", 'EDGE_SPLIT'); md.split_angle = math.radians(angle)


def sphere(name, r, loc=(0, 0, 0), scale=(1, 1, 1), mat=None, rot=(0, 0, 0)):
    bm = bmesh.new(); bmesh.ops.create_uvsphere(bm, u_segments=48, v_segments=24, radius=r)
    ob = mesh_ob(name, bm, mat); ob.location = loc; ob.scale = scale; ob.rotation_euler = rot
    return ob


def torus(name, R, r, loc=(0, 0, 0), rot=(0, 0, 0), mat=None, segs=64, rsegs=20):
    bm = bmesh.new(); rings = []
    for i in range(segs):
        a = 2*math.pi*i/segs
        rings.append([bm.verts.new(((R + r*math.cos(2*math.pi*j/rsegs))*math.cos(a), (R + r*math.cos(2*math.pi*j/rsegs))*math.sin(a),
                                    r*math.sin(2*math.pi*j/rsegs))) for j in range(rsegs)])
    for i in range(segs):
        a, b = rings[i], rings[(i + 1) % segs]
        for j in range(rsegs):
            bm.faces.new((a[j], b[j], b[(j + 1) % rsegs], a[(j + 1) % rsegs]))
    ob = mesh_ob(name, bm, mat); ob.location = loc; ob.rotation_euler = rot
    return ob


def slab(name, pts, depth, mat=None, loc=(0, 0, 0), rot=(0, 0, 0), bevel=0.02, segs=3):
    """An outline [(x, z), ...] extruded `depth` along Y (towards the back)."""
    bm = bmesh.new()
    vs = [bm.verts.new((x, -depth/2, z)) for x, z in pts]
    f = bm.faces.new(vs)
    r = bmesh.ops.extrude_face_region(bm, geom=[f])
    nv = [e for e in r['geom'] if isinstance(e, bmesh.types.BMVert)]
    bmesh.ops.translate(bm, vec=(0, depth, 0), verts=nv)
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
    ob = mesh_ob(name, bm, mat)
    ob.location = loc; ob.rotation_euler = rot
    if bevel > 0:
        md = ob.modifiers.new("b", 'BEVEL'); md.width = bevel; md.segments = segs; md.limit_method = 'ANGLE'
    split_sharp(ob, 40)
    return ob


def curve_tube(name, pts, r, mat=None, closed=False, taper=None, res=24):
    cu = bpy.data.curves.new(name, 'CURVE'); cu.dimensions = '3D'
    cu.bevel_depth = r; cu.bevel_resolution = 6; cu.use_fill_caps = True
    sp = cu.splines.new('POLY'); sp.points.add(len(pts) - 1)
    for p, q in zip(sp.points, pts):
        p.co = (q[0], q[1], q[2], 1); p.radius = 1.0 if taper is None else taper(pts.index(q)/(len(pts) - 1))
    sp.use_cyclic_u = closed
    ob = link(bpy.data.objects.new(name, cu))
    if mat: ob.data.materials.append(mat)
    return ob


def boolean(ob, cutter, op='DIFFERENCE'):
    md = ob.modifiers.new("bool", 'BOOLEAN'); md.operation = op; md.object = cutter; md.solver = 'EXACT'
    cutter.hide_render = True; cutter.hide_viewport = True
    return ob


def outline(fn, n=96):
    return [fn(2*math.pi*k/n) for k in range(n)]


def ellipse(rx, rz, n=64, cx=0, cz=0):
    return outline(lambda a: (cx + rx*math.cos(a), cz + rz*math.sin(a)), n)


def chaikin(pts, n=3, closed=True):
    for _ in range(n):
        q = []
        m = len(pts)
        for k in range(m if closed else m - 1):
            a, b = pts[k], pts[(k + 1) % m]
            q += [(0.75*a[0] + 0.25*b[0], 0.75*a[1] + 0.25*b[1]), (0.25*a[0] + 0.75*b[0], 0.25*a[1] + 0.75*b[1])]
        pts = q
    return pts


def hull(pts):
    pts = sorted(set(pts))
    def cross(o, a, b): return (a[0] - o[0])*(b[1] - o[1]) - (a[1] - o[1])*(b[0] - o[0])
    lo, hi = [], []
    for p in pts:
        while len(lo) >= 2 and cross(lo[-2], lo[-1], p) <= 0: lo.pop()
        lo.append(p)
    for p in reversed(pts):
        while len(hi) >= 2 and cross(hi[-2], hi[-1], p) <= 0: hi.pop()
        hi.append(p)
    return lo[:-1] + hi[:-1]


def plectrum_outline(s=1.0):
    pts = []
    for cx, cz, r in ((-0.48, 0.3, 0.3), (0.48, 0.3, 0.3), (0.0, -0.62, 0.1)):
        pts += [(s*(cx + r*math.cos(a)), s*(cz + r*math.sin(a))) for a in [2*math.pi*k/60 for k in range(60)]]
    return hull(pts)


def rounded_tri(r, n=90):
    # a plectrum: a rounded triangle, point down
    pts = []
    for k in range(n):
        a = 2*math.pi*k/n
        rr = r*(1 + 0.18*math.cos(3*(a + math.pi/2)))
        pts.append((rr*math.cos(a)*1.0, rr*math.sin(a)*1.1 + 0.05*r))
    return pts


# ---------------------------------------------------------------- the parts
# Each builder takes M (the material for the parts made of the chosen material;
# None for parts without one) and returns an optional view direction.

def p_breath(M):
    air = bpy.data.materials.new("air"); air.use_nodes = True; nt = air.node_tree; b = nt.nodes['Principled BSDF']
    setp(b, base=(0.6, 0.85, 1.0), emit=(0.5, 0.8, 1.0), emit_s=1.2, rough=0.1, trans=0.6, ior=1.2)
    for k in range(3):
        z = 0.5 - 0.5*k
        pts = [(x, 0.15*math.sin(k), z + 0.12*math.sin(2.6*x + k*1.3)) for x in [-1.5 + 0.05*i for i in range(56)]]
        curve_tube("air%d" % k, pts, 0.045, air, taper=lambda u: 0.35 + 0.65*math.sin(math.pi*min(1, u*1.2))**0.6)
    gl = mat_shader(5, "bubble")
    for (x, z, r) in [(1.55, 0.45, 0.1), (1.8, 0.0, 0.14), (1.6, -0.5, 0.08), (2.05, 0.35, 0.06)]:
        sphere("b", r, (x, 0, z), mat=gl)
    return Vector((0.15, -1, 0.25))


def bow_model(x0, x1, z, Mstick=None, hair=None, scale=1.0, tilt=0.0):
    stick = Mstick or plain("pernambuco", (0.45, 0.2, 0.08), rough=0.3, coat=0.6)
    hairm = hair or plain("hair", (0.95, 0.93, 0.85), rough=0.6, sheen=0.5)
    L = x1 - x0
    pts = [(x0 + L*u, 0, z + 0.22*scale + 0.1*scale*math.sin(math.pi*u)) for u in [i/40 for i in range(41)]]
    curve_tube("stick", pts, 0.035*scale, stick, taper=lambda u: 1.0 - 0.35*u)
    box("hair", (L*0.86, 0.12*scale, 0.012*scale), (x0 + L*0.52, 0, z), hairm, bevel=0.003)
    box("frog", (0.32*scale, 0.12*scale, 0.2*scale), (x0 + 0.24*scale, 0, z + 0.1*scale), ebony(), bevel=0.03)
    cyl("eye", 0.04*scale, 0.13*scale, (x0 + 0.24*scale, 0, z + 0.11*scale), (0, 0, math.pi/2), pearl())
    cyl("button", 0.04*scale, 0.12*scale, (x0 - 0.02*scale, 0, z + 0.23*scale), mat=plain("silver", (0.85, 0.85, 0.86), metal=1, rough=0.2))
    box("head", (0.12*scale, 0.06*scale, 0.3*scale), (x1, 0, z + 0.12*scale), stick, bevel=0.02)


def p_bow(M):
    bow_model(-1.6, 1.6, 0, scale=1.0)
    for ob in bpy.context.scene.objects:
        if ob.type in ('MESH', 'CURVE'):
            ob.rotation_euler.rotate(Matrix.Rotation(-0.25, 3, 'Y'))
            ob.location = Matrix.Rotation(-0.25, 3, 'Y') @ ob.location


def finger(base, dirn, sk, length=1.4, r=0.22, nail=True, up=(0, -1, 0)):
    """A finger from base along dirn; the nail faces `up`."""
    L = length
    prof = [(-0.02, 0), (-0.02, r*1.05), (0.12*L, r*1.08), (0.3*L, r*1.0), (0.42*L, r*1.04), (0.5*L, r*0.98),
            (0.68*L, r*0.93), (0.74*L, r*0.96), (0.8*L, r*0.9), (L - 0.6*r, r*0.85), (L - 0.25*r, r*0.62), (L - 0.05*r, r*0.3), (L, 0)]
    f = lathe("finger", prof, sk, segs=48)
    if nail:
        n = sphere("nail", 1.0, (L - 0.55*r, 0, 0), (0.55*r, 0.75*r, 0.32*r), plain("nail", (0.98, 0.84, 0.8), rough=0.12, coat=1.0, sss=0.3))
        n.location = (L - 0.5*r, 0, 0.62*r); n.parent = f
    d = Vector(dirn).normalized()
    f.rotation_euler = d.to_track_quat('X', 'Z').to_euler()
    # turn the nail side (local +Z) towards `up`
    zl = f.rotation_euler.to_matrix() @ Vector((0, 0, 1)); u = Vector(up) - d*d.dot(Vector(up))
    if u.length > 1e-6:
        ang = zl.angle(u.normalized()); sgn = 1 if d.dot(zl.cross(u)) > 0 else -1
        f.rotation_euler = (Matrix.Rotation(sgn*ang, 3, d) @ f.rotation_euler.to_matrix()).to_euler()
    f.location = base
    return f


def p_finger(M):
    finger((-0.8, 0, 0.7), (1, 0, -0.75), skin(), length=1.9, r=0.24, up=(0, -1, 0.6))
    cyl("string", 0.025, 2.4, (0.55, 0.3, -0.45), (0, 0, math.pi/2), string_mat())
    return Vector((0.2, -1, 0.3))


def p_pick(M, loc=(0, 0, 0), rot=(-0.35, 0.3, 0.1), s=1.0):
    mat, nt, b = new_mat("tortoise")
    n = noise(nt, coords(nt, 2.0), 3, detail=6, dist=1.0)
    nt.links.new(ramp(nt, n, [(0.4, (0.95, 0.5, 0.15)), (0.6, (0.45, 0.15, 0.05))]), b.inputs['Base Color'])
    setp(b, rough=0.12, coat=1.0, sss=0.4, sss_s=0.05)
    ob = slab("pick", plectrum_outline(s), 0.05*s, mat, bevel=0.02*s, segs=4)
    ob.location = loc; ob.rotation_euler = rot
    return ob


def p_plectrum(M):
    p_pick(M)
    return Vector((0.2, -1, 0.6))


def claw_hammer():
    wood_ = maple(); steel = plain("steel", (0.7, 0.72, 0.76), metal=1, rough=0.25)
    box("handle", (0.24, 0.16, 2.2), (0, 0, -0.9), wood_, bevel=0.07, segs=4)
    cyl("face", 0.17, 0.5, (0.45, 0, 0.32), mat=steel, bevel=0.03)
    box("neck", (0.5, 0.22, 0.3), (0.05, 0, 0.32), steel, bevel=0.05)
    pts = [(-0.2, 0.15), (-0.6, 0.22), (-0.95, 0.05), (-1.05, -0.05), (-0.62, 0.05), (-0.2, -0.12)]
    slab("claw", pts, 0.2, steel, loc=(0, 0, 0.32), bevel=0.03)


def p_hammer(M):
    claw_hammer()
    for ob in bpy.context.scene.objects:
        if ob.type == 'MESH':
            ob.location = Matrix.Rotation(-0.5, 3, 'Y') @ ob.location
            ob.rotation_euler.rotate(Matrix.Rotation(-0.5, 3, 'Y'))


def p_electricity(M):
    bolt = bpy.data.materials.new("bolt"); bolt.use_nodes = True; b = bolt.node_tree.nodes['Principled BSDF']
    setp(b, base=(1.0, 0.85, 0.2), emit=(1.0, 0.85, 0.3), emit_s=2.5, rough=0.2)
    pts = [(0.25, 1.0), (-0.45, -0.1), (-0.02, -0.1), (-0.3, -1.0), (0.5, 0.2), (0.05, 0.2), (0.4, 1.0)]
    slab("bolt", pts, 0.18, bolt, bevel=0.04)
    spark = plain("spark", (1, 1, 0.8), emit=(1, 1, 0.7), emit_s=4)
    for (x, z) in [(-0.6, 0.6), (0.7, -0.5), (-0.6, -0.7), (0.75, 0.75)]:
        sphere("s", 0.05, (x, 0, z), mat=spark)
    return Vector((0.2, -1, 0.2))


# ---- exciters
def clarinet_mouthpiece(reedm=None):
    hard = black(0.2)
    prof = [(-1.6, 0), (-1.6, 0.3), (-0.6, 0.3), (-0.55, 0.32), (0.4, 0.3), (1.0, 0.22), (1.3, 0.1), (1.32, 0)]
    mp = lathe("mouthpiece", prof, hard, segs=64)
    cut = box("cut", (2.0, 1.0, 0.6), (1.0, 0, -0.42), rot=(0, -0.12, 0), bevel=0)
    boolean(mp, cut)
    reed = reedm or plain("cane", (0.9, 0.78, 0.45), rough=0.5, sss=0.3)
    r = box("reed", (2.1, 0.46, 0.05), (0.32, 0, -0.17), reed, bevel=0.02, rot=(0, -0.08, 0))
    lig = nickel()
    for x in (-0.1, 0.25):
        torus("lig", 0.33, 0.03, (x, 0, -0.02), (0, math.pi/2, 0), lig)
    cyl("screw", 0.04, 0.35, (0.07, 0, -0.42), (0, math.pi/2, 0), lig)


def p_reed(M):
    clarinet_mouthpiece()
    return Vector((0.35, -1, -0.25))


def p_lips(M):
    sk = plain("lip", (0.82, 0.34, 0.4), rough=0.22, sss=0.6, sss_s=0.06, coat=0.3)
    lip(sk, upper=True); lip(sk, upper=False)
    torus("rim", 0.95, 0.08, (0, 0.42, 0), (math.pi/2, 0, 0), brass())
    lathe("cup", [(0.0, 0.95), (0.5, 0.5), (1.4, 0.3), (1.41, 0.0)], brass(), segs=64).rotation_euler = (0, 0, math.pi/2)
    for o in bpy.context.scene.objects:
        if o.name.startswith("cup"): o.location = (0, 0.45, 0)
    return Vector((0.35, -1, 0.2))


def lip(sk, upper):
    """A lip as a swept ellipse: full in the middle, pinched at the corners."""
    bm = bmesh.new(); nx, na = 48, 32; rows = []
    for i in range(nx + 1):
        u = -1 + 2*i/nx; x = 1.05*u
        env = max(0.0, 1 - u*u)**0.55
        if upper:
            h = 0.2*env*(1 - 0.3*math.exp(-(u/0.12)**2)); zc = 0.035 + h*0.95 + 0.06*math.exp(-((abs(u) - 0.22)/0.12)**2)*env
        else:
            h = 0.25*env; zc = -0.035 - h*0.95
        d = 0.32*env**0.7 + 0.02
        rows.append([bm.verts.new((x, -d*math.cos(2*math.pi*j/na)*0.9 + 0.1, zc + h*math.sin(2*math.pi*j/na))) for j in range(na)])
    for a, b in zip(rows[:-1], rows[1:]):
        for j in range(na):
            bm.faces.new((a[j], a[(j + 1) % na], b[(j + 1) % na], b[j]))
    bmesh.ops.remove_doubles(bm, verts=bm.verts, dist=1e-4)
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
    return mesh_ob("lip", bm, sk)


def p_piano_hammer(M):
    fel = felt((0.93, 0.92, 0.86)); red = felt((0.7, 0.12, 0.14))
    sphere("felt", 1.0, (0.55, 0, 0.42), (0.32, 0.28, 0.5), fel)
    sphere("underfelt", 1.0, (0.45, 0, 0.42), (0.26, 0.29, 0.45), red)
    box("molding", (0.45, 0.24, 0.45), (0.15, 0, 0.42), maple(), bevel=0.04)
    cyl("shank", 0.06, 2.2, (-1.0, 0, 0.42), mat=maple())
    cyl("string", 0.025, 3.6, (0.85, 0, -0.3), (0, 0, math.pi/2), string_mat())
    return Vector((0.3, -1, 0.3))


def p_bow_on_string(M):
    for k in range(3):
        cyl("string", 0.03 + 0.008*k, 3.0, (-0.3 + 0.3*k, 0.4, -0.06), (0, 0, math.pi/2), string_mat())
    bow_model(-1.6, 1.6, 0.0, scale=0.9)
    return Vector((0.3, -1, 0.75))


def p_pick_on_string(M):
    for k in range(3):
        cyl("string", 0.025 + 0.006*k, 3.4, (0, 0.25*k, -0.08), mat=string_mat())
    p_pick(M, (0.0, -0.1, 0.62), (-0.25, 0.35, 0.0), s=0.8)
    return Vector((0.3, -1, 0.45))


def p_mallet(M):
    yarn = bpy.data.materials.new("yarn"); yarn.use_nodes = True; nt = yarn.node_tree; b = nt.nodes['Principled BSDF']
    setp(b, base=(0.95, 0.84, 0.55), rough=0.9, sheen=0.8)
    bump(nt, b, wave(nt, coords(nt, 1.0, (0.3, 0.7, 0.2)), 30, dist=2, direction='Z'), 0.5)
    sphere("head", 0.45, (1.0, 0, 0.5), mat=yarn)
    cyl("stick", 0.06, 2.6, (-0.3, 0, 0.5), mat=plain("rattan", (0.85, 0.7, 0.45), rough=0.4, coat=0.3))
    for ob in bpy.context.scene.objects:
        if ob.type == 'MESH':
            ob.location = Matrix.Rotation(-0.45, 3, 'Y') @ ob.location
            ob.rotation_euler.rotate(Matrix.Rotation(-0.45, 3, 'Y'))


# ---- vibrating elements (M = element material)
def p_string(M):
    eb = ebony()
    cyl("string", 0.1, 3.4, (0, 0, 0.27), mat=M, segs=40)
    for x in (-1.7, 1.7):
        box("nut", (0.18, 0.5, 0.4), (x, 0, 0.12), eb, bevel=0.04)
    box("board", (3.9, 0.9, 0.1), (0, 0, -0.12), darkwood(), bevel=0.03)
    return Vector((0.35, -1, 0.55))


def p_membrane(M):
    shell = plain("shell", (0.5, 0.12, 0.1), rough=0.2, coat=1.0, coat_rough=0.05)
    lathe("shell", tube_prof([(-0.45, 1.0), (0.45, 1.0)], 0.05), shell, segs=96, closed=True, axis='Z')
    head = cyl("head", 0.99, 0.02, (0, 0, 0.47), (0, -math.pi/2, 0), M, segs=96)
    torus("hoop", 1.01, 0.045, (0, 0, 0.48), mat=chrome(), segs=96)
    return Vector((0.3, -1, 0.9))


def p_bar(M):
    box("bar", (3.2, 0.75, 0.22), (0, 0, 0.2), M, bevel=0.03)
    cord = plain("cord", (0.75, 0.15, 0.12), rough=0.8)
    for x in (-0.72, 0.72):
        cyl("cord", 0.04, 1.4, (x, 0, 0.05), (0, 0, math.pi/2), cord)
        box("rail", (0.18, 1.6, 0.14), (x, 0, -0.05), darkwood(), bevel=0.02)
    return Vector((0.3, -1, 0.6))


def p_plate(M):
    box("plate", (2.8, 0.05, 1.8), (0, 0, 0), M, bevel=0.01, rot=(0, 0, 0.35))
    thread = plain("thread", (0.85, 0.85, 0.85), rough=0.7)
    for x in (-1.0, 1.0):
        p = Matrix.Rotation(0.35, 3, 'Z') @ Vector((x, 0, 0.9))
        cyl("thread", 0.012, 0.7, (p.x, p.y, 1.25), (0, math.pi/2, 0), thread)
    return Vector((0.2, -1, 0.3))


def p_tine(M):
    clamp = plain("clamp", (0.25, 0.26, 0.28), metal=1, rough=0.45)
    box("block", (0.8, 0.9, 0.9), (-1.6, 0, 0), clamp, bevel=0.05)
    cyl("screw", 0.14, 0.12, (-1.6, 0, 0.5), (0, -math.pi/2, 0), chrome())
    bm = bmesh.new(); bmesh.ops.create_cube(bm, size=1.0); bmesh.ops.scale(bm, vec=(3.0, 0.4, 0.09), verts=bm.verts)
    bmesh.ops.subdivide_edges(bm, edges=[e for e in bm.edges if abs(e.verts[0].co.x - e.verts[1].co.x) > 1], cuts=30)
    for v in bm.verts:
        u = (v.co.x + 1.5)/3.0
        v.co.z += 0.22*u*u
    ob = mesh_ob("tine", bm, M, smooth=False); ob.location = (0.25, 0, 0.05)
    md = ob.modifiers.new("b", 'BEVEL'); md.width = 0.015; md.segments = 2
    return Vector((0.3, -1, 0.45))


def p_air_column(M):
    lathe("tube", tube_prof([(-1.7, 0.42), (1.7, 0.42)], 0.06), M, segs=72, closed=True)
    return Vector((0.65, -1, 0.35))


# ---- resonators (M = resonator material)
def p_bore(M):
    prof = [(-1.8, 0.16 + 0.0*u) for u in [0]] + [(-1.8 + 3.6*u, 0.16 + 0.46*u) for u in [i/20 for i in range(1, 21)]]
    lathe("bore", tube_prof(prof, 0.05), M, segs=72, closed=True)
    return Vector((0.55, -1, 0.35))


def guitar_outline(s=1.0):
    pts = []
    for k in range(120):
        a = 2*math.pi*k/120
        x = 1.35*math.cos(a)
        w = 0.62 + 0.18*math.cos(a)                            # wider lower bout
        waist = 1 - 0.22*math.exp(-((math.cos(a) - 0.05)/0.25)**2)
        pts.append((s*x, s*w*waist*math.sin(a)*1.25))
    return pts


def p_soundbox(M):
    slab("box", guitar_outline(), 0.5, M, rot=(math.pi/2, 0, 0), bevel=0.06, segs=4)
    hole = cyl("hole", 0.28, 0.05, (-0.2, 0, 0.255), (0, -math.pi/2, 0), black(0.9))
    torus("rosette", 0.31, 0.02, (-0.2, 0, 0.26), mat=plain("ros", (0.15, 0.1, 0.08), rough=0.3))
    return Vector((0.25, -0.75, 1.0))


def p_pipe(M):
    for k, h in enumerate((3.0, 2.45, 2.0)):
        x = -0.8 + 0.8*k; r = 0.3
        body = lathe("pipe", tube_prof([(0.0, r), (h, r)], 0.04), M, segs=64, closed=True, axis='Z')
        body.location = (x, 0, 0)
        lathe("foot", [(-0.9, 0.0), (-0.9, 0.05), (0.0, r), (0.01, 0.0)], M, segs=64, axis='Z').location = (x, 0, 0)
        boolean(body, box("mouth", (0.28, 0.3, 0.22), (x, -r, 0.18), bevel=0))
        box("lip", (0.26, 0.04, 0.03), (x, -r + 0.06, 0.06), M, bevel=0.005)
    return Vector((0.3, -1, 0.3))


def p_cavity(M):
    prof = [(-1.0, 0.0), (-0.98, 0.3), (-0.85, 0.65), (-0.55, 0.9), (-0.2, 0.95), (0.15, 0.82), (0.4, 0.55),
            (0.55, 0.32), (0.65, 0.22), (1.05, 0.2), (1.1, 0.22)]
    g = lathe("gourd", tube_prof(prof, 0.04), M, segs=72, closed=True)
    g.rotation_euler = (0, -math.pi/2, 0)
    return Vector((0.35, -1, 0.5))


def p_body(M):
    pts = [(-1.45, 0.0), (-1.4, 0.45), (-1.2, 0.8), (-0.85, 0.95), (-0.45, 0.85), (-0.1, 0.64), (0.2, 0.62), (0.55, 0.78),
           (0.95, 0.95), (1.3, 0.98), (1.42, 0.86), (1.3, 0.7), (1.0, 0.52), (0.82, 0.3), (0.95, 0.2), (0.95, -0.2), (0.8, -0.3),
           (0.95, -0.5), (1.12, -0.7), (1.02, -0.82), (0.75, -0.76), (0.45, -0.64), (0.15, -0.6), (-0.15, -0.68), (-0.5, -0.9),
           (-0.9, -0.98), (-1.25, -0.82), (-1.42, -0.45)]
    pts = [(x, -z) for x, z in reversed(chaikin(pts, 3))]
    slab("body", pts, 0.38, M, rot=(math.pi/2, 0, 0), bevel=0.12, segs=5)
    pu = plain("pickup", (0.05, 0.05, 0.05), rough=0.4)
    for x in (0.45, -0.05):
        box("pickup", (0.22, 0.75, 0.06), (x, 0, 0.2), pu, bevel=0.02)
    box("bridge", (0.25, 0.8, 0.06), (-0.55, 0, 0.2), chrome(), bevel=0.02)
    for k in range(3):
        cyl("knob", 0.08, 0.1, (-0.75 - 0.25*k, -0.55 + 0.05*k, 0.22), (0, math.pi/2, 0), chrome(), bevel=0.02)
    return Vector((0.25, -0.7, 1.0))


# ---- couplers (M = resonator material)
def p_bridge(M):
    half = [(1.05, 0.0), (1.0, 0.15), (0.8, 0.4), (0.62, 0.62), (0.6, 0.78), (0.72, 0.92), (0.88, 1.05), (0.85, 1.2), (0.5, 1.32), (0.0, 1.36)]
    pts = [(0.6, 0.0), (0.55, 0.12), (0.3, 0.3), (0.0, 0.33)]
    pts = [(-x, z) for x, z in reversed(pts[1:])] + pts[:1]  # the arch between the feet, left to right
    pts = [(-0.6, 0.0)] + [(-x, z) for x, z in [(0.55, 0.12), (0.3, 0.3)]] + [(0.0, 0.33), (0.3, 0.3), (0.55, 0.12), (0.6, 0.0)]
    pts += half + [(-x, z) for x, z in reversed(half[:-1])]
    br = slab("bridge", chaikin(pts, 2), 0.12, M, bevel=0.02)
    heart = cyl("heart", 0.13, 1.0, (0, 0, 0.78), (0, 0, math.pi/2))
    boolean(br, heart)
    for x in (-0.55, 0.55):
        k = cyl("kidney", 0.07, 1.0, (x*1.15, 0, 0.8), (0, 0, math.pi/2)); boolean(br, k)
    for k, x in enumerate((-0.75, -0.25, 0.25, 0.75)):
        z = 1.25 + 0.06*(1 - abs(x))
        cyl("s", 0.02 + 0.005*(3 - k), 2.4, (x, 0, z + 0.03), (0, 0, math.pi/2), string_mat())
    return Vector((0.25, -1, 0.3))


def p_soundpost(M):
    box("top", (2.6, 1.0, 0.1), (0, 0, 0.75), maple(), bevel=0.02)
    box("back", (2.6, 1.0, 0.1), (0, 0, -0.75), darkwood(), bevel=0.02)
    cyl("post", 0.13, 1.4, (0, 0, 0), (0, math.pi/2, 0), M, bevel=0.01)
    return Vector((0.4, -1, 0.3))


def p_mouthpiece(M):
    prof = [(-1.6, 0.4), (-1.56, 0.5), (-1.48, 0.52), (-1.38, 0.5), (-1.15, 0.44), (-0.85, 0.3), (-0.55, 0.2),
            (0.2, 0.18), (1.55, 0.15), (1.6, 0.13), (1.6, 0.09), (0.2, 0.07), (-0.6, 0.06), (-0.95, 0.12), (-1.3, 0.3),
            (-1.5, 0.37), (-1.58, 0.38)]
    ob = lathe("mp", prof, M, segs=96, closed=True)
    ob.rotation_euler = (0, 0, math.pi)
    return Vector((0.5, -1, 0.35))


def p_windway(M):
    head = lathe("head", tube_prof([(-1.6, 0.42), (1.4, 0.42)], 0.1), M, segs=72, closed=True)
    beak = box("beak", (1.4, 1.2, 0.8), (-1.75, 0, -0.62), rot=(0, 0.45, 0), bevel=0)
    boolean(head, beak)
    win = box("window", (0.36, 0.5, 0.6), (0.0, 0, 0.42), bevel=0)
    boolean(head, win)
    lab = box("lab", (0.6, 0.7, 0.4), (0.38, 0, 0.6), rot=(0, 0.5, 0), bevel=0)
    boolean(head, lab)
    plug = cyl("block", 0.33, 1.5, (-0.92, 0, -0.02), mat=plain("cedar", (0.7, 0.42, 0.25), rough=0.6))
    return Vector((0.35, -1, 0.65))


# ---- radiators (M = resonator material)
def p_bell(M):
    prof = [(-1.9 + 3.5*u, 0.13 + 0.02*u + 0.95*u**6) for u in [i/50 for i in range(51)]]
    prof.append((1.6, 1.08 + 0.03))
    lathe("bell", tube_prof(prof, 0.035), M, segs=96, closed=True)
    return Vector((0.5, -1, 0.3))


def p_soundboard(M):
    pts = [(-1.6, -0.9), (1.6, -0.9), (1.6, -0.2)] + [(1.6 - 3.2*u, -0.2 + 1.1*math.sin(math.pi/2*u)**1.5) for u in [i/30 for i in range(1, 31)]]
    slab("board", pts, 0.08, M, rot=(math.pi/2, 0, 0), bevel=0.01)
    pts = [(-1.3 + 2.6*u, -0.55 + 0.75*u + 0.25*math.sin(math.pi*u), 0.09) for u in [i/30 for i in range(31)]]
    curve_tube("bridge", pts, 0.05, maple())
    return Vector((0.2, -0.8, 1.0))


def p_drumhead(M):
    shell = plain("shell", (0.12, 0.2, 0.45), metal=0.4, rough=0.2, coat=1.0)
    lathe("shell", tube_prof([(-0.6, 1.0), (0.6, 1.0)], 0.05), shell, segs=96, closed=True, axis='Z')
    cyl("head", 1.0, 0.02, (0, 0, 0.6), (0, -math.pi/2, 0), M, segs=96)
    ch = chrome()
    torus("hoop", 1.04, 0.05, (0, 0, 0.62), mat=ch, segs=96)
    for k in range(8):
        a = 2*math.pi*k/8
        x, y = 1.08*math.cos(a), 1.08*math.sin(a)
        cyl("rod", 0.025, 0.7, (x, y, 0.35), (0, math.pi/2, 0), ch)
        box("lug", (0.12, 0.12, 0.3), (1.03*math.cos(a), 1.03*math.sin(a), 0.0), ch, bevel=0.04, rot=(0, 0, a))
    return Vector((0.3, -1, 1.0))


def p_cone(M):
    lathe("cone", tube_prof([(0.0 + 0.6*u, 0.25 + 0.75*u**1.3) for u in [i/16 for i in range(17)]], 0.02), M, segs=96, closed=True, axis='Z')
    torus("surround", 1.08, 0.09, (0, 0, 0.6), mat=plain("surround", (0.06, 0.06, 0.07), rough=0.6), segs=96)
    sphere("cap", 0.28, (0, 0, 0.02), (1, 1, 0.5), M)
    lathe("frame", tube_prof([(0.55, 1.3), (0.62, 1.3)], 0.13), plain("frame", (0.2, 0.2, 0.22), metal=1, rough=0.4), segs=96, closed=True, axis='Z')
    return Vector((0.2, -1, 0.75))


# ---- frequency controls
def p_frets(M):
    rw = mat_shader(11, "rosewood")
    box("board", (3.6, 1.2, 0.18), (0, 0, 0), rw, bevel=0.02)
    x = -1.6; k = 0
    while x < 1.8:
        cyl("fret", 0.035, 1.2, (x, 0, 0.09), (0, 0, math.pi/2), nickel())
        nx = x + 0.55*0.94**k
        if k in (2, 4): sphere("dot", 0.07, ((x + nx)/2, 0, 0.09), (1, 1, 0.1), pearl())
        x = nx; k += 1
    for j in range(4):
        cyl("s", 0.018 + 0.005*j, 3.8, (0, -0.42 + 0.28*j, 0.22), mat=string_mat())
    return Vector((0.3, -1, 0.75))


def p_toneholes(M):
    gren = plain("grenadilla", (0.08, 0.06, 0.06), rough=0.25, coat=0.5)
    t = lathe("body", tube_prof([(-1.9, 0.38), (1.9, 0.38)], 0.12), gren, segs=72, closed=True)
    for k in range(5):
        h = cyl("hole", 0.11, 1.0, (-1.4 + 0.6*k, 0, 0.3), (0, math.pi/2, 0)); boolean(t, h)
    torus("ring", 0.11, 0.025, (-1.4 + 0.6*4, 0, 0.385), mat=nickel())
    cyl("cup", 0.17, 0.08, (1.45, 0, 0.45), (0, math.pi/2, 0), nickel(), bevel=0.02)
    cyl("arm", 0.025, 0.8, (1.85, 0, 0.47), mat=nickel())
    return Vector((0.3, -1, 0.6))


def p_valves(M):
    br = brass(); pl = pearl()
    for k in range(3):
        x = -0.75 + 0.75*k
        cyl("casing", 0.26, 1.6, (x, 0, 0), (0, math.pi/2, 0), br, bevel=0.03)
        torus("cap", 0.26, 0.04, (x, 0, 0.8), mat=br)
        cyl("stem", 0.05, 0.4, (x, 0, 1.0), (0, math.pi/2, 0), br)
        cyl("button", 0.2, 0.1, (x, 0, 1.22), (0, math.pi/2, 0), pl, bevel=0.03)
    cyl("pipe", 0.12, 2.6, (0, 0.3, -0.35), mat=br)
    return Vector((0.35, -1, 0.5))


def u_slide(length, sep, r, mat, z=0.0):
    for y in (-sep/2, sep/2):
        cyl("tube", r, length, (0, y, z), mat=mat)
    pts = [(length/2 + sep/2*math.sin(math.pi*u), sep/2*math.cos(math.pi*u), z) for u in [i/24 for i in range(25)]]
    curve_tube("bend", pts, r, mat)


def p_slide(M):
    br = brass()
    u_slide(3.2, 0.7, 0.07, br)
    cyl("outer", 0.095, 1.4, (-1.2, -0.35, 0), mat=br)
    cyl("outer", 0.095, 1.4, (-1.2, 0.35, 0), mat=br)
    cyl("brace", 0.04, 0.7, (-0.5, 0, 0), (0, 0, math.pi/2), br)
    return Vector((0.3, -0.6, 1.0))


def p_keys(M):
    ivory = plain("ivory", (0.96, 0.95, 0.92), rough=0.25, coat=0.3)
    eb = plain("ebony", (0.04, 0.04, 0.045), rough=0.2, coat=0.6)
    for k in range(7):
        box("white", (0.46, 2.0, 0.3), (-1.5 + 0.5*k, 0, 0), ivory, bevel=0.02)
    for k in (0, 1, 3, 4, 5):
        box("black", (0.28, 1.2, 0.3), (-1.25 + 0.5*k, 0.4, 0.28), eb, bevel=0.03)
    return Vector((0.2, -1, 1.0))


# ---- tuning mechanisms
def peg(loc, mat):
    e = bpy.data.objects.new("peg", None); link(e)
    s = lathe("shaft", [(0, 0), (0, 0.09), (1.5, 0.06), (1.55, 0)], mat, segs=32); s.parent = e
    c = lathe("collar", [(-0.15, 0), (-0.15, 0.12), (0.0, 0.12), (0.0, 0)], mat, segs=32); c.parent = e
    h = sphere("thumb", 0.45, (-0.55, 0, 0), (0.85, 0.22, 0.7), mat); h.parent = e
    e.location = loc
    return e


def p_peg(M):
    eb = ebony()
    box("pegbox", (0.9, 1.6, 0.5), (0.55, 0.3, 0), maple(), bevel=0.06, rot=(0, 0, 0))
    peg((-0.2, 0.0, 0.0), eb)
    peg((-0.2, 0.7, 0.0), eb)
    return Vector((0.3, -1, 0.6))


def p_tuning_pin(M):
    box("block", (3.4, 1.2, 0.5), (0, 0, -0.25), darkwood(), bevel=0.03)
    st = plain("pin", (0.6, 0.62, 0.66), metal=1, rough=0.3)
    for k in range(4):
        x = -1.2 + 0.8*k
        cyl("pin", 0.1, 0.8, (x, 0, 0.3), (0, math.pi/2, 0), st)
        box("head", (0.18, 0.18, 0.2), (x, 0, 0.75), st, bevel=0.02)
        for j in range(3):
            torus("coil", 0.12, 0.025, (x, 0, 0.12 + 0.05*j), mat=string_mat(), segs=32, rsegs=8)
        cyl("wire", 0.02, 1.6, (x, 0.85, 0.15), (0, 0, math.pi/2), string_mat())
    return Vector((0.3, -1, 0.9))


def p_machine_head(M):
    ch = chrome()
    box("plate", (2.4, 0.9, 0.08), (0, 0, -0.04), ch, bevel=0.03)
    cyl("housing", 0.45, 0.45, (-0.2, 0, 0.22), (0, math.pi/2, 0), ch, bevel=0.06)
    cyl("post", 0.12, 0.7, (-0.2, 0, 0.75), (0, math.pi/2, 0), ch)
    cyl("hole", 0.05, 0.3, (-0.2, 0, 0.9), (0, 0, math.pi/2), black(0.8))
    cyl("shaft", 0.06, 0.6, (0.4, 0, 0.22), mat=ch)
    sphere("button", 0.38, (0.95, 0, 0.22), (0.55, 0.22, 1.0), pearl())
    return Vector((0.4, -1, 0.6))


def p_tuning_slide(M):
    u_slide(2.4, 0.9, 0.11, brass())
    for y in (-0.45, 0.45):
        cyl("outer", 0.14, 0.9, (-1.4, y, 0), mat=brass())
    return Vector((0.35, -0.7, 0.9))


# ---- damping
def strings_row(n=4, length=3.6, z=0.0, sep=0.3):
    for j in range(n):
        cyl("s", 0.02 + 0.005*j, length, (0, -sep*(n - 1)/2 + sep*j, z), mat=string_mat())


def p_damper(M):
    strings_row(3, z=-0.3)
    felt_ = felt((0.95, 0.94, 0.9))
    box("felt", (0.9, 1.1, 0.4), (0, 0, 0.0), felt_, bevel=0.05)
    box("head", (1.0, 1.15, 0.35), (0, 0, 0.38), maple(), bevel=0.04)
    cyl("wire", 0.04, 1.6, (0, 0, 1.3), (0, math.pi/2, 0), string_mat())
    return Vector((0.35, -1, 0.5))


def p_mute(M):
    al = mat_shader(3, "alu")
    lathe("mute", tube_prof([(-1.6, 0.18), (1.0, 0.75), (1.1, 0.75)], 0.03), al, segs=72, closed=True)
    cyl("end", 0.74, 0.06, (1.12, 0, 0), mat=al)
    cork = plain("cork", (0.75, 0.55, 0.35), rough=0.9)
    for a in (0, 2.1, 4.2):
        box("cork", (0.6, 0.06, 0.12), (-1.0, 0.33*math.cos(a), 0.33*math.sin(a)), cork, bevel=0.01, rot=(a, -0.22, 0))
    return Vector((0.4, -1, 0.35))


def hand(sk, loc=(0, 0, 0), rot=(0, 0, 0), spread=0.15, curl=0.0):
    """A right hand, palm towards -Y, fingers up (+Z), thumb to +X."""
    e = bpy.data.objects.new("hand", None); link(e)
    p = box("palm", (1.0, 0.32, 1.05), (0, 0, 0), sk, bevel=0.15, segs=5); p.parent = e
    for k in range(4):
        x = -0.36 + 0.24*k
        L = (0.72, 0.9, 0.98, 0.88)[k]
        a = spread*(k - 2.2)
        d = (math.sin(a), -math.sin(curl), math.cos(a))
        f = finger((x, 0, 0.45), d, sk, L, 0.115, nail=True, up=(0, 1, 0)); f.parent = e
    t = finger((0.42, -0.05, -0.2), (1, -0.35, 0.75), sk, 0.75, 0.13, nail=True, up=(0, 1, 0)); t.parent = e
    e.location = loc; e.rotation_euler = rot
    return e


def p_palm(M):
    strings_row(4, length=2.6, z=-0.55, sep=0.35)
    hand(skin(), (-0.2, 0, -0.2), (math.pi/2, 0.15, math.pi/2 - 0.3), spread=0.06, curl=0.25)
    return Vector((0.3, -1, 0.45))


def p_felt(M):
    strings_row(5, length=3.6, z=-0.05, sep=0.28)
    box("felt", (0.5, 1.6, 0.18), (0.0, 0, 0.12), felt((0.72, 0.12, 0.16)), bevel=0.04)
    box("rail", (0.3, 1.7, 0.12), (0.0, 0, 0.27), maple(), bevel=0.02)
    return Vector((0.4, -1, 0.6))


def p_hand(M):
    hand(skin(), (0, 0, 0), (0.1, 0, -0.15), spread=0.14)
    return Vector((0.15, -1, 0.15))


# ---- modulation / control
def p_keywork(M):
    ni = nickel(); pad = plain("pad", (0.75, 0.6, 0.4), rough=0.6)
    cyl("rod", 0.05, 3.6, (0, 0.3, 0.6), mat=ni)
    for k in range(3):
        x = -1.1 + 1.1*k
        cyl("arm", 0.035, 0.55, (x, 0.15, 0.35), (0.6, math.pi/2, 0), ni)
        lathe("cup", [(0, 0), (0, 0.32), (0.12, 0.32), (0.12, 0.28), (0.03, 0.28), (0.03, 0)], ni, segs=48, axis='Z').location = (x, 0, 0.0)
        cyl("pad", 0.28, 0.03, (x, 0, -0.01), (0, math.pi/2, 0), pad)
    return Vector((0.3, -1, 0.7))


def p_pedals(M):
    br = brass()
    box("block", (3.0, 1.0, 0.7), (0, 0.6, 0.0), darkwood(), bevel=0.05)
    for x in (-0.8, 0.0, 0.8):
        pts = [(-0.18, 0.0), (0.18, 0.0), (0.22, 1.1), (0.0, 1.3), (-0.22, 1.1)]
        slab("pedal", pts, 0.08, br, loc=(x, 0.15, -0.1), rot=(math.pi/2 - 0.1, 0, 0), bevel=0.03)
    return Vector((0.3, -1, 0.7))


def p_rotary(M):
    br = brass()
    for k in range(2):
        x = -0.7 + 1.4*k
        cyl("casing", 0.45, 0.7, (x, 0, 0), (0, math.pi/2, 0), br, bevel=0.04)
        cyl("cap", 0.3, 0.12, (x, 0, 0.4), (0, math.pi/2, 0), br, bevel=0.03)
        box("stop", (0.6, 0.08, 0.06), (x, 0, 0.5), br, bevel=0.02, rot=(0, 0, 0.6))
        box("lever", (0.12, 1.4, 0.08), (x + 0.3, -0.9, 0.2), br, bevel=0.03)
        cyl("touch", 0.16, 0.08, (x + 0.3, -1.6, 0.25), (0, math.pi/2, 0), pearl(), bevel=0.02)
    cyl("pipe", 0.12, 3.2, (0, 0.6, 0), mat=br)
    return Vector((0.3, -1, 0.8))


def p_lever(M):
    ni = nickel()
    box("lever", (2.6, 0.18, 0.18), (0.2, 0, 0.2), ni, bevel=0.05, rot=(0, 0.35, 0))
    cyl("pivot", 0.18, 0.4, (-0.3, 0, 0.0), (0, 0, math.pi/2), plain("dark", (0.15, 0.15, 0.17), metal=1, rough=0.4))
    pts = [(0.9 + 0.15*math.cos(12*math.pi*u), 0.15*math.sin(12*math.pi*u), -0.65 + 0.7*u) for u in [i/200 for i in range(201)]]
    curve_tube("spring", pts, 0.025, string_mat())
    box("base", (2.6, 0.7, 0.15), (0.2, 0, -0.75), darkwood(), bevel=0.03)
    return Vector((0.3, -1, 0.35))


def p_electronics(M):
    pcb, nt, b = new_mat("pcb")
    setp(b, base=(0.05, 0.35, 0.18), rough=0.3, coat=0.6)
    box("board", (3.2, 2.0, 0.08), (0, 0, 0), pcb, bevel=0.01)
    cu = plain("copper", (0.9, 0.7, 0.3), metal=1, rough=0.3)
    for k in range(9):
        box("trace", (2.6, 0.04, 0.01), (0, -0.85 + 0.21*k, 0.045), cu, bevel=0)
    chip = plain("chip", (0.06, 0.06, 0.07), rough=0.4)
    box("chip", (0.9, 0.6, 0.12), (-0.6, 0.2, 0.1), chip, bevel=0.01)
    for j in range(6):
        for s in (-1, 1):
            box("leg", (0.06, 0.12, 0.04), (-0.95 + 0.14*j, 0.2 + s*0.34, 0.06), nickel(), bevel=0)
    for k, c in enumerate([(1, 0.2, 0.2), (0.3, 1, 0.4), (1, 0.8, 0.2)]):
        sphere("led", 0.09, (0.5 + 0.3*k, -0.5, 0.12), mat=plain("led", c, emit=c, emit_s=6))
    for x in (0.6, 1.2):
        cyl("knob", 0.2, 0.3, (x, 0.45, 0.2), (0, math.pi/2, 0), plain("knob", (0.1, 0.1, 0.11), rough=0.3), bevel=0.04)
        box("mark", (0.03, 0.15, 0.02), (x, 0.38, 0.36), plain("w", (1, 1, 1)), bevel=0)
    return Vector((0.25, -1, 1.0))


# ---- material swatch: a rounded block (tin is corrugated, chain link a fence panel)
def p_swatch(M, m=None):
    if m == 27:
        bm = bmesh.new()
        bmesh.ops.create_grid(bm, x_segments=80, y_segments=2, size=1.0)
        bmesh.ops.scale(bm, vec=(1.6, 1.0, 1), verts=bm.verts)
        for v in bm.verts: v.co.z = 0.07*math.sin(v.co.x*14)
        ob = mesh_ob("tin", bm, M); ob.rotation_euler = (math.pi/2 - 0.2, 0, 0)
        md = ob.modifiers.new("s", 'SOLIDIFY'); md.thickness = 0.02
    elif m == 29:
        ob = box("fence", (2.6, 0.04, 1.7), (0, 0, 0), M, bevel=0)
        st = plain("post", (0.6, 0.64, 0.6), metal=1, rough=0.35)
        for x in (-1.33, 1.33):
            cyl("post", 0.06, 1.9, (x, 0, 0), (0, math.pi/2, 0), st)
        cyl("top", 0.04, 2.7, (0, 0, 0.88), mat=st)
    else:
        box("swatch", (2.2, 1.6, 1.0), (0, 0, 0), M, bevel=0.22, segs=6)
    return Vector((0.55, -1, 0.65))


BUILD = {
    0: [p_breath, p_bow, p_finger, p_plectrum, p_hammer, p_electricity],
    1: [p_reed, p_lips, p_piano_hammer, p_bow_on_string, p_pick_on_string, p_mallet],
    2: [p_string, p_membrane, p_bar, p_plate, p_tine, p_air_column],
    4: [p_bore, p_soundbox, p_pipe, p_cavity, p_body],
    6: [p_bridge, p_soundpost, p_mouthpiece, p_windway],
    7: [p_bell, p_soundboard, p_drumhead, p_cone],
    8: [p_frets, p_toneholes, p_valves, p_slide, p_keys],
    9: [p_peg, p_tuning_pin, p_machine_head, p_tuning_slide],
    10: [p_damper, p_mute, p_palm, p_felt, p_hand],
    11: [p_keywork, p_pedals, p_rotary, p_lever, p_electronics],
}
WITH_MAT = (2, 4, 6, 7)


def compress(path):
    try:
        import imagequant
        from PIL import Image
    except ImportError:
        return
    im = Image.open(path).convert("RGBA")
    imagequant.quantize_pil_image(im, dithering_level=1.0, min_quality=70, max_quality=95).save(path, optimize=True)


def render(path):
    sc = bpy.context.scene; sc.render.filepath = path
    bpy.ops.render.render(write_still=True)
    compress(path)


def objects_with(mat):
    return [o for o in bpy.context.scene.objects if o.type in ('MESH', 'CURVE') and o.data.materials and o.data.materials[0] == mat]


def run_shape(c, i, mats, rust=True):
    """Build one shape once, then swap the material through the list."""
    reset_scene()
    holder = bpy.data.materials.new("HOLDER") if c in WITH_MAT or c == 3 else None
    view = BUILD[c][i](holder) if c != 3 else None
    frame(view)
    if holder is None:
        t = time.time(); render(os.path.join(OUT, "c%d_%d.png" % (c, i))); print("c%d_%d %.1fs" % (c, i, time.time() - t), flush=True)
        return
    obs = objects_with(holder)
    for m in mats:
        mm = mat_shader(m)
        for o in obs: o.data.materials[0] = mm
        t = time.time(); render(os.path.join(OUT, "c%d_%d_m%d.png" % (c, i, m)))
        print("c%d_%d_m%d %.1fs" % (c, i, m, time.time() - t), flush=True)
    if rust:
        rm = rust_shader()
        others = [o for o in bpy.context.scene.objects if o.type in ('MESH', 'CURVE') and o not in obs]
        for o in others: o.hide_render = True
        for o in obs: o.data.materials[0] = rm
        render(os.path.join(OUT, "c%d_%d_rust.png" % (c, i)))
        print("c%d_%d_rust" % (c, i), flush=True)


# names for the saved .blend files, in the plugin's option order
CAT_SLUG = {0: "energy-source", 1: "exciter", 2: "vibrating-element", 4: "resonator", 6: "coupler",
            7: "radiator", 8: "frequency-control", 9: "tuning", 10: "damping", 11: "modulation"}
OPT_NAMES = {0: ["Breath", "Bow", "Finger", "Plectrum", "Hammer", "Electricity"],
             1: ["Reed", "Lips", "Hammer", "Bow", "Plectrum", "Mallet"],
             2: ["String", "Membrane", "Bar", "Plate", "Reed", "Air column"],
             4: ["Bore", "Soundbox", "Pipe", "Cavity", "Body"],
             6: ["Bridge", "Soundpost", "Mouthpiece", "Windway"],
             7: ["Bell", "Soundboard", "Drumhead", "Cone"],
             8: ["Fret", "Tone hole", "Valve", "Slide", "Key"],
             9: ["Peg", "Tuning pin", "Machine head", "Slide"],
             10: ["Damper", "Mute", "Palm", "Felt", "Hand"],
             11: ["Keywork", "Pedals", "Valves", "Levers", "Electronics"]}
BLEND_MAT = 1        # parts made of a material are saved in brass; the other 30 are in the file too


def slug(t):
    return t.lower().replace(" ", "-")


def save_blend(path):
    bpy.ops.wm.save_as_mainfile(filepath=path, compress=True)
    print(os.path.basename(path), flush=True)


def blend_shape(c, i, outdir):
    """Save one model, as rendered, with every material available in the file."""
    reset_scene()
    holder = bpy.data.materials.new("HOLDER") if c in WITH_MAT else None
    view = BUILD[c][i](holder)
    frame(view)
    if holder is not None:
        mats = [mat_shader(m) for m in range(NMAT)] + [rust_shader()]
        for mm in mats: mm.use_fake_user = True
        for o in objects_with(holder): o.data.materials[0] = mats[BLEND_MAT]
        bpy.data.materials.remove(holder)
    bpy.context.scene.name = "%s: %s" % (CAT_SLUG[c].replace("-", " "), OPT_NAMES[c][i])
    save_blend(os.path.join(outdir, "%s-%s.blend" % (CAT_SLUG[c], slug(OPT_NAMES[c][i]))))


def blend_materials(outdir):
    """All 31 material swatches (and the rust layer) on a table, labelled."""
    reset_scene()
    cols = 8; lab = plain("label", (0.9, 0.9, 0.92))
    table = bpy.data.objects.new("table", None); link(table)
    for m in list(range(NMAT)) + [-1]:
        before = set(bpy.context.scene.objects)
        M = mat_shader(m) if m >= 0 else rust_shader()
        p_swatch(M, m if m >= 0 else None)
        k = m if m >= 0 else NMAT
        off = Vector(((k % cols - (cols - 1)/2)*3.4, (k//cols - 1.5)*3.6, 0))
        cu = bpy.data.curves.new("label", 'FONT'); cu.body = MATS[m][0] if m >= 0 else "Rust (Age)"
        cu.size = 0.42; cu.align_x = 'CENTER'
        t = link(bpy.data.objects.new("label", cu)); t.location = (0, -1.25, -0.5); t.rotation_euler = (0.6, 0, 0)
        t.data.materials.append(lab)
        for o in set(bpy.context.scene.objects) - before:
            if o.parent is None:
                o.location += off; o.parent = table
    table.scale = (0.3, 0.3, 0.3)
    frame(Vector((0.0, -1, 1.3)), margin=0.03)
    bpy.context.scene.name = "materials"
    save_blend(os.path.join(outdir, "materials.blend"))


def run_swatches(mats, rust=True):
    for m in mats:
        reset_scene()
        M = mat_shader(m)
        view = p_swatch(M, m)
        frame(view, margin=0.1)
        render(os.path.join(OUT, "mat%d.png" % m)); print("mat%d" % m, flush=True)
    if rust:
        reset_scene(); M = rust_shader(); view = p_swatch(M); frame(view, margin=0.1)
        render(os.path.join(OUT, "mat_rust.png")); print("mat_rust", flush=True)


def main(argv):
    global SAMPLES, OUT
    mats = list(range(NMAT)); want = []; rust = True
    k = 0
    while k < len(argv):
        a = argv[k]
        if a == '--mats':
            mats = []; k += 1
            while k < len(argv) and argv[k].isdigit(): mats.append(int(argv[k])); k += 1
            continue
        if a == '--samples': SAMPLES = int(argv[k + 1]); k += 2; continue
        if a == '--norust': rust = False; k += 1; continue
        if a == '--out': OUT = argv[k + 1]; k += 2; continue
        if a == '--blend':
            outdir = os.path.join(ROOT, "blender"); os.makedirs(outdir, exist_ok=True)
            for c in sorted(BUILD):
                for i in range(len(BUILD[c])):
                    if not want or str(c) in want or "%d_%d" % (c, i) in want:
                        blend_shape(c, i, outdir)
            if not want or "mat" in want:
                blend_materials(outdir)
            return
        if a == '--compress':
            for f in sorted(os.listdir(OUT)):
                if f.endswith(".png"): compress(os.path.join(OUT, f))
            return
        want.append(a); k += 1
    os.makedirs(OUT, exist_ok=True)
    jobs = []
    for c in sorted(BUILD):
        for i in range(len(BUILD[c])):
            if not want or str(c) in want or "%d_%d" % (c, i) in want:
                jobs.append((c, i))
    for c, i in jobs:
        run_shape(c, i, mats, rust)
    if not want or "3" in want or "mat" in want:
        run_swatches(mats, rust)


if __name__ == "__main__":
    main(sys.argv[1:])

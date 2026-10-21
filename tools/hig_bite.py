"""Prove tools/hig_check.py bites: break each rule of ADR 0023 on purpose, in a
copy of the plugin in a temporary folder (never the working tree), and check
the suite fails.   python3 tools/hig_bite.py [words to pick some cases]

Prints BIT (a check failed, and which), MISSED (nothing noticed: a gap to
close with a new check), CRASH (the suite broke instead of failing a check:
make it fail cleanly) or DID NOT APPLY (the code has changed; update the
case). About a minute per case.
"""
import os, shutil, subprocess, sys, tempfile
REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
S = tempfile.mkdtemp(prefix="hig_bite_")
src = open(os.path.join(REPO, "Instrument-Creator.jsfx"), encoding="utf-8").read()
cases = [
 ("secondary text back to #8A919C", "T_DIM = 0xB0B6C0;", "T_DIM = 0x8A919C;"),
 ("tile captions only 7:1 unhovered", "T_LABEL = 0xC4C9D2;", "T_LABEL = 0xB0B6C0;"),
 ("material names in the old cyan", "T_ELEM = 0x7FD8F5;", "T_ELEM = 0x59CCF2;"),
 ("chosen button the old bright blue", "C_ON = 0x2B4C80;", "C_ON = 0x426BA8;"),
 ("header buttons 24 px tall", "bh_ = 28*gsc;", "bh_ = 24*gsc;"),
 ("controls 6 px apart", "cgp = 12*gsc;", "cgp = 6*gsc;"),
 ("interface size ignored", "gsc = max(1, gfx_ext_retina)*ui_zoom;", "gsc = max(1, gfx_ext_retina);"),
 ("a size not through the scale", "z = min(24*gsc, floor(0.42*h));", "z = min(24*gsc, floor(0.42*h)); pad = 12;"),
 ("controls not focusable", "f = focusable(40 + k, x, y, w, h);", "f = 0;"),
 ("Shift+Tab goes forward", "(mouse_cap & 8) ? ( cur = cur <= 0", "0 ? ( cur = cur <= 0"),
 ("Esc ignored", ": key == 27 ? focus_id = 0;", ";"),
 ("arrow keys ignored on a part", "(key == 'rght' || key == 'down') ? ( key = 0; set_part", "(0) ? ( key = 0; set_part"),
 ("Delete does not reset", "(key == 8 || key == 'del')", "(0)"),
 ("ring in the accent", "C_RING = 0xF2F4F7;", "C_RING = 0xFFF200;"),
 ("ring one pixel", "loop(max(2, floor(2*gsc + 0.5)), gfx_rect(fr_x", "loop(1, gfx_rect(fr_x"),
 ("Play Mode bar gone", "on ? gfx_rect(d + 0.5*(sw_ - tw)", "0 ? gfx_rect(d + 0.5*(sw_ - tw)"),
 ("Playing bar gone", "on ? gfx_rect(x + 0.5*(w - tw), y + h - 5*gsc", "0 ? gfx_rect(x + 0.5*(w - tw), y + h - 5*gsc"),
 ("message on a timer", "msg_on = pics_missing && !msg_gone;", "msg_t += 1; msg_on = pics_missing && !msg_gone && msg_t < 100;"),
 ("Reduce Motion ignored by drawings", "calm ? anim_ph = 0 : (", "0 ? anim_ph = 0 : ("),
 ("Reduce Motion ignored by the shake", "(big && c == 2 && !calm)", "(big && c == 2)"),
 ("preferences not saved", "file_var(0, ui_zoom);\nfile_var(0, calm);", "file_var(0, dummy1);\nfile_var(0, dummy2);"),
 ("a word bypassing say()", "gfx_x = ax; gfx_y = ay; say(s_);", "gfx_x = ax; gfx_y = ay; gfx_drawstr(s_);"),
 ("a 9 px font", "gfx_setfont(4, #ui_font, 10*gsc, 'b');", "gfx_setfont(4, #ui_font, 9*gsc, 'b');"),
 ("Arial everywhere", "gfx_setfont(1, #ui_font, 13*gsc);", "gfx_setfont(1, \"Arial\", 13*gsc);"),
 ("controls back at the bottom", "cty = top_ + 12*gsc;", "cty = gh - 60*gsc;"),
 ("the picture never gives way", "pw < 0.2*w ? pw = 0;", "pw = max(pw, 0.2*w);"),
 ("short tiles keep every line", "cap = bh + t4 + 4*gsc <= h - 12*gsc;", "cap = 1;"),
 ("value always beside the name", "vin1 = ctl_row_fits(0, 7, cw2);", "vin1 = 1;"),
 ("full name chosen without room for the value", "say(tw1 + (vin ? vw + 26*gsc : 20*gsc) <= w ? ctl_title(k) : ctl_short(k));", "say(tw1 + 20*gsc <= w ? ctl_title(k) : ctl_short(k));"),
 ("More not reachable by keyboard", "((hv && clicked) || activated(60)) ? more_ctl", "(hv && clicked) ? more_ctl"),
 # the final sweep (21 October 2026)
 ("F: edges back to the old grey", "C_ON = 0x2B4C80; C_EDGE = 0x6D7581;", "C_ON = 0x2B4C80; C_EDGE = 0x4D5261;"),
 ("F: tiles without an edge", "edge(C_EDGE, x, y, w, h); group_col(c);", "group_col(c);"),
 ("F: control cells without an edge", "  edge(C_EDGE, x, y, w, h);\n  ctl_col(k);", "  ctl_col(k);"),
 ("F: More without an edge", "edge(C_EDGE, x, y, w, h);\n  s = more_ctl", "s = more_ctl"),
 ("F: track without its edge", "    edge(C_TRACK, x0, ty - 2*gsc, x1 - x0, 4*gsc);", ""),
 ("F: inner edges in the cell grey", "C_TRACK = 0x80879A;", "C_TRACK = 0x6D7581;"),
 ("F: switch halves without an edge", "      edge(C_TRACK, d, segy, sw_, segh);", ""),
 ("F: arrows two pixels at any size", "loop(max(2, floor(2*gsc + 0.5)), gfx_line(x1 - k*uy", "loop(2, gfx_line(x1 - k*uy"),
 ("F: a size that does not fit drawn anyway", "zoom_fit = max(1, min(ui_zoom, min(gfx_w/(800*ret_), gfx_h/(480*ret_))));", "zoom_fit = ui_zoom;"),
 ("F: fitted below 100%", "zoom_fit = max(1, min(ui_zoom,", "zoom_fit = max(0.5, min(ui_zoom,"),
 ("F: Options silent about the fitted size", "zoom_fit < ui_zoom - 0.005 ?", "0 ?"),
 ("F: preset without an undo point first", "r > 0 && r <= PRESET_N ? ( sliderchange(-1); want_preset = r; );", "r > 0 && r <= PRESET_N ? ( want_preset = r; );"),
 ("F: preset applied at once", "r > 0 && r <= PRESET_N ? ( sliderchange(-1); want_preset = r; );", "r > 0 && r <= PRESET_N ? ( sliderchange(-1); apply_preset(r - 1); );"),
 ("F: no undo point after the change", "  sliderchange(-1); want_preset = 0; want_rand = 0;", "  want_preset = 0; want_rand = 0;"),
 ("F: Surprise Me without an undo point", "( sliderchange(-1); want_rand = 1; )", "( want_rand = 1; )"),
 ("F: a description cut short", "  wrap_ymax = py_ + ph_ - 6*gsc;", "  wrap_ymax = py_ + 60*gsc;"),
 ("F: a caption cut with an ellipsis", "tx + tw > tmax ? s = cat_short(c);", "tx + tw > tmax ? s = \"Exci…\";"),
 ("F: tile words close to the edge", "cap = bh + t4 + 4*gsc <= h - 12*gsc;", "cap = bh + t4 + 4*gsc <= h - 6*gsc;"),
 ("F: Poly's bar on its word", "ceil(segy + gsc + th) + floor(0.5*gsc)", "segy + gsc + th + 0.5*gsc"),
]
only = sys.argv[1:]
for name, old, new in cases:
    if only and not any(o in name for o in only): continue
    if src.count(old) != 1:
        print("DID NOT APPLY ", name, src.count(old)); continue
    d = os.path.join(S, "w"); shutil.rmtree(d, ignore_errors=True); os.makedirs(d)
    open(os.path.join(d, "Instrument-Creator.jsfx"), "w", encoding="utf-8").write(src.replace(old, new))
    os.symlink(os.path.join(REPO, "Instrument-Creator-images"), os.path.join(d, "Instrument-Creator-images"))
    r = subprocess.run(["python3", os.path.join(REPO, "tools", "hig_check.py"), os.path.join(d, "Instrument-Creator.jsfx")], capture_output=True, text=True)
    failed = [l[6:] for l in r.stdout.splitlines() if l.startswith("FAIL")]
    crashed = r.returncode and not failed
    print(("BIT    " if failed else "CRASH  " if crashed else "MISSED ") + name + ("  <- " + failed[0][:90] if failed else (r.stdout[-200:] + r.stderr[-300:] if crashed else "")))
shutil.rmtree(S, ignore_errors=True)

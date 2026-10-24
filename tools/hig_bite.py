"""Prove tools/hig_check.py bites: break each rule of ADR 0023 and ADR 0024 on purpose, in a
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
 ("label captions only 7:1 unhovered", "T_LABEL = 0xC4C9D2;", "T_LABEL = 0xB0B6C0;"),
 ("material names in the old cyan", "T_ELEM = 0x7FD8F5;", "T_ELEM = 0x59CCF2;"),
 ("chosen button the old bright blue", "C_ON = 0x2B4C80;", "C_ON = 0x426BA8;"),
 ("header buttons 24 px tall", "bh_ = 28*gsc;", "bh_ = 24*gsc;"),
 ("controls 6 px apart", "cgp = 12*gsc;", "cgp = 6*gsc;"),
 ("interface size ignored", "gsc = ret_*zoom_fit;", "gsc = ret_;"),
 ("a size not through the scale", "tx = x + 12*gsc; ty = y + 9*gsc", "tx = x + 12; ty = y + 9*gsc"),
 ("controls not focusable", "f = focusable(40 + k, x, y, w, h);", "f = 0;"),
 ("labels not focusable", "f = focusable(10 + c, x, y, w, h);", "f = 0;"),
 ("Shift+Tab goes forward", "(mouse_cap & 8) ? ( cur = cur <= 0", "0 ? ( cur = cur <= 0"),
 ("Esc ignored", "pop_c >= 0 ? ( focus_id = focus_id > 0 ? 10 + pop_c : 0; pop_c = -1; ) : focus_id = 0;", "0;"),
 ("arrow keys ignored on a part", "(key == 'rght' || key == 'down') ? ( key = 0; set_part", "(0) ? ( key = 0; set_part"),
 ("Delete does not reset", "(key == 8 || key == 'del')", "(0)"),
 ("ring in the accent", "C_RING = 0xF2F4F7;", "C_RING = 0xFFF200;"),
 ("ring one pixel", "loop(max(2, floor(2*gsc + 0.5)), gfx_roundrect(", "loop(1, gfx_roundrect("),
 ("Play Mode bar gone", "on ? gfx_rect(d + 0.5*(sw_ - tw)", "0 ? gfx_rect(d + 0.5*(sw_ - tw)"),
 ("Playing bar gone", "on ? gfx_rect(x + 0.5*(w - tw), y + h - 5*gsc", "0 ? gfx_rect(x + 0.5*(w - tw), y + h - 5*gsc"),
 ("Reduce Motion ignored", "calm ? anim_ph = 0 : (", "0 ? anim_ph = 0 : ("),
 ("preferences not saved", "file_var(0, ui_zoom);\nfile_var(0, calm);", "file_var(0, dummy1);\nfile_var(0, dummy2);"),
 ("a word bypassing say()", "gfx_x = px + ip; gfx_y = py + ip + 0.5*(hh - th); say(cat_name(c));", "gfx_x = px + ip; gfx_y = py + ip + 0.5*(hh - th); gfx_drawstr(cat_name(c));"),
 ("a 9 px font", "gfx_setfont(4, #ui_font, 10*gsc, 'b');", "gfx_setfont(4, #ui_font, 9*gsc, 'b');"),
 ("Arial everywhere", "gfx_setfont(1, #ui_font, 13*gsc);", "gfx_setfont(1, \"Arial\", 13*gsc);"),
 ("controls back at the bottom", "cty = top_ + 12*gsc;", "cty = gh - 60*gsc;"),
 ("labels never give way when a row is short", "while (lv_ < 3 &&", "while (0 &&"),
 ("value always beside the name", "vin1 = ctl_row_fits(0, 7, cw2);", "vin1 = 1;"),
 ("full name chosen without room for the value", "say(tw1 + (vin ? vw + 26*gsc : 20*gsc) <= w ? ctl_title(k) : ctl_short(k));", "say(tw1 + 20*gsc <= w ? ctl_title(k) : ctl_short(k));"),
 ("More not reachable by keyboard", "((hv && clicked) || activated(60)) ? more_ctl", "(hv && clicked) ? more_ctl"),
 # the final sweep (21 October 2026)
 ("F: edges back to the old grey", "C_ON = 0x2B4C80; C_EDGE = 0x6D7581;", "C_ON = 0x2B4C80; C_EDGE = 0x4D5261;"),
 ("F: labels without an edge", "rbox(x, y, w, h, 6*gsc, hv ? C_TILE_HOV : C_TILE, on ? group_hex(c) : C_EDGE);", "rbox(x, y, w, h, 6*gsc, hv ? C_TILE_HOV : C_TILE, on ? group_hex(c) : C_TILE);"),
 ("F: control cells without an edge", "rbox(x, y, w, h, 6*gsc, hv || drag_k == k ? C_TILE_HOV : C_TILE, C_EDGE);", "rbox(x, y, w, h, 6*gsc, hv || drag_k == k ? C_TILE_HOV : C_TILE, C_TILE);"),
 ("F: More without an edge", "rbox(x, y, w, h, 6*gsc, hv ? C_TILE_HOV : C_TILE, C_EDGE);\n  s = more_ctl", "rbox(x, y, w, h, 6*gsc, hv ? C_TILE_HOV : C_TILE, C_TILE);\n  s = more_ctl"),
 ("F: track without its edge", "    edge(C_TRACK, x0, ty - 2*gsc, x1 - x0, 4*gsc);", ""),
 ("F: inner edges in the cell grey", "C_TRACK = 0x80879A;", "C_TRACK = 0x6D7581;"),
 ("F: switch halves without an edge", "rbox(d, segy, sw_, segh, 4*gsc, on ? C_ON : C_SEG, C_TRACK);", "rbox(d, segy, sw_, segh, 4*gsc, on ? C_ON : C_SEG, on ? C_ON : C_SEG);"),
 ("F: a size that does not fit drawn anyway", "zoom_fit = max(1, min(ui_zoom, min(gfx_w/(800*ret_), gfx_h/(480*ret_))));", "zoom_fit = ui_zoom;"),
 ("F: fitted below 100%", "zoom_fit = max(1, min(ui_zoom,", "zoom_fit = max(0.5, min(ui_zoom,"),
 ("F: Options silent about the fitted size", "zoom_fit < ui_zoom - 0.005 ?", "0 ?"),
 ("F: preset without an undo point first", "r > 0 && r <= PRESET_N ? ( sliderchange(-1); want_preset = r; );", "r > 0 && r <= PRESET_N ? ( want_preset = r; );"),
 ("F: preset applied at once", "r > 0 && r <= PRESET_N ? ( sliderchange(-1); want_preset = r; );", "r > 0 && r <= PRESET_N ? ( sliderchange(-1); apply_preset(r - 1); );"),
 ("F: no undo point after the change", "  sliderchange(-1); want_preset = 0; want_rand = 0;", "  want_preset = 0; want_rand = 0;"),
 ("F: Surprise Me without an undo point", "( sliderchange(-1); want_rand = 1; )", "( want_rand = 1; )"),
 ("F: a description cut short", "  wrap_ymax = py_ + ph_ - 6*gsc;", "  wrap_ymax = py_ + 60*gsc;"),
 ("F: a caption cut with an ellipsis", "say(lv == 0 ? cat_title(c) : cat_short(c)); ty += t4 + gsc;", "say(lv == 0 ? cat_title(c) : \"Exci…\"); ty += t4 + gsc;"),
 ("F: label words on its edge", "tx = x + 12*gsc; ty = y + 9*gsc + 0.5*(h - 14*gsc - bh);", "tx = x + 12*gsc; ty = y + 0.5*gsc;"),
 ("F: Poly's bar on its word", "ceil(wy_ + th) + floor(0.5*gsc)", "wy_ + th - 2*gsc"),
 ("F: Poly's word on its edge", "wy_ = floor(segy + 0.5) + max(1, floor(gsc + 0.5)) + 0.5*gsc;", "wy_ = segy + 0.5*gsc;"),
 # the drawing and the picker (24 October 2026, ADR 0024)
 ("W: drawing lines one pixel at any size", "t = (c == hl ? 2.4 : 1.4)*gsc;", "t = 1;"),
 ("W: picker cells 24 px tall", "chh = 92*gsc;", "chh = 24*gsc;"),
 ("W: picker cells 6 apart", "g = 12*gsc; ip = 16*gsc;", "g = 6*gsc; ip = 16*gsc;"),
 ("W: picker lets the window's controls through to Tab", "(ui_block && id < 70) ? 0 :", "0 ? 0 :"),
 ("W: picker lets a click through to the controls", "ui_block ? ( clicked = 0; wheel = 0; );", ""),
 ("W: picker arrow keys ignored", "key == 'rght' ? ( key = 0; i = min(n - 1, i + 1); )", "0 ? ( key = 0; i = min(n - 1, i + 1); )"),
 ("W: picker stays open after a click outside", "ui_block && pclick && !inside ? pop_c = -1;", ";"),
 ("W: picker cells edged in the window's grey", "on ? group_hex(c) : C_TRACK);", "on ? group_hex(c) : C_EDGE);"),
 ("W: picker darker than the window", "C_POP = 0x30323C;", "C_POP = 0x141518;"),
 ("W: the option in use without its bar", "on ? ( col(T_MAIN); gfx_rect(floor(cx", "0 ? ( col(T_MAIN); gfx_rect(floor(cx"),
 ("W: Return on a label does not open the picker", "activated(10 + c) ? pop_open(c, 1);", "0;"),
 ("W: Made of not reachable by keyboard", "(ui_block && hvc && pclick) || activated(80) ? mat_menu", "(ui_block && hvc && pclick) ? mat_menu"),
 ("W: Esc leaves the focus nowhere after the picker", "( focus_id = focus_id > 0 ? 10 + pop_c : 0; pop_c = -1; )", "( focus_id = 0; pop_c = -1; )"),
]
only = sys.argv[1:]
for name, old, new in cases:
    if only and not any(o in name for o in only): continue
    if src.count(old) != 1:
        print("DID NOT APPLY ", name, src.count(old)); continue
    d = os.path.join(S, "w"); shutil.rmtree(d, ignore_errors=True); os.makedirs(d)
    open(os.path.join(d, "Instrument-Creator.jsfx"), "w", encoding="utf-8").write(src.replace(old, new))
    r = subprocess.run(["python3", os.path.join(REPO, "tools", "hig_check.py"), os.path.join(d, "Instrument-Creator.jsfx")], capture_output=True, text=True)
    failed = [l[6:] for l in r.stdout.splitlines() if l.startswith("FAIL")]
    crashed = r.returncode and not failed
    print(("BIT    " if failed else "CRASH  " if crashed else "MISSED ") + name + ("  <- " + failed[0][:90] if failed else (r.stdout[-200:] + r.stderr[-300:] if crashed else "")))
shutil.rmtree(S, ignore_errors=True)

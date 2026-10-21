#!/usr/bin/env bash
# Build headless JSFX hosts so the instrument can be played, measured and
# screenshotted without REAPER. Uses ysfx, which embeds the same EEL2 JIT as
# REAPER (and LICE for graphics).
#
#   tools/build_host.sh          -> tools/build/render, tools/build/shot
set -euo pipefail
HERE="$(cd "$(dirname "$0")" && pwd)"
B="$HERE/build"
mkdir -p "$B"
if [ ! -d "$B/ysfx" ]; then
  git clone --depth 1 --recurse-submodules --shallow-submodules https://github.com/JoepVanlier/ysfx "$B/ysfx"
fi
# ysfx packs named keys ('left', 'rght', 'del', 'f1') little-endian, but EEL's
# multi-character constants - and REAPER's gfx_getchar - are big-endian, so
# key == 'left' never matched in the test hosts. Pack them as EEL does.
python3 - "$B/ysfx/sources/ysfx_api_gfx.cpp" <<'PY'
import sys
p = sys.argv[1]; s = open(p).read()
old = "return a | (b << 8) | (c << 16) | (d << 24);"
new = "uint32_t r = 0; for (uint8_t ch : {a, b, c, d}) if (ch) r = (r << 8) | ch; return r;"
if old in s:
    open(p, "w").write(s.replace(old, new))
PY
# ysfx reports Shift, Alt and Ctrl in mouse_cap only while a mouse button is
# down; REAPER reports them whenever the script calls gfx_getchar, which the
# window does every frame (Shift+Tab, Shift+arrow). Report them always.
python3 - "$B/ysfx/sources/ysfx.cpp" <<'PY'
import sys
p = sys.argv[1]; s = open(p).read()
old = "    if (mouse_cap) {  \n        if (mods & ysfx_mod_shift)"
new = "    {  // modifiers always, as REAPER does\n        if (mods & ysfx_mod_shift)"
if old in s:
    open(p, "w").write(s.replace(old, new))
PY
cmake -S "$B/ysfx" -B "$B/ysfx/build" -DCMAKE_BUILD_TYPE=Release -DYSFX_PLUGIN=OFF -DYSFX_GFX=ON > "$B/cmake.log"
cmake --build "$B/ysfx/build" -j"$(nproc 2>/dev/null || echo 2)" > "$B/build.log"
LIBS=$(find "$B/ysfx/build" -name "*.a" ! -name libysfx.a)
for t in render shot inspect click hig; do
  g++ -O2 -std=c++17 -I"$B/ysfx/include" "$HERE/$t.cpp" "$B/ysfx/build/libysfx.a" $LIBS $(pkg-config --libs freetype2 fontconfig 2>/dev/null || echo -lfreetype -lfontconfig) -lpthread -ldl -o "$B/$t"
done
echo "built: $B/render $B/shot $B/inspect $B/click $B/hig"

#!/usr/bin/env bash
# Builds the VST3 and CLAP plugins into plugin/out/. On a Mac they hold both
# Apple Silicon and Intel; elsewhere they are for the machine building them
# (which is how they are compile-checked on Linux).
#
#   plugin/build.sh
set -euo pipefail
HERE="$(cd "$(dirname "$0")" && pwd)"
YSFX_COMMIT=5c3452fee62583aa3d1b7e877d0c758c4024af89   # JoepVanlier/ysfx, 19 Aug 2026
D="$HERE/deps/ysfx"

if [ ! -f "$D/.fetched-$YSFX_COMMIT" ]; then
  rm -rf "$D"; mkdir -p "$D"
  git -C "$D" init -q
  git -C "$D" remote add origin https://github.com/JoepVanlier/ysfx
  git -C "$D" fetch -q --depth 1 origin "$YSFX_COMMIT"
  git -C "$D" checkout -q FETCH_HEAD
  git -C "$D" submodule update -q --init --recursive --depth 1
  # The two fixes tools/build_host.sh makes, so the plugin's keys behave as
  # REAPER's do: named keys packed big-endian ('left' == 'left' in EEL), and
  # Shift, Alt and Ctrl reported in mouse_cap whenever gfx_getchar is called.
  python3 - "$D/sources/ysfx_api_gfx.cpp" "$D/sources/ysfx.cpp" <<'PY'
import sys
gfx, core = sys.argv[1], sys.argv[2]
s = open(gfx).read()
old = "return a | (b << 8) | (c << 16) | (d << 24);"
new = "uint32_t r = 0; for (uint8_t ch : {a, b, c, d}) if (ch) r = (r << 8) | ch; return r;"
assert old in s, "ysfx key packing changed"
open(gfx, "w").write(s.replace(old, new))
s = open(core).read()
old = "    if (mouse_cap) {  \n        if (mods & ysfx_mod_shift)"
new = "    {  // modifiers always, as REAPER does\n        if (mods & ysfx_mod_shift)"
assert old in s, "ysfx modifier reporting changed"
open(core, "w").write(s.replace(old, new))
PY
  touch "$D/.fetched-$YSFX_COMMIT"
fi

J="$HERE/deps/JUCE"
if [ ! -f "$J/CMakeLists.txt" ]; then
  git clone -q --depth 1 --branch 8.0.6 https://github.com/juce-framework/JUCE "$J"
fi

cmake -S "$HERE" -B "$HERE/build" -DCMAKE_BUILD_TYPE=Release ${CMAKE_ARGS:-}
cmake --build "$HERE/build" --config Release -j"$(sysctl -n hw.ncpu 2>/dev/null || nproc)" \
  --target JsfxPlugin_VST3 JsfxPlugin_CLAP ${EXTRA_TARGETS:-}
rm -rf "$HERE/out"; mkdir -p "$HERE/out"
find "$HERE/build" -path '*_artefacts*' \( -name '*.vst3' -o -name '*.clap' \) -prune \
  -exec cp -R {} "$HERE/out/" \;
ls "$HERE/out"

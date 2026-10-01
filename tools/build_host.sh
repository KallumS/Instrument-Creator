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
cmake -S "$B/ysfx" -B "$B/ysfx/build" -DCMAKE_BUILD_TYPE=Release -DYSFX_PLUGIN=OFF -DYSFX_GFX=ON > "$B/cmake.log"
cmake --build "$B/ysfx/build" -j"$(nproc 2>/dev/null || echo 2)" > "$B/build.log"
LIBS=$(find "$B/ysfx/build" -name "*.a" ! -name libysfx.a)
for t in render shot inspect click; do
  g++ -O2 -std=c++17 -I"$B/ysfx/include" "$HERE/$t.cpp" "$B/ysfx/build/libysfx.a" $LIBS $(pkg-config --libs freetype2 fontconfig 2>/dev/null || echo -lfreetype -lfontconfig) -lpthread -ldl -o "$B/$t"
done
echo "built: $B/render $B/shot $B/inspect $B/click"

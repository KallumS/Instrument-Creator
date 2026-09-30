"""Add a trims.py result to the trims already in the plugin (iterative passes)."""
import re, sys
path = sys.argv[2] if len(sys.argv) > 2 else "Instrument-Creator.jsfx"
new = open(sys.argv[1]).read()
src = open(path).read()
block = re.search(r"//TRIMS_BEGIN\n(.*?)//TRIMS_END", src, re.S).group(1)
cur = {}
for m in re.finditer(r"trim_row\((\d), (\d), ([^)]*)\);", block):
    cur[(int(m.group(1)), int(m.group(2)))] = [float(x) for x in m.group(3).split(",")]
pt = re.search(r"PART_TRIM_VALUES = \[([^\]]*)\]", block)
parts = [float(x) for x in pt.group(1).split(",")] if pt else [0.0] * 13
out = []
for m in re.finditer(r"trim_row\((\d), (\d), ([^)]*)\);", new):
    k = (int(m.group(1)), int(m.group(2)))
    vals = [float(x) for x in m.group(3).split(",")]
    old = cur.get(k, [0.0] * 6)
    tot = [max(-20.0, min(20.0, a + b)) for a, b in zip(old, vals)]
    out.append(f"trim_row({k[0]}, {k[1]}, " + ", ".join(f"{x:.1f}" for x in tot) + ");")
m = re.search(r"resonator, coupler, radiator: (.*)", new)
nums = [float(x) for x in m.group(1).replace("|", " ").split()]
parts = [max(-12.0, min(12.0, a + b)) for a, b in zip(parts, nums)]
out.append("// PART_TRIM_VALUES = [" + ", ".join(f"{x:.1f}" for x in parts) + "]")
out.append("i = 0; loop(13, PART_TRIM[i] = 0; i += 1;);")
for i, x in enumerate(parts):
    out.append(f"PART_TRIM[{i}] = {x:.1f};")
src = re.sub(r"//TRIMS_BEGIN\n.*?//TRIMS_END", lambda _m: "//TRIMS_BEGIN\n" + "\n".join(out) + "\n//TRIMS_END", src, count=1, flags=re.S)
open(path, "w").write(src)
print("\n".join(out))

#!/bin/bash
set -euo pipefail

find src/pages/games -name "*.astro" -type f | while read -r file; do
  if ! grep -q "window.RufflePlayer" "$file"; then continue; fi
  if grep -q "data-astro-rerun" "$file"; then
    echo "Already fixed: $file"
    continue
  fi

  echo "Fixing: $file"

  python3 << PYEOF
import re

with open("$file") as f:
    content = f.read()

m = re.search(r'player\.load\("/flash/[^"]+\.swf"\)', content)
if not m:
    print("  ERROR: could not find SWF path")
    exit(1)
swf_path = m.group(0).split('"')[1]

old = re.compile(
    r'<script>\s*\n'
    r'\s*window\.RufflePlayer = window\.RufflePlayer \|\| \{\};\s*\n'
    r'\s*window\.addEventListener\("load",\s*\(event\)\s*=>\s*\{[\s\S]*?\}\);\s*\n'
    r'\s*</script>'
)

new = (
    '<script data-astro-rerun is:inline>\n'
    '        window.RufflePlayer = window.RufflePlayer || {};\n'
    '        (function() {\n'
    '          var container = document.getElementById("container");\n'
    '          if (!container) return;\n'
    '          var ruffle = window.RufflePlayer.newest();\n'
    '          if (!ruffle) return;\n'
    "          container.innerHTML = '';\n"
    '          var player = ruffle.createPlayer();\n'
    '          container.appendChild(player);\n'
    '          player.style.height = "96vh";\n'
    '          player.style.width = "98vw";\n'
    f'          player.load("{swf_path}");\n'
    '        })();\n'
    '      </script>'
)

content = old.sub(new, content)
with open("$file", 'w') as f:
    f.write(content)
print("  Fixed: $file")
PYEOF
done

echo "Done!"

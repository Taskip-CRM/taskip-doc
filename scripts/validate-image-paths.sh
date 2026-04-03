#!/bin/bash
# Auto-fixes bare image filenames in .mdoc files to use relative paths
# e.g. ![](image-89.png) → ![](./folder-name/content/image-89.png)

fixed=0

while IFS= read -r file; do
  folder=$(basename "${file%.mdoc}")

  if grep -qE '!\[[^]]*\]\([^./][^:)]*\.(png|jpg|jpeg|gif|svg|webp)\)' "$file" 2>/dev/null; then
    perl -pi -e "s#!\\[([^\\]]*)\\]\\(([^./][^:)]*\\.(?:png|jpg|jpeg|gif|svg|webp))\\)#![\1](./${folder}/content/\2)#g" "$file"
    echo "FIXED: $file → images now use ./${folder}/content/..."
    fixed=$((fixed + 1))
  fi
done < <(find src/content/docs -name "*.mdoc" -type f)

if [ $fixed -gt 0 ]; then
  echo ""
  echo "Auto-fixed image paths in $fixed file(s)."
else
  echo "All image paths are valid. Nothing to fix."
fi

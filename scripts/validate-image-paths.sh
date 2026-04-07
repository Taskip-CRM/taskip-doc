#!/bin/bash
# Auto-fixes image issues in .mdoc files:
# 1. Renames image files with spaces/parentheses (e.g. "image-4 (1).png" → "image-4-1.png")
# 2. Fixes bare image filenames to use relative paths
#    e.g. ![](image-89.png) → ![](./folder-name/content/image-89.png)

renamed=0
fixed=0

# Step 1: Rename image files that have spaces or parentheses
while IFS= read -r imgfile; do
  dir=$(dirname "$imgfile")
  base=$(basename "$imgfile")
  # Replace spaces with hyphens, remove parentheses
  newbase=$(echo "$base" | sed 's/ /-/g; s/(//g; s/)//g; s/--/-/g')
  if [ "$base" != "$newbase" ]; then
    mv "$imgfile" "$dir/$newbase"
    echo "RENAMED: $base → $newbase"
    # Update references in all .mdoc files
    find src/content/docs -name "*.mdoc" -type f -exec perl -pi -e "
      BEGIN { \$old = '$base'; \$new = '$newbase'; }
      my \$pattern = quotemeta(\$old);
      \$pattern =~ s/\\\\ /(?:%20|\\\\s)/g;
      \$pattern =~ s/\\\\\\(/(\\\\\\\\)?\\(/g;
      \$pattern =~ s/\\\\\\)/(\\\\\\\\)?\\)/g;
      s/\$pattern/\$new/g;
    " {} \;
    renamed=$((renamed + 1))
  fi
done < <(find src/content/docs -type f \( -name "* *" -o -name "*(*" -o -name "*)*" \) \( -name "*.png" -o -name "*.jpg" -o -name "*.jpeg" -o -name "*.gif" -o -name "*.svg" -o -name "*.webp" \))

# Step 2: Fix bare image filenames to use relative paths
while IFS= read -r file; do
  folder=$(basename "${file%.mdoc}")

  if grep -qE '!\[[^]]*\]\([^./][^:)]*\.(png|jpg|jpeg|gif|svg|webp)\)' "$file" 2>/dev/null; then
    perl -pi -e "s#!\\[([^\\]]*)\\]\\(([^./][^:)]*\\.(?:png|jpg|jpeg|gif|svg|webp))\\)#![\1](./${folder}/content/\2)#g" "$file"
    echo "FIXED: $file → images now use ./${folder}/content/..."
    fixed=$((fixed + 1))
  fi
done < <(find src/content/docs -name "*.mdoc" -type f)

echo ""
if [ $renamed -gt 0 ]; then
  echo "Renamed $renamed image file(s) with spaces/parentheses."
fi
if [ $fixed -gt 0 ]; then
  echo "Auto-fixed image paths in $fixed file(s)."
fi
if [ $renamed -eq 0 ] && [ $fixed -eq 0 ]; then
  echo "All image paths are valid. Nothing to fix."
fi

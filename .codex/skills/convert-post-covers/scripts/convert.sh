#!/usr/bin/env bash

set -euo pipefail

find . -mindepth 1 -type d -print0 | while IFS= read -r -d '' dir; do
  pushd "$dir" > /dev/null

  echo "处理目录: $dir"

  find . -maxdepth 1 -type f \( -iname "cover.jpg" -o -iname "cover.jpeg" -o -iname "cover.png" \) -print0 | while IFS= read -r -d '' cover; do
    size="$(stat -c %s "$cover")"

    if [[ "$size" -lt 10240 ]]; then
      echo "跳过小文件: $dir/$cover"
      continue
    fi

    cwebp -q 80 "$cover" -o "cover.webp"
    echo "已转换: $dir/$cover -> $dir/cover.webp"
  done

  find . -maxdepth 1 -type f -name "*.md" -exec sed -i 's/cover\.\(jpg\|jpeg\|png\|JPG\|JPEG\|PNG\)/cover.webp/g' {} +

  echo "更新: $dir 中的所有封面引用为 cover.webp"

  popd > /dev/null
done

echo "所有文章目录处理完成！"

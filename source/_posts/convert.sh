#!/bin/bash

# 1. 遍历所有文章文件夹
find . -mindepth 1 -type d -print0 | while IFS= read -r -d $'\0' dir; do
    # 进入每个文章目录
    pushd "$dir" > /dev/null
    
    echo "处理目录: $dir"
    
    # 2. 查找当前目录中的封面图片
    find . -maxdepth 1 -type f \( -iname "cover.jpg" -o -iname "cover.jpeg" -o -iname "cover.png" \) | while read -r cover; do
        # 检查文件大小
        size=$(stat -c %s "$cover")
        
        # 跳过小于10KB的封面图片
        if [ "$size" -lt 10240 ]; then
            echo "跳过小文件: $dir/$cover"
            continue
        fi
        
        # 转换为WebP（保留原始文件名，只改后缀）
        cwebp -q 80 "$cover" -o "cover.webp" && echo "已转换: $dir/$cover → $dir/cover.webp"
    done
    
    # 3. 更新当前目录中的Markdown文件（简化全局替换逻辑）
    find . -maxdepth 1 -type f -name "*.md" -exec sed -i 's/cover\.\(jpg\|jpeg\|png\|JPG\|JPEG\|PNG\)/cover.webp/g' {} +
    
    echo "更新: $dir 中的所有封面引用为 cover.webp"
    
    # 返回上级目录
    popd > /dev/null
done

echo "所有文章目录处理完成！"
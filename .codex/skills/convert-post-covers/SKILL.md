---
name: convert-post-covers
description: 用于批量把博客文章目录里的 cover.jpg/jpeg/png 转成 cover.webp，并同步修正 markdown 中的封面引用；当用户提到 convert.sh、批量转 webp、旧封面整理、或替换文章封面路径时应使用这个 skill。
---

# Convert Post Covers

用于批量整理旧文章的封面资源。

## 作用

- 扫描文章目录
- 把 `cover.jpg`、`cover.jpeg`、`cover.png` 转成 `cover.webp`
- 跳过明显过小的封面文件
- 把同目录 Markdown 里的封面引用统一替换成 `cover.webp`

## 脚本

- 脚本位置：`.codex/skills/convert-post-covers/scripts/convert.sh`
- 依赖：
  - `cwebp`
  - `find`
  - `sed`

## 用法

如果你在 `source/_posts` 下批量处理文章封面：

```bash
cd source/_posts
../../.codex/skills/convert-post-covers/scripts/convert.sh
```

## 注意

- 脚本只处理每个文章目录中名为 `cover.jpg/jpeg/png` 的文件
- 小于 10KB 的文件会跳过
- 脚本会原地修改 Markdown 封面引用

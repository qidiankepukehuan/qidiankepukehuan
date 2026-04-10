# Add Guide Article

用于往博客里新增或更新“幻协生存指南”系列文章。

## 目标

- 把外部 Markdown 或 docx 内容整理成博客可用的文章
- 统一 front matter、分类、标签和封面资源
- 用同一套脚本生成封面

## 约定

- 分类使用 `幻协生存指南`
- 标签至少包含 `幻协生存指南` 和 `社团资料`
- 封面文件固定为文章资源目录下的 `cover.webp`
- 文章资源目录与文章文件同名，例如：
  - `source/_posts/如何出摊.md`
  - `source/_posts/如何出摊/cover.webp`

## 新增文章流程

1. 在 `source/_posts/` 新建文章 Markdown，并补齐 front matter：

```yaml
---
title: 如何做某件事
author: Mudern
date: 2026-04-10 00:00:00
categories:
  - 幻协生存指南
tags:
  - 幻协生存指南
  - 社团资料
cover: cover.webp
---
```

2. 清理正文：

- 删除正文开头单独成段的作者/学校说明
- 把不符合博客规范的 Markdown 标题、脚注、图片路径改成站点现有格式
- 如果引用本地图片，优先放到文章同名资源目录中

3. 生成封面：

```bash
./tools/generate-guide-cover.sh \
  --title "如何做某件事" \
  --author "Mudern" \
  --output "source/_posts/如何做某件事/cover.webp"
```

- 如果标题过长，直接调小字号：

```bash
./tools/generate-guide-cover.sh \
  --title "幻协生存指南第一版前言" \
  --title-pointsize 78 \
  --author "十口" \
  --output "source/_posts/幻协生存指南第一版前言/cover.webp"
```

4. 本地构建验证：

```bash
npm run clean
npm run build
```

## 更新已有文章

- 如果只是正文更新，优先保留原文件名和资源目录结构
- 如果文章标题变了，文件名和资源目录也要一起改，避免 `cover.webp` 失联
- 如果系列名变更，需同时检查：
  - front matter 里的 `categories`
  - front matter 里的 `tags`
  - 正文内提到的系列名
  - 封面左上角标签

## 封面脚本

- 脚本位置：`tools/generate-guide-cover.sh`
- 默认输出 1600x900 的 `webp`
- 默认系列标签为 `幻协生存指南`
- 长标题可通过 `--title-pointsize` 控制字号
- 默认字体依赖系统字体：
  - `Source-Han-Sans-SC-Bold`
  - `Source-Han-Sans-SC-Medium`
  - `Source-Han-Sans-SC`
- 如需替换字体，可通过环境变量覆盖：

```bash
TITLE_FONT="Noto-Sans-CJK-SC-Bold" \
LABEL_FONT="Noto-Sans-CJK-SC-Medium" \
AUTHOR_FONT="Noto-Sans-CJK-SC-Regular" \
./tools/generate-guide-cover.sh --title "如何做某件事" --output "source/_posts/如何做某件事/cover.webp"
```

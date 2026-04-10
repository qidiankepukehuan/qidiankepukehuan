---
name: add-guide-article
description: 用于在这个博客仓库里新增或更新“幻协生存指南”文章；适用于整理外部 Markdown 或 docx、统一文章 front matter、生成系列封面，并使用 pnpm 做构建验证。
---

# Add Guide Article

用于往这个博客里新增或更新“幻协生存指南”系列文章。

## 约定

- 分类使用 `幻协生存指南`
- 指南类文章标签一般至少包含 `社团资料`
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
./.codex/skills/add-guide-article/scripts/generate-guide-cover.sh \
  --title "如何做某件事" \
  --author "Mudern" \
  --output "source/_posts/如何做某件事/cover.webp"
```

- 标题过长时，直接调小字号：

```bash
./.codex/skills/add-guide-article/scripts/generate-guide-cover.sh \
  --title "幻协生存指南第一版前言" \
  --title-pointsize 78 \
  --author "十口" \
  --output "source/_posts/幻协生存指南第一版前言/cover.webp"
```

- 如果想固定某个配色，可显式传：

```bash
./.codex/skills/add-guide-article/scripts/generate-guide-cover.sh \
  --title "如何做外联" \
  --palette teal \
  --author "硫酸铜" \
  --output "source/_posts/如何做外联/cover.webp"
```

4. 本地构建验证：

```bash
pnpm run clean
pnpm run build
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

- 脚本位置：`.codex/skills/add-guide-article/scripts/generate-guide-cover.sh`
- 默认输出 1600x900 的 `webp`
- 默认系列标签为 `幻协生存指南`
- 默认会根据标题自动挑选配色，也可用 `--palette` 手动指定
- 长标题可通过 `--title-pointsize` 控制字号
- 作者名会固定在左下角偏上一点的位置，避免太贴边
- 默认字体依赖 ImageMagick 可识别的字体名：
  - `Source-Han-Sans-SC-Bold`
  - `Source-Han-Sans-SC-Medium`
  - `Source-Han-Sans-SC`

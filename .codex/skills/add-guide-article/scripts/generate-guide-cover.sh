#!/usr/bin/env bash

set -euo pipefail

usage() {
  cat <<'EOF'
Usage:
  ./.codex/skills/add-guide-article/scripts/generate-guide-cover.sh --title "如何做会刊？" --author "Mudern" --output "source/_posts/如何做会刊？/cover.webp"

Options:
  --title    Required. Article title shown on the cover.
  --title-pointsize Optional. Title font size. Default: 118
  --author   Optional. Author shown at bottom left. Default: Mudern
  --output   Required. Output file path.
  --label    Optional. Series label at top left. Default: 幻协生存指南
  --palette  Optional. Palette name. Default: auto
EOF
}

TITLE=""
TITLE_POINTSIZE="118"
AUTHOR="Mudern"
OUTPUT=""
LABEL="幻协生存指南"
PALETTE="auto"

while [[ $# -gt 0 ]]; do
  case "$1" in
    --title)
      TITLE="${2:-}"
      shift 2
      ;;
    --title-pointsize)
      TITLE_POINTSIZE="${2:-}"
      shift 2
      ;;
    --author)
      AUTHOR="${2:-}"
      shift 2
      ;;
    --output)
      OUTPUT="${2:-}"
      shift 2
      ;;
    --label)
      LABEL="${2:-}"
      shift 2
      ;;
    --palette)
      PALETTE="${2:-}"
      shift 2
      ;;
    -h|--help)
      usage
      exit 0
      ;;
    *)
      echo "Unknown argument: $1" >&2
      usage >&2
      exit 1
      ;;
  esac
done

if [[ -z "$TITLE" || -z "$OUTPUT" ]]; then
  usage >&2
  exit 1
fi

mkdir -p "$(dirname "$OUTPUT")"

TITLE_FONT="${TITLE_FONT:-Source-Han-Sans-SC-Bold}"
LABEL_FONT="${LABEL_FONT:-Source-Han-Sans-SC-Medium}"
AUTHOR_FONT="${AUTHOR_FONT:-Source-Han-Sans-SC}"

pick_palette() {
  local palette_name="$1"
  local key="$2"
  local palettes=(
    "amber|#2c2416|#a6852d|rgba(255,248,223,0.08)|rgba(255,248,223,0.05)|#f5e8c6|#f6e7c0|#d9dde6"
    "teal|#0d2b33|#1e7c78|rgba(223,255,248,0.08)|rgba(223,255,248,0.05)|#d6f0ea|#d9fff8|#d4e8e7"
    "crimson|#351320|#a9435f|rgba(255,232,240,0.08)|rgba(255,232,240,0.05)|#f5d7e2|#ffe1ea|#ead7df"
    "cobalt|#14233d|#3f6fb8|rgba(232,241,255,0.08)|rgba(232,241,255,0.05)|#d7e3f5|#e1ebff|#d6ddeb"
    "forest|#162818|#4f8750|rgba(236,255,232,0.08)|rgba(236,255,232,0.05)|#d8ecd1|#e7f6de|#dce6d7"
    "plum|#2a1833|#8450a6|rgba(245,234,255,0.08)|rgba(245,234,255,0.05)|#eadcf5|#f0e4ff|#e1d8ea"
  )
  local selected=""

  if [[ "$palette_name" != "auto" ]]; then
    for candidate in "${palettes[@]}"; do
      if [[ "${candidate%%|*}" == "$palette_name" ]]; then
        selected="$candidate"
        break
      fi
    done
    if [[ -z "$selected" ]]; then
      echo "Unknown palette: $palette_name" >&2
      exit 1
    fi
  else
    local checksum index
    checksum="$(printf '%s' "$key" | cksum | awk '{print $1}')"
    index=$(( checksum % ${#palettes[@]} ))
    selected="${palettes[$index]}"
  fi

  IFS='|' read -r _ BG_START BG_END BUBBLE_1 BUBBLE_2 BORDER_COLOR LABEL_COLOR AUTHOR_COLOR <<< "$selected"
}

pick_palette "$PALETTE" "$TITLE"

magick \
  -size 1600x900 \
  gradient:"$BG_START-$BG_END" \
  \( -size 580x580 xc:none -fill "$BUBBLE_1" -draw 'circle 290,290 290,0' \) -gravity northeast -geometry +40-70 -composite \
  \( -size 520x520 xc:none -fill "$BUBBLE_2" -draw 'circle 260,260 260,0' \) -gravity southeast -geometry +120+40 -composite \
  \( -size 1440x740 xc:none -stroke "$BORDER_COLOR" -strokewidth 4 -fill none -draw "roundrectangle 2,2 1438,738 36,36" \) -gravity center -composite \
  -font "$LABEL_FONT" -fill "$LABEL_COLOR" -pointsize 64 -gravity northwest -annotate +100+110 "$LABEL" \
  -font "$TITLE_FONT" -fill white -pointsize "$TITLE_POINTSIZE" -gravity northwest -annotate +100+250 "$TITLE" \
  -font "$AUTHOR_FONT" -fill "$AUTHOR_COLOR" -pointsize 62 -gravity southwest -annotate +100+120 "$AUTHOR" \
  "$OUTPUT"

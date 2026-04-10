#!/usr/bin/env bash

set -euo pipefail

usage() {
  cat <<'EOF'
Usage:
  ./tools/generate-guide-cover.sh --title "如何做会刊？" --author "Mudern" --output "source/_posts/如何做会刊？/cover.webp"

Options:
  --title    Required. Article title shown on the cover.
  --title-pointsize Optional. Title font size. Default: 118
  --author   Optional. Author shown at bottom left. Default: Mudern
  --output   Required. Output file path.
  --label    Optional. Series label at top left. Default: 幻协生存指南
EOF
}

TITLE=""
TITLE_POINTSIZE="118"
AUTHOR="Mudern"
OUTPUT=""
LABEL="幻协生存指南"

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

magick \
  -size 1600x900 \
  gradient:'#2c2416-#a6852d' \
  \( -size 580x580 xc:none -fill 'rgba(255,248,223,0.08)' -draw 'circle 290,290 290,0' \) -gravity northeast -geometry +40-70 -composite \
  \( -size 520x520 xc:none -fill 'rgba(255,248,223,0.05)' -draw 'circle 260,260 260,0' \) -gravity southeast -geometry +120+40 -composite \
  \( -size 1440x740 xc:none -stroke '#f5e8c6' -strokewidth 4 -fill none -draw "roundrectangle 2,2 1438,738 36,36" \) -gravity center -composite \
  -font "$LABEL_FONT" -fill '#f6e7c0' -pointsize 64 -gravity northwest -annotate +100+110 "$LABEL" \
  -font "$TITLE_FONT" -fill white -pointsize "$TITLE_POINTSIZE" -gravity northwest -annotate +100+250 "$TITLE" \
  -font "$AUTHOR_FONT" -fill '#d9dde6' -pointsize 62 -gravity southwest -annotate +100+70 "$AUTHOR" \
  "$OUTPUT"

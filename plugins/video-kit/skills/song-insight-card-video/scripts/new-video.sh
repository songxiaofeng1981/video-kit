#!/bin/zsh
# 用模板新建一个视频项目：new-video.sh <目标目录>
set -euo pipefail
SKILL_DIR="${0:A:h:h}"
TARGET="${1:?用法: new-video.sh <目标目录>}"
if [[ -e "$TARGET" ]]; then echo "目标已存在: $TARGET" >&2; exit 1; fi
mkdir -p "$TARGET"
rsync -a --exclude node_modules --exclude 'public/*' --exclude out "$SKILL_DIR/template/" "$TARGET/"
mkdir -p "$TARGET/public"
HOME_DIR="${VIDEO_KIT_HOME:-$HOME/.local/share/video-kit}"
[[ -d "$HOME_DIR/node_modules/remotion" ]] || { echo "还没装依赖，先运行：$SKILL_DIR/../glass-talking-video/template/scripts/setup.sh" >&2; exit 1; }
ln -s "$HOME_DIR/node_modules" "$TARGET/node_modules"
echo "已创建: $TARGET"
echo "下一步：改 $TARGET/src/content.ts；BGM 用 prepare-bgm.sh；预览 npm run start -- --port=3000 --no-open"

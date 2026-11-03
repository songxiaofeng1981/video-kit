#!/bin/zsh
# 从模板复制出一个新视频项目（不带示例视频）。依赖用 setup.sh 装好的共享文件夹。
# 用法：scripts/new-video.sh /路径/新项目文件夹
set -euo pipefail
dest=${1:?用法：scripts/new-video.sh 新项目文件夹}
tpl=${0:A:h:h}
home=${VIDEO_KIT_HOME:-$HOME/.local/share/video-kit}
[[ -e $dest ]] && { echo "已存在：$dest"; exit 1; }
[[ -d $home/node_modules/remotion ]] || { echo "还没装依赖，先运行：$tpl/scripts/setup.sh"; exit 1; }
mkdir -p "$dest/public"
cp -R "$tpl/src" "$tpl/scripts" "$tpl/package.json" "$dest/"
cp "$tpl/../TEMPLATE.md" "$dest/"
cp "$tpl/PROJECT_AGENTS.md" "$dest/AGENTS.md"
echo '@AGENTS.md' > "$dest/CLAUDE.md"
echo '@./AGENTS.md' > "$dest/GEMINI.md"
ln -s "$home/node_modules" "$dest/node_modules"
echo "已创建：$dest"
echo "下一步：scripts/prepare-video.sh 你的视频 → scripts/make-subtitles.sh → 改 src/content.ts → npm run studio"

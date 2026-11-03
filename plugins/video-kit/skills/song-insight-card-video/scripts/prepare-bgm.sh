#!/bin/zsh
# BGM 统一响度：prepare-bgm.sh <音乐文件> <项目目录> [目标LUFS，默认 -16]
# 输出 <项目目录>/public/bgm.mp3，原文件不动
set -euo pipefail
SRC="${1:?用法: prepare-bgm.sh <音乐文件> <项目目录> [LUFS]}"
PROJECT="${2:?缺少项目目录}"
TARGET_LUFS="${3:--16}"
mkdir -p "$PROJECT/public"
# 只量前 60 秒：视频只会用到开头一段
measure() { ffmpeg -hide_banner -nostats -t 60 -i "$1" -af ebur128 -f null - 2>&1 | awk '/Integrated loudness/{f=1} f&&/I:/{print $2; exit}'; }
CURRENT=$(measure "$SRC")
GAIN=$(awk -v t="$TARGET_LUFS" -v c="$CURRENT" 'BEGIN{printf "%.1f", t-c}')
encode() { ffmpeg -hide_banner -loglevel error -y -i "$SRC" -af "volume=${1}dB,alimiter=limit=0.89" -c:a libmp3lame -b:a 320k "$PROJECT/public/bgm.mp3"; }
encode "$GAIN"
# 第二遍：按实测偏差修正一次（限幅和编码会让结果偏差约 1 dB）
AFTER=$(measure "$PROJECT/public/bgm.mp3")
GAIN=$(awk -v g="$GAIN" -v t="$TARGET_LUFS" -v a="$AFTER" 'BEGIN{printf "%.1f", g+t-a}')
encode "$GAIN"
echo "原始响度 ${CURRENT} LUFS → 增益 ${GAIN} dB"
ffmpeg -hide_banner -nostats -t 60 -i "$PROJECT/public/bgm.mp3" -af ebur128=peak=true -f null - 2>&1 | grep -E '^\s+(I|Peak):'

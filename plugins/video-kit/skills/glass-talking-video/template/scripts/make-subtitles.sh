#!/bin/zsh
# 从录好的视频生成逐句字幕：public/subtitles.srt
# 用法：scripts/make-subtitles.sh [--download] 视频 [文稿.txt]
#   有文稿：字幕文字用文稿原文，时间按视频里实际说话对齐（推荐）
#   没文稿：自动转写，文字可能有错字，需要校对
#   --download：本机还没有字幕模型时，允许从 Hugging Face 下载（只第一次需要）
set -euo pipefail
# 默认 ffmpeg 不能运行时（Homebrew 升级后常见），改用 Homebrew 当前版本
ffmpeg -version >/dev/null 2>&1 || export PATH="/opt/homebrew/bin:/usr/local/bin:$PATH"
[[ ${1:-} == --download ]] && { export VIDEO_KIT_DOWNLOAD=1; shift; }
video=${1:?用法：scripts/make-subtitles.sh [--download] 视频 [文稿.txt]}
dir=${0:A:h:h}
source $dir/scripts/find-whisperx.sh
[[ -n $(ffprobe -v error -select_streams a -show_entries stream=index -of csv=p=0 "$video") ]] || { echo "视频里没有声音，没法对齐字幕：$video"; exit 1; }
[[ -n $whisperx_py ]] || { echo "没有字幕工具 WhisperX：uv tool install whisperx；或者自己准备 public/subtitles.srt"; exit 1; }
"$whisperx_py" -I "$dir/scripts/make_subtitles.py" "${video:A}" "$dir/public/subtitles.srt" ${2:+"${2:A}"} 2> >(grep -vE "Warning|warn|Lightning|upgrade" >&2)

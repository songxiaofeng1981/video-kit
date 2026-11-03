#!/bin/zsh
# 把手机视频转成模板用的 mp4，放进 public/。
# 用法：scripts/prepare-video.sh /路径/IMG_1234.MOV [输出名]
# 输出：public/<输出名>.mp4（H.264、30fps、每秒一个关键帧、保留原声；HDR 自动转 SDR）
set -euo pipefail
# 默认 ffmpeg 不能运行时（Homebrew 升级后常见），改用 Homebrew 当前版本
ffmpeg -version >/dev/null 2>&1 || export PATH="/opt/homebrew/bin:/usr/local/bin:$PATH"
command -v ffmpeg >/dev/null || { echo "缺少 ffmpeg：brew install ffmpeg"; exit 1; }
in=${1:?用法：scripts/prepare-video.sh 输入视频 [输出名]}
name=${2:-${${in:t}:r}}
dir=${0:A:h:h}
out="$dir/public/$name.mp4"
trc=$(ffprobe -v error -select_streams v:0 -show_entries stream=color_transfer -of csv=p=0 "$in")
vf="fps=30,format=yuv420p"
if [[ $trc == arib-std-b67 || $trc == smpte2084 ]]; then
  vf="zscale=t=linear:npl=100,format=gbrpf32le,zscale=p=bt709,tonemap=hable:desat=0,zscale=t=bt709:m=bt709:r=tv,fps=30,format=yuv420p"
fi
ffmpeg -v error -stats -y -i "$in" -vf "$vf" -c:v libx264 -preset medium -crf 18 -g 30 -c:a aac -b:a 160k -movflags +faststart "$out"
echo "已生成：$out"
echo "在 src/content.ts 里填：video: '$name.mp4'"

#!/bin/zsh
# 第一次使用前运行一次：把 Remotion 依赖装到共享文件夹，所有视频项目共用这一份；再检查 ffmpeg 和字幕工具。
# 用法：scripts/setup.sh
# 共享文件夹默认是 ~/.local/share/video-kit，可以用环境变量 VIDEO_KIT_HOME 改。
set -euo pipefail
tpl=${0:A:h:h}
home=${VIDEO_KIT_HOME:-$HOME/.local/share/video-kit}

command -v node >/dev/null || { echo "缺少 Node.js（需要 18 以上）：https://nodejs.org 或 brew install node"; exit 1; }
mkdir -p $home
cp $tpl/package.json $home/package.json
if [[ -d $home/node_modules/remotion ]] && cmp -s $tpl/package.json $home/.installed-package.json; then
	echo "✓ Remotion 依赖已安装：$home/node_modules"
else
	echo "安装 Remotion 依赖到 $home（只需一次，约几分钟）…"
	(cd $home && npm install --no-audit --no-fund --loglevel=error)
	cp $tpl/package.json $home/.installed-package.json
	echo "✓ Remotion 依赖已安装"
fi

ff=$(command -v ffmpeg || true)
[[ -n $ff ]] && ! $ff -version >/dev/null 2>&1 && ff=""
[[ -z $ff && -x /opt/homebrew/bin/ffmpeg ]] && ff=/opt/homebrew/bin/ffmpeg
if [[ -n $ff ]]; then echo "✓ ffmpeg：$ff"; else echo "✗ 缺少 ffmpeg（转视频要用）：brew install ffmpeg"; fi

source $tpl/scripts/find-whisperx.sh
if [[ -n $whisperx_py ]]; then
	echo "✓ 字幕工具 WhisperX：$whisperx_py"
else
	echo "○ 没有字幕工具 WhisperX（可选）。不装也能用：自己准备 public/subtitles.srt。"
	echo "  需要自动对齐字幕时安装：uv tool install whisperx（首次出字幕加 --download 下载模型）"
fi

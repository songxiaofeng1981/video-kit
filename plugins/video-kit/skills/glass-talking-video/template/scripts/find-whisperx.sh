# 找 WhisperX 所在的 Python，结果放在 $whisperx_py（找不到为空）。由其他脚本 source。
# 顺序：环境变量 WHISPERX_PYTHON → uv 安装的位置 → PATH 里 whisperx 命令用的 Python
whisperx_py=${WHISPERX_PYTHON:-}
[[ -z $whisperx_py && -x $HOME/.local/share/uv/tools/whisperx/bin/python ]] && whisperx_py=$HOME/.local/share/uv/tools/whisperx/bin/python
if [[ -z $whisperx_py ]] && command -v whisperx >/dev/null; then
	shebang=$(head -1 "$(command -v whisperx)")
	[[ $shebang == '#!'*python* ]] && whisperx_py=${shebang#\#!}
fi

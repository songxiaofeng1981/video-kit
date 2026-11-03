"""从录好的视频生成逐句字幕 SRT，时间以视频里实际说话为准。

用法（由 scripts/make-subtitles.sh 调用）：
  make_subtitles.py 视频 输出.srt [文稿.txt]
有文稿：文字用文稿原文，只用语音对齐时间（推荐，错字最少）。
没文稿：先用 Whisper 转写，再对齐时间；文字可能有错字，需要再校对。
模型默认只用本机共享缓存，不会下载；环境变量 VIDEO_KIT_DOWNLOAD=1 时允许下载（make-subtitles.sh --download）。
"""
import math
import os
import re
import sys
import warnings

warnings.filterwarnings("ignore")
os.environ.setdefault("HF_HOME", os.path.expanduser("~/.cache/huggingface"))
os.environ.setdefault("TORCH_HOME", os.path.expanduser("~/.cache/torch"))
DOWNLOAD = os.environ.get("VIDEO_KIT_DOWNLOAD") == "1"
if not DOWNLOAD:
    os.environ.setdefault("HF_HUB_OFFLINE", "1")

import whisperx  # noqa: E402

MAX_LEN = 14  # 一行字幕最多约 14 个汉字（英文和数字按半个算）
HARD = set("。！？；!?;\n")
SOFT = set("，、,：:")
TRIM = "，。、；：,.;: "


def width(s):
    return sum(0.5 if ord(c) < 128 else 1 for c in s)


def glued(a, b):
    """a、b 之间不能断行：英文单词、小数（5.5）、带万亿的数字（19万2400）"""
    word = lambda ch: ch.isascii() and (ch.isalnum() or ch == ".")
    num = lambda x, y: x.isdigit() and y in "万亿千百%"
    return (word(a) and word(b)) or num(a, b) or num(b, a)


def srt_time(t):
    ms = int(round(t * 1000))
    return f"{ms // 3600000:02}:{ms // 60000 % 60:02}:{ms // 1000 % 60:02},{ms % 1000:03}"


def main():
    video, out = sys.argv[1], sys.argv[2]
    script = open(sys.argv[3], encoding="utf-8").read().strip() if len(sys.argv) > 3 else None
    audio = whisperx.load_audio(video)
    duration = len(audio) / 16000

    if script is None:
        model = whisperx.load_model("small", "cpu", compute_type="int8", language="zh",
                                    download_root=None, local_files_only=not DOWNLOAD,
                                    asr_options={"initial_prompt": "以下是普通话的句子，使用简体中文。"})
        segs = model.transcribe(audio, batch_size=8, language="zh")["segments"]
        text = "\n".join(s["text"].strip() for s in segs)
    else:
        # 【开场·观点】这类段落标签只给 AI 分段用，不是念出来的字
        text = re.sub(r"[ \t]+", " ", re.sub(r"【[^】]*】", "", script)).strip()

    try:
        align_model, meta = whisperx.load_align_model("zh", "cpu", model_cache_only=not DOWNLOAD)
    except Exception as e:
        if DOWNLOAD:
            raise
        sys.exit(f"本机没有中文对齐模型（{e}）。第一次使用请加 --download：scripts/make-subtitles.sh --download 视频 [文稿]")
    flat = text.replace("\n", "。")
    res = whisperx.align([{"start": 0.0, "end": duration, "text": flat}], align_model, meta, audio, "cpu",
                         return_char_alignments=True)
    chars = [c for seg in res["segments"] for c in seg.get("chars", [])]

    # 没对上时间的字（标点、英文）取前后字的时间
    times = [(c.get("start"), c.get("end")) for c in chars]
    last = 0.0
    filled = []
    for i, (s, e) in enumerate(times):
        if s is None or (isinstance(s, float) and math.isnan(s)):
            nxt = next((t[0] for t in times[i + 1:] if t[0] is not None and not math.isnan(t[0])), last)
            s = e = min(last, nxt) if nxt >= last else last
        filled.append((s, e))
        last = e

    # 断句：先按标点切成小句，短的小句合并，长的按长度均分（不拆开英文单词）
    s_text = "".join(c["char"] for c in chars)
    clauses, i0 = [], 0
    for i, ch in enumerate(s_text):
        if ch in HARD or ch in SOFT or i == len(s_text) - 1:
            clauses.append([i0, i + 1, ch in HARD])
            i0 = i + 1
    merged = []
    for c in clauses:
        if merged and not merged[-1][2] and width(s_text[merged[-1][0]:c[1]].strip(TRIM)) <= MAX_LEN:
            merged[-1][1], merged[-1][2] = c[1], c[2]
        else:
            merged.append(c)
    spans = []
    for a, b, _ in merged:
        n = math.ceil(width(s_text[a:b].strip(TRIM)) / MAX_LEN)
        target = width(s_text[a:b].strip(TRIM)) / max(n, 1)
        cut, acc = a, 0.0
        for i in range(a, b):
            acc += width(s_text[i])
            inside_word = i + 1 < b and glued(s_text[i], s_text[i + 1])
            if acc >= target and not inside_word and i + 1 < b:
                spans.append((cut, i + 1))
                cut, acc = i + 1, 0.0
        spans.append((cut, b))
    lines = []
    for a, b in spans:
        idx = [i for i in range(a, b) if s_text[i].strip() and s_text[i] not in TRIM]
        if idx:
            lines.append((filled[idx[0]][0], filled[idx[-1]][1], s_text[a:b].strip(TRIM)))

    with open(out, "w", encoding="utf-8") as f:
        for n, (s, e, t) in enumerate(lines, 1):
            f.write(f"{n}\n{srt_time(s)} --> {srt_time(max(e, s + 0.3))}\n{t}\n\n")
    print(f"已生成 {out}：{len(lines)} 句，视频 {duration:.1f} 秒")
    sys.stdout.flush()
    os._exit(0)  # 跳过 whisperx 退出时偶发的崩溃


if __name__ == "__main__":
    main()

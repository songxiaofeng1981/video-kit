#!/bin/zsh
# 导出检查帧（不渲染视频）：check-frames.sh <项目目录> [输出目录]
# 每页取淡出前的最终画面；原因页额外取第二个原因聚焦时的画面
set -euo pipefail
PROJECT="${1:?用法: check-frames.sh <项目目录> [输出目录]}"
OUT="${2:-$PROJECT/out/check}"
mkdir -p "$OUT"
cd "$PROJECT"
ID_AND_FRAMES=$(node --experimental-strip-types --no-warnings -e '
  const {content} = await import(process.cwd() + "/src/content.ts");
  let start = 0; const frames = [];
  for (const p of content.pages) {
    const d = Math.round(p.seconds * 30);
    if (p.type === "causes") frames.push(start + Math.round(d * 0.55));
    frames.push(start + d - 16);
    start += d;
  }
  console.log(content.id + " " + frames.join(" "));
' --input-type=module)
ID="${ID_AND_FRAMES%% *}"
for f in ${=ID_AND_FRAMES#* }; do
  npx remotion still src/index.ts "$ID" "$OUT/frame-$f.png" --frame="$f" --scale=0.5 --log=error
  echo "$OUT/frame-$f.png"
done

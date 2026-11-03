#!/bin/zsh
# 把整理好的 HTML 里的 video-slots 写成 content.ts：import-slots.sh <xxx.video.html> <项目目录>
set -euo pipefail
HTML="${1:?用法: import-slots.sh <xxx.video.html> <项目目录>}"
PROJECT="${2:?用法: import-slots.sh <xxx.video.html> <项目目录>}"
node -e '
  const fs = require("fs");
  const [html, out, name] = process.argv.slice(1);
  const m = fs.readFileSync(html, "utf8").match(/<script[^>]*id="video-slots"[^>]*>([\s\S]*?)<\/script>/);
  if (!m) { console.error("没找到 <script id=\"video-slots\">，先按 prompts/video-ready-html.md 整理"); process.exit(1); }
  const data = JSON.parse(m[1]);
  const ts = "import type {VideoContent} from \x27./types\x27;\n\n// 来源：" + name + "（由 import-slots.sh 生成）\nexport const content: VideoContent = " + JSON.stringify(data, null, 2) + ";\n";
  fs.writeFileSync(out, ts);
  console.log("已写入: " + out);
' "$HTML" "$PROJECT/src/content.ts" "${HTML:t}"

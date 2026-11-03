# 这个视频项目的规则（Claude / Codex / Gemini 通用）

本项目由磨砂玻璃卡口播模板生成。套稿只看 `TEMPLATE.md`，只改 `src/content.ts`。

1. 转视频：`scripts/prepare-video.sh <视频路径> [名字]`，生成 public/<名字>.mp4。
2. 出字幕：`scripts/make-subtitles.sh public/<名字>.mp4 [文稿.txt]`，生成 public/subtitles.srt。有文稿一定带上。
3. 读 `TEMPLATE.md`，按它把字幕套进 `src/content.ts`。
4. 后台运行 `npm run studio`，不要等它退出；把终端里显示的地址告诉用户。
5. 不渲染、不导出成片，用户自己渲染。

- 不读、不改 `src/video.tsx` 和 `src/index.tsx`（样式和动效已锁定）。
- Studio 报 “content.ts 需要修改：……” 就按提示改 content.ts。
- 用户要改样式、加新镜头类型，先告诉用户这超出换内容的范围。

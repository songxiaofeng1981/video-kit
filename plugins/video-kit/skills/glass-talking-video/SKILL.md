---
name: glass-talking-video
description: 把一段竖屏单人口播视频套进“磨砂玻璃卡口播模板”（Remotion）：真人 + 磨砂玻璃重点卡，数据、过程切到深色画布（柱状图、时间线、流程图），逐句字幕。用户提到磨砂玻璃卡模板、玻璃卡模板、口播模板、“把这段口播套进模板”时使用。只填 content.ts，不改组件，不渲染。
---

# 磨砂玻璃卡口播模板

效果预览：https://songxiaofeng1981.github.io/video-kit/

下文的 `SKILL_DIR` 指这份 SKILL.md 所在的文件夹，`TPL` 指 `SKILL_DIR/template`。

## 第一次使用
运行一次 `TPL/scripts/setup.sh`：把 Remotion 依赖装到共享文件夹（默认 `~/.local/share/video-kit`），并检查 ffmpeg 和字幕工具。已经装过会直接跳过。

## 做口播视频的固定步骤
1. 建新项目：`TPL/scripts/new-video.sh <新项目文件夹>`。之后都在新项目里操作，不改 SKILL_DIR 里的任何文件。
2. 转视频：`scripts/prepare-video.sh <视频路径> [名字]`，生成 `public/<名字>.mp4`。
3. 出字幕：`scripts/make-subtitles.sh public/<名字>.mp4 [文稿.txt]`，生成 `public/subtitles.srt`。有文稿一定带上。
   - 报“本机没有中文对齐模型”：告诉用户第一次要下载模型，用户同意后加 `--download` 再跑。
   - 没装字幕工具：请用户自己提供 SRT，放到 `public/subtitles.srt`。
4. 读新项目里的 `TEMPLATE.md`（只读这一页），按它把字幕套进 `src/content.ts`。完整写法可以参考 `SKILL_DIR/examples/semiconductor-intro.ts`（用到图表、时间线、颜色、干净镜头）。
5. 启动预览：在新项目里后台运行 `npm run studio`，不要等它退出；把终端里显示的地址告诉用户。
6. 不渲染、不导出成片，用户自己渲染。

没有讲话的 Demo：跳过第 3 步，content.ts 里每个镜头写 `seconds` 和 `caption`，`subtitles: ''`。

## 禁止
- 不读、不改 `src/video.tsx` 和 `src/index.tsx`（样式和动效已锁定）。
- 不重写组件，不打开浏览器截图检查。
- 画面只在观众会卡住的地方出现（专有名词、数字、前后对比）；过渡句用 `clean`，什么都不加。

## 出错时
- Studio 报 “content.ts 需要修改：……”，按提示改 content.ts。
- 用户要改样式、加新镜头类型：先告诉用户这超出换内容的范围，需要改模板本身。

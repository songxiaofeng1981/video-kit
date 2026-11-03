---
name: song-insight-card-video
description: 把一张 HTML 图文卡片（小红书 3:4 财经分析卡等）做成 Remotion 竖屏动画视频，套路固定为“一个主角数字 + 两个最直接原因 + 其余压缩”。用户说“用视频模板/洞察视频模板”“把这个 HTML 做成视频/动画”“主角是 X，原因是 A、B”时使用。不用于给口播视频叠加特效（那是 song-finance-video-template）。
---

# 宋的洞察卡片视频

只讲本质：**一个主角数字放大 → 两个最直接的原因各自聚焦 → 其余压缩，不展开**。不要自由发挥加别的花样。

模板在本技能目录的 `template/`。不写 `theme` 时，已验证与首支视频（宁德时代 Q3 现金流，2026-10-22）逐像素一致。

**输入决定成品**：原 HTML 没整理好，硬套模板就会出现凑数的指标、不合语义的动画。所以先做第 0 步。

## 流程

0. **整理输入**：HTML 里已有 `<script id="video-slots">` 就跳过。否则按 `<技能目录>/prompts/video-ready-html.md` 执行，产出 `<原文件名>.video.html`（原文件旁边，不覆盖原文件）。
   - 判断为「不适合」时停下，把原因和替代做法告诉用户，不要硬做。
   - 把主角数字、两个原因、被压缩/舍弃的内容、配色告诉用户。用户已确认过主角和原因就直接继续，否则等确认。
1. **定内容**：以 video-slots 为准；用户另外指定的照用户。
2. **建项目**：`<技能目录>/scripts/new-video.sh <目标目录>`。目标目录默认放在 HTML 同级，命名 `<主题>_video`。它会复制模板并链接共享依赖，不要 `npm install`。
3. **只改 `src/content.ts`**：把 video-slots 的 JSON 照抄成 `export const content: VideoContent = {...}`，结构看 `src/types.ts`。文案里 `**重点**` 变主强调色加粗，`\n` 换行。
   - `theme` 照抄源 HTML 的颜色（page / card / ink / accent / accent2，可选 accentDark），其余色阶自动推导。不写就是默认紫/橙。
   - 不读、不改 `pages.tsx` 等组件，省 token。用户要新样式时才改组件，并说明这会影响模板；问用户是否回写到 `template/`。
4. **BGM（用户给了才做）**：`<技能目录>/scripts/prepare-bgm.sh <音乐文件> <项目目录>`，统一到 -16 LUFS，输出 `public/bgm.mp3`，原文件不动。没有 BGM 就把 content.ts 的 `bgm` 删掉。
5. **检查**：`npx tsc --noEmit -p .`，再 `<技能目录>/scripts/check-frames.sh <项目目录>`（重新检查前先删掉 `out/check`，它不覆盖旧图），逐张看导出的 PNG。文字溢出、换行难看就**缩短文案**，不要改组件尺寸。
6. **预览**：`npm run start -- --port=3000 --no-open`（3000 被占先看是谁占的），给用户 `http://localhost:3000/<id>`。
7. **默认不渲染 MP4**，用户明确要求才 `npx remotion render`。

## 页面与默认时长

| type | 作用 | 秒 |
|---|---|---|
| `cover` | 封面：标题、钩子、引导 | 4 |
| `hero` | 3 个小指标铺垫 → 主角数字砸出来计数、盖章、公式拆解 → 一条反差结论 | 5 |
| `causes` | 原因 1 聚焦 → 原因 2 聚焦（1 压暗）→ 两个都亮 + 其余原因两列小格 | 6 |
| `points` | 结论 / 验证锚点，最多 3 条 | 4 |

顺序一般就是 cover → hero → causes → points；内容少可以去掉 cover 或 points。页码、总时长自动算。

## 文案长度（超了会溢出）

- hero.value 带单位不超过 7 个字符（如 `-156.9亿`）；formula 最多 5 段，每段 ≤ 9 字，最后一段是结论（高亮）
- stats 2–3 个，value ≤ 7 字符，必须是原文里的数字，不凑数
- focus.title ≤ 8 字；from / to ≤ 5 字；stamp ≤ 5 字；body ≤ 40 字一行
- focus.speed：快、猛用 `fast`，慢、拖用 `slow`；focus.token 是流动的符号（默认 `¥`，价格下跌用 `↓`）；两张卡 tone 一个 `accent` 一个 `accent2`
- extras 最多 2 条，每条 body ≤ 30 字
- points 每条 body ≤ 70 字

## 边界

- 依赖：和 video-kit 里所有模板共用 `~/.local/share/video-kit/node_modules`（由 `glass-talking-video/template/scripts/setup.sh` 安装）。不要在项目里 `npm install`。
- 示例：`examples/` 里是做过的视频的 content.ts（宁德时代现金流、分仓位），写新视频时可以对照。
- 封面插图在 `src/illustrations.tsx` 注册；没有合适插图就不写 `illustration`，封面内容会自动居中。
- 只用 react 和 remotion，不加动画库。

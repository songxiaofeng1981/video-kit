# 模板卡：磨砂玻璃卡口播（给 AI 看，套稿只读这一页）

把一段竖屏口播视频套进本模板。**只写 `src/content.ts`**，不读 `src/video.tsx`、`src/index.tsx`。

## 输入
- `public/<视频>.mp4`（由 `scripts/prepare-video.sh` 生成）
- `public/subtitles.srt`：逐句字幕，时间是视频里实际说话的时间（由 `scripts/make-subtitles.sh 视频 [文稿]` 生成）
- 可选：用户的文稿，或用户指定的分段

## 步骤
1. 读 `subtitles.srt`，按意思把字幕分成若干段：每段讲一件事，**每 10–30 秒一个镜头**（1 分钟稿约 4–6 个，4 分钟稿约 12–15 个）。同一张卡不要停留超过约 30 秒，太长就按意思再拆一段。文稿里如果有段落标签，直接按标签分段、选类型：`【开场·观点】`、`【观点】` → glass，`【两方面】` → twoShots，`【流程对比】` → canvas，`【图表】` → chart，`【时间线】` → timeline，`【留白】` → clean，`【总结】` → outro。
2. 给每段选镜头类型（见下表）。第一段一般是 `glass`，最后一段一般是 `outro`。
3. 每段的 `at` = 这段第一句字幕的开始秒数，保留一位小数；第一个镜头写 `at: 0`。
4. 检查最短时长：glass 2 秒、twoShots 3 秒、outro 3 秒、clean 1 秒、timeline 4 秒、canvas 6 秒、chart 6 秒（到下一段的 at 为止）。不够就和相邻段合并，或换成 glass。
5. 从每段字幕里**提炼**卡片文字（不是照抄整句），按下方字数限制写。
6. 全局设置：`series` 填章节签上的英文小字（2–3 个英文词，概括主题，如 `SEMICONDUCTOR`），`video` 填视频文件名，`audio: true`，`subtitles: 'subtitles.srt'`，`continuous: true`。各镜头不用写 `caption`。
7. 运行 `npm run studio`（后台运行），把地址告诉用户。不渲染。Studio 报 “content.ts 需要修改：……” 就按提示改。

## 选镜头类型
| 这段在讲什么 | 用 | 说明 |
|---|---|---|
| 抛出观点、一个重点、开场钩子、单个结论 | `glass` | 最通用；拿不准时用它 |
| 两个方面、两种做法、A 和 B、前后对比 | `twoShots` | 两项正好各一个 |
| 流程、步骤绕圈、旧办法 vs 新办法、问题 → 解决 | `canvas` | 画面是图，人物缩到右下角；最适合讲解较长的一段 |
| 时间先后、事件经过（某年发生 A → 于是 B → 又带来 C） | `timeline` | 2–4 个节点从上往下依次出现，人物缩到右下角 |
| 很短的过渡句、情绪句、设问（观众听了不会卡住） | `clean` | 只有人物和字幕，不加卡片 |
| 用户给了数据（几个基金/公司/年份的数字对比） | `chart` | 2–4 根柱子跟着口播一根根升起；数字只用用户给的，不自己找、不自己算 |
| 总结、收尾、行动建议 | `outro` | 标题下有金线 |

同一类型可以用多次，顺序跟着稿子走。

## 各字段与字数（汉字计，英文和数字按半个）
所有镜头：`label: {num: '01', title: '≤8字'}`，num 按顺序 01、02、03…

| 类型 | 字段 |
|---|---|
| glass | `eyebrow` ≤16 字（小眉题，可中英混排如 `NEXT · 接下来讲讲`）；`title` 每行 ≤12 字，最多 2 行，用 `\n` 换行 |
| twoShots | `eyebrow` ≤16；`title` 一行 ≤14 字（如 `人物镜头 + [画布镜头]`）；`items` 正好 2 项：`{icon, title ≤6字, sub ≤6字}`；可选 `itemsAt` = 两项出现的秒数（讲到这两项那句字幕的开始） |
| clean | 只写 `label`（不显示） |
| timeline | `corner` ≤28；`kicker` ≤20；`title` 一行 ≤14；`steps` 2–4 个：`{title ≤10, sub ≤16, at, tone}`，`at` = 讲到这个节点那句字幕的开始秒数，`tone` 不写是灰白 |
| canvas | `corner` 右上角小字 ≤20；`kicker` 小标题 ≤14；`title` 一行 ≤14；`loop` 正好 4 个节点，顺时针（左上→右上→右下→左下），`{icon, title ≤5字}`，表示绕一圈的旧流程或问题；`shortcut: {title ≤10字, sub ≤14字}` 是新办法；`shortcutAt` = 讲到新办法那句字幕的开始秒数（镜头开始 2 秒后、结束前 1 秒内） |
| chart | `corner` ≤28（英文小字）；`kicker` ≤20（口径，如 `分红再投资 · 截至 2026.09.30`）；`title` 每行 ≤12 字，最多 2 行；`foot` 底部小字 ≤28（数据说明、风险提示）；`prefix` 金额前缀，默认 `$`；`bars` 2–4 根：`{name ≤6, value 数字, sub ≤12, color: blue/gold/violet/green/red, at}`，`at` = 念到这根柱子数字那句字幕的开始秒数；可选 `gap: {text: '约 2.9 倍', at}` 在最高和最低两根之间标出差距，`at` = 讲差距那句；可选 `shrinkAt` = 图缩到上半屏、人物回到下半屏的秒数（通常是讲完数字、转回口播的那句） |
| outro | `eyebrow` ≤16（如 `TAKEAWAY · ……`）；`title` 每行 ≤12 字，最多 2 行 |

- 强调色：在 title 里用 `[方括号]` 包住这段最关键的 2–6 个字，每个标题只标一处。默认金色（黄，强调）；镜头写 `tone: 'green'` 变绿（新观点、结论），`tone: 'red'` 变红（旧观点、风险）。拿不准就不写。
- 图标只能用：person 人物 / film 胶片 / edit 编辑 / clock 时钟 / back 返回 / spark 闪光 / grid 网格 / phone 手机 / server 服务器 / chip 芯片。
- canvas 没有合适的 4 步时，把旧流程概括成 4 个短词；概括不出来就改用 glass 或 twoShots。

## 示例（一段 SRT → 一个镜头）
```
12
00:00:21,300 --> 00:00:23,100
以前改一个小地方
13
00:00:23,100 --> 00:00:25,600
要等渲染、再回去改、再重新渲染
...
17
00:00:29,800 --> 00:00:31,900
现在可以直接在中间改
```
```ts
{type: 'canvas', at: 21.3, label: {num: '03', title: '改起来更快'},
 corner: 'EDITING NOTES · 流程对比', kicker: '只改一个小地方', title: '不用再绕一整圈',
 loop: [{icon: 'clock', title: '等渲染'}, {icon: 'edit', title: '改一处'}, {icon: 'back', title: '回头改'}, {icon: 'film', title: '再渲染'}],
 shortcut: {title: '新办法 · 直接改', sub: '从中间横切过去'}, shortcutAt: 29.8},
```

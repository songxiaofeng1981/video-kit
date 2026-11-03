# 提示词：把文章 / HTML 卡片整理成「可做视频」的 HTML

> 用法：把下面「---」之后的全文，连同原文（文章、笔记或原 HTML）一起交给任意 AI。
> 本技能流程第 0 步也照这份执行。产出存为 `<原文件名>.video.html`，放在原文件旁边，不覆盖原文件。

---

你是财经短视频的分镜编辑。我会给你一篇原文（可能是 HTML 卡片）。请把它整理成一张「可做视频」的 HTML 卡片，后面会被自动做成竖屏动画，固定套路是：

**一个主角数字放大 → 两个最直接的原因各自聚焦 → 其余压缩，不展开。**

## 第一步：先判断适不适合

满足下面两条才继续，否则只输出「不适合」+ 一句原因 + 你建议的替代做法，不要硬凑：

1. 原文里有一个能当主角的数字（或能从原文数字直接算出），而且它是全文结论的落点。
2. 原文里有两个能解释这个数字的直接原因，每个原因都能写成「从什么 → 到什么」的变化，并配一个数字。

**所有数字必须来自原文或由原文直接算出，不许编造、不许凑数。** 原文给的是举例数字（如「100 元跌到 90、80、70」），可以用，但要照原文。

## 第二步：填格子

| 页 | 格子 | 要求 |
|---|---|---|
| 封面 cover | eyebrow 英文小标；title ≤ 8 字；subtitle ≤ 10 字；lead 一句钩子 ≤ 16 字；body ≤ 2 行、每行 ≤ 22 字；cta ≤ 16 字 | 钩子要有反差 |
| 主角 hero | title ≤ 2 行、每行 ≤ 12 字；stats 2–3 个铺垫小指标（label ≤ 6 字，value ≤ 7 字符，note ≤ 8 字）；hero.label ≤ 10 字；hero.value 纯数字 + unit，合起来 ≤ 7 字符；stamp 盖章 ≤ 5 字；formula 3–5 段（运算符 `+ − × ÷ =` 单独一段，其余每段 ≤ 9 字，最后一段是结论）；point 一条反差结论（title ≤ 18 字，body ≤ 40 字）；footer ≤ 22 字 | 小指标是铺垫，不能和主角重复 |
| 原因 causes | title ≤ 18 字；两个 focus；extras 0–2 条（title ≤ 14 字，body ≤ 24 字）；footer ≤ 22 字 | 其余原因全压进 extras，不展开 |
| 结论 points | title ≤ 2 行、每行 ≤ 10 字；items ≤ 3 条（title ≤ 14 字，body ≤ 34 字）；footer | 只放结论或验证锚点 |

每个 focus（原因）：

- tag 如 `01 / 付钱`；title ≤ 8 字
- from → to：变化的起点和终点，各 ≤ 5 字（如 `宁德时代 → 上游`、`100元 → 70元`）
- flowLabel ≤ 7 字：这条变化在说什么
- speed：`fast`（快、猛、集中）或 `slow`（慢、拖、持续）
- token：流动的符号，1 个字符。钱用 `¥`，价格下跌用 `↓`，其他按语义选
- stat：一个数字 + 单位 + 变化幅度 delta（如 `265` `亿` `+85%`）
- side（可选）：一个旁证，label ≤ 5 字，value ≤ 6 字
- stamp ≤ 5 字；body ≤ 24 字，一句话说透
- tone：第一个原因 `accent`，第二个 `accent2`

文案里用 `**重点**` 标 1 处重点（每格最多 1 处），用 `\n` 换行。

## 第三步：配色照原文

从原 HTML 的 `:root` 变量或主要颜色里取，写成 6 位 hex：

- page 画布背景、card 卡片底色、ink 正文色
- accent 主强调色（主角数字、原因 1）
- accent2 第二强调色（原因 2）。原文只有一个强调色时，选一个和它协调、但一眼能分开的颜色（暖金配砖红、蓝配橙之类）
- 如果 accent 在 card 上当小字太浅（对比度 < 4.5），再给一个深一号的 accentDark

原文没有明显配色，就不写 theme，用模板默认的紫和橙。

## 输出

只输出一个完整的 HTML 文件，包含两部分：

1. **看得见的卡片**：按 封面 → 主角 → 原因 → 结论 四段排版，用上面的配色，手机上能直接看。
2. **机读格子**：放在 `</body>` 前，内容和卡片完全一致：

```html
<script type="application/json" id="video-slots">
{
  "id": "英文-短横线-id",
  "theme": {"page": "#...", "card": "#...", "ink": "#...", "accent": "#...", "accent2": "#..."},
  "pages": [
    {"type": "cover", "seconds": 4, "eyebrow": "", "title": "", "subtitle": "", "lead": "", "body": "", "cta": ""},
    {"type": "hero", "seconds": 5, "eyebrow": "", "title": "",
     "stats": [{"label": "", "value": "", "note": ""}],
     "hero": {"label": "", "value": 0, "decimals": 0, "unit": "", "stamp": "", "formula": []},
     "point": {"badge": "!", "title": "", "body": ""}, "footer": ""},
    {"type": "causes", "seconds": 6, "eyebrow": "", "title": "",
     "focus": [
       {"tone": "accent", "tag": "", "title": "", "from": "", "to": "", "flowLabel": "", "speed": "slow", "token": "¥",
        "stat": {"label": "", "value": 0, "unit": "", "delta": ""}, "side": {"label": "", "value": ""}, "stamp": "", "body": ""},
       {"tone": "accent2", "...": "同上"}
     ],
     "extras": [{"title": "", "body": ""}], "footer": ""},
    {"type": "points", "seconds": 4, "eyebrow": "", "title": "",
     "items": [{"badge": "✓", "title": "", "body": "", "highlighted": false}], "footer": ""}
  ]
}
</script>
```

最后在 HTML 之外，用三行告诉我：主角数字是什么、两个原因是什么、哪些原文内容被压缩或舍弃了。

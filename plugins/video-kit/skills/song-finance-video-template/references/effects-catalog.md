# 效果目录

所有组件位于 `assets/remotion/SongFinanceEffects.jsx`，默认按 30fps、6 秒局部 Sequence 调校。放入其他帧率项目时，组件会从 `useVideoConfig()` 读取 fps。

## 1. 新闻截图弹出 · `NewsPopup`

适合新闻、公告、财报标题、机构观点和网页截图。主卡从下方轻微旋转进入，第二张快讯从右侧叠入，重点词下方扫出红线，图片持续极缓推进。

主要参数：`imageSrc`、`paper`、`date`、`headlineBefore`、`highlight`、`ticker`、`tickerTime`。

## 2. 数据卡 · `DataMetricCard`

适合同比增速、利润率、收入、现金流、估值或单个最重要指标。大数字递增出现，折线随后生长，最多附带三个辅助标签。

主要参数：`label`、`value`、`prefix`、`suffix`、`comparison`、`chips`、`sparkPoints`、`accentColor`。

## 3. 图表展示 · `StoryChart`

适合“历史已经发生—未来存在分歧”的推演。先画历史线，再画强调色预测线和保守虚线，最后弹出结论标签。

主要参数：`title`、`subtitle`、`callout`、`xLabels`、`historyPath`、`forecastPath`、`conservativePath`。

## 4. 财经重点词·三级递进 · `KeywordHighlight`

适合口播中的核心判断、反转句和结论句。第一行灰白小字、第二行白色大字、第三行金色超大关键词依次出现，关键词下方红线扫过。

这是当前项目第四段的正式可复用版本。保持原节奏：第一行约第 8 帧、第二行约第 34 帧、核心词约第 64 帧进入，下划线约第 82–112 帧扫过。

主要参数：`eyebrow`、`setup`、`keyword`、`note`、`accentColor`、`underlineColor`、`align`。

## 5. 图片/截图全屏切换 · `FullscreenScreenshot`

适合证据截图、公告、财报页、新闻页面和产品画面。截图从中间揭开并全屏展示，之后保持极缓推进，底部说明卡随后出现。

主要参数：`imageSrc`、`label`、`caption`、`imageFit`、`backgroundColor`。

## 共用参数

- `durationInFrames`：该效果所在 Sequence 的局部时长，默认 180 帧。
- `showDebugLabel`：是否显示效果编号和参考名，正式视频保持 `false`。
- `fontFamily`：默认使用 Arial、苹方、微软雅黑回退栈。

## 选择原则

- 有真实新闻或公告：优先 `NewsPopup` 或 `FullscreenScreenshot`。
- 只有一个关键数字：优先 `DataMetricCard`。
- 需要解释趋势或情景差异：使用 `StoryChart`。
- 需要观众记住一句判断：使用 `KeywordHighlight`。
- 一句话同时满足多个效果时，只选承担主要信息的一种，避免堆叠。

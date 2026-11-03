---
name: song-finance-video-template
description: 复用“宋的财经模板”制作或修改 Remotion 财经口播视频。适用于用户要求使用宋的财经模板、复用已确认的新闻卡/数据卡/图表/重点文字/全屏截图效果，或把这些固定动效加入新视频；不用于未指定该模板的一般视频设计。
---

# 宋的财经模板

使用已经确认的五种 Remotion 动效，不从零重新设计视觉语言。

## 固定原则

- 以 [assets/remotion/SongFinanceEffects.jsx](assets/remotion/SongFinanceEffects.jsx) 为运动母版。默认只改文字、数字、图片、颜色参数、出现时间与持续时长；除非用户明确要求，不改变弹簧参数、层级关系和核心运动。
- 先检查目标 Remotion 项目、现有 Composition、素材和未提交改动。只复制需要的模板文件，尽量少改现有代码。
- 把动效放进 `Sequence`，让组件内部使用局部帧。背景视频和原声音轨默认继续播放。
- 正式视频默认关闭 `showDebugLabel`；左上角编号和参考来源只用于效果演示。
- 没有明确节奏时，保持克制，避免同一时刻叠放多个强动效。
- 默认只启动 Remotion Studio 供预览。只有用户明确要求最终输出时才执行 render 或生成 MP4。
- 不安装 `video-talkcraft`，不运行 ASR、自动分镜、QA 或其完整生产管线。

## 工作流程

1. 定位用户指定的现有 Remotion 项目和源视频，不另建正式视频项目。
2. 按用户给出的时间点、口播句子或素材选择效果。需要选择帮助时读取 [references/effects-catalog.md](references/effects-catalog.md)。
3. 将 `assets/remotion/SongFinanceEffects.jsx` 复制到目标项目的 `src/` 或现有组件目录；项目已经有同名文件时先比较并保留用户修改。
4. 在目标 Composition 中用 `Sequence` 调用对应组件，并通过 props 传入文字、数字和图片。参考 `assets/remotion/SongFinanceDemo.jsx`，不要把示例文案当成正式内容。
5. 编译检查后启动 Studio，停在新增效果附近供用户观看。不要自动渲染。
6. 用户要求调整时优先修改 props；只有 props 无法表达需求时才改组件母版，并说明该修改是否会影响以后所有视频。

## 五个效果

- `NewsPopup`：新闻截图弹出与关键词划线。
- `DataMetricCard`：核心指标、递增数字、sparkline 和辅助标签。
- `StoryChart`：历史线与预测线分段生长。
- `KeywordHighlight`：财经重点词·三级递进；这是用户已确认最满意的第四段效果。
- `FullscreenScreenshot`：截图全屏揭示与极缓推进。

具体适用场景、参数和推荐提示词见 [references/effects-catalog.md](references/effects-catalog.md)。用户询问如何调用或调整时读取 [references/usage-guide.md](references/usage-guide.md)。

## 边界

- 模板组件只依赖 `react` 与 `remotion`，不要为了这些效果添加动画库。
- 素材路径由目标项目管理；不要把旧视频、旧图片、输出 MP4 或 `node_modules` 复制进新项目。
- 用户提供的时间可以按秒换算为帧：`Math.round(seconds * fps)`。
- 文案过长时先换行或小幅缩小字号，保持视觉层级；不要为了塞字破坏动画结构。

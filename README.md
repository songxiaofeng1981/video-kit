# video-kit · 磨砂玻璃卡口播模板

**在线预览：https://songxiaofeng1981.github.io/video-kit/** 打开就能看，不用安装，也没有渲染。

竖屏单人口播模板（Remotion）：真人 + 磨砂玻璃重点卡；讲数据、过程时切到深色画布（柱状图、时间线、流程图），人缩到右下角；逐句字幕按真实说话时间对齐。

- **固定组件，只填内容**：7 种镜头的样式和动效都已锁定，AI 只往 `content.ts` 里填文字和数字。填错了，预览里直接用中文报出哪里不对。
- **画面克制**：只在观众会卡住的地方出卡（专有名词、数字、前后对比），过渡句什么都不加。颜色有固定含义：黄 = 强调，绿 = 新观点 / 结论，红 = 旧观点 / 风险。
- **不渲染**：AI 做到 Remotion Studio 预览为止，成片你自己渲染。

## 安装

**Claude Code**

```bash
claude plugin marketplace add songxiaofeng1981/video-kit
claude plugin install video-kit@video-kit
```

**Codex**

```bash
codex plugin marketplace add songxiaofeng1981/video-kit
codex plugin add video-kit@video-kit
```

**其他工具（Gemini CLI、Antigravity 等）**：把仓库下载到本机，在仓库里打开工具，它会读 `AGENTS.md`。

```bash
git clone https://github.com/songxiaofeng1981/video-kit.git
```

需要：Node.js 18+、ffmpeg。自动对齐字幕还要 [WhisperX](https://github.com/m-bain/whisperX)（可选，不装就自己提供 SRT 字幕）。第一次使用时 AI 会运行 `setup.sh`，把 Remotion 依赖装到 `~/.local/share/video-kit`，所有视频项目共用这一份。

## 怎么用

装好后对 AI 说：

```text
用磨砂玻璃卡模板做一个口播视频。
视频：~/Movies/IMG_1234.MOV
文稿：~/Documents/文稿.txt
新项目文件夹：~/Videos/主题名
```

AI 会：建项目 → 转视频 → 按文稿对齐字幕 → 按 `TEMPLATE.md` 填 `content.ts` → 打开 Studio 预览。你在 Studio 里看效果、自己渲染。

写稿时可以给段落加标签，AI 会按标签选镜头：`【开场·观点】` `【观点】` → 重点卡，`【两方面】` → 两项说明，`【流程对比】` → 流程图，`【图表】` → 柱状图，`【时间线】` → 时间线，`【留白】` → 干净，`【总结】` → 收束。

## 仓库里有什么

| 位置 | 内容 |
|---|---|
| `plugins/video-kit/skills/glass-talking-video/` | 模板 skill：`SKILL.md`（步骤）、`TEMPLATE.md`（一页规则卡）、`template/`（代码和脚本）、`examples/`（完整示例） |
| `plugins/video-kit/sfx/` | 22 个音效，用代码合成，没有版权问题 |
| `docs/` | 在线预览页（GitHub Pages） |
| `gallery/` | 预览页源码；改了模板后运行 `gallery/build.sh` 重新生成 |

## 授权

- 本仓库：MIT + Commons Clause，以 [LICENSE](LICENSE) 为准。简单说：可以免费使用、修改，可以用它做视频、发布、变现，也可以替客户做视频；不可以把模板本身拿去收费出售或付费分发。
- [Remotion](https://www.remotion.dev/license) 有自己的授权：个人和 3 人以内的公司免费，更大的公司需要购买 Remotion 授权。
- 磨砂玻璃卡的视觉参考自抖音账号 AI-kongbeixin_47 的视频，组件全部为代码重建。

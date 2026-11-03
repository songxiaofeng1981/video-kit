# video-kit · 给 AI 的入口（Codex / Gemini / Antigravity 等通用）

这个仓库是一个视频模板插件，里面有几个模板，每个模板是 `plugins/video-kit/skills/` 下的一个文件夹：

| 模板 | 什么时候用 |
|---|---|
| `glass-talking-video` | 竖屏单人口播 → 磨砂玻璃卡 + 深色画布 + 逐句字幕 |
| `song-insight-card-video` | HTML 图文卡片（3:4）→ 竖屏动画：一个主角数字 + 两个原因 |
| `song-finance-video-template` | 给已有的 Remotion 口播视频加 5 种固定财经动效（新闻卡、数据卡、图表、重点词、全屏截图） |

做视频时：

1. 按上表选模板，读它的 `SKILL.md`，照步骤做。文中的 `SKILL_DIR`（或“技能目录”）就是这份 SKILL.md 所在的文件夹。
2. 新项目建在用户指定的文件夹，不在这个仓库里做视频，也不改这个仓库的文件。
3. 不渲染，用户自己渲染。

修改模板本身（组件、预览页）是另一件事：改对应模板 `template/` 里的代码；改了任何一个模板后，都运行 `gallery/build.sh` 重新生成 `docs/` 预览页（三个模板都在这一页上）。

所有模板共用一份依赖：`~/.local/share/video-kit/node_modules`，由 `glass-talking-video/template/scripts/setup.sh` 安装，依赖清单就是玻璃卡模板的 `package.json`。

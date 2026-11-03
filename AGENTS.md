# video-kit · 给 AI 的入口（Codex / Gemini / Antigravity 等通用）

这个仓库是一个视频模板插件。要做口播视频时：

1. 读 `plugins/video-kit/skills/glass-talking-video/SKILL.md`，照它的步骤做。文中的 `SKILL_DIR` 就是这份 SKILL.md 所在的文件夹。
2. 新项目建在用户指定的文件夹，不在这个仓库里做视频，也不改这个仓库的文件。
3. 不渲染，用户自己渲染。

修改模板本身（组件、预览页）是另一件事：改 `plugins/video-kit/skills/glass-talking-video/template/` 里的代码后，运行 `gallery/build.sh` 重新生成 `docs/` 预览页。

#!/bin/zsh
# 重新生成在线预览页 docs/（GitHub Pages 从这里发布）。不渲染视频，网页里用 Remotion 播放器实时播放。
# 用法：gallery/build.sh            生成 docs/
#       gallery/build.sh serve      生成后在 http://localhost:8090/video-kit/ 打开（模拟 GitHub Pages 的二级目录）
set -euo pipefail
here=${0:A:h}; root=${here:h}
skill=$root/plugins/video-kit/skills/glass-talking-video
home=${VIDEO_KIT_HOME:-$HOME/.local/share/video-kit}
[[ -d $home/node_modules/@remotion/player ]] || { echo "先运行：$skill/template/scripts/setup.sh"; exit 1; }
cd $here
ln -sfn $home/node_modules node_modules
# 玻璃卡模板：两份示例共用同一套组件：tpl-demo 是模板自带的内容，tpl-intro 换成半导体引子的内容
rm -rf src/tpl-demo src/tpl-intro && mkdir -p src/tpl-demo src/tpl-intro
cp $skill/template/src/video.tsx $skill/template/src/content.ts src/tpl-demo/
cp $skill/template/src/video.tsx src/tpl-intro/
cp $skill/examples/semiconductor-intro.ts src/tpl-intro/content.ts
cp $skill/examples/semiconductor-intro.srt src/tpl-intro/subtitles.srt
# 洞察卡模板：整份 src 照搬（自带的宁德时代示例），去掉 bgm，网页里不放音乐
insight=$root/plugins/video-kit/skills/song-insight-card-video
rm -rf src/insight && cp -R $insight/template/src src/insight && rm src/insight/index.ts src/insight/Root.tsx
sed -i '' '/^  bgm: /d' src/insight/content.ts
# 宋的财经模板：只取特效母版，演示合成在 src/FinanceDemo.tsx
finance=$root/plugins/video-kit/skills/song-finance-video-template
rm -rf src/finance && mkdir -p src/finance && cp $finance/assets/remotion/SongFinanceEffects.jsx src/finance/

docs=$root/docs
rm -rf $docs && mkdir -p $docs/media/sfx && touch $docs/.nojekyll
cp $skill/template/public/own-demo.mp4 $docs/media/
cp news-placeholder.svg $docs/media/
cp $root/plugins/video-kit/sfx/*.wav $docs/media/sfx/
cp index.html guide.html $docs/
node_modules/.bin/esbuild src/main.tsx --bundle --minify --jsx=automatic --outfile=$docs/app.js --loader:.srt=text \
	--define:process.env.NODE_ENV='"production"' --log-level=warning
du -sh $docs
if [[ ${1:-} == serve ]]; then
	site=$(mktemp -d); ln -s $docs $site/video-kit
	echo "打开 http://localhost:8090/video-kit/"; cd $site && exec python3 -m http.server 8090
fi

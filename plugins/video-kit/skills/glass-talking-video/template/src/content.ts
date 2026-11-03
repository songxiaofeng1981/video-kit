// 复用时只改这个文件。样式、动效在 video.tsx，不用改。怎么套稿见 TEMPLATE.md。
//
// 写法约定：
// - 文字里用 [方括号] 包住的部分显示为强调色；\n 换行（只在 title 里用）。
// - 强调色 tone：gold 黄（强调，默认）/ green 绿（新观点、结论）/ red 红（旧观点、风险）。
// - 可用图标：person 人物 / film 胶片 / edit 编辑 / clock 时钟 / back 返回 / spark 闪光 / grid 网格 /
//   phone 手机 / server 服务器 / chip 芯片
//
// 镜头时间两种写法，全片只能用一种：
// - 口播：每个镜头写 at（从视频第几秒开始，取自 subtitles.srt）。镜头播到下一个镜头的 at，
//   最后一个播到视频结尾，成片长度 = 视频长度。第一个镜头的 at 写 0。
// - Demo：每个镜头写 seconds（停留几秒），成片长度 = 秒数相加，视频不够长就循环。
//
// 七种镜头（最短时长）：
// - glass    真人 + 磨砂重点卡（一句主标题）            2 秒
// - twoShots 真人 + 磨砂卡 + 两项说明（itemsAt 控制两项何时出现）   3 秒
// - clean    只有真人和字幕，不加卡片                   1 秒
// - canvas   深色画布：四节点红色旧流程 → 绿色捷径 + 圆形头像   6 秒
// - chart    深色画布：2–4 根柱子跟着口播升起 + 圆形头像，可缩到上半屏、人物回到下半屏   6 秒
// - timeline 深色画布：2–4 个节点从上往下依次出现的时间线 + 圆形头像   4 秒
// - outro    真人 + 收束卡（标题下有一条金线）           3 秒

export const content: Content = {
	// 放在 public/ 里的视频文件名。iPhone 的 MOV 先用 scripts/prepare-video.sh 转成 mp4。
	// 章节签上的英文小字，整条视频统一，比如 'SEMICONDUCTOR'、'AI NOTES'
	series: 'THE NEW SKILL',
	video: 'own-demo.mp4',
	// true：保留视频原声（正式口播用）；false：静音（Demo 用）
	audio: false,
	// 逐句字幕：public/ 里的 SRT 文件名（scripts/make-subtitles.sh 生成）。
	// 留空 '' 时，每个镜头显示自己的 caption。
	subtitles: '',
	// true：每个镜头接着上一个镜头的位置播放人物；false：每个镜头都从视频开头播放。
	continuous: true,
	layout: {
		cardShift: 0, // 真人镜头的卡片整体上下移动（px，正数往下）。卡片挡脸就填负数。
		captionTop: 1700, // 真人镜头字幕的位置（画面高 1920）
		pipTop: -52, // 圆形头像里人物的上下位置，脸偏下就填更小的负数
		halfTop: -180, // chart 缩到上半屏后，下半屏人物的上下位置，脸偏下就填更小的负数
	},
	scenes: [
		{
			type: 'glass',
			seconds: 6,
			label: {num: '01', title: '核心制作思路'},
			eyebrow: 'NEXT · 接下来讲讲',
			title: '新 skill 的\n核心[制作思路]',
			caption: '新 skill 的核心制作思路',
		},
		{
			type: 'twoShots',
			seconds: 6,
			label: {num: '02', title: '两种镜头'},
			eyebrow: '01 · 两种镜头，分工明确',
			title: '人物镜头 + [画布镜头]',
			items: [
				{icon: 'person', title: '人物镜头', sub: '讲清楚'},
				{icon: 'film', title: '画布镜头', sub: '画出来'},
			],
			caption: '讲述交给人物，解释交给画布',
		},
		{
			type: 'canvas',
			seconds: 10,
			label: {num: '03', title: '画布是一张地图'},
			corner: 'EDITING NOTES · 视觉拆解',
			kicker: '只改一个小地方',
			title: '不用再绕一整圈',
			// 顺时针四个节点：左上 → 右上 → 右下 → 左下
			loop: [
				{icon: 'clock', title: '白白等'},
				{icon: 'edit', title: '改一个地方'},
				{icon: 'back', title: '要回去'},
				{icon: 'film', title: '重新渲染'},
			],
			shortcut: {title: '新办法 · 直接改', sub: '从中间横切过去'},
			// shortcutAt: 绿色捷径出现的时间（视频第几秒，口播里讲到新办法那句）。不写则镜头开始后约 4 秒出现。
			caption: '修改一个地方，不必重走整个流程',
			captionAfter: '一条捷径，直接从中间横切过去', // 绿色捷径出现后的字幕
		},
		{
			type: 'outro',
			seconds: 6,
			label: {num: '04', title: '内容决定画面'},
			eyebrow: 'TAKEAWAY · 把表达放在前面',
			title: '先把内容[讲清楚]\n再让画面跟上',
			caption: '画面服务表达，重点自然被看见',
		},
	],
};

// ---- 以下是格式定义，复用时不用改 ----
export type IconName = 'person' | 'film' | 'edit' | 'clock' | 'back' | 'spark' | 'grid' | 'phone' | 'server' | 'chip';
export type Tone = 'gold' | 'green' | 'red';
type Label = {num: string; title: string};
type Base = {at?: number; seconds?: number; label: Label; caption?: string; tone?: Tone};
export type Scene =
	| (Base & {type: 'glass'; eyebrow: string; title: string})
	| (Base & {type: 'twoShots'; eyebrow: string; title: string; items: [Item, Item]; itemsAt?: number})
	| (Base & {type: 'clean'})
	| (Base & {type: 'canvas'; corner: string; kicker: string; title: string; loop: [Item, Item, Item, Item]; shortcut: {title: string; sub: string}; shortcutAt?: number; captionAfter?: string})
	| (Base & {type: 'chart'; corner: string; kicker: string; title: string; foot: string; prefix?: string; bars: Bar[]; gap?: {text: string; at?: number}; shrinkAt?: number})
	| (Base & {type: 'timeline'; corner: string; kicker: string; title: string; steps: Step[]})
	| (Base & {type: 'outro'; eyebrow: string; title: string});
type Item = {icon: IconName; title: string; sub?: string};
export type BarColor = 'blue' | 'gold' | 'violet' | 'green' | 'red';
// at：这根柱子升起的时间（视频第几秒，讲到它的那句字幕）。不写则镜头开始后依次升起。
type Bar = {name: string; value: number; sub?: string; color: BarColor; at?: number};
// at：这个节点出现的时间（视频第几秒）。tone 不写是灰白，写了节点和标题用这个颜色。
type Step = {title: string; sub?: string; at?: number; tone?: Tone};
export type Content = {
	series: string;
	video: string;
	audio: boolean;
	subtitles: string;
	continuous: boolean;
	layout: {cardShift: number; captionTop: number; pipTop: number; halfTop: number};
	scenes: Scene[];
};

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

// 引子预览：还没录音，字幕按语速估算（public/subtitles.srt），人物先用 13 秒演示视频循环，所以用 seconds 写法。
// 画面按逐句标注表配：观点 → 真人 + 卡，数据/过程 → 画布，过渡句 → 干净。颜色：绿=新观点/结论，黄=强调。
// 录好后：make-subtitles.sh 重新生成字幕，seconds 换成 at，柱子/节点的 at、gap.at、shrinkAt、itemsAt 换成实际秒数。
export const content: Content = {
	series: 'SEMICONDUCTOR',
	video: 'own-demo.mp4',
	audio: false,
	subtitles: 'subtitles.srt',
	continuous: true,
	layout: {cardShift: 0, captionTop: 1700, pipTop: -52, halfTop: -180},
	scenes: [
		// 第 1 句：结论先行（黄=强调）
		{type: 'glass', seconds: 9.5, label: {num: '01', title: '十年收益'},
			eyebrow: 'PAST 10 YEARS · 过去十年', title: '同样 1 万美元\n差了快[3 倍]'},
		// 第 2–3 句：看图（画布，人在右下角）→ 问“为什么”时图缩到上半屏
		{type: 'chart', seconds: 11, label: {num: '02', title: '一万美元变多少'},
			corner: 'GROWTH OF $10,000 · 10 YEARS', kicker: '分红再投资 · 截至 2026.09.30',
			title: '十年前投入 1 万美元\n现在变成多少？',
			foot: '按十年年化总回报复利推算 · 历史表现不代表未来收益',
			bars: [
				{name: 'SMH', value: 192449, sub: '半导体 ETF', color: 'blue', at: 10.6},
				{name: 'SOXX', value: 165656, sub: '半导体 ETF', color: 'gold', at: 13.0},
				{name: '纳指 100', value: 66776, sub: 'QQQ', color: 'violet', at: 15.0},
			],
			gap: {text: '约 2.9 倍', at: 16.4},
			shrinkAt: 17.1}, // “为什么半导体能涨这么多？”
		// 第 4 句：观点（绿）
		{type: 'glass', seconds: 3.9, tone: 'green', label: {num: '03', title: '为什么'},
			eyebrow: '我觉得 · 原因', title: '赶上了\n[移动互联网]'},
		// 第 5 句：过程 → 时间线
		{type: 'timeline', seconds: 10.4, label: {num: '04', title: '2010 年之后'},
			corner: 'MOBILE INTERNET · 2010–', kicker: '移动互联网十年', title: '一批公司[随之而起]',
			steps: [
				{title: '2010 · iPhone 4', sub: '发布', at: 24.6},
				{title: '智能手机普及', at: 27.2},
				{title: '一批大公司', sub: '腾讯 · 阿里 · 京东 · 美团 · 头条', at: 29.2},
			]},
		// 第 6–7 句：结论（绿），第 7 句时两项出现
		{type: 'twoShots', seconds: 10.4, tone: 'green', label: {num: '05', title: '背后是芯片'},
			eyebrow: 'BEHIND · 支撑它们的', title: '背后是[半导体]',
			items: [{icon: 'phone', title: '手机', sub: '越来越强'}, {icon: 'server', title: '服务器', sub: '越来越多'}],
			itemsAt: 38.8},
		// 第 8 句：过渡，保持干净
		{type: 'clean', seconds: 2.3, label: {num: '06', title: '下一个十年'}},
		// 第 9 句：钩子（绿=新观点）
		{type: 'outro', seconds: 4.5, tone: 'green', label: {num: '06', title: '下一个十年'},
			eyebrow: 'NEXT 10 YEARS · 下一个十年', title: 'AI 会不会\n把故事[再讲一遍]？'},
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

// 模板预览页：用 Remotion 网页播放器实时播放，不渲染。
// 玻璃卡模板：两份示例共用同一套组件，tpl-intro（半导体引子，含图表、时间线、颜色），tpl-demo（模板自带的四种基础镜头）。
// 洞察卡模板：insight（模板自带的宁德时代示例）。宋的财经模板：FinanceDemo（五种特效）。
import React, {useEffect, useState} from 'react';
import {createRoot} from 'react-dom/client';
import {Player} from '@remotion/player';
import * as Intro from './tpl-intro/video';
import {content as introContent} from './tpl-intro/content';
import * as Demo from './tpl-demo/video';
import {content as demoContent} from './tpl-demo/content';
// 字幕打包进 app.js，不用 fetch：直接双击打开 index.html（file://）也能播
import introSrt from './tpl-intro/subtitles.srt';
import {InsightVideo, pageFrames, totalFrames as insightTotal} from './insight/Video';
import {content as insightContent} from './insight/content';
import {FINANCE_SCENE, FinanceDemo, financeEffects, financeTotal} from './FinanceDemo';

// staticFile() 按这个前缀找文件；用相对当前页面的路径，放到任何二级目录都能用
const base = new URL('media', location.href).pathname.replace(/\/$/, '');
(window as any).remotion_staticBase = base;

type Kit = typeof Intro;
type Ready = {kit: Kit; props: Intro.Props; total: number};

async function load(kit: Kit, content: typeof introContent): Promise<Ready> {
	const v = document.createElement('video');
	v.src = `${base}/${content.video}`;
	await new Promise((ok, fail) => {v.onloadedmetadata = ok; v.onerror = fail;});
	const videoFrames = Math.max(1, Math.floor(v.duration * kit.FPS));
	const timeline = kit.buildTimeline(videoFrames);
	const subs = content.subtitles ? kit.parseSrt(introSrt) : [];
	const last = timeline[timeline.length - 1];
	return {kit, props: {videoFrames, timeline, subs}, total: last.from + last.frames};
}

// 每种镜头取哪个示例的第几个镜头
const cards: {from: 'intro' | 'demo'; i: number; type: string; name: string; use: string; fields: string}[] = [
	{from: 'intro', i: 0, type: 'glass', name: '重点卡', use: '开场、抛观点、单个结论', fields: 'eyebrow 眉题 ≤16 字 · title 最多 2 行、每行 ≤12 字 · [方括号] 强调'},
	{from: 'intro', i: 4, type: 'twoShots', name: '两项说明', use: '两个方面、A 和 B', fields: 'title 一行 ≤14 字 · items 正好 2 项（图标 + 标题 + 小字）· itemsAt 两项出现的时间'},
	{from: 'demo', i: 2, type: 'canvas', name: '流程与捷径', use: '旧办法绕一圈 → 新办法直接走', fields: 'loop 4 个节点（红色旧流程）· shortcut 绿色捷径 · shortcutAt 捷径出现的时间'},
	{from: 'intro', i: 1, type: 'chart', name: '柱状图', use: '几个数字的对比', fields: 'bars 2–4 根（名字、数值、颜色、升起时间）· gap 倍数标注 · shrinkAt 缩到上半屏'},
	{from: 'intro', i: 3, type: 'timeline', name: '时间线', use: '时间先后、事件经过', fields: 'steps 2–4 个节点（标题、小字、出现时间、颜色）'},
	{from: 'intro', i: 5, type: 'clean', name: '干净', use: '过渡句、设问，不加任何东西', fields: '无'},
	{from: 'intro', i: 6, type: 'outro', name: '收束', use: '总结、结尾钩子', fields: 'eyebrow 眉题 · title 最多 2 行 · 标题下一条金线'},
];

const sfx: [string, string][] = [
	['whoosh', '文字擦入、滑入、转场（最常用）'], ['whoosh_short', '短促版，小字入场'], ['ppt_swish', '切换、换页、退场'],
	['click', '点击、选中'], ['keypress', '单次按键，文字落下'], ['typing', '连续打字'], ['pop', '图标、气泡弹出'],
	['ding', '要点、打勾、正确'], ['sparkle', '金句、高光词'], ['boom', '设问、悬念、开场'], ['impact', '结论落地、揭晓'],
	['riser', '上扬蓄力，揭晓之前'], ['bolt', '大字定格'], ['ratchet', '思考、运转'], ['digits_tick', '数字滚动'],
	['data_beam', '数据、图表出现'], ['glitch', '故障、科技感'], ['film_roll', '复古、回忆'], ['flashback', '闪回切换'],
	['shutter', '截图、定格'], ['page_flip', '换话题、下一条'], ['low_battery', '结尾、提醒'],
];

const size = {compositionWidth: 1080, compositionHeight: 1920, fps: 30} as const;
const insightSize = {compositionWidth: 1080, compositionHeight: 1440, fps: 30} as const;

const insightPages: Record<string, [string, string]> = {
	cover: ['封面', '标题、钩子、引导'],
	hero: ['主角数字', '3 个小指标铺垫 → 主角数字砸出来、盖章、公式拆解 → 一条反差结论'],
	causes: ['两个原因', '原因 1 聚焦 → 原因 2 聚焦 → 两个都亮，其余原因压成小格'],
	points: ['结论', '结论或验证锚点，最多 3 条'],
};
let at = 0;
const insightRanges = insightContent.pages.map(pg => {const r = {type: pg.type, from: at, frames: pageFrames(pg)}; at += r.frames; return r;});
const playerStyle = {width: '100%', borderRadius: 14, overflow: 'hidden'} as const;

// 封面都停在这一段内容出齐、还没淡出的那一帧
const Segment = ({component, total, from, frames, sz}: {component: React.FC; total: number; from: number; frames: number; sz: typeof size | typeof insightSize}) =>
	<Player component={component} durationInFrames={total} {...sz}
		inFrame={from} outFrame={from + frames - 1} initialFrame={from + frames - 20}
		controls loop clickToPlay style={playerStyle}/>;

function Clip({r, i, type}: {r: Ready; i: number; type: string}) {
	const s = r.props.timeline[i];
	// 封面停在这个镜头内容都出齐的那一帧（柱状图停在缩到上半屏之前）
	const shrink = type === 'chart' && s.shortcut < s.frames ? s.shortcut - 5 : s.frames - 8;
	return <Player component={r.kit.Demo} inputProps={r.props} durationInFrames={r.total} {...size}
		inFrame={s.from} outFrame={s.from + s.frames - 1} initialFrame={s.from + shrink}
		controls loop clickToPlay style={{width: '100%', borderRadius: 14, overflow: 'hidden'}}/>;
}

function App() {
	const [ready, setReady] = useState<{intro: Ready; demo: Ready} | null>(null);
	const [err, setErr] = useState('');
	useEffect(() => {
		Promise.all([load(Intro, introContent), load(Demo as unknown as Kit, demoContent as typeof introContent)])
			.then(([intro, demo]) => setReady({intro, demo})).catch(e => setErr(String(e)));
	}, []);
	if (err) return <p className="note">加载失败：{err}</p>;
	if (!ready) return <p className="note">加载中…</p>;
	const play = (n: string) => new Audio(`${base}/sfx/${n}.wav`).play();
	return <>
		<nav className="toc">
			<a href="#glass"><b>磨砂玻璃卡口播</b><small>竖屏真人口播，7 种镜头</small></a>
			<a href="#insight"><b>洞察卡视频</b><small>HTML 图文卡 → 3:4 动画</small></a>
			<a href="#finance"><b>宋的财经特效</b><small>叠在已有口播上的 5 种特效</small></a>
		</nav>

		<h2 className="section" id="glass">磨砂玻璃卡口播模板</h2>
		<p className="dim">技能名 <code>glass-talking-video</code>。竖屏单人口播：真人 + 磨砂玻璃卡，数据和过程切到深色画布。</p>
		<section className="hero">
			<div className="hero-player">
				<Player component={ready.intro.kit.Demo} inputProps={ready.intro.props} durationInFrames={ready.intro.total} {...size}
					controls clickToPlay style={{width: '100%', borderRadius: 18, overflow: 'hidden'}}/>
			</div>
			<div className="hero-text">
				<p className="kicker">完整示例 · 半导体引子 · 约 {Math.round(ready.intro.total / 30)} 秒</p>
				<h2>画面只在观众会卡住的地方出现</h2>
				<p>观点、结论 → 真人 + 一张卡；数据、过程 → 切画布，人缩到右下角；过渡句 → 什么都不加。</p>
				<p>颜色有固定含义：<b className="gold">黄 = 强调</b>，<b className="green">绿 = 新观点 / 结论</b>，<b className="red">红 = 旧观点 / 风险</b>。</p>
				<p className="dim">人物是 13 秒演示视频循环，字幕按语速估算。实际使用时换成自己的口播视频，字幕按真实说话时间对齐。</p>
			</div>
		</section>

		<h3 className="sub">7 种镜头</h3>
		<p className="dim">每个播放器只播这一种镜头，可以拖动进度条。用的人只需要往这些字段里填内容，样式和动效都是固定的。</p>
		<div className="grid">{cards.map(c => <article key={c.type} className="card">
			<Clip r={c.from === 'intro' ? ready.intro : ready.demo} i={c.i} type={c.type}/>
			<h3><code>{c.type}</code> {c.name}</h3>
			<p>{c.use}</p>
			<p className="fields">{c.fields}</p>
		</article>)}</div>

		<h3 className="sub" id="sfx">音效</h3>
		<p className="dim">22 个音效，都是用代码合成的，没有版权问题。点一下试听。</p>
		<div className="sfx">{sfx.map(([n, u]) => <button key={n} onClick={() => play(n)}><span>▶</span><code>{n}</code><small>{u}</small></button>)}</div>

		<h2 className="section" id="insight">洞察卡视频模板</h2>
		<p className="dim">技能名 <code>song-insight-card-video</code>。把一张小红书 3:4 财经分析卡做成动画：一个主角数字 + 两个最直接的原因，其余压缩。新视频只改 <code>content.ts</code>。</p>
		<section className="hero">
			<div className="hero-player">
				<Player component={InsightVideo} durationInFrames={insightTotal} {...insightSize} initialFrame={60}
					controls clickToPlay style={{...playerStyle, borderRadius: 18}}/>
			</div>
			<div className="hero-text">
				<p className="kicker">完整示例 · 宁德时代 Q3 现金流 · 约 {Math.round(insightTotal / 30)} 秒</p>
				<h2>一个主角数字，两个原因</h2>
				<p>固定四页：封面 → 主角数字 → 两个原因 → 结论。页码和总时长按内容自动算，内容少可以去掉封面或结论。</p>
				<p className="dim">网页里没放背景音乐；实际视频可以在 <code>content.ts</code> 里配 <code>bgm</code>。</p>
			</div>
		</section>
		<h3 className="sub">4 种页面</h3>
		<div className="grid">{insightRanges.map(r => <article key={r.type} className="card">
			<Segment component={InsightVideo} total={insightTotal} from={r.from} frames={r.frames} sz={insightSize}/>
			<h3><code>{r.type}</code> {insightPages[r.type]?.[0]}</h3>
			<p>{insightPages[r.type]?.[1]}</p>
		</article>)}</div>

		<h2 className="section" id="finance">宋的财经模板</h2>
		<p className="dim">技能名 <code>song-finance-video-template</code>。不是一整条视频，而是 5 种固定特效，放进 <code>Sequence</code> 叠在已有的口播视频上，只改文字、数字、图片和出现时间。下面用的是默认示例文案和占位截图。</p>
		<div className="grid">{financeEffects.map((e, i) => <article key={e.name} className="card">
			<Segment component={FinanceDemo} total={financeTotal} from={i * FINANCE_SCENE} frames={FINANCE_SCENE} sz={size}/>
			<h3><code>{e.name}</code> {e.title}</h3>
			<p>{e.use}</p>
			<p className="fields">{e.fields}</p>
		</article>)}</div>
	</>;
}

createRoot(document.getElementById('root')!).render(<App/>);

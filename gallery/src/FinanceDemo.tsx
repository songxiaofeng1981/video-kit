// 宋的财经模板的预览合成：五种特效依次叠在演示口播上，每段 6 秒。
// 照 skills/song-finance-video-template/assets/remotion/SongFinanceDemo.jsx 改的：人物换成玻璃卡模板的演示视频（循环），截图换成占位图。
import React from 'react';
import {AbsoluteFill, Sequence, Video, staticFile} from 'remotion';
import {DataMetricCard, FullscreenScreenshot, KeywordHighlight, NewsPopup, StoryChart} from './finance/SongFinanceEffects';

export const FINANCE_SCENE = 180;
export const financeEffects = [
	{name: 'NewsPopup', title: '新闻截图弹出', use: '引用新闻、公告，关键词划线', fields: 'imageSrc 截图 · paper 报名 · headlineBefore + highlight 标题和划线词 · ticker 快讯'},
	{name: 'DataMetricCard', title: '数据指标卡', use: '一个核心数字 + 递增动画', fields: 'label · value 数字 · prefix / suffix · comparison 对比 · chips 三个辅助标签 · sparkPoints 走势'},
	{name: 'StoryChart', title: '故事图表', use: '历史走势 → 预测，分段生长', fields: 'title · xLabels · historyPath 历史线 · forecastPath / conservativePath 两种预测 · callout'},
	{name: 'KeywordHighlight', title: '重点词三级递进', use: '金句、结论（最满意的一段）', fields: 'eyebrow · setup 铺垫 · keyword 重点词 · note 小字 · accentColor / underlineColor'},
	{name: 'FullscreenScreenshot', title: '截图全屏', use: '证据画面，极缓推进', fields: 'imageSrc 截图 · label · caption · imageFit · backgroundColor'},
] as const;
export const financeTotal = FINANCE_SCENE * financeEffects.length;

export const FinanceDemo: React.FC = () => {
	const image = staticFile('news-placeholder.svg');
	const d = FINANCE_SCENE;
	return (
		<AbsoluteFill style={{backgroundColor: '#04070c'}}>
			<Video src={staticFile('own-demo.mp4')} loop muted style={{width: '100%', height: '100%', objectFit: 'cover'}}/>
			<Sequence from={0} durationInFrames={d}><NewsPopup imageSrc={image} durationInFrames={d}/></Sequence>
			<Sequence from={d} durationInFrames={d}><DataMetricCard durationInFrames={d}/></Sequence>
			<Sequence from={d * 2} durationInFrames={d}><StoryChart durationInFrames={d}/></Sequence>
			<Sequence from={d * 3} durationInFrames={d}><KeywordHighlight durationInFrames={d}/></Sequence>
			<Sequence from={d * 4} durationInFrames={d}><FullscreenScreenshot imageSrc={image} durationInFrames={d}/></Sequence>
		</AbsoluteFill>
	);
};

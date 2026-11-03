import React from 'react';
import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

export const DEFAULT_EFFECT_DURATION = 180;

const DEFAULT_FONT = 'Arial, PingFang SC, Microsoft YaHei, sans-serif';
const INK = '#f7f8fa';
const MUTED = '#aeb8c8';
const GREEN = '#40d39c';
const RED = '#ff5f66';
const GOLD = '#f5c96b';
const PANEL = 'rgba(10, 18, 30, 0.92)';
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'};

const tween = (frame, input, output, easing) =>
  interpolate(frame, input, output, {...clamp, ...(easing ? {easing} : {})});

const DebugLabel = ({index, title, source, fontFamily}) => (
  <div style={{position: 'absolute', top: 46, left: 58, display: 'flex', alignItems: 'center', gap: 16, zIndex: 20, fontFamily}}>
    <div style={{width: 48, height: 48, borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', background: RED, color: '#fff', fontSize: 22, fontWeight: 900}}>
      {String(index).padStart(2, '0')}
    </div>
    <div>
      <div style={{fontSize: 28, fontWeight: 800, letterSpacing: 1}}>{title}</div>
      <div style={{fontSize: 16, color: MUTED, marginTop: 3}}>模板：{source}</div>
    </div>
  </div>
);

const EffectRoot = ({children, durationInFrames = DEFAULT_EFFECT_DURATION, shade = 0.43, showDebugLabel = false, debug}) => {
  const frame = useCurrentFrame();
  const opacity = tween(frame, [0, 10, durationInFrames - 15, durationInFrames], [0, 1, 1, 0]);
  return (
    <AbsoluteFill style={{opacity, color: INK, fontFamily: debug?.fontFamily ?? DEFAULT_FONT}}>
      <AbsoluteFill style={{background: `rgba(4, 9, 17, ${shade})`}} />
      {showDebugLabel && debug ? <DebugLabel {...debug} fontFamily={debug.fontFamily ?? DEFAULT_FONT} /> : null}
      {children}
    </AbsoluteFill>
  );
};

export const NewsPopup = ({
  imageSrc,
  paper = '财经观察',
  date = '今日 · 盘后',
  headlineBefore = '行业需求继续增长，真正需要留意的是',
  highlight = '利润兑现',
  ticker = '资金开始从预期交易转向业绩验证',
  tickerTime = '市场快讯 · 14:42',
  durationInFrames = DEFAULT_EFFECT_DURATION,
  showDebugLabel = false,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = spring({frame: frame - 10, fps, durationInFrames: 24, config: {damping: 18, stiffness: 135, mass: 0.8}});
  const second = spring({frame: frame - 53, fps, durationInFrames: 24, config: {damping: 19, stiffness: 130, mass: 0.8}});
  const underline = tween(frame, [40, 63], [0, 1], Easing.out(Easing.cubic));
  const slowPush = tween(frame, [30, durationInFrames], [1, 1.035]);

  return (
    <EffectRoot durationInFrames={durationInFrames} showDebugLabel={showDebugLabel} debug={{index: 1, title: '新闻截图弹出', source: 'NewsPopup'}}>
      <div style={{position: 'absolute', right: 120, top: 170, width: 850, height: 620, borderRadius: 26, overflow: 'hidden', background: '#fff', color: '#172033', boxShadow: '0 32px 100px rgba(0,0,0,.46)', opacity: enter, transform: `translateY(${interpolate(enter, [0, 1], [90, 0])}px) rotate(${interpolate(enter, [0, 1], [-2.2, -0.5])}deg)`}}>
        <div style={{height: 260, overflow: 'hidden', background: 'linear-gradient(145deg,#f5ece7,#e5d8d2)'}}>
          {imageSrc ? <Img src={imageSrc} style={{width: '100%', height: '100%', objectFit: 'cover', objectPosition: '50% 22%', transform: `scale(${slowPush})`}} /> : null}
        </div>
        <div style={{padding: '28px 38px 32px'}}>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            <span style={{fontSize: 21, fontWeight: 900, letterSpacing: 3}}>{paper}</span>
            <span style={{fontSize: 16, color: '#7e8795'}}>{date}</span>
          </div>
          <div style={{height: 2, background: '#172033', margin: '14px 0 22px'}} />
          <div style={{fontSize: 42, lineHeight: 1.35, fontWeight: 900}}>
            {headlineBefore}{' '}
            <span style={{position: 'relative', display: 'inline-block'}}>
              {highlight}
              <span style={{position: 'absolute', left: -2, right: -2, bottom: 1, height: 8, borderRadius: 8, background: RED, transformOrigin: 'left center', transform: `scaleX(${underline})`, opacity: 0.82}} />
            </span>
          </div>
        </div>
      </div>
      <div style={{position: 'absolute', right: 70, bottom: 105, width: 420, padding: '24px 28px', borderRadius: 20, background: '#fbfbfc', color: '#172033', boxShadow: '0 20px 60px rgba(0,0,0,.36)', opacity: second, transform: `translateX(${interpolate(second, [0, 1], [280, 0])}px) rotate(1.8deg)`}}>
        <div style={{fontSize: 16, color: '#707b8c'}}>{tickerTime}</div>
        <div style={{fontSize: 27, lineHeight: 1.35, fontWeight: 850, marginTop: 10}}>{ticker}</div>
      </div>
    </EffectRoot>
  );
};

const defaultSparkPoints = [[0, 132], [70, 139], [132, 111], [198, 122], [270, 82], [342, 91], [416, 47], [493, 58], [565, 18], [624, 29]];
const pointsToPath = (points) => points.map(([x, y], index) => `${index === 0 ? 'M' : 'L'}${x} ${y}`).join(' ');

export const DataMetricCard = ({
  label = 'Q2 营收同比',
  value = 25,
  prefix = '+',
  suffix = '%',
  comparison = '超市场预期 7pct',
  chips = ['营收 68.4 亿', '毛利率 31.2%', '现金流转正'],
  sparkPoints = defaultSparkPoints,
  accentColor = GREEN,
  durationInFrames = DEFAULT_EFFECT_DURATION,
  showDebugLabel = false,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const cardIn = spring({frame: frame - 8, fps, config: {damping: 18, stiffness: 120}});
  const valueProgress = tween(frame, [26, 84], [0, 1], Easing.out(Easing.cubic));
  const sparkProgress = tween(frame, [48, 116], [0, 1], Easing.inOut(Easing.cubic));
  const currentValue = value * valueProgress;
  const shownValue = valueProgress < 0.98 ? currentValue.toFixed(1) : String(value);
  const path = pointsToPath(sparkPoints);
  const lastPoint = sparkPoints[sparkPoints.length - 1];

  return (
    <EffectRoot durationInFrames={durationInFrames} showDebugLabel={showDebugLabel} debug={{index: 2, title: '数据卡', source: 'DataMetricCard'}}>
      <div style={{position: 'absolute', right: 160, top: 205, width: 720, height: 470, borderRadius: 34, background: PANEL, border: '1px solid rgba(255,255,255,.14)', boxShadow: '0 38px 110px rgba(0,0,0,.55)', overflow: 'hidden', opacity: cardIn, transform: `translateY(${interpolate(cardIn, [0, 1], [65, 0])}px) scale(${interpolate(cardIn, [0, 1], [0.92, 1])})`}}>
        <div style={{position: 'absolute', inset: 0, background: `linear-gradient(140deg, ${accentColor}1c, transparent 55%)`}} />
        <div style={{position: 'relative', padding: '42px 48px'}}>
          <div style={{fontSize: 24, color: MUTED}}>{label}</div>
          <div style={{display: 'flex', alignItems: 'baseline', gap: 16, marginTop: 8}}>
            <span style={{fontSize: 112, lineHeight: 1, fontWeight: 900, color: accentColor, letterSpacing: -5}}>{prefix}{shownValue}{suffix}</span>
            <span style={{fontSize: 21, color: '#d6dce6'}}>{comparison}</span>
          </div>
          <svg width="624" height="180" viewBox="0 0 624 180" style={{marginTop: 32, overflow: 'visible'}}>
            <path d={path} pathLength="1" fill="none" stroke={accentColor} strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="1" strokeDashoffset={1 - sparkProgress} />
            <circle cx={lastPoint[0]} cy={lastPoint[1]} r={7 * sparkProgress} fill={accentColor} />
          </svg>
          <div style={{display: 'flex', gap: 12, marginTop: -16}}>
            {chips.slice(0, 3).map((chip, index) => {
              const p = spring({frame: frame - 88 - index * 8, fps, config: {damping: 20, stiffness: 150}});
              return <div key={`${chip}-${index}`} style={{padding: '10px 15px', borderRadius: 999, background: 'rgba(255,255,255,.08)', color: '#d7dde7', fontSize: 17, opacity: p, transform: `translateY(${(1 - p) * 12}px)`}}>{chip}</div>;
            })}
          </div>
        </div>
      </div>
    </EffectRoot>
  );
};

export const StoryChart = ({
  title = '利润趋势：历史与一致预期',
  subtitle = '单位：亿元 · 示例数据',
  callout = '乐观情景 +42%',
  xLabels = ['2023', '2024', '现在', '2026E'],
  historyPath = 'M100 455 C220 430 270 468 375 385 S560 352 750 305',
  forecastPath = 'M750 305 C875 285 920 220 1015 185 S1160 115 1245 92',
  conservativePath = 'M750 305 C890 300 980 320 1245 282',
  accentColor = RED,
  durationInFrames = DEFAULT_EFFECT_DURATION,
  showDebugLabel = false,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const panelIn = spring({frame: frame - 8, fps, config: {damping: 20, stiffness: 120}});
  const history = tween(frame, [28, 76], [0, 1], Easing.out(Easing.cubic));
  const forecast = tween(frame, [83, 134], [0, 1], Easing.out(Easing.cubic));
  const calloutIn = spring({frame: frame - 118, fps, config: {damping: 14, stiffness: 165}});
  const labelXs = [210, 490, 750, 1010];

  return (
    <EffectRoot shade={0.58} durationInFrames={durationInFrames} showDebugLabel={showDebugLabel} debug={{index: 3, title: '图表展示', source: 'StoryChart'}}>
      <div style={{position: 'absolute', left: 250, right: 250, top: 170, bottom: 105, borderRadius: 30, padding: '40px 52px', background: 'rgba(250,251,253,.96)', color: '#182235', boxShadow: '0 35px 110px rgba(0,0,0,.5)', opacity: panelIn, transform: `scale(${interpolate(panelIn, [0, 1], [0.95, 1])})`}}>
        <div style={{fontSize: 31, fontWeight: 900}}>{title}</div>
        <div style={{fontSize: 17, color: '#788293', marginTop: 7}}>{subtitle}</div>
        <svg width="1300" height="610" viewBox="0 0 1300 610" style={{marginTop: 28}}>
          {[110, 240, 370, 500].map((y) => <line key={y} x1="90" x2="1245" y1={y} y2={y} stroke="#dfe4eb" strokeWidth="2" />)}
          <line x1="750" x2="750" y1="80" y2="510" stroke="#aeb7c3" strokeWidth="2" strokeDasharray="8 10" />
          {xLabels.slice(0, 4).map((label, index) => <text key={`${label}-${index}`} x={labelXs[index]} y="555" fill="#7b8593" fontSize="22" textAnchor="middle">{label}</text>)}
          <path d={historyPath} pathLength="1" fill="none" stroke="#7d8999" strokeWidth="8" strokeLinecap="round" strokeDasharray="1" strokeDashoffset={1 - history} />
          <path d={forecastPath} pathLength="1" fill="none" stroke={accentColor} strokeWidth="10" strokeLinecap="round" strokeDasharray="1" strokeDashoffset={1 - forecast} />
          <path d={conservativePath} pathLength="1" fill="none" stroke="#2d394c" strokeWidth="6" strokeDasharray="17 13" strokeDashoffset={1 - forecast} opacity={forecast} />
          <circle cx="750" cy="305" r={13 * Math.min(history, forecast)} fill="#fff" stroke={accentColor} strokeWidth="7" />
        </svg>
        <div style={{position: 'absolute', right: 48, top: 172, padding: '16px 22px', borderRadius: 16, background: accentColor, color: '#fff', fontSize: 24, fontWeight: 900, opacity: calloutIn, transform: `translateY(${(1 - calloutIn) * 16}px) scale(${0.8 + calloutIn * 0.2})`}}>{callout}</div>
      </div>
    </EffectRoot>
  );
};

export const KeywordHighlight = ({
  eyebrow = '真正影响股价的',
  setup = '不是故事，',
  keyword = '是现金流',
  note = '用一处强强调，代替整屏到处乱动',
  accentColor = GOLD,
  underlineColor = RED,
  align = 'left',
  durationInFrames = DEFAULT_EFFECT_DURATION,
  showDebugLabel = false,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const line1 = spring({frame: frame - 8, fps, config: {damping: 18, stiffness: 120}});
  const line2 = spring({frame: frame - 34, fps, config: {damping: 18, stiffness: 120}});
  const keywordIn = spring({frame: frame - 64, fps, durationInFrames: 28, config: {damping: 11, stiffness: 190, mass: 0.7}});
  const sweep = tween(frame, [82, 112], [0, 1], Easing.out(Easing.cubic));
  const isCenter = align === 'center';

  return (
    <EffectRoot shade={0.68} durationInFrames={durationInFrames} showDebugLabel={showDebugLabel} debug={{index: 4, title: '重点文字', source: 'KeywordHighlight'}}>
      <div style={{position: 'absolute', left: 200, right: 200, top: 260, textAlign: isCenter ? 'center' : 'left'}}>
        <div style={{fontSize: 56, color: '#d2d8e1', fontWeight: 700, opacity: line1, transform: `translateY(${(1 - line1) * 24}px)`}}>{eyebrow}</div>
        <div style={{fontSize: 76, color: '#fff', fontWeight: 900, marginTop: 18, opacity: line2, transform: `translateY(${(1 - line2) * 25}px)`}}>{setup}</div>
        <div style={{position: 'relative', display: 'inline-block', marginTop: 12, fontSize: 150, lineHeight: 1.1, fontWeight: 950, letterSpacing: 2, color: accentColor, opacity: keywordIn, transformOrigin: isCenter ? 'center center' : 'left center', transform: `scale(${interpolate(keywordIn, [0, 0.72, 1], [0.28, 1.16, 1])}) rotate(${interpolate(keywordIn, [0, 1], [-5, 0])}deg)`}}>
          {keyword}
          <span style={{position: 'absolute', height: 18, left: 0, right: 0, bottom: 5, borderRadius: 12, background: underlineColor, opacity: 0.78, transformOrigin: 'left center', transform: `scaleX(${sweep})`}} />
        </div>
        {note ? <div style={{fontSize: 25, color: MUTED, marginTop: 42, letterSpacing: 2, opacity: tween(frame, [112, 132], [0, 1])}}>{note}</div> : null}
      </div>
    </EffectRoot>
  );
};

export const FullscreenScreenshot = ({
  imageSrc,
  label = '证据画面',
  caption = '截图全屏后保持极缓推进，不让静态素材像 PPT',
  imageFit = 'contain',
  backgroundColor = '#f6eee8',
  durationInFrames = DEFAULT_EFFECT_DURATION,
  showDebugLabel = false,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const reveal = tween(frame, [8, 34], [0, 1], Easing.out(Easing.cubic));
  const zoom = tween(frame, [24, durationInFrames], [1, 1.065]);
  const captionIn = spring({frame: frame - 72, fps, config: {damping: 18, stiffness: 120}});

  return (
    <EffectRoot shade={0.18} durationInFrames={durationInFrames} showDebugLabel={showDebugLabel} debug={{index: 5, title: '图片 / 截图全屏切换', source: 'FullscreenScreenshot'}}>
      <AbsoluteFill style={{background: backgroundColor, clipPath: `inset(${interpolate(reveal, [0, 1], [12, 0])}% ${interpolate(reveal, [0, 1], [50, 0])}% ${interpolate(reveal, [0, 1], [12, 0])}% ${interpolate(reveal, [0, 1], [50, 0])}% round ${interpolate(reveal, [0, 1], [36, 0])}px)`}}>
        {imageSrc ? <Img src={imageSrc} style={{width: '100%', height: '100%', objectFit: imageFit, transform: `scale(${zoom})`}} /> : null}
        <div style={{position: 'absolute', inset: 0, boxShadow: 'inset 0 0 140px rgba(22,18,18,.18)'}} />
      </AbsoluteFill>
      <div style={{position: 'absolute', left: 90, bottom: 62, maxWidth: 760, padding: '22px 28px', borderRadius: 20, background: 'rgba(8,14,24,.9)', boxShadow: '0 20px 55px rgba(0,0,0,.35)', opacity: captionIn, transform: `translateY(${(1 - captionIn) * 28}px)`}}>
        <div style={{fontSize: 20, color: RED, fontWeight: 800, letterSpacing: 2}}>{label}</div>
        <div style={{fontSize: 34, fontWeight: 850, marginTop: 7}}>{caption}</div>
      </div>
    </EffectRoot>
  );
};

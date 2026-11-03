import React from 'react';
import {AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {clamp, enter, pageFade} from './animation';
import {illustrations} from './illustrations';
import {colors, fontSans} from './theme';
import type {CausesPage as CausesData, CoverPage as CoverData, Focus, HeroPage as HeroData, PointsPage as PointsData, Tone} from './types';
import {CardShell, Eyebrow, Footer, PointItem, Rich} from './ui';

export type PageProps<T> = {data: T; duration: number; pageLabel: string};

const PageFrame: React.FC<React.PropsWithChildren<{duration: number}>> = ({children, duration}) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{
      background: colors.page,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      opacity: pageFade(frame, duration),
      fontFamily: fontSans,
    }}>
      {children}
    </AbsoluteFill>
  );
};

const tones: Record<Tone, {accent: string; soft: string; shadow: string}> = {
  accent: {accent: colors.accentDark, soft: colors.accentSoft, shadow: colors.accentShadow},
  accent2: {accent: colors.accent2, soft: colors.accent2Soft, shadow: colors.accent2Shadow},
};

const formatNumber = (n: number, decimals = 0) =>
  n.toLocaleString('en-US', {minimumFractionDigits: decimals, maximumFractionDigits: decimals});

// ───────────── 封面 ─────────────

export const CoverPage: React.FC<PageProps<CoverData>> = ({data, duration}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const Illustration = data.illustration ? illustrations[data.illustration] : undefined;

  return (
    <PageFrame duration={duration}>
      <CardShell style={Illustration ? undefined : {justifyContent: 'center', gap: 150}}>
        <div style={enter(frame, fps, 0)}>
          <Eyebrow>{data.eyebrow}</Eyebrow>
          <div style={{fontSize: 92, fontWeight: 900, lineHeight: 1.12, color: colors.title, letterSpacing: '0.02em', marginBottom: 12}}>
            {data.title}
          </div>
          {data.subtitle && (
            <div style={{fontSize: 60, fontWeight: 900, lineHeight: 1.25, color: colors.title}}>{data.subtitle}</div>
          )}
        </div>

        {Illustration && (
          <div style={{width: 470, height: 390, margin: '30px 0 18px', ...enter(frame, fps, 12)}}>
            <Illustration/>
          </div>
        )}

        <div style={{...enter(frame, fps, 24), width: '100%'}}>
          {data.lead && (
            <div style={{fontSize: 42, fontWeight: 800, color: colors.ink, marginBottom: 28}}>{data.lead}</div>
          )}
          {data.body && (
            <div style={{fontSize: 31, fontWeight: 500, color: colors.gray, lineHeight: 1.68, marginBottom: 34}}>
              <Rich text={data.body}/>
            </div>
          )}
          {data.cta && (
            <div style={{display: 'inline-flex', alignItems: 'center', gap: 12, fontSize: 31, fontWeight: 800}}>
              <span style={{color: colors.accent, fontSize: 36}}>↓</span>
              {data.cta}
            </div>
          )}
        </div>
      </CardShell>
    </PageFrame>
  );
};

// ───────────── 主角数字页 ─────────────
// 节奏：小指标铺垫 → 主角砸出来并计数 → 盖章 → 公式拆解 → 结论

const HERO_IN = 28;
const OPS = new Set(['+', '−', '-', '×', '÷', '=']);

const HeroMetric: React.FC<{hero: HeroData['hero']}> = ({hero}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const slam = spring({frame: frame - HERO_IN, fps, config: {damping: 10, stiffness: 160, mass: 0.8}});
  const shake = frame >= HERO_IN + 6 && frame < HERO_IN + 16 ? Math.sin((frame - HERO_IN) * 2.4) * (HERO_IN + 16 - frame) * 0.9 : 0;
  const value = interpolate(frame, [HERO_IN + 4, HERO_IN + 30], [0, hero.value], {...clamp, easing: Easing.out(Easing.cubic)});
  const formula = (i: number) => interpolate(frame, [HERO_IN + 34 + i * 7, HERO_IN + 42 + i * 7], [0, 1], clamp);
  const stamp = spring({frame: frame - (HERO_IN + 30), fps, config: {damping: 9, stiffness: 180, mass: 0.6}});
  const pulse = frame > HERO_IN + 30 ? 0.5 + 0.5 * Math.sin((frame - HERO_IN - 30) / 6) : 0;
  const parts = hero.formula ?? [];
  const chip: React.CSSProperties = {background: '#fff', border: `3px solid ${colors.ink}`, borderRadius: 12, padding: '6px 14px'};

  return (
    <div style={{
      position: 'relative', textAlign: 'left', borderRadius: 26,
      background: colors.accentSoft, border: `5px solid ${colors.ink}`,
      padding: '26px 32px 24px',
      opacity: interpolate(frame, [HERO_IN, HERO_IN + 5], [0, 1], clamp),
      transform: `translateX(${shake}px) scale(${interpolate(slam, [0, 1], [1.35, 1])})`,
      boxShadow: `0 12px 0 ${colors.ink}, 0 0 0 ${8 + pulse * 10}px ${colors.accent}${Math.round(25 + pulse * 30).toString(16)}`,
    }}>
      <div style={{fontSize: 30, fontWeight: 800, color: colors.ink}}>
        {hero.label} {hero.sublabel && <span style={{color: colors.gray, fontWeight: 700}}>{hero.sublabel}</span>}
      </div>
      <div style={{fontSize: 150, fontWeight: 900, color: colors.accentDark, lineHeight: 1.05, letterSpacing: '-0.02em', fontVariantNumeric: 'tabular-nums'}}>
        {formatNumber(value, hero.decimals)}{hero.unit && <span style={{fontSize: 64, marginLeft: 6}}>{hero.unit}</span>}
      </div>

      {parts.length > 0 && (
        <div style={{display: 'flex', alignItems: 'center', gap: 12, marginTop: 12, fontSize: 26, fontWeight: 800, color: colors.ink, whiteSpace: 'nowrap'}}>
          {parts.map((part, i) => {
            const last = i === parts.length - 1;
            const el = OPS.has(part)
              ? <span style={{fontSize: 40, color: colors.accentDark}}>{part}</span>
              : <span style={last ? {...chip, background: colors.accentDark, color: '#fff', border: 'none'} : chip}>{part}</span>;
            return (
              <span key={i} style={{opacity: formula(i), transform: `translateY(${(1 - formula(i)) * 14}px)`, display: 'inline-block'}}>{el}</span>
            );
          })}
        </div>
      )}

      {hero.stamp && (
        <div style={{
          position: 'absolute', right: 34, top: -30,
          border: `5px solid ${colors.accentDark}`, color: colors.accentDark, borderRadius: 12,
          padding: '6px 16px', fontSize: 40, fontWeight: 900, background: '#ffffffd9',
          transform: `rotate(-10deg) scale(${interpolate(stamp, [0, 1], [2, 1])})`,
          opacity: interpolate(frame, [HERO_IN + 30, HERO_IN + 34], [0, 1], clamp),
        }}>{hero.stamp}</div>
      )}
    </div>
  );
};

export const HeroPage: React.FC<PageProps<HeroData>> = ({data, duration, pageLabel}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  // 主角出场时小指标压暗，让视线集中
  const dim = interpolate(frame, [HERO_IN, HERO_IN + 8], [1, 0.5], clamp);

  return (
    <PageFrame duration={duration}>
      <CardShell style={{padding: '70px 60px 56px'}}>
        <div style={{width: '100%', ...enter(frame, fps, 0)}}>
          <Eyebrow>{data.eyebrow}</Eyebrow>
          <div style={{fontSize: 54, fontWeight: 900, lineHeight: 1.26, color: colors.title}}>
            <Rich text={data.title}/>
          </div>
        </div>

        <div style={{width: '100%', display: 'flex', flexDirection: 'column', gap: 30, margin: '26px 0'}}>
          <div style={{display: 'grid', gridTemplateColumns: `repeat(${data.stats.length}, 1fr)`, gap: 14, width: '100%'}}>
            {data.stats.map((item, i) => {
              const e = enter(frame, fps, 8 + i * 5);
              return (
                <div key={item.label} style={{
                  background: colors.box, border: `3px solid ${colors.ink}`, borderRadius: 18,
                  padding: '18px 18px', textAlign: 'left', ...e, opacity: Math.min(e.opacity, dim),
                }}>
                  <div style={{fontSize: 20, fontWeight: 700, color: colors.gray, marginBottom: 6}}>{item.label}</div>
                  <div style={{fontSize: 40, fontWeight: 900, color: colors.ink, lineHeight: 1.1}}>{item.value}</div>
                  {item.note && <div style={{fontSize: 18, fontWeight: 700, color: colors.ink, marginTop: 8}}>{item.note}</div>}
                </div>
              );
            })}
          </div>

          <HeroMetric hero={data.hero}/>

          {data.point && (
            <div style={enter(frame, fps, HERO_IN + 62)}>
              <PointItem badge={data.point.badge} title={data.point.title}><Rich text={data.point.body}/></PointItem>
            </div>
          )}
        </div>

        <div style={{width: '100%', ...enter(frame, fps, HERO_IN + 72)}}>
          <Footer text={data.footer} page={pageLabel}/>
        </div>
      </CardShell>
    </PageFrame>
  );
};

// ───────────── 两个原因聚焦页 ─────────────
// 节奏：原因1聚焦 → 原因2聚焦(原因1压暗) → 两个都亮 + 其余原因压缩出场

const spotTimes = (duration: number) => ({
  first: Math.round(duration * 0.067),
  second: Math.round(duration * 0.39),
  end: Math.round(duration * 0.71),
});

const CoinLane: React.FC<{accent: string; slow: boolean; start: number; token: string}> = ({accent, slow, start, token}) => {
  const frame = useCurrentFrame();
  const t = Math.max(0, frame - start - 8);
  const count = slow ? 3 : 5;
  // fast：钱快速、密集地流出；slow：钱稀疏、慢吞吞地流动
  const period = slow ? 75 : 26;
  const laneOpacity = interpolate(frame, [start + 6, start + 16], [0, 1], clamp);
  return (
    <div style={{flex: 1, position: 'relative', height: 44, opacity: laneOpacity}}>
      <div style={{position: 'absolute', left: 0, right: 0, top: 20, height: 4, borderRadius: 2, background: `${accent}2E`}}/>
      <div style={{position: 'absolute', right: -6, top: 4, fontSize: 30, fontWeight: 900, color: accent}}>›</div>
      {Array.from({length: count}).map((_, i) => {
        const p = ((t / period) + i / count) % 1;
        const fade = interpolate(p, [0, 0.12, 0.85, 1], [0, 1, 1, 0]);
        return (
          <div key={i} style={{
            position: 'absolute', top: 6, left: `${p * 92}%`,
            width: 32, height: 32, borderRadius: '50%', background: accent,
            color: '#fff', fontSize: 18, fontWeight: 900,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            opacity: t > 0 ? fade : 0,
          }}>{token}</div>
        );
      })}
    </div>
  );
};

const CauseFocus: React.FC<{focus: Focus; start: number; end: number; dimDuring?: [number, number]}> = ({focus, start, end, dimDuring}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const {accent, soft, shadow} = tones[focus.tone];

  const inSpot = frame >= start && frame < end;
  const dim = dimDuring
    ? interpolate(frame, [dimDuring[0] - 4, dimDuring[0] + 6, dimDuring[1] - 6, dimDuring[1] + 4], [1, 0.42, 0.42, 1], clamp)
    : 1;
  const pop = spring({frame: frame - start, fps, config: {damping: 11, stiffness: 140, mass: 0.7}});
  const scale = interpolate(frame, [start, start + 10, end - 6, end + 4], [0.96, 1.025, 1.025, 1], clamp);
  const count = interpolate(frame, [start + 8, start + 34], [0, focus.stat.value], {...clamp, easing: Easing.out(Easing.cubic)});
  const stampIn = spring({frame: frame - (start + 30), fps, config: {damping: 9, stiffness: 180, mass: 0.6}});
  const marker = interpolate(frame, [start + 12, start + 26], [0, 100], clamp);
  const glow = inSpot ? 0.5 + 0.5 * Math.sin((frame - start) / 5) : 0;
  const e = enter(frame, fps, start);

  return (
    <div style={{
      opacity: Math.min(e.opacity, dim),
      transform: `${e.transform} scale(${scale})`,
      position: 'relative', textAlign: 'left', borderRadius: 24,
      padding: '22px 28px 20px', border: `4px solid ${accent}`,
      background: soft,
      boxShadow: inSpot
        ? `0 10px 0 ${shadow}, 0 0 0 ${6 + glow * 8}px ${accent}${Math.round(20 + glow * 25).toString(16)}`
        : `0 8px 0 ${shadow}`,
    }}>
      <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
        <div style={{position: 'relative', fontSize: 52, lineHeight: 1.15, fontWeight: 900, color: colors.ink}}>
          <div style={{
            position: 'absolute', left: -6, bottom: 4, height: 22, width: `calc(${marker}% + 12px)`,
            background: `${accent}55`, borderRadius: 6,
          }}/>
          <span style={{position: 'relative'}}>{focus.title}</span>
        </div>
        <div style={{fontSize: 24, fontWeight: 800, color: accent, letterSpacing: '0.04em'}}>{focus.tag}</div>
      </div>

      <div style={{display: 'flex', alignItems: 'center', gap: 16, margin: '14px 0 6px', fontSize: 25, fontWeight: 800, color: colors.ink}}>
        <span style={{whiteSpace: 'nowrap'}}>{focus.from}</span>
        <div style={{flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
          <div style={{fontSize: 22, color: accent, marginBottom: 2}}>
            {focus.speed === 'slow' ? '⏳ ' : '⚡ '}{focus.flowLabel}
          </div>
          <div style={{width: '100%', display: 'flex'}}>
            <CoinLane accent={accent} slow={focus.speed === 'slow'} start={start} token={focus.token ?? '¥'}/>
          </div>
        </div>
        <span style={{whiteSpace: 'nowrap'}}>{focus.to}</span>
      </div>

      <div style={{display: 'flex', alignItems: 'flex-end', gap: 22, margin: '6px 0 10px'}}>
        <div>
          <div style={{fontSize: 22, fontWeight: 700, color: colors.gray}}>{focus.stat.label}</div>
          <div style={{fontSize: 74, fontWeight: 900, color: accent, lineHeight: 1, fontVariantNumeric: 'tabular-nums'}}>
            {formatNumber(count, focus.stat.decimals)}<span style={{fontSize: 34, marginLeft: 4}}>{focus.stat.unit}</span>
          </div>
        </div>
        <div style={{
          fontSize: 40, fontWeight: 900, color: '#fff', background: accent,
          borderRadius: 14, padding: '4px 14px', marginBottom: 6,
          transform: `scale(${interpolate(pop, [0, 1], [0.6, 1])})`,
          opacity: interpolate(frame, [start + 20, start + 26], [0, 1], clamp),
        }}>{focus.stat.delta}</div>
        {focus.side && (
          <div style={{marginLeft: 'auto', textAlign: 'right', marginBottom: 6}}>
            <div style={{fontSize: 20, fontWeight: 700, color: colors.gray}}>{focus.side.label}</div>
            <div style={{fontSize: 30, fontWeight: 900, color: colors.ink}}>{focus.side.value}</div>
          </div>
        )}
      </div>

      <div style={{fontSize: 22, lineHeight: 1.45, fontWeight: 500, color: colors.body}}><Rich text={focus.body}/></div>

      {focus.stamp && (
        <div style={{
          position: 'absolute', right: 190, top: -24,
          border: `4px solid ${accent}`, color: accent, borderRadius: 10,
          padding: '4px 12px', fontSize: 26, fontWeight: 900, background: '#ffffffcc',
          transform: `rotate(-8deg) scale(${interpolate(stampIn, [0, 1], [1.8, 1])})`,
          opacity: interpolate(frame, [start + 30, start + 34], [0, 1], clamp),
        }}>{focus.stamp}</div>
      )}
    </div>
  );
};

export const CausesPage: React.FC<PageProps<CausesData>> = ({data, duration, pageLabel}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = spotTimes(duration);
  const extras = data.extras ?? [];

  return (
    <PageFrame duration={duration}>
      <CardShell style={{height: 1260, padding: '50px 56px 42px'}}>
        <div style={{width: '100%', ...enter(frame, fps, 0)}}>
          <Eyebrow>{data.eyebrow}</Eyebrow>
          <div style={{fontSize: 48, fontWeight: 900, lineHeight: 1.22, color: colors.title}}>
            <Rich text={data.title}/>
          </div>
        </div>

        <div style={{width: '100%', display: 'flex', flexDirection: 'column', gap: 22, margin: '18px 0'}}>
          <CauseFocus focus={data.focus[0]} start={t.first} end={t.second} dimDuring={[t.second, t.end]}/>
          <CauseFocus focus={data.focus[1]} start={t.second} end={t.end}/>
          {extras.length > 0 && (
            <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14}}>
              {extras.map((row, i) => (
                <div key={row.title} style={{...enter(frame, fps, t.end + i * 5), textAlign: 'left', background: colors.box, border: `3px solid ${colors.ink}`, borderRadius: 18, padding: '16px 18px'}}>
                  <div style={{fontSize: 22, fontWeight: 800, color: colors.ink, marginBottom: 6}}>
                    <span style={{color: colors.accent, marginRight: 6}}>+{i + 3}</span>{row.title}
                  </div>
                  <div style={{fontSize: 19, color: colors.body, lineHeight: 1.45, fontWeight: 500}}><Rich text={row.body}/></div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{width: '100%', ...enter(frame, fps, t.end + 12)}}>
          <Footer text={data.footer} page={pageLabel}/>
        </div>
      </CardShell>
    </PageFrame>
  );
};

// ───────────── 要点页（结论 / 验证锚点）─────────────

export const PointsPage: React.FC<PageProps<PointsData>> = ({data, duration, pageLabel}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  return (
    <PageFrame duration={duration}>
      <CardShell>
        <div style={{width: '100%', ...enter(frame, fps, 0)}}>
          <Eyebrow>{data.eyebrow}</Eyebrow>
          <div style={{fontSize: 57, fontWeight: 900, lineHeight: 1.28, color: colors.title}}>
            <Rich text={data.title}/>
          </div>
        </div>

        <div style={{width: '100%', display: 'flex', flexDirection: 'column', gap: 19, margin: '32px 0'}}>
          {data.items.map((item, i) => (
            <div key={item.title} style={enter(frame, fps, 12 + i * 14)}>
              <PointItem badge={item.badge} title={item.title} highlighted={item.highlighted}>
                <Rich text={item.body}/>
              </PointItem>
            </div>
          ))}
        </div>

        <div style={{width: '100%', ...enter(frame, fps, 55)}}>
          <Footer text={data.footer} page={pageLabel}/>
        </div>
      </CardShell>
    </PageFrame>
  );
};

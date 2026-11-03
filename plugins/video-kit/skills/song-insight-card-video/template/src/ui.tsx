import React from 'react';
import {colors, fontSans, fontSerif} from './theme';

export const CardShell: React.FC<React.PropsWithChildren<{style?: React.CSSProperties}>> = ({children, style}) => (
  <div
    style={{
      width: 940,
      minHeight: 1260,
      background: colors.card,
      borderRadius: 28,
      boxShadow: '0 18px 48px rgba(0,0,0,0.06)',
      padding: '86px 70px 72px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      alignItems: 'center',
      textAlign: 'center',
      boxSizing: 'border-box',
      ...style,
    }}
  >
    {children}
  </div>
);

export const Eyebrow: React.FC<React.PropsWithChildren> = ({children}) => (
  <div style={{
    fontFamily: fontSerif,
    fontSize: 27,
    color: colors.accentMuted,
    letterSpacing: '0.28em',
    textTransform: 'uppercase',
    fontWeight: 400,
    marginBottom: 22,
    paddingLeft: '0.28em',
  }}>
    {children}
  </div>
);

export const Footer: React.FC<{text: string; page: string}> = ({text, page}) => (
  <div style={{
    width: '100%',
    paddingTop: 24,
    borderTop: `4px solid ${colors.ink}`,
    fontSize: 24,
    fontWeight: 800,
    color: colors.ink,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    fontFamily: fontSans,
    gap: 24,
  }}>
    <span>{text}</span>
    <span style={{
      fontFamily: fontSerif,
      fontSize: 21,
      color: colors.accentMuted,
      letterSpacing: '0.1em',
      whiteSpace: 'nowrap',
    }}>{page}</span>
  </div>
);

export const PointItem: React.FC<{
  badge: string;
  title: string;
  children: React.ReactNode;
  highlighted?: boolean;
}> = ({badge, title, children, highlighted}) => (
  <div style={{
    display: 'flex',
    alignItems: 'flex-start',
    gap: 22,
    padding: '24px 26px',
    background: highlighted ? colors.accentSoft : colors.box,
    border: `3px solid ${colors.ink}`,
    borderRadius: 20,
    fontFamily: fontSans,
  }}>
    <div style={{
      width: 46,
      height: 46,
      borderRadius: '50%',
      background: colors.accent,
      border: `3px solid ${colors.ink}`,
      color: '#fff',
      fontWeight: 900,
      fontSize: 23,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
      marginTop: 2,
    }}>{badge}</div>
    <div style={{textAlign: 'left'}}>
      <div style={{fontSize: 28, fontWeight: 800, color: colors.ink, marginBottom: 8}}>
        {title}
      </div>
      <div style={{fontSize: 23, color: colors.body, lineHeight: 1.52, fontWeight: 500}}>
        {children}
      </div>
    </div>
  </div>
);

export const Em: React.FC<React.PropsWithChildren> = ({children}) => (
  <span style={{color: colors.accentDark, fontWeight: 800}}>{children}</span>
);

// 文案标记：**重点** → 主强调色加粗；\n → 换行。content.ts 只写纯字符串
export const Rich: React.FC<{text: string}> = ({text}) => (
  <>
    {text.split('\n').map((line, i) => (
      <React.Fragment key={i}>
        {i > 0 && <br/>}
        {line.split(/\*\*(.+?)\*\*/g).map((part, j) => (j % 2 ? <Em key={j}>{part}</Em> : part))}
      </React.Fragment>
    ))}
  </>
);

import {content} from './content';
import type {Theme} from './types';

// 默认配色（紫 + 橙）。content.ts 写了 theme 时，由那几个基色推导出全套
const defaults = {
  page: '#F2F0F5',
  card: '#FDFDFB',
  ink: '#111111',
  title: '#0D0D0D',
  body: '#4A4A4A',
  gray: '#595959',
  box: '#F7F5FA',
  accent: '#9273C8', // 徽章、箭头、光晕
  accentDark: '#7B52AB', // 主角数字、**重点**、原因1
  accentMuted: '#8C73B9', // 页眉小字、页码
  accentSoft: '#EDE7F6',
  accentShadow: '#D5C4EB',
  accent2: '#B5602A', // 原因2
  accent2Soft: '#FFF1E3',
  accent2Shadow: '#EBC7A6',
};

const hex6 = (c: string) => {
  const h = c.replace('#', '');
  return '#' + (h.length === 3 ? h.split('').map((x) => x + x).join('') : h.slice(0, 6)).toUpperCase();
};

// a 占 w，b 占 1-w
const mix = (a: string, b: string, w: number) => {
  const [x, y] = [hex6(a), hex6(b)];
  const ch = (s: string, i: number) => parseInt(s.slice(1 + i * 2, 3 + i * 2), 16);
  return '#' + [0, 1, 2].map((i) => Math.round(ch(x, i) * w + ch(y, i) * (1 - w)).toString(16).padStart(2, '0')).join('').toUpperCase();
};

const derive = (t: Theme): Partial<typeof defaults> => {
  const card = t.card ? hex6(t.card) : defaults.card;
  const ink = t.ink ? hex6(t.ink) : defaults.ink;
  const out: Partial<typeof defaults> = {};
  if (t.page) out.page = hex6(t.page);
  if (t.card) out.card = card;
  if (t.ink) Object.assign(out, {ink, title: ink, body: mix(ink, card, 0.76), gray: mix(ink, card, 0.68)});
  if (t.accent) {
    const a = hex6(t.accent);
    const dark = t.accentDark ? hex6(t.accentDark) : mix(a, ink, 0.78);
    Object.assign(out, {
      accent: a, accentDark: dark, accentMuted: a,
      accentSoft: mix(a, card, 0.13), accentShadow: mix(a, card, 0.38), box: mix(a, card, 0.05),
    });
  }
  if (t.accent2) {
    const b = hex6(t.accent2);
    Object.assign(out, {accent2: b, accent2Soft: mix(b, card, 0.1), accent2Shadow: mix(b, card, 0.38)});
  }
  return out;
};

export const colors = {...defaults, ...derive(content.theme ?? {})};

export const fontSans =
  '-apple-system, BlinkMacSystemFont, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Noto Sans CJK SC", sans-serif';

export const fontSerif = '"Georgia", "Times New Roman", Times, serif';

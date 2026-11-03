// 内容结构：每个新视频只改 content.ts，不改组件
// 文案字符串里 **重点** 会变主强调色加粗，\n 换行

export type Tone = 'accent' | 'accent2'; // 原因1用 accent，原因2用 accent2

// 配色：照抄源 HTML 的颜色（6 位 hex）。整个不写 = 默认紫/橙；只写部分 = 其余用默认
export type Theme = {
  page?: string; // 画布背景
  card?: string; // 卡片底色
  ink?: string; // 正文与描边
  accent?: string; // 主强调色：主角数字、原因1、**重点**
  accentDark?: string; // 可选：accent 在浅底上当小字太浅时手动给深一号；不写则自动加深
  accent2?: string; // 第二强调色：原因2
};

export type CoverPage = {
  type: 'cover';
  seconds: number;
  eyebrow: string;
  title: string;
  subtitle?: string;
  illustration?: string; // illustrations.tsx 中的键；不写则不显示插图
  lead?: string;
  body?: string;
  cta?: string;
};

export type HeroPage = {
  type: 'hero';
  seconds: number;
  eyebrow: string;
  title: string;
  // 铺垫用的小指标，出场后在主角登场时压暗；建议 3 个
  stats: {label: string; value: string; note?: string}[];
  hero: {
    label: string; // 如 'Q3 自由现金流'
    sublabel?: string; // 如 '(FCF)'
    value: number; // 计数终点，负数也行
    decimals?: number;
    unit?: string;
    stamp?: string; // 盖章文字，如 '转负！'
    // 公式拆解：单个运算符(+ − × ÷ =)按符号显示，最后一项高亮
    formula?: string[];
  };
  point?: {badge: string; title: string; body: string};
  footer: string;
};

export type Focus = {
  tone: Tone;
  tag: string; // 右上角小标，如 '01 / 付钱'
  title: string; // 如 '上游：占款少了'
  from: string;
  to: string;
  flowLabel: string; // 钱流说明，如 '钱付出去更早'
  speed: 'fast' | 'slow'; // fast=快速、密集地流动；slow=稀疏、慢吞吞地流动
  token?: string; // 流动的符号，默认 '¥'；股价下跌可用 '↓'，人流用 '人' 等，1 个字符
  stat: {label: string; value: number; decimals?: number; unit: string; delta: string};
  side?: {label: string; value: string};
  stamp?: string;
  body: string;
};

export type CausesPage = {
  type: 'causes';
  seconds: number; // 建议 6 秒：两个原因各自聚焦一次
  eyebrow: string;
  title: string;
  focus: [Focus, Focus];
  // 其余原因：压缩成两列小格，不展开
  extras?: {title: string; body: string}[];
  footer: string;
};

export type PointsPage = {
  type: 'points';
  seconds: number;
  eyebrow: string;
  title: string;
  items: {badge: string; title: string; body: string; highlighted?: boolean}[];
  footer: string;
};

export type Page = CoverPage | HeroPage | CausesPage | PointsPage;

export type VideoContent = {
  id: string; // Composition id，只能用字母数字和 -
  bgm?: string; // public/ 下的文件名，先用 scripts/prepare-bgm.sh 处理
  theme?: Theme;
  pages: Page[];
};

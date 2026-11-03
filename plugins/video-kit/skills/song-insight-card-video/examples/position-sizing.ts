import type {VideoContent} from './types';

// 来源：投资最重要的是分仓位.video.html（由 import-slots.sh 生成）
export const content: VideoContent = {
  "id": "Position-Sizing",
  "theme": {
    "page": "#f3eedf",
    "card": "#fbfaf2",
    "ink": "#06142d",
    "accent": "#a98743",
    "accent2": "#a4452c"
  },
  "pages": [
    {
      "type": "cover",
      "seconds": 4,
      "eyebrow": "POSITION INSIGHT",
      "title": "分仓位才是开悟",
      "subtitle": "不是押中一只票",
      "lead": "你以为看得准，就该全部压上？",
      "body": "再强的确定性，也要给自己留余地\n判断错误、市场失控、情绪崩溃，总有一个会来",
      "cta": "往下滑，买之前先问自己一个问题"
    },
    {
      "type": "hero",
      "seconds": 5,
      "eyebrow": "01 / THE STANDARD",
      "title": "无论多看好一只股票\n买之前先做一个假设",
      "stats": [
        {
          "label": "五粮液博主",
          "value": "100→70",
          "note": "越跌越买"
        },
        {
          "label": "单票+杠杆",
          "value": "60→20",
          "note": "高位连续杀跌"
        },
        {
          "label": "好公司也会",
          "value": "先跌一半",
          "note": "逻辑再强也一样"
        }
      ],
      "hero": {
        "label": "如果它从这里跌",
        "value": -50,
        "decimals": 0,
        "unit": "%",
        "stamp": "拿得住？",
        "formula": [
          "假设跌50%",
          "+",
          "拿不住",
          "=",
          "仓位太大了"
        ]
      },
      "point": {
        "badge": "!",
        "title": "反差核心：看好 ≠ 押上全部身家",
        "body": "如果答案是不行，**不是股票一定有问题**，而是你的仓位太大了。"
      },
      "footer": "先问能不能扛住 -50%，再决定买多少"
    },
    {
      "type": "causes",
      "seconds": 6,
      "eyebrow": "02 / WHY IT MATTERS",
      "title": "为什么一定要留余地？跌起来没有底",
      "focus": [
        {
          "tone": "accent",
          "tag": "01 / 五粮液",
          "title": "越跌越买",
          "from": "100元",
          "to": "70元",
          "flowLabel": "跌了继续买",
          "speed": "slow",
          "token": "↓",
          "stat": {
            "label": "股价",
            "value": 70,
            "unit": "元",
            "delta": "-30%"
          },
          "side": {
            "label": "加仓钱",
            "value": "送外卖挣的"
          },
          "stamp": "被观点绑死",
          "body": "坚持到底了，**市场也不会停止下跌**。"
        },
        {
          "tone": "accent2",
          "tag": "02 / 单票",
          "title": "单票加杠杆",
          "from": "60元",
          "to": "20元",
          "flowLabel": "高位连续杀跌",
          "speed": "fast",
          "token": "↓",
          "stat": {
            "label": "股价",
            "value": 20,
            "unit": "元",
            "delta": "-67%"
          },
          "side": {
            "label": "叠加",
            "value": "贷款杠杆"
          },
          "stamp": "变成赌博",
          "body": "不是等逻辑兑现，而是**赌能不能活到那天**。"
        }
      ],
      "extras": [
        {
          "title": "看好 ≠ 全部身家压上去",
          "body": "再好的公司，**股价也可能先跌一半**。"
        },
        {
          "title": "巴菲特的集中 ≠ 只剩一只票",
          "body": "重仓可以，**但不能逼到没有退路**。"
        }
      ],
      "footer": "仓位把人和观点绑死，投资就变成了赌博"
    },
    {
      "type": "points",
      "seconds": 4,
      "eyebrow": "03 / MY RULE",
      "title": "仓位不是表达信仰\n而是管理错误",
      "items": [
        {
          "badge": "✓",
          "title": "承认看不准市场情绪",
          "body": "看得再好，**市场情绪也无法精确把握**，判断错误是常态。"
        },
        {
          "badge": "!",
          "title": "扛不住 -50%，就降仓位",
          "body": "承受不了 **50% 的单票回撤**，就把仓位降到你承受得了的位置。",
          "highlighted": true
        },
        {
          "badge": "→",
          "title": "给自己留下继续判断的空间",
          "body": "判断错了，你还有**时间、现金和心理空间**，不会被市场强迫出局。"
        }
      ],
      "footer": "投资笔记 · 2026.10.20"
    }
  ]
};

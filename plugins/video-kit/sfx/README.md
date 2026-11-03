# 音效

22 个短音效，用代码合成，没有版权问题。试听：https://songxiaofeng1981.github.io/video-kit/#sfx

在 Remotion 项目里用：把需要的 wav 复制到项目的 `public/sfx/`，然后

```tsx
import {Audio, Sequence, staticFile} from 'remotion';
<Sequence from={45}><Audio src={staticFile('sfx/pop.wav')} volume={0.6}/></Sequence>
```

音效比动效更要克制：只在需要引导注意力的地方加（柱子升起、数字定格、切回真人），口播类视频最重要的是人声。

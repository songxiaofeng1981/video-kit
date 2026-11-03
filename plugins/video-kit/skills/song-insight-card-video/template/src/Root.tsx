import React from 'react';
import {Composition} from 'remotion';
import {content} from './content';
import {FPS, InsightVideo, totalFrames} from './Video';

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id={content.id}
      component={InsightVideo}
      durationInFrames={totalFrames}
      fps={FPS}
      width={1080}
      height={1440}
      defaultProps={{}}
    />
  );
};

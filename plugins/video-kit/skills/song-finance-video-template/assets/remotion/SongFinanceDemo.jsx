import React from 'react';
import {AbsoluteFill, OffthreadVideo, Sequence, staticFile, useVideoConfig} from 'remotion';
import {
  DataMetricCard,
  FullscreenScreenshot,
  KeywordHighlight,
  NewsPopup,
  StoryChart,
} from './SongFinanceEffects';

// Copy this file only when an effects gallery is useful.
// Replace talking.mp4 and image.jpg with files from the target project's public/ folder.
export const SongFinanceDemo = () => {
  const {fps} = useVideoConfig();
  const sceneFrames = 6 * fps;
  const imageSrc = staticFile('image.jpg');

  return (
    <AbsoluteFill style={{backgroundColor: '#04070c'}}>
      <OffthreadVideo src={staticFile('talking.mp4')} volume={0.82} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
      <Sequence from={0} durationInFrames={sceneFrames}>
        <NewsPopup imageSrc={imageSrc} durationInFrames={sceneFrames} showDebugLabel />
      </Sequence>
      <Sequence from={sceneFrames} durationInFrames={sceneFrames}>
        <DataMetricCard durationInFrames={sceneFrames} showDebugLabel />
      </Sequence>
      <Sequence from={sceneFrames * 2} durationInFrames={sceneFrames}>
        <StoryChart durationInFrames={sceneFrames} showDebugLabel />
      </Sequence>
      <Sequence from={sceneFrames * 3} durationInFrames={sceneFrames}>
        <KeywordHighlight durationInFrames={sceneFrames} showDebugLabel />
      </Sequence>
      <Sequence from={sceneFrames * 4} durationInFrames={sceneFrames}>
        <FullscreenScreenshot imageSrc={imageSrc} durationInFrames={sceneFrames} showDebugLabel />
      </Sequence>
    </AbsoluteFill>
  );
};

import React from 'react';
import {AbsoluteFill, Audio, Series, interpolate, staticFile, useVideoConfig} from 'remotion';
import {clamp} from './animation';
import {content} from './content';
import {CausesPage, CoverPage, HeroPage, PointsPage} from './pages';
import type {Page} from './types';

export const FPS = 30;
export const pageFrames = (page: Page) => Math.round(page.seconds * FPS);
export const totalFrames = content.pages.reduce((sum, page) => sum + pageFrames(page), 0);

const renderPage = (page: Page, duration: number, pageLabel: string) => {
  switch (page.type) {
    case 'cover':
      return <CoverPage data={page} duration={duration} pageLabel={pageLabel}/>;
    case 'hero':
      return <HeroPage data={page} duration={duration} pageLabel={pageLabel}/>;
    case 'causes':
      return <CausesPage data={page} duration={duration} pageLabel={pageLabel}/>;
    case 'points':
      return <PointsPage data={page} duration={duration} pageLabel={pageLabel}/>;
  }
};

export const InsightVideo: React.FC = () => {
  const {durationInFrames} = useVideoConfig();
  const total = String(content.pages.length).padStart(2, '0');
  // BGM：开头 0.5 秒淡入，结尾 1 秒淡出
  const bgmVolume = (f: number) =>
    interpolate(f, [0, 15, durationInFrames - 30, durationInFrames], [0, 1, 1, 0], clamp);

  return (
    <AbsoluteFill>
      {content.bgm && <Audio src={staticFile(content.bgm)} volume={bgmVolume}/>}
      <Series>
        {content.pages.map((page, i) => {
          const duration = pageFrames(page);
          return (
            <Series.Sequence key={i} durationInFrames={duration}>
              {renderPage(page, duration, `${String(i + 1).padStart(2, '0')} / ${total}`)}
            </Series.Sequence>
          );
        })}
      </Series>
    </AbsoluteFill>
  );
};

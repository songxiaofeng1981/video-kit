import {interpolate, spring} from 'remotion';

export const enter = (frame: number, fps: number, delay = 0) => {
  const f = Math.max(0, frame - delay);
  const s = spring({
    frame: f,
    fps,
    config: {damping: 18, stiffness: 120, mass: 0.8},
  });

  return {
    opacity: interpolate(f, [0, 10], [0, 1], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }),
    transform: `translateY(${interpolate(s, [0, 1], [26, 0])}px)`,
  };
};

export const pageFade = (frame: number, duration: number) => {
  const fadeIn = interpolate(frame, [0, 12], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const fadeOut = interpolate(frame, [duration - 12, duration], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return fadeIn * fadeOut;
};

export const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;


export type OrbConfig = {
  id: string;
  label: string;

  baseRadius: number; // 0.1–1.0

  rotation: {
    xSpeed: number; // rad/s
    ySpeed: number;
  };

  noise: {
    scale: number;
    intensity: number; // 0–1
    speed: number;     // 0–?
    detail: number;    // 0–1
  };

  colors: {
    inner: string;      // "#RRGGBB"
    outer: string;
    accent: string;
    background: string;
    gradientBias: number; // 0–1 (wie stark nach außen gezogen)
  };

  glow: {
    intensity: number;  // 0–1
    threshold: number;  // 0–1
    radius: number;     // 0–1
  };

  details: {
    bandCount: number;      // 0 = keine
    bandSharpness: number;  // 0–1
    particleDensity: number;// 0–1
  };

  animation: {
    loopSeconds: number;    // 2, 3, 5, 10…
  };

  version: 1;               // für spätere Shader-Änderungen
};

export const DEFAULT_ORB_CONFIG: OrbConfig = {
  id: 'default',
  label: 'Default Orb',
  baseRadius: 0.5,
  rotation: {
    xSpeed: 0.2,
    ySpeed: 0.1,
  },
  noise: {
    scale: 1.0,
    intensity: 0.5,
    speed: 0.2,
    detail: 0.5,
  },
  colors: {
    inner: '#ff0000',
    outer: '#0000ff',
    accent: '#ffff00',
    background: '#000000',
    gradientBias: 0.5,
  },
  glow: {
    intensity: 0.5,
    threshold: 0.1,
    radius: 0.5,
  },
  details: {
    bandCount: 0,
    bandSharpness: 0.5,
    particleDensity: 0,
  },
  animation: {
    loopSeconds: 10,
  },
  version: 1,
};

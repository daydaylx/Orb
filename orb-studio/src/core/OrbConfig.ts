
export interface OrbConfigInternal {
  id: string;
  name: string; // Renamed from label to name to match requirements if needed, or keeping label? Prompt says name/label. I will use name for consistency with external.

  // Internal UI state or full config
  baseRadius: number;

  rotation: {
    xSpeed: number;
    ySpeed: number;
  };

  noise: {
    scale: number;
    intensity: number;
    speed: number;
    detail: number;
  };

  colors: {
    inner: string;
    outer: string;
    accent: string;
    background: string;
    gradientBias: number;
  };

  glow: {
    intensity: number;
    threshold: number;
    radius: number;
  };

  details: {
    bandCount: number;
    bandSharpness: number;
    particleDensity: number;
  };

  animation: {
    loopSeconds: number;
  };

  version: 1;
}

export interface OrbConfigExternalV1 {
  id: string;
  name: string;
  version: 1;
  rendering: {
    baseRadius: number;
    colors: {
      inner: string;
      outer: string;
      accent: string;
      background: string;
      gradientBias: number;
    };
    rotation: {
      xSpeed: number;
      ySpeed: number;
    };
    noise?: {
      scale: number;
      intensity: number;
      speed: number;
      detail: number;
    };
    glow?: {
      intensity: number;
      threshold: number;
      radius: number;
    };
    details?: {
      bandCount: number;
      bandSharpness: number;
      particleDensity: number;
    };
  };
  meta?: {
    description?: string;
    tags?: string[];
  };
}

export const DEFAULT_ORB_CONFIG: OrbConfigInternal = {
  id: 'default',
  name: 'Default Orb',
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

export function toExternalConfig(config: OrbConfigInternal): OrbConfigExternalV1 {
  return {
    id: config.id,
    name: config.name,
    version: 1,
    rendering: {
      baseRadius: config.baseRadius,
      colors: { ...config.colors },
      rotation: { ...config.rotation },
      noise: { ...config.noise },
      glow: { ...config.glow },
      details: { ...config.details },
    },
  };
}

export function exportOrbConfigToJson(config: OrbConfigInternal): string {
  const external = toExternalConfig(config);
  return JSON.stringify(external, null, 2);
}

// For compatibility with existing code that might import OrbConfig
export type OrbConfig = OrbConfigInternal;

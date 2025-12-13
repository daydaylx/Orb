
import { z } from 'zod';

// Zod Schema for validation
export const OrbConfigExternalSchema = z.object({
  id: z.string(),
  name: z.string(),
  version: z.literal(1),
  rendering: z.object({
    baseRadius: z.number().min(0.1).max(2.0),
    colors: z.object({
      inner: z.string().regex(/^#[0-9a-fA-F]{6}$/),
      outer: z.string().regex(/^#[0-9a-fA-F]{6}$/),
      accent: z.string().regex(/^#[0-9a-fA-F]{6}$/),
      background: z.string().regex(/^#[0-9a-fA-F]{6}$/),
      gradientBias: z.number().min(0).max(1),
    }),
    rotation: z.object({
      xSpeed: z.number(),
      ySpeed: z.number(),
    }),
    animation: z.object({
      loopSeconds: z.number().min(0.1).optional(),
      easing: z.enum(['linear', 'easeInOut', 'elastic', 'bounce']).optional(),
    }).optional(),
    noise: z.object({
      scale: z.number(),
      intensity: z.number(),
      speed: z.number(),
      detail: z.number(),
    }).optional(),
    glow: z.object({
      intensity: z.number(),
      threshold: z.number(),
      radius: z.number(),
    }).optional(),
    details: z.object({
      bandCount: z.number(),
      bandSharpness: z.number(),
      particleDensity: z.number(),
    }).optional(),
    bloom: z.object({
      enabled: z.boolean(),
      strength: z.number(),
      radius: z.number(),
      threshold: z.number(),
    }).optional(),
    post: z.object({
      chromaticAberration: z.boolean().optional(),
      chromaticAmount: z.number().optional(),
      vignette: z.number().optional(),
      filmGrain: z.object({
        enabled: z.boolean(),
        intensity: z.number(),
      }).optional(),
      dof: z.object({
        enabled: z.boolean(),
        focus: z.number(),
        aperture: z.number(),
        maxBlur: z.number(),
      }).optional(),
    }).optional(),
  }),
  meta: z.object({
    description: z.string().optional(),
    tags: z.array(z.string()).optional(),
  }).optional(),
});


export type OrbConfigInternal = {
  id: string;
  label: string; // Internal uses 'label'

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

  post: {
    chromaticAberration: boolean;
    chromaticAmount: number;
    vignette: number;
    filmGrain: {
      enabled: boolean;
      intensity: number;
    };
    dof: {
      enabled: boolean;
      focus: number;
      aperture: number;
      maxBlur: number;
    };
  };

  details: {
    bandCount: number;
    bandSharpness: number;
    particleDensity: number;
  };

  bloom: {
    enabled: boolean;
    strength: number;
    radius: number;
    threshold: number;
  };

  animation: {
    loopSeconds: number;
    easing: 'linear' | 'easeInOut' | 'elastic' | 'bounce';
  };

  version: 1;
};

// External export format (V1)
export type OrbConfigExternalV1 = {
  id: string;
  name: string; // External uses 'name'
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
    animation?: {
      loopSeconds?: number;
      easing?: 'linear' | 'easeInOut' | 'elastic' | 'bounce';
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
    bloom?: {
      enabled: boolean;
      strength: number;
      radius: number;
      threshold: number;
    };
    post?: {
      chromaticAberration?: boolean;
      chromaticAmount?: number;
      vignette?: number;
      filmGrain?: {
        enabled: boolean;
        intensity: number;
      };
      dof?: {
        enabled: boolean;
        focus: number;
        aperture: number;
        maxBlur: number;
      };
    };
  };
  meta?: {
    description?: string;
    tags?: string[];
  };
};

// Alias for easier refactoring (deprecated, use OrbConfigInternal)
export type OrbConfig = OrbConfigInternal;

export const DEFAULT_ORB_CONFIG: OrbConfigInternal = {
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
  post: {
    chromaticAberration: true,
    chromaticAmount: 0.0018,
    vignette: 0.28,
    filmGrain: {
      enabled: false,
      intensity: 0.08,
    },
    dof: {
      enabled: false,
      focus: 1.0,
      aperture: 0.00015,
      maxBlur: 0.007,
    },
  },
  details: {
    bandCount: 0,
    bandSharpness: 0.5,
    particleDensity: 0,
  },
  bloom: {
    enabled: true,
    strength: 1.0,
    radius: 0.4,
    threshold: 0.0,
  },
  animation: {
    loopSeconds: 10,
    easing: 'linear',
  },
  version: 1,
};

export const toExternalConfig = (config: OrbConfigInternal): OrbConfigExternalV1 => {
  return {
    id: config.id,
    name: config.label,
    version: 1,
    rendering: {
      baseRadius: config.baseRadius,
      colors: { ...config.colors },
      rotation: { ...config.rotation },
      animation: { ...config.animation },
      noise: { ...config.noise },
      glow: { ...config.glow },
      details: { ...config.details },
      bloom: { ...config.bloom },
      post: { ...config.post },
    },
    // Meta is not in Internal yet, so we leave it undefined or empty
  };
};

export const exportOrbConfigToJson = (config: OrbConfigInternal): string => {
  const external = toExternalConfig(config);
  return JSON.stringify(external, null, 2);
};

// Best-effort conversion from external to internal config
export const fromExternalConfig = (external: OrbConfigExternalV1): OrbConfigInternal => {
  const rendering = external.rendering;
  return {
    id: external.id,
    label: external.name,
    baseRadius: rendering.baseRadius,
    rotation: rendering.rotation,
    noise: {
      scale: rendering.noise?.scale ?? DEFAULT_ORB_CONFIG.noise.scale,
      intensity: rendering.noise?.intensity ?? DEFAULT_ORB_CONFIG.noise.intensity,
      speed: rendering.noise?.speed ?? DEFAULT_ORB_CONFIG.noise.speed,
      detail: rendering.noise?.detail ?? DEFAULT_ORB_CONFIG.noise.detail,
    },
    colors: rendering.colors,
    glow: {
      intensity: rendering.glow?.intensity ?? DEFAULT_ORB_CONFIG.glow.intensity,
      threshold: rendering.glow?.threshold ?? DEFAULT_ORB_CONFIG.glow.threshold,
      radius: rendering.glow?.radius ?? DEFAULT_ORB_CONFIG.glow.radius,
    },
    details: {
      bandCount: rendering.details?.bandCount ?? DEFAULT_ORB_CONFIG.details.bandCount,
      bandSharpness: rendering.details?.bandSharpness ?? DEFAULT_ORB_CONFIG.details.bandSharpness,
      particleDensity: rendering.details?.particleDensity ?? DEFAULT_ORB_CONFIG.details.particleDensity,
    },
    bloom: {
      enabled: rendering.bloom?.enabled ?? DEFAULT_ORB_CONFIG.bloom.enabled,
      strength: rendering.bloom?.strength ?? DEFAULT_ORB_CONFIG.bloom.strength,
      radius: rendering.bloom?.radius ?? DEFAULT_ORB_CONFIG.bloom.radius,
      threshold: rendering.bloom?.threshold ?? DEFAULT_ORB_CONFIG.bloom.threshold,
    },
    post: {
      chromaticAberration: rendering.post?.chromaticAberration ?? DEFAULT_ORB_CONFIG.post.chromaticAberration,
      chromaticAmount: rendering.post?.chromaticAmount ?? DEFAULT_ORB_CONFIG.post.chromaticAmount,
      vignette: rendering.post?.vignette ?? DEFAULT_ORB_CONFIG.post.vignette,
      filmGrain: {
        enabled: rendering.post?.filmGrain?.enabled ?? DEFAULT_ORB_CONFIG.post.filmGrain.enabled,
        intensity: rendering.post?.filmGrain?.intensity ?? DEFAULT_ORB_CONFIG.post.filmGrain.intensity,
      },
      dof: {
        enabled: rendering.post?.dof?.enabled ?? DEFAULT_ORB_CONFIG.post.dof.enabled,
        focus: rendering.post?.dof?.focus ?? DEFAULT_ORB_CONFIG.post.dof.focus,
        aperture: rendering.post?.dof?.aperture ?? DEFAULT_ORB_CONFIG.post.dof.aperture,
        maxBlur: rendering.post?.dof?.maxBlur ?? DEFAULT_ORB_CONFIG.post.dof.maxBlur,
      },
    },
    animation: {
      loopSeconds: rendering.animation?.loopSeconds ?? DEFAULT_ORB_CONFIG.animation.loopSeconds,
      easing: rendering.animation?.easing ?? 'linear',
    },
    version: 1,
  };
};

export const importOrbConfig = (jsonString: string): OrbConfigInternal => {
  try {
    const json = JSON.parse(jsonString);
    const parsed = OrbConfigExternalSchema.parse(json);
    // Explicit cast because Zod inference might be slightly different from the Type manually defined
    return fromExternalConfig(parsed as OrbConfigExternalV1);
  } catch (e: any) {
    if (e instanceof z.ZodError) {
      const messages = (e as any).errors.map((err: any) => `${err.path.join('.')}: ${err.message}`).join(', ');
      throw new Error(`Validation failed: ${messages}`);
    }
    throw new Error(`Invalid JSON: ${e.message}`);
  }
};

import type { OrbConfigInternal } from '../OrbConfig';
import * as THREE from 'three';

export interface OrbUniforms {
  u_time: { value: number };

  // Colors
  u_colorInner: { value: THREE.Color };
  u_colorOuter: { value: THREE.Color };
  u_colorAccent: { value: THREE.Color };
  u_colorBackground: { value: THREE.Color }; // Might be used for post-processing or environment, keeping for now
  u_gradientBias: { value: number };

  // Noise
  u_noiseScale: { value: number };
  u_noiseIntensity: { value: number };
  u_noiseSpeed: { value: number };
  u_noiseDetail: { value: number };

  // Glow
  u_glowIntensity: { value: number };
  u_glowThreshold: { value: number };
  u_glowRadius: { value: number };

  // Details
  u_bandCount: { value: number };
  u_bandSharpness: { value: number };
  u_particleDensity: { value: number };
}

export const createOrbUniforms = (config: OrbConfigInternal): OrbUniforms => {
  return {
    u_time: { value: 0 },

    u_colorInner: { value: new THREE.Color(config.colors.inner) },
    u_colorOuter: { value: new THREE.Color(config.colors.outer) },
    u_colorAccent: { value: new THREE.Color(config.colors.accent) },
    u_colorBackground: { value: new THREE.Color(config.colors.background) },
    u_gradientBias: { value: config.colors.gradientBias },

    u_noiseScale: { value: config.noise.scale },
    u_noiseIntensity: { value: config.noise.intensity },
    u_noiseSpeed: { value: config.noise.speed },
    u_noiseDetail: { value: config.noise.detail },

    u_glowIntensity: { value: config.glow.intensity },
    u_glowThreshold: { value: config.glow.threshold },
    u_glowRadius: { value: config.glow.radius },

    u_bandCount: { value: config.details.bandCount },
    u_bandSharpness: { value: config.details.bandSharpness },
    u_particleDensity: { value: config.details.particleDensity },
  };
};

export const updateOrbUniforms = (uniforms: OrbUniforms, config: OrbConfigInternal) => {
  uniforms.u_colorInner.value.set(config.colors.inner);
  uniforms.u_colorOuter.value.set(config.colors.outer);
  uniforms.u_colorAccent.value.set(config.colors.accent);
  uniforms.u_colorBackground.value.set(config.colors.background);
  uniforms.u_gradientBias.value = config.colors.gradientBias;

  uniforms.u_noiseScale.value = config.noise.scale;
  uniforms.u_noiseIntensity.value = config.noise.intensity;
  uniforms.u_noiseSpeed.value = config.noise.speed;
  uniforms.u_noiseDetail.value = config.noise.detail;

  uniforms.u_glowIntensity.value = config.glow.intensity;
  uniforms.u_glowThreshold.value = config.glow.threshold;
  uniforms.u_glowRadius.value = config.glow.radius;

  uniforms.u_bandCount.value = config.details.bandCount;
  uniforms.u_bandSharpness.value = config.details.bandSharpness;
  uniforms.u_particleDensity.value = config.details.particleDensity;
};

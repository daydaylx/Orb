import * as THREE from 'three';
import type { OrbConfigInternal } from '../OrbConfig';

export type OrbUniforms = {
  u_time: { value: number };
  u_baseRadius: { value: number };
  u_colorInner: { value: THREE.Color };
  u_colorOuter: { value: THREE.Color };
  u_gradientBias: { value: number };
  u_noiseScale: { value: number };
  u_noiseIntensity: { value: number };
  u_noiseSpeed: { value: number };
  u_noiseDetail: { value: number };
  u_glowIntensity: { value: number };
  u_glowRadius: { value: number };
  u_glowThreshold: { value: number };
  u_bandCount: { value: number };
  u_bandSharpness: { value: number };
  u_particleDensity: { value: number };
};

export const createOrbUniforms = (config: OrbConfigInternal): OrbUniforms => {
  return {
    u_time: { value: 0 },
    u_baseRadius: { value: config.baseRadius },
    u_colorInner: { value: new THREE.Color(config.colors.inner) },
    u_colorOuter: { value: new THREE.Color(config.colors.outer) },
    u_gradientBias: { value: config.colors.gradientBias },
    u_noiseScale: { value: config.noise.scale },
    u_noiseIntensity: { value: config.noise.intensity },
    u_noiseSpeed: { value: config.noise.speed },
    u_noiseDetail: { value: config.noise.detail },
    u_glowIntensity: { value: config.glow.intensity },
    u_glowRadius: { value: config.glow.radius },
    u_glowThreshold: { value: config.glow.threshold },
    u_bandCount: { value: config.details.bandCount },
    u_bandSharpness: { value: config.details.bandSharpness },
    u_particleDensity: { value: config.details.particleDensity },
  };
};

export const updateOrbUniforms = (uniforms: OrbUniforms, config: OrbConfigInternal) => {
  uniforms.u_baseRadius.value = config.baseRadius;
  uniforms.u_colorInner.value.set(config.colors.inner);
  uniforms.u_colorOuter.value.set(config.colors.outer);
  uniforms.u_gradientBias.value = config.colors.gradientBias;

  uniforms.u_noiseScale.value = config.noise.scale;
  uniforms.u_noiseIntensity.value = config.noise.intensity;
  uniforms.u_noiseSpeed.value = config.noise.speed;
  uniforms.u_noiseDetail.value = config.noise.detail;

  uniforms.u_glowIntensity.value = config.glow.intensity;
  uniforms.u_glowRadius.value = config.glow.radius;
  uniforms.u_glowThreshold.value = config.glow.threshold;

  uniforms.u_bandCount.value = config.details.bandCount;
  uniforms.u_bandSharpness.value = config.details.bandSharpness;
  uniforms.u_particleDensity.value = config.details.particleDensity;
};

import type { OrbConfig } from '../OrbConfig';

export const configToUniforms = (config: OrbConfig) => {
  return {
    u_baseRadius: { value: config.baseRadius },
    u_time: { value: 0 },
    // Add other mappings here
  };
};

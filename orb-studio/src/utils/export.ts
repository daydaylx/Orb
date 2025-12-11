import type { OrbConfig } from '../core/OrbConfig';

export const exportAsJSON = (config: OrbConfig): string => {
  return JSON.stringify(config, null, 2);
};

export const exportAsTypeScript = (config: OrbConfig, constName: string = 'MY_ORB'): string => {
  return `import { OrbConfig } from './OrbConfig';

export const ${constName}: OrbConfig = ${JSON.stringify(config, null, 2)};
`;
};

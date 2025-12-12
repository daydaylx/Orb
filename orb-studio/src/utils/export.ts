import type { OrbConfigInternal } from '../core/OrbConfig';

export const exportAsJSON = (config: OrbConfigInternal): string => {
  return JSON.stringify(config, null, 2);
};

export const exportAsTypeScript = (config: OrbConfigInternal, constName: string = 'MY_ORB'): string => {
  return `import { OrbConfig } from './OrbConfig';

export const ${constName}: OrbConfig = ${JSON.stringify(config, null, 2)};
`;
};

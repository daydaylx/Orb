import { create } from 'zustand';
import { DEFAULT_ORB_CONFIG } from '../core/OrbConfig';
import type { OrbConfigInternal } from '../core/OrbConfig';

interface OrbState {
  config: OrbConfigInternal;
  setConfig: (config: Partial<OrbConfigInternal>) => void;
  resetToDefault: () => void;
}

export const useOrbStore = create<OrbState>((set) => ({
  config: DEFAULT_ORB_CONFIG,
  setConfig: (partial) =>
    set((state) => {
        return { config: { ...state.config, ...partial } };
    }),
  resetToDefault: () => set({ config: DEFAULT_ORB_CONFIG }),
}));

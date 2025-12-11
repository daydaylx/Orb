import { create } from 'zustand';
import { DEFAULT_ORB_CONFIG } from '../core/OrbConfig';
import type { OrbConfig } from '../core/OrbConfig';

interface OrbState {
  config: OrbConfig;
  setConfig: (config: Partial<OrbConfig>) => void;
  resetToDefault: () => void;
}

export const useOrbStore = create<OrbState>((set) => ({
  config: DEFAULT_ORB_CONFIG,
  setConfig: (partial) =>
    set((state) => {
        // Deep merge for nested objects if necessary, but for now simple spread
        // However, since we have nested objects (rotation, noise, etc), we need to be careful.
        // The `partial` in `setConfig` in the plan implies we might want to update parts.
        // For simplicity, let's assume `partial` is a partial of the full object or we implement specific updaters.
        // The plan says: `setConfig(partial)`.

        // A simple recursive merge or using libraries like immer is better.
        // But for "no overkill", let's assume the caller passes the full structure or we handle top level keys.
        // Actually, let's make setConfig accept a Partial<OrbConfig> and we merge it shallowly for top level keys,
        // but for nested keys, we might need a deep merge utility or just replace.
        // The plan says: "Immer immutable Updates ({ ...old, rotation: { ...old.rotation, xSpeed: newVal } })"

        // So the caller is responsible for the structure, or we provide helper methods.
        // The plan says: `setConfig(partial)`.

        // Let's implement a shallow merge for now, and rely on caller to spread nested objects if they only update one field.
        // Or better, since `zustand` `set` merges state, but here we have `config` object.

        return { config: { ...state.config, ...partial } };
    }),
  resetToDefault: () => set({ config: DEFAULT_ORB_CONFIG }),
}));

import { create } from 'zustand';
import type { OrbConfig } from '../core/OrbConfig';
import { persist } from 'zustand/middleware';

interface PresetState {
  presets: OrbConfig[];
  addPreset: (config: OrbConfig) => void;
  updatePreset: (id: string, config: OrbConfig) => void;
  deletePreset: (id: string) => void;
}

export const usePresetStore = create<PresetState>()(
  persist(
    (set) => ({
      presets: [],
      addPreset: (config) =>
        set((state) => ({ presets: [...state.presets, config] })),
      updatePreset: (id, config) =>
        set((state) => ({
          presets: state.presets.map((p) => (p.id === id ? config : p)),
        })),
      deletePreset: (id) =>
        set((state) => ({
          presets: state.presets.filter((p) => p.id !== id),
        })),
    }),
    {
      name: 'orb-studio-presets-v1',
    }
  )
);

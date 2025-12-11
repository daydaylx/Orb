import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { DEFAULT_ORB_CONFIG } from '../core/OrbConfig';
import type { OrbConfigInternal } from '../core/OrbConfig';

interface OrbStoreState {
  orbs: OrbConfigInternal[];
  activeOrbId: string;

  // Computed property for convenience (get active config)
  config: OrbConfigInternal;

  // Actions
  createOrb: (initial?: Partial<OrbConfigInternal>) => void;
  duplicateOrb: (id: string) => void;
  deleteOrb: (id: string) => void;
  setActiveOrb: (id: string) => void;
  updateActiveOrb: (partial: Partial<OrbConfigInternal> | ((prev: OrbConfigInternal) => Partial<OrbConfigInternal>)) => void;

  // Deprecated/Legacy support during transition (maps to active orb)
  setConfig: (config: Partial<OrbConfigInternal>) => void;
  resetToDefault: () => void;
}

export const useOrbStore = create<OrbStoreState>()(
  persist(
    (set, get) => ({
      orbs: [DEFAULT_ORB_CONFIG],
      activeOrbId: DEFAULT_ORB_CONFIG.id,

      get config() {
        const { orbs, activeOrbId } = get();
        return orbs.find((o) => o.id === activeOrbId) || orbs[0] || DEFAULT_ORB_CONFIG;
      },

      createOrb: (initial) => set((state) => {
        const newOrb: OrbConfigInternal = {
          ...DEFAULT_ORB_CONFIG,
          ...initial,
          id: crypto.randomUUID(),
          name: initial?.name || `Orb ${state.orbs.length + 1}`,
        };
        return {
          orbs: [...state.orbs, newOrb],
          activeOrbId: newOrb.id,
        };
      }),

      duplicateOrb: (id) => set((state) => {
        const orbToDuplicate = state.orbs.find((o) => o.id === id);
        if (!orbToDuplicate) return {};
        const newOrb = {
          ...orbToDuplicate,
          id: crypto.randomUUID(),
          name: `${orbToDuplicate.name} (Copy)`,
        };
        return {
          orbs: [...state.orbs, newOrb],
          activeOrbId: newOrb.id,
        };
      }),

      deleteOrb: (id) => set((state) => {
        if (state.orbs.length <= 1) return {}; // Prevent deleting the last orb
        const newOrbs = state.orbs.filter((o) => o.id !== id);
        let newActiveId = state.activeOrbId;
        if (state.activeOrbId === id) {
          newActiveId = newOrbs[0].id;
        }
        return {
          orbs: newOrbs,
          activeOrbId: newActiveId,
        };
      }),

      setActiveOrb: (id) => set({ activeOrbId: id }),

      updateActiveOrb: (partial) => set((state) => {
        const activeOrb = state.orbs.find((o) => o.id === state.activeOrbId);
        if (!activeOrb) return {};

        const updates = typeof partial === 'function' ? partial(activeOrb) : partial;
        const updatedOrb = { ...activeOrb, ...updates };

        return {
          orbs: state.orbs.map((o) => (o.id === state.activeOrbId ? updatedOrb : o)),
        };
      }),

      // Legacy/Compatibility
      setConfig: (partial) => get().updateActiveOrb(partial),
      resetToDefault: () => get().updateActiveOrb(DEFAULT_ORB_CONFIG),
    }),
    {
      name: 'orb-studio-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ orbs: state.orbs, activeOrbId: state.activeOrbId }),
    }
  )
);

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { temporal } from 'zundo';
import { v4 as uuidv4 } from 'uuid';
import { DEFAULT_ORB_CONFIG } from '../core/OrbConfig';
import type { OrbConfigInternal } from '../core/OrbConfig';

interface OrbState {
  orbs: OrbConfigInternal[];
  activeOrbId: string;
  createOrb: (initial?: Partial<OrbConfigInternal>) => void;
  duplicateOrb: (id: string) => void;
  deleteOrb: (id: string) => void;
  setActiveOrb: (id: string) => void;
  updateActiveOrb: (partial: Partial<OrbConfigInternal> | ((prev: OrbConfigInternal) => Partial<OrbConfigInternal>)) => void;
}

export const useOrbStore = create<OrbState>()(
  temporal(
  persist(
    (set) => {
      const initialDefault = { ...DEFAULT_ORB_CONFIG, id: uuidv4(), label: 'Default Orb 1' };
      return {
        orbs: [initialDefault], // Ensure there is always at least one orb on first render
        activeOrbId: initialDefault.id,

      createOrb: (initial) =>
        set((state) => {
          const newOrb: OrbConfigInternal = {
            ...DEFAULT_ORB_CONFIG,
            id: uuidv4(),
            label: `New Orb ${state.orbs.length + 1}`,
            ...initial,
          };
          return {
            orbs: [...state.orbs, newOrb],
            activeOrbId: newOrb.id,
          };
        }),

      duplicateOrb: (id) =>
        set((state) => {
          const orbToDuplicate = state.orbs.find((orb) => orb.id === id);
          if (!orbToDuplicate) return state;

          const newOrb: OrbConfigInternal = {
            ...orbToDuplicate,
            id: uuidv4(),
            label: `${orbToDuplicate.label} (Copy)`,
          };
          return {
            orbs: [...state.orbs, newOrb],
            activeOrbId: newOrb.id,
          };
        }),

      deleteOrb: (id) =>
        set((state) => {
          // Ensure at least one orb remains
          if (state.orbs.length === 1 && state.orbs[0].id === id) {
            console.warn("Cannot delete the last orb.");
            return state;
          }

          const updatedOrbs = state.orbs.filter((orb) => orb.id !== id);
          let newActiveOrbId = state.activeOrbId;

          if (newActiveOrbId === id) {
            newActiveOrbId = updatedOrbs[0]?.id || '';
          }

          return {
            orbs: updatedOrbs,
            activeOrbId: newActiveOrbId,
          };
        }),

      setActiveOrb: (id) =>
        set((state) => {
          if (state.orbs.some((orb) => orb.id === id)) {
            return { activeOrbId: id };
          }
          return state;
        }),

      updateActiveOrb: (partial) =>
        set((state) => {
          const updatedOrbs = state.orbs.map((orb) =>
            orb.id === state.activeOrbId
              ? { ...orb, ...(typeof partial === 'function' ? partial(orb) : partial) }
              : orb
          );
          return { orbs: updatedOrbs };
        }),
      };
    },
    {
      name: 'orb-studio-storage', // unique name
      version: 2, // version of the storage schema
      // A function to run when rehydrating the storage
      onRehydrateStorage: () => {
        console.log('rehydration starts');
        // Optional: Perform any data migration here if versions change.
        return (state, error) => {
          if (error) {
            console.error('an error happened during rehydration', error);
          } else {
            if (!state) return; // Add this check
            // After rehydration, ensure activeOrbId is set, or create a default orb if storage was empty
            if (!state.orbs.length) {
                // If no orbs were loaded, create a default one
                const defaultOrb = { ...DEFAULT_ORB_CONFIG, id: uuidv4(), label: 'Default Orb 1' };
                state.orbs = [defaultOrb];
                state.activeOrbId = defaultOrb.id;
            } else if (!state.activeOrbId || !state.orbs.some(orb => orb.id === state.activeOrbId)) {
                // If activeOrbId is missing or points to a non-existent orb, set the first orb as active
                state.activeOrbId = state.orbs[0].id;
            }
            console.log('rehydration finished', state);
          }
        };
      },
      // Migrate function for when the version changes (not strictly needed for v1, but good practice)
      migrate: (persistedState: unknown) => {
        const state = persistedState as { orbs?: Array<Partial<OrbConfigInternal>> };
        if (!state.orbs) {
          return persistedState;
        }
        // ensure newer fields exist
        state.orbs = state.orbs.map((orb) => ({
          ...orb,
          post: orb.post || DEFAULT_ORB_CONFIG.post,
          animation: {
            loopSeconds: orb.animation?.loopSeconds ?? DEFAULT_ORB_CONFIG.animation.loopSeconds,
            easing: orb.animation?.easing ?? 'linear',
          },
        }));
        return state;
      },
    },
  ),
  {
    limit: 50,
    partialize: (state) => {
        const { orbs, activeOrbId } = state;
        return { orbs, activeOrbId };
    },
  }
  ),
);

// Initial state logic, moved inside persist's onRehydrateStorage
// No longer need this post-initialization block as persist handles it.
// useOrbStore.setState((state) => {
//   if (!state.activeOrbId && state.orbs.length > 0) {
//     return { activeOrbId: state.orbs[0].id };
//   }
//   return {}; // No change needed
// });

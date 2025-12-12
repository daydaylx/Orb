import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid'; // For generating unique IDs
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

export const useOrbStore = create<OrbState>((set) => ({
  orbs: [{ ...DEFAULT_ORB_CONFIG, id: uuidv4(), label: 'Default Orb 1' }],
  activeOrbId: '', // Will be set to the first orb's ID in the initial state logic

  // Initialize activeOrbId to the first orb's ID
  // This needs to be done after the initial `orbs` array is created.
  // Using a custom initializer function for zustand or an effect.
  // For simplicity, we can do it after the initial state setup by calling setActiveOrb.
  // Or:
  // useOrbStore.setState({ activeOrbId: useOrbStore.getState().orbs[0].id });
  // Let's do it in the create function itself to be atomic.
  // This cannot be done directly in the initial state object, as `get()` is not available there.
  // Will set it in a specific initialization step or assume the first orb is active.

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
        activeOrbId: newOrb.id, // Make the new orb active
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
        activeOrbId: newOrb.id, // Make the duplicated orb active
      };
    }),

  deleteOrb: (id) =>
    set((state) => {
      // Ensure at least one orb remains
      if (state.orbs.length === 1 && state.orbs[0].id === id) {
        // Cannot delete the last orb, maybe reset it? Or do nothing?
        console.warn("Cannot delete the last orb.");
        return state;
      }

      const updatedOrbs = state.orbs.filter((orb) => orb.id !== id);
      let newActiveOrbId = state.activeOrbId;

      // If the active orb was deleted, set a new active orb (e.g., the first in the list)
      if (newActiveOrbId === id) {
        newActiveOrbId = updatedOrbs[0]?.id || ''; // Fallback, though we ensured at least one orb
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
      return state; // ID not found
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
}));

// Post-initialization to set the activeOrbId to the first orb
// This can be done outside the `create` call if `activeOrbId` is initialized empty.
// However, it's better to ensure it's set immediately within the store's lifecycle.
// Re-initializing `orbs` and then setting `activeOrbId` is more robust.
useOrbStore.setState((state) => {
  if (!state.activeOrbId && state.orbs.length > 0) {
    return { activeOrbId: state.orbs[0].id };
  }
  return {}; // No change needed
});

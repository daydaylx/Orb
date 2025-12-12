import { create } from 'zustand';

type Mode = 'live' | 'scrub';

interface PlaybackState {
  mode: Mode;
  scrubT: number; // 0..1
  setMode: (mode: Mode) => void;
  setScrubT: (t: number) => void;
}

export const usePlaybackStore = create<PlaybackState>((set) => ({
  mode: 'live',
  scrubT: 0,
  setMode: (mode) => set({ mode }),
  setScrubT: (t) => set({ scrubT: Math.min(Math.max(t, 0), 1) }),
}));

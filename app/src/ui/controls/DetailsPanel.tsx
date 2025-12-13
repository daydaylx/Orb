import React from 'react';
import { useOrbStore } from '../../state/useOrbStore';
import { Slider } from '../common/Slider';
import { DEFAULT_ORB_CONFIG } from '../../core/OrbConfig';
import { usePlaybackStore } from '../../state/usePlaybackStore';

export const DetailsPanel: React.FC = () => {
  const activeOrb = useOrbStore((state) => state.orbs.find((orb) => orb.id === state.activeOrbId));
  const updateActiveOrb = useOrbStore((state) => state.updateActiveOrb);
  const playbackMode = usePlaybackStore((s) => s.mode);
  const setPlaybackMode = usePlaybackStore((s) => s.setMode);
  const scrubT = usePlaybackStore((s) => s.scrubT);
  const setScrubT = usePlaybackStore((s) => s.setScrubT);

  if (!activeOrb) return null;

  const updateDetails = (key: keyof typeof activeOrb.details, value: number) => {
    updateActiveOrb((prev) => ({
      details: { ...prev.details, [key]: value },
    }));
  };

  const updateAnimation = (key: keyof typeof activeOrb.animation, value: number | string) => {
    updateActiveOrb((prev) => ({
      animation: { ...prev.animation, [key]: value },
    }));
  };

  const resetDetails = () => updateActiveOrb({ details: { ...DEFAULT_ORB_CONFIG.details } });
  const resetAnimation = () => updateActiveOrb({ animation: { ...DEFAULT_ORB_CONFIG.animation } });

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Details</h3>
          <button className="text-2xs text-gray-500 hover:text-white" onClick={resetDetails}>Reset</button>
        </div>
        <div className="space-y-4">
          <Slider label="Band Count" value={activeOrb.details.bandCount} min={0} max={20} step={1} onChange={(v) => updateDetails('bandCount', v)} quickValues={[0, 3, 6, 10, 15]} />
          <Slider label="Band Sharpness" value={activeOrb.details.bandSharpness} min={0} max={1} onChange={(v) => updateDetails('bandSharpness', v)} quickValues={[0, 0.25, 0.5, 0.75, 1]} />
          <Slider label="Particle Density" value={activeOrb.details.particleDensity} min={0} max={1} onChange={(v) => updateDetails('particleDensity', v)} quickValues={[0, 0.1, 0.3, 0.6, 1]} />
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-3 border-t border-gray-800 pt-4">
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Animation</h3>
          <button className="text-2xs text-gray-500 hover:text-white" onClick={resetAnimation}>Reset</button>
        </div>
        <div className="space-y-4">
          <Slider label="Loop Seconds" value={activeOrb.animation.loopSeconds} min={1} max={60} step={1} onChange={(v) => updateAnimation('loopSeconds', v)} quickValues={[5, 10, 20, 30, 60]} />
          <div className="flex items-center justify-between text-sm text-gray-400">
            <span>Easing</span>
            <select
              value={activeOrb.animation.easing}
              onChange={(e) => updateAnimation('easing', e.target.value)}
              className="bg-gray-800 border border-gray-700 rounded px-2 py-1 text-xs"
            >
              <option value="linear">Linear</option>
              <option value="easeInOut">Ease In/Out</option>
              <option value="elastic">Elastic</option>
              <option value="bounce">Bounce</option>
            </select>
          </div>
          <div className="mt-3 p-3 border border-gray-800 rounded bg-gray-900/50 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider text-gray-500">Timeline Preview</span>
              <button
                className="text-2xs text-gray-400 hover:text-white"
                onClick={() => setPlaybackMode(playbackMode === 'live' ? 'scrub' : 'live')}
              >
                Mode: {playbackMode === 'live' ? 'Live' : 'Scrub'}
              </button>
            </div>
            {playbackMode === 'scrub' && (
              <Slider
                label="Scrub Position"
                value={scrubT}
                min={0}
                max={1}
                step={0.01}
                onChange={(v) => setScrubT(v)}
                quickValues={[0, 0.25, 0.5, 0.75, 1]}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

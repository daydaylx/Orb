import React from 'react';
import { useOrbStore } from '../../state/useOrbStore';
import { Slider } from '../common/Slider';
import { DEFAULT_ORB_CONFIG } from '../../core/OrbConfig';

export const DetailsPanel: React.FC = () => {
  const activeOrb = useOrbStore((state) => state.orbs.find((orb) => orb.id === state.activeOrbId));
  const updateActiveOrb = useOrbStore((state) => state.updateActiveOrb);

  if (!activeOrb) return null;

  const updateDetails = (key: keyof typeof activeOrb.details, value: number) => {
    updateActiveOrb((prev) => ({
      details: { ...prev.details, [key]: value },
    }));
  };

  const updateAnimation = (key: keyof typeof activeOrb.animation, value: number) => {
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
        </div>
      </div>
    </div>
  );
};

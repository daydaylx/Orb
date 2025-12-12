import React from 'react';
import { useOrbStore } from '../../state/useOrbStore';
import { Slider } from '../common/Slider';

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

  return (
    <div className="space-y-6">
      <h3 className="text-md font-semibold text-gray-300 border-b border-gray-700 pb-2">Details</h3>
      <Slider label="Band Count" value={activeOrb.details.bandCount} min={0} max={20} step={1} onChange={(v) => updateDetails('bandCount', v)} />
      <Slider label="Band Sharpness" value={activeOrb.details.bandSharpness} min={0} max={1} onChange={(v) => updateDetails('bandSharpness', v)} />
      <Slider label="Particle Density" value={activeOrb.details.particleDensity} min={0} max={1} onChange={(v) => updateDetails('particleDensity', v)} />

       <h3 className="text-md font-semibold text-gray-300 border-b border-gray-700 pb-2 pt-4">Animation</h3>
      <Slider label="Loop Seconds" value={activeOrb.animation.loopSeconds} min={1} max={60} step={1} onChange={(v) => updateAnimation('loopSeconds', v)} />
    </div>
  );
};

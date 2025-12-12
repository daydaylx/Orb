import React from 'react';
import { useOrbStore } from '../../state/useOrbStore';
import { Slider } from '../common/Slider';

export const MotionPanel: React.FC = () => {
  const activeOrb = useOrbStore((state) => state.orbs.find((orb) => orb.id === state.activeOrbId));
  const updateActiveOrb = useOrbStore((state) => state.updateActiveOrb);

  if (!activeOrb) return null;

  const updateRotation = (key: keyof typeof activeOrb.rotation, value: number) => {
    updateActiveOrb((prev) => ({
      rotation: { ...prev.rotation, [key]: value },
    }));
  };

  const updateNoise = (key: keyof typeof activeOrb.noise, value: number) => {
    updateActiveOrb((prev) => ({
      noise: { ...prev.noise, [key]: value },
    }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Rotation</h3>
        <div className="space-y-4">
          <Slider label="X Speed" value={activeOrb.rotation.xSpeed} min={-2} max={2} onChange={(v) => updateRotation('xSpeed', v)} />
          <Slider label="Y Speed" value={activeOrb.rotation.ySpeed} min={-2} max={2} onChange={(v) => updateRotation('ySpeed', v)} />
        </div>
      </div>

      <div>
        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 border-t border-gray-800 pt-4">Noise</h3>
        <div className="space-y-4">
          <Slider label="Scale" value={activeOrb.noise.scale} min={0.1} max={5} onChange={(v) => updateNoise('scale', v)} />
          <Slider label="Intensity" value={activeOrb.noise.intensity} min={0} max={1} onChange={(v) => updateNoise('intensity', v)} />
          <Slider label="Speed" value={activeOrb.noise.speed} min={0} max={2} onChange={(v) => updateNoise('speed', v)} />
          <Slider label="Detail" value={activeOrb.noise.detail} min={0} max={1} onChange={(v) => updateNoise('detail', v)} />
        </div>
      </div>
    </div>
  );
};

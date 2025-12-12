import React from 'react';
import { useOrbStore } from '../../state/useOrbStore';
import { Slider } from '../common/Slider';
import { DEFAULT_ORB_CONFIG } from '../../core/OrbConfig';

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

  const resetRotation = () => updateActiveOrb({ rotation: { ...DEFAULT_ORB_CONFIG.rotation } });
  const resetNoise = () => updateActiveOrb({ noise: { ...DEFAULT_ORB_CONFIG.noise } });

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Rotation</h3>
          <button className="text-2xs text-gray-500 hover:text-white" onClick={resetRotation}>Reset</button>
        </div>
        <div className="space-y-4">
          <Slider label="X Speed" value={activeOrb.rotation.xSpeed} min={-2} max={2} onChange={(v) => updateRotation('xSpeed', v)} quickValues={[-1, -0.5, 0, 0.5, 1]} />
          <Slider label="Y Speed" value={activeOrb.rotation.ySpeed} min={-2} max={2} onChange={(v) => updateRotation('ySpeed', v)} quickValues={[-1, -0.5, 0, 0.5, 1]} />
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-3 border-t border-gray-800 pt-4">
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Noise</h3>
          <button className="text-2xs text-gray-500 hover:text-white" onClick={resetNoise}>Reset</button>
        </div>
        <div className="space-y-4">
          <Slider label="Scale" value={activeOrb.noise.scale} min={0.1} max={5} onChange={(v) => updateNoise('scale', v)} quickValues={[0.5, 1, 2, 3]} />
          <Slider label="Intensity" value={activeOrb.noise.intensity} min={0} max={1} onChange={(v) => updateNoise('intensity', v)} quickValues={[0, 0.25, 0.5, 0.75, 1]} />
          <Slider label="Speed" value={activeOrb.noise.speed} min={0} max={2} onChange={(v) => updateNoise('speed', v)} quickValues={[0, 0.5, 1, 1.5, 2]} />
          <Slider label="Detail" value={activeOrb.noise.detail} min={0} max={1} onChange={(v) => updateNoise('detail', v)} quickValues={[0, 0.25, 0.5, 0.75, 1]} />
        </div>
      </div>
    </div>
  );
};

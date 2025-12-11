import React from 'react';
import { useOrbStore } from '../../state/useOrbStore';
import { Slider } from '../common/Slider';

export const MotionPanel: React.FC = () => {
  const { config, setConfig } = useOrbStore();

  const updateRotation = (key: keyof typeof config.rotation, value: number) => {
    setConfig({
      ...config,
      rotation: { ...config.rotation, [key]: value },
    });
  };

  const updateNoise = (key: keyof typeof config.noise, value: number) => {
    setConfig({
      ...config,
      noise: { ...config.noise, [key]: value },
    });
  };

  return (
    <div className="space-y-6">
      <h3 className="text-md font-semibold text-gray-300 border-b border-gray-700 pb-2">Rotation</h3>
      <Slider label="X Speed" value={config.rotation.xSpeed} min={-2} max={2} onChange={(v) => updateRotation('xSpeed', v)} />
      <Slider label="Y Speed" value={config.rotation.ySpeed} min={-2} max={2} onChange={(v) => updateRotation('ySpeed', v)} />

      <h3 className="text-md font-semibold text-gray-300 border-b border-gray-700 pb-2 pt-4">Noise</h3>
      <Slider label="Scale" value={config.noise.scale} min={0.1} max={5} onChange={(v) => updateNoise('scale', v)} />
      <Slider label="Intensity" value={config.noise.intensity} min={0} max={1} onChange={(v) => updateNoise('intensity', v)} />
      <Slider label="Speed" value={config.noise.speed} min={0} max={2} onChange={(v) => updateNoise('speed', v)} />
      <Slider label="Detail" value={config.noise.detail} min={0} max={1} onChange={(v) => updateNoise('detail', v)} />
    </div>
  );
};

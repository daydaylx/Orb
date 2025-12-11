import React from 'react';
import { useOrbStore } from '../../state/useOrbStore';
import { ColorPicker } from '../common/ColorPicker';
import { Slider } from '../common/Slider';

export const LookPanel: React.FC = () => {
  const { config, setConfig } = useOrbStore();

  const updateColors = (key: keyof typeof config.colors, value: string | number) => {
    setConfig({
      ...config,
      colors: { ...config.colors, [key]: value },
    });
  };

  const updateGlow = (key: keyof typeof config.glow, value: number) => {
    setConfig({
      ...config,
      glow: { ...config.glow, [key]: value },
    });
  };

  return (
    <div className="space-y-6">
      <h3 className="text-md font-semibold text-gray-300 border-b border-gray-700 pb-2">Colors</h3>
      <ColorPicker label="Inner Color" value={config.colors.inner} onChange={(v) => updateColors('inner', v)} />
      <ColorPicker label="Outer Color" value={config.colors.outer} onChange={(v) => updateColors('outer', v)} />
      <ColorPicker label="Accent Color" value={config.colors.accent} onChange={(v) => updateColors('accent', v)} />
      <ColorPicker label="Background" value={config.colors.background} onChange={(v) => updateColors('background', v)} />
      <Slider label="Gradient Bias" value={config.colors.gradientBias} min={0} max={1} onChange={(v) => updateColors('gradientBias', v)} />

      <h3 className="text-md font-semibold text-gray-300 border-b border-gray-700 pb-2 pt-4">Glow</h3>
      <Slider label="Intensity" value={config.glow.intensity} min={0} max={1} onChange={(v) => updateGlow('intensity', v)} />
      <Slider label="Threshold" value={config.glow.threshold} min={0} max={1} onChange={(v) => updateGlow('threshold', v)} />
      <Slider label="Radius" value={config.glow.radius} min={0} max={1} onChange={(v) => updateGlow('radius', v)} />

      <h3 className="text-md font-semibold text-gray-300 border-b border-gray-700 pb-2 pt-4">Base</h3>
      <Slider label="Base Radius" value={config.baseRadius} min={0.1} max={1.0} onChange={(v) => setConfig({ ...config, baseRadius: v })} />
    </div>
  );
};

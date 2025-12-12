import React from 'react';
import { useOrbStore } from '../../state/useOrbStore';
import { ColorPicker } from '../common/ColorPicker';
import { Slider } from '../common/Slider';

export const LookPanel: React.FC = () => {
  const activeOrb = useOrbStore((state) => state.orbs.find((orb) => orb.id === state.activeOrbId));
  const updateActiveOrb = useOrbStore((state) => state.updateActiveOrb);

  if (!activeOrb) return null; // Should not happen if there's always an active orb

  const updateColors = (key: keyof typeof activeOrb.colors, value: string | number) => {
    updateActiveOrb((prev) => ({
      colors: { ...prev.colors, [key]: value },
    }));
  };

  const updateGlow = (key: keyof typeof activeOrb.glow, value: number) => {
    updateActiveOrb((prev) => ({
      glow: { ...prev.glow, [key]: value },
    }));
  };

  return (
    <div className="space-y-6">
      <h3 className="text-md font-semibold text-gray-300 border-b border-gray-700 pb-2">Colors</h3>
      <ColorPicker label="Inner Color" value={activeOrb.colors.inner} onChange={(v) => updateColors('inner', v)} />
      <ColorPicker label="Outer Color" value={activeOrb.colors.outer} onChange={(v) => updateColors('outer', v)} />
      <ColorPicker label="Accent Color" value={activeOrb.colors.accent} onChange={(v) => updateColors('accent', v)} />
      <ColorPicker label="Background" value={activeOrb.colors.background} onChange={(v) => updateColors('background', v)} />
      <Slider label="Gradient Bias" value={activeOrb.colors.gradientBias} min={0} max={1} onChange={(v) => updateColors('gradientBias', v)} />

      <h3 className="text-md font-semibold text-gray-300 border-b border-gray-700 pb-2 pt-4">Glow</h3>
      <Slider label="Intensity" value={activeOrb.glow.intensity} min={0} max={1} onChange={(v) => updateGlow('intensity', v)} />
      <Slider label="Threshold" value={activeOrb.glow.threshold} min={0} max={1} onChange={(v) => updateGlow('threshold', v)} />
      <Slider label="Radius" value={activeOrb.glow.radius} min={0} max={1} onChange={(v) => updateGlow('radius', v)} />

      <h3 className="text-md font-semibold text-gray-300 border-b border-gray-700 pb-2 pt-4">Base</h3>
      <Slider label="Base Radius" value={activeOrb.baseRadius} min={0.1} max={1.0} onChange={(v) => updateActiveOrb({ baseRadius: v })} />
    </div>
  );
};

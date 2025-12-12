import React from 'react';
import { useOrbStore } from '../../state/useOrbStore';
import { ColorPicker } from '../common/ColorPicker';
import { Slider } from '../common/Slider';
import { Toggle } from '../common/Toggle';
import { DEFAULT_ORB_CONFIG } from '../../core/OrbConfig';

export const LookPanel: React.FC = () => {
  const activeOrb = useOrbStore((state) => state.orbs.find((orb) => orb.id === state.activeOrbId));
  const updateActiveOrb = useOrbStore((state) => state.updateActiveOrb);

  if (!activeOrb) return null;

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

  const updateBloom = (key: keyof NonNullable<typeof activeOrb.bloom>, value: number | boolean) => {
    updateActiveOrb((prev) => {
        const baseBloom = prev.bloom || { enabled: true, strength: 1, radius: 0.4, threshold: 0 };
        return {
            bloom: { ...baseBloom, [key]: value },
        };
    });
  };

  const bloom = activeOrb.bloom || { enabled: false, strength: 1, radius: 0.4, threshold: 0 };

  const resetColors = () => updateActiveOrb({ colors: { ...DEFAULT_ORB_CONFIG.colors } });
  const resetGlow = () => updateActiveOrb({ glow: { ...DEFAULT_ORB_CONFIG.glow } });
  const resetBloom = () => updateActiveOrb({ bloom: { ...DEFAULT_ORB_CONFIG.bloom } });
  const resetBase = () => updateActiveOrb({ baseRadius: DEFAULT_ORB_CONFIG.baseRadius });

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Colors</h3>
          <button className="text-2xs text-gray-500 hover:text-white" onClick={resetColors}>Reset</button>
        </div>
        <div className="space-y-4">
          <ColorPicker label="Inner Color" value={activeOrb.colors.inner} onChange={(v) => updateColors('inner', v)} />
          <ColorPicker label="Outer Color" value={activeOrb.colors.outer} onChange={(v) => updateColors('outer', v)} />
          <ColorPicker label="Accent Color" value={activeOrb.colors.accent} onChange={(v) => updateColors('accent', v)} />
          <ColorPicker label="Background" value={activeOrb.colors.background} onChange={(v) => updateColors('background', v)} />
          <Slider label="Gradient Bias" title="0 = mehr Innenfarbe, 1 = mehr Außenfarbe" value={activeOrb.colors.gradientBias} min={0} max={1} onChange={(v) => updateColors('gradientBias', v)} quickValues={[0, 0.25, 0.5, 0.75, 1]} />
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-3 border-t border-gray-800 pt-4">
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Glow</h3>
          <button className="text-2xs text-gray-500 hover:text-white" onClick={resetGlow}>Reset</button>
        </div>
        <div className="space-y-4">
          <Slider label="Intensity" value={activeOrb.glow.intensity} min={0} max={1} onChange={(v) => updateGlow('intensity', v)} quickValues={[0, 0.3, 0.6, 1]} />
          <Slider label="Threshold" value={activeOrb.glow.threshold} min={0} max={1} onChange={(v) => updateGlow('threshold', v)} quickValues={[0, 0.25, 0.5, 0.75, 1]} />
          <Slider label="Radius" value={activeOrb.glow.radius} min={0} max={1} onChange={(v) => updateGlow('radius', v)} quickValues={[0.1, 0.3, 0.5, 0.8, 1]} />
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-3 border-t border-gray-800 pt-4">
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Post-Processing (Bloom)</h3>
          <button className="text-2xs text-gray-500 hover:text-white" onClick={resetBloom}>Reset</button>
        </div>
        <div className="space-y-4">
          <Toggle label="Enable Bloom" value={bloom.enabled} onChange={(v) => updateBloom('enabled', v)} />
          {bloom.enabled && (
            <>
              <Slider label="Strength" value={bloom.strength} min={0} max={3} onChange={(v) => updateBloom('strength', v)} quickValues={[0, 0.5, 1, 1.5, 2]} />
              <Slider label="Radius" value={bloom.radius} min={0} max={1} onChange={(v) => updateBloom('radius', v)} quickValues={[0.1, 0.3, 0.6, 1]} />
              <Slider label="Threshold" value={bloom.threshold} min={0} max={1} onChange={(v) => updateBloom('threshold', v)} quickValues={[0, 0.2, 0.4, 0.6, 0.8]} />
            </>
          )}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-3 border-t border-gray-800 pt-4">
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Base</h3>
          <button className="text-2xs text-gray-500 hover:text-white" onClick={resetBase}>Reset</button>
        </div>
        <div className="space-y-4">
          <Slider label="Base Radius" value={activeOrb.baseRadius} min={0.1} max={1.0} onChange={(v) => updateActiveOrb({ baseRadius: v })} quickValues={[0.25, 0.5, 0.75, 1]} />
        </div>
      </div>
    </div>
  );
};

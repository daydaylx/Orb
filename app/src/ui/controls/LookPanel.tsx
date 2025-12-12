import React from 'react';
import { useOrbStore } from '../../state/useOrbStore';
import { ColorPicker } from '../common/ColorPicker';
import { Slider } from '../common/Slider';
import { Toggle } from '../common/Toggle';
import { DEFAULT_ORB_CONFIG } from '../../core/OrbConfig';
import tinycolor from 'tinycolor2';

export const LookPanel: React.FC = () => {
  const activeOrb = useOrbStore((state) => state.orbs.find((orb) => orb.id === state.activeOrbId));
  const updateActiveOrb = useOrbStore((state) => state.updateActiveOrb);

  if (!activeOrb) return null;

  const hexToHsl = (hex: string) => {
    const clean = hex.replace('#', '');
    const num = parseInt(clean, 16);
    const r = ((num >> 16) & 255) / 255;
    const g = ((num >> 8) & 255) / 255;
    const b = (num & 255) / 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s = 0;
    const l = (max + min) / 2;
    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }
    return { h, s, l };
  };

  const hslToHex = ({ h, s, l }: { h: number; s: number; l: number }) => {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };
    let r: number, g: number, b: number;
    if (s === 0) {
      r = g = b = l; // achromatic
    } else {
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hue2rgb(p, q, h + 1 / 3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1 / 3);
    }
    const toHex = (x: number) => {
      const v = Math.round(x * 255);
      const str = v.toString(16).padStart(2, '0');
      return str;
    };
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  };

  const shiftHue = (hex: string, deltaDeg: number, lightness?: number) => {
    const hsl = hexToHsl(hex);
    hsl.h = ((hsl.h * 360 + deltaDeg) % 360 + 360) / 360;
    if (lightness !== undefined) hsl.l = lightness;
    return hslToHex(hsl);
  };

  const seededRandom = (seed: string) => {
    let h = 2166136261 >>> 0;
    for (let i = 0; i < seed.length; i++) {
      h ^= seed.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return () => {
      h += h << 13; h ^= h >>> 7; h += h << 3; h ^= h >>> 17; h += h << 5;
      return (h >>> 0) / 4294967295;
    };
  };

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

  const updatePost = (key: keyof typeof activeOrb.post, value: any) => {
    updateActiveOrb((prev) => ({
      post: { ...prev.post, [key]: value },
    }));
  };

  const updateFilmGrain = (key: keyof typeof activeOrb.post.filmGrain, value: any) => {
    updateActiveOrb((prev) => ({
      post: { ...prev.post, filmGrain: { ...prev.post.filmGrain, [key]: value } },
    }));
  };

  const updateDof = (key: keyof typeof activeOrb.post.dof, value: any) => {
    updateActiveOrb((prev) => ({
      post: { ...prev.post, dof: { ...prev.post.dof, [key]: value } },
    }));
  };

  const bloom = activeOrb.bloom || { enabled: false, strength: 1, radius: 0.4, threshold: 0 };

  const resetColors = () => updateActiveOrb({ colors: { ...DEFAULT_ORB_CONFIG.colors } });
  const resetGlow = () => updateActiveOrb({ glow: { ...DEFAULT_ORB_CONFIG.glow } });
  const resetBloom = () => updateActiveOrb({ bloom: { ...DEFAULT_ORB_CONFIG.bloom } });
  const resetBase = () => updateActiveOrb({ baseRadius: DEFAULT_ORB_CONFIG.baseRadius });
  const resetPost = () => updateActiveOrb({ post: { ...DEFAULT_ORB_CONFIG.post } });

  const applyHarmony = (type: 'complementary' | 'triad' | 'analogous') => {
    const base = activeOrb.colors.inner;
    const accentBase = activeOrb.colors.accent;
    let outer = activeOrb.colors.outer;
    let accent = accentBase;
    let background = activeOrb.colors.background;

    if (type === 'complementary') {
      outer = shiftHue(base, 180);
      accent = shiftHue(base, 150, 0.6);
    } else if (type === 'triad') {
      outer = shiftHue(base, 120);
      accent = shiftHue(base, -120);
    } else {
      // analogous
      outer = shiftHue(base, 30);
      accent = shiftHue(base, -30);
    }
    background = shiftHue(base, 180, 0.08);
    updateActiveOrb({
      colors: {
        ...activeOrb.colors,
        outer,
        accent,
        background,
      },
    });
  };

  const randomizePalette = (seed?: string) => {
    const rng = seededRandom(seed || crypto.randomUUID());
    const hue = rng() * 360;
    const inner = hslToHex({ h: hue / 360, s: 0.7 + rng() * 0.2, l: 0.55 });
    const outer = shiftHue(inner, (rng() - 0.5) * 60, 0.35 + rng() * 0.15);
    const accent = shiftHue(inner, 120 + (rng() - 0.5) * 40, 0.6);
    const background = shiftHue(inner, 180, 0.05 + rng() * 0.1);
    updateActiveOrb({
      colors: {
        ...activeOrb.colors,
        inner,
        outer,
        accent,
        background,
        gradientBias: 0.4 + rng() * 0.2,
      },
    });
  };

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
          <div className="flex flex-wrap gap-2">
            <button onClick={() => applyHarmony('complementary')} className="text-xs px-3 py-1 rounded bg-gray-800 hover:bg-gray-700 border border-gray-700">Komplementär</button>
            <button onClick={() => applyHarmony('triad')} className="text-xs px-3 py-1 rounded bg-gray-800 hover:bg-gray-700 border border-gray-700">Triade</button>
            <button onClick={() => applyHarmony('analogous')} className="text-xs px-3 py-1 rounded bg-gray-800 hover:bg-gray-700 border border-gray-700">Analog</button>
            <button
              onClick={() => {
                const seed = prompt('Seed für zufällige Palette (optional):', '');
                randomizePalette(seed || undefined);
              }}
              className="text-xs px-3 py-1 rounded bg-blue-600 hover:bg-blue-500 text-white"
            >
              Random Palette
            </button>
          </div>
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
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Post FX</h3>
          <button className="text-2xs text-gray-500 hover:text-white" onClick={resetPost}>Reset</button>
        </div>
        <div className="space-y-4">
          <Toggle label="Chromatic Aberration" value={activeOrb.post.chromaticAberration} onChange={(v) => updatePost('chromaticAberration', v)} />
          <Slider label="Chromatic Amount" value={activeOrb.post.chromaticAmount} min={0} max={0.01} step={0.0001} onChange={(v) => updatePost('chromaticAmount', v)} quickValues={[0, 0.001, 0.003, 0.006, 0.01]} />
          <Slider label="Vignette" value={activeOrb.post.vignette} min={0.1} max={1} step={0.01} onChange={(v) => updatePost('vignette', v)} quickValues={[0.2, 0.3, 0.4, 0.6, 0.8]} />

          <div className="pt-2 border-t border-gray-800">
            <Toggle label="Film Grain" value={activeOrb.post.filmGrain.enabled} onChange={(v) => updateFilmGrain('enabled', v)} />
            {activeOrb.post.filmGrain.enabled && (
              <Slider label="Grain Intensity" value={activeOrb.post.filmGrain.intensity} min={0} max={0.5} step={0.01} onChange={(v) => updateFilmGrain('intensity', v)} quickValues={[0.05, 0.1, 0.2, 0.3, 0.4]} />
            )}
          </div>

          <div className="pt-2 border-t border-gray-800">
            <Toggle label="Depth of Field" value={activeOrb.post.dof.enabled} onChange={(v) => updateDof('enabled', v)} />
            {activeOrb.post.dof.enabled && (
              <>
                <Slider label="Focus" value={activeOrb.post.dof.focus} min={0.1} max={3} step={0.01} onChange={(v) => updateDof('focus', v)} quickValues={[0.5, 1, 1.5, 2]} />
                <Slider label="Aperture" value={activeOrb.post.dof.aperture} min={0.00005} max={0.001} step={0.00005} onChange={(v) => updateDof('aperture', v)} />
                <Slider label="Max Blur" value={activeOrb.post.dof.maxBlur} min={0.001} max={0.02} step={0.001} onChange={(v) => updateDof('maxBlur', v)} />
              </>
            )}
          </div>
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

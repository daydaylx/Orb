import React from 'react';
import { usePresetStore } from '../../state/usePresetStore';
import { useOrbStore } from '../../state/useOrbStore';
import { defaultPresets } from '../../presets/defaultPresets';
import type { OrbConfigInternal } from '../../core/OrbConfig'; // Import both for type consistency

export const PresetPanel: React.FC = () => {
  const { presets, addPreset, deletePreset } = usePresetStore();
  const createOrb = useOrbStore((state) => state.createOrb);
  const activeOrb = useOrbStore((state) => state.orbs.find((orb) => orb.id === state.activeOrbId));

  const handleLoad = (preset: OrbConfigInternal) => {
    createOrb(preset); // Load preset as a new orb
  };

  const handleSave = () => {
    if (!activeOrb) return;
    const name = prompt('Enter preset name:', activeOrb.label || 'My Preset');
    if (name) {
      addPreset({ ...activeOrb, id: crypto.randomUUID(), label: name });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center border-b border-gray-700 pb-2 mb-4">
        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Presets</h3>
        <button onClick={handleSave} className="text-xs bg-blue-600 px-2 py-1 rounded hover:bg-blue-500">Save Current</button>
      </div>

      <div>
        <h4 className="text-xs font-bold text-gray-500 mb-3 uppercase tracking-wider">Defaults</h4>
        <div className="space-y-2">
            {defaultPresets.map(p => (
                <div key={p.id} className="flex justify-between items-center bg-gray-800 p-2 rounded cursor-pointer hover:bg-gray-700" onClick={() => handleLoad(p)}>
                    <span className="text-sm">{p.label}</span>
                </div>
            ))}
        </div>
      </div>

      {presets.length > 0 && (
        <div>
            <h4 className="text-xs font-bold text-gray-500 mb-3 uppercase tracking-wider mt-6 border-t border-gray-800 pt-4">User</h4>
            <div className="space-y-2">
                {presets.map(p => (
                    <div key={p.id} className="flex justify-between items-center bg-gray-800 p-2 rounded">
                        <span className="text-sm cursor-pointer flex-1" onClick={() => handleLoad(p)}>{p.label}</span>
                        <button onClick={(e) => { e.stopPropagation(); deletePreset(p.id); }} className="text-xs text-red-500 hover:text-red-400 ml-2">Del</button>
                    </div>
                ))}
            </div>
        </div>
      )}
    </div>
  );
};

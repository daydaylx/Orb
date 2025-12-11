import React from 'react';
import { usePresetStore } from '../../state/usePresetStore';
import { useOrbStore } from '../../state/useOrbStore';
import { defaultPresets } from '../../presets/defaultPresets';

export const PresetPanel: React.FC = () => {
  const { presets, addPreset, deletePreset } = usePresetStore();
  const { config, setConfig } = useOrbStore();

  // Combine default presets with user presets, ensuring no duplicates by ID if user overrides
  // For now just list both.

  const handleLoad = (preset: import('../../core/OrbConfig').OrbConfig) => {
    setConfig(preset);
  };

  const handleSave = () => {
    const name = prompt('Enter preset name:', config.label || 'My Preset');
    if (name) {
      addPreset({ ...config, id: crypto.randomUUID(), label: name });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center border-b border-gray-700 pb-2">
        <h3 className="text-md font-semibold text-gray-300">Presets</h3>
        <button onClick={handleSave} className="text-xs bg-blue-600 px-2 py-1 rounded hover:bg-blue-500">Save Current</button>
      </div>

      <div>
        <h4 className="text-xs font-bold text-gray-500 mb-2 uppercase">Defaults</h4>
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
            <h4 className="text-xs font-bold text-gray-500 mb-2 uppercase mt-4">User</h4>
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

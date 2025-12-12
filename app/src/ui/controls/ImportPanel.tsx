import React, { useState } from 'react';
import { useOrbStore } from '../../state/useOrbStore';
import { importOrbConfig } from '../../core/OrbConfig';

export const ImportPanel: React.FC = () => {
  const [jsonInput, setJsonInput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const createOrb = useOrbStore((state) => state.createOrb);
  const setActiveOrb = useOrbStore((state) => state.setActiveOrb);

  const handleImport = () => {
    setError(null);
    setSuccess(null);
    try {
      const importedConfig = importOrbConfig(jsonInput);
      // Create a new orb with the imported settings
      createOrb({
        ...importedConfig,
        id: undefined, // Let createOrb generate a new ID to avoid collisions
        label: `${importedConfig.label} (Imported)`,
      });
      setSuccess("Orb imported successfully!");
      setJsonInput('');
    } catch (e: any) {
      setError(e.message);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setJsonInput(content);
      // Auto-trigger import could be added here, but let's let the user review first
    };
    reader.readAsText(file);
  };

  return (
    <div className="p-4 bg-gray-900 rounded-lg border border-gray-800">
      <h3 className="text-sm font-bold text-gray-200 mb-3">Import Config</h3>

      <div className="mb-4">
        <label className="block text-xs text-gray-400 mb-1">Upload JSON File</label>
        <input
            type="file"
            accept=".json"
            onChange={handleFileUpload}
            className="block w-full text-xs text-gray-400
              file:mr-4 file:py-2 file:px-4
              file:rounded file:border-0
              file:text-xs file:font-semibold
              file:bg-gray-800 file:text-blue-400
              hover:file:bg-gray-700
            "
        />
      </div>

      <div className="mb-4">
        <label className="block text-xs text-gray-400 mb-1">Or Paste JSON Content</label>
        <textarea
          value={jsonInput}
          onChange={(e) => setJsonInput(e.target.value)}
          className="w-full h-32 bg-gray-950 text-gray-300 text-xs font-mono p-2 border border-gray-700 rounded focus:border-blue-500 outline-none resize-none"
          placeholder="{ ... }"
        />
      </div>

      {error && (
        <div className="mb-3 text-xs text-red-400 bg-red-900/20 p-2 rounded border border-red-900">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-3 text-xs text-green-400 bg-green-900/20 p-2 rounded border border-green-900">
          {success}
        </div>
      )}

      <button
        onClick={handleImport}
        disabled={!jsonInput.trim()}
        className="w-full py-2 bg-blue-600 hover:bg-blue-500 disabled:bg-gray-700 disabled:text-gray-500 text-white text-xs font-bold rounded transition-colors"
      >
        Import Orb
      </button>
    </div>
  );
};

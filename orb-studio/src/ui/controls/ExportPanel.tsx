import React, { useState } from 'react';
import { useOrbStore } from '../../state/useOrbStore';
import { exportOrbConfigToJson } from '../../core/OrbConfig';

export const ExportPanel: React.FC = () => {
  const { config } = useOrbStore();
  const [copyFeedback, setCopyFeedback] = useState<string | null>(null);

  const handleCopy = async () => {
    try {
      const json = exportOrbConfigToJson(config);
      await navigator.clipboard.writeText(json);
      setCopyFeedback('Config copied!');
      setTimeout(() => setCopyFeedback(null), 2000);
    } catch (err) {
      console.error('Failed to copy to clipboard', err);
      setCopyFeedback('Failed to copy');
    }
  };

  const handleDownload = () => {
    try {
        const json = exportOrbConfigToJson(config);
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${config.id || 'orb-config'}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    } catch (err) {
        console.error('Failed to download', err);
    }
  };

  return (
    <div className="panel p-4 bg-gray-900 rounded-lg flex flex-col gap-4 border border-gray-800">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold text-gray-200">Export</h3>
        {copyFeedback && <span className="text-green-400 text-xs animate-pulse">{copyFeedback}</span>}
      </div>
      <div className="flex gap-2">
        <button
          className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded text-sm font-medium flex-1 transition-colors"
          onClick={handleCopy}
        >
          Copy JSON
        </button>
         <button
          className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-1.5 rounded text-sm font-medium flex-1 transition-colors"
          onClick={handleDownload}
        >
          Download
        </button>
      </div>
    </div>
  );
};

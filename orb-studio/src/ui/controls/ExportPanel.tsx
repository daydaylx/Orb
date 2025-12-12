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
      setCopyFeedback('Copied!');
      setTimeout(() => setCopyFeedback(null), 2000);
    } catch (err) {
      console.error('Failed to copy', err);
      setCopyFeedback('Error copying');
    }
  };

  const handleDownload = () => {
    const json = exportOrbConfigToJson(config);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `orb-${config.id || 'config'}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="p-4 bg-gray-800 rounded-lg border border-gray-700">
        <h3 className="text-sm font-medium text-gray-300 mb-4 uppercase tracking-wider">Export</h3>
        <div className="space-y-3">
          <button
            onClick={handleCopy}
            className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded font-medium transition-colors flex justify-center items-center"
          >
            {copyFeedback || 'Copy JSON'}
          </button>
          <button
            onClick={handleDownload}
            className="w-full px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded font-medium transition-colors border border-gray-600"
          >
            Download JSON
          </button>
        </div>
        <div className="mt-4 text-xs text-gray-500">
            Export format: OrbConfigExternalV1
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { useOrbStore } from '../../state/useOrbStore';
import { exportAsJSON, exportAsTypeScript } from '../../utils/export';

export const HeaderBar: React.FC = () => {
  const { config } = useOrbStore();

  const handleCopyJSON = () => {
    const json = exportAsJSON(config);
    navigator.clipboard.writeText(json).then(() => alert('JSON copied to clipboard!'));
  };

  const handleCopyTS = () => {
    const ts = exportAsTypeScript(config);
    navigator.clipboard.writeText(ts).then(() => alert('TypeScript copied to clipboard!'));
  };

  return (
    <div className="flex w-full items-center justify-between">
      <h1 className="text-lg font-bold">Orb Studio</h1>
      <div className="flex gap-2">
         <button onClick={handleCopyJSON} className="text-xs bg-gray-700 px-3 py-1 rounded hover:bg-gray-600">Copy JSON</button>
         <button onClick={handleCopyTS} className="text-xs bg-gray-700 px-3 py-1 rounded hover:bg-gray-600">Copy TS</button>
      </div>
    </div>
  );
};

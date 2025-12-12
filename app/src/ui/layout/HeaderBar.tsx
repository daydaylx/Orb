import React from 'react';

interface HeaderBarProps {
  fps: number | null;
  quality: 'high' | 'low';
  onToggleQuality: () => void;
}

export const HeaderBar: React.FC<HeaderBarProps> = ({ fps, quality, onToggleQuality }) => {
  const fpsText = fps ? `${Math.round(fps)} fps` : '– fps';
  const fpsColor = fps && fps < 30 ? 'text-amber-400' : 'text-gray-400';

  return (
    <div className="flex w-full items-center justify-between">
      <h1 className="text-lg font-bold">Orb Studio</h1>
      <div className="flex items-center gap-3">
        <span className={`text-xs ${fpsColor}`}>{fpsText}</span>
        <button
          onClick={onToggleQuality}
          className="px-3 py-1 text-xs rounded border border-gray-700 bg-gray-800 hover:bg-gray-700"
          title="Schaltet zwischen High/Low Qualität (Pixelratio & Post-Effekte)"
        >
          Quality: {quality === 'high' ? 'High' : 'Low'}
        </button>
      </div>
    </div>
  );
};

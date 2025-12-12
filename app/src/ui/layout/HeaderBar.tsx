import React from 'react';

interface HeaderBarProps {
  fps: number | null;
  quality: 'high' | 'medium' | 'low';
  onToggleQuality: () => void;
  onOptimize?: () => void;
}

export const HeaderBar: React.FC<HeaderBarProps> = ({ fps, quality, onToggleQuality, onOptimize }) => {
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
          title="Schaltet High/Medium/Low Qualität (Pixelratio & Post-Effekte)"
        >
          Quality: {quality === 'high' ? 'High' : quality === 'medium' ? 'Medium' : 'Low'}
        </button>
        {onOptimize && (
          <button
            onClick={onOptimize}
            className="px-3 py-1 text-xs rounded border border-amber-500 text-amber-200 hover:bg-amber-500 hover:text-black transition-colors"
            title="Setzt Qualität auf Low und deaktiviert schwere Effekte für maximale FPS."
          >
            Optimize
          </button>
        )}
      </div>
    </div>
  );
};

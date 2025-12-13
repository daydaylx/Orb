import React, { useEffect } from 'react';
import { useOrbStore } from '../../state/useOrbStore';

interface HeaderBarProps {
  fps: number | null;
  quality: 'high' | 'medium' | 'low';
  onToggleQuality: () => void;
  onOptimize?: () => void;
}

export const HeaderBar: React.FC<HeaderBarProps> = ({ fps, quality, onToggleQuality, onOptimize }) => {
  const fpsText = fps ? `${Math.round(fps)} fps` : '– fps';

  // Use temporal store for undo/redo
  const { undo, redo, futureStates, pastStates } = useOrbStore.temporal.getState();
  const canUndo = pastStates.length > 0;
  const canRedo = futureStates.length > 0;

  // Subscribe to changes in history
  const [, setHistoryLength] = React.useState(0);
  useEffect(() => {
    return useOrbStore.temporal.subscribe((state) => {
      setHistoryLength(state.pastStates.length + state.futureStates.length);
    });
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        e.preventDefault();
        if (e.shiftKey) {
            if (useOrbStore.temporal.getState().futureStates.length > 0) redo();
        } else {
            if (useOrbStore.temporal.getState().pastStates.length > 0) undo();
        }
      } else if ((e.ctrlKey || e.metaKey) && e.key === 'y') {
         e.preventDefault();
         if (useOrbStore.temporal.getState().futureStates.length > 0) redo();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo]);
  const fpsColor = fps && fps < 30 ? 'text-amber-400' : 'text-gray-400';

  return (
    <div className="flex w-full items-center justify-between">
      <h1 className="text-lg font-bold">Orb Studio</h1>
      <div className="flex items-center gap-3">
        <div className="flex bg-gray-800 rounded border border-gray-700 mr-2">
            <button
                onClick={() => undo()}
                disabled={!canUndo}
                className={`px-3 py-1 text-xs border-r border-gray-700 ${!canUndo ? 'text-gray-500 cursor-not-allowed' : 'text-white hover:bg-gray-700'}`}
                title="Undo (Ctrl+Z)"
            >
                Undo
            </button>
            <button
                onClick={() => redo()}
                disabled={!canRedo}
                className={`px-3 py-1 text-xs ${!canRedo ? 'text-gray-500 cursor-not-allowed' : 'text-white hover:bg-gray-700'}`}
                title="Redo (Ctrl+Shift+Z / Ctrl+Y)"
            >
                Redo
            </button>
        </div>

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

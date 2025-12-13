import { useEffect, useState } from 'react';
import { useOrbStore } from '../state/useOrbStore';

export function useKeyboard() {
  const [showHelp, setShowHelp] = useState(false);
  const undo = useOrbStore.temporal.getState().undo;
  const redo = useOrbStore.temporal.getState().redo;
  // Subscribe to changes to know if we can undo/redo
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

  useEffect(() => {
    return useOrbStore.temporal.subscribe((state) => {
        setCanUndo(state.pastStates.length > 0);
        setCanRedo(state.futureStates.length > 0);
    });
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isMod = e.ctrlKey || e.metaKey;

      // Undo
      if (isMod && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        const { pastStates } = useOrbStore.temporal.getState();
        if (pastStates.length > 0) undo();
      }

      // Redo
      if (isMod && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
        e.preventDefault();
        const { futureStates } = useOrbStore.temporal.getState();
        if (futureStates.length > 0) redo();
      }

      // Help
      if (isMod && e.key === '/') {
        e.preventDefault();
        setShowHelp(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo]);

  return { showHelp, setShowHelp, canUndo, canRedo, undo, redo };
}

import { useEffect, useRef, useState } from 'react';
import { LookPanel } from './ui/controls/LookPanel';
import { MotionPanel } from './ui/controls/MotionPanel';
import { DetailsPanel } from './ui/controls/DetailsPanel';
import { PresetPanel } from './ui/controls/PresetPanel';
import { ExportPanel } from './ui/controls/ExportPanel';
import { ImportPanel } from './ui/controls/ImportPanel';
import { OrbPanel } from './ui/controls/OrbPanel'; // Import OrbPanel
import { Shell } from './ui/layout/Shell';
import { HeaderBar } from './ui/layout/HeaderBar';
import { OrbRenderer } from './core/OrbRenderer';
import { useOrbStore } from './state/useOrbStore';
import { usePlaybackStore } from './state/usePlaybackStore';
import { fromExternalConfig } from './core/OrbConfig';

function App() {
  const activeOrb = useOrbStore((state) => state.orbs.find((orb) => orb.id === state.activeOrbId) || state.orbs[0]);
  const [activeTab, setActiveTab] = useState<'orbs' | 'look' | 'motion' | 'details' | 'presets' | 'export' | 'import'>('orbs');
   const [quality, setQuality] = useState<'high' | 'medium' | 'low'>('high');
   const [fps, setFps] = useState<number | null>(null);
   const lowFpsTimer = useRef<number | null>(null);
  const playbackMode = usePlaybackStore((s) => s.mode);
  const scrubT = usePlaybackStore((s) => s.scrubT);
  const updateActiveOrb = useOrbStore((state) => state.updateActiveOrb);
  const createOrb = useOrbStore((state) => state.createOrb);
  const setActiveOrb = useOrbStore((state) => state.setActiveOrb);

  const tabs = [
    { id: 'orbs', label: 'Orbs' },
    { id: 'look', label: 'Look' },
    { id: 'motion', label: 'Motion' },
    { id: 'details', label: 'Details' },
    { id: 'presets', label: 'Presets' },
    { id: 'export', label: 'Export' },
    { id: 'import', label: 'Import' },
  ] as const;

  // Auto downgrade quality if FPS bleibt längere Zeit niedrig
  useEffect(() => {
    if (fps === null) return;
    if (fps < 30 && quality !== 'low') {
      if (!lowFpsTimer.current) {
        lowFpsTimer.current = window.setTimeout(() => {
          setQuality((q) => (q === 'high' ? 'medium' : 'low'));
          lowFpsTimer.current = null;
        }, 1500);
      }
    } else if (lowFpsTimer.current) {
      window.clearTimeout(lowFpsTimer.current);
      lowFpsTimer.current = null;
    }
  }, [fps, quality]);

  // Load shared config from URL (?orb=...)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const encoded = params.get('orb');
    if (encoded) {
      try {
        const json = decodeURIComponent(atob(encoded));
        const external = JSON.parse(json);
        const internal = fromExternalConfig(external);
        createOrb(internal);
        setActiveOrb(internal.id);
      } catch (e) {
        console.warn('Failed to import shared orb config', e);
      }
    }
  }, [createOrb, setActiveOrb]);

  const sidebarContent = (
    <div className="flex flex-col h-full">
      <div className="grid grid-cols-3 gap-2 mb-6 border-b border-gray-800 pb-4">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-2 py-1.5 rounded text-xs font-medium transition-colors ${
              activeTab === tab.id
                ? 'bg-gray-700 text-white shadow-sm'
                : 'text-gray-400 hover:text-white hover:bg-gray-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
        {activeTab === 'orbs' && <OrbPanel />}
        {activeTab === 'look' && <LookPanel />}
        {activeTab === 'motion' && <MotionPanel />}
        {activeTab === 'details' && <DetailsPanel />}
        {activeTab === 'presets' && <PresetPanel />}
        {activeTab === 'export' && <ExportPanel />}
        {activeTab === 'import' && <ImportPanel />}
      </div>
    </div>
  );

  const cycleQuality = () => setQuality((q) => (q === 'high' ? 'medium' : q === 'medium' ? 'low' : 'high'));

  const handleOptimize = () => {
    setQuality('low');
    updateActiveOrb((prev) => ({
      bloom: { ...prev.bloom, enabled: false, strength: Math.min(prev.bloom.strength, 1) },
      post: {
        ...prev.post,
        chromaticAberration: false,
        filmGrain: { ...prev.post.filmGrain, enabled: false },
        dof: { ...prev.post.dof, enabled: false },
      },
    }));
  };

  return (
    <Shell sidebar={sidebarContent} header={<HeaderBar fps={fps} quality={quality} onToggleQuality={cycleQuality} onOptimize={handleOptimize} />}>
      <OrbRenderer config={activeOrb} quality={quality} playbackMode={playbackMode} scrubT={scrubT} onFps={setFps} className="w-full h-full" />
    </Shell>
  );
}

export default App;

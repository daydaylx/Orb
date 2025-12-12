import { useState } from 'react';
import { LookPanel } from './ui/controls/LookPanel';
import { MotionPanel } from './ui/controls/MotionPanel';
import { DetailsPanel } from './ui/controls/DetailsPanel';
import { PresetPanel } from './ui/controls/PresetPanel';
import { ExportPanel } from './ui/controls/ExportPanel';
import { OrbPanel } from './ui/controls/OrbPanel'; // Import OrbPanel
import { Shell } from './ui/layout/Shell';
import { HeaderBar } from './ui/layout/HeaderBar';
import { OrbRenderer } from './core/OrbRenderer';
import { useOrbStore } from './state/useOrbStore';

function App() {
  const activeOrb = useOrbStore((state) => state.orbs.find((orb) => orb.id === state.activeOrbId) || state.orbs[0]);
  const [activeTab, setActiveTab] = useState<'orbs' | 'look' | 'motion' | 'details' | 'presets' | 'export'>('orbs'); // 'orbs' as initial tab

  const sidebarContent = (
    <div className="flex flex-col h-full">
      <div className="flex space-x-1 mb-6 border-b border-gray-800 pb-4 overflow-x-auto">
        <button
          onClick={() => setActiveTab('orbs')}
          className={`px-3 py-1 rounded text-sm ${activeTab === 'orbs' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white'}`}
        >
          Orbs
        </button>
        <button
          onClick={() => setActiveTab('look')}
          className={`px-3 py-1 rounded text-sm ${activeTab === 'look' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white'}`}
        >
          Look
        </button>
        <button
          onClick={() => setActiveTab('motion')}
          className={`px-3 py-1 rounded text-sm ${activeTab === 'motion' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white'}`}
        >
          Motion
        </button>
        <button
          onClick={() => setActiveTab('details')}
          className={`px-3 py-1 rounded text-sm ${activeTab === 'details' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white'}`}
        >
          Details
        </button>
        <button
          onClick={() => setActiveTab('presets')}
          className={`px-3 py-1 rounded text-sm ${activeTab === 'presets' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white'}`}
        >
          Presets
        </button>
        <button
          onClick={() => setActiveTab('export')}
          className={`px-3 py-1 rounded text-sm ${activeTab === 'export' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white'}`}
        >
          Export
        </button>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
        {activeTab === 'orbs' && <OrbPanel />}
        {activeTab === 'look' && <LookPanel />}
        {activeTab === 'motion' && <MotionPanel />}
        {activeTab === 'details' && <DetailsPanel />}
        {activeTab === 'presets' && <PresetPanel />}
        {activeTab === 'export' && <ExportPanel />}
      </div>
    </div>
  );

  return (
    <Shell sidebar={sidebarContent} header={<HeaderBar />}>
      <OrbRenderer config={activeOrb} className="w-full h-full" />
    </Shell>
  );
}

export default App;

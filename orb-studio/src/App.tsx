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
  const [activeTab, setActiveTab] = useState<'orbs' | 'look' | 'motion' | 'details' | 'presets' | 'export'>('orbs');

  const tabs = [
    { id: 'orbs', label: 'Orbs' },
    { id: 'look', label: 'Look' },
    { id: 'motion', label: 'Motion' },
    { id: 'details', label: 'Details' },
    { id: 'presets', label: 'Presets' },
    { id: 'export', label: 'Export' },
  ] as const;

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

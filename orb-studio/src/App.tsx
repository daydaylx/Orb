import { useState } from 'react';
import { LookPanel } from './ui/controls/LookPanel';
import { MotionPanel } from './ui/controls/MotionPanel';
import { DetailsPanel } from './ui/controls/DetailsPanel';
import { PresetPanel } from './ui/controls/PresetPanel';
import { ExportPanel } from './ui/controls/ExportPanel';
import { OrbListPanel } from './ui/controls/OrbListPanel';
import { Shell } from './ui/layout/Shell';
import { HeaderBar } from './ui/layout/HeaderBar';
import { OrbRenderer } from './core/OrbRenderer';
import { useOrbStore } from './state/useOrbStore';

function App() {
  const { config } = useOrbStore();
  const [activeTab, setActiveTab] = useState<'look' | 'motion' | 'details' | 'presets'>('look');

  const tabs = [
    { id: 'look', label: 'Look' },
    { id: 'motion', label: 'Motion' },
    { id: 'details', label: 'Details' },
    { id: 'presets', label: 'Presets' },
  ] as const;

  const sidebarContent = (
    <div className="flex flex-col h-full bg-gray-900">
      {/* Top Section: Orbs Management */}
      <div className="p-4 border-b border-gray-800">
        <div className="section-header mb-2">Project</div>
        <OrbListPanel />
      </div>

      {/* Middle Section: Editor Tabs */}
      <div className="flex-1 flex flex-col min-h-0">
        <div className="px-4 pt-4">
           <div className="flex space-x-1 bg-gray-800 p-1 rounded-lg">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 py-1.5 rounded-md text-xs font-medium transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-gray-700 text-white shadow-sm'
                    : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
          <div className="flex flex-col gap-6">
            {activeTab === 'look' && (
              <>
                 <h4 className="section-header">Appearance</h4>
                 <LookPanel />
              </>
            )}
            {activeTab === 'motion' && (
               <>
                 <h4 className="section-header">Movement & Noise</h4>
                 <MotionPanel />
               </>
            )}
            {activeTab === 'details' && (
               <>
                 <h4 className="section-header">Fine Tuning</h4>
                 <DetailsPanel />
               </>
            )}
            {activeTab === 'presets' && (
               <>
                 <h4 className="section-header">Library</h4>
                 <PresetPanel />
               </>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Section: Export */}
      <div className="p-4 border-t border-gray-800 bg-gray-900">
        <div className="section-header">Output</div>
        <ExportPanel />
      </div>
    </div>
  );

  return (
    <Shell sidebar={sidebarContent} header={<HeaderBar />}>
      <OrbRenderer config={config} className="w-full h-full" />
    </Shell>
  );
}

export default App;

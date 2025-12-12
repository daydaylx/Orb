import React from 'react';
import { useOrbStore } from '../../state/useOrbStore';

export const OrbListPanel: React.FC = () => {
  const { orbs, activeOrbId, setActiveOrb, createOrb, duplicateOrb, deleteOrb } = useOrbStore();

  return (
    <div className="panel p-4 bg-gray-900 rounded-lg flex flex-col gap-4 border border-gray-800">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold text-gray-200">Orbs</h3>
        <button
          onClick={() => createOrb()}
          className="bg-green-700 hover:bg-green-600 text-white text-xs px-2 py-1 rounded"
        >
          + New
        </button>
      </div>

      <div className="flex flex-col gap-2 max-h-40 overflow-y-auto custom-scrollbar">
        {orbs.map((orb) => (
          <div
            key={orb.id}
            className={`flex items-center justify-between p-2 rounded cursor-pointer transition-colors ${orb.id === activeOrbId ? 'bg-blue-900 border border-blue-700' : 'bg-gray-800 hover:bg-gray-700'}`}
            onClick={() => setActiveOrb(orb.id)}
          >
            <div className="flex items-center gap-2 flex-1 overflow-hidden">
              <div
                className="w-3 h-3 rounded-full border border-gray-600 flex-shrink-0"
                style={{ background: orb.colors.inner }}
              />
              <span className="text-sm truncate">{orb.name}</span>
            </div>
            <div className="flex items-center gap-1">
              <button
                className="text-gray-400 hover:text-white p-1"
                title="Duplicate"
                onClick={(e) => { e.stopPropagation(); duplicateOrb(orb.id); }}
              >
                <span className="text-xs" aria-label="Duplicate">📋</span>
              </button>
              <button
                className={`p-1 ${orbs.length > 1 ? 'text-gray-400 hover:text-red-400' : 'text-gray-600 cursor-not-allowed'}`}
                title="Delete"
                onClick={(e) => { e.stopPropagation(); deleteOrb(orb.id); }}
                disabled={orbs.length <= 1}
              >
                <span className="text-xs">×</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

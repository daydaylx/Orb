import React from 'react';
import { useOrbStore } from '../../state/useOrbStore';

export const OrbPanel: React.FC = () => {
  const { orbs, activeOrbId, createOrb, duplicateOrb, deleteOrb, setActiveOrb } = useOrbStore();

  return (
    <div className="space-y-6">
      <h3 className="text-sm font-medium text-gray-300 mb-4 uppercase tracking-wider">Orbs</h3>
      <div className="space-y-2">
        {orbs.map((orb) => (
          <div
            key={orb.id}
            className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors ${
              orb.id === activeOrbId ? 'bg-blue-700' : 'bg-gray-800 hover:bg-gray-700'
            }`}
            onClick={() => setActiveOrb(orb.id)}
          >
            <span className="text-sm">{orb.label}</span>
            <div className="flex space-x-2">
              <button
                onClick={(e) => {
                  e.stopPropagation(); // Prevent activating orb when duplicating
                  duplicateOrb(orb.id);
                }}
                className="text-xs text-gray-400 hover:text-white"
                title="Duplicate Orb"
              >
                [D]
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation(); // Prevent activating orb when deleting
                  if (window.confirm(`Are you sure you want to delete "${orb.label}"?`)) {
                    deleteOrb(orb.id);
                  }
                }}
                className="text-xs text-red-400 hover:text-red-300"
                title="Delete Orb"
                disabled={orbs.length === 1} // Disable delete if only one orb
              >
                [X]
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="flex space-x-2 mt-4">
        <button
          onClick={() => createOrb()}
          className="w-full px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded font-medium transition-colors"
        >
          New Orb
        </button>
      </div>
    </div>
  );
};

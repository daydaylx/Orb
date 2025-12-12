import React from 'react';

interface ToggleProps {
  label: string;
  value: boolean;
  onChange: (value: boolean) => void;
}

export const Toggle: React.FC<ToggleProps> = ({ label, value, onChange }) => {
  return (
    <div className="flex items-center justify-between">
      <span className="text-xs text-gray-400">{label}</span>
      <button
        onClick={() => onChange(!value)}
        className={`w-10 h-5 rounded-full relative transition-colors ${
          value ? 'bg-blue-600' : 'bg-gray-600'
        }`}
      >
        <div
          className={`w-3 h-3 bg-white rounded-full absolute top-1 transition-all ${
            value ? 'left-6' : 'left-1'
          }`}
        />
      </button>
    </div>
  );
};

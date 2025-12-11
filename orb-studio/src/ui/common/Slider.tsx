import React from 'react';

interface SliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (value: number) => void;
}

export const Slider: React.FC<SliderProps> = ({ label, value, min, max, step = 0.01, onChange }) => {
  return (
    <div className="mb-4">
      <div className="flex justify-between mb-1">
        <label className="text-sm text-gray-400">{label}</label>
        <span className="text-sm text-gray-500">{value.toFixed(2)}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
      />
    </div>
  );
};

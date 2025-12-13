import React from 'react';
import { validateNumber } from '../../utils/validation';

interface SliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  quickValues?: number[];
  title?: string;
  onChange: (value: number) => void;
}

export const Slider: React.FC<SliderProps> = ({ label, value, min, max, step = 0.01, quickValues, title, onChange }) => {
  const handleChange = (rawValue: number) => {
    const validatedValue = validateNumber(rawValue, min, max);
    onChange(validatedValue);
  };

  // Ensure current value is valid
  const safeValue = validateNumber(value, min, max);

  return (
    <div className="mb-4">
      <div className="flex justify-between mb-1">
        <label className="text-sm text-gray-400" title={title}>{label}</label>
        <span className="text-sm text-gray-500">{safeValue.toFixed(2)}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={safeValue}
        onChange={(e) => handleChange(parseFloat(e.target.value))}
        className="w-full h-3 md:h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
      />
      {quickValues && quickValues.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2">
          {quickValues.map((v) => (
            <button
              key={v}
              type="button"
              className={`px-3 py-1.5 text-xs rounded border border-gray-700 ${Math.abs(value - v) < step ? 'bg-gray-700' : 'bg-gray-800 hover:bg-gray-700'}`}
              onClick={() => handleChange(v)}
            >
              {v}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

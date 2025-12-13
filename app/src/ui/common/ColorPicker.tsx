import React from 'react';
import { validateColor } from '../../utils/validation';

interface ColorPickerProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

export const ColorPicker: React.FC<ColorPickerProps> = ({ label, value, onChange }) => {
  const handleChange = (rawValue: string) => {
    const validatedColor = validateColor(rawValue);
    onChange(validatedColor);
  };

  // Ensure current value is valid
  const safeValue = validateColor(value);

  return (
    <div className="mb-4 flex items-center justify-between">
      <label className="text-sm text-gray-400">{label}</label>
      <input
        type="color"
        value={safeValue}
        onChange={(e) => handleChange(e.target.value)}
        className="w-8 h-8 rounded border-none cursor-pointer bg-transparent"
      />
    </div>
  );
};

import React from 'react';

interface Props {
  min: number;
  max: number;
  value: number;
  onChange: (val: number) => void;
}

const BudgetSlider: React.FC<Props> = ({ min, max, value, onChange }) => {
  return (
    <div className="mb-4">
      <label className="block mb-2 font-medium text-gray-900 dark:text-white">
        Budget: ${value}
      </label>
      <input
        type="range"
        min={min}
        max={max}
        step={25}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-primary-600"
      />
      <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mt-1">
        <span>${min}</span>
        <span>${max}</span>
      </div>
    </div>
  );
};

export default BudgetSlider;

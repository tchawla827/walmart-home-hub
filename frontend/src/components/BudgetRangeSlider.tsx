import React from 'react';

interface Props {
  min: number;
  max: number;
  values: [number, number];
  onChange: (vals: [number, number]) => void;
}

const BudgetRangeSlider: React.FC<Props> = ({ min, max, values, onChange }) => {
  const [minVal, maxVal] = values;

  const handleMin = (val: number) => {
    const newMin = Math.min(val, maxVal);
    onChange([newMin, maxVal]);
  };

  const handleMax = (val: number) => {
    const newMax = Math.max(val, minVal);
    onChange([minVal, newMax]);
  };

  return (
    <div className="mb-4">
      <label className="block mb-2 font-medium text-gray-900 dark:text-white">
        Budget: ${minVal} - ${maxVal}
      </label>
      <div className="flex items-center space-x-2">
        <input
          type="range"
          min={min}
          max={max}
          step={25}
          value={minVal}
          onChange={(e) => handleMin(Number(e.target.value))}
          className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-primary-600"
        />
        <input
          type="range"
          min={min}
          max={max}
          step={25}
          value={maxVal}
          onChange={(e) => handleMax(Number(e.target.value))}
          className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-primary-600"
        />
      </div>
      <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mt-1">
        <span>${min}</span>
        <span>${max}</span>
      </div>
    </div>
  );
};

export default BudgetRangeSlider;

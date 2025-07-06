import React from 'react';
import Slider, { Range } from 'rc-slider';
import 'rc-slider/assets/index.css';

interface Props {
  min: number;
  max: number;
  values: [number, number];
  onChange: (vals: [number, number]) => void;
}

const BudgetRangeSlider: React.FC<Props> = ({ min, max, values, onChange }) => {
  const [minVal, maxVal] = values;

  const handleChange = (vals: number[]) => {
    const [newMin, newMax] = vals;
    onChange([newMin, newMax]);
  };

  return (
    <div className="mb-4">
      <label className="block mb-2 font-medium text-gray-900 dark:text-white">
        Budget: ${minVal} - ${maxVal}
      </label>
      <Range
        min={min}
        max={max}
        step={25}
        allowCross={false}
        value={[minVal, maxVal]}
        onChange={handleChange}
        trackStyle={[{ backgroundColor: '#3b82f6' }]}
        handleStyle={[
          { borderColor: '#3b82f6' },
          { borderColor: '#3b82f6' },
        ]}
        railStyle={{ backgroundColor: '#e5e7eb' }}
      />
      <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mt-1">
        <span>${min}</span>
        <span>${max}</span>
      </div>
    </div>
  );
};

export default BudgetRangeSlider;

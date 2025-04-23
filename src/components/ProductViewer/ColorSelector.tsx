'use client';

import React from 'react';

interface ColorOption {
  name: string;
  value: string;
}

interface ColorSelectorProps {
  availableColors: ColorOption[];
  currentColor: string;
  onColorChange: (color: string) => void;
}

export default function ColorSelector({
  availableColors,
  currentColor,
  onColorChange
}: ColorSelectorProps) {
  return (
    <div className="flex flex-col space-y-4">
      <div className="grid grid-cols-2 gap-3">
        {availableColors.map((color) => (
          <button
            key={color.value}
            className={`color-option ${
              currentColor === color.value
                ? 'color-option-active'
                : 'color-option-inactive'
            }`}
            onClick={() => onColorChange(color.value)}
            aria-label={`Select ${color.name} color`}
          >
            <div
              className="color-swatch"
              style={{ backgroundColor: color.value }}
              aria-hidden="true"
            />
            <span className="text-sm font-medium">{color.name}</span>
          </button>
        ))}
      </div>
      
      <div className="pt-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Current Selection:</span>
          <div className="flex items-center">
            <div
              className="w-4 h-4 rounded-full mr-1"
              style={{ backgroundColor: currentColor }}
            />
            <span className="text-sm">
              {availableColors.find(c => c.value === currentColor)?.name || 'Custom'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
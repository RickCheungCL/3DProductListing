'use client';

import React from 'react';

interface LogoPosition {
  x: number;
  y: number;
  z: number;
}

interface LogoRotation {
  x: number;
  y: number;
  z: number;
}

interface LogoSettings {
  visible: boolean;
  position: LogoPosition;
  rotation: LogoRotation;
  scale: number;
}

interface LogoControlsProps {
  logoSettings: LogoSettings;
  onSettingsChange: (settings: Partial<LogoSettings>) => void;
}

export default function LogoControls({
  logoSettings,
  onSettingsChange
}: LogoControlsProps) {
  // Handle toggle visibility
  const handleVisibilityToggle = () => {
    onSettingsChange({ visible: !logoSettings.visible });
  };

  // Handle position change
  const handlePositionChange = (axis: keyof LogoPosition, value: number) => {
    onSettingsChange({
      position: {
        ...logoSettings.position,
        [axis]: value
      }
    });
  };

  // Handle rotation change
  const handleRotationChange = (axis: keyof LogoRotation, value: number) => {
    onSettingsChange({
      rotation: {
        ...logoSettings.rotation,
        [axis]: value
      }
    });
  };

  // Handle scale change
  const handleScaleChange = (value: number) => {
    onSettingsChange({ scale: value });
  };

  return (
    <div className="flex flex-col space-y-4">
      {/* Logo Visibility Toggle */}
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">Show Logo</span>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            className="sr-only peer"
            checked={logoSettings.visible}
            onChange={handleVisibilityToggle}
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
        </label>
      </div>

      {/* Position Controls - Only show if logo is visible */}
      {logoSettings.visible && (
        <>
          <div className="pt-2">
            <h3 className="text-sm font-semibold mb-2">Position</h3>
            <div className="grid grid-cols-3 gap-2">
              {/* X Position */}
              <div className="flex flex-col">
                <label className="text-xs mb-1">X Position</label>
                <input
                  type="range"
                  min="-2"
                  max="2"
                  step="0.1"
                  value={logoSettings.position.x}
                  onChange={(e) => handlePositionChange('x', parseFloat(e.target.value))}
                  className="control-slider"
                />
                <span className="text-xs text-center mt-1">
                  {logoSettings.position.x.toFixed(1)}
                </span>
              </div>

              {/* Y Position */}
              <div className="flex flex-col">
                <label className="text-xs mb-1">Y Position</label>
                <input
                  type="range"
                  min="-2"
                  max="2"
                  step="0.1"
                  value={logoSettings.position.y}
                  onChange={(e) => handlePositionChange('y', parseFloat(e.target.value))}
                  className="w-full"
                />
                <span className="text-xs text-center mt-1">
                  {logoSettings.position.y.toFixed(1)}
                </span>
              </div>

              {/* Z Position */}
              <div className="flex flex-col">
                <label className="text-xs mb-1">Z Position</label>
                <input
                  type="range"
                  min="-2"
                  max="2"
                  step="0.1"
                  value={logoSettings.position.z}
                  onChange={(e) => handlePositionChange('z', parseFloat(e.target.value))}
                  className="w-full"
                />
                <span className="text-xs text-center mt-1">
                  {logoSettings.position.z.toFixed(1)}
                </span>
              </div>
            </div>
          </div>

          {/* Rotation Controls */}
          <div className="pt-2">
            <h3 className="text-sm font-semibold mb-2">Rotation</h3>
            <div className="grid grid-cols-3 gap-2">
              {/* X Rotation */}
              <div className="flex flex-col">
                <label className="text-xs mb-1">X Rotation</label>
                <input
                  type="range"
                  min="0"
                  max="6.28" // 2*PI
                  step="0.1"
                  value={logoSettings.rotation.x}
                  onChange={(e) => handleRotationChange('x', parseFloat(e.target.value))}
                  className="w-full"
                />
                <span className="text-xs text-center mt-1">
                  {(logoSettings.rotation.x * 57.3).toFixed(0)}°
                </span>
              </div>

              {/* Y Rotation */}
              <div className="flex flex-col">
                <label className="text-xs mb-1">Y Rotation</label>
                <input
                  type="range"
                  min="0"
                  max="6.28" // 2*PI
                  step="0.1"
                  value={logoSettings.rotation.y}
                  onChange={(e) => handleRotationChange('y', parseFloat(e.target.value))}
                  className="w-full"
                />
                <span className="text-xs text-center mt-1">
                  {(logoSettings.rotation.y * 57.3).toFixed(0)}°
                </span>
              </div>

              {/* Z Rotation */}
              <div className="flex flex-col">
                <label className="text-xs mb-1">Z Rotation</label>
                <input
                  type="range"
                  min="0"
                  max="6.28" // 2*PI
                  step="0.1"
                  value={logoSettings.rotation.z}
                  onChange={(e) => handleRotationChange('z', parseFloat(e.target.value))}
                  className="w-full"
                />
                <span className="text-xs text-center mt-1">
                  {(logoSettings.rotation.z * 57.3).toFixed(0)}°
                </span>
              </div>
            </div>
          </div>

          {/* Scale Control */}
          <div className="pt-2">
            <h3 className="text-sm font-semibold mb-2">Size</h3>
            <div className="flex flex-col">
              <input
                type="range"
                min="0.1"
                max="2"
                step="0.1"
                value={logoSettings.scale}
                onChange={(e) => handleScaleChange(parseFloat(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between mt-1">
                <span className="text-xs">Small</span>
                <span className="text-xs">Large</span>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Preset positions */}
      {logoSettings.visible && (
        <div className="pt-2">
          <h3 className="text-sm font-semibold mb-2">Preset Positions</h3>
          <div className="grid grid-cols-2 gap-2">
            <button
              className="preset-button"
              onClick={() => onSettingsChange({
                position: { x: 0, y: 0, z: 1 },
                rotation: { x: 0, y: 0, z: 0 }
              })}
            >
              Front Center
            </button>
            <button
              className="text-xs bg-gray-100 hover:bg-gray-200 py-2 px-3 rounded"
              onClick={() => onSettingsChange({
                position: { x: 1, y: 0, z: 0 },
                rotation: { x: 0, y: 1.57, z: 0 }
              })}
            >
              Right Side
            </button>
            <button
              className="text-xs bg-gray-100 hover:bg-gray-200 py-2 px-3 rounded"
              onClick={() => onSettingsChange({
                position: { x: -1, y: 0, z: 0 },
                rotation: { x: 0, y: -1.57, z: 0 }
              })}
            >
              Left Side
            </button>
            <button
              className="text-xs bg-gray-100 hover:bg-gray-200 py-2 px-3 rounded"
              onClick={() => onSettingsChange({
                position: { x: 0, y: 1, z: 0 },
                rotation: { x: 1.57, y: 0, z: 0 }
              })}
            >
              Top
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
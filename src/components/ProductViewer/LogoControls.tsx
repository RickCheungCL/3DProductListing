'use client';

import React,{useRef} from 'react';

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
  customImage?: string;
}

interface LogoControlsProps {
  logoSettings: LogoSettings;
  onSettingsChange: (settings: Partial<LogoSettings>) => void;
}

export default function LogoControls({
  logoSettings,
  onSettingsChange
}: LogoControlsProps) {

  const fileInputRef = useRef<HTMLInputElement>(null);

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


   // Handle image upload
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
  const file = event.target.files?.[0];
  if (!file) return;
    
    // Validate file is an image
  if (!file.type.match('image.*')) {
    alert('Please select an image file (jpg, png, etc.)');
    return;
  }
    
    // Check file size (limit to 2MB)
  if (file.size > 2 * 1024 * 1024) {
    alert('Image is too large. Please select an image smaller than 2MB.');
    return;
  }
    

  const reader = new FileReader();
  reader.onload = (e) => {
    if (typeof e.target?.result === 'string') {
      // Update logo settings with the new image
      onSettingsChange({ 
      customImage: e.target.result,
      visible: true // Also make the logo visible when uploading
        });
      }
  };
  reader.readAsDataURL(file);
    
    // Reset the input
  if (fileInputRef.current) {
    fileInputRef.current.value = '';
  }
  };
  
  // Trigger file input click
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };
  
  // Reset to default logo
  const handleResetLogo = () => {
    onSettingsChange({ customImage: undefined });
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

      {/* Logo Upload - Only show if logo is visible */}
      {logoSettings.visible && (
        <div className="pt-2">
          <h3 className="text-sm font-semibold mb-2">Logo Image</h3>
          <div className="flex flex-col space-y-2">
            {/* Hidden file input */}
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*" 
              onChange={handleImageUpload}
            />
            
            {/* Upload button */}
            <button
              className="w-full py-2 px-3 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-md text-sm font-medium transition-colors"
              onClick={handleUploadClick}
            >
              Upload Custom Logo
            </button>
            
            {/* Reset button - only show if custom image is uploaded */}
            {logoSettings.customImage && (
              <button
                className="w-full py-2 px-3 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-md text-sm font-medium transition-colors"
                onClick={handleResetLogo}
              >
                Reset to Default Logo
              </button>
            )}
            
            {/* Preview of current logo */}
            <div className="mt-2 border border-gray-200 rounded-md p-2 bg-gray-50">
              <p className="text-xs text-gray-500 mb-1">Current Logo:</p>
              <div className="w-full h-16 flex items-center justify-center bg-white rounded">
                {logoSettings.customImage ? (
                  <img 
                    src={logoSettings.customImage} 
                    alt="Custom logo" 
                    className="max-w-full max-h-full object-contain"
                  />
                ) : (
                  <div className="text-xs text-gray-400">Default Logo</div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}




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
                position: { x: -1.6, y: -0.3, z: 1.5 },
                rotation: { x: 5.07, y: 6.2, z: 0 },
                scale: 0.5
              })}
            >
              Front Right
            </button>
            <button
              className="text-xs bg-gray-100 hover:bg-gray-200 py-2 px-3 rounded"
              onClick={() => onSettingsChange({
                position: { x: 0.5, y: -0.3, z: 1.5 },
                rotation: { x: 6.2, y: 6.2, z: 0 },
                scale: 0.5
              })}
            >
              Right Side
            </button>

            <button
              className="text-xs bg-gray-100 hover:bg-gray-200 py-2 px-3 rounded"
              onClick={() => onSettingsChange({
                position: { x: -1.2, y: 0.3, z: 0.3 },
                rotation: { x: 6.2, y: 4.8, z: 0 },
                scale: 0.6
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
'use client';

import { useState } from 'react';
import ProductViewer from '../components/ProductViewer/ProductViewer';
import ColorSelector from '../components/ProductViewer/ColorSelector';
import LogoControls from '../components/ProductViewer/LogoControls';
import {ChevronDown, ChevronUp} from 'lucide-react';

export default function Home() {
  // State for product color
  const [productColor, setProductColor] = useState('#1A202C'); // Default black
  
  // State for logo visibility and position
  const [logoSettings, setLogoSettings] = useState({
    visible: false,
    position: { x: -1.6, y: -0.3, z: 1.5 },
    rotation: { x: 5.07, y: 6.2, z: 0 },
    scale: 0.5,
    customImage:undefined
  });
  // State for Color visibility and position
  const [colorSectionExpanded, setColorSectionExpanded] = useState(false);


  const toggleColorSection = () => {
    setColorSectionExpanded(!colorSectionExpanded);
  };
  // Available colors for the product
  const availableColors = [
    { name: 'Red', value: '#E53E3E' },
    { name: 'Blue', value: '#3182CE' },
    { name: 'Green', value: '#38A169' },
    { name: 'Black', value: '#1A202C' },
    { name: 'White', value: '#F7FAFC' },
  ];

  // Handle color change
  const handleColorChange = (color: string) => {
    setProductColor(color);
  };

  // Handle logo settings change
  const handleLogoSettingsChange = (newSettings: any) => {
    setLogoSettings({ ...logoSettings, ...newSettings });
  };
  const currentColorName = availableColors.find(color => color.value === productColor)?.name || 'Custom';
  return (
    <main className="flex min-h-screen flex-col items-center p-4 md:p-6 lg:p-8">
      <h1 className="text-3xl font-bold mb-8">3D Product Viewer</h1>
      
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Product Viewer */}
        <div className="lg:col-span-3 bg-gray-100 rounded-lg overflow-hidden h-[500px] shadow-lg">
          <ProductViewer 
            productColor={productColor} 
            logoSettings={logoSettings} 
          />
        </div>
        
        {/* Controls Panel */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          {/* Color Selection */}
          <div className="bg-white rounded-lg shadow">
            <button 
              className="w-full p-4 flex items-center justify-between text-xl font-semibold"
              onClick={toggleColorSection}
            >
              <div className="flex items-center space-x-2">
                <span>Color</span>
                <div className="flex items-center ml-2">
                  <div 
                    className="w-4 h-4 rounded-full mr-1" 
                    style={{ backgroundColor: productColor }}
                    aria-hidden="true"
                  />
                  <span className="text-sm font-normal text-gray-600">{currentColorName}</span>
                </div>
              </div>
              {colorSectionExpanded ? (
                <ChevronUp className="h-5 w-5 text-gray-500" />
              ) : (
                <ChevronDown className="h-5 w-5 text-gray-500" />
              )}
            </button>
            
            {colorSectionExpanded && (
              <div className="p-4 pt-0">
                <ColorSelector 
                  availableColors={availableColors} 
                  currentColor={productColor} 
                  onColorChange={handleColorChange} 
                />
              </div>
            )}
          </div>
          
          
          {/* Logo Controls */}
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Logo Settings</h2>
            <LogoControls 
              logoSettings={logoSettings} 
              onSettingsChange={handleLogoSettingsChange} 
            />
          </div>
          
          {/* Information Panel */}
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Instructions</h2>
            <ul className="text-sm text-gray-700 space-y-2">
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                <span>Click and drag to rotate the product</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                <span>Scroll or pinch to zoom in/out</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                <span>Use the color options to change product color</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                <span>Toggle and position the logo as needed</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      
      {/* Product Details */}
      <div className="w-full max-w-6xl mt-8 bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-bold mb-4">Product Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-2">Features</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Customizable colors</li>
              <li>High-quality materials</li>
              <li>Durable construction</li>
              <li>Personalized logo placement</li>
              <li>Modern design</li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Specifications</h3>
            <div className="grid grid-cols-2 gap-2">
              <div className="text-gray-600">Dimensions:</div>
              <div>30cm x 20cm x 15cm</div>
              <div className="text-gray-600">Weight:</div>
              <div>1.2kg</div>
              <div className="text-gray-600">Material:</div>
              <div>Premium composite</div>
              <div className="text-gray-600">Finish:</div>
              <div>Matte / Glossy (selectable)</div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
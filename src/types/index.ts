// Logo settings interface
export interface LogoPosition {
    x: number;
    y: number;
    z: number;
  }
  
  export interface LogoRotation {
    x: number;
    y: number;
    z: number;
  }
  
  export interface LogoSettings {
    visible: boolean;
    position: LogoPosition;
    rotation: LogoRotation;
    scale: number;
  }
  
  // Color option interface
  export interface ColorOption {
    name: string;
    value: string;
  }
  
  // Product model props interface
  export interface ProductModelProps {
    color: string;
    logoSettings: LogoSettings;
  }
  
  // ProductViewer props interface
  export interface ProductViewerProps {
    productColor: string;
    logoSettings: LogoSettings;
  }
  
  // ColorSelector props interface
  export interface ColorSelectorProps {
    availableColors: ColorOption[];
    currentColor: string;
    onColorChange: (color: string) => void;
  }
  
  // LogoControls props interface
  export interface LogoControlsProps {
    logoSettings: LogoSettings;
    onSettingsChange: (settings: Partial<LogoSettings>) => void;
  }
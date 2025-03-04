
import React, { RefObject, useState } from 'react';
import { Camera, Zap, ZapOff, Contrast, Focus, Target } from 'lucide-react';
import { Button } from '../ui/button';
import { Slider } from '../ui/slider';

interface CameraPreviewProps {
  videoRef: RefObject<HTMLVideoElement>;
  isProcessing: boolean;
  previewUrl: string | null;
  onCapture: () => void;
  onSettingsChange?: (settings: {
    brightness: number;
    contrast: number;
    saturation: number;
  }) => void;
}

export const CameraPreview: React.FC<CameraPreviewProps> = ({
  videoRef,
  isProcessing,
  previewUrl,
  onCapture,
  onSettingsChange,
}) => {
  const [showControls, setShowControls] = useState(false);
  const [torchEnabled, setTorchEnabled] = useState(false);
  const [settings, setSettings] = useState({
    brightness: 100,
    contrast: 100,
    saturation: 100,
  });

  const toggleTorch = async () => {
    if (!videoRef.current?.srcObject) return;
    
    try {
      const stream = videoRef.current.srcObject as MediaStream;
      const track = stream.getVideoTracks()[0];
      
      // Check if torch is supported
      const capabilities = track.getCapabilities();
      if (!capabilities.torch) {
        console.log('Torch not supported on this device');
        return;
      }
      
      const newTorchState = !torchEnabled;
      await track.applyConstraints({ advanced: [{ torch: newTorchState }] });
      setTorchEnabled(newTorchState);
    } catch (error) {
      console.error('Error toggling torch:', error);
    }
  };

  const handleSettingsChange = (
    key: 'brightness' | 'contrast' | 'saturation',
    value: number[]
  ) => {
    const newSettings = {
      ...settings,
      [key]: value[0],
    };
    setSettings(newSettings);
    if (onSettingsChange) {
      onSettingsChange(newSettings);
    }
    
    // Apply CSS filters to video element for live preview
    if (videoRef.current) {
      videoRef.current.style.filter = `brightness(${newSettings.brightness}%) contrast(${newSettings.contrast}%) saturate(${newSettings.saturation}%)`;
    }
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          className="w-full h-[600px] object-cover rounded-lg"
        />
        
        {/* Guide overlay - shows a rectangle with markers to help position */}
        {!isProcessing && !previewUrl && (
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4/5 h-2/3 border-2 border-yellow-400 rounded-lg border-dashed opacity-70">
              <div className="absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2 border-yellow-400 rounded-tl"></div>
              <div className="absolute top-0 right-0 w-5 h-5 border-t-2 border-r-2 border-yellow-400 rounded-tr"></div>
              <div className="absolute bottom-0 left-0 w-5 h-5 border-b-2 border-l-2 border-yellow-400 rounded-bl"></div>
              <div className="absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2 border-yellow-400 rounded-tr"></div>
            </div>
          </div>
        )}
        
        {/* Camera controls */}
        {!isProcessing && !previewUrl && (
          <>
            <Button
              variant="outline"
              size="sm"
              className="absolute top-4 right-4 bg-black/50 text-white border-0 hover:bg-black/70"
              onClick={() => setShowControls(!showControls)}
            >
              <Contrast className="h-4 w-4 mr-2" />
              {showControls ? 'Hide Controls' : 'Adjust Image'}
            </Button>
            
            <Button
              className="absolute top-4 left-1/2 transform -translate-x-1/2"
              onClick={onCapture}
            >
              <Camera className="mr-2 h-4 w-4" />
              Capture
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              className="absolute top-4 left-4 bg-black/50 text-white border-0 hover:bg-black/70"
              onClick={toggleTorch}
            >
              {torchEnabled ? (
                <ZapOff className="h-4 w-4 mr-2" />
              ) : (
                <Zap className="h-4 w-4 mr-2" />
              )}
              {torchEnabled ? 'Torch Off' : 'Torch On'}
            </Button>
            
            <div className="absolute bottom-4 left-4 p-2 rounded-lg bg-black/60">
              <Target className="h-5 w-5 text-yellow-400" />
              <span className="text-xs text-white ml-1">Position tag in frame</span>
            </div>
          </>
        )}
        
        {/* Settings panel */}
        {showControls && !isProcessing && !previewUrl && (
          <div className="absolute bottom-0 left-0 right-0 bg-black/70 p-4 rounded-b-lg space-y-3">
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-white text-xs flex items-center">
                  <Focus className="h-3 w-3 mr-1" />
                  Brightness
                </label>
                <span className="text-white text-xs">{settings.brightness}%</span>
              </div>
              <Slider
                value={[settings.brightness]}
                min={50}
                max={150}
                step={5}
                onValueChange={(value) => handleSettingsChange('brightness', value)}
              />
            </div>
            
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-white text-xs flex items-center">
                  <Contrast className="h-3 w-3 mr-1" />
                  Contrast
                </label>
                <span className="text-white text-xs">{settings.contrast}%</span>
              </div>
              <Slider
                value={[settings.contrast]}
                min={50}
                max={150}
                step={5}
                onValueChange={(value) => handleSettingsChange('contrast', value)}
              />
            </div>
            
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-white text-xs">Saturation</label>
                <span className="text-white text-xs">{settings.saturation}%</span>
              </div>
              <Slider
                value={[settings.saturation]}
                min={50}
                max={150}
                step={5}
                onValueChange={(value) => handleSettingsChange('saturation', value)}
              />
            </div>
          </div>
        )}
      </div>

      {previewUrl && (
        <div className="relative">
          <img
            src={previewUrl}
            alt="Preview"
            className="w-full h-[600px] object-cover rounded-lg"
          />
          {isProcessing && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg">
              <div className="text-white">Processing...</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

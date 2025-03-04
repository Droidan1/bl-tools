
import React, { useRef, useCallback, useEffect } from 'react';

interface CameraHandlerProps {
  onStreamReady: (stream: MediaStream) => void;
  onError: (error: Error) => void;
}

export const CameraHandler = ({ onStreamReady, onError }: CameraHandlerProps) => {
  const streamRef = useRef<MediaStream | null>(null);

  const startCamera = async () => {
    try {
      // Advanced camera constraints
      const constraints = {
        video: {
          facingMode: 'environment',
          width: { ideal: 3840 }, // 4K resolution
          height: { ideal: 2160 },
          aspectRatio: { ideal: 1.7777777778 },
          // Add advanced focus and exposure settings
          focusMode: { ideal: 'continuous' },
          exposureMode: { ideal: 'continuous' },
          whiteBalanceMode: { ideal: 'continuous' },
          // Request high-quality stream if available
          frameRate: { ideal: 30 },
        }
      };
      
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;
      
      // Try to optimize camera settings after getting the stream
      try {
        const track = stream.getVideoTracks()[0];
        const capabilities = track.getCapabilities();
        console.log('Camera capabilities:', capabilities);
        
        // Apply advanced settings if available
        const advancedSettings: Record<string, any> = {};
        
        // Optimize focus
        if (capabilities.focusDistance) {
          advancedSettings.focusMode = 'manual';
          // Use middle of the range for barcode scanning
          advancedSettings.focusDistance = 
            (capabilities.focusDistance.max + capabilities.focusDistance.min) / 2;
        }
        
        // Optimize exposure
        if (capabilities.exposureCompensation) {
          advancedSettings.exposureMode = 'manual';
          // Slightly brighter for barcode scanning
          advancedSettings.exposureCompensation = capabilities.exposureCompensation.max * 0.7;
        }
        
        // Optimize brightness
        if (capabilities.brightness) {
          advancedSettings.brightness = capabilities.brightness.max * 0.6;
        }
        
        // Optimize contrast
        if (capabilities.contrast) {
          advancedSettings.contrast = capabilities.contrast.max * 0.7;
        }
        
        // Optimize sharpness
        if (capabilities.sharpness) {
          advancedSettings.sharpness = capabilities.sharpness.max;
        }
        
        // Apply settings if we have any
        if (Object.keys(advancedSettings).length > 0) {
          await track.applyConstraints({
            advanced: [advancedSettings]
          });
        }
      } catch (settingsError) {
        // Continue if settings optimization fails
        console.error('Could not optimize camera settings:', settingsError);
      }
      
      onStreamReady(stream);
    } catch (error) {
      onError(error as Error);
    }
  };

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  }, []);

  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  return null;
};

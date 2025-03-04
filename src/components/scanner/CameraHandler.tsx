
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
        
        // Apply advanced settings if available using standard API properties
        const advancedSettings: Record<string, any> = {};
        
        // We'll use type assertions and safety checks for non-standard properties
        const extendedCapabilities = capabilities as any;
        
        // Handle focus
        if (extendedCapabilities.focusMode) {
          advancedSettings.focusMode = 'manual';
        }
        
        // Handle exposure
        if (extendedCapabilities.exposureMode) {
          advancedSettings.exposureMode = 'manual';
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

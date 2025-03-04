import React, { useRef, useCallback, useEffect } from 'react';

interface CameraHandlerProps {
  onStreamReady: (stream: MediaStream) => void;
  onError: (error: Error) => void;
}

export const CameraHandler = ({ onStreamReady, onError }: CameraHandlerProps) => {
  const streamRef = useRef<MediaStream | null>(null);

  const startCamera = async () => {
    try {
      const constraints = {
        video: {
          facingMode: 'environment',
          width: { ideal: 3840 },
          height: { ideal: 2160 },
          aspectRatio: { ideal: 1.7777777778 },
        }
      };
      
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;
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
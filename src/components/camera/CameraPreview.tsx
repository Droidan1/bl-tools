import React, { RefObject } from 'react';
import { Button } from '../ui/button';
import { Camera } from 'lucide-react';

interface CameraPreviewProps {
  videoRef: RefObject<HTMLVideoElement>;
  onCapture: () => void;
}

export const CameraPreview = ({ videoRef, onCapture }: CameraPreviewProps) => {
  return (
    <div className="relative">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        className="w-full h-[600px] object-cover rounded-lg"
      />
      <Button
        className="absolute bottom-4 left-1/2 transform -translate-x-1/2"
        onClick={onCapture}
      >
        <Camera className="mr-2 h-4 w-4" />
        Capture
      </Button>
    </div>
  );
};
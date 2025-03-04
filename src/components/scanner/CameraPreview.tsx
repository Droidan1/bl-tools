
import React, { RefObject } from 'react';
import { Camera } from 'lucide-react';
import { Button } from '../ui/button';

interface CameraPreviewProps {
  videoRef: RefObject<HTMLVideoElement>;
  isProcessing: boolean;
  previewUrl: string | null;
  onCapture: () => void;
}

export const CameraPreview: React.FC<CameraPreviewProps> = ({
  videoRef,
  isProcessing,
  previewUrl,
  onCapture,
}) => {
  return (
    <div className="space-y-4">
      <div className="relative">
        <div className="relative overflow-hidden rounded-lg">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="w-full h-[600px] object-cover rounded-lg bg-black"
          />
          {!isProcessing && !previewUrl && (
            <Button
              className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-white/80 hover:bg-white text-green-700 border border-green-500"
              onClick={onCapture}
            >
              <Camera className="mr-2 h-4 w-4" />
              Capture
            </Button>
          )}
        </div>
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
              <div className="text-white text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-2"></div>
                <p>Processing multiple frames...</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

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
        <video
          ref={videoRef}
          autoPlay
          playsInline
          className="w-full h-[600px] object-cover rounded-lg"
        />
        {!isProcessing && !previewUrl && (
          <Button
            className="absolute top-4 left-1/2 transform -translate-x-1/2"
            onClick={onCapture}
          >
            <Camera className="mr-2 h-4 w-4" />
            Capture
          </Button>
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
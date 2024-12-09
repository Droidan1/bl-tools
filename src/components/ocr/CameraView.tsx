import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from "lucide-react";

interface CameraViewProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  isProcessing: boolean;
  onCapture: () => void;
  onClose: () => void;
}

export const CameraView: React.FC<CameraViewProps> = ({
  videoRef,
  isProcessing,
  onCapture,
  onClose,
}) => {
  return (
    <div className="relative flex-1 overflow-hidden rounded-lg bg-muted">
      <video 
        ref={videoRef} 
        autoPlay 
        playsInline 
        className="h-full w-full object-cover" 
      />
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        <Button
          onClick={onCapture}
          variant="secondary"
          size="lg"
          className="px-6"
          disabled={isProcessing}
        >
          {isProcessing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            'Capture & Process'
          )}
        </Button>
      </div>
      <Button 
        onClick={onClose}
        className="absolute top-4 right-4 z-10"
        variant="secondary"
        size="sm"
      >
        Close
      </Button>
    </div>
  );
};
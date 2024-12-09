import React from 'react';
import { Button } from '@/components/ui/button';

interface ScannerPreviewProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  onClose: () => void;
}

export const ScannerPreview = ({ videoRef, onClose }: ScannerPreviewProps) => (
  <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-lg w-full max-w-sm mx-auto">
      <div className="p-4">
        <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-muted">
          <video ref={videoRef} className="h-full w-full object-cover" />
          <Button 
            onClick={onClose}
            className="absolute top-2 right-2 z-10"
            variant="secondary"
            size="sm"
          >
            Close
          </Button>
        </div>
        <p className="text-sm text-center mt-4 text-muted-foreground">
          Position the barcode within the camera view
        </p>
      </div>
    </div>
  </div>
);
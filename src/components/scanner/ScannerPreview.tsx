
import React from 'react';
import { Button } from '@/components/ui/button';
import { QrCode } from 'lucide-react';

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
          
          {/* Overlay with target indicator */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-32 h-32 border-2 border-green-500 rounded-lg opacity-70"></div>
            <QrCode className="absolute text-green-500 opacity-50" size={48} />
          </div>
          
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
          Position the QR code within the green outline
        </p>
      </div>
    </div>
  </div>
);


import React from 'react';
import { Button } from '@/components/ui/button';
import { QrCode, X } from 'lucide-react';

interface ScannerPreviewProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  onClose: () => void;
}

export const ScannerPreview = ({ videoRef, onClose }: ScannerPreviewProps) => (
  <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-3">
    <div className="bg-white rounded-lg w-full max-w-[350px] mx-auto relative">
      <Button 
        onClick={onClose}
        className="absolute top-2 right-2 z-10"
        variant="ghost"
        size="sm"
        aria-label="Close scanner"
      >
        <X className="h-4 w-4" />
      </Button>
      
      <div className="p-4">
        <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-black">
          <video ref={videoRef} className="h-full w-full object-cover" />
          
          {/* Overlay with target indicator */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-40 h-40 border-2 border-green-500 rounded-lg opacity-70"></div>
            <QrCode className="absolute text-green-500 opacity-60" size={40} />
          </div>
        </div>
        <p className="text-sm text-center mt-4 text-muted-foreground">
          Position the QR code within the green outline
        </p>
      </div>
    </div>
  </div>
);

import React, { useRef, useState } from 'react';
import { Button } from './ui/button';
import { X, Camera, RotateCcw } from 'lucide-react';
import { useToast } from './ui/use-toast';

interface PhotoCaptureProps {
  onCapture: (photoUrl: string) => void;
  onClose: () => void;
}

export const PhotoCapture = ({ onCapture, onClose }: PhotoCaptureProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [hasPermission, setHasPermission] = React.useState<boolean>(true);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const { toast } = useToast();

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
      }
      setHasPermission(true);
    } catch (error) {
      console.error('Error accessing camera:', error);
      setHasPermission(false);
      toast({
        title: "Camera Error",
        description: "Unable to access camera",
        variant: "destructive",
      });
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;

    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return;

    ctx.drawImage(videoRef.current, 0, 0);
    const dataUrl = canvas.toDataURL('image/jpeg');
    setPreviewUrl(dataUrl);
  };

  const handleConfirm = () => {
    if (previewUrl) {
      onCapture(previewUrl);
      stopCamera();
    }
  };

  const handleRetake = () => {
    setPreviewUrl(null);
    startCamera();
  };

  const handleClose = () => {
    stopCamera();
    onClose();
  };

  React.useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, []);

  if (!hasPermission) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md">
          <h2 className="text-xl font-semibold mb-4">Camera Access Required</h2>
          <p className="mb-4">Please allow camera access to take a photo.</p>
          <Button onClick={handleClose}>Close</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Take Photo</h2>
          <Button variant="ghost" size="icon" onClick={handleClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-4">
          <div className="relative">
            {!previewUrl ? (
              <>
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="w-full h-[600px] object-cover rounded-lg"
                />
                <Button
                  className="absolute bottom-4 left-1/2 transform -translate-x-1/2"
                  onClick={capturePhoto}
                >
                  <Camera className="mr-2 h-4 w-4" />
                  Capture
                </Button>
              </>
            ) : (
              <>
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-full h-[600px] object-cover rounded-lg"
                />
                <div className="flex justify-center gap-2 mt-4">
                  <Button variant="outline" onClick={handleRetake}>
                    <RotateCcw className="mr-2 h-4 w-4" />
                    Retake
                  </Button>
                  <Button onClick={handleConfirm}>
                    Confirm
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useRef, useState, useEffect } from 'react';
import { Button } from './ui/button';
import { X, ZoomIn, ZoomOut, SunMoon, Scan } from 'lucide-react';
import { useToast } from './ui/use-toast';
import { CameraPermissionError } from './scanner/CameraPermissionError';
import { CameraPreview } from './scanner/CameraPreview';
import { CameraHandler } from './scanner/CameraHandler';
import { processAndExtractFields } from '@/utils/aiProcessing';

interface AIScanProps {
  onScan: (fields: {
    sapNumber?: string;
    barcode?: string;
    storeLocation?: string;
    bolNumber?: string;
    quantity?: number;
  }) => void;
  onClose: () => void;
}

export const AIScan = ({ onScan, onClose }: AIScanProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasPermission, setHasPermission] = useState<boolean>(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [brightness, setBrightness] = useState<number>(1.1); // Default brightness
  const [contrast, setContrast] = useState<number>(1.2); // Default contrast
  const [zoom, setZoom] = useState<number>(1.0); // Default zoom level
  const [showGuide, setShowGuide] = useState<boolean>(true); // Show scanning guide
  const { toast } = useToast();

  const handleStreamReady = (stream: MediaStream) => {
    if (videoRef.current) {
      videoRef.current.srcObject = stream;
      
      // Try to adjust camera settings if supported
      const videoTrack = stream.getVideoTracks()[0];
      if (videoTrack) {
        try {
          const capabilities = videoTrack.getCapabilities();
          // Check if zoom is supported before accessing it
          if (capabilities) {
            videoTrack.applyConstraints({
              advanced: [{ 
                // Remove non-standard constraints to fix TypeScript error
                // We'll manage effects using CSS/canvas instead
              }]
            }).catch(e => console.error('Failed to apply camera constraints:', e));
          }
        } catch (e) {
          console.error('Error setting camera capabilities:', e);
        }
      }
    }
    setHasPermission(true);
  };

  const handleStreamError = (error: Error) => {
    console.error('Error accessing camera:', error);
    setHasPermission(false);
  };

  const adjustZoom = (direction: 'in' | 'out') => {
    const newZoom = direction === 'in' ? Math.min(zoom + 0.1, 3.0) : Math.max(zoom - 0.1, 1.0);
    setZoom(newZoom);
    updateCameraSettings();
  };

  const adjustBrightness = () => {
    const newBrightness = brightness === 1.1 ? 1.3 : 1.1; // Toggle between normal and bright
    setBrightness(newBrightness);
    const newContrast = contrast === 1.2 ? 1.4 : 1.2; // Toggle contrast as well
    setContrast(newContrast);
  };

  const updateCameraSettings = () => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      const videoTrack = stream.getVideoTracks()[0];
      if (videoTrack && 'applyConstraints' in videoTrack) {
        try {
          const capabilities = videoTrack.getCapabilities();
          // Check capabilities but don't try to access non-standard properties
          if (capabilities) {
            videoTrack.applyConstraints({
              advanced: [{ 
                // Don't include any non-standard properties
                // Use CSS transforms for visual effects instead
              }]
            }).catch(e => console.error('Failed to apply constraints:', e));
          }
        } catch (e) {
          console.error('Error updating camera settings:', e);
        }
      }
    }
  };

  // Update camera settings when zoom changes
  useEffect(() => {
    updateCameraSettings();
  }, [zoom]);

  const captureImage = async () => {
    if (!videoRef.current) return;

    const canvas = document.createElement('canvas');
    const video = videoRef.current;
    
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (video.style.transform && video.style.transform.includes('scaleX(-1)')) {
      ctx.scale(-1, 1);
      ctx.translate(-canvas.width, 0);
    }

    // Apply image processing adjustments for better AI recognition
    ctx.filter = `contrast(${contrast}) brightness(${brightness})`;
    
    // Apply zoom effect during capture by adjusting drawing parameters
    if (zoom !== 1.0) {
      const zoomX = canvas.width / 2;
      const zoomY = canvas.height / 2;
      const scaledWidth = canvas.width / zoom;
      const scaledHeight = canvas.height / zoom;
      const offsetX = (canvas.width - scaledWidth) / 2;
      const offsetY = (canvas.height - scaledHeight) / 2;
      
      ctx.drawImage(
        video, 
        offsetX, offsetY, scaledWidth, scaledHeight,
        0, 0, canvas.width, canvas.height
      );
    } else {
      ctx.drawImage(video, 0, 0);
    }
    
    const dataUrl = canvas.toDataURL('image/jpeg', 1.0);
    setPreviewUrl(dataUrl);
    
    toast({
      title: "Image captured",
      description: "Processing with AI...",
      duration: 3000,
    });

    try {
      setIsProcessing(true);
      const extractedFields = await processAndExtractFields(dataUrl);
      
      if (Object.keys(extractedFields).filter(k => extractedFields[k as keyof typeof extractedFields] !== undefined).length === 0) {
        toast({
          title: "No data found",
          description: "Could not extract any information from the image. Please try again with better lighting and focus.",
          variant: "destructive",
          duration: 3000,
        });
      } else {
        toast({
          title: "Success",
          description: "Data extracted successfully using AI",
          duration: 3000,
        });
        onScan(extractedFields);
        onClose();
      }
    } catch (error) {
      console.error('AI Processing Error:', error);
      toast({
        title: "Error",
        description: "Failed to process the image with AI. Please try again.",
        variant: "destructive",
        duration: 3000,
      });
    } finally {
      setIsProcessing(false);
    }
  };

  if (!hasPermission) {
    return <CameraPermissionError onClose={onClose} />;
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-start justify-center p-4 z-50 pt-2">
      <div className="bg-white rounded-lg p-4 w-full max-w-2xl mt-2">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xl font-semibold">AI Scanner</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <CameraHandler
          onStreamReady={handleStreamReady}
          onError={handleStreamError}
        />

        <div className="relative">
          {showGuide && !previewUrl && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
              <div className="border-2 border-dashed border-green-500 w-4/5 h-1/2 rounded-lg flex items-center justify-center">
                <p className="text-green-500 bg-white/80 px-2 py-1 rounded text-sm">
                  Position tag inside box
                </p>
              </div>
            </div>
          )}
          
          <CameraPreview
            videoRef={videoRef}
            isProcessing={isProcessing}
            previewUrl={previewUrl}
            onCapture={captureImage}
          />
          
          {!isProcessing && !previewUrl && (
            <div className="absolute bottom-16 left-0 right-0 flex justify-center space-x-2">
              <Button 
                size="sm" 
                variant="secondary" 
                onClick={() => adjustZoom('in')}
                className="bg-white/70 backdrop-blur-sm"
              >
                <ZoomIn className="h-4 w-4" />
              </Button>
              
              <Button 
                size="sm" 
                variant="secondary" 
                onClick={() => adjustZoom('out')}
                className="bg-white/70 backdrop-blur-sm"
              >
                <ZoomOut className="h-4 w-4" />
              </Button>
              
              <Button 
                size="sm" 
                variant="secondary" 
                onClick={adjustBrightness}
                className="bg-white/70 backdrop-blur-sm"
              >
                <SunMoon className="h-4 w-4" />
              </Button>
              
              <Button 
                size="sm" 
                variant="secondary" 
                onClick={() => setShowGuide(!showGuide)}
                className="bg-white/70 backdrop-blur-sm"
              >
                <Scan className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

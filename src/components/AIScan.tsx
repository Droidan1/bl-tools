import React, { useRef, useState } from 'react';
import { Button } from './ui/button';
import { X } from 'lucide-react';
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
  const { toast } = useToast();

  const handleStreamReady = (stream: MediaStream) => {
    if (videoRef.current) {
      videoRef.current.srcObject = stream;
    }
    setHasPermission(true);
  };

  const handleStreamError = (error: Error) => {
    console.error('Error accessing camera:', error);
    setHasPermission(false);
  };

  const captureImage = async () => {
    if (!videoRef.current) return;

    const canvas = document.createElement('canvas');
    const video = videoRef.current;
    
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (video.style.transform.includes('scaleX(-1)')) {
      ctx.scale(-1, 1);
      ctx.translate(-canvas.width, 0);
    }

    ctx.drawImage(video, 0, 0);
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
      
      if (Object.keys(extractedFields).length === 0) {
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

        <CameraPreview
          videoRef={videoRef}
          isProcessing={isProcessing}
          previewUrl={previewUrl}
          onCapture={captureImage}
        />
      </div>
    </div>
  );
};
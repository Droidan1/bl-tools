import React, { useEffect, useRef, useState } from 'react';
import { createWorker, Worker } from 'tesseract.js';
import { Button } from '@/components/ui/button';
import { useToast } from "@/components/ui/use-toast";
import { ScanText, Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface OCRScannerProps {
  onScan: (fields: {
    sapNumber?: string;
    barcode?: string;
    storeLocation?: string;
    bolNumber?: string;
  }) => void;
  onClose: () => void;
}

export const OCRScanner = ({ onScan, onClose }: OCRScannerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [permissionGranted, setPermissionGranted] = useState<boolean | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [preprocessOption, setPreprocessOption] = useState('default');
  const { toast } = useToast();

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
  };

  const handleClose = () => {
    stopCamera();
    onClose();
  };

  const preprocessImage = (canvas: HTMLCanvasElement): HTMLCanvasElement => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return canvas;

    switch (preprocessOption) {
      case 'grayscale':
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        for (let i = 0; i < data.length; i += 4) {
          const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
          data[i] = avg;
          data[i + 1] = avg;
          data[i + 2] = avg;
        }
        ctx.putImageData(imageData, 0, 0);
        break;
      case 'highContrast':
        ctx.filter = 'contrast(150%)';
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = canvas.width;
        tempCanvas.height = canvas.height;
        const tempCtx = tempCanvas.getContext('2d');
        if (tempCtx) {
          tempCtx.filter = 'contrast(150%)';
          tempCtx.drawImage(canvas, 0, 0);
          ctx.drawImage(tempCanvas, 0, 0);
        }
        break;
      default:
        break;
    }
    return canvas;
  };

  const captureImage = async () => {
    if (!videoRef.current) return;
    setIsProcessing(true);

    try {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Could not get canvas context');

      ctx.drawImage(videoRef.current, 0, 0);
      const processedCanvas = preprocessImage(canvas);
      const imageData = processedCanvas.toDataURL('image/png');

      const worker = await createWorker('eng');
      
      toast({
        title: "Processing Image",
        description: "Please wait while we scan the text...",
      });

      const { data: { text } } = await worker.recognize(imageData);
      await worker.terminate();

      const fields = {
        sapNumber: text.match(/SAP[:\s]*(\d+)/i)?.[1],
        barcode: text.match(/barcode[:\s]*([A-Z0-9]+)/i)?.[1],
        storeLocation: text.match(/store[:\s]*([A-Z0-9\s]+)/i)?.[1],
        bolNumber: text.match(/BOL[:\s]*([A-Z0-9-]+)/i)?.[1],
      };

      if (!Object.values(fields).some(value => value)) {
        throw new Error('No recognizable text found');
      }

      onScan(fields);
      handleClose();

      toast({
        title: "Text Scanned Successfully",
        description: "The recognized text has been added to the form.",
      });
    } catch (error) {
      console.error('OCR Error:', error);
      toast({
        title: "Scanning Error",
        description: error instanceof Error ? error.message : "There was an error processing the image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    const requestCameraPermission = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: { ideal: 'environment' }
          }
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setPermissionGranted(true);
      } catch (error) {
        console.error('Camera permission denied:', error);
        setPermissionGranted(false);
        toast({
          title: "Camera Access Denied",
          description: "Please allow camera access to scan text",
          variant: "destructive",
        });
      }
    };

    requestCameraPermission();

    return () => {
      stopCamera();
    };
  }, [toast]);

  if (permissionGranted === false) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg w-full max-w-sm mx-auto p-6 text-center">
          <h3 className="text-lg font-semibold mb-2">Camera Access Required</h3>
          <p className="text-sm text-gray-600 mb-4">
            Please enable camera access in your browser settings to scan text.
          </p>
          <Button onClick={handleClose}>Close</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl mx-auto h-[75vh]">
        <div className="p-6 h-full flex flex-col">
          <div className="mb-4">
            <Select
              value={preprocessOption}
              onValueChange={setPreprocessOption}
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Image Processing" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">Default</SelectItem>
                <SelectItem value="grayscale">Grayscale</SelectItem>
                <SelectItem value="highContrast">High Contrast</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="relative flex-1 overflow-hidden rounded-lg bg-muted">
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline 
              className="h-full w-full object-cover" 
            />
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              <Button
                onClick={captureImage}
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
                  'Capture & Scan'
                )}
              </Button>
            </div>
            <Button 
              onClick={handleClose}
              className="absolute top-4 right-4 z-10"
              variant="secondary"
              size="sm"
            >
              Close
            </Button>
          </div>
          <p className="text-sm text-center mt-6 text-muted-foreground">
            Position the text within the camera view and tap "Capture & Scan"
          </p>
        </div>
      </div>
    </div>
  );
};
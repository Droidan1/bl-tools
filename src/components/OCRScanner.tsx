import React, { useEffect, useRef, useState } from 'react';
import { createWorker, Worker } from 'tesseract.js';
import { Button } from '@/components/ui/button';
import { useToast } from "@/components/ui/use-toast";
import { ScanText } from "lucide-react";

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

  const captureImage = async () => {
    if (!videoRef.current) return;

    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(videoRef.current, 0, 0);
    const imageData = canvas.toDataURL('image/png');

    try {
      const worker = await createWorker('eng');
      
      toast({
        title: "Processing Image",
        description: "Please wait while we scan the text...",
      });

      const { data: { text } } = await worker.recognize(imageData);
      await worker.terminate();

      // Simple text parsing based on common patterns
      const fields = {
        sapNumber: text.match(/SAP[:\s]*(\d+)/i)?.[1],
        barcode: text.match(/barcode[:\s]*([A-Z0-9]+)/i)?.[1],
        storeLocation: text.match(/store[:\s]*([A-Z0-9\s]+)/i)?.[1],
        bolNumber: text.match(/BOL[:\s]*([A-Z0-9-]+)/i)?.[1],
      };

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
        description: "There was an error processing the image. Please try again.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    const requestCameraPermission = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
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
              >
                Capture & Scan
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
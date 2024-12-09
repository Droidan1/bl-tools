import React, { useEffect, useRef, useState } from 'react';
import { createWorker } from 'tesseract.js';
import { Button } from '@/components/ui/button';
import { useToast } from "@/components/ui/use-toast";
import { OCRControls } from './ocr/OCRControls';
import { CameraView } from './ocr/CameraView';
import { preprocessImage } from './ocr/OCRPreprocessor';

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

  const processOCR = async (imageData: string) => {
    try {
      const worker = await createWorker('eng');
      
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

      return fields;
    } catch (error) {
      console.error('OCR Processing Error:', error);
      throw error;
    }
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
      const processedCanvas = preprocessImage(canvas, preprocessOption);
      const imageData = processedCanvas.toDataURL('image/png');

      toast({
        title: "Processing Image",
        description: "Please wait while we scan the text...",
      });

      const fields = await processOCR(imageData);
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
          <OCRControls 
            preprocessOption={preprocessOption}
            setPreprocessOption={setPreprocessOption}
          />
          <CameraView
            videoRef={videoRef}
            isProcessing={isProcessing}
            onCapture={captureImage}
            onClose={handleClose}
          />
          <p className="text-sm text-center mt-6 text-muted-foreground">
            Position the text within the camera view and tap "Capture & Process"
          </p>
        </div>
      </div>
    </div>
  );
};
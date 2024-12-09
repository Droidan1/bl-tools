import React, { useState, useRef } from 'react';
import { createWorker } from 'tesseract.js';
import { X } from 'lucide-react';
import { Button } from './ui/button';
import { useToast } from './ui/use-toast';
import { CameraPreview } from './scanner/CameraPreview';
import { findBarcodeInText } from '../utils/ocrUtils';

interface OCRScannerProps {
  onScan: (fields: {
    sapNumber?: string;
    barcode?: string;
    storeLocation?: string;
    bolNumber?: string;
  }) => void;
  onClose: () => void;
}

export const OCRScanner: React.FC<OCRScannerProps> = ({ onScan, onClose }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { toast } = useToast();

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' }
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      toast({
        title: "Camera Error",
        description: "Could not access camera. Please check permissions.",
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
  };

  const captureImage = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      canvas.getContext('2d')?.drawImage(videoRef.current, 0, 0);
      const imageUrl = canvas.toDataURL('image/png');
      setPreviewUrl(imageUrl);
      stopCamera();
      processImage(imageUrl);
    }
  };

  const processImage = async (imageUrl: string) => {
    setIsProcessing(true);
    try {
      const worker = await createWorker();
      const { data: { text } } = await worker.recognize(imageUrl);
      await worker.terminate();

      console.log('Extracted text:', text);

      const detectedBarcode = findBarcodeInText(text);
      const fields: Record<string, string> = {};

      if (detectedBarcode) {
        fields.barcode = detectedBarcode;
        toast({
          title: "Barcode Detected",
          description: `Found barcode: ${detectedBarcode}`,
          duration: 3000,
        });
      }

      // Extract other fields
      const lines = text.split('\n');
      lines.forEach(line => {
        const cleanLine = line.toLowerCase().trim();
        if (cleanLine.includes('sap') || /^\d{8}$/.test(cleanLine)) {
          fields.sapNumber = cleanLine.replace(/[^0-9]/g, '');
        }
        if (cleanLine.includes('bol') || /^b\d{6}$/i.test(cleanLine)) {
          fields.bolNumber = cleanLine.replace(/[^0-9]/g, '');
        }
        if (cleanLine.includes('store') || cleanLine.includes('location')) {
          fields.storeLocation = line.trim();
        }
      });

      onScan(fields);
    } catch (error) {
      toast({
        title: "OCR Error",
        description: "Failed to process the image. Please try again.",
        variant: "destructive",
        duration: 3000,
      });
    } finally {
      setIsProcessing(false);
    }
  };

  React.useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Camera Scanner</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

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
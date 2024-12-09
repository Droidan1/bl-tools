import React, { useState, useRef } from 'react';
import { createWorker } from 'tesseract.js';
import { Camera, X } from 'lucide-react';
import { Button } from './ui/button';
import { useToast } from './ui/use-toast';

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

  const findBarcodeInText = (text: string): string | undefined => {
    // First, clean and normalize the text
    const lines = text.split('\n').map(line => 
      line.trim().replace(/\s+/g, '').toUpperCase()
    );
    
    // Common barcode patterns with more flexible matching
    const barcodePatterns = [
      /\d{12,14}/, // UPC/EAN (allowing partial matches)
      /[0-9A-Z]{8,14}/, // Code 39 (more flexible)
      /\d{8}/, // EAN-8
      /[0-9A-Z\-]{6,}/, // General alphanumeric codes
    ];

    for (const line of lines) {
      // Try to find any sequence that matches our patterns
      for (const pattern of barcodePatterns) {
        const match = line.match(pattern);
        if (match) {
          const potentialBarcode = match[0];
          console.log('Found potential barcode:', potentialBarcode, 'in line:', line);
          return potentialBarcode;
        }
      }
    }

    // If no exact matches found, try to find any sequence of numbers
    for (const line of lines) {
      const numberSequence = line.match(/\d{6,}/);
      if (numberSequence) {
        console.log('Found number sequence as fallback:', numberSequence[0], 'in line:', line);
        return numberSequence[0];
      }
    }

    return undefined;
  };

  const processImage = async (imageUrl: string) => {
    setIsProcessing(true);
    try {
      const worker = await createWorker();
      const { data: { text } } = await worker.recognize(imageUrl);
      await worker.terminate();

      console.log('Extracted text:', text);

      // Extract potential fields from the text
      const lines = text.split('\n');
      const fields: Record<string, string> = {};

      // Try to find barcode first using our enhanced detection
      const detectedBarcode = findBarcodeInText(text);
      if (detectedBarcode) {
        fields.barcode = detectedBarcode;
      }

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
      toast({
        title: "OCR Complete",
        description: fields.barcode 
          ? "Barcode detected and text extracted successfully."
          : "Text extracted successfully.",
      });
    } catch (error) {
      toast({
        title: "OCR Error",
        description: "Failed to process the image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Start camera immediately when component mounts
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

        <div className="space-y-4">
          <div className="relative">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full rounded-lg"
            />
            {!isProcessing && !previewUrl && (
              <Button
                className="absolute bottom-4 left-1/2 transform -translate-x-1/2"
                onClick={captureImage}
              >
                <Camera className="mr-2 h-4 w-4" />
                Capture
              </Button>
            )}
          </div>

          {previewUrl && (
            <div className="relative">
              <img
                src={previewUrl}
                alt="Preview"
                className="w-full rounded-lg"
              />
              {isProcessing && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg">
                  <div className="text-white">Processing...</div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
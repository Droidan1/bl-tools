import React, { useState, useRef } from 'react';
import { createWorker } from 'tesseract.js';
import { Camera, Upload, X } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { toast } = useToast();

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
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

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        setPreviewUrl(imageUrl);
        processImage(imageUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  const processImage = async (imageUrl: string) => {
    setIsProcessing(true);
    try {
      const worker = await createWorker();
      await worker.loadLanguage('eng');
      await worker.initialize('eng');
      const { data: { text } } = await worker.recognize(imageUrl);
      await worker.terminate();

      // Extract potential fields from the text
      const lines = text.split('\n');
      const fields: Record<string, string> = {};

      lines.forEach(line => {
        const cleanLine = line.toLowerCase().trim();
        if (cleanLine.includes('sap') || /^\d{8}$/.test(cleanLine)) {
          fields.sapNumber = cleanLine.replace(/[^0-9]/g, '');
        }
        if (cleanLine.includes('bol') || /^b\d{6}$/i.test(cleanLine)) {
          fields.bolNumber = cleanLine.replace(/[^0-9]/g, '');
        }
        if (/^[0-9a-zA-Z-]{6,}$/.test(cleanLine)) {
          fields.barcode = cleanLine;
        }
        if (cleanLine.includes('store') || cleanLine.includes('location')) {
          fields.storeLocation = line.trim();
        }
      });

      onScan(fields);
      toast({
        title: "OCR Complete",
        description: "Text has been extracted successfully.",
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

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">OCR Scanner</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-4">
          {!previewUrl && !videoRef.current?.srcObject && (
            <div className="flex gap-2 justify-center">
              <Button onClick={startCamera}>
                <Camera className="mr-2 h-4 w-4" />
                Use Camera
              </Button>
              <Button onClick={() => fileInputRef.current?.click()}>
                <Upload className="mr-2 h-4 w-4" />
                Upload Image
              </Button>
              <Input
                type="file"
                accept="image/*"
                className="hidden"
                ref={fileInputRef}
                onChange={handleFileUpload}
              />
            </div>
          )}

          {videoRef.current?.srcObject && (
            <div className="relative">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full rounded-lg"
              />
              <Button
                className="absolute bottom-4 left-1/2 transform -translate-x-1/2"
                onClick={captureImage}
                disabled={isProcessing}
              >
                Capture
              </Button>
            </div>
          )}

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
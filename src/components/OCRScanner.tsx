import React, { useRef, useCallback, useState } from 'react';
import { Button } from './ui/button';
import { X } from 'lucide-react';
import { useToast } from './ui/use-toast';
import { CameraPermissionError } from './scanner/CameraPermissionError';
import { CameraPreview } from './scanner/CameraPreview';
import { createWorker, PSM } from 'tesseract.js';
import { extractFieldsFromText } from '@/utils/ocrUtils';

interface OCRScannerProps {
  onScan: (fields: {
    sapNumber?: string;
    barcode?: string;
    storeLocation?: string;
    bolNumber?: string;
    quantity?: number;
  }) => void;
  onClose: () => void;
}

export const OCRScanner = ({ onScan, onClose }: OCRScannerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [hasPermission, setHasPermission] = React.useState<boolean>(true);
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const { toast } = useToast();

  const startCamera = async () => {
    try {
      const constraints = {
        video: {
          facingMode: 'environment',
          width: { ideal: 3840 }, // 4K resolution
          height: { ideal: 2160 },
          aspectRatio: { ideal: 1.7777777778 },
        }
      };
      
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
      }
      setHasPermission(true);
    } catch (error) {
      console.error('Error accessing camera:', error);
      setHasPermission(false);
    }
  };

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }, []);

  const captureImage = async () => {
    if (!videoRef.current) return;

    const canvas = document.createElement('canvas');
    const video = videoRef.current;
    
    // Set canvas to maximum resolution
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (video.style.transform.includes('scaleX(-1)')) {
      ctx.scale(-1, 1);
      ctx.translate(-canvas.width, 0);
    }

    // Apply image processing for better OCR
    ctx.filter = 'contrast(1.2) brightness(1.1)';
    ctx.drawImage(video, 0, 0);
    const dataUrl = canvas.toDataURL('image/jpeg', 1.0);
    setPreviewUrl(dataUrl);
    
    toast({
      title: "Image captured",
      description: "Processing image...",
      duration: 3000,
    });

    try {
      setIsProcessing(true);
      const worker = await createWorker();
      
      await worker.setParameters({
        tessedit_char_whitelist: '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ-:#',
        tessedit_pageseg_mode: PSM.SINGLE_BLOCK,
        tessjs_create_pdf: '0',
        tessjs_create_hocr: '0',
        tessedit_do_invert: '0',
        tessedit_image_to_text: '1',
        tessedit_ocr_engine_mode: '1',
      });
      
      // Try multiple recognition attempts with different image processing
      let text = '';
      const { data } = await worker.recognize(canvas);
      text = data.text;
      
      console.log('Raw OCR text:', text);
      const extractedFields = extractFieldsFromText(text);
      
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
          description: "Data extracted successfully",
          duration: 3000,
        });
        onScan(extractedFields);
        stopCamera();
        onClose();
      }
      await worker.terminate();
    } catch (error) {
      console.error('OCR Error:', error);
      toast({
        title: "Error",
        description: "Failed to process the image. Please try again.",
        variant: "destructive",
        duration: 3000,
      });
    } finally {
      setIsProcessing(false);
    }
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
  }, [stopCamera]);

  if (!hasPermission) {
    return <CameraPermissionError onClose={handleClose} />;
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-start justify-center p-4 z-50 pt-2">
      <div className="bg-white rounded-lg p-4 w-full max-w-2xl mt-2">
        <div className="flex justify-between items-center mb-2">
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
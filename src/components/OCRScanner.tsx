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
  const [cameraSettings, setCameraSettings] = useState({
    brightness: 100,
    contrast: 100,
    saturation: 100,
  });
  const { toast } = useToast();

  const startCamera = async () => {
    try {
      const constraints = {
        video: {
          facingMode: 'environment',
          width: { ideal: 3840 }, // 4K resolution
          height: { ideal: 2160 },
          aspectRatio: { ideal: 1.7777777778 },
          frameRate: { ideal: 30 },
        }
      };
      
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        
        try {
          const track = stream.getVideoTracks()[0];
          const capabilities = track.getCapabilities();
          console.log('Camera capabilities:', capabilities);
          
          const extendedCapabilities = capabilities as any;
          
          const advancedSettings: Record<string, any> = {};
          
          if (extendedCapabilities.focusMode) {
            advancedSettings.focusMode = 'continuous';
          }
          
          if (extendedCapabilities.exposureMode) {
            advancedSettings.exposureMode = 'continuous';
          }
          
          if (Object.keys(advancedSettings).length > 0) {
            await track.applyConstraints({
              advanced: [advancedSettings]
            });
          }
        } catch (settingsError) {
          console.error('Could not optimize camera settings:', settingsError);
        }
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

  const handleSettingsChange = (settings: {
    brightness: number;
    contrast: number;
    saturation: number;
  }) => {
    setCameraSettings(settings);
  };

  const captureAndProcessFrames = async () => {
    if (!videoRef.current) return;
    
    setIsProcessing(true);
    
    toast({
      title: "Image captured",
      description: "Processing multiple frames for better accuracy...",
      duration: 3000,
    });
    
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
    
    ctx.filter = `brightness(${cameraSettings.brightness}%) contrast(${cameraSettings.contrast}%) saturate(${cameraSettings.saturation}%)`;
    ctx.drawImage(video, 0, 0);
    const dataUrl = canvas.toDataURL('image/jpeg', 1.0);
    setPreviewUrl(dataUrl);
    
    const frameResults = [];
    const filters = [
      { brightness: cameraSettings.brightness/100, contrast: cameraSettings.contrast/100, saturation: cameraSettings.saturation/100 },
      { brightness: 1.1, contrast: 1.3, saturation: 1.0 },
      { brightness: 1.0, contrast: 1.2, saturation: 0.9 },
    ];
    
    try {
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
      
      for (const filter of filters) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        
        if (video.style.transform.includes('scaleX(-1)')) {
          ctx.scale(-1, 1);
          ctx.translate(-canvas.width, 0);
        }
        
        ctx.filter = `brightness(${filter.brightness * 100}%) contrast(${filter.contrast * 100}%) saturate(${filter.saturation * 100}%)`;
        ctx.drawImage(video, 0, 0);
        
        const { data } = await worker.recognize(canvas);
        const text = data.text;
        
        console.log('Frame OCR text:', text);
        console.log('Original text:', text);
        
        const fields = extractFieldsFromText(text);
        frameResults.push({ text, fields });
      }
      
      await worker.terminate();
      
      console.log('Multi-frame results:', frameResults);
      const mergedFields = mergeExtractedFields(frameResults.map(r => r.fields));
      
      if (Object.keys(mergedFields).length === 0) {
        toast({
          title: "No data found",
          description: "Could not extract any information from the images. Please try again with better lighting and focus.",
          variant: "destructive",
          duration: 3000,
        });
      } else {
        toast({
          title: "Success",
          description: "Data extracted successfully",
          duration: 3000,
        });
        onScan(mergedFields);
        stopCamera();
        onClose();
      }
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

  const mergeExtractedFields = (fieldsArray: Array<{
    sapNumber?: string;
    barcode?: string;
    storeLocation?: string;
    bolNumber?: string;
    quantity?: number;
  }>) => {
    const stringFieldNames = ['sapNumber', 'barcode', 'storeLocation', 'bolNumber'] as const;
    type StringFieldName = typeof stringFieldNames[number];
    
    const result: {
      sapNumber?: string;
      barcode?: string;
      storeLocation?: string;
      bolNumber?: string;
      quantity?: number;
    } = {};
    
    for (const fieldName of stringFieldNames) {
      const values = fieldsArray
        .map(fields => fields[fieldName])
        .filter((val): val is string => val !== undefined && val !== '');
      
      if (values.length > 0) {
        const valueCounts = values.reduce((acc, val) => {
          acc[val] = (acc[val] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);
        
        const mostCommonValue = Object.entries(valueCounts)
          .sort((a, b) => b[1] - a[1])[0][0];
        
        result[fieldName] = mostCommonValue;
      }
    }
    
    const quantities = fieldsArray
      .map(fields => fields.quantity)
      .filter((val): val is number => val !== undefined);
    
    if (quantities.length > 0) {
      const sortedQuantities = [...quantities].sort((a, b) => a - b);
      const medianIndex = Math.floor(sortedQuantities.length / 2);
      result.quantity = sortedQuantities[medianIndex];
    }
    
    return result;
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
          onCapture={captureAndProcessFrames}
          onSettingsChange={handleSettingsChange}
        />
      </div>
    </div>
  );
};

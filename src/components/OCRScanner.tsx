
import React, { useRef, useCallback, useState, useEffect } from 'react';
import { Button } from './ui/button';
import { X, Camera, RotateCw, ZoomIn, ZoomOut, SunMoon, Scan } from 'lucide-react';
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
  const [hasPermission, setHasPermission] = useState<boolean>(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [brightness, setBrightness] = useState<number>(1.1); // Default brightness
  const [contrast, setContrast] = useState<number>(1.2); // Default contrast
  const [zoom, setZoom] = useState<number>(1.0); // Default zoom level
  const [showGuide, setShowGuide] = useState<boolean>(true); // Show scanning guide by default
  const [capturedFrames, setCapturedFrames] = useState<string[]>([]);
  const { toast } = useToast();

  const startCamera = async () => {
    try {
      const constraints = {
        video: {
          facingMode: 'environment',
          width: { ideal: 3840 }, // 4K resolution
          height: { ideal: 2160 },
          aspectRatio: { ideal: 1.7777777778 }
          // Remove advanced constraints that use non-standard properties
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

  const adjustZoom = (direction: 'in' | 'out') => {
    const newZoom = direction === 'in' ? Math.min(zoom + 0.1, 3.0) : Math.max(zoom - 0.1, 1.0);
    setZoom(newZoom);
    // Instead of trying to update camera settings directly,
    // we'll apply zoom effect during capture
  };

  const adjustBrightness = () => {
    const newBrightness = brightness === 1.1 ? 1.3 : 1.1; // Toggle between normal and bright
    setBrightness(newBrightness);
  };

  const updateCameraSettings = () => {
    if (streamRef.current) {
      const videoTrack = streamRef.current.getVideoTracks()[0];
      if (videoTrack && 'applyConstraints' in videoTrack) {
        try {
          const capabilities = videoTrack.getCapabilities();
          // We won't attempt to apply zoom constraints directly
          // since they're not standard and vary by browser
        } catch (e) {
          console.error('Error updating camera settings:', e);
        }
      }
    }
  };

  // Update camera settings when zoom changes
  useEffect(() => {
    // Don't try to set non-standard zoom constraints
  }, [zoom]);

  const captureFrame = () => {
    if (!videoRef.current) return;

    const canvas = document.createElement('canvas');
    const video = videoRef.current;
    
    // Set canvas to match video dimensions
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Apply mirroring if needed
    if (video.style.transform && video.style.transform.includes('scaleX(-1)')) {
      ctx.scale(-1, 1);
      ctx.translate(-canvas.width, 0);
    }

    // Apply image processing adjustments
    ctx.filter = `contrast(${contrast}) brightness(${brightness})`;
    
    // Apply zoom effect during capture
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
    return { canvas, dataUrl };
  };

  const processMultipleFrames = async () => {
    const frames: string[] = [];
    
    // Capture multiple frames with slight delay between them
    for (let i = 0; i < 3; i++) {
      const frame = captureFrame();
      if (frame) {
        frames.push(frame.dataUrl);
        await new Promise(resolve => setTimeout(resolve, 200)); // Small delay between captures
      }
    }
    
    setCapturedFrames(frames);
    setPreviewUrl(frames[0]); // Show the first frame as preview
    
    return frames;
  };

  const captureImage = async () => {
    toast({
      title: "Capturing frames",
      description: "Processing multiple frames for better accuracy...",
      duration: 2000,
    });

    try {
      setIsProcessing(true);
      const frames = await processMultipleFrames();
      
      if (frames.length === 0) {
        toast({
          title: "Capture failed",
          description: "Could not capture image frames. Please try again.",
          variant: "destructive",
          duration: 3000,
        });
        setIsProcessing(false);
        return;
      }
      
      // Process each frame and collect results
      const results: Array<{
        text: string,
        fields: {
          sapNumber?: string;
          barcode?: string;
          storeLocation?: string;
          bolNumber?: string;
          quantity?: number;
        }
      }> = [];
      
      for (const frameUrl of frames) {
        const worker = await createWorker();
        
        await worker.setParameters({
          tessedit_char_whitelist: '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-:#. ',
          tessedit_pageseg_mode: PSM.SINGLE_BLOCK,
          tessjs_create_pdf: '0',
          tessjs_create_hocr: '0',
          tessedit_do_invert: '0',
          tessedit_image_to_text: '1',
          tessedit_ocr_engine_mode: '1',
        });
        
        const { data } = await worker.recognize(frameUrl);
        const text = data.text;
        console.log('Frame OCR text:', text);
        
        const extractedFields = extractFieldsFromText(text);
        results.push({ text, fields: extractedFields });
        
        await worker.terminate();
      }
      
      console.log('Multi-frame results:', results);
      
      // Merge results from all frames, prioritizing most frequent values
      const mergedFields = mergeExtractedFields(results.map(r => r.fields));
      
      if (Object.keys(mergedFields).filter(k => mergedFields[k as keyof typeof mergedFields] !== undefined).length === 0) {
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

  // Helper function to merge results from multiple frames
  const mergeExtractedFields = (fieldSets: Array<{
    sapNumber?: string;
    barcode?: string;
    storeLocation?: string;
    bolNumber?: string;
    quantity?: number;
  }>) => {
    const merged: {
      sapNumber?: string;
      barcode?: string;
      storeLocation?: string;
      bolNumber?: string;
      quantity?: number;
    } = {};
    
    // Get most frequent value for each field
    ['sapNumber', 'barcode', 'storeLocation', 'bolNumber'].forEach(field => {
      const fieldName = field as keyof typeof merged;
      const values = fieldSets
        .map(set => set[fieldName])
        .filter(val => val !== undefined) as string[];
      
      if (values.length > 0) {
        // Find most frequent value
        const valueCounts = values.reduce((acc, val) => {
          acc[val] = (acc[val] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);
        
        let mostFrequent = '';
        let highestCount = 0;
        
        Object.entries(valueCounts).forEach(([val, count]) => {
          if (count > highestCount) {
            mostFrequent = val;
            highestCount = count;
          }
        });
        
        merged[fieldName] = mostFrequent;
      }
    });
    
    // For quantity, use the most reasonable value
    const quantities = fieldSets
      .map(set => set.quantity)
      .filter(val => val !== undefined) as number[];
    
    if (quantities.length > 0) {
      // Sort and take the median to avoid outliers
      quantities.sort((a, b) => a - b);
      const medianIndex = Math.floor(quantities.length / 2);
      merged.quantity = quantities[medianIndex];
    }
    
    return merged;
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
          <h2 className="text-xl font-semibold">Enhanced Scanner</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

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

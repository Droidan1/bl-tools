import React, { useRef, useCallback, useState } from 'react';
import { Button } from './ui/button';
import { X } from 'lucide-react';
import { useToast } from './ui/use-toast';
import { CameraPermissionError } from './scanner/CameraPermissionError';
import { CameraPreview } from './scanner/CameraPreview';
import { pipeline } from '@huggingface/transformers';
import { extractFieldsFromText } from '@/utils/ocrUtils';

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
          width: { ideal: 3840 },
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

  const processWithAI = async (imageData: string) => {
    try {
      // Initialize the AI pipeline for image segmentation
      const segmenter = await pipeline('image-segmentation', 'Xenova/segformer-b0-finetuned-ade-512-512', {
        device: 'webgpu'
      });
      
      // Process the image
      const segments = await segmenter(imageData);
      
      // Initialize text recognition pipeline
      const recognizer = await pipeline('image-to-text', 'microsoft/trocr-base-printed', {
        device: 'webgpu'
      });
      
      // Process text segments
      let fullText = '';
      for (const segment of segments) {
        if (segment.label === 'text') {
          // Convert mask to base64 string if needed
          const maskData = segment.mask instanceof HTMLCanvasElement 
            ? segment.mask.toDataURL() 
            : segment.mask;
            
          const textResult = await recognizer(maskData);
          
          // Handle the result based on its structure
          if (Array.isArray(textResult)) {
            const generated_text = textResult[0]?.generated_text;
            if (generated_text) {
              fullText += generated_text + '\n';
            }
          } else if ('generated_text' in textResult) {
            fullText += textResult.generated_text + '\n';
          }
        }
      }
      
      console.log('AI processed text:', fullText);
      return fullText;
    } catch (error) {
      console.error('AI processing error:', error);
      throw error;
    }
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
      const text = await processWithAI(dataUrl);
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
          description: "Data extracted successfully using AI",
          duration: 3000,
        });
        onScan(extractedFields);
        stopCamera();
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

  React.useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

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
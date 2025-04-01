
import { useState, useRef, useEffect } from 'react';
import { BrowserQRCodeReader } from '@zxing/library';
import { useToast } from "@/hooks/use-toast";

export const useBarcodeScanner = (
  onScan: (result: string) => void,
  onClose: () => void
) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [permissionGranted, setPermissionGranted] = useState<boolean | null>(null);
  const [lastScannedCode, setLastScannedCode] = useState<string | null>(null);
  const codeReaderRef = useRef<BrowserQRCodeReader | null>(null);
  const { toast } = useToast();

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    
    // Clean up code reader
    if (codeReaderRef.current) {
      codeReaderRef.current.reset();
      codeReaderRef.current = null;
    }
  };

  const startScanning = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }

      const codeReader = new BrowserQRCodeReader();
      codeReaderRef.current = codeReader;
      const devices = await codeReader.listVideoInputDevices();
      
      const selectedDeviceId = devices.find(device => 
        device.label.toLowerCase().includes('back') || 
        device.label.toLowerCase().includes('rear')
      )?.deviceId || devices[0]?.deviceId;

      if (selectedDeviceId && videoRef.current) {
        console.log('Starting barcode scanning with device:', selectedDeviceId);
        
        try {
          codeReader.decodeFromVideoDevice(
            selectedDeviceId,
            videoRef.current,
            (result, error) => {
              if (result) {
                const scannedText = result.getText();
                console.log('Raw scanned text:', scannedText);
                
                // Extract digits from the BL-xxxxx-x format
                let extractedCode = '';
                
                // Check if the scanned text contains "BL-"
                if (scannedText.includes("BL-")) {
                  // Split by "BL-" and get the part after it
                  const afterPrefix = scannedText.split("BL-")[1];
                  
                  if (afterPrefix) {
                    // Extract the first continuous block of digits
                    const digitMatches = afterPrefix.match(/^\d+/);
                    if (digitMatches && digitMatches[0]) {
                      // Take the first 5 digits or all if less than 5
                      extractedCode = digitMatches[0].substring(0, 5);
                    }
                  }
                } else {
                  // Fallback to original behavior if "BL-" not found
                  const digitMatches = scannedText.match(/\d+/);
                  extractedCode = digitMatches && digitMatches[0] 
                    ? digitMatches[0].substring(0, 5) 
                    : scannedText.substring(0, 5);
                }
                
                console.log('Extracted code:', extractedCode);
                
                // Only process the code if it's different from the last scanned code
                // and if we successfully extracted a code
                if (extractedCode && extractedCode !== lastScannedCode) {
                  setLastScannedCode(extractedCode);
                  onScan(extractedCode);
                  handleClose();
                }
              }
              if (error) {
                // Only log actual errors, not the regular "not found yet" errors
                if (error.name !== 'NotFoundException') {
                  console.log('Scanning error:', error);
                }
              }
            }
          );
          setPermissionGranted(true);
        } catch (scanError) {
          console.error('Error during scanning setup:', scanError);
          setPermissionGranted(false);
          toast({
            title: "Scanner Error",
            description: "Failed to initialize the barcode scanner",
            variant: "destructive",
          });
        }
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      setPermissionGranted(false);
      toast({
        title: "Camera Error",
        description: "There was an error accessing your camera",
        variant: "destructive",
      });
    }
  };

  const handleClose = () => {
    stopCamera();
    onClose();
  };

  useEffect(() => {
    startScanning();
    return () => {
      stopCamera();
    };
  }, []);

  return {
    videoRef,
    permissionGranted,
    handleClose
  };
};

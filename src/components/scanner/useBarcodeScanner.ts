import { useState, useRef, useEffect } from 'react';
import { BrowserQRCodeReader } from '@zxing/library';
import { useToast } from "@/components/ui/use-toast";

export const useBarcodeScanner = (
  onScan: (result: string) => void,
  onClose: () => void
) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [permissionGranted, setPermissionGranted] = useState<boolean | null>(null);
  const { toast } = useToast();

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
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
                console.log('Barcode detected:', result.getText());
                onScan(result.getText());
                handleClose();
              }
              if (error) {
                console.log('Scanning error:', error);
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
import React, { useEffect, useRef, useState } from 'react';
import { BrowserQRCodeReader } from '@zxing/library';
import { Button } from '@/components/ui/button';
import { useToast } from "@/components/ui/use-toast";

interface BarcodeScannerProps {
  onScan: (result: string) => void;
  onClose: () => void;
}

export const BarcodeScanner = ({ onScan, onClose }: BarcodeScannerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const controlsRef = useRef<any>(null);
  const [permissionGranted, setPermissionGranted] = useState<boolean | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const requestCameraPermission = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        stream.getTracks().forEach(track => track.stop()); // Stop the test stream
        setPermissionGranted(true);
        startScanning();
      } catch (error) {
        console.error('Camera permission denied:', error);
        setPermissionGranted(false);
        toast({
          title: "Camera Access Denied",
          description: "Please allow camera access to scan barcodes",
          variant: "destructive",
        });
      }
    };

    const startScanning = async () => {
      try {
        const codeReader = new BrowserQRCodeReader();
        const devices = await codeReader.listVideoInputDevices();
        
        const selectedDeviceId = devices.find(device => 
          device.label.toLowerCase().includes('back') || 
          device.label.toLowerCase().includes('rear')
        )?.deviceId || devices[0]?.deviceId;

        if (selectedDeviceId && videoRef.current) {
          controlsRef.current = await codeReader.decodeFromVideoDevice(
            selectedDeviceId,
            videoRef.current,
            (result) => {
              if (result) {
                onScan(result.getText());
                onClose();
              }
            }
          );
        }
      } catch (error) {
        console.error('Error accessing camera:', error);
        toast({
          title: "Camera Error",
          description: "There was an error accessing your camera",
          variant: "destructive",
        });
      }
    };

    requestCameraPermission();

    return () => {
      if (controlsRef.current) {
        controlsRef.current.stop();
      }
    };
  }, [onScan, onClose, toast]);

  if (permissionGranted === false) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg w-full max-w-sm mx-auto p-6 text-center">
          <h3 className="text-lg font-semibold mb-2">Camera Access Required</h3>
          <p className="text-sm text-gray-600 mb-4">
            Please enable camera access in your browser settings to scan barcodes.
          </p>
          <Button onClick={onClose}>Close</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-sm mx-auto">
        <div className="p-4">
          <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-muted">
            <video ref={videoRef} className="h-full w-full object-cover" />
            <Button 
              onClick={onClose}
              className="absolute top-2 right-2 z-10"
              variant="secondary"
              size="sm"
            >
              Close
            </Button>
          </div>
          <p className="text-sm text-center mt-4 text-muted-foreground">
            Position the barcode within the camera view
          </p>
        </div>
      </div>
    </div>
  );
};
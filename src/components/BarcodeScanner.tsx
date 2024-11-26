import React, { useEffect, useRef } from 'react';
import { BrowserQRCodeReader, IScannerControls } from '@zxing/library';
import { Button } from '@/components/ui/button';

interface BarcodeScannerProps {
  onScan: (result: string) => void;
  onClose: () => void;
}

export const BarcodeScanner = ({ onScan, onClose }: BarcodeScannerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const controlsRef = useRef<IScannerControls | null>(null);

  useEffect(() => {
    const startScanning = async () => {
      try {
        const codeReader = new BrowserQRCodeReader();
        
        // Get video devices
        const devices = await codeReader.listVideoInputDevices();
        
        // Prefer environment-facing (rear) camera
        const selectedDeviceId = devices.find(device => 
          device.label.toLowerCase().includes('back') || 
          device.label.toLowerCase().includes('rear')
        )?.deviceId || devices[0]?.deviceId;

        if (selectedDeviceId && videoRef.current) {
          // Start continuous scanning
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
      }
    };

    startScanning();

    // Cleanup function
    return () => {
      if (controlsRef.current) {
        controlsRef.current.stop();
      }
    };
  }, [onScan, onClose]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-4 rounded-lg max-w-sm w-full mx-4">
        <div className="relative">
          <video ref={videoRef} className="w-full rounded-lg" />
          <Button 
            onClick={onClose}
            className="absolute top-2 right-2"
            variant="secondary"
          >
            Close
          </Button>
        </div>
        <p className="text-sm text-center mt-2 text-gray-600">
          Position the barcode within the camera view
        </p>
      </div>
    </div>
  );
};
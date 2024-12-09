import React from 'react';
import { CameraPermissionError } from './scanner/CameraPermissionError';
import { ScannerPreview } from './scanner/ScannerPreview';
import { useBarcodeScanner } from './scanner/useBarcodeScanner';

interface BarcodeScannerProps {
  onScan: (result: string) => void;
  onClose: () => void;
}

export const BarcodeScanner = ({ onScan, onClose }: BarcodeScannerProps) => {
  const { videoRef, permissionGranted, handleClose } = useBarcodeScanner(onScan, onClose);

  if (permissionGranted === false) {
    return <CameraPermissionError onClose={handleClose} />;
  }

  return <ScannerPreview videoRef={videoRef} onClose={handleClose} />;
};
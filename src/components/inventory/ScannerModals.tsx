import React from 'react';
import { BarcodeScanner } from '../BarcodeScanner';
import { OCRScanner } from '../OCRScanner';
import { AIScan } from '../AIScan';
import { PhotoCapture } from '../PhotoCapture';

interface ScannerModalsProps {
  showScanner: boolean;
  showOCRScanner: boolean;
  showAIScanner: boolean;
  showCamera: boolean;
  onScan: (result: string) => void;
  onOCRScan: (fields: {
    sapNumber?: string;
    barcode?: string;
    storeLocation?: string;
    bolNumber?: string;
  }) => void;
  onPhotoCapture: (photoUrl: string) => void;
  onClose: () => void;
}

export const ScannerModals = ({
  showScanner,
  showOCRScanner,
  showAIScanner,
  showCamera,
  onScan,
  onOCRScan,
  onPhotoCapture,
  onClose,
}: ScannerModalsProps) => (
  <>
    {showScanner && (
      <BarcodeScanner
        onScan={onScan}
        onClose={onClose}
      />
    )}
    {showOCRScanner && (
      <OCRScanner
        onScan={onOCRScan}
        onClose={onClose}
      />
    )}
    {showAIScanner && (
      <AIScan
        onScan={onOCRScan}
        onClose={onClose}
      />
    )}
    {showCamera && (
      <PhotoCapture
        onCapture={onPhotoCapture}
        onClose={onClose}
      />
    )}
  </>
);
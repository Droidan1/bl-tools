
import React from 'react';
import { BarcodeScanner } from '../BarcodeScanner';
import { OCRScanner } from '../OCRScanner';
import { PhotoCapture } from '../PhotoCapture';

interface ScannerModalsProps {
  showScanner: boolean;
  showOCRScanner: boolean;
  showAIScanner: boolean; // Keeping this in the interface for now to avoid breaking changes elsewhere
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
    {showCamera && (
      <PhotoCapture
        onCapture={onPhotoCapture}
        onClose={onClose}
      />
    )}
  </>
);

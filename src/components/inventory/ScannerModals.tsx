import React from 'react';
import { BarcodeScanner } from '../BarcodeScanner';
import { OCRScanner } from '../OCRScanner';

interface ScannerModalsProps {
  showScanner: boolean;
  showOCRScanner: boolean;
  onScan: (result: string) => void;
  onOCRScan: (fields: {
    sapNumber?: string;
    barcode?: string;
    storeLocation?: string;
    bolNumber?: string;
  }) => void;
  onClose: () => void;
}

export const ScannerModals = ({
  showScanner,
  showOCRScanner,
  onScan,
  onOCRScan,
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
  </>
);
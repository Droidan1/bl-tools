import React from 'react';
import { BarcodeScanner } from '../BarcodeScanner';

interface ScannerModalsProps {
  showScanner: boolean;
  onScan: (result: string) => void;
  onClose: () => void;
}

export const ScannerModals = ({
  showScanner,
  onScan,
  onClose,
}: ScannerModalsProps) => (
  <>
    {showScanner && (
      <BarcodeScanner
        onScan={onScan}
        onClose={onClose}
      />
    )}
  </>
);
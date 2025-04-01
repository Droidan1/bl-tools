
import React from 'react';
import { BarcodeScanner } from "@/components/BarcodeScanner";

interface MOSScannerModalProps {
  showScanner: boolean;
  onScan: (result: string) => void;
  onClose: () => void;
}

export const MOSScannerModal: React.FC<MOSScannerModalProps> = ({
  showScanner,
  onScan,
  onClose
}) => {
  if (!showScanner) {
    return null;
  }

  return (
    <BarcodeScanner
      onScan={onScan}
      onClose={onClose}
    />
  );
};

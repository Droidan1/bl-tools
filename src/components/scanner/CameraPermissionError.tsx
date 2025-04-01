import React from 'react';
import { Button } from '@/components/ui/button';

interface CameraPermissionErrorProps {
  onClose: () => void;
}

export const CameraPermissionError = ({ onClose }: CameraPermissionErrorProps) => (
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
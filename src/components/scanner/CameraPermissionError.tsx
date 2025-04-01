
import React from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';

interface CameraPermissionErrorProps {
  onClose: () => void;
}

export const CameraPermissionError = ({ onClose }: CameraPermissionErrorProps) => (
  <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-lg w-full max-w-[300px] mx-auto p-5 text-center">
      <AlertCircle className="h-10 w-10 text-red-500 mx-auto mb-2" />
      <h3 className="text-lg font-semibold mb-2">Camera Access Required</h3>
      <p className="text-sm text-gray-600 mb-4">
        Please enable camera access in your device settings to scan barcodes.
      </p>
      <Button onClick={onClose} className="w-full">Close</Button>
    </div>
  </div>
);

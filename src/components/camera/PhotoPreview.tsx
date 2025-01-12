import React from 'react';
import { Button } from '../ui/button';
import { RotateCcw } from 'lucide-react';

interface PhotoPreviewProps {
  previewUrl: string;
  onRetake: () => void;
  onConfirm: () => void;
}

export const PhotoPreview = ({ previewUrl, onRetake, onConfirm }: PhotoPreviewProps) => {
  return (
    <div className="space-y-4">
      <img
        src={previewUrl}
        alt="Preview"
        className="w-full h-[600px] object-cover rounded-lg"
      />
      <div className="flex justify-center gap-4">
        <Button 
          variant="outline" 
          onClick={onRetake}
          className="flex items-center"
        >
          <RotateCcw className="mr-2 h-4 w-4" />
          Retake
        </Button>
        <Button onClick={onConfirm}>
          Confirm
        </Button>
      </div>
    </div>
  );
};
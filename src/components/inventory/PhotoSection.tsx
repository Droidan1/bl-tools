import React from 'react';
import { Button } from "@/components/ui/button";
import { Camera } from 'lucide-react';

interface PhotoSectionProps {
  photoUrl: string | null;
  onShowCamera: () => void;
}

export const PhotoSection = ({ photoUrl, onShowCamera }: PhotoSectionProps) => (
  <div className="space-y-2">
    <label className="text-sm font-medium text-white">
      Photo *
    </label>
    <div className="flex flex-col gap-2">
      {photoUrl ? (
        <div className="relative">
          <img 
            src={photoUrl} 
            alt="Captured" 
            className="w-full h-40 object-cover rounded-lg"
          />
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={onShowCamera}
            className="absolute bottom-2 right-2"
          >
            <Camera className="h-4 w-4 mr-2" />
            Retake
          </Button>
        </div>
      ) : (
        <Button
          type="button"
          variant="secondary"
          onClick={onShowCamera}
          className="w-full"
        >
          <Camera className="h-4 w-4 mr-2" />
          Take Photo
        </Button>
      )}
    </div>
  </div>
);
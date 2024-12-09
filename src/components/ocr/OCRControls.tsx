import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface OCRControlsProps {
  preprocessOption: string;
  setPreprocessOption: (value: string) => void;
}

export const OCRControls: React.FC<OCRControlsProps> = ({
  preprocessOption,
  setPreprocessOption,
}) => {
  return (
    <div className="mb-4">
      <Select
        value={preprocessOption}
        onValueChange={setPreprocessOption}
      >
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Image Processing" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="default">Default</SelectItem>
          <SelectItem value="grayscale">Grayscale</SelectItem>
          <SelectItem value="highContrast">High Contrast</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
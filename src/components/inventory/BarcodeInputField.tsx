import React, { RefObject } from 'react';
import { Camera, ScanText } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

interface BarcodeInputFieldProps {
  barcode: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  inputRef: RefObject<HTMLInputElement>;
  onScanClick?: () => void;
  onOCRClick?: () => void;
}

export const BarcodeInputField = ({
  barcode,
  onChange,
  inputRef,
  onScanClick,
  onOCRClick,
}: BarcodeInputFieldProps) => (
  <div className="space-y-2">
    <label htmlFor="barcode" className="text-sm font-medium text-white">
      Barcode *
    </label>
    <div className="flex gap-2">
      <Input
        id="barcode"
        value={barcode}
        onChange={onChange}
        placeholder="Enter or scan barcode"
        ref={inputRef}
        required
      />
      <Button
        type="button"
        variant="secondary"
        size="icon"
        onClick={onScanClick}
        className="shrink-0"
      >
        <Camera className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant="secondary"
        size="icon"
        onClick={onOCRClick}
        className="shrink-0"
      >
        <ScanText className="h-4 w-4" />
      </Button>
    </div>
  </div>
);
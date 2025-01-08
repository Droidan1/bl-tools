import React, { RefObject } from 'react';
import { Input } from '../ui/input';
import { InteractiveHoverButton } from '../ui/interactive-hover-button';

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
  <div className="space-y-4">
    <div className="flex justify-center gap-2 mb-2">
      <InteractiveHoverButton
        type="button"
        onClick={onScanClick}
        text="Barcode"
        className="shrink-0"
      />
      <InteractiveHoverButton
        type="button"
        onClick={onOCRClick}
        text="Scan"
        className="shrink-0"
      />
    </div>
    <Input
      id="barcode"
      value={barcode}
      onChange={onChange}
      placeholder="Enter or scan barcode"
      ref={inputRef}
      required
    />
  </div>
);
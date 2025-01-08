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
  </div>
);
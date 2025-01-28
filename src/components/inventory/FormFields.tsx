import React from 'react';
import { FormField } from './FormField';
import { QuantityInput } from './QuantityInput';
import { BarcodeInputField } from './BarcodeInputField';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Brain } from 'lucide-react';

interface FormFieldsProps {
  barcode: string;
  sapNumber: string;
  quantity: number;
  onBarcodeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSAPNumberChange: (value: string) => void;
  onQuantityChange: (value: number) => void;
  onQuantityIncrement: () => void;
  onQuantityDecrement: () => void;
  barcodeInputRef: React.RefObject<HTMLInputElement>;
  onScanClick?: () => void;
  onOCRClick?: () => void;
  onAIScanClick?: () => void;
}

export const FormFields = ({
  barcode,
  sapNumber,
  quantity,
  onBarcodeChange,
  onSAPNumberChange,
  onQuantityChange,
  onQuantityIncrement,
  onQuantityDecrement,
  barcodeInputRef,
  onScanClick,
  onOCRClick,
  onAIScanClick,
}: FormFieldsProps) => (
  <>
    <div className="space-y-4">
      <div className="flex justify-center gap-2 mb-2">
        <Button
          type="button"
          onClick={onOCRClick}
          className="flex-1"
          variant="outline"
        >
          Scan
        </Button>
        <Button
          type="button"
          onClick={onAIScanClick}
          className="flex-1"
          variant="outline"
        >
          <Brain className="mr-2 h-4 w-4" />
          AI Scan
        </Button>
      </div>
      <Input
        id="barcode"
        value={barcode}
        onChange={onBarcodeChange}
        placeholder="Enter or scan barcode"
        ref={barcodeInputRef}
        required
      />
    </div>

    <FormField
      id="sapNumber"
      label="SAP Item #"
      value={sapNumber}
      onChange={onSAPNumberChange}
      placeholder="Enter SAP Item number"
      required
    />

    <QuantityInput
      quantity={quantity}
      onIncrement={onQuantityIncrement}
      onDecrement={onQuantityDecrement}
      onChange={onQuantityChange}
    />
  </>
);
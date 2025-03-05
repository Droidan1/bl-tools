
import React from 'react';
import { QuantityInput } from './QuantityInput';
import { BarcodeInputField } from './BarcodeInputField';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

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
  onOCRClick?: () => void;
  onAIScanClick?: () => void; // Keeping this in the interface for now to avoid breaking changes elsewhere
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
  onOCRClick,
}: FormFieldsProps) => <>
    <div className="space-y-4">
      <div className="flex justify-center mb-2">
        <Button type="button" onClick={onOCRClick} className="flex-1" variant="outline">
          Scan
        </Button>
      </div>
      <Input id="barcode" value={barcode} onChange={onBarcodeChange} placeholder="Enter or scan barcode" ref={barcodeInputRef} required />
    </div>

    <div className="space-y-2">
      <label htmlFor="sapNumber" className="block text-sm font-medium text-White">
        SAP Item #
      </label>
      <Input id="sapNumber" value={sapNumber} onChange={e => onSAPNumberChange(e.target.value)} placeholder="Enter SAP Item number" required />
    </div>

    <QuantityInput quantity={quantity} onIncrement={onQuantityIncrement} onDecrement={onQuantityDecrement} onChange={onQuantityChange} />
  </>;

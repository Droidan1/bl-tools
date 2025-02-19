import React from 'react';
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
  onOCRClick,
  onAIScanClick
}: FormFieldsProps) => <>
    <div className="space-y-4">
      <div className="flex justify-center gap-2 mb-2">
        <Button type="button" onClick={onOCRClick} className="flex-1" variant="outline">
          Scan
        </Button>
        <Button type="button" onClick={onAIScanClick} className="flex-1" variant="outline">
          <Brain className="mr-2 h-4 w-4" />
          AI Scan
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
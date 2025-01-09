import React from 'react';
import { FormField } from './FormField';
import { QuantityInput } from './QuantityInput';
import { BarcodeInputField } from './BarcodeInputField';

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
}: FormFieldsProps) => (
  <>
    <BarcodeInputField
      barcode={barcode}
      onChange={onBarcodeChange}
      inputRef={barcodeInputRef}
      onScanClick={onScanClick}
      onOCRClick={onOCRClick}
    />

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
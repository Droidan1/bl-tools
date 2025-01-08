import React from 'react';
import { FormField } from './FormField';
import { QuantityInput } from './QuantityInput';
import { BarcodeInputField } from './BarcodeInputField';

interface FormFieldsProps {
  barcode: string;
  sapNumber: string;
  quantity: number;
  storeLocation: string;
  onBarcodeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSAPNumberChange: (value: string) => void;
  onStoreLocationChange: (value: string) => void;
  onQuantityChange: (value: number) => void;
  onQuantityIncrement: () => void;
  onQuantityDecrement: () => void;
  barcodeInputRef: React.RefObject<HTMLInputElement>;
}

export const FormFields = ({
  barcode,
  sapNumber,
  quantity,
  storeLocation,
  onBarcodeChange,
  onSAPNumberChange,
  onStoreLocationChange,
  onQuantityChange,
  onQuantityIncrement,
  onQuantityDecrement,
  barcodeInputRef,
}: FormFieldsProps) => (
  <>
    <FormField
      id="storeLocation"
      label="Store Location"
      value={storeLocation}
      onChange={onStoreLocationChange}
      placeholder="Enter store location"
      required
    />

    <BarcodeInputField
      barcode={barcode}
      onChange={onBarcodeChange}
      inputRef={barcodeInputRef}
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
import React, { useState, useRef, useEffect } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { FormField } from './inventory/FormField';
import { QuantityInput } from './inventory/QuantityInput';
import { FormHeader } from './inventory/FormHeader';
import { BarcodeInputField } from './inventory/BarcodeInputField';
import { FormContainer } from './inventory/FormContainer';
import { BarcodeScanner } from './BarcodeScanner';
import { SubmitButton } from './inventory/SubmitButton';
import type { InventoryItem } from '@/types/inventory';

interface InventoryFormProps {
  onSubmit: (item: Omit<InventoryItem, 'id' | 'timestamp'>) => void;
  initialValues?: InventoryItem;
}

export const InventoryForm = ({ onSubmit, initialValues }: InventoryFormProps) => {
  const [sapNumber, setSapNumber] = useState(initialValues?.sapNumber || '');
  const [quantity, setQuantity] = useState(initialValues?.quantity || 1);
  const [barcode, setBarcode] = useState(initialValues?.barcode || '');
  const [storeLocation, setStoreLocation] = useState(initialValues?.storeLocation || '');
  const [bolNumber, setBolNumber] = useState(initialValues?.bolNumber || '');
  const [lastScanTime, setLastScanTime] = useState(0);
  const [showScanner, setShowScanner] = useState(false);
  const barcodeInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (initialValues) {
      setSapNumber(initialValues.sapNumber);
      setQuantity(initialValues.quantity);
      setBarcode(initialValues.barcode || '');
      setStoreLocation(initialValues.storeLocation);
      setBolNumber(initialValues.bolNumber || '');
    }
  }, [initialValues]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!bolNumber || !barcode || !storeLocation || !sapNumber) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    
    onSubmit({
      sapNumber,
      quantity,
      barcode,
      storeLocation,
      bolNumber,
    });

    if (!initialValues) {
      setSapNumber('');
      setQuantity(1);
      setBarcode('');
      setBolNumber('');
      barcodeInputRef.current?.focus();
    }
  };

  const handleBarcodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    const currentTime = new Date().getTime();
    
    setBarcode(newValue);
    
    const isScannerInput = currentTime - lastScanTime < 100 || newValue.includes('\n');
    
    if (isScannerInput) {
      const cleanBarcode = newValue.replace(/[\n\r]/g, '');
      setBarcode(cleanBarcode);
      
      if (sapNumber && storeLocation && bolNumber) {
        const syntheticEvent = new Event('submit') as any;
        handleSubmit(syntheticEvent);
      } else {
        toast({
          title: "Missing Fields",
          description: "Please fill in all required fields before scanning",
        });
      }
    }
    
    setLastScanTime(currentTime);
  };

  const handleCameraScan = (result: string) => {
    setBarcode(result);
    setShowScanner(false);
    
    if (sapNumber && storeLocation && bolNumber) {
      const syntheticEvent = new Event('submit') as any;
      handleSubmit(syntheticEvent);
    } else {
      toast({
        title: "Missing Fields",
        description: "Please fill in all required fields before scanning",
      });
    }
  };

  useEffect(() => {
    if (!initialValues) {
      barcodeInputRef.current?.focus();
    }
  }, [initialValues]);

  return (
    <FormContainer onSubmit={handleSubmit}>
      <FormField
        id="storeLocation"
        label="Store Location"
        value={storeLocation}
        onChange={setStoreLocation}
        placeholder="Enter store location"
        required
      />

      <FormHeader bolNumber={bolNumber} setBolNumber={setBolNumber} />

      <h2 className="text-lg font-semibold text-white pt-2">
        {initialValues ? 'Edit Pallet' : 'Add New Pallet'}
      </h2>

      <BarcodeInputField
        barcode={barcode}
        onChange={handleBarcodeChange}
        onCameraClick={() => setShowScanner(true)}
        inputRef={barcodeInputRef}
      />

      <FormField
        id="sapNumber"
        label="SAP Item #"
        value={sapNumber}
        onChange={setSapNumber}
        placeholder="Enter SAP Item number"
        required
      />

      <QuantityInput
        quantity={quantity}
        onIncrement={() => setQuantity(prev => prev + 1)}
        onDecrement={() => setQuantity(prev => Math.max(1, prev - 1))}
        onChange={setQuantity}
      />

      <SubmitButton isEditing={!!initialValues} />

      {showScanner && (
        <BarcodeScanner
          onScan={handleCameraScan}
          onClose={() => setShowScanner(false)}
        />
      )}
    </FormContainer>
  );
};
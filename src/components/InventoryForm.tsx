
import React, { useRef, useEffect } from 'react';
import { FormContainer } from './inventory/FormContainer';
import { SubmitButton } from './inventory/SubmitButton';
import { ScannerModals } from './inventory/ScannerModals';
import { PhotoSection } from './inventory/PhotoSection';
import { FormFields } from './inventory/FormFields';
import { useFormState } from './inventory/form/useFormState';
import { useFormSubmit } from './inventory/form/useFormSubmit';
import { isFormValid } from './inventory/form/FormValidation';
import type { InventoryItem } from '@/types/inventory';

interface InventoryFormProps {
  onSubmit: (item: Omit<InventoryItem, 'id' | 'timestamp' | 'bolNumber'>) => void;
  initialValues?: InventoryItem;
  storeLocation: string;
}

export const InventoryForm = ({ onSubmit, initialValues, storeLocation }: InventoryFormProps) => {
  const barcodeInputRef = useRef<HTMLInputElement>(null);
  const formState = useFormState(initialValues, storeLocation);

  const handlePhotoDelete = () => {
    formState.setPhotoUrl(null);
  };

  const resetForm = () => {
    if (!initialValues) {
      formState.setSapNumber('');
      formState.setQuantity(1);
      formState.setBarcode('');
      formState.setPhotoUrl(null);
      formState.setStoreLocation(storeLocation);
      barcodeInputRef.current?.focus();
    }
  };

  const { handleSubmit } = useFormSubmit({
    sapNumber: formState.sapNumber,
    quantity: formState.quantity,
    barcode: formState.barcode,
    storeLocation: formState.storeLocation,
    photoUrl: formState.photoUrl,
    onSubmit,
    resetForm
  });

  const handleBarcodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    formState.setBarcode(e.target.value);
  };

  const handleScan = (fields: {
    sapNumber?: string;
    barcode?: string;
    storeLocation?: string;
    quantity?: number;
  }) => {
    if (fields.sapNumber) formState.setSapNumber(fields.sapNumber);
    if (fields.barcode) formState.setBarcode(fields.barcode);
    if (fields.storeLocation) formState.setStoreLocation(fields.storeLocation);
    if (fields.quantity) formState.setQuantity(fields.quantity);
    formState.setShowOCRScanner(false);
    formState.setShowAIScanner(false);
  };

  useEffect(() => {
    if (!initialValues) {
      barcodeInputRef.current?.focus();
    }
  }, [initialValues]);

  useEffect(() => {
    formState.setStoreLocation(storeLocation);
  }, [storeLocation]);

  const isFormValidState = isFormValid(formState.sapNumber, formState.barcode, formState.storeLocation);

  return (
    <FormContainer onSubmit={handleSubmit}>
      <FormFields
        barcode={formState.barcode}
        sapNumber={formState.sapNumber}
        quantity={formState.quantity}
        onBarcodeChange={handleBarcodeChange}
        onSAPNumberChange={formState.setSapNumber}
        onQuantityChange={formState.setQuantity}
        onQuantityIncrement={() => formState.setQuantity(prev => prev + 1)}
        onQuantityDecrement={() => formState.setQuantity(prev => Math.max(1, prev - 1))}
        barcodeInputRef={barcodeInputRef}
        onOCRClick={() => formState.setShowOCRScanner(true)}
      />

      <PhotoSection
        photoUrl={formState.photoUrl}
        onShowCamera={() => formState.setShowCamera(true)}
        onPhotoDelete={handlePhotoDelete}
      />

      <SubmitButton 
        isEditing={!!initialValues}
        isValid={isFormValidState}
      />

      <ScannerModals
        showScanner={false}
        showOCRScanner={formState.showOCRScanner}
        showAIScanner={formState.showAIScanner}
        showCamera={formState.showCamera}
        onScan={() => {}}
        onOCRScan={handleScan}
        onPhotoCapture={(photoUrl: string) => {
          formState.setPhotoUrl(photoUrl);
          formState.setShowCamera(false);
        }}
        onClose={() => {
          formState.setShowOCRScanner(false);
          formState.setShowAIScanner(false);
          formState.setShowCamera(false);
        }}
      />
    </FormContainer>
  );
};

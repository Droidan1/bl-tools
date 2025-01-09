import React, { useState, useRef, useEffect } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { FormContainer } from './inventory/FormContainer';
import { SubmitButton } from './inventory/SubmitButton';
import { ScannerModals } from './inventory/ScannerModals';
import { PhotoSection } from './inventory/PhotoSection';
import { FormFields } from './inventory/FormFields';
import type { InventoryItem } from '@/types/inventory';

interface InventoryFormProps {
  onSubmit: (item: Omit<InventoryItem, 'id' | 'timestamp' | 'bolNumber'>) => void;
  initialValues?: InventoryItem;
}

export const InventoryForm = ({ onSubmit, initialValues }: InventoryFormProps) => {
  const [sapNumber, setSapNumber] = useState(initialValues?.sapNumber || '');
  const [quantity, setQuantity] = useState(initialValues?.quantity || 1);
  const [barcode, setBarcode] = useState(initialValues?.barcode || '');
  const [storeLocation, setStoreLocation] = useState(initialValues?.storeLocation || '');
  const [showOCRScanner, setShowOCRScanner] = useState(false);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [showCamera, setShowCamera] = useState(false);
  const barcodeInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Simplified validation logic
  const isFormValid = sapNumber.trim() !== '' && 
                     barcode.trim() !== '' && 
                     storeLocation.trim() !== '';

  useEffect(() => {
    if (initialValues) {
      setSapNumber(initialValues.sapNumber);
      setQuantity(initialValues.quantity);
      setBarcode(initialValues.barcode || '');
      setStoreLocation(initialValues.storeLocation);
      setPhotoUrl(initialValues.photoUrl || null);
    }
  }, [initialValues]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted with values:', { sapNumber, barcode, storeLocation });

    if (!sapNumber.trim() || !barcode.trim() || !storeLocation.trim()) {
      toast({
        title: "Error",
        description: "Please fill in all required fields including Store Location",
        variant: "destructive",
      });
      return;
    }
    
    onSubmit({
      sapNumber: sapNumber.trim(),
      quantity,
      barcode: barcode.trim(),
      storeLocation: storeLocation.trim(),
      photoUrl: photoUrl || '',
    });

    if (!initialValues) {
      setSapNumber('');
      setQuantity(1);
      setBarcode('');
      setStoreLocation('');
      setPhotoUrl(null);
      barcodeInputRef.current?.focus();
    }
  };

  const handleBarcodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBarcode(e.target.value);
  };

  const handleOCRScan = (fields: {
    sapNumber?: string;
    barcode?: string;
    storeLocation?: string;
    quantity?: number;
  }) => {
    if (fields.sapNumber) setSapNumber(fields.sapNumber);
    if (fields.barcode) setBarcode(fields.barcode);
    if (fields.storeLocation) setStoreLocation(fields.storeLocation);
    if (fields.quantity) setQuantity(fields.quantity);
    setShowOCRScanner(false);
  };

  const handlePhotoCapture = (photoUrl: string) => {
    setPhotoUrl(photoUrl);
    setShowCamera(false);
    toast({
      title: "Success",
      description: "Photo captured successfully",
    });
  };

  useEffect(() => {
    if (!initialValues) {
      barcodeInputRef.current?.focus();
    }
  }, [initialValues]);

  return (
    <FormContainer onSubmit={handleSubmit}>
      <FormFields
        barcode={barcode}
        sapNumber={sapNumber}
        quantity={quantity}
        storeLocation={storeLocation}
        onBarcodeChange={handleBarcodeChange}
        onSAPNumberChange={setSapNumber}
        onStoreLocationChange={setStoreLocation}
        onQuantityChange={setQuantity}
        onQuantityIncrement={() => setQuantity(prev => prev + 1)}
        onQuantityDecrement={() => setQuantity(prev => Math.max(1, prev - 1))}
        barcodeInputRef={barcodeInputRef}
        onOCRClick={() => setShowOCRScanner(true)}
      />

      <PhotoSection
        photoUrl={photoUrl}
        onShowCamera={() => setShowCamera(true)}
      />

      <SubmitButton 
        isEditing={!!initialValues} 
        isValid={isFormValid}
      />

      <ScannerModals
        showScanner={false}
        showOCRScanner={showOCRScanner}
        showCamera={showCamera}
        onScan={() => {}}
        onOCRScan={handleOCRScan}
        onPhotoCapture={handlePhotoCapture}
        onClose={() => {
          setShowOCRScanner(false);
          setShowCamera(false);
        }}
      />
    </FormContainer>
  );
};

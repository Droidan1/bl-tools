import React, { useState, useRef, useEffect } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { FormField } from './inventory/FormField';
import { QuantityInput } from './inventory/QuantityInput';
import { FormHeader } from './inventory/FormHeader';
import { BarcodeInputField } from './inventory/BarcodeInputField';
import { FormContainer } from './inventory/FormContainer';
import { SubmitButton } from './inventory/SubmitButton';
import { ScannerModals } from './inventory/ScannerModals';
import { Button } from './ui/button';
import { Camera } from 'lucide-react';
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

  useEffect(() => {
    if (initialValues) {
      setSapNumber(initialValues.sapNumber);
      setQuantity(initialValues.quantity);
      setBarcode(initialValues.barcode || '');
      setStoreLocation(initialValues.storeLocation);
    }
  }, [initialValues]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!barcode || !storeLocation || !sapNumber || !photoUrl) {
      toast({
        title: "Error",
        description: "Please fill in all required fields and take a photo",
        variant: "destructive",
      });
      return;
    }
    
    onSubmit({
      sapNumber,
      quantity,
      barcode,
      storeLocation,
      photoUrl,
    });

    if (!initialValues) {
      setSapNumber('');
      setQuantity(1);
      setBarcode('');
      setPhotoUrl(null);
      barcodeInputRef.current?.focus();
    }
  };

  const handleBarcodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setBarcode(newValue);
  };

  const handleOCRScan = (fields: {
    sapNumber?: string;
    barcode?: string;
    storeLocation?: string;
  }) => {
    if (fields.sapNumber) setSapNumber(fields.sapNumber);
    if (fields.barcode) setBarcode(fields.barcode);
    if (fields.storeLocation) setStoreLocation(fields.storeLocation);
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
      <FormField
        id="storeLocation"
        label="Store Location"
        value={storeLocation}
        onChange={setStoreLocation}
        placeholder="Enter store location"
        required
      />

      <h2 className="text-lg font-semibold text-white pt-2">
        {initialValues ? 'Edit Tag' : 'Add New Tag'}
      </h2>

      <div className="space-y-2">
        <label className="text-sm font-medium text-white">
          Photo *
        </label>
        <div className="flex flex-col gap-2">
          {photoUrl ? (
            <div className="relative">
              <img 
                src={photoUrl} 
                alt="Captured" 
                className="w-full h-40 object-cover rounded-lg"
              />
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => setShowCamera(true)}
                className="absolute bottom-2 right-2"
              >
                <Camera className="h-4 w-4 mr-2" />
                Retake
              </Button>
            </div>
          ) : (
            <Button
              type="button"
              variant="secondary"
              onClick={() => setShowCamera(true)}
              className="w-full"
            >
              <Camera className="h-4 w-4 mr-2" />
              Take Photo
            </Button>
          )}
        </div>
      </div>

      <BarcodeInputField
        barcode={barcode}
        onChange={handleBarcodeChange}
        inputRef={barcodeInputRef}
        onOCRClick={() => setShowOCRScanner(true)}
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
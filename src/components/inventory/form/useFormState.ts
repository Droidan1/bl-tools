import { useState, useEffect } from 'react';
import type { InventoryItem } from '@/types/inventory';

export const useFormState = (initialValues?: InventoryItem) => {
  console.log('useFormState initialized with:', initialValues);
  
  const [sapNumber, setSapNumber] = useState(initialValues?.sapNumber || '');
  const [quantity, setQuantity] = useState(initialValues?.quantity || 1);
  const [barcode, setBarcode] = useState(initialValues?.barcode || '');
  const [storeLocation, setStoreLocation] = useState(initialValues?.storeLocation || '');
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [showOCRScanner, setShowOCRScanner] = useState(false);
  const [showCamera, setShowCamera] = useState(false);

  useEffect(() => {
    console.log('useFormState useEffect triggered with initialValues:', initialValues);
    if (initialValues) {
      setSapNumber(initialValues.sapNumber);
      setQuantity(initialValues.quantity);
      setBarcode(initialValues.barcode || '');
      setStoreLocation(initialValues.storeLocation);
      setPhotoUrl(initialValues.photoUrl || null);
    }
  }, [initialValues]);

  return {
    sapNumber,
    setSapNumber,
    quantity,
    setQuantity,
    barcode,
    setBarcode,
    storeLocation,
    setStoreLocation,
    photoUrl,
    setPhotoUrl,
    showOCRScanner,
    setShowOCRScanner,
    showCamera,
    setShowCamera
  };
};
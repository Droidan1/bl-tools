import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Camera, ScanText } from "lucide-react";
import { BarcodeScanner } from './BarcodeScanner';
import { OCRScanner } from './OCRScanner';
import { FormField } from './inventory/FormField';
import { QuantityInput } from './inventory/QuantityInput';
import { FormHeader } from './inventory/FormHeader';
import { formStyles } from './inventory/styles';
import type { InventoryItem } from '@/types/inventory';

interface InventoryFormProps {
  onSubmit: (item: Omit<InventoryItem, 'id' | 'timestamp'>) => void;
}

export const InventoryForm = ({ onSubmit }: InventoryFormProps) => {
  const [sapNumber, setSapNumber] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [barcode, setBarcode] = useState('');
  const [storeLocation, setStoreLocation] = useState('');
  const [bolNumber, setBolNumber] = useState('');
  const [lastScanTime, setLastScanTime] = useState(0);
  const [showScanner, setShowScanner] = useState(false);
  const [showOCRScanner, setShowOCRScanner] = useState(false);
  const barcodeInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

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

    setSapNumber('');
    setQuantity(1);
    setBarcode('');
    setBolNumber('');
    barcodeInputRef.current?.focus();
  };

  const handleBarcodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    const currentTime = new Date().getTime();
    
    // Update the barcode state
    setBarcode(newValue);
    
    // Check if this is a scanner input (very fast input or ends with return)
    const isScannerInput = currentTime - lastScanTime < 100 || newValue.includes('\n');
    
    if (isScannerInput) {
      // Clean up the barcode value (remove any return characters)
      const cleanBarcode = newValue.replace(/[\n\r]/g, '');
      setBarcode(cleanBarcode);
      
      // Auto submit if all required fields are filled
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

  const handleOCRScan = (fields: {
    sapNumber?: string;
    barcode?: string;
    storeLocation?: string;
    bolNumber?: string;
  }) => {
    if (fields.sapNumber) setSapNumber(fields.sapNumber);
    if (fields.barcode) setBarcode(fields.barcode);
    if (fields.storeLocation) setStoreLocation(fields.storeLocation);
    if (fields.bolNumber) setBolNumber(fields.bolNumber);
  };

  useEffect(() => {
    barcodeInputRef.current?.focus();
  }, []);

  return (
    <form onSubmit={handleSubmit} className={formStyles.container}>
      <FormHeader bolNumber={bolNumber} setBolNumber={setBolNumber} />

      <h2 className={formStyles.title}>Add New Pallet</h2>

      <div className={formStyles.inputContainer}>
        <label htmlFor="barcode" className="text-sm font-medium text-white">
          Scan Barcode *
        </label>
        <div className={formStyles.scannerContainer}>
          <input
            id="barcode"
            ref={barcodeInputRef}
            value={barcode}
            onChange={handleBarcodeChange}
            placeholder="Scan or enter barcode"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            required
          />
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => setShowScanner(true)}
            className="shrink-0"
          >
            <Camera className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => setShowOCRScanner(true)}
            className="shrink-0"
          >
            <ScanText className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <FormField
        id="storeLocation"
        label="Store Location"
        value={storeLocation}
        onChange={setStoreLocation}
        placeholder="Enter store location"
        required
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

      <div className={formStyles.buttonContainer}>
        <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
          Add Item
        </Button>
      </div>

      {showScanner && (
        <BarcodeScanner
          onScan={handleCameraScan}
          onClose={() => setShowScanner(false)}
        />
      )}

      {showOCRScanner && (
        <OCRScanner
          onScan={handleOCRScan}
          onClose={() => setShowOCRScanner(false)}
        />
      )}
    </form>
  );
};

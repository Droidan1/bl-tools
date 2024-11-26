import React, { useState, useRef, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Plus, Minus } from "lucide-react";
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
  const barcodeInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate all required fields
    if (!bolNumber) {
      toast({
        title: "Error",
        description: "BOL # is required",
        variant: "destructive",
      });
      return;
    }

    if (!barcode) {
      toast({
        title: "Error",
        description: "Barcode is required",
        variant: "destructive",
      });
      return;
    }

    if (!storeLocation) {
      toast({
        title: "Error",
        description: "Store Location is required",
        variant: "destructive",
      });
      return;
    }

    if (!sapNumber) {
      toast({
        title: "Error",
        description: "SAP Item # is required",
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

    // Reset form
    setSapNumber('');
    setQuantity(1);
    setBarcode('');
    setBolNumber('');
    barcodeInputRef.current?.focus();
  };

  const handleBarcodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setBarcode(newValue);
    
    // Check if this is a barcode scanner input
    const currentTime = new Date().getTime();
    const timeDiff = currentTime - lastScanTime;
    
    // If input comes in very quickly (less than 100ms between characters)
    // and ends with a return character, treat it as a scanner
    if (timeDiff < 100 && newValue.includes('\n')) {
      // Remove the return character
      const cleanBarcode = newValue.replace(/\n/g, '');
      setBarcode(cleanBarcode);
      // Auto submit if we have the required fields
      if (sapNumber && storeLocation && bolNumber) {
        handleSubmit(new Event('submit') as any);
      }
    }
    
    setLastScanTime(currentTime);
  };

  const incrementQuantity = () => setQuantity(prev => prev + 1);
  const decrementQuantity = () => setQuantity(prev => Math.max(1, prev - 1));

  useEffect(() => {
    // Focus barcode input on mount
    barcodeInputRef.current?.focus();
  }, []);

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-4 sm:p-6 rounded-lg shadow-sm">
      <div className="space-y-2">
        <label htmlFor="bolNumber" className="text-sm font-medium text-gray-700">
          BOL # *
        </label>
        <Input
          id="bolNumber"
          value={bolNumber}
          onChange={(e) => setBolNumber(e.target.value)}
          placeholder="Enter BOL number"
          className="w-full"
          required
        />
      </div>

      <h2 className="text-lg sm:text-xl font-semibold text-gray-800">Add New Pallet</h2>

      <div className="space-y-2">
        <label htmlFor="barcode" className="text-sm font-medium text-gray-700">
          Scan Barcode *
        </label>
        <Input
          id="barcode"
          ref={barcodeInputRef}
          value={barcode}
          onChange={handleBarcodeChange}
          placeholder="Scan or enter barcode"
          className="w-full"
          required
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="storeLocation" className="text-sm font-medium text-gray-700">
          Store Location *
        </label>
        <Input
          id="storeLocation"
          value={storeLocation}
          onChange={(e) => setStoreLocation(e.target.value)}
          placeholder="Enter store location number"
          className="w-full"
          required
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="sapNumber" className="text-sm font-medium text-gray-700">
          SAP Item # *
        </label>
        <Input
          id="sapNumber"
          value={sapNumber}
          onChange={(e) => setSapNumber(e.target.value)}
          placeholder="Enter SAP Item number"
          className="w-full"
          required
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="quantity" className="text-sm font-medium text-gray-700">
          Quantity *
        </label>
        <div className="flex items-center space-x-2">
          <Button 
            type="button"
            variant="outline"
            size="icon"
            onClick={decrementQuantity}
            className="h-10 w-10"
          >
            <Minus className="h-4 w-4" />
          </Button>
          <Input
            id="quantity"
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
            className="w-20 text-center"
            required
          />
          <Button 
            type="button"
            variant="outline"
            size="icon"
            onClick={incrementQuantity}
            className="h-10 w-10"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
        Add Item
      </Button>
    </form>
  );
};
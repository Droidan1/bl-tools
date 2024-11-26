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
  const barcodeInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sapNumber) {
      toast({
        title: "Error",
        description: "SAP Item # is required",
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
    
    onSubmit({
      sapNumber,
      quantity,
      barcode: barcode || undefined,
      storeLocation,
    });

    // Reset form
    setSapNumber('');
    setQuantity(1);
    setBarcode('');
    barcodeInputRef.current?.focus();
  };

  const incrementQuantity = () => setQuantity(prev => prev + 1);
  const decrementQuantity = () => setQuantity(prev => Math.max(1, prev - 1));

  useEffect(() => {
    // Focus barcode input on mount
    barcodeInputRef.current?.focus();
  }, []);

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow-sm">
      <div className="space-y-2">
        <label htmlFor="barcode" className="text-sm font-medium text-gray-700">
          Scan Barcode
        </label>
        <Input
          id="barcode"
          ref={barcodeInputRef}
          value={barcode}
          onChange={(e) => setBarcode(e.target.value)}
          placeholder="Scan or enter barcode"
          className="w-full"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="storeLocation" className="text-sm font-medium text-gray-700">
          Store Location
        </label>
        <Input
          id="storeLocation"
          value={storeLocation}
          onChange={(e) => setStoreLocation(e.target.value)}
          placeholder="Enter store location number"
          className="w-full"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="sapNumber" className="text-sm font-medium text-gray-700">
          SAP Item #
        </label>
        <Input
          id="sapNumber"
          value={sapNumber}
          onChange={(e) => setSapNumber(e.target.value)}
          placeholder="Enter SAP Item number"
          className="w-full"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="quantity" className="text-sm font-medium text-gray-700">
          Quantity
        </label>
        <div className="flex items-center space-x-2">
          <Button 
            type="button"
            variant="outline"
            size="icon"
            onClick={decrementQuantity}
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
          />
          <Button 
            type="button"
            variant="outline"
            size="icon"
            onClick={incrementQuantity}
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
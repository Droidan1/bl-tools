
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { QrCode } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface MOSAddItemFormProps {
  currentCode: string;
  quantity: number;
  reason: string;
  storeLocation: string;
  setCurrentCode: (code: string) => void;
  setQuantity: (quantity: number) => void;
  setReason: (reason: string) => void;
  setStoreLocation: (location: string) => void;
  incrementQuantity: () => void;
  decrementQuantity: () => void;
  onSubmit: (e: React.FormEvent) => void;
  onScanClick: () => void;
}

export const MOSAddItemForm = ({
  currentCode,
  quantity,
  reason,
  storeLocation,
  setCurrentCode,
  setQuantity,
  setReason,
  setStoreLocation,
  incrementQuantity,
  decrementQuantity,
  onSubmit,
  onScanClick
}: MOSAddItemFormProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Add MOS Item</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="flex justify-center mb-4">
            <Button 
              type="button"
              onClick={onScanClick}
              className="w-full flex items-center gap-2"
            >
              <QrCode className="h-4 w-4" />
              Scan QR Code
            </Button>
          </div>

          <div className="space-y-2">
            <label htmlFor="storeLocation" className="text-sm font-medium">
              Store Location
            </label>
            <Select value={storeLocation} onValueChange={setStoreLocation}>
              <SelectTrigger id="storeLocation" className="w-full">
                <SelectValue placeholder="Select store location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="BL1">BL1</SelectItem>
                <SelectItem value="BL2">BL2</SelectItem>
                <SelectItem value="BL4">BL4</SelectItem>
                <SelectItem value="BL8">BL8</SelectItem>
                <SelectItem value="BL10">BL10</SelectItem>
                <SelectItem value="BL12">BL12</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label htmlFor="code" className="text-sm font-medium">
              SAP item #
            </label>
            <Input
              id="code"
              value={currentCode}
              onChange={(e) => setCurrentCode(e.target.value.substring(0, 5))}
              placeholder="Enter code or scan QR"
              className="w-full"
              maxLength={5}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="quantity" className="text-sm font-medium">
              Quantity
            </label>
            <div className="flex items-center">
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={decrementQuantity}
                className="h-10 w-10"
              >
                -
              </Button>
              <Input
                id="quantity"
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                className="mx-2 text-center"
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={incrementQuantity}
                className="h-10 w-10"
              >
                +
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="reason" className="text-sm font-medium">
              Removal Reason
            </label>
            <Select value={reason} onValueChange={setReason}>
              <SelectTrigger id="reason">
                <SelectValue placeholder="Select reason" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="to bins">To Bins</SelectItem>
                <SelectItem value="trash">Trash</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button type="submit" className="w-full" disabled={!currentCode}>
            Add Item
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

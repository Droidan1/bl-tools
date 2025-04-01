
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface MOSHeaderProps {
  storeLocation: string;
  onStoreLocationChange: (value: string) => void;
}

export const MOSHeader = ({ storeLocation, onStoreLocationChange }: MOSHeaderProps) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-center mb-8 bg-[#2a8636] p-4 sm:p-6 rounded-xl shadow-sm w-full">
      <h1 className="text-2xl sm:text-4xl font-bold text-white mb-4 sm:mb-0 font-['Luckiest_Guy']">
        MOS Scanner
      </h1>
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <Select value={storeLocation} onValueChange={onStoreLocationChange}>
          <SelectTrigger className="w-[100px] bg-white">
            <SelectValue placeholder="Store" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="BL1">BL1</SelectItem>
            <SelectItem value="BL4">BL4</SelectItem>
          </SelectContent>
        </Select>
        <img 
          src="/lovable-uploads/c590340d-6c9e-4341-8686-91ba96211494.png" 
          alt="Header Logo" 
          className="h-24 sm:h-32 md:h-48 w-auto" 
        />
      </div>
    </div>
  );
};

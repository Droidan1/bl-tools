
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MOSAddItemForm } from "./MOSAddItemForm";
import { MOSInventoryTable } from "./MOSInventoryTable";
import { MOSItem } from "@/types/mos";

interface MOSTabsProps {
  activeTab: string;
  setActiveTab: (value: string) => void;
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
  mosItems: MOSItem[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onExport: () => void;
  onClearAll: () => void;
  isLoading: boolean;
}

export const MOSTabs: React.FC<MOSTabsProps> = ({
  activeTab,
  setActiveTab,
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
  onScanClick,
  mosItems,
  searchQuery,
  setSearchQuery,
  onExport,
  onClearAll,
  isLoading
}) => {
  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mb-8">
      <TabsList className="grid w-full grid-cols-2 bg-[#2a8636]/20">
        <TabsTrigger value="scan" className="data-[state=active]:bg-[#2a8636] data-[state=active]:text-white">
          Scan & Add
        </TabsTrigger>
        <TabsTrigger value="inventory" className="data-[state=active]:bg-[#2a8636] data-[state=active]:text-white">
          Inventory
        </TabsTrigger>
      </TabsList>

      <TabsContent value="scan" className="mt-4">
        <MOSAddItemForm 
          currentCode={currentCode}
          quantity={quantity}
          reason={reason}
          storeLocation={storeLocation}
          setCurrentCode={setCurrentCode}
          setQuantity={setQuantity}
          setReason={setReason}
          setStoreLocation={setStoreLocation}
          incrementQuantity={incrementQuantity}
          decrementQuantity={decrementQuantity}
          onSubmit={onSubmit}
          onScanClick={onScanClick}
        />
      </TabsContent>

      <TabsContent value="inventory" className="mt-4">
        <MOSInventoryTable 
          items={mosItems}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onExport={onExport}
          onClearAll={onClearAll}
          isLoading={isLoading}
        />
      </TabsContent>
    </Tabs>
  );
};

import { useState } from 'react';
import { InventoryForm } from '@/components/InventoryForm';
import { InventoryTable } from '@/components/InventoryTable';
import type { InventoryItem } from '@/types/inventory';
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";

const Index = () => {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const { toast } = useToast();

  const handleAddItem = (newItem: Omit<InventoryItem, 'id' | 'timestamp'>) => {
    const item: InventoryItem = {
      ...newItem,
      id: crypto.randomUUID(),
      timestamp: new Date(),
    };

    setItems(prev => [item, ...prev]);
    toast({
      title: "Item Added",
      description: `Added ${newItem.quantity} units of ${newItem.sapNumber}`,
    });
  };

  const handleSendReport = () => {
    const csvContent = items.map(item => 
      `${item.storeLocation},${item.sapNumber},${item.quantity},${item.barcode || 'N/A'},${item.timestamp.toLocaleString()}`
    ).join('\n');

    const header = 'Store Location,SAP Item #,Quantity,Barcode,Timestamp\n';
    const fullContent = header + csvContent;
    
    const mailtoLink = `mailto:kbowers@retjg.com?subject=Inventory Report ${new Date().toLocaleDateString()}&body=${encodeURIComponent(fullContent)}`;
    
    window.location.href = mailtoLink;
    
    toast({
      title: "Email Client Opened",
      description: "The report has been prepared for sending",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container px-4 sm:px-6 py-4 sm:py-8 mx-auto max-w-7xl">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8">
          Inventory Receiver
        </h1>
        
        <div className="grid gap-6 sm:gap-8">
          <div className="w-full">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-4">
              Add New Item
            </h2>
            <InventoryForm onSubmit={handleAddItem} />
          </div>
          
          <div className="w-full">
            <div className="flex justify-between items-center mb-3 sm:mb-4">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
                Recent Entries
              </h2>
              <Button 
                onClick={handleSendReport}
                variant="outline"
                className="flex items-center gap-2"
                disabled={items.length === 0}
              >
                <Mail className="h-4 w-4" />
                Send Report
              </Button>
            </div>
            <div className="overflow-x-auto">
              <InventoryTable items={items} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
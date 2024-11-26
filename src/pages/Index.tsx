import { useState } from 'react';
import { InventoryForm } from '@/components/InventoryForm';
import { InventoryTable } from '@/components/InventoryTable';
import type { InventoryItem } from '@/types/inventory';
import { useToast } from "@/components/ui/use-toast";

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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Inventory Management
        </h1>
        
        <div className="grid gap-8 lg:grid-cols-2">
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Add New Item
            </h2>
            <InventoryForm onSubmit={handleAddItem} />
          </div>
          
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Recent Entries
            </h2>
            <InventoryTable items={items} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
import { useState } from 'react';
import { toast } from "sonner";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { InventoryForm } from '@/components/InventoryForm';
import { FilteredItemsList } from './FilteredItemsList';
import { FormSubmissionHandler } from './FormSubmissionHandler';
import { ReportGenerator } from './ReportGenerator';
import type { InventoryItem } from '@/types/inventory';

interface InventoryManagerProps {
  bolNumber: string;
  showRecentEntries: boolean;
  searchQuery: string;
  items: InventoryItem[];
  setItems: (items: InventoryItem[]) => void;
  setActiveTab?: (tab: string) => void;
  bolPhotoUrl?: string | null;
}

export const InventoryManager = ({ 
  bolNumber, 
  showRecentEntries, 
  searchQuery,
  items,
  setItems,
  setActiveTab,
  bolPhotoUrl
}: InventoryManagerProps) => {
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const queryClient = useQueryClient();

  // Use React Query to manage inventory items state
  const { data: inventoryItems = [] } = useQuery({
    queryKey: ['inventory'],
    queryFn: () => items,
    initialData: items,
  });

  const { handleAddItem } = FormSubmissionHandler({ 
    editingItem, 
    items: inventoryItems, 
    setItems: (newItems) => {
      setItems(newItems);
      // Update React Query cache
      queryClient.setQueryData(['inventory'], newItems);
    }, 
    setEditingItem, 
    bolNumber 
  });

  const handleEdit = (item: InventoryItem) => {
    console.log('handleEdit called with item:', item);
    setEditingItem(item);
    console.log('editingItem state after update:', item);
    // Switch to add-pallets tab when editing
    if (setActiveTab) {
      setActiveTab('add-pallets');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleClearEntries = () => {
    setItems([]);
    // Clear React Query cache
    queryClient.setQueryData(['inventory'], []);
    toast.success("All entries have been cleared");
  };

  console.log('Current editingItem state:', editingItem);

  return (
    <div className="grid gap-6">
      {(!showRecentEntries || editingItem) && (
        <div className="w-full flex justify-center px-4 sm:px-0">
          <div className="w-full max-w-md mx-auto">
            <InventoryForm 
              onSubmit={handleAddItem} 
              initialValues={editingItem || undefined}
            />
          </div>
        </div>
      )}
      
      {showRecentEntries && (
        <div className="w-full px-4 sm:px-0">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mb-6">
            <div className="w-full sm:w-auto">
              <h2 className="text-xl font-semibold text-gray-900 text-center sm:text-left">
                Recent Entries {searchQuery && `(${inventoryItems.length} results)`}
              </h2>
            </div>
            <div className="w-full sm:w-auto flex justify-center sm:justify-end">
              <ReportGenerator 
                items={inventoryItems} 
                disabled={inventoryItems.length === 0} 
                onClear={handleClearEntries}
              />
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-elevated overflow-hidden border border-gray-200">
            <div className="overflow-x-auto">
              <div className="min-w-full inline-block align-middle">
                <FilteredItemsList 
                  items={inventoryItems}
                  searchQuery={searchQuery}
                  onEdit={handleEdit}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
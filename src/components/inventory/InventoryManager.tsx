import { useState } from 'react';
import { toast } from "sonner";
import { InventoryForm } from '@/components/InventoryForm';
import { FilteredItemsList } from './FilteredItemsList';
import { FormSubmissionHandler } from './FormSubmissionHandler';
import { ReportGenerator } from './ReportGenerator';
import { useInventoryStore } from '@/hooks/useInventoryStore';
import type { InventoryItem } from '@/types/inventory';

interface InventoryManagerProps {
  bolNumber: string;
  showRecentEntries: boolean;
  searchQuery: string;
  setActiveTab?: (tab: string) => void;
  bolPhotoUrl?: string | null;
  storeLocation: string;
}

export const InventoryManager = ({ 
  bolNumber, 
  showRecentEntries, 
  searchQuery,
  setActiveTab,
  bolPhotoUrl,
  storeLocation
}: InventoryManagerProps) => {
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const { items, setItems } = useInventoryStore();

  const { handleAddItem } = FormSubmissionHandler({ 
    editingItem, 
    items, 
    setItems, 
    setEditingItem, 
    bolNumber,
    storeLocation 
  });

  const handleEdit = (item: InventoryItem) => {
    console.log('handleEdit called with item:', item);
    setEditingItem(item);
    console.log('editingItem state after update:', item);
    if (setActiveTab) {
      setActiveTab('add-pallets');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleClearEntries = () => {
    setItems([]);
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
              storeLocation={storeLocation}
            />
          </div>
        </div>
      )}
      
      {showRecentEntries && (
        <div className="w-full px-4 sm:px-0">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mb-6">
            <div className="w-full sm:w-auto">
              <h2 className="text-xl font-semibold text-gray-900 text-center sm:text-left">
                Recent Entries {searchQuery && `(${items.length} results)`}
              </h2>
            </div>
            <div className="w-full sm:w-auto flex justify-center sm:justify-end">
              <ReportGenerator 
                items={items} 
                disabled={items.length === 0} 
                onClear={handleClearEntries}
                bolPhotoUrl={bolPhotoUrl}
              />
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-elevated overflow-hidden border border-gray-200">
            <div className="overflow-x-auto">
              <div className="min-w-full inline-block align-middle">
                <FilteredItemsList 
                  items={items}
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
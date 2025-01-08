import { useState } from 'react';
import { toast } from "sonner";
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
}

export const InventoryManager = ({ 
  bolNumber, 
  showRecentEntries, 
  searchQuery,
  items,
  setItems
}: InventoryManagerProps) => {
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);

  const { handleAddItem } = FormSubmissionHandler({ 
    editingItem, 
    items, 
    setItems, 
    setEditingItem, 
    bolNumber 
  });

  const handleEdit = (item: InventoryItem) => {
    setEditingItem(item);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleClearEntries = () => {
    setItems([]);
    toast.success("All entries have been cleared");
  };

  return (
    <div className="grid gap-6">
      {!showRecentEntries && (
        <div className="w-full flex justify-center">
          <div className="w-full max-w-md">
            <InventoryForm 
              onSubmit={handleAddItem} 
              initialValues={editingItem || undefined}
            />
          </div>
        </div>
      )}
      
      {showRecentEntries && (
        <div className="w-full">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mb-4">
            <h2 className="text-lg font-semibold text-gray-900 order-1 sm:order-none">
              Recent Entries {searchQuery && `(${items.length} results)`}
            </h2>
            <ReportGenerator 
              items={items} 
              disabled={items.length === 0} 
              onClear={handleClearEntries}
            />
          </div>
          <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
            <div className="overflow-x-auto -mx-4 sm:mx-0">
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
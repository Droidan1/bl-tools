import { useMemo } from 'react';
import { InventoryTable } from '@/components/InventoryTable';
import type { InventoryItem } from '@/types/inventory';

interface FilteredItemsListProps {
  items: InventoryItem[];
  searchQuery: string;
  onEdit: (item: InventoryItem) => void;
}

export const FilteredItemsList = ({ items, searchQuery, onEdit }: FilteredItemsListProps) => {
  const filteredItems = useMemo(() => {
    if (!searchQuery) return items;
    
    const query = searchQuery.toLowerCase();
    return items.filter(item => 
      item.sapNumber.toLowerCase().includes(query) ||
      item.storeLocation.toLowerCase().includes(query) ||
      item.bolNumber?.toLowerCase().includes(query) ||
      item.barcode?.toLowerCase().includes(query)
    );
  }, [items, searchQuery]);

  return (
    <InventoryTable 
      items={filteredItems} 
      onEdit={onEdit}
      highlightText={searchQuery}
    />
  );
};
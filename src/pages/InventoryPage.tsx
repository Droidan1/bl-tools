import { InventoryManager } from '@/components/inventory/InventoryManager';
import type { InventoryItem } from '@/types/inventory';

interface InventoryPageProps {
  bolNumber: string;
  showRecentEntries: boolean;
  searchQuery: string;
  items: InventoryItem[];
  setItems: (items: InventoryItem[]) => void;
}

const InventoryPage = ({ 
  bolNumber, 
  showRecentEntries, 
  searchQuery,
  items,
  setItems
}: InventoryPageProps) => {
  return (
    <div className="w-full">
      <InventoryManager 
        bolNumber={bolNumber} 
        showRecentEntries={showRecentEntries} 
        searchQuery={searchQuery}
        items={items}
        setItems={setItems}
      />
    </div>
  );
};

export default InventoryPage;
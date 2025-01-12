import { InventoryManager } from '@/components/inventory/InventoryManager';
import type { InventoryItem } from '@/types/inventory';

interface InventoryPageProps {
  bolNumber: string;
  showRecentEntries: boolean;
  searchQuery: string;
  items: InventoryItem[];
  setItems: (items: InventoryItem[]) => void;
  setActiveTab?: (tab: string) => void;
  bolPhotoUrl?: string | null;
}

const InventoryPage = ({ 
  bolNumber, 
  showRecentEntries, 
  searchQuery,
  items,
  setItems,
  setActiveTab,
  bolPhotoUrl
}: InventoryPageProps) => {
  return (
    <InventoryManager 
      bolNumber={bolNumber}
      showRecentEntries={showRecentEntries}
      searchQuery={searchQuery}
      items={items}
      setItems={setItems}
      setActiveTab={setActiveTab}
      bolPhotoUrl={bolPhotoUrl}
    />
  );
};

export default InventoryPage;
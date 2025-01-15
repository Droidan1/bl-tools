import { InventoryManager } from '@/components/inventory/InventoryManager';

interface InventoryPageProps {
  bolNumber: string;
  showRecentEntries: boolean;
  searchQuery: string;
  setActiveTab?: (tab: string) => void;
  bolPhotoUrl?: string | null;
}

const InventoryPage = ({ 
  bolNumber, 
  showRecentEntries, 
  searchQuery,
  setActiveTab,
  bolPhotoUrl
}: InventoryPageProps) => {
  return (
    <InventoryManager 
      bolNumber={bolNumber}
      showRecentEntries={showRecentEntries}
      searchQuery={searchQuery}
      setActiveTab={setActiveTab}
      bolPhotoUrl={bolPhotoUrl}
    />
  );
};

export default InventoryPage;
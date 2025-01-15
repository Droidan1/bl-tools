import { InventoryManager } from '@/components/inventory/InventoryManager';

interface InventoryPageProps {
  bolNumber: string;
  showRecentEntries: boolean;
  searchQuery: string;
  setActiveTab?: (tab: string) => void;
  bolPhotoUrl?: string | null;
  storeLocation: string;
}

const InventoryPage = ({ 
  bolNumber, 
  showRecentEntries, 
  searchQuery,
  setActiveTab,
  bolPhotoUrl,
  storeLocation
}: InventoryPageProps) => {
  return (
    <InventoryManager 
      bolNumber={bolNumber}
      showRecentEntries={showRecentEntries}
      searchQuery={searchQuery}
      setActiveTab={setActiveTab}
      bolPhotoUrl={bolPhotoUrl}
      storeLocation={storeLocation}
    />
  );
};

export default InventoryPage;
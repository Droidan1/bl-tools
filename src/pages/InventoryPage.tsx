import { InventoryManager } from '@/components/inventory/InventoryManager';

interface InventoryPageProps {
  bolNumber: string;
  showRecentEntries: boolean;
  searchQuery: string;
}

const InventoryPage = ({ bolNumber, showRecentEntries, searchQuery }: InventoryPageProps) => {
  return (
    <div className="w-full">
      <InventoryManager 
        bolNumber={bolNumber} 
        showRecentEntries={showRecentEntries} 
        searchQuery={searchQuery}
      />
    </div>
  );
};

export default InventoryPage;
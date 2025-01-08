import { InventoryManager } from '@/components/inventory/InventoryManager';

interface InventoryPageProps {
  bolNumber: string;
  showRecentEntries: boolean;
}

const InventoryPage = ({ bolNumber, showRecentEntries }: InventoryPageProps) => {
  return (
    <div className="w-full">
      <InventoryManager bolNumber={bolNumber} showRecentEntries={showRecentEntries} />
    </div>
  );
};

export default InventoryPage;
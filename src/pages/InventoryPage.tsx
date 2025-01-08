import { InventoryManager } from '@/components/inventory/InventoryManager';

const InventoryPage = ({ bolNumber }: { bolNumber: string }) => {
  return (
    <div className="w-full">
      <InventoryManager bolNumber={bolNumber} />
    </div>
  );
};

export default InventoryPage;
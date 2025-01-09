import { toast } from "sonner";
import type { InventoryItem } from '@/types/inventory';

interface UseFormSubmitProps {
  sapNumber: string;
  quantity: number;
  barcode: string;
  storeLocation: string;
  photoUrl: string | null;
  onSubmit: (item: Omit<InventoryItem, 'id' | 'timestamp' | 'bolNumber'>) => void;
  resetForm?: () => void;
}

export const useFormSubmit = ({
  sapNumber,
  quantity,
  barcode,
  storeLocation,
  photoUrl,
  onSubmit,
  resetForm
}: UseFormSubmitProps) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!sapNumber?.trim() || !barcode?.trim() || !storeLocation?.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      onSubmit({
        sapNumber: sapNumber.trim(),
        quantity,
        barcode: barcode.trim(),
        storeLocation: storeLocation.trim(),
        photoUrl: photoUrl || '',
      });

      toast.success(`Added ${quantity} units of ${sapNumber}`);

      if (resetForm) {
        resetForm();
      }
    } catch (error) {
      toast.error("Failed to add item. Please try again.");
    }
  };

  return { handleSubmit };
};
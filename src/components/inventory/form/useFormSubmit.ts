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
    console.log('Form submitted with values:', { sapNumber, barcode, storeLocation });

    if (!sapNumber?.trim() || !barcode?.trim() || !storeLocation?.trim()) {
      console.log('Validation failed');
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      console.log('Submitting form...');
      onSubmit({
        sapNumber: sapNumber.trim(),
        quantity,
        barcode: barcode.trim(),
        storeLocation: storeLocation.trim(),
        photoUrl: photoUrl || '',
      });

      console.log('Form submitted successfully');
      toast.success(`Added ${quantity} units of ${sapNumber}`);

      if (resetForm) {
        resetForm();
      }
    } catch (error) {
      console.error('Form submission error:', error);
      toast.error("Failed to add item. Please try again.");
    }
  };

  return { handleSubmit };
};
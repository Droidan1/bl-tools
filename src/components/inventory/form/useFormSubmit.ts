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
    console.log('Form submission attempt:', { sapNumber, barcode, storeLocation });

    if (!sapNumber?.trim() || !barcode?.trim()) {
      console.log('Form validation failed');
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      console.log('Submitting form data...');
      const formData = {
        sapNumber: sapNumber.trim(),
        quantity,
        barcode: barcode.trim(),
        storeLocation: storeLocation.trim(),
        photoUrl: photoUrl || '',
      };
      
      onSubmit(formData);
      console.log('Form submitted successfully:', formData);
      
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
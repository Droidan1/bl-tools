import { useToast } from "@/components/ui/use-toast";
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
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!sapNumber.trim() || !barcode.trim() || !storeLocation.trim()) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    
    onSubmit({
      sapNumber: sapNumber.trim(),
      quantity,
      barcode: barcode.trim(),
      storeLocation: storeLocation.trim(),
      photoUrl: photoUrl || '',
    });

    if (resetForm) {
      resetForm();
    }
  };

  return { handleSubmit };
};
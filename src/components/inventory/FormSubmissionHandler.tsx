import { nanoid } from 'nanoid';
import { toast } from "sonner";
import { supabase } from '@/lib/supabase';
import type { InventoryItem } from '@/types/inventory';

interface FormSubmissionHandlerProps {
  editingItem: InventoryItem | null;
  items: InventoryItem[];
  setItems: (items: InventoryItem[]) => void;
  setEditingItem: (item: InventoryItem | null) => void;
  bolNumber: string;
}

export const FormSubmissionHandler = ({ 
  editingItem, 
  items, 
  setItems, 
  setEditingItem, 
  bolNumber 
}: FormSubmissionHandlerProps) => {
  const isDuplicate = (newItem: Omit<InventoryItem, 'id' | 'timestamp' | 'bolNumber'>) => {
    return items.some(item => 
      item.sapNumber === newItem.sapNumber && 
      item.barcode === newItem.barcode
    );
  };

  const handleAddItem = async (newItem: Omit<InventoryItem, 'id' | 'timestamp' | 'bolNumber'>) => {
    if (!bolNumber) {
      toast.error("Please enter a BOL number first");
      return;
    }

    if (!editingItem && isDuplicate(newItem)) {
      toast.warning("Warning: This item appears to be a duplicate based on SAP number and barcode");
      return;
    }

    let shortenedPhotoUrl = '';
    if (newItem.photoUrl) {
      const shortId = nanoid(8);
      // Get base URL without any trailing slashes or colons
      const baseUrl = window.location.origin.replace(/[:/]+$/, '');
      shortenedPhotoUrl = `${baseUrl}/photos/${shortId}`;
      
      const { error } = await supabase
        .from('photo_mappings')
        .insert({
          short_id: shortId,
          original_url: newItem.photoUrl
        });

      if (error) {
        console.error('Error storing photo mapping:', error);
        toast.error("Failed to create shortened URL");
        return;
      }
    }

    if (editingItem) {
      const updatedItems = items.map(item => 
        item.id === editingItem.id 
          ? { 
              ...item, 
              ...newItem,
              photoUrl: shortenedPhotoUrl || newItem.photoUrl || null,
              bolNumber 
            }
          : item
      );
      setItems(updatedItems);
      setEditingItem(null);
      toast.success(`Updated ${newItem.quantity} units of ${newItem.sapNumber}`);
    } else {
      const item: InventoryItem = {
        ...newItem,
        photoUrl: shortenedPhotoUrl || newItem.photoUrl || null,
        bolNumber,
        id: crypto.randomUUID(),
        timestamp: new Date(),
      };
      setItems([item, ...items]);
      toast.success(`Added ${newItem.quantity} units of ${newItem.sapNumber}`);
    }
  };

  return { handleAddItem };
};
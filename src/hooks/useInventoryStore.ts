import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { InventoryItem } from '@/types/inventory';

export const useInventoryStore = () => {
  const queryClient = useQueryClient();

  const { data: items = [] } = useQuery({
    queryKey: ['inventory'],
    queryFn: () => {
      const cachedData = queryClient.getQueryData<InventoryItem[]>(['inventory']) || [];
      return cachedData;
    },
    initialData: [],
  });

  const setItems = (newItems: InventoryItem[]) => {
    queryClient.setQueryData(['inventory'], newItems);
  };

  return { items, setItems };
};
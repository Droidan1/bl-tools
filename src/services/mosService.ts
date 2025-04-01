
import { supabase } from '@/lib/supabase';
import type { MOSItem } from '@/types/mos';

export const saveMOSItem = async (item: MOSItem) => {
  const { data, error } = await supabase
    .from('mos_items')
    .insert({
      id: item.id,
      code: item.code,
      quantity: item.quantity,
      reason: item.reason,
      timestamp: item.timestamp,
      store_location: item.storeLocation
    });
  
  if (error) throw error;
  return data;
};

export const getMOSItems = async () => {
  const { data, error } = await supabase
    .from('mos_items')
    .select('*')
    .order('timestamp', { ascending: false });
  
  if (error) throw error;
  
  return data.map(item => ({
    id: item.id,
    code: item.code,
    quantity: item.quantity,
    reason: item.reason,
    timestamp: new Date(item.timestamp),
    storeLocation: item.store_location
  })) as MOSItem[];
};

export const clearMOSItems = async () => {
  const { error } = await supabase
    .from('mos_items')
    .delete()
    .neq('id', 'placeholder'); // Delete all records
  
  if (error) throw error;
  
  return true;
};

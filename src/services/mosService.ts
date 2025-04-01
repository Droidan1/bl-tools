
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

// New function to fetch the Google Sheet config
export const getGoogleSheetConfig = async () => {
  const { data, error } = await supabase
    .from('mos_config')
    .select('sheet_url, last_synced')
    .eq('id', 'google_sheet_config')
    .single();
  
  if (error && error.code !== 'PGRST116') throw error; // PGRST116 is "no rows returned"
  
  return data || { sheet_url: null, last_synced: null };
};

// New function to save the Google Sheet config
export const saveGoogleSheetConfig = async (sheetUrl: string) => {
  const { data, error } = await supabase
    .from('mos_config')
    .upsert({ 
      id: 'google_sheet_config', 
      sheet_url: sheetUrl 
    });
  
  if (error) throw error;
  
  return data;
};

// New function to update the last synced timestamp
export const updateLastSynced = async () => {
  const now = new Date().toISOString();
  const { data, error } = await supabase
    .from('mos_config')
    .upsert({ 
      id: 'google_sheet_config', 
      last_synced: now 
    });
  
  if (error) throw error;
  
  return now;
};

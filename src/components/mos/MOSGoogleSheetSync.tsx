
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RefreshCw, CheckCircle, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/lib/supabase';

interface SyncStatus {
  lastSynced: string | null;
  status: 'idle' | 'syncing' | 'success' | 'error';
  message: string;
}

export const MOSGoogleSheetSync = () => {
  const [sheetUrl, setSheetUrl] = useState('');
  const [syncStatus, setSyncStatus] = useState<SyncStatus>({
    lastSynced: null,
    status: 'idle',
    message: 'Not synced yet'
  });
  const { toast } = useToast();

  // Load saved Sheet URL from Supabase
  useEffect(() => {
    const loadConfig = async () => {
      const { data, error } = await supabase
        .from('mos_config')
        .select('sheet_url, last_synced')
        .single();
      
      if (data && !error) {
        setSheetUrl(data.sheet_url || '');
        if (data.last_synced) {
          setSyncStatus({
            lastSynced: new Date(data.last_synced).toLocaleString(),
            status: 'success',
            message: 'Last sync was successful'
          });
        }
      }
    };
    
    loadConfig();
  }, []);

  const saveSheetUrl = async () => {
    if (!sheetUrl || !sheetUrl.includes('google.com/spreadsheets')) {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid Google Sheets URL",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('mos_config')
        .upsert({ 
          id: 'google_sheet_config', 
          sheet_url: sheetUrl 
        });
      
      if (error) throw error;
      
      toast({
        title: "Configuration Saved",
        description: "Google Sheet URL has been saved",
      });
    } catch (error) {
      console.error("Error saving configuration:", error);
      toast({
        title: "Error",
        description: "Failed to save configuration",
        variant: "destructive",
      });
    }
  };

  const syncToGoogleSheet = async () => {
    if (!sheetUrl) {
      toast({
        title: "No Google Sheet URL",
        description: "Please save a Google Sheet URL first",
        variant: "destructive",
      });
      return;
    }

    setSyncStatus({
      ...syncStatus,
      status: 'syncing',
      message: 'Syncing data to Google Sheet...'
    });

    try {
      // Call the Supabase Edge Function to sync data
      const { data, error } = await supabase.functions.invoke('sync-mos-to-sheets', {
        body: { sheetUrl }
      });
      
      if (error) throw error;
      
      const lastSynced = new Date().toLocaleString();
      
      // Update last_synced in the config
      await supabase
        .from('mos_config')
        .upsert({ 
          id: 'google_sheet_config', 
          sheet_url: sheetUrl,
          last_synced: new Date().toISOString()
        });
      
      setSyncStatus({
        lastSynced,
        status: 'success',
        message: data.message || 'Data synced successfully'
      });
      
      toast({
        title: "Sync Complete",
        description: `Data synced to Google Sheets at ${lastSynced}`,
      });
    } catch (error) {
      console.error("Error syncing to Google Sheets:", error);
      setSyncStatus({
        ...syncStatus,
        status: 'error',
        message: 'Failed to sync data'
      });
      
      toast({
        title: "Sync Failed",
        description: "Could not sync data to Google Sheets",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Google Sheets Sync</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="sheetUrl" className="text-sm font-medium">
              Google Sheet URL
            </label>
            <div className="flex gap-2">
              <Input
                id="sheetUrl"
                value={sheetUrl}
                onChange={(e) => setSheetUrl(e.target.value)}
                placeholder="https://docs.google.com/spreadsheets/d/..."
                className="flex-1"
              />
              <Button onClick={saveSheetUrl}>Save</Button>
            </div>
            <p className="text-xs text-muted-foreground">
              The spreadsheet must be editable by anyone with the link
            </p>
          </div>

          <div className="flex flex-col gap-4 pt-2">
            <Button 
              onClick={syncToGoogleSheet}
              disabled={syncStatus.status === 'syncing' || !sheetUrl}
              className="w-full flex items-center gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${syncStatus.status === 'syncing' ? 'animate-spin' : ''}`} />
              {syncStatus.status === 'syncing' ? 'Syncing...' : 'Sync Now'}
            </Button>
            
            <div className="flex items-center gap-2 text-sm">
              {syncStatus.status === 'success' && <CheckCircle className="h-4 w-4 text-green-500" />}
              {syncStatus.status === 'error' && <AlertCircle className="h-4 w-4 text-red-500" />}
              {syncStatus.status === 'idle' && <span className="w-4"></span>}
              <span>
                {syncStatus.message}
                {syncStatus.lastSynced && ` (${syncStatus.lastSynced})`}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

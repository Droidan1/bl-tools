
import { useState, useEffect } from 'react';
import { useToast } from './use-toast';
import { MOSItem } from '@/types/mos';
import { saveMOSItem, getMOSItems, clearMOSItems } from '@/services/mosService';

export const useMOSState = () => {
  const [showScanner, setShowScanner] = useState(false);
  const [mosItems, setMOSItems] = useState<MOSItem[]>([]);
  const [activeTab, setActiveTab] = useState("scan");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentCode, setCurrentCode] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [reason, setReason] = useState("to bins");
  const [storeLocation, setStoreLocation] = useState("BL1");
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Load MOS items from Supabase on initial load
  useEffect(() => {
    const loadMOSItems = async () => {
      try {
        const items = await getMOSItems();
        setMOSItems(items);
      } catch (error) {
        console.error("Error loading MOS items:", error);
        toast({
          title: "Error",
          description: "Failed to load MOS items",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadMOSItems();
  }, [toast]);

  const handleScan = (result: string) => {
    setCurrentCode(result);
    setShowScanner(false);
    toast({
      title: "QR Code Scanned",
      description: `Code detected: ${result}`,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentCode) {
      toast({
        title: "Error",
        description: "Please scan a QR code first",
        variant: "destructive",
      });
      return;
    }

    const newItem: MOSItem = {
      id: crypto.randomUUID(),
      code: currentCode,
      quantity,
      reason,
      timestamp: new Date(),
      storeLocation,
    };

    try {
      await saveMOSItem(newItem);
      setMOSItems(prev => [newItem, ...prev]);
      toast({
        title: "Item Added",
        description: `Added ${quantity} units with code ${currentCode}`,
      });

      setCurrentCode("");
      setQuantity(1);
    } catch (error) {
      console.error("Error saving MOS item:", error);
      toast({
        title: "Error",
        description: "Failed to save item",
        variant: "destructive",
      });
    }
  };

  const handleExport = () => {
    if (mosItems.length === 0) {
      toast({
        title: "No Data",
        description: "There are no items to export",
        variant: "destructive",
      });
      return;
    }

    const headers = ["Code", "Quantity", "Reason", "Store", "Timestamp"];
    const rows = mosItems.map(item => [
      item.code,
      item.quantity.toString(),
      item.reason,
      item.storeLocation || storeLocation,
      item.timestamp.toLocaleString()
    ]);
    
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `mos-report-${storeLocation}-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: "Export Complete",
      description: "Report has been downloaded",
    });
  };

  const handleClearAll = async () => {
    if (window.confirm("Are you sure you want to clear all items?")) {
      try {
        await clearMOSItems();
        setMOSItems([]);
        toast({
          title: "Items Cleared",
          description: "All items have been removed",
        });
      } catch (error) {
        console.error("Error clearing MOS items:", error);
        toast({
          title: "Error",
          description: "Failed to clear items",
          variant: "destructive",
        });
      }
    }
  };

  const incrementQuantity = () => setQuantity(prev => prev + 1);
  const decrementQuantity = () => setQuantity(prev => prev > 1 ? prev - 1 : 1);

  return {
    showScanner,
    setShowScanner,
    mosItems,
    activeTab,
    setActiveTab,
    searchQuery,
    setSearchQuery,
    currentCode,
    setCurrentCode,
    quantity,
    setQuantity,
    reason,
    setReason,
    storeLocation,
    setStoreLocation,
    isLoading,
    handleScan,
    handleSubmit,
    handleExport,
    handleClearAll,
    incrementQuantity,
    decrementQuantity
  };
};

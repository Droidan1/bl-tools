
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarcodeScanner } from "@/components/BarcodeScanner";
import { useToast } from "@/hooks/use-toast";
import { MOSHeader } from "@/components/mos/MOSHeader";
import { MOSAddItemForm } from "@/components/mos/MOSAddItemForm";
import { MOSInventoryTable } from "@/components/mos/MOSInventoryTable";
import type { MOSItem } from "@/types/mos";

const MOS = () => {
  const [showScanner, setShowScanner] = useState(false);
  const [mosItems, setMOSItems] = useState<MOSItem[]>([]);
  const [activeTab, setActiveTab] = useState("scan");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentCode, setCurrentCode] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [reason, setReason] = useState("to bins");
  const { toast } = useToast();

  const handleScan = (result: string) => {
    setCurrentCode(result);
    setShowScanner(false);
    toast({
      title: "QR Code Scanned",
      description: `Code detected: ${result}`,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
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
    };

    setMOSItems(prev => [newItem, ...prev]);
    toast({
      title: "Item Added",
      description: `Added ${quantity} units with code ${currentCode}`,
    });

    // Reset form
    setCurrentCode("");
    setQuantity(1);
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

    // Create CSV content
    const headers = ["Code", "Quantity", "Reason", "Timestamp"];
    const rows = mosItems.map(item => [
      item.code,
      item.quantity.toString(),
      item.reason,
      item.timestamp.toLocaleString()
    ]);
    
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');
    
    // Create and trigger download
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `mos-report-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: "Export Complete",
      description: "Report has been downloaded",
    });
  };

  const incrementQuantity = () => setQuantity(prev => prev + 1);
  const decrementQuantity = () => setQuantity(prev => prev > 1 ? prev - 1 : 1);

  // Clear all items
  const handleClearAll = () => {
    if (window.confirm("Are you sure you want to clear all items?")) {
      setMOSItems([]);
      toast({
        title: "Items Cleared",
        description: "All items have been removed",
      });
    }
  };

  return (
    <div className="mx-auto py-3 px-3 max-w-md">
      <MOSHeader />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mb-4">
        <TabsList className="grid w-full grid-cols-2 bg-[#2a8636]/20">
          <TabsTrigger value="scan" className="data-[state=active]:bg-[#2a8636] data-[state=active]:text-white">
            Scan & Add
          </TabsTrigger>
          <TabsTrigger value="inventory" className="data-[state=active]:bg-[#2a8636] data-[state=active]:text-white">
            Inventory
          </TabsTrigger>
        </TabsList>

        <TabsContent value="scan" className="mt-4 focus-visible:outline-none focus-visible:ring-0">
          <MOSAddItemForm 
            currentCode={currentCode}
            quantity={quantity}
            reason={reason}
            setCurrentCode={setCurrentCode}
            setQuantity={setQuantity}
            setReason={setReason}
            incrementQuantity={incrementQuantity}
            decrementQuantity={decrementQuantity}
            onSubmit={handleSubmit}
            onScanClick={() => setShowScanner(true)}
          />
        </TabsContent>

        <TabsContent value="inventory" className="mt-4 focus-visible:outline-none focus-visible:ring-0">
          <MOSInventoryTable 
            items={mosItems}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            onExport={handleExport}
            onClearAll={handleClearAll}
          />
        </TabsContent>
      </Tabs>

      {showScanner && (
        <BarcodeScanner
          onScan={handleScan}
          onClose={() => setShowScanner(false)}
        />
      )}
    </div>
  );
};

export default MOS;

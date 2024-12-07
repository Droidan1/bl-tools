import { useState } from 'react';
import { InventoryForm } from '@/components/InventoryForm';
import { InventoryTable } from '@/components/InventoryTable';
import type { InventoryItem } from '@/types/inventory';
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";

const Index = () => {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const { toast } = useToast();

  const handleAddItem = (newItem: Omit<InventoryItem, 'id' | 'timestamp'>) => {
    const item: InventoryItem = {
      ...newItem,
      id: crypto.randomUUID(),
      timestamp: new Date(),
    };

    setItems(prev => [item, ...prev]);
    toast({
      title: "Item Added",
      description: `Added ${newItem.quantity} units of ${newItem.sapNumber}`,
    });
  };

  const handleSendReport = () => {
    // Convert items to CSV format
    const csvRows = items.map(item => {
      // Escape fields that might contain commas
      const escapeCsvField = (field: string) => {
        if (field.includes(',') || field.includes('"') || field.includes('\n')) {
          return `"${field.replace(/"/g, '""')}"`;
        }
        return field;
      };

      return [
        escapeCsvField(item.storeLocation),
        escapeCsvField(item.bolNumber || ''),
        escapeCsvField(item.sapNumber),
        item.quantity.toString(),
        escapeCsvField(item.barcode || ''),
        escapeCsvField(item.timestamp.toLocaleString())
      ].join(',');
    });

    const header = 'Store Location,BOL #,SAP Item #,Quantity,Barcode,Timestamp';
    const csvContent = [header, ...csvRows].join('\n');
    
    // Create a Blob containing the CSV data
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    
    // Create a temporary link to download the file
    const link = document.createElement('a');
    const date = new Date().toLocaleDateString().replace(/\//g, '-');
    link.download = `inventory-report-${date}.csv`;
    link.href = url;
    link.click();
    
    // Clean up
    URL.revokeObjectURL(url);
    
    // Now open Gmail with a cleaner message
    const gmailLink = `https://mail.google.com/mail/?view=cm&fs=1&to=kbowers@retjg.com&su=${encodeURIComponent(`Inventory Report ${date}`)}`;
    window.open(gmailLink, '_blank');
    
    toast({
      title: "Report Downloaded",
      description: "The CSV file has been downloaded. You can now attach it to the email.",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#144272] to-[#0A2647]">
      <div className="container px-4 py-4 mx-auto">
        <h1 className="text-2xl font-bold text-white mb-6 text-center sm:text-left">
          Inventory Receiver
        </h1>
        
        <div className="grid gap-6">
          <div className="w-full flex justify-center">
            <InventoryForm onSubmit={handleAddItem} />
          </div>
          
          <div className="w-full">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mb-4">
              <h2 className="text-lg font-semibold text-white order-1 sm:order-none">
                Recent Entries
              </h2>
              <Button 
                onClick={handleSendReport}
                variant="outline"
                className="flex items-center gap-2 w-full sm:w-auto order-2 sm:order-none bg-white/10 text-white hover:bg-white/20"
                disabled={items.length === 0}
              >
                <Mail className="h-4 w-4" />
                Send Report
              </Button>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-lg shadow-sm overflow-hidden border border-white/10">
              <div className="overflow-x-auto">
                <InventoryTable items={items} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
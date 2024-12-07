import { useState } from 'react';
import { InventoryForm } from '@/components/InventoryForm';
import { InventoryTable } from '@/components/InventoryTable';
import type { InventoryItem } from '@/types/inventory';
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";

const Index = () => {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const { toast } = useToast();

  const handleAddItem = (newItem: Omit<InventoryItem, 'id' | 'timestamp'>) => {
    if (editingItem) {
      // Update existing item
      const updatedItems = items.map(item => 
        item.id === editingItem.id 
          ? { ...item, ...newItem }
          : item
      );
      setItems(updatedItems);
      setEditingItem(null);
      toast({
        title: "Item Updated",
        description: `Updated ${newItem.quantity} units of ${newItem.sapNumber}`,
      });
    } else {
      // Add new item
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
    }
  };

  const handleEdit = (item: InventoryItem) => {
    setEditingItem(item);
    // Scroll to form
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
    <div className="min-h-screen bg-white">
      <div className="container px-4 py-4 mx-auto">
        <div className="flex justify-between items-center mb-6 bg-[#2a8636] p-1 rounded-lg">
          <h1 className="text-4xl font-bold text-white">
            {editingItem ? 'Edit Item' : 'Inventory Receiver'}
          </h1>
          <img 
            src="/lovable-uploads/c590340d-6c9e-4341-8686-91ba96211494.png" 
            alt="Header Logo" 
            className="h-48 w-auto"
          />
        </div>
        
        <div className="grid gap-6">
          <div className="w-full flex justify-center">
            <InventoryForm 
              onSubmit={handleAddItem} 
              initialValues={editingItem || undefined}
            />
          </div>
          
          <div className="w-full">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mb-4">
              <h2 className="text-lg font-semibold text-gray-900 order-1 sm:order-none">
                Recent Entries
              </h2>
              <Button 
                onClick={handleSendReport}
                variant="outline"
                className="flex items-center gap-2 w-full sm:w-auto order-2 sm:order-none bg-white text-gray-900 hover:bg-gray-50 border border-gray-200"
                disabled={items.length === 0}
              >
                <Mail className="h-4 w-4" />
                Send Report
              </Button>
            </div>
            <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
              <div className="overflow-x-auto">
                <InventoryTable 
                  items={items} 
                  onEdit={handleEdit}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
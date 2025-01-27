import React, { useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { toast } from "sonner";
import type { InventoryItem } from '@/types/inventory';

interface ReportImporterProps {
  onImport: (items: InventoryItem[]) => void;
}

export const ReportImporter = ({ onImport }: ReportImporterProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const lines = text.split('\n');
      
      // Find the start of inventory items (skip BOL photo URL)
      let startIndex = 0;
      for (let i = 0; i < lines.length; i++) {
        if (lines[i].trim() === '') {
          startIndex = i + 1;
          break;
        }
      }

      // Parse CSV headers
      const headers = lines[startIndex].split(',');
      const items: InventoryItem[] = [];

      // Parse each line after headers
      for (let i = startIndex + 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;

        const values = line.split(',').map(value => 
          value.startsWith('"') && value.endsWith('"') 
            ? value.slice(1, -1).replace(/""/g, '"') 
            : value
        );

        if (values.length >= 6) {
          const item: InventoryItem = {
            id: crypto.randomUUID(),
            storeLocation: values[0],
            bolNumber: values[1],
            sapNumber: values[2],
            quantity: parseInt(values[3], 10),
            barcode: values[4],
            timestamp: new Date(values[5]),
            photoUrl: values[6] || undefined
          };
          items.push(item);
        }
      }

      if (items.length > 0) {
        onImport(items);
        toast.success(`Successfully imported ${items.length} items`);
      } else {
        toast.error("No valid items found in the CSV file");
      }
    } catch (error) {
      console.error('Error parsing CSV:', error);
      toast.error("Failed to parse the CSV file. Please check the file format.");
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="relative">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        accept=".csv"
        className="hidden"
      />
      <Button
        onClick={() => fileInputRef.current?.click()}
        variant="outline"
        className="flex items-center gap-2 bg-white text-gray-900 hover:bg-black hover:text-white border border-gray-200"
      >
        <Upload className="h-4 w-4" />
        Import Report
      </Button>
    </div>
  );
};
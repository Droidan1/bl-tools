import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Download, Trash2 } from "lucide-react";
import type { InventoryItem } from '@/types/inventory';

interface ReportGeneratorProps {
  items: InventoryItem[];
  disabled: boolean;
  onClear: () => void;
  bolPhotoUrl?: string | null;
}

export const ReportGenerator = ({ items, disabled, onClear, bolPhotoUrl }: ReportGeneratorProps) => {
  const escapeCsvField = (field: string | null | undefined) => {
    if (!field) return '';
    if (field.includes(',') || field.includes('"') || field.includes('\n')) {
      return `"${field.replace(/"/g, '""')}"`;
    }
    return field;
  };

  const handleDownloadReport = () => {
    // Create the CSV rows for inventory items
    const csvRows = items.map(item => {
      return [
        escapeCsvField(item.storeLocation),
        escapeCsvField(item.bolNumber || ''),
        escapeCsvField(item.sapNumber),
        item.quantity.toString(),
        escapeCsvField(item.barcode || ''),
        escapeCsvField(item.timestamp.toLocaleDateString()),
        escapeCsvField(item.photoUrl || '')
      ].join(',');
    });

    // Create header and BOL photo row
    const header = 'Store Location,BOL #,SAP Item #,Quantity,Barcode,Timestamp,Item Photo URL';
    const bolPhotoHeader = 'BOL Photo URL';
    const bolPhotoData = bolPhotoUrl ? escapeCsvField(bolPhotoUrl) : '';
    
    // Combine all parts of the CSV
    const csvContent = [
      header,
      `${bolPhotoHeader},${bolPhotoData}`,
      '',  // Empty line to separate BOL photo from items
      ...csvRows
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    
    // Get the store location and BOL number from the first item
    const firstItem = items[0];
    const storeLocation = firstItem?.storeLocation?.replace(/[^a-zA-Z0-9]/g, '-') || 'unknown-location';
    const bolNumber = firstItem?.bolNumber?.replace(/[^a-zA-Z0-9]/g, '-') || 'no-bol';
    const date = new Date().toLocaleDateString().replace(/\//g, '-');
    
    const fileName = `${storeLocation}_${bolNumber}_${date}.csv`;

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = fileName;
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);

    toast.success("Report downloaded successfully");
  };

  return (
    <div className="flex gap-2 w-full sm:w-auto">
      <Button 
        onClick={handleDownloadReport}
        variant="outline"
        className="flex items-center gap-2 w-full sm:w-auto order-2 sm:order-none bg-white text-gray-900 hover:bg-black hover:text-white border border-gray-200"
        disabled={disabled}
      >
        <Download className="h-4 w-4" />
        Download Report
      </Button>
      <Button 
        onClick={onClear}
        variant="destructive"
        className="flex items-center gap-2 w-full sm:w-auto"
        disabled={disabled}
      >
        <Trash2 className="h-4 w-4" />
        Clear All
      </Button>
    </div>
  );
};
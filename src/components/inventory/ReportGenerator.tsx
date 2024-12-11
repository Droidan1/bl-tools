import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";
import type { InventoryItem } from '@/types/inventory';

interface ReportGeneratorProps {
  items: InventoryItem[];
  disabled: boolean;
  onClear: () => void;
}

export const ReportGenerator = ({ items, disabled, onClear }: ReportGeneratorProps) => {
  const handleSendReport = async () => {
    const csvRows = items.map(item => {
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
        escapeCsvField(item.timestamp.toLocaleDateString()),
        escapeCsvField(item.photoUrl || '')
      ].join(',');
    });

    const header = 'Store Location,BOL #,SAP Item #,Quantity,Barcode,Timestamp,Photo URL';
    const csvContent = [header, ...csvRows].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const date = new Date().toLocaleDateString().replace(/\//g, '-');
    const fileName = `inventory-report-${date}.csv`;

    const reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onload = () => {
      const base64data = reader.result?.toString().split(',')[1];
      
      const gmailSubject = encodeURIComponent(`Inventory Report ${date}`);
      const gmailBody = encodeURIComponent('Please find attached the inventory report.');
      
      const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=kbowers@retjg.com&su=${gmailSubject}&body=${gmailBody}`;
      window.open(gmailUrl, '_blank');
      
      toast("Email Prepared", {
        description: "Gmail compose window opened. Please attach the downloaded report.",
        duration: 3000,
      });

      // Clear entries after sending report
      onClear();
    };

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = fileName;
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Button 
      onClick={handleSendReport}
      variant="outline"
      className="flex items-center gap-2 w-full sm:w-auto order-2 sm:order-none bg-white text-gray-900 hover:bg-black hover:text-white border border-gray-200"
      disabled={disabled}
    >
      <Mail className="h-4 w-4" />
      Send Report
    </Button>
  );
};
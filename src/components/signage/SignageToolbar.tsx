
import { Button } from "@/components/ui/button";
import { 
  Download,
  Printer,
  Copy
} from "lucide-react";
import { SignageData } from "@/types/signage";
import { generateSignagePDF } from "./signageUtils";
import { toast } from "sonner";

interface SignageToolbarProps {
  signageData: SignageData;
}

export const SignageToolbar = ({ signageData }: SignageToolbarProps) => {
  const handleDownload = async () => {
    try {
      await generateSignagePDF(signageData);
      toast.success("PDF downloaded successfully!");
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Failed to generate PDF");
    }
  };

  const handlePrint = async () => {
    try {
      const pdfUrl = await generateSignagePDF(signageData, false);
      const printWindow = window.open(pdfUrl, '_blank');
      if (printWindow) {
        printWindow.addEventListener('load', () => {
          printWindow.print();
        });
      }
      toast.success("Sent to printer!");
    } catch (error) {
      console.error("Error printing PDF:", error);
      toast.error("Failed to print");
    }
  };

  const handleDuplicate = () => {
    // This would be implemented if we had a list of signs
    toast.info("Duplicate functionality will be added in a future update");
  };

  return (
    <div className="flex flex-wrap gap-2">
      <Button 
        variant="default" 
        onClick={handleDownload}
        className="flex items-center gap-2"
      >
        <Download size={16} />
        Download PDF
      </Button>
      <Button 
        variant="outline" 
        onClick={handlePrint}
        className="flex items-center gap-2"
      >
        <Printer size={16} />
        Print
      </Button>
      <Button 
        variant="secondary" 
        onClick={handleDuplicate}
        className="flex items-center gap-2"
      >
        <Copy size={16} />
        Duplicate
      </Button>
    </div>
  );
};

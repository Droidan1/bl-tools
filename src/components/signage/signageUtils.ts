
import { jsPDF } from "jspdf";
import { SignageData } from "@/types/signage";
import { renderSignageTemplate } from "./signageTemplates";
import { Canvas } from "fabric";

export const generateSignagePDF = async (
  signageData: SignageData, 
  download: boolean = true
): Promise<string> => {
  return new Promise((resolve, reject) => {
    try {
      // Create a temporary canvas for rendering
      const tempCanvas = document.createElement('canvas');
      const isLandscape = signageData.dimensions === "11 in x 8.5 in";
      
      // Set dimensions for PDF output - make it high resolution for better quality
      tempCanvas.width = isLandscape ? 1650 : 1275;
      tempCanvas.height = isLandscape ? 1275 : 1650;
      
      const fabricCanvas = new Canvas(tempCanvas);
      
      // Render the signage on the temp canvas
      renderSignageTemplate(fabricCanvas, signageData);
      
      // Initialize PDF with correct orientation
      const pdf = new jsPDF({
        orientation: isLandscape ? 'landscape' : 'portrait',
        unit: 'in',
        format: [8.5, 11]
      });
      
      // Convert canvas to image
      const imgData = tempCanvas.toDataURL('image/png');
      
      // Add image to PDF - position at 0,0 and size to fill page
      pdf.addImage(imgData, 'PNG', 0, 0, 8.5, 11);
      
      // Generate filename
      const filename = `bargain-lane-${signageData.saleType.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}.pdf`;
      
      if (download) {
        pdf.save(filename);
      }
      
      // Create a blob URL for preview/print
      const blobURL = URL.createObjectURL(pdf.output('blob'));
      resolve(blobURL);
      
      // Clean up temporary canvas
      fabricCanvas.dispose();
    } catch (error) {
      console.error("Error generating PDF:", error);
      reject(error);
    }
  });
};

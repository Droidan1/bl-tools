import { PageHeader } from '@/components/ui/page-header';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { toast } from "sonner";
import jsPDF from 'jspdf';
import { DailyRemarks } from '@/components/win-sheet/DailyRemarks';
import { Link } from 'react-router-dom';

const WinSheet = () => {
  const [formData, setFormData] = useState({
    salesGoal: '',
    weather: 'sunny',
    operationalIssues: '',
    customerFeedback: '',
    staffingDetails: '',
    safetyObservations: '',
    otherRemarks: '',
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const exportToPdf = () => {
    try {
      const doc = new jsPDF();
      let yPosition = 20;
      const leftMargin = 20;
      const lineHeight = 10;

      // Title
      doc.setFontSize(20);
      doc.setFont('helvetica', 'bold');
      doc.text('Win Sheet Report', leftMargin, yPosition);
      yPosition += lineHeight + 5;
      
      // Add sales goal and weather
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      doc.text(`Sales Goal: ${formData.salesGoal}`, leftMargin, yPosition);
      yPosition += lineHeight;
      doc.text(`Weather: ${formData.weather}`, leftMargin, yPosition);
      yPosition += lineHeight * 1.5;
      
      // Operational Issues
      doc.setFont('helvetica', 'bold');
      doc.text("Operational Issues", leftMargin, yPosition);
      yPosition += lineHeight;
      doc.setFont('helvetica', 'normal');
      const operationalIssuesLines = doc.splitTextToSize(formData.operationalIssues, 170);
      doc.text(operationalIssuesLines, leftMargin, yPosition);
      yPosition += (operationalIssuesLines.length * lineHeight) + 5;
      
      // Customer Feedback
      doc.setFont('helvetica', 'bold');
      doc.text("Customer Feedback", leftMargin, yPosition);
      yPosition += lineHeight;
      doc.setFont('helvetica', 'normal');
      const customerFeedbackLines = doc.splitTextToSize(formData.customerFeedback, 170);
      doc.text(customerFeedbackLines, leftMargin, yPosition);
      yPosition += (customerFeedbackLines.length * lineHeight) + 5;
      
      // Staffing Details
      doc.setFont('helvetica', 'bold');
      doc.text("Staffing Details", leftMargin, yPosition);
      yPosition += lineHeight;
      doc.setFont('helvetica', 'normal');
      const staffingDetailsLines = doc.splitTextToSize(formData.staffingDetails, 170);
      doc.text(staffingDetailsLines, leftMargin, yPosition);
      yPosition += (staffingDetailsLines.length * lineHeight) + 5;
      
      // Safety Observations
      doc.setFont('helvetica', 'bold');
      doc.text("Safety Observations", leftMargin, yPosition);
      yPosition += lineHeight;
      doc.setFont('helvetica', 'normal');
      const safetyObservationsLines = doc.splitTextToSize(formData.safetyObservations, 170);
      doc.text(safetyObservationsLines, leftMargin, yPosition);
      yPosition += (safetyObservationsLines.length * lineHeight) + 5;
      
      // Other Remarks
      doc.setFont('helvetica', 'bold');
      doc.text("Other Remarks", leftMargin, yPosition);
      yPosition += lineHeight;
      doc.setFont('helvetica', 'normal');
      const otherRemarksLines = doc.splitTextToSize(formData.otherRemarks, 170);
      doc.text(otherRemarksLines, leftMargin, yPosition);
      yPosition += (otherRemarksLines.length * lineHeight) + 5;
      
      // Save PDF
      const fileName = `win-sheet-${new Date().toISOString().split('T')[0]}.pdf`;
      doc.save(fileName);
      toast.success("Win Sheet exported successfully as PDF!");
    } catch (error) {
      console.error('Export failed:', error);
      toast.error("Failed to export Win Sheet");
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="container px-4 py-2 mx-auto max-w-7xl">
        <div className="flex justify-between items-center">
          <PageHeader title="Win Sheet" />
        </div>
        
        <DailyRemarks 
          {...formData}
          onInputChange={handleInputChange}
        />

        <div className="flex justify-end mt-6">
          <Button 
            type="button" 
            onClick={exportToPdf}
            className="bg-primary hover:bg-primary/90"
          >
            Export
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WinSheet;

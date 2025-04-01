import { jsPDF } from "jspdf";
import { format } from "date-fns";

// Helper to create Journal PDF exports
export const createJournalPdf = (
  currentDate: Date,
  formData: {
    salesGoal: string;
    weather: string;
    operationalIssues: string;
    customerFeedback: string;
    staffingDetails: string;
    safetyObservations: string;
    otherRemarks: string;
  }
) => {
  const doc = new jsPDF();
  let yPosition = 20;
  const leftMargin = 20;
  const lineHeight = 10;

  // Title
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('Journal Report', leftMargin, yPosition);
  yPosition += lineHeight + 5;

  // Add date to PDF
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text(`Date: ${format(currentDate, 'MMMM dd, yyyy')}`, leftMargin, yPosition);
  yPosition += lineHeight;

  // Add sales goal and weather
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
  yPosition += operationalIssuesLines.length * lineHeight + 5;

  // Customer Feedback
  doc.setFont('helvetica', 'bold');
  doc.text("Customer Feedback", leftMargin, yPosition);
  yPosition += lineHeight;
  doc.setFont('helvetica', 'normal');
  const customerFeedbackLines = doc.splitTextToSize(formData.customerFeedback, 170);
  doc.text(customerFeedbackLines, leftMargin, yPosition);
  yPosition += customerFeedbackLines.length * lineHeight + 5;

  // Staffing Details
  doc.setFont('helvetica', 'bold');
  doc.text("Staffing Details", leftMargin, yPosition);
  yPosition += lineHeight;
  doc.setFont('helvetica', 'normal');
  const staffingDetailsLines = doc.splitTextToSize(formData.staffingDetails, 170);
  doc.text(staffingDetailsLines, leftMargin, yPosition);
  yPosition += staffingDetailsLines.length * lineHeight + 5;

  // Safety Observations
  doc.setFont('helvetica', 'bold');
  doc.text("Safety Observations", leftMargin, yPosition);
  yPosition += lineHeight;
  doc.setFont('helvetica', 'normal');
  const safetyObservationsLines = doc.splitTextToSize(formData.safetyObservations, 170);
  doc.text(safetyObservationsLines, leftMargin, yPosition);
  yPosition += safetyObservationsLines.length * lineHeight + 5;

  // Other Remarks
  doc.setFont('helvetica', 'bold');
  doc.text("Other Remarks", leftMargin, yPosition);
  yPosition += lineHeight;
  doc.setFont('helvetica', 'normal');
  const otherRemarksLines = doc.splitTextToSize(formData.otherRemarks, 170);
  doc.text(otherRemarksLines, leftMargin, yPosition);
  
  // Return the document for saving
  return {
    doc,
    fileName: `journal-${format(currentDate, 'yyyy-MM-dd')}.pdf`
  };
};

// Helper to create Projects & Zones PDF exports
export const createProjectsAndZonesPdf = (
  date: Date,
  formData: {
    associates: string[];
    zones: string[];
    priorities: Array<{
      id: string;
      text: string;
      status: string;
    }>;
  }
) => {
  const doc = new jsPDF();
  let yPosition = 20;
  const leftMargin = 20;
  const lineHeight = 10;

  // Title
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('Projects & Zones Report', leftMargin, yPosition);
  yPosition += lineHeight * 2;
  
  // Date
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text(`Date: ${date.toLocaleDateString()}`, leftMargin, yPosition);
  yPosition += lineHeight * 1.5;
  
  // This Week's Priorities
  doc.setFont('helvetica', 'bold');
  doc.text("Today's Projects", leftMargin, yPosition);
  yPosition += lineHeight;
  doc.setFont('helvetica', 'normal');
  formData.priorities.forEach(priority => {
    const priorityText = `${priority.text} - Status: ${priority.status.replace(/-/g, ' ').toUpperCase()}`;
    const priorityLines = doc.splitTextToSize(priorityText, 170);
    doc.text(priorityLines, leftMargin, yPosition);
    yPosition += (priorityLines.length * lineHeight);
  });
  yPosition += 5;
  
  // Staff Working Zones
  doc.setFont('helvetica', 'bold');
  doc.text("Staff Working Zones", leftMargin, yPosition);
  yPosition += lineHeight;
  doc.setFont('helvetica', 'normal');
  formData.associates.forEach((associate, index) => {
    if (associate.trim()) {
      const zoneText = `${associate} - ${formData.zones[index] || 'No zone assigned'}`;
      doc.text(zoneText, leftMargin, yPosition);
      yPosition += lineHeight;
    }
  });
  
  // Return the document for saving
  return {
    doc,
    fileName: `projects-zones-${date.toISOString().split('T')[0]}.pdf`
  };
};

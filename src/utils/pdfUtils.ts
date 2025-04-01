
import { format } from "date-fns";

// Simple PDF data preparation - we'll use printable HTML instead of jsPDF
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
  // Create a printable HTML string
  const fileName = `journal-${format(currentDate, 'yyyy-MM-dd')}.html`;
  
  // Return data for browser-based PDF creation
  return {
    fileName,
    printContent: `
      <html>
      <head>
        <title>Journal Report - ${format(currentDate, 'MMMM dd, yyyy')}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 30px; }
          h1 { font-size: 24px; margin-bottom: 20px; }
          .date { font-size: 16px; margin-bottom: 20px; }
          .section { margin-bottom: 20px; }
          .section-title { font-weight: bold; margin-bottom: 5px; }
          .section-content { margin-left: 10px; }
        </style>
      </head>
      <body>
        <h1>Journal Report</h1>
        <div class="date">Date: ${format(currentDate, 'MMMM dd, yyyy')}</div>
        
        <div class="section">
          <div class="section-title">Sales Goal:</div>
          <div class="section-content">${formData.salesGoal}</div>
        </div>
        
        <div class="section">
          <div class="section-title">Weather:</div>
          <div class="section-content">${formData.weather}</div>
        </div>
        
        <div class="section">
          <div class="section-title">Operational Issues:</div>
          <div class="section-content">${formData.operationalIssues}</div>
        </div>
        
        <div class="section">
          <div class="section-title">Customer Feedback:</div>
          <div class="section-content">${formData.customerFeedback}</div>
        </div>
        
        <div class="section">
          <div class="section-title">Staffing Details:</div>
          <div class="section-content">${formData.staffingDetails}</div>
        </div>
        
        <div class="section">
          <div class="section-title">Safety Observations:</div>
          <div class="section-content">${formData.safetyObservations}</div>
        </div>
        
        <div class="section">
          <div class="section-title">Other Remarks:</div>
          <div class="section-content">${formData.otherRemarks}</div>
        </div>
      </body>
      </html>
    `
  };
};

// Helper to create Projects & Zones HTML exports
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
  const fileName = `projects-zones-${date.toISOString().split('T')[0]}.html`;
  
  // Build priorities HTML
  let prioritiesHtml = '';
  formData.priorities.forEach(priority => {
    prioritiesHtml += `
      <div class="priority-item">
        ${priority.text} - Status: ${priority.status.replace(/-/g, ' ').toUpperCase()}
      </div>
    `;
  });
  
  // Build staff zones HTML
  let zonesHtml = '';
  formData.associates.forEach((associate, index) => {
    if (associate.trim()) {
      zonesHtml += `
        <div class="zone-item">
          ${associate} - ${formData.zones[index] || 'No zone assigned'}
        </div>
      `;
    }
  });
  
  return {
    fileName,
    printContent: `
      <html>
      <head>
        <title>Projects & Zones Report - ${date.toLocaleDateString()}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 30px; }
          h1 { font-size: 24px; margin-bottom: 20px; }
          .date { font-size: 16px; margin-bottom: 20px; }
          .section { margin-bottom: 20px; }
          .section-title { font-weight: bold; margin-bottom: 10px; font-size: 18px; }
          .priority-item, .zone-item { margin-bottom: 8px; }
        </style>
      </head>
      <body>
        <h1>Projects & Zones Report</h1>
        <div class="date">Date: ${date.toLocaleDateString()}</div>
        
        <div class="section">
          <div class="section-title">Today's Projects</div>
          ${prioritiesHtml || '<div>No projects added</div>'}
        </div>
        
        <div class="section">
          <div class="section-title">Staff Working Zones</div>
          ${zonesHtml || '<div>No staff zones assigned</div>'}
        </div>
      </body>
      </html>
    `
  };
};

// Helper function to trigger print
export const printHtml = (htmlContent: string) => {
  // Create a new window for the printable content
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('Please allow popups for this website to export PDF');
    return;
  }
  
  // Write the HTML content to the new window
  printWindow.document.write(htmlContent);
  printWindow.document.close();
  
  // Wait for content to load before printing
  printWindow.onload = function() {
    printWindow.print();
    // Close the print window/tab after printing is complete or canceled
    // We use a small delay to allow the print dialog to appear
    setTimeout(() => {
      printWindow.close();
    }, 500);
  };
};

import { PageHeader } from '@/components/ui/page-header';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DailyRemarks } from '@/components/win-sheet/DailyRemarks';
import { ProjectsAndZones } from '@/components/win-sheet/ProjectsAndZones';
import jsPDF from 'jspdf';

interface Priority {
  id: string;
  text: string;
  status: 'need-to-start' | 'working-on' | 'completed';
}

const WinSheet = () => {
  const [formData, setFormData] = useState({
    salesGoal: '',
    weather: 'sunny',
    operationalIssues: '',
    customerFeedback: '',
    staffingDetails: '',
    safetyObservations: '',
    otherRemarks: '',
    associates: [''],
    zones: [''],
    project: '',
    priorities: [] as Priority[]
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAssociateChange = (index: number, value: string) => {
    const newAssociates = [...formData.associates];
    newAssociates[index] = value;
    setFormData(prev => ({ ...prev, associates: newAssociates }));
  };

  const handleZoneChange = (index: number, value: string) => {
    const newZones = [...formData.zones];
    newZones[index] = value;
    setFormData(prev => ({ ...prev, zones: newZones }));
  };

  const addAssociateZone = () => {
    setFormData(prev => ({
      ...prev,
      associates: [...prev.associates, ''],
      zones: [...prev.zones, '']
    }));
  };

  const handleAddPriority = (text: string) => {
    const newPriority: Priority = {
      id: crypto.randomUUID(),
      text,
      status: 'need-to-start'
    };
    setFormData(prev => ({
      ...prev,
      priorities: [...prev.priorities, newPriority]
    }));
    toast.success("Priority added successfully");
  };

  const handleRemovePriority = (id: string) => {
    setFormData(prev => ({
      ...prev,
      priorities: prev.priorities.filter(priority => priority.id !== id)
    }));
    toast.success("Priority removed successfully");
  };

  const handleUpdatePriorityStatus = (id: string, status: Priority['status']) => {
    setFormData(prev => ({
      ...prev,
      priorities: prev.priorities.map(priority =>
        priority.id === id ? { ...priority, status } : priority
      )
    }));
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
      
      // Check if we need a new page before adding priorities
      if (yPosition > 250) {
        doc.addPage();
        yPosition = 20;
      }
      
      // This Week's Priorities
      doc.setFont('helvetica', 'bold');
      doc.text("This Week's Priorities", leftMargin, yPosition);
      yPosition += lineHeight;
      doc.setFont('helvetica', 'normal');
      formData.priorities.forEach(priority => {
        const priorityText = `${priority.text} - Status: ${priority.status.replace(/-/g, ' ').toUpperCase()}`;
        const priorityLines = doc.splitTextToSize(priorityText, 170);
        doc.text(priorityLines, leftMargin, yPosition);
        yPosition += (priorityLines.length * lineHeight);
      });
      yPosition += 5;
      
      // Check if we need a new page before adding project info
      if (yPosition > 250) {
        doc.addPage();
        yPosition = 20;
      }
      
      // Project
      doc.setFont('helvetica', 'bold');
      doc.text("Project", leftMargin, yPosition);
      yPosition += lineHeight;
      doc.setFont('helvetica', 'normal');
      const projectLines = doc.splitTextToSize(formData.project, 170);
      doc.text(projectLines, leftMargin, yPosition);
      yPosition += (projectLines.length * lineHeight) + 5;
      
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
        <PageHeader title="Win Sheet" />
        
        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="general">Daily Remarks</TabsTrigger>
            <TabsTrigger value="staff">Projects & Zones</TabsTrigger>
          </TabsList>

          <TabsContent value="general">
            <DailyRemarks 
              {...formData}
              onInputChange={handleInputChange}
            />
          </TabsContent>

          <TabsContent value="staff">
            <ProjectsAndZones 
              {...formData}
              onAssociateChange={handleAssociateChange}
              onZoneChange={handleZoneChange}
              onAdd={addAssociateZone}
              onInputChange={handleInputChange}
              onAddPriority={handleAddPriority}
              onRemovePriority={handleRemovePriority}
              onUpdatePriorityStatus={handleUpdatePriorityStatus}
            />
          </TabsContent>
        </Tabs>

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

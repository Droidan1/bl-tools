import { PageHeader } from '@/components/ui/page-header';
import { Button } from '@/components/ui/button';
import { Document, Packer, Paragraph, TextRun } from 'docx';
import { useState } from 'react';
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DailyRemarks } from '@/components/win-sheet/DailyRemarks';
import { ProjectsAndZones } from '@/components/win-sheet/ProjectsAndZones';

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
    priorities: ''
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

  const exportToWord = async () => {
    try {
      const doc = new Document({
        sections: [{
          properties: {},
          children: [
            new Paragraph({
              children: [new TextRun({ text: "Win Sheet Report", bold: true, size: 32 })]
            }),
            new Paragraph({
              children: [new TextRun({ text: `Sales Goal: ${formData.salesGoal}`, size: 24 })]
            }),
            new Paragraph({
              children: [new TextRun({ text: `Weather: ${formData.weather}`, size: 24 })]
            }),
            new Paragraph({
              children: [new TextRun({ text: "Operational Issues", bold: true, size: 28 })]
            }),
            new Paragraph({
              children: [new TextRun({ text: formData.operationalIssues })]
            }),
            new Paragraph({
              children: [new TextRun({ text: "Customer Feedback", bold: true, size: 28 })]
            }),
            new Paragraph({
              children: [new TextRun({ text: formData.customerFeedback })]
            }),
            new Paragraph({
              children: [new TextRun({ text: "Staffing Details", bold: true, size: 28 })]
            }),
            new Paragraph({
              children: [new TextRun({ text: formData.staffingDetails })]
            }),
            new Paragraph({
              children: [new TextRun({ text: "Safety Observations", bold: true, size: 28 })]
            }),
            new Paragraph({
              children: [new TextRun({ text: formData.safetyObservations })]
            }),
            new Paragraph({
              children: [new TextRun({ text: "Other Remarks", bold: true, size: 28 })]
            }),
            new Paragraph({
              children: [new TextRun({ text: formData.otherRemarks })]
            }),
            new Paragraph({
              children: [new TextRun({ text: "This Week's Priorities", bold: true, size: 28 })]
            }),
            new Paragraph({
              children: [new TextRun({ text: formData.priorities })]
            }),
            new Paragraph({
              children: [new TextRun({ text: "Project", bold: true, size: 28 })]
            }),
            new Paragraph({
              children: [new TextRun({ text: formData.project })]
            }),
            new Paragraph({
              children: [new TextRun({ text: "Staff Working Zones", bold: true, size: 28 })]
            }),
            ...formData.associates.map((associate, index) => 
              new Paragraph({
                children: [new TextRun({ 
                  text: `${associate} - ${formData.zones[index]}` 
                })]
              })
            )
          ]
        }]
      });

      const blob = await Packer.toBlob(doc);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `win-sheet-${new Date().toISOString().split('T')[0]}.docx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success("Win Sheet exported successfully!");
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
            />
          </TabsContent>
        </Tabs>

        <div className="flex justify-end mt-6">
          <Button 
            type="button" 
            onClick={exportToWord}
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
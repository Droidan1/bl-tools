import { PageHeader } from '@/components/ui/page-header';
import { Input } from "@/components/ui/input";
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Document, Packer, Paragraph, TextRun } from 'docx';
import { useState } from 'react';
import { toast } from "sonner";
import { WeatherSelector } from '@/components/win-sheet/WeatherSelector';
import { StaffZones } from '@/components/win-sheet/StaffZones';
import { TextSection } from '@/components/win-sheet/TextSection';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
    zones: ['']
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
            <TabsTrigger value="general">General Information</TabsTrigger>
            <TabsTrigger value="staff">Staff Working Zones</TabsTrigger>
          </TabsList>

          <TabsContent value="general">
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="salesGoal" className="text-sm font-medium">
                    Sales Goal
                  </label>
                  <Input 
                    id="salesGoal" 
                    placeholder="Enter sales goal"
                    value={formData.salesGoal}
                    onChange={(e) => handleInputChange('salesGoal', e.target.value)}
                  />
                </div>
                <WeatherSelector 
                  value={formData.weather}
                  onChange={(value) => handleInputChange('weather', value)}
                />
              </div>

              <div className="space-y-6">
                <TextSection
                  label="Operational Issues"
                  value={formData.operationalIssues}
                  onChange={(value) => handleInputChange('operationalIssues', value)}
                  placeholder="Enter operational issues"
                />

                <TextSection
                  label="Customer Feedback"
                  value={formData.customerFeedback}
                  onChange={(value) => handleInputChange('customerFeedback', value)}
                  placeholder="Enter customer feedback"
                />

                <TextSection
                  label="Staffing Details"
                  value={formData.staffingDetails}
                  onChange={(value) => handleInputChange('staffingDetails', value)}
                  placeholder="Enter staffing details"
                />

                <TextSection
                  label="Safety Observations"
                  value={formData.safetyObservations}
                  onChange={(value) => handleInputChange('safetyObservations', value)}
                  placeholder="Enter safety observations"
                />

                <TextSection
                  label="Other Remarks"
                  value={formData.otherRemarks}
                  onChange={(value) => handleInputChange('otherRemarks', value)}
                  placeholder="Enter other remarks"
                />
              </div>
            </form>
          </TabsContent>

          <TabsContent value="staff">
            <Card className="p-4">
              <StaffZones
                associates={formData.associates}
                zones={formData.zones}
                onAssociateChange={handleAssociateChange}
                onZoneChange={handleZoneChange}
                onAdd={addAssociateZone}
              />
            </Card>
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
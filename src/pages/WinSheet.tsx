import { PageHeader } from '@/components/ui/page-header';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Document, Packer, Paragraph, TextRun } from 'docx';
import { useState } from 'react';
import { toast } from "sonner";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Sun, CloudRain, CloudSnow, CloudSun, Cloud } from "lucide-react";

const WinSheet = () => {
  const [formData, setFormData] = useState({
    salesGoal: '',
    weather: 'sunny', // Default weather
    operationalIssues: '',
    customerFeedback: '',
    staffingDetails: '',
    safetyObservations: '',
    otherRemarks: '',
    associates: [''],
    zones: ['']
  });

  const weatherOptions = [
    { value: 'sunny', icon: Sun, label: 'Sunny' },
    { value: 'rain', icon: CloudRain, label: 'Rain' },
    { value: 'snow', icon: CloudSnow, label: 'Snow' },
    { value: 'cold', icon: Cloud, label: 'Cold' },
    { value: 'hot', icon: CloudSun, label: 'Hot' }
  ];

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
        
        <form className="space-y-6">
          {/* Header Section */}
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
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Weather
              </label>
              <RadioGroup
                value={formData.weather}
                onValueChange={(value) => handleInputChange('weather', value)}
                className="flex flex-wrap gap-4"
              >
                {weatherOptions.map(({ value, icon: Icon, label }) => (
                  <div key={value} className="flex flex-col items-center gap-1">
                    <div className="relative">
                      <RadioGroupItem
                        value={value}
                        id={value}
                        className="peer sr-only"
                      />
                      <label
                        htmlFor={value}
                        className="flex flex-col items-center justify-center w-16 h-16 rounded-lg border-2 border-muted peer-data-[state=checked]:border-primary peer-data-[state=checked]:text-primary cursor-pointer transition-colors"
                      >
                        <Icon className="w-8 h-8" />
                        <span className="text-xs mt-1">{label}</span>
                      </label>
                    </div>
                  </div>
                ))}
              </RadioGroup>
            </div>
          </div>

          {/* Main Sections */}
          <div className="space-y-6">
            <Card className="p-4 space-y-2">
              <label htmlFor="operationalIssues" className="text-sm font-medium">
                Operational Issues
              </label>
              <Textarea
                id="operationalIssues"
                placeholder="Enter operational issues"
                className="min-h-[100px]"
                value={formData.operationalIssues}
                onChange={(e) => handleInputChange('operationalIssues', e.target.value)}
              />
            </Card>

            <Card className="p-4 space-y-2">
              <label htmlFor="customerFeedback" className="text-sm font-medium">
                Customer Feedback
              </label>
              <Textarea
                id="customerFeedback"
                placeholder="Enter customer feedback"
                className="min-h-[100px]"
                value={formData.customerFeedback}
                onChange={(e) => handleInputChange('customerFeedback', e.target.value)}
              />
            </Card>

            <Card className="p-4 space-y-2">
              <label htmlFor="staffingDetails" className="text-sm font-medium">
                Staffing Details
              </label>
              <Textarea
                id="staffingDetails"
                placeholder="Enter staffing details"
                className="min-h-[100px]"
                value={formData.staffingDetails}
                onChange={(e) => handleInputChange('staffingDetails', e.target.value)}
              />
            </Card>

            <Card className="p-4 space-y-2">
              <label htmlFor="safetyObservations" className="text-sm font-medium">
                Safety Observations
              </label>
              <Textarea
                id="safetyObservations"
                placeholder="Enter safety observations"
                className="min-h-[100px]"
                value={formData.safetyObservations}
                onChange={(e) => handleInputChange('safetyObservations', e.target.value)}
              />
            </Card>

            <Card className="p-4 space-y-2">
              <label htmlFor="otherRemarks" className="text-sm font-medium">
                Other Remarks
              </label>
              <Textarea
                id="otherRemarks"
                placeholder="Enter other remarks"
                className="min-h-[100px]"
                value={formData.otherRemarks}
                onChange={(e) => handleInputChange('otherRemarks', e.target.value)}
              />
            </Card>
          </div>

          {/* Staff Working Zones Section */}
          <Card className="p-4">
            <h3 className="text-lg font-medium mb-4">Staff Working Zones</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium mb-2">Associates</h4>
                <div className="space-y-2">
                  {formData.associates.map((associate, index) => (
                    <Input
                      key={`associate-${index}`}
                      placeholder={`Associate ${index + 1}`}
                      value={associate}
                      onChange={(e) => handleAssociateChange(index, e.target.value)}
                    />
                  ))}
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium mb-2">Zone</h4>
                <div className="space-y-2">
                  {formData.zones.map((zone, index) => (
                    <Input
                      key={`zone-${index}`}
                      placeholder={`Zone ${index + 1}`}
                      value={zone}
                      onChange={(e) => handleZoneChange(index, e.target.value)}
                    />
                  ))}
                </div>
              </div>
            </div>
            <div className="mt-4">
              <Button 
                type="button" 
                onClick={addAssociateZone}
                variant="outline"
                className="w-full"
              >
                Add Associate & Zone
              </Button>
            </div>
          </Card>

          {/* Export Button */}
          <div className="flex justify-end">
            <Button 
              type="button" 
              onClick={exportToWord}
              className="bg-primary hover:bg-primary/90"
            >
              Export to Word
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default WinSheet;

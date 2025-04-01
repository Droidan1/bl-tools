
import { PageHeader } from '@/components/ui/page-header';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from 'react';
import { toast } from "sonner";
import { ProjectsAndZones as ProjectsAndZonesComponent } from '@/components/win-sheet/ProjectsAndZones';
import { createProjectsAndZonesPdf, printHtml } from '@/utils/pdfUtils';

interface Priority {
  id: string;
  text: string;
  status: 'need-to-start' | 'working-on' | 'completed';
}

const ProjectsAndZonesPage = () => {
  const [formData, setFormData] = useState({
    associates: [''],
    zones: [''],
    project: '', // keeping this for now to avoid prop type changes
    priorities: [] as Priority[]
  });
  const [date, setDate] = useState(new Date());

  // Effect to update date on any form change
  useEffect(() => {
    // This effect is no longer needed as we're allowing manual date changes
    // But we'll keep it for reference and remove the dependency on formData
  }, []);

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

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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

  const handleDateChange = (newDate: Date) => {
    setDate(newDate);
  };

  const exportToPdf = () => {
    try {
      const { printContent } = createProjectsAndZonesPdf(date, formData);
      printHtml(printContent);
      toast.success("Projects & Zones exported successfully for printing!");
    } catch (error) {
      console.error('Export failed:', error);
      toast.error("Failed to export Projects & Zones");
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="container px-4 py-2 mx-auto max-w-7xl">
        <PageHeader title="Projects & Zones" />
        
        <Card className="p-6 mb-6">
          <ProjectsAndZonesComponent 
            {...formData}
            date={date}
            onAssociateChange={handleAssociateChange}
            onZoneChange={handleZoneChange}
            onAdd={addAssociateZone}
            onInputChange={handleInputChange}
            onAddPriority={handleAddPriority}
            onRemovePriority={handleRemovePriority}
            onUpdatePriorityStatus={handleUpdatePriorityStatus}
            onDateChange={handleDateChange}
          />
        </Card>

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

export default ProjectsAndZonesPage;

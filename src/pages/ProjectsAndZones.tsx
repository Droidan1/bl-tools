
import { PageHeader } from '@/components/ui/page-header';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { toast } from "sonner";
import { ProjectsAndZones as ProjectsAndZonesComponent } from '@/components/win-sheet/ProjectsAndZones';

interface Priority {
  id: string;
  text: string;
  status: 'need-to-start' | 'working-on' | 'completed';
}

const ProjectsAndZonesPage = () => {
  const [formData, setFormData] = useState({
    associates: [''],
    zones: [''],
    project: '',
    priorities: [] as Priority[]
  });

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

  return (
    <div className="min-h-screen bg-white">
      <div className="container px-4 py-2 mx-auto max-w-7xl">
        <PageHeader title="Projects & Zones" />
        
        <ProjectsAndZonesComponent 
          {...formData}
          onAssociateChange={handleAssociateChange}
          onZoneChange={handleZoneChange}
          onAdd={addAssociateZone}
          onInputChange={handleInputChange}
          onAddPriority={handleAddPriority}
          onRemovePriority={handleRemovePriority}
          onUpdatePriorityStatus={handleUpdatePriorityStatus}
        />

        <div className="flex justify-between mt-6">
          <Button 
            type="button" 
            onClick={() => window.history.back()}
            variant="outline"
          >
            Back to Win Sheet
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProjectsAndZonesPage;

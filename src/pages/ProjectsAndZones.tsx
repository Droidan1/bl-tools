
import { PageHeader } from '@/components/ui/page-header';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from 'react';
import { toast } from "sonner";
import { StaffZones } from '@/components/win-sheet/StaffZones';
import { ProjectsAndZones as ProjectsAndZonesComponent } from '@/components/win-sheet/ProjectsAndZones';
import { jsPDF } from 'jspdf';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

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

  const handleDateChange = (newDate: Date | undefined) => {
    if (newDate) {
      setDate(newDate);
    }
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

  const exportToPdf = () => {
    try {
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
      doc.text(`Date: ${format(date, 'MMMM dd, yyyy')}`, leftMargin, yPosition);
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
      
      // Save PDF
      const fileName = `projects-zones-${format(date, 'yyyy-MM-dd')}.pdf`;
      doc.save(fileName);
      toast.success("Projects & Zones exported successfully as PDF!");
    } catch (error) {
      console.error('Export failed:', error);
      toast.error("Failed to export Projects & Zones");
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="container px-4 py-2 mx-auto max-w-7xl">
        <div className="flex justify-between items-center mb-4">
          <PageHeader title="Projects & Zones" />
          
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-[240px] justify-start text-left font-normal",
                  "border border-input"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {format(date, 'MMMM dd, yyyy')}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                mode="single"
                selected={date}
                onSelect={handleDateChange}
                initialFocus
                className="p-3 pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>
        
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

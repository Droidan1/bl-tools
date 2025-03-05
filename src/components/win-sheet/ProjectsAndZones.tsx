
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { StaffZones } from './StaffZones';
import { Button } from "@/components/ui/button";
import { X, CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

interface Priority {
  id: string;
  text: string;
  status: 'need-to-start' | 'working-on' | 'completed';
}

interface ProjectsAndZonesProps {
  associates: string[];
  zones: string[];
  project: string;
  priorities: Priority[];
  onAssociateChange: (index: number, value: string) => void;
  onZoneChange: (index: number, value: string) => void;
  onAdd: () => void;
  onInputChange: (field: string, value: string) => void;
  onAddPriority: (priority: string) => void;
  onRemovePriority: (id: string) => void;
  onUpdatePriorityStatus: (id: string, status: Priority['status']) => void;
  date: Date;
  onDateChange?: (date: Date) => void;
}

export const ProjectsAndZones = ({
  associates,
  zones,
  project,
  priorities,
  onAssociateChange,
  onZoneChange,
  onAdd,
  onInputChange,
  onAddPriority,
  onRemovePriority,
  onUpdatePriorityStatus,
  date,
  onDateChange
}: ProjectsAndZonesProps) => {
  const handleAddPriority = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const input = form.elements.namedItem('priority') as HTMLInputElement;
    if (input.value.trim()) {
      onAddPriority(input.value.trim());
      input.value = '';
    }
  };

  return <Card className="p-4 space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Staff Zones</h3>
        <div className="flex items-center gap-2">
          {onDateChange ? (
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "text-sm text-gray-500 font-medium",
                    "border border-input"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {format(date, "MMMM dd, yyyy")}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(newDate) => newDate && onDateChange(newDate)}
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          ) : (
            <div className="text-sm text-gray-500 font-medium">
              {format(date, "MMMM dd, yyyy")}
            </div>
          )}
        </div>
      </div>
      
      <StaffZones associates={associates} zones={zones} onAssociateChange={onAssociateChange} onZoneChange={onZoneChange} onAdd={onAdd} />
      
      <div className="mt-6 pt-6 border-t">
        <h3 className="text-lg font-medium mb-4">Today's Projects</h3>
        <form onSubmit={handleAddPriority} className="flex gap-2 mb-4">
          <Input name="priority" placeholder="Add a new priority" className="flex-1" />
          <Button type="submit">Add Project</Button>
        </form>
        <div className="space-y-2">
          {priorities.map(priority => <div key={priority.id} className="flex items-center gap-2">
              <Input value={priority.text} readOnly className="flex-1" />
              <Select value={priority.status} onValueChange={(value: Priority['status']) => onUpdatePriorityStatus(priority.id, value)}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="need-to-start">Need to Start</SelectItem>
                  <SelectItem value="working-on">Working on</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="ghost" size="icon" onClick={() => onRemovePriority(priority.id)}>
                <X className="h-4 w-4" />
              </Button>
            </div>)}
        </div>
      </div>
    </Card>;
};

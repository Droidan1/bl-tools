import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { StaffZones } from './StaffZones';

interface ProjectsAndZonesProps {
  associates: string[];
  zones: string[];
  project: string;
  priorities: string;
  onAssociateChange: (index: number, value: string) => void;
  onZoneChange: (index: number, value: string) => void;
  onAdd: () => void;
  onInputChange: (field: string, value: string) => void;
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
}: ProjectsAndZonesProps) => {
  return (
    <Card className="p-4 space-y-6">
      <StaffZones
        associates={associates}
        zones={zones}
        onAssociateChange={onAssociateChange}
        onZoneChange={onZoneChange}
        onAdd={onAdd}
      />
      
      <div className="mt-6 pt-6 border-t">
        <h3 className="text-lg font-medium mb-4">This Week's Priorities</h3>
        <div className="space-y-2">
          <Input
            placeholder="Enter this week's priorities"
            value={priorities}
            onChange={(e) => onInputChange('priorities', e.target.value)}
          />
        </div>
      </div>

      <div className="mt-6 pt-6 border-t">
        <h3 className="text-lg font-medium mb-4">Project Details</h3>
        <div className="space-y-2">
          <Input
            placeholder="Enter project details"
            value={project}
            onChange={(e) => onInputChange('project', e.target.value)}
          />
        </div>
      </div>
    </Card>
  );
};
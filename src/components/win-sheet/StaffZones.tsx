import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface StaffZonesProps {
  associates: string[];
  zones: string[];
  onAssociateChange: (index: number, value: string) => void;
  onZoneChange: (index: number, value: string) => void;
  onAdd: () => void;
}

export const StaffZones = ({
  associates,
  zones,
  onAssociateChange,
  onZoneChange,
  onAdd
}: StaffZonesProps) => {
  return (
    <div>
      <h3 className="text-lg font-medium mb-4">Staff Working Zones</h3>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h4 className="text-sm font-medium mb-2">Associates</h4>
          <div className="space-y-2">
            {associates.map((associate, index) => (
              <Input
                key={`associate-${index}`}
                placeholder={`Associate ${index + 1}`}
                value={associate}
                onChange={(e) => onAssociateChange(index, e.target.value)}
              />
            ))}
          </div>
        </div>
        <div>
          <h4 className="text-sm font-medium mb-2">Zone</h4>
          <div className="space-y-2">
            {zones.map((zone, index) => (
              <Input
                key={`zone-${index}`}
                placeholder={`Zone ${index + 1}`}
                value={zone}
                onChange={(e) => onZoneChange(index, e.target.value)}
              />
            ))}
          </div>
        </div>
      </div>
      <div className="mt-4">
        <Button 
          type="button" 
          onClick={onAdd}
          variant="outline"
          className="w-full"
        >
          Add Associate & Zone
        </Button>
      </div>
    </div>
  );
};
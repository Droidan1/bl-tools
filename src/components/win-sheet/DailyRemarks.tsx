import { TextSection } from './TextSection';
import { WeatherSelector } from './WeatherSelector';
import { Input } from "@/components/ui/input";

interface DailyRemarksProps {
  salesGoal: string;
  weather: string;
  operationalIssues: string;
  customerFeedback: string;
  staffingDetails: string;
  safetyObservations: string;
  otherRemarks: string;
  onInputChange: (field: string, value: string) => void;
}

export const DailyRemarks = ({
  salesGoal,
  weather,
  operationalIssues,
  customerFeedback,
  staffingDetails,
  safetyObservations,
  otherRemarks,
  onInputChange,
}: DailyRemarksProps) => {
  return (
    <form className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="salesGoal" className="text-sm font-medium">
            Sales Goal
          </label>
          <Input 
            id="salesGoal" 
            placeholder="Enter sales goal"
            value={salesGoal}
            onChange={(e) => onInputChange('salesGoal', e.target.value)}
          />
        </div>
        <WeatherSelector 
          value={weather}
          onChange={(value) => onInputChange('weather', value)}
        />
      </div>

      <div className="space-y-6">
        <TextSection
          label="Operational Issues"
          value={operationalIssues}
          onChange={(value) => onInputChange('operationalIssues', value)}
          placeholder="Enter operational issues"
        />

        <TextSection
          label="Customer Feedback"
          value={customerFeedback}
          onChange={(value) => onInputChange('customerFeedback', value)}
          placeholder="Enter customer feedback"
        />

        <TextSection
          label="Staffing Details"
          value={staffingDetails}
          onChange={(value) => onInputChange('staffingDetails', value)}
          placeholder="Enter staffing details"
        />

        <TextSection
          label="Safety Observations"
          value={safetyObservations}
          onChange={(value) => onInputChange('safetyObservations', value)}
          placeholder="Enter safety observations"
        />

        <TextSection
          label="Other Remarks"
          value={otherRemarks}
          onChange={(value) => onInputChange('otherRemarks', value)}
          placeholder="Enter other remarks"
        />
      </div>
    </form>
  );
};
import { PageHeader } from '@/components/ui/page-header';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';

const WinSheet = () => {
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
              <Input id="salesGoal" placeholder="Enter sales goal" />
            </div>
            <div className="space-y-2">
              <label htmlFor="weather" className="text-sm font-medium">
                Weather
              </label>
              <Input id="weather" placeholder="Enter weather conditions" />
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
                  {[1, 2, 3, 4, 5].map((index) => (
                    <Input
                      key={`associate-${index}`}
                      placeholder={`Associate ${index}`}
                    />
                  ))}
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium mb-2">Zone</h4>
                <div className="space-y-2">
                  {[1, 2, 3, 4, 5].map((index) => (
                    <Input
                      key={`zone-${index}`}
                      placeholder={`Zone ${index}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </Card>
        </form>
      </div>
    </div>
  );
};

export default WinSheet;
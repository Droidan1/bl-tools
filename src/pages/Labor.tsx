import { PageHeader } from '@/components/ui/page-header';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { useToast } from "@/components/ui/use-toast";

const Labor = () => {
  const [weeklyBudget, setWeeklyBudget] = useState('');
  const [currentSales, setCurrentSales] = useState('');
  const [associates, setAssociates] = useState('');
  const [laborPercentage, setLaborPercentage] = useState<number | null>(null);
  const { toast } = useToast();

  const calculateLabor = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!weeklyBudget || !currentSales || !associates) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields to calculate labor percentage.",
        variant: "destructive",
      });
      return;
    }

    // Simple calculation for now - can be enhanced later
    const dailyBudget = parseFloat(weeklyBudget) / 7;
    const currentPercentage = (parseFloat(currentSales) / dailyBudget) * 100;
    setLaborPercentage(parseFloat(currentPercentage.toFixed(2)));
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="container px-4 py-2 mx-auto max-w-7xl">
        <PageHeader title="Labor Calculator" />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <Card className="p-6">
            <form onSubmit={calculateLabor} className="space-y-4">
              <div>
                <label htmlFor="weeklyBudget" className="block text-sm font-medium text-gray-700 mb-1">
                  Weekly Budget ($)
                </label>
                <Input
                  id="weeklyBudget"
                  type="number"
                  value={weeklyBudget}
                  onChange={(e) => setWeeklyBudget(e.target.value)}
                  placeholder="Enter weekly budget"
                  className="w-full"
                />
              </div>

              <div>
                <label htmlFor="currentSales" className="block text-sm font-medium text-gray-700 mb-1">
                  Current Day Sales ($)
                </label>
                <Input
                  id="currentSales"
                  type="number"
                  value={currentSales}
                  onChange={(e) => setCurrentSales(e.target.value)}
                  placeholder="Enter current sales"
                  className="w-full"
                />
              </div>

              <div>
                <label htmlFor="associates" className="block text-sm font-medium text-gray-700 mb-1">
                  Number of Associates
                </label>
                <Input
                  id="associates"
                  type="number"
                  value={associates}
                  onChange={(e) => setAssociates(e.target.value)}
                  placeholder="Enter number of associates"
                  className="w-full"
                />
              </div>

              <Button type="submit" className="w-full">
                Calculate Labor
              </Button>
            </form>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Results & Recommendations</h2>
            
            {laborPercentage !== null && (
              <div className="mb-6">
                <p className="text-lg">
                  Current Labor Percentage: <span className="font-bold">{laborPercentage}%</span>
                </p>
              </div>
            )}

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-md font-medium mb-2">AI Recommendations</h3>
              <p className="text-gray-600">
                AI recommendations will appear here after analysis of your labor metrics.
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Labor;
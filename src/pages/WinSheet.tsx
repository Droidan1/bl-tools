
import { PageHeader } from '@/components/ui/page-header';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { toast } from "sonner";
import { DailyRemarks } from '@/components/win-sheet/DailyRemarks';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { createJournalPdf, printHtml } from '@/utils/pdfUtils';

const WinSheet = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [formData, setFormData] = useState({
    salesGoal: '',
    weather: 'sunny',
    operationalIssues: '',
    customerFeedback: '',
    staffingDetails: '',
    safetyObservations: '',
    otherRemarks: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      setCurrentDate(date);
    }
  };

  const exportToPdf = () => {
    try {
      const { printContent } = createJournalPdf(currentDate, formData);
      printHtml(printContent);
      toast.success("Journal exported successfully for printing!");
    } catch (error) {
      console.error('Export failed:', error);
      toast.error("Failed to export Journal");
    }
  };

  return <div className="min-h-screen bg-white">
      <div className="container px-4 py-2 mx-auto max-w-7xl">
        <div className="flex justify-between items-center mb-4">
          <PageHeader title="Journal" />
        </div>
        
        <div className="p-4 mb-6 bg-green-50 px-[5px] py-[5px] rounded-lg">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <h2 className="text-xl font-semibold mb-2 md:mb-0">Today's Journal</h2>
            
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
                  {format(currentDate, 'MMMM dd, yyyy')}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <Calendar
                  mode="single"
                  selected={currentDate}
                  onSelect={handleDateChange}
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
        
        <DailyRemarks {...formData} onInputChange={handleInputChange} />

        <div className="flex justify-end mt-6">
          <Button type="button" onClick={exportToPdf} className="bg-primary hover:bg-primary/90">
            Export
          </Button>
        </div>
      </div>
    </div>;
};

export default WinSheet;

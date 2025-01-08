import { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { FormField } from '@/components/inventory/FormField';
import InventoryPage from './InventoryPage';

const Index = () => {
  const [bolNumber, setBolNumber] = useState('');
  const [activeTab, setActiveTab] = useState('home');

  return (
    <div className="min-h-screen bg-white">
      <div className="container px-4 py-2 mx-auto max-w-7xl flex flex-col items-center">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 bg-[#2a8636] p-4 sm:p-6 rounded-xl shadow-sm w-full">
          <h1 className="text-2xl sm:text-4xl font-bold text-white mb-4 sm:mb-0 font-['Luckiest_Guy']">
            Inventory Receiver
          </h1>
          <img 
            src="/lovable-uploads/c590340d-6c9e-4341-8686-91ba96211494.png" 
            alt="Header Logo" 
            className="h-24 sm:h-32 md:h-48 w-auto"
          />
        </div>

        <Tabs defaultValue="home" className="w-full mb-8" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="home">Home</TabsTrigger>
            <TabsTrigger value="inventory">Inventory</TabsTrigger>
          </TabsList>

          <div className="w-full max-w-md mx-auto mb-8">
            <div className="bg-gradient-to-br from-[#2a8636] to-[#3BB54A] p-4 sm:p-6 rounded-xl shadow-sm backdrop-blur-sm border border-white/20">
              <FormField
                id="bolNumber"
                label="BOL #"
                value={bolNumber}
                onChange={setBolNumber}
                placeholder="Enter BOL number"
                required
                className="bg-white/95 rounded-lg border-0 shadow-sm"
              />
            </div>
          </div>
          
          <TabsContent value="home" className="w-full">
            <InventoryPage bolNumber={bolNumber} />
          </TabsContent>
          
          <TabsContent value="inventory" className="w-full">
            <InventoryPage bolNumber={bolNumber} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
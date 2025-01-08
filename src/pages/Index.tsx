import { useState } from 'react';
import { FormField } from '@/components/inventory/FormField';
import InventoryPage from './InventoryPage';
import { AnimatedTabs } from '@/components/ui/animated-tabs';

const Index = () => {
  const [bolNumber, setBolNumber] = useState('');
  const [activeTab, setActiveTab] = useState('home');

  const tabs = [
    { id: 'home', label: 'Home' },
    { id: 'inventory', label: 'Inventory' },
  ];

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

        <div className="w-full mb-8 bg-[#2a8636] p-4 rounded-xl">
          <AnimatedTabs 
            tabs={tabs}
            defaultTab={activeTab}
            onChange={setActiveTab}
          />
        </div>

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
        
        {activeTab === 'home' && (
          <div className="w-full">
            <InventoryPage bolNumber={bolNumber} />
          </div>
        )}
        
        {activeTab === 'inventory' && (
          <div className="w-full">
            <InventoryPage bolNumber={bolNumber} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
import { useState } from 'react';
import { FormField } from '@/components/inventory/FormField';
import { InventoryManager } from '@/components/inventory/InventoryManager';

const Index = () => {
  const [bolNumber, setBolNumber] = useState('');

  return (
    <div className="min-h-screen bg-[#F1F0FB]">
      <div className="container px-4 py-2 mx-auto max-w-7xl">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 bg-white p-6 rounded-xl shadow-sm border border-[#C8C8C9]/10">
          <h1 className="text-2xl sm:text-4xl font-bold text-[#222222] mb-2 sm:mb-0 font-['Luckiest_Guy']">
            Inventory Receiver
          </h1>
          <img 
            src="/lovable-uploads/c590340d-6c9e-4341-8686-91ba96211494.png" 
            alt="Header Logo" 
            className="h-24 sm:h-32 w-auto"
          />
        </div>

        <div className="w-full max-w-md mx-auto mb-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-[#C8C8C9]/10">
            <FormField
              id="bolNumber"
              label="BOL #"
              value={bolNumber}
              onChange={setBolNumber}
              placeholder="Enter BOL number"
              required
              className="bg-white"
            />
          </div>
        </div>
        
        <InventoryManager bolNumber={bolNumber} />
      </div>
    </div>
  );
};

export default Index;
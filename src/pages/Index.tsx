import { useState } from 'react';
import { FormField } from '@/components/inventory/FormField';
import { InventoryManager } from '@/components/inventory/InventoryManager';

const Index = () => {
  const [bolNumber, setBolNumber] = useState('');

  return (
    <div className="min-h-screen bg-white">
      <div className="container px-4 py-2 mx-auto max-w-7xl">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 bg-[#2a8636] p-1 rounded-lg">
          <h1 className="text-2xl sm:text-4xl font-bold text-white mb-2 sm:mb-0 font-['Luckiest_Guy']">
            Inventory Receiver
          </h1>
          <img 
            src="/lovable-uploads/c590340d-6c9e-4341-8686-91ba96211494.png" 
            alt="Header Logo" 
            className="h-32 sm:h-48 w-auto"
          />
        </div>

        <div className="w-full max-w-md mx-auto mb-6">
          <div className="bg-gradient-to-br from-[#2a8636] to-[#3BB54A] p-6 rounded-xl shadow-custom backdrop-blur-sm border border-white/20">
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
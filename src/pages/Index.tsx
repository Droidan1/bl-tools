import { useState } from 'react';
import { FormField } from '@/components/inventory/FormField';
import { InventoryManager } from '@/components/inventory/InventoryManager';

const Index = () => {
  const [bolNumber, setBolNumber] = useState('');

  return (
    <div className="min-h-screen bg-background">
      <div className="container px-4 py-8 mx-auto max-w-7xl">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 bg-card p-6 rounded-lg border shadow-sm">
          <h1 className="text-2xl sm:text-4xl font-bold text-foreground mb-2 sm:mb-0 font-['Luckiest_Guy']">
            Inventory Receiver
          </h1>
          <img 
            src="/lovable-uploads/c590340d-6c9e-4341-8686-91ba96211494.png" 
            alt="Header Logo" 
            className="h-20 sm:h-28 w-auto"
          />
        </div>

        <div className="w-full max-w-md mx-auto mb-8">
          <div className="bg-card p-6 rounded-lg border shadow-sm">
            <FormField
              id="bolNumber"
              label="BOL #"
              value={bolNumber}
              onChange={setBolNumber}
              placeholder="Enter BOL number"
              required
              className="bg-background"
            />
          </div>
        </div>
        
        <InventoryManager bolNumber={bolNumber} />
      </div>
    </div>
  );
};

export default Index;
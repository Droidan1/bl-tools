
import React from 'react';

export const MOSHeader = () => {
  return (
    <div className="flex flex-col items-center mb-6 bg-[#2a8636] p-4 rounded-xl shadow-sm w-full">
      <h1 className="text-2xl font-bold text-white mb-2 font-['Luckiest_Guy'] text-center">
        MOS Scanner
      </h1>
      <img 
        src="/lovable-uploads/c590340d-6c9e-4341-8686-91ba96211494.png" 
        alt="Header Logo" 
        className="h-20 w-auto" 
      />
    </div>
  );
};

import React from 'react';
import { FormField } from './FormField';

interface FormHeaderProps {
  bolNumber: string;
  setBolNumber: (value: string) => void;
  storeLocation: string;
  setStoreLocation: (value: string) => void;
}

export const FormHeader = ({ 
  bolNumber, 
  setBolNumber,
  storeLocation,
  setStoreLocation 
}: FormHeaderProps) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
    <FormField
      id="bolNumber"
      label="BOL #"
      value={bolNumber}
      onChange={setBolNumber}
      placeholder="Enter BOL number"
      required
    />
    <FormField
      id="storeLocation"
      label="Store Location"
      value={storeLocation}
      onChange={setStoreLocation}
      placeholder="Enter store location"
      required
    />
  </div>
);
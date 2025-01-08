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
  <div className="flex flex-col gap-4">
    <FormField
      id="storeLocation"
      label="Store Location"
      value={storeLocation}
      onChange={setStoreLocation}
      placeholder="Enter store location"
      required
    />
    <FormField
      id="bolNumber"
      label="BOL #"
      value={bolNumber}
      onChange={setBolNumber}
      placeholder="Enter BOL number"
      required
    />
  </div>
);
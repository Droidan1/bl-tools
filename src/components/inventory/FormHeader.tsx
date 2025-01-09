import React from 'react';
import { FormField } from './FormField';

interface FormHeaderProps {
  storeLocation: string;
  setStoreLocation: (value: string) => void;
}

export const FormHeader = ({ 
  storeLocation,
  setStoreLocation 
}: FormHeaderProps) => (
  <div className="flex flex-col gap-4 w-full">
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
import React from 'react';
import { FormField } from './FormField';

interface FormHeaderProps {
  bolNumber: string;
  setBolNumber: (value: string) => void;
}

export const FormHeader = ({ bolNumber, setBolNumber }: FormHeaderProps) => (
  <FormField
    id="bolNumber"
    label="BOL #"
    value={bolNumber}
    onChange={setBolNumber}
    placeholder="Enter BOL number"
    required
  />
);
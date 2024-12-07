import React from 'react';
import { Button } from "@/components/ui/button";
import { formStyles } from './formStyles';

interface SubmitButtonProps {
  isEditing: boolean;
}

export const SubmitButton = ({ isEditing }: SubmitButtonProps) => (
  <div className={formStyles.buttonContainer}>
    <Button type="submit" className="w-full bg-black hover:bg-black/90">
      {isEditing ? 'Update Item' : 'Add Item'}
    </Button>
  </div>
);
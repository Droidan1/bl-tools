import React from 'react';
import { Button } from "@/components/ui/button";
import { formStyles } from './formStyles';

interface SubmitButtonProps {
  isEditing: boolean;
  isValid: boolean;
}

export const SubmitButton = ({ isEditing, isValid }: SubmitButtonProps) => (
  <div className={formStyles.buttonContainer}>
    <Button 
      type="submit" 
      className="w-full bg-black hover:bg-black/90 disabled:opacity-50"
      disabled={!isValid}
    >
      {isEditing ? 'Update Item' : 'Add Tag'}
    </Button>
  </div>
);
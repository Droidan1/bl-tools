import React from 'react';
import { Button } from "@/components/ui/button";
import { formStyles } from './formStyles';

interface SubmitButtonProps {
  isEditing: boolean;
  isValid: boolean;
}

export const SubmitButton = ({ isEditing, isValid }: SubmitButtonProps) => {
  console.log('SubmitButton props:', { isEditing, isValid });
  
  return (
    <div className={formStyles.buttonContainer}>
      <Button 
        type="submit" 
        className={`w-full ${isValid ? 'bg-black hover:bg-black/90' : 'bg-gray-500'}`}
        disabled={!isValid}
      >
        {isEditing ? 'Update Item' : 'Add Tag'}
      </Button>
    </div>
  );
};
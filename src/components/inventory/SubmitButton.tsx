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
      className="w-full bg-black hover:bg-black/90 disabled:bg-gray-500 disabled:cursor-not-allowed"
      disabled={!isValid}
    >
      {isEditing ? 'Update Item' : 'Add Tag'}
    </Button>
  </div>
);
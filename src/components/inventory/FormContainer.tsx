import React from 'react';
import { formStyles } from './formStyles';

interface FormContainerProps {
  children: React.ReactNode;
  onSubmit: (e: React.FormEvent) => void;
}

export const FormContainer = ({ children, onSubmit }: FormContainerProps) => (
  <div className="w-full flex justify-center px-4 sm:px-0">
    <form onSubmit={onSubmit} className={formStyles.container}>
      {children}
    </form>
  </div>
);
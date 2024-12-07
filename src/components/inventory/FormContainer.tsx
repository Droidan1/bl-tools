import React from 'react';
import { formStyles } from './formStyles';

interface FormContainerProps {
  children: React.ReactNode;
  onSubmit: (e: React.FormEvent) => void;
}

export const FormContainer = ({ children, onSubmit }: FormContainerProps) => (
  <form onSubmit={onSubmit} className={formStyles.container}>
    {children}
  </form>
);
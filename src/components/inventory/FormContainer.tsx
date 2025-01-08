import React from 'react';
import { formStyles } from './formStyles';

interface FormContainerProps {
  children: React.ReactNode;
  onSubmit: (e: React.FormEvent) => void;
}

export const FormContainer = ({ children, onSubmit }: FormContainerProps) => (
  <form 
    onSubmit={onSubmit} 
    className="space-y-4 bg-gradient-to-br from-[#2a8636] to-[#3BB54A] p-4 sm:p-6 rounded-xl shadow-floating backdrop-blur-sm w-full max-w-md mx-auto border border-white/20"
  >
    <div className="flex flex-col items-center w-full space-y-4">
      {children}
    </div>
  </form>
);
import { Input } from "@/components/ui/input";

interface FormFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  required?: boolean;
  type?: string;
  className?: string;
}

export const FormField = ({ 
  id, 
  label, 
  value, 
  onChange, 
  placeholder, 
  required = false,
  type = "text",
  className = "w-full"
}: FormFieldProps) => (
  <div className="space-y-2">
    <label htmlFor={id} className="text-sm font-medium text-white">
      {label} {required && '*'}
    </label>
    <Input
      id={id}
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={className}
      required={required}
    />
  </div>
);
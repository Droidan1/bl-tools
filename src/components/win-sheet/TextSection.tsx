import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";

interface TextSectionProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}

export const TextSection = ({
  label,
  value,
  onChange,
  placeholder
}: TextSectionProps) => {
  return (
    <Card className="p-4 space-y-2">
      <label className="text-sm font-medium">
        {label}
      </label>
      <Textarea
        placeholder={placeholder}
        className="min-h-[100px]"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </Card>
  );
};
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Sun, CloudRain, CloudSnow, CloudSun, Cloud } from "lucide-react";

interface WeatherSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

export const WeatherSelector = ({ value, onChange }: WeatherSelectorProps) => {
  const weatherOptions = [
    { value: 'sunny', icon: Sun, label: 'Sunny' },
    { value: 'rain', icon: CloudRain, label: 'Rain' },
    { value: 'snow', icon: CloudSnow, label: 'Snow' },
    { value: 'cold', icon: Cloud, label: 'Cold' },
    { value: 'hot', icon: CloudSun, label: 'Hot' }
  ];

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">
        Weather
      </label>
      <RadioGroup
        value={value}
        onValueChange={onChange}
        className="flex flex-wrap gap-4"
      >
        {weatherOptions.map(({ value, icon: Icon, label }) => (
          <div key={value} className="flex flex-col items-center gap-1">
            <div className="relative">
              <RadioGroupItem
                value={value}
                id={value}
                className="peer sr-only"
              />
              <label
                htmlFor={value}
                className="flex flex-col items-center justify-center w-16 h-16 rounded-lg border-2 border-muted peer-data-[state=checked]:border-primary peer-data-[state=checked]:text-primary cursor-pointer transition-colors"
              >
                <Icon className="w-8 h-8" />
                <span className="text-xs mt-1">{label}</span>
              </label>
            </div>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
};
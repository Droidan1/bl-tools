import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Minus } from "lucide-react";
interface QuantityInputProps {
  quantity: number;
  onIncrement: () => void;
  onDecrement: () => void;
  onChange: (value: number) => void;
}
export const QuantityInput = ({
  quantity,
  onIncrement,
  onDecrement,
  onChange
}: QuantityInputProps) => <div className="space-y-2">
    <label htmlFor="quantity" className="text-sm font-medium text-white-700">
      Quantity *
    </label>
    <div className="flex items-center gap-2">
      <Button type="button" variant="outline" size="icon" onClick={onDecrement} className="h-10 w-10 shrink-0">
        <Minus className="h-4 w-4" />
      </Button>
      <Input id="quantity" type="number" min="1" value={quantity} onChange={e => onChange(Math.max(1, parseInt(e.target.value) || 1))} className="w-20 text-center" required />
      <Button type="button" variant="outline" size="icon" onClick={onIncrement} className="h-10 w-10 shrink-0">
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  </div>;
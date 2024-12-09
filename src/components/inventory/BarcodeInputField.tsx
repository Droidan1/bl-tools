import { Button } from "@/components/ui/button";
import { Camera } from "lucide-react";
import { formStyles } from './formStyles';

interface BarcodeInputFieldProps {
  barcode: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCameraClick: () => void;
  onOCRClick: () => void;
  inputRef: React.RefObject<HTMLInputElement>;
}

export const BarcodeInputField = ({
  barcode,
  onChange,
  onCameraClick,
  onOCRClick,
  inputRef
}: BarcodeInputFieldProps) => (
  <div className={formStyles.inputContainer}>
    <label htmlFor="barcode" className={formStyles.label}>
      Scan Barcode *
    </label>
    <div className={formStyles.scannerContainer}>
      <input
        id="barcode"
        ref={inputRef}
        value={barcode}
        onChange={onChange}
        placeholder="Scan or enter barcode"
        className={formStyles.input}
        required
      />
      <Button
        type="button"
        variant="outline"
        size="icon"
        onClick={onCameraClick}
        className="shrink-0"
      >
        <Camera className="h-4 w-4" />
      </Button>
    </div>
  </div>
);
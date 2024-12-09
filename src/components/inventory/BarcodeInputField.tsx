import { formStyles } from './formStyles';

interface BarcodeInputFieldProps {
  barcode: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  inputRef: React.RefObject<HTMLInputElement>;
}

export const BarcodeInputField = ({
  barcode,
  onChange,
  inputRef
}: BarcodeInputFieldProps) => (
  <div className={formStyles.inputContainer}>
    <label htmlFor="barcode" className={formStyles.label}>
      Enter Barcode *
    </label>
    <div className={formStyles.scannerContainer}>
      <input
        id="barcode"
        ref={inputRef}
        value={barcode}
        onChange={onChange}
        placeholder="Enter barcode"
        className={formStyles.input}
        required
      />
    </div>
  </div>
);
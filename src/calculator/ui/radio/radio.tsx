import { forwardRef, type InputHTMLAttributes, type ReactNode } from "react";
import "./radio.scss";

export interface RadioOption {
  value: string | number;
  label: string;
}

interface RadioProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "type" | "onChange"
> {
  label?: string;
  options: RadioOption[];
  value?: string | number;
  onChange?: (value: string | number) => void;
  name: string;
}

const Radio = forwardRef<HTMLInputElement, RadioProps>(
  ({ label, options, value, onChange, name, className, ...restProps }, ref) => {
    return (
      <div className={`radio-group ${className || ""}`}>
        {label && <label className="radio-group-label">{label}</label>}
        <div className="radio-options">
          {options.map((option) => {
            const isSelected = value === option.value;
            return (
              <label key={option.value} className="radio-option">
                <input
                  ref={ref}
                  type="radio"
                  name={name}
                  value={option.value}
                  checked={isSelected}
                  onChange={(e) => {
                    onChange?.(e.target.value);
                  }}
                  {...restProps}
                />
                <span
                  className={`radio-button ${isSelected ? "selected" : ""}`}
                />
                <span className="radio-label">{option.label}</span>
              </label>
            );
          })}
        </div>
      </div>
    );
  },
);

Radio.displayName = "Radio";

export default Radio;

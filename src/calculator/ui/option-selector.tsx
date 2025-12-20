import { type ReactNode } from "react";
import "./option-selector.scss";

export interface OptionSelectorOption {
  value: string | number;
  label: string | ReactNode;
}

interface OptionSelectorProps {
  options: OptionSelectorOption[];
  value?: string | number;
  onChange?: (value: string | number) => void;
  name: string;
  className?: string;
}

const OptionSelector = ({ options, value, onChange, name, className }: OptionSelectorProps) => {
  return (
    <div className={`option-selector ${className || ""}`}>
      {options.map((option) => {
        const isSelected = value === option.value;
        return (
          <label key={option.value} className={`option-selector-item ${isSelected ? "selected" : ""}`}>
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={isSelected}
              onChange={(e) => {
                onChange?.(e.target.value);
              }}
            />
            <span className="option-selector-label">{option.label}</span>
          </label>
        );
      })}
    </div>
  );
};

export default OptionSelector;

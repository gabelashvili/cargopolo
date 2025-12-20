import { forwardRef, type InputHTMLAttributes, type ReactNode, type Ref } from "react";
import { NumericFormat, type NumericFormatProps } from "react-number-format";
import "./input.scss";

type BaseInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "onChange" | "value" | "type"> & {
  value?: string | number;
  onChange?: (value: number | string) => void;
  label?: string;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  required?: boolean;
  rootClassName?: string;
};

export type InputProps = BaseInputProps &
  (
    | {
        type?: Exclude<InputHTMLAttributes<HTMLInputElement>["type"], "number">;
      }
    | ({ type: "number" } & Omit<NumericFormatProps, "onValueChange" | "customInput" | "value" | "type">)
  );

const InputWrapper = forwardRef<
  HTMLInputElement,
  Omit<InputProps, "onChange" | "label"> & {
    onChange?: React.ChangeEventHandler<HTMLInputElement>;
  }
>((props, ref) => {
  return <input ref={ref} {...props} />;
});

const Input = forwardRef<HTMLInputElement, InputProps>((props, ref) => {
  const { placeholder, startIcon, endIcon, required, rootClassName, ...restProps } = props;
  const hasValue = props.value !== undefined && props.value !== "" && props.value !== null;
  const hasStartIcon = !!startIcon;
  const hasEndIcon = !!endIcon;

  const wrapperClasses = [
    "input-wrapper",
    hasValue ? "has-value" : "",
    hasStartIcon ? "has-start-icon" : "",
    hasEndIcon ? "has-end-icon" : "",
  ]
    .filter(Boolean)
    .join(" ");

  const rootClasses = ["input-root", rootClassName].filter(Boolean).join(" ");

  if (props.type === "number") {
    const { onChange, ...numericProps } = restProps;
    return (
      <div className={rootClasses}>
        <div className={wrapperClasses}>
          {startIcon && <span className="input-icon input-icon-start">{startIcon}</span>}
          <NumericFormat
            {...(numericProps as NumericFormatProps)}
            getInputRef={ref as Ref<HTMLInputElement>}
            onValueChange={(values) => {
              onChange?.(values.value);
            }}
            customInput={InputWrapper}
            placeholder=" "
          />
          {placeholder && (
            <label className="input-placeholder">
              {placeholder}
              {required && <span className="input-required">*</span>}
            </label>
          )}
          {endIcon && <span className="input-icon input-icon-end">{endIcon}</span>}
        </div>
      </div>
    );
  }

  const { onChange, ...inputProps } = restProps;
  return (
    <div className={rootClasses}>
      <div className={wrapperClasses}>
        {startIcon && <span className="input-icon input-icon-start">{startIcon}</span>}
        <InputWrapper ref={ref} {...inputProps} onChange={(e) => onChange?.(e.target.value)} placeholder=" " />
        {placeholder && (
          <label className="input-placeholder">
            {placeholder}
            {required && <span className="input-required">*</span>}
          </label>
        )}
        {endIcon && <span className="input-icon input-icon-end">{endIcon}</span>}
      </div>
    </div>
  );
});

export default Input;

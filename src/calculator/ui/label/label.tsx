import { type ReactNode } from "react";
import "./label.scss";

interface LabelProps {
  children: ReactNode;
  className?: string;
  htmlFor?: string;
}

const Label = ({ children, className, htmlFor }: LabelProps) => {
  if (!children) return null;

  return (
    <label className={`ui-label ${className || ""}`} htmlFor={htmlFor}>
      {children}
    </label>
  );
};

export default Label;

import "./loading.scss";

interface IconProps {
  size?: number;
  color?: string;
}

export const LoadingIcon = ({ size = 20, color = "currentColor" }: IconProps) => (
  <svg
    className="loading-icon"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
    <path d="M12 2 A10 10 0 0 1 22 12" strokeLinecap="round" strokeDasharray="15.7 47.1" />
  </svg>
);

import "./price-section.scss";

interface PriceSectionProps {
  price: string | number;
  label?: string;
  className?: string;
}

const PriceSection = ({
  price,
  label = "Price:",
  className,
}: PriceSectionProps) => {
  return (
    <div className={`price-section ${className || ""}`}>
      <div className="price-section-content">
        <span className="price-section-label">{label}</span>
        <span className="price-section-value">{price}</span>
      </div>
    </div>
  );
};

export default PriceSection;

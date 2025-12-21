import { LoadingIcon } from "../ui/loading/loading";
import "./price-section.scss";

interface PriceSectionProps {
  price: string | number;
  label?: string;
  className?: string;
  currency?: string;
  loading?: boolean;
}

const formattedCurrency = (currency: string, value: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: currency }).format(value);

const PriceSection = ({ price, label = "Price:", className, currency = "USD", loading = false }: PriceSectionProps) => {
  return (
    <div className={`price-section ${className || ""}`}>
      <div className="price-section-content">
        <span className="price-section-label">{label}</span>
        <span className="price-section-value">
          {loading ? <LoadingIcon /> : formattedCurrency(currency, Number(price))}
        </span>
      </div>
    </div>
  );
};

export default PriceSection;

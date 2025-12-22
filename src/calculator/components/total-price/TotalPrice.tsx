import "./total-price.scss";
import type { UserData } from "../../services/user/user";

const formattedCurrency = (currency: string, value: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: currency }).format(value);

const TotalPrice = ({
  totalPrice,
  customsPrice,
  user,
}: {
  totalPrice: number;
  customsPrice: number;
  user: UserData | null;
}) => {
  console.log(user);
  return (
    <div className="calculator-total-price">
      {user?.country?.toLowerCase() !== "ukraine" ? (
        <p>
          Total Price: <span>{formattedCurrency("USD", totalPrice)}</span>
        </p>
      ) : (
        <>
          <div className="calculator-total-price-currencies">
            <p>
              Dollar: <span>{formattedCurrency("USD", totalPrice)}</span>
            </p>
            <p>|</p>
            <p>
              Euro: <span>{formattedCurrency("EUR", customsPrice)}</span>
            </p>
          </div>
        </>
      )}
    </div>
  );
};

export default TotalPrice;

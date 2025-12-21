import { type UseFormSetValue } from "react-hook-form";
import type { Auction } from "../../../types/common";
import Label from "../../ui/label/label";
import Input from "../../ui/input/input";
import OptionSelector from "../../ui/option-selector/option-selector";
import "./auctions.scss";
import { useEffect, useRef } from "react";
import type { FormData } from "../../schema";
import PriceSection from "../PriceSection";
import { useAuctionCalculation } from "../../services/auction/auction-queries";

interface AuctionsProps {
  auction: Auction;
  values: FormData["auction"];
  setValue: UseFormSetValue<FormData>;
}

export default function Auction({ values, setValue }: AuctionsProps) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { data, isLoading } = useAuctionCalculation({
    cost: values.cost,
    feeType: values.feeType,
    auction: values.auction,
  });

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  return (
    <section className="calculator-auctions">
      <Label>Auction</Label>
      <Input
        placeholder="Lot price"
        required
        type="number"
        prefix="$"
        decimalSeparator="."
        thousandSeparator=","
        decimalScale={2}
        onChange={(v) => {
          if (timerRef.current) {
            clearTimeout(timerRef.current);
          }
          timerRef.current = setTimeout(() => {
            setValue("auction.cost", Number(v));
          }, 500);
        }}
      />
      <div>
        <OptionSelector
          name="feeType"
          options={[
            { value: "low", label: "Low" },
            { value: "high", label: "High" },
          ]}
          value={values.feeType}
          onChange={(v) => setValue("auction.feeType", v as "low" | "high")}
        />
      </div>
      <PriceSection price={data?.totalCost || 0} label="Price:" loading={isLoading} />
    </section>
  );
}

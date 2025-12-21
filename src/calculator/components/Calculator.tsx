import { useState, useEffect } from "react";
import type { Auction, LotDetails } from "../../types/common";
import "./calculator.scss";
import Header from "./header/Header";
import { parseIaai } from "../../parsers/iaai";
import { parseCopart } from "../../parsers/copart";
import Auctions from "./auction/Auctions";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { schema, type FormData } from "../schema";
import Transportation from "./transportation/Transportation";

const Calculator = ({ auction }: { auction: Auction }) => {
  const [lotDetails, setLotDetails] = useState<LotDetails | null>(null);
  const { watch, setValue } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      auction: {
        cost: 0,
        feeType: "low",
        auction,
      },
      transportation: {
        containerType: "4 Vehicles",
        shippingLocationId: NaN,
        exitPortId: NaN,
        deliveryPortId: NaN,
        insuranceType: "warehouse",
        vehicleType: "",
      },
    },
  });

  // Listen for lot details from content script
  useEffect(() => {
    if (auction === "iaai") {
      const res = parseIaai(document.documentElement.outerHTML);
      if (res) {
        setLotDetails(res);
      }
    }
    if (auction === "copart") {
      const res = parseCopart(document.documentElement.outerHTML);
      if (res) {
        setLotDetails(res);
      }
    }
  }, [auction, lotDetails]);

  return (
    <div className="calculator">
      <Header />
      <div className="calculator-content">
        <Auctions auction={auction} values={watch("auction")} setValue={setValue} />
        <Transportation values={watch("transportation")} setValue={setValue} auction={auction} />
      </div>
    </div>
  );
};

export default Calculator;

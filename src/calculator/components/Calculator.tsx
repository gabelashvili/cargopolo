import { useState, useEffect, useMemo } from "react";
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
import { useGroundFee } from "../services/ground-fee/ground-fee-queries";
import { useUser } from "../services/user/user-queries";
import { useAuctionCalculation } from "../services/auction/auction-queries";
import { useTitles } from "../services/titles/titles-queries";

const Calculator = ({ auction }: { auction: Auction }) => {
  const [lotDetails, setLotDetails] = useState<LotDetails | null>(null);
  const user = useUser("p9fYUDsqcgr6OcVXBZUY23prmhOcul1R3sW2gHYroOKlKb7qnGn8OAYA3Jnu");
  const [titleQuery, setTitleQuery] = useState<string>("");
  const titles = useTitles(titleQuery);

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

  const groundFee = useGroundFee({
    consolidationType: watch("transportation.containerType"),
    vehicleType: watch("transportation.vehicleType"),
    exitPortId: watch("transportation.exitPortId"),
    destinationPortId: watch("transportation.deliveryPortId"),
    locationId: watch("transportation.shippingLocationId"),
  });

  const auctionFee = useAuctionCalculation({
    cost: watch("auction.cost"),
    feeType: watch("auction.feeType"),
    auction: watch("auction.auction"),
  });

  const totalPrice = useMemo(() => {
    const auctionPrice = auctionFee.data?.totalCost || 0;
    const groundFeePrice = groundFee.data?.price || 0;
    let insurancePrice = 0;
    if (watch("transportation.insuranceType") !== "basic" && user.data) {
      const percent =
        watch("transportation.insuranceType") === "auction"
          ? user.data.insuranceByAuctionFee
          : user.data?.insuranceByWarehouseFee;
      insurancePrice = (auctionPrice * percent) / 100;
    }
    const titlePrice = titles.data?.find((title) => title.id === watch("transportation.titleDocumentId"))?.price || 0;

    const sum = auctionPrice + groundFeePrice + insurancePrice + titlePrice;
    return sum;
  }, [
    auctionFee.data?.totalCost,
    groundFee.data?.price,
    titles.data,
    user.data,
    watch("transportation.insuranceType"),
    watch("transportation.titleDocumentId"),
  ]);

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
        <Auctions auction={auction} values={watch("auction")} setValue={setValue} auctionFee={auctionFee} />
        <Transportation
          user={user}
          values={watch("transportation")}
          setValue={setValue}
          auction={auction}
          groundFee={groundFee}
          auctionFee={auctionFee}
          titles={titles}
          setTitleQuery={setTitleQuery}
        />
      </div>
    </div>
  );
};

export default Calculator;

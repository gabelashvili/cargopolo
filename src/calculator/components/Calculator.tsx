import { useState, useEffect, useRef, useMemo } from "react";
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
import { useLocations } from "../services/locations/locations-queries";
import Expedition from "./expedition/Expedition";
import { calculateExpeditionPrice, calculateInsuranceFee } from "../utils/price-calculator";
import { useCustomFee } from "../services/custom-fee/custom-fee-queries";
import Customs from "./customs/Customs";

const Calculator = ({ auction }: { auction: Auction }) => {
  const [lotDetails, setLotDetails] = useState<LotDetails | null>(null);
  const user = useUser("p9fYUDsqcgr6OcVXBZUY23prmhOcul1R3sW2gHYroOKlKb7qnGn8OAYA3Jnu");
  const [titleQuery, setTitleQuery] = useState<string>("");
  const titles = useTitles(titleQuery);
  const locations = useLocations(auction);
  const isInitiaLocationSet = useRef(false);

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
      expedition: {
        type: "basic",
      },
      customs: {
        releaseYear: NaN,
        fuelType: "",
        volume: NaN,
      },
    },
  });

  const selectedLocation = watch("transportation.shippingLocationId");

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
  const customFee = useCustomFee({
    auctionPrice: auctionFee.data?.totalCost || 0,
    fuelType: watch("customs.fuelType").toLowerCase(),
    volume: watch("customs.volume"),
    year: watch("customs.releaseYear"),
    vehicleType: watch("transportation.vehicleType"),
  });
  const transportationValues = watch("transportation");
  const expeditionValues = watch("expedition");

  // prices
  const expeditionPrice = useMemo(() => {
    return calculateExpeditionPrice(expeditionValues.type, transportationValues.vehicleType, user.data || null);
  }, [expeditionValues.type, transportationValues.vehicleType, user.data]);
  const auctionPrice = auctionFee.data?.totalCost || 0;
  const groundFeePrice = groundFee.data?.price || 0;
  const insurancePrice = useMemo(() => {
    return calculateInsuranceFee(transportationValues.insuranceType, auctionPrice, user.data || null);
  }, [transportationValues.insuranceType, auctionPrice, user.data]);
  const titlePrice = titles.data?.find((title) => title.id === transportationValues.titleDocumentId)?.price || 0;
  const totalPrice = useMemo(() => {
    return auctionPrice + groundFeePrice + insurancePrice + titlePrice;
  }, [auctionPrice, groundFeePrice, insurancePrice, titlePrice]);

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
  }, [auction]);

  useEffect(() => {
    if (lotDetails && !selectedLocation && !isInitiaLocationSet.current) {
      const location = locations.data?.find(
        (location) => location.name === `${lotDetails.saleState}-${lotDetails.saleCity}`,
      );
      if (location) {
        isInitiaLocationSet.current = true;
        setValue("transportation.shippingLocationId", location.id);
      }
    }
  }, [locations.data, lotDetails, selectedLocation, setValue]);

  return (
    <div className="calculator">
      <Header />
      <div className="calculator-content">
        <Auctions auction={auction} values={watch("auction")} setValue={setValue} auctionFee={auctionFee} />
        <Transportation
          user={user}
          values={watch("transportation")}
          setValue={setValue}
          groundFee={groundFee}
          auctionFee={auctionFee}
          titles={titles}
          setTitleQuery={setTitleQuery}
          locations={locations}
        />
        <Expedition
          values={watch("expedition")}
          setValue={setValue}
          price={expeditionPrice}
          loading={!user.data}
          showCallToAction={isNaN(expeditionPrice)}
        />
        <Customs values={watch("customs")} setValue={setValue} customFee={customFee} />
        {totalPrice}
      </div>
    </div>
  );
};

export default Calculator;

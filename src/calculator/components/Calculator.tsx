import { useState, useEffect } from "react";
import Input from "../ui/input";
import Autocomplete, { type AutocompleteOption } from "../ui/autocomplete";
import Radio from "../ui/radio";
import OptionSelector from "../ui/option-selector";
import PriceSection from "./PriceSection";
import { DollarIcon, ClearIcon, SearchIcon } from "../ui/icons";
import type { LotDetails } from "../../types/common";
import {
  subscribeLotDetails,
  getLotDetails,
} from "../../content/lot-details-store";
import "./calculator.scss";
import Header from "./header/Header";
import Label from "../ui/label";

const currencyOptions: AutocompleteOption[] = [
  { value: "usd", label: "USD - US Dollar" },
  { value: "eur", label: "EUR - Euro" },
  { value: "gbp", label: "GBP - British Pound" },
  { value: "jpy", label: "JPY - Japanese Yen" },
  { value: "cny", label: "CNY - Chinese Yuan" },
  { value: "gel", label: "GEL - Georgian Lari" },
];

const Calculator = () => {
  const [selectedCurrency, setSelectedCurrency] =
    useState<AutocompleteOption | null>(null);
  const [selectedOption, setSelectedOption] = useState<string | number>(
    "option1",
  );
  const [selectedSelector, setSelectedSelector] = useState<string | number>(
    "option1",
  );
  const [lotDetails, setLotDetails] = useState<LotDetails | null>(null);

  // Listen for lot details from content script
  useEffect(() => {
    // Subscribe to lot details store (primary method)
    const unsubscribe = subscribeLotDetails((details) => {
      setLotDetails(details);
      console.log("[Calculator] Received lot details from store:", details);
    });

    // Also listen for events on the shadow root host (fallback)
    const handleLotDetails = (event: CustomEvent<LotDetails>) => {
      setLotDetails(event.detail);
      console.log(
        "[Calculator] Received lot details from event:",
        event.detail,
      );
    };

    // Get the shadow root host element
    const hostElement = document.getElementById("cargopolo-calculator-root");
    if (hostElement) {
      hostElement.addEventListener(
        "cargopolo:lot-details",
        handleLotDetails as EventListener,
      );
    }

    // Also listen on window as fallback
    window.addEventListener(
      "cargopolo:lot-details",
      handleLotDetails as EventListener,
    );

    return () => {
      unsubscribe();
      if (hostElement) {
        hostElement.removeEventListener(
          "cargopolo:lot-details",
          handleLotDetails as EventListener,
        );
      }
      window.removeEventListener(
        "cargopolo:lot-details",
        handleLotDetails as EventListener,
      );
    };
  }, []);

  return (
    <div className="calculator">
      <Header />
      <div>
        {lotDetails && (
          <div
            style={{
              padding: "12px",
              background: "rgba(255,255,255,0.1)",
              borderRadius: "8px",
              marginBottom: "16px",
            }}
          >
            <Label>Lot Details</Label>
            <div style={{ color: "#fff", fontSize: "12px", marginTop: "8px" }}>
              <div>Auction: {lotDetails.auction.toUpperCase()}</div>
              <div>
                Location: {lotDetails.saleCity}, {lotDetails.saleState}
              </div>
              <div>Year: {lotDetails.releaseYear}</div>
              <div>Engine: {lotDetails.engineInformation}</div>
            </div>
          </div>
        )}
        <Label>Amount</Label>
        <Input
          startIcon={<DollarIcon />}
          endIcon={<ClearIcon />}
          onChange={(e) => {
            console.log(e);
          }}
          type="text"
          label="Amount"
          placeholder="Enter amount"
          required
        />
        <Autocomplete
          options={currencyOptions}
          value={selectedCurrency}
          onChange={setSelectedCurrency}
          label="Currency"
          placeholder="Select currency"
          startIcon={<SearchIcon />}
          // renderOption={({ option, isHighlighted, isSelected }) => (
          //   <div>
          //     <span>{option.label}</span>
          //     <span>{option.value} ae</span>
          //   </div>
          // )}
          required
        />
        <Radio
          label="Select Option"
          name="calculator-radio"
          options={[
            { value: "option1", label: "Option 1" },
            { value: "option2", label: "Option 2" },
            { value: "option3", label: "Option 3" },
          ]}
          value={selectedOption}
          onChange={setSelectedOption}
        />
        <Label>Option Selector</Label>
        <OptionSelector
          name="calculator-selector"
          options={[
            { value: "option1", label: "Option 1" },
            { value: "option2", label: "Option 2" },
            { value: "option3", label: "Option 3" },
          ]}
          value={selectedSelector}
          onChange={setSelectedSelector}
        />
        <PriceSection price="$ 8.800" label="Price:" />
        <div>+</div>
        <div>+</div>
        <div>+</div>
      </div>
    </div>
  );
};

export default Calculator;

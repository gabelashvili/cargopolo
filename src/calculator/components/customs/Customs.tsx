import type { UseFormSetValue } from "react-hook-form";
import Autocomplete from "../../ui/autocomplete/autocomplete";
import Label from "../../ui/label/label";
import "./customs.scss";
import { CustomFuelType, type FormData } from "../../schema";
import type { UseQueryResult } from "@tanstack/react-query";
import PriceSection from "../PriceSection";
import type { LotDetails } from "../../../types/common";
import { useEffect } from "react";
import Input from "../../ui/input/input";

const years = Array.from({ length: 51 }, (_, i) => new Date().getFullYear() - i);
const engineVolumes = Array.from({ length: 91 }, (_, i) => 1 + i / 10);

const Customs = ({
  values,
  setValue,
  customFee,
  lotDetails,
}: {
  values: FormData["customs"];
  setValue: UseFormSetValue<FormData>;
  customFee: UseQueryResult<number, Error>;
  lotDetails: LotDetails | null;
}) => {
  useEffect(() => {
    if (lotDetails) {
      const foundYear = years.find((x) => x === lotDetails.releaseYear);
      if (foundYear) {
        setValue("customs.releaseYear", foundYear);
      }
      const foundFuelType = Object.values(CustomFuelType).find((x) => x === lotDetails.engineType);
      if (foundFuelType) {
        setValue("customs.fuelType", foundFuelType);
      }
      const foundVolume = engineVolumes.find(
        (x) => x === Number(lotDetails.engineInformation.split(" ")[0].replace("L", "")),
      );
      if (foundVolume && foundFuelType !== "electric") {
        setValue("customs.volume", foundVolume);
      }
    }
  }, [lotDetails, setValue]);
  return (
    <div className="calculator-customs">
      <Label>Customs (Ukraine)</Label>
      <div className="calculator-customs-inputs">
        <Autocomplete
          options={years.map((x) => ({ value: x.toFixed(0), label: x.toFixed(0) }))}
          placeholder="Release Year"
          value={values.releaseYear.toFixed(0)}
          onChange={(v) => setValue("customs.releaseYear", Number(v))}
        />
        <Autocomplete
          options={Object.values(CustomFuelType).map((x) => ({ value: x, label: x }))}
          placeholder="Fuel Type"
          value={values.fuelType}
          onChange={(v) => setValue("customs.fuelType", v)}
        />
        {values.fuelType === "electric" ? (
          <Input
            type="number"
            placeholder="Engine Volume"
            value={isNaN(values.volume) ? "" : values.volume.toString().trim()}
            onChange={(v) => setValue("customs.volume", Number(v))}
            decimalScale={1}
          />
        ) : (
          <Autocomplete
            options={engineVolumes.map((x) => ({ value: x.toFixed(1), label: x.toFixed(1) }))}
            placeholder="Engine Volume"
            value={values.volume.toFixed(1)}
            onChange={(v) => setValue("customs.volume", Number(v))}
          />
        )}
      </div>
      <PriceSection currency="EUR" label="Price:" price={customFee.data ?? 0} loading={customFee.isLoading} />
    </div>
  );
};

export default Customs;

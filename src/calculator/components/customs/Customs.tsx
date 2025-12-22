import type { UseFormSetValue } from "react-hook-form";
import Autocomplete from "../../ui/autocomplete/autocomplete";
import Label from "../../ui/label/label";
import "./customs.scss";
import { CustomFuelType, type FormData } from "../../schema";
import type { UseQueryResult } from "@tanstack/react-query";
import PriceSection from "../PriceSection";

const years = Array.from({ length: 51 }, (_, i) => new Date().getFullYear() - i);
const engineVolumes = Array.from({ length: 91 }, (_, i) => 1 + i / 10);

const Customs = ({
  values,
  setValue,
  customFee,
}: {
  values: FormData["customs"];
  setValue: UseFormSetValue<FormData>;
  customFee: UseQueryResult<number, Error>;
}) => {
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
        <Autocomplete
          options={engineVolumes.map((x) => ({ value: x.toFixed(1), label: x.toFixed(1) }))}
          placeholder="Engine Volume"
          value={values.volume.toFixed(1)}
          onChange={(v) => setValue("customs.volume", Number(v))}
        />
      </div>
      <PriceSection label="Price:" price={customFee.data ?? 0} loading={customFee.isLoading} />
    </div>
  );
};

export default Customs;

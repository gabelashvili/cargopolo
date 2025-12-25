import type { UseFormSetValue } from "react-hook-form";
import type { FormData } from "../../schema";
import Label from "../../ui/label/label";
import Radio from "../../ui/radio/radio";
import "./expedition.scss";
import PriceSection from "../PriceSection";

const Expedition = ({
  values,
  setValue,
  price,
  loading,
  showCallToAction,
}: {
  values: FormData["expedition"];
  setValue: UseFormSetValue<FormData>;
  price: number;
  loading: boolean;
  showCallToAction: boolean;
}) => {
  return (
    <div className="calculator-expedition">
      <Label>Expedition</Label>
      <Radio
        name="expeditionType"
        options={[
          { value: "selfPickup", label: "Self Pickup" },
          { value: "complex", label: "Complex" },
          { value: "basic", label: "Basic" },
        ]}
        value={values.type}
        onChange={(val) => setValue("expedition.type", val as "selfPickup" | "complex" | "basic")}
      />
      <PriceSection price={price} label="Price:" currency="EUR" loading={loading} showCallToAction={showCallToAction} />
    </div>
  );
};

export default Expedition;

import Autocomplete from "../../ui/autocomplete/autocomplete";
import Label from "../../ui/label/label";
import BigSuvIcon from "../../ui/veh-type-icons/BigSuvIcon";
import BoatIcon from "../../ui/veh-type-icons/BoatIcon";
import BobCatIcon from "../../ui/veh-type-icons/BobCatIcon";
import HeavyEquipIcon from "../../ui/veh-type-icons/HeavyEquipIcon";
import Motorcycle from "../../ui/veh-type-icons/Motorcycle";
import PickupIcon from "../../ui/veh-type-icons/PickupIcon";
import Quadricycle from "../../ui/veh-type-icons/Quadricycle";
import SedanIcon from "../../ui/veh-type-icons/SedanIcon";
import SprinterIcon from "../../ui/veh-type-icons/SprinterIcon";
import SuvIcon from "../../ui/veh-type-icons/SuvIcon";
import TruckIcon from "../../ui/veh-type-icons/TruckIcon";
import VanIcon from "../../ui/veh-type-icons/VanIcon";
import "./transportation.scss";
import type { FormData } from "../../schema";
import type { UseFormSetValue } from "react-hook-form";
import OptionSelector from "../../ui/option-selector/option-selector";
import { useLocations } from "../../services/locations/locations-queries";
import type { Auction } from "../../../types/common";
import { useLocationRoutes } from "../../services/location-routes/location-routes-queries";
import { useEffect, useMemo } from "react";
import { useDestinationPorts } from "../../services/destination-ports/destination-ports-queries";

export const VehicleTypes = {
  sedan: "Sedan",
  smSuv: "Small, Medium SUV",
  bigSuv: "Big SUV",
  van: "Van",
  sprinter: "Sprinter",
  pickup: "Pickup",
  heavyEquip: "Heavy equipment",
  bobCat: "Bob Cat",
  quadricycle: "Quadricycle",
  motorcycle: "Motorcycle",
  truck: "Truck",
  boat: "Boat",
} as const;

const getNormalizedKey = (label: string) => label.replaceAll(",", "").replaceAll(" ", "");

const iconsPerType: Record<string, React.ComponentType> = {
  [getNormalizedKey(VehicleTypes.sedan)]: SedanIcon,
  [getNormalizedKey(VehicleTypes.smSuv)]: SuvIcon,
  [getNormalizedKey(VehicleTypes.bigSuv)]: BigSuvIcon,
  [getNormalizedKey(VehicleTypes.van)]: VanIcon,
  [getNormalizedKey(VehicleTypes.sprinter)]: SprinterIcon,
  [getNormalizedKey(VehicleTypes.pickup)]: PickupIcon,
  [getNormalizedKey(VehicleTypes.heavyEquip)]: HeavyEquipIcon,
  [getNormalizedKey(VehicleTypes.bobCat)]: BobCatIcon,
  [getNormalizedKey(VehicleTypes.quadricycle)]: Quadricycle,
  [getNormalizedKey(VehicleTypes.motorcycle)]: Motorcycle,
  [getNormalizedKey(VehicleTypes.truck)]: TruckIcon,
  [getNormalizedKey(VehicleTypes.boat)]: BoatIcon,
};

const Transportation = ({
  values,
  setValue,
  auction,
}: {
  values: FormData["transportation"];
  setValue: UseFormSetValue<FormData>;
  auction: Auction;
}) => {
  const locations = useLocations(auction);
  const locationRoutes = useLocationRoutes(values.shippingLocationId);
  const destinationPorts = useDestinationPorts();
  const exitPort = locationRoutes.data?.[0].exitPort;
  const exitPortsOptions = useMemo(
    () => (exitPort ? [{ value: exitPort.id.toString(), label: exitPort.name }] : []),
    [exitPort],
  );

  console.log(destinationPorts.data);

  useEffect(() => {
    if (exitPortsOptions.length === 1) {
      setValue("transportation.exitPortId", Number(exitPortsOptions[0].value));
    }
  }, [exitPort, exitPortsOptions, setValue]);
  return (
    <div className="calculator-transportation">
      <div className="calculator-transportation-vehicle-type">
        <Label>Transportation</Label>
        <Autocomplete
          placeholder="Choose Vehichle type"
          options={Object.values(VehicleTypes).map((type) => ({ value: type, label: type }))}
          value={values.vehicleType}
          onChange={(val) => {
            setValue("transportation.vehicleType", val);
          }}
          renderOption={({ option }) => {
            const Icon = iconsPerType[getNormalizedKey(option.label)];
            return (
              <div className="calculator-transportation-vehicle-type-option">
                {Icon && (
                  <div className="calculator-transportation-vehicle-type-icon">
                    <Icon />
                  </div>
                )}
                <span>{option.label}</span>
              </div>
            );
          }}
        />
      </div>
      <div className="calculator-transportation-container-type">
        <Label>Container Type</Label>
        <OptionSelector
          name="containerType"
          options={[
            { value: "4 Vehicles", label: "4 Vehicles" },
            { value: "3 Vehicles", label: "3 Vehicles" },
          ]}
          value={values.containerType}
          onChange={(val) => setValue("transportation.containerType", val as "4 Vehicles" | "3 Vehicles")}
        />
      </div>
      <div className="calculator-transportation-shipping-info">
        <Label>Shipping Info</Label>
        <div className="calculator-transportation-shipping-info-item">
          <Autocomplete
            options={locations.data?.map((location) => ({ value: location.id.toString(), label: location.name })) || []}
            value={values.shippingLocationId.toString()}
            onChange={(val) => {
              setValue("transportation.shippingLocationId", Number(val));
              setValue("transportation.exitPortId", NaN);
            }}
            loading={!locations.data}
          />
          <div className="calculator-transportation-shipping-info-item-ports">
            <Autocomplete
              options={exitPortsOptions}
              value={values.exitPortId.toString()}
              onChange={(val) => setValue("transportation.exitPortId", Number(val))}
              loading={locationRoutes.isFetching}
            />
            <Autocomplete
              options={destinationPorts.data?.map((port) => ({ value: port.id.toString(), label: port.name })) || []}
              value={values.deliveryPortId.toString()}
              onChange={(val) => setValue("transportation.deliveryPortId", Number(val))}
              loading={!destinationPorts.data}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Transportation;

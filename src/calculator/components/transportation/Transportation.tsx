import { useState } from "react";
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

const Transportation = () => {
  const [selectedVehicleType, setSelectedVehicleType] = useState<string | null>(null);
  return (
    <div className="calculator-transportation">
      <div className="calculator-transportation-vehicle-type">
        <Label>Transportation</Label>
        <Autocomplete
          placeholder="Choose Vehichle type"
          options={Object.values(VehicleTypes).map((type) => ({ value: type, label: type }))}
          value={selectedVehicleType}
          onChange={setSelectedVehicleType}
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
    </div>
  );
};

export default Transportation;

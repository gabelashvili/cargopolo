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
import clsx from "clsx";

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
  return (
    <div className="calculator-transportation">
      <div className="calculator-transportation-vehicle-type">
        <Label>Transportation</Label>
        <Autocomplete
          placeholder="Choose Vehichle type"
          required
          options={Object.values(VehicleTypes).map((type) => ({ value: type, label: type }))}
          renderOption={(props) => {
            const Icon = iconsPerType[getNormalizedKey(props.option.label)];
            return (
              <div
                className={clsx(
                  "calculator-transportation-vehicle-type-option",
                  props.isSelected && "selected",
                  props.isHighlighted && "highlighted",
                )}
              >
                <div style={{ width: 48, color: "#8E8E8E" }}>
                  <Icon />
                </div>
                <span>{props.option.label}</span>
              </div>
            );
          }}
        />
      </div>
    </div>
  );
};

export default Transportation;

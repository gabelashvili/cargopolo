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
import { useLocationRoutes } from "../../services/location-routes/location-routes-queries";
import { useEffect, useMemo } from "react";
import { useDestinationPorts } from "../../services/destination-ports/destination-ports-queries";
import PriceSection from "../PriceSection";
import type { UseQueryResult } from "@tanstack/react-query";
import type { GroundFeeResponse } from "../../services/ground-fee/ground-fee";
import type { UserData } from "../../services/user/user";
import Radio from "../../ui/radio/radio";
import type { AuctionCalculationRes } from "../../services/auction/auction";
import type { Title } from "../../services/titles/titles";
import type { Location } from "../../services/locations/locations";

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
  user,
  values,
  setValue,
  groundFee,
  auctionFee,
  titles,
  setTitleQuery,
  locations,
}: {
  values: FormData["transportation"];
  setValue: UseFormSetValue<FormData>;
  groundFee: UseQueryResult<GroundFeeResponse, Error>;
  user: UseQueryResult<UserData | null, Error>;
  auctionFee: UseQueryResult<AuctionCalculationRes, Error>;
  titles: UseQueryResult<Title[], Error>;
  setTitleQuery: (query: string) => void;
  locations: UseQueryResult<Location[], Error>;
}) => {
  const locationRoutes = useLocationRoutes(values.shippingLocationId);
  const destinationPorts = useDestinationPorts(!user.data);
  const exitPort = locationRoutes.data?.[0].exitPort;
  const exitPortsOptions = useMemo(
    () => (exitPort ? [{ value: exitPort.id.toString(), label: exitPort.name }] : []),
    [exitPort],
  );

  const totalPrice = useMemo(() => {
    const auctionPrice = auctionFee.data?.totalCost || 0;
    const groundFeePrice = groundFee.data?.price || 0;
    let insurancePrice = 0;
    if (values.insuranceType !== "basic" && user.data) {
      const percent =
        values.insuranceType === "auction" ? user.data.insuranceByAuctionFee : user.data?.insuranceByWarehouseFee;
      insurancePrice = (auctionPrice * percent) / 100;
    }
    const titlePrice = titles.data?.find((title) => title.id === values.titleDocumentId)?.price || 0;

    const sum = auctionPrice + groundFeePrice + insurancePrice + titlePrice;
    return sum;
  }, [
    auctionFee.data?.totalCost,
    groundFee.data?.price,
    titles.data,
    user.data,
    values.insuranceType,
    values.titleDocumentId,
  ]);

  useEffect(() => {
    if (exitPortsOptions.length === 1) {
      setValue("transportation.exitPortId", Number(exitPortsOptions[0].value));
    }
  }, [exitPort, exitPortsOptions, setValue]);

  useEffect(() => {
    if (user.data) {
      setValue("transportation.deliveryPortId", user.data.mainDestinationPort);
    }
  }, [setValue, user.data]);

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
            options={
              locations.data?.map((location) => ({
                value: location.id.toString(),
                label: `${location.name} (${location.locationStatus})`,
              })) || []
            }
            value={values.shippingLocationId.toString()}
            onChange={(val) => {
              setValue("transportation.shippingLocationId", Number(val));
              setValue("transportation.exitPortId", NaN);
            }}
            loading={!locations.data}
            renderOption={({ option }) => {
              const [name, status] = option.label.split(" (");
              const isSublot = status.toLowerCase().includes("sublot");
              return (
                <div className="calculator-transportation-location-option">
                  <span>{name}</span>
                  {status && (
                    <span className={`calculator-transportation-location-badge ${isSublot ? "sublot" : "standard"}`}>
                      {status.replace(")", "")}
                    </span>
                  )}
                </div>
              );
            }}
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
              loading={!destinationPorts.data || !user}
            />
          </div>
        </div>
      </div>
      <div className="calculator-transportation-title-document">
        <Label>Title document</Label>
        <Autocomplete
          onInputValueChange={(val) => setTitleQuery(val)}
          options={titles.data?.map((title) => ({ value: title.id.toString(), label: title.name })) || []}
          value={values.titleDocumentId?.toString() || ""}
          onChange={(val) => setValue("transportation.titleDocumentId", Number(val))}
          loading={!titles.data || titles.isFetching}
          renderOption={({ option }) => {
            const title = titles.data?.find((t) => t.id.toString() === option.value);
            if (!title) return <span>{option.label}</span>;

            const isOkStatus = title.status === "Ok to buy" || title.status === "OK";
            return (
              <table className="calculator-transportation-title-table">
                <tbody>
                  <tr>
                    <td className="calculator-transportation-title-name">{title.name}</td>
                    <td className="calculator-transportation-title-status">
                      <span className={`calculator-transportation-title-badge ${isOkStatus ? "ok" : "not-ok"}`}>
                        {title.status}
                      </span>
                    </td>
                    <td className="calculator-transportation-title-price">${title.price}</td>
                  </tr>
                </tbody>
              </table>
            );
          }}
        />
      </div>
      <div className="calculator-transportation-insurance-type">
        <Label>Insurance</Label>
        <Radio
          name="insuranceType"
          options={[
            {
              value: "auction",
              label:
                user.isLoading || !user.data
                  ? "Loading... (with auction photos)"
                  : `${user.data.insuranceByAuctionFee}% (with auction photos)`,
            },
            {
              value: "warehouse",
              label:
                user.isLoading || !user.data
                  ? "Loading... (with warehouse photos)"
                  : `${user.data.insuranceByWarehouseFee}% (with warehouse photos)`,
            },
            { value: "basic", label: "Basic" },
          ]}
          value={values.insuranceType}
          onChange={(val) => setValue("transportation.insuranceType", val as "basic" | "auction" | "warehouse")}
          disabled={user.isLoading || !user.data}
        />
        <PriceSection
          price={totalPrice}
          label="Price:"
          loading={groundFee.isFetching}
          showCallToAction={groundFee.data && (!groundFee.data.groundRate || !groundFee.data.oceanRate)}
        />
      </div>
    </div>
  );
};

export default Transportation;

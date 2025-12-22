import { VehicleTypes } from "../schema";
import type { UserData } from "../services/user/user";

export const calculateExpeditionPrice = (
  expeditionType: "selfPickup" | "complex" | "basic",
  vehicleType: string,
  userData: UserData | null,
): number => {
  if (!userData) return 0;
  let price = 0;
  if (expeditionType === "selfPickup") {
    price = userData.expeditionSelfPickupFee || 0;
  }
  if (expeditionType === "complex") {
    price = userData.expeditionComplexFee || 0;
  }
  if (expeditionType === "basic") {
    price = userData.expeditionBasicFee || 0;
  }
  if (
    [VehicleTypes.sedan, VehicleTypes.bigSuv, VehicleTypes.smSuv].includes(
      vehicleType as "Sedan" | "Big SUV" | "Small, Medium SUV",
    ) ||
    vehicleType === ""
  ) {
    if (vehicleType !== VehicleTypes.sedan && vehicleType !== "") {
      price += 100;
    }
  } else {
    return NaN;
  }
  return price;
};

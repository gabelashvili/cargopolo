export const calculateExpeditionPrice = (expeditionType: string, vehicleType: string, userData: UserData) => {
  if (expeditionType === "selfPickup") {
    return userData.expeditionSelfPickupFee;
  }
  if (expeditionType === "complex") {
    return userData.expeditionComplexFee;
  }
  return userData.expeditionBasicFee;
};

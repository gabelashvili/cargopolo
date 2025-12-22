export interface CustomFeeRequestParams {
  year: number;
  fuelType: string;
  volume: number;
  auctionPrice: number;
  vehicleType: string;
}

interface CustomFeeApiResponse {
  status: string;
  data: number;
}

export const getCustomFeeApi = async (params: CustomFeeRequestParams): Promise<number> => {
  try {
    const response = await fetch("https://admin.cargopolo.com/api/calculator/customs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        year: params.year,
        fuelType: params.fuelType,
        volume: params.volume,
        auctionPrice: params.auctionPrice,
        vehicleType: params.vehicleType,
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch custom fee: ${response.statusText}`);
    }

    const result = (await response.json()) as CustomFeeApiResponse;
    return result.data;
  } catch (error) {
    console.error("Error getting custom fee:", error);
    throw error;
  }
};

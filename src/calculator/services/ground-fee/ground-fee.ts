export interface GroundFeeRequestParams {
  locationId: number;
  exitPortId: number;
  destinationPortId: number;
  vehicleType: string;
  consolidationType: string;
}

export interface GroundFeeResponse {
  fee: number;
  isX: boolean;
  isY: boolean;
}

interface GroundFeeApiResponse {
  status: string;
  data: GroundFeeResponse;
}

export const getGroundFeeApi = async (params: GroundFeeRequestParams): Promise<GroundFeeResponse> => {
  try {
    const response = await fetch("https://admin.cargopolo.com/api/calculator/ground-fee", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...params,
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch ground fee: ${response.statusText}`);
    }

    const result = (await response.json()) as GroundFeeApiResponse;
    return result.data;
  } catch (error) {
    console.error("Error getting ground fee:", error);
    throw error;
  }
};

export interface UserData {
  // Add user properties based on API response
  mainDestinationPort: number;
  expeditionSelfPickupFee: number;
  expeditionComplexFee: number;
  insuranceByAuctionFee: number;
  insuranceByWarehouseFee: number;
  // Add other user properties as needed
}

interface UserApiResponse {
  status: string;
  data: UserData;
}

export const getUserApi = async (session: string): Promise<UserData | null> => {
  try {
    const response = await fetch(`https://admin.cargopolo.com/api/user?session=${session}`);

    if (!response.ok) {
      throw new Error(`Failed to fetch user: ${response.statusText}`);
    }

    const result = (await response.json()) as UserApiResponse;
    return result.data || null;
  } catch (error) {
    console.error("Error getting user:", error);
    throw error;
  }
};

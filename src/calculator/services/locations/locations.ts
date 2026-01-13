import type { Auction } from "../../../types/common";

export interface Location {
  id: number;
  name: string;
  status: string;
  locationStatus: string;
  // Add other location properties as needed based on API response
}

interface LocationsApiResponse {
  status: string;
  data: {
    data: Location[];
  };
}

export const getLocationsApi = async (appType: Auction): Promise<Location[]> => {
  try {
    const auctionsRequest = await fetch("https://admin.cargopolo.com/api/calculator/auctions");
    const auctionsData = (await auctionsRequest.json()) as { data: { data: { id: number; name: string }[] } };
    const auctionId = auctionsData.data.data.find(
      (auction) => auction.name.toLowerCase() === appType.toLowerCase(),
    )?.id;
    const response = await fetch(`https://admin.cargopolo.com/api/calculator/locations?auctionId=${auctionId}`);

    if (!response.ok) {
      throw new Error(`Failed to fetch locations: ${response.statusText}`);
    }

    const result = (await response.json()) as LocationsApiResponse;
    result.data.data = result.data.data.filter((location) => location.status === "Enabled");
    return result.data.data;
  } catch (error) {
    console.error("Error getting locations:", error);
    throw error;
  }
};

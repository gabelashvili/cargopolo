export interface LocationRoute {
  id: number;
  locationId: number;
  exitPortId: number;
  status: string;
  isRecommended: number;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
  prices: Array<{
    id: number;
    vehicleType: string;
    price: number;
    groundRouteId: number;
    created_at: Date;
    updated_at: Date;
    deleted_at: Date | null;
  }>;
  exitPort: {
    id: number;
    name: string;
    country: string;
    location: null;
    coordinates: null;
    status: string;
    created_at: Date;
    updated_at: Date;
    deleted_at: Date | null;
  };
  location: {
    id: number;
    auctionId: number;
    name: string;
    status: string;
    coordinates: null;
    locationStatus: string;
  };
}

interface LocationRoutesApiResponse {
  status: string;
  data: {
    data: LocationRoute[];
    count: number;
  };
}

export const getLocationRoutesApi = async (locationId: number): Promise<LocationRoute[]> => {
  try {
    const response = await fetch(`https://admin.cargopolo.com/api/calculator/ground-routes?locationId=${locationId}`);

    if (!response.ok) {
      throw new Error(`Failed to fetch location routes: ${response.statusText}`);
    }

    const result = (await response.json()) as LocationRoutesApiResponse;
    return result.data.data || [];
  } catch (error) {
    console.error("Error getting location routes:", error);
    throw error;
  }
};

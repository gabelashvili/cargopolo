export interface DestinationPort {
  id: number;
  name: string;
  country: string;
  location: null;
  coordinates: null;
  status: string;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
}

interface DestinationPortsApiResponse {
  status: string;
  data: {
    data: DestinationPort[];
  };
}

export const getDestinationPortsApi = async (): Promise<DestinationPort[]> => {
  try {
    const response = await fetch("https://admin.cargopolo.com/api/calculator/destination-ports", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch destination ports: ${response.statusText}`);
    }

    const result = (await response.json()) as DestinationPortsApiResponse;
    return result.data.data || [];
  } catch (error) {
    console.error("Error getting destination ports:", error);
    throw error;
  }
};

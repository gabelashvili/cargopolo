export interface Title {
  id: number;
  name: string;
  status: string;
  price: number;
  displayText: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

interface TitlesApiResponse {
  status: string;
  data: {
    data: Title[];
  };
}

export const getTitlesApi = async (query: string): Promise<Title[]> => {
  try {
    const response = await fetch(`https://admin.cargopolo.com/api/calculator/titles?search=${query}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch titles: ${response.statusText}`);
    }

    const result = (await response.json()) as TitlesApiResponse;
    return result.data.data || [];
  } catch (error) {
    console.error("Error getting titles:", error);
    throw error;
  }
};

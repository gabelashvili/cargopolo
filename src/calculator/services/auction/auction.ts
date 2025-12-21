export interface AuctionCalculationReqParams {
  cost: number;
  feeType: "low" | "high";
  auction: "iaai" | "copart";
}

export interface AuctionCalculationRes {
  auctionfee: number;
  fixedCost: number;
  totalCost: number;
}

interface AuctionCalculationApiResponse {
  status: string;
  data: AuctionCalculationRes;
}

export const getAuctionCalculation = async (params: AuctionCalculationReqParams): Promise<AuctionCalculationRes> => {
  try {
    if (params.cost === 0) {
      return {
        auctionfee: 0,
        fixedCost: 0,
        totalCost: 0,
      };
    }

    const response = await fetch("https://admin.cargopolo.com/api/calculator/auction-fee", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...params,
      }),
    });

    const result = (await response.json()) as AuctionCalculationApiResponse;
    return result.data;
  } catch (error) {
    console.error("Error getting auction calculation:", error as Error);
    return {
      auctionfee: 0,
      fixedCost: 0,
      totalCost: 0,
    };
  }
};

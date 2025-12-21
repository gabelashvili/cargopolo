import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import { getAuctionCalculation, type AuctionCalculationReqParams, type AuctionCalculationRes } from "./auction";

export const auctionCalculationKeys = {
  all: ["auction-calculation"] as const,
  byParams: (params: AuctionCalculationReqParams) => [...auctionCalculationKeys.all, params] as const,
};

export const useAuctionCalculation = (
  params: AuctionCalculationReqParams,
  options?: Omit<UseQueryOptions<AuctionCalculationRes, Error>, "queryKey" | "queryFn">,
) => {
  return useQuery<AuctionCalculationRes, Error>({
    queryKey: auctionCalculationKeys.byParams(params),
    queryFn: () => getAuctionCalculation(params),
    ...options,
  });
};

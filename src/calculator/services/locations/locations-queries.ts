import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import { getLocationsApi, type Location } from "./locations";
import type { Auction } from "../../../types/common";

export const locationsKeys = {
  all: ["locations"] as const,
  byAuction: (auction: Auction) => [...locationsKeys.all, auction] as const,
};

export const useLocations = (
  auction: Auction,
  options?: Omit<UseQueryOptions<Location[], Error>, "queryKey" | "queryFn">,
) => {
  return useQuery<Location[], Error>({
    queryKey: locationsKeys.byAuction(auction),
    queryFn: () => getLocationsApi(auction),
    ...options,
  });
};

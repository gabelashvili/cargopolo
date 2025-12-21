import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import { getLocationRoutesApi, type LocationRoute } from "./location-routes";

export const locationRoutesKeys = {
  all: ["location-routes"] as const,
  byLocationId: (locationId: number) => [...locationRoutesKeys.all, locationId] as const,
};

export const useLocationRoutes = (
  locationId: number | null | undefined,
  options?: Omit<UseQueryOptions<LocationRoute[], Error>, "queryKey" | "queryFn">,
) => {
  return useQuery<LocationRoute[], Error>({
    queryKey: locationRoutesKeys.byLocationId(locationId ?? 0),
    queryFn: () => getLocationRoutesApi(locationId!),
    enabled: !!locationId, // Only run query if locationId is provided
    ...options,
  });
};

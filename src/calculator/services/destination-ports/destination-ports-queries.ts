import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import { getDestinationPortsApi, type DestinationPort } from "./destination-ports";

export const destinationPortsKeys = {
  all: ["destination-ports"] as const,
};

export const useDestinationPorts = (
  disabled: boolean,
  options?: Omit<UseQueryOptions<DestinationPort[], Error>, "queryKey" | "queryFn">,
) => {
  return useQuery<DestinationPort[], Error>({
    queryKey: destinationPortsKeys.all,
    queryFn: () => getDestinationPortsApi(),
    enabled: !disabled,
    ...options,
  });
};

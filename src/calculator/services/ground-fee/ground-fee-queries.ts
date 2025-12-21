import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import { getGroundFeeApi, type GroundFeeRequestParams, type GroundFeeResponse } from "./ground-fee";

export const groundFeeKeys = {
  all: ["ground-fee"] as const,
  byParams: (params: GroundFeeRequestParams) => [...groundFeeKeys.all, params] as const,
};

export const useGroundFee = (
  params: GroundFeeRequestParams | null | undefined,
  options?: Omit<UseQueryOptions<GroundFeeResponse, Error>, "queryKey" | "queryFn">,
) => {
  return useQuery<GroundFeeResponse, Error>({
    queryKey: groundFeeKeys.byParams(params!),
    queryFn: () => getGroundFeeApi(params!),
    enabled: Object.values(params ?? {}).every((value) => !!value), // Only run query if params are provided
    ...options,
  });
};

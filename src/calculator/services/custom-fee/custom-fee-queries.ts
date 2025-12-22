import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import { getCustomFeeApi, type CustomFeeRequestParams } from "./custom-fee";

export const customFeeKeys = {
  all: ["custom-fee"] as const,
  byParams: (params: CustomFeeRequestParams) => [...customFeeKeys.all, params] as const,
};

export const useCustomFee = (
  params: CustomFeeRequestParams | null | undefined,
  options?: Omit<UseQueryOptions<number, Error>, "queryKey" | "queryFn">,
) => {
  console.log(
    Object.values(params ?? {}).every((value) => {
      console.log(value);
      return !!value;
    }),
  );
  return useQuery<number, Error>({
    queryKey: customFeeKeys.byParams(params!),
    queryFn: () => getCustomFeeApi(params!),
    enabled: Object.values(params ?? {}).every((value) => !!value),
    ...options,
  });
};

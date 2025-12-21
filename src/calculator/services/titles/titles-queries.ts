import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import { getTitlesApi, type Title } from "./titles";

export const titlesKeys = {
  all: ["titles"] as const,
};

export const useTitles = (options?: Omit<UseQueryOptions<Title[], Error>, "queryKey" | "queryFn">) => {
  return useQuery<Title[], Error>({
    queryKey: titlesKeys.all,
    queryFn: () => getTitlesApi(),
    ...options,
  });
};

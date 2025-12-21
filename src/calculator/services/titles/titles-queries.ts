import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import { getTitlesApi, type Title } from "./titles";
import { keepPreviousData } from "@tanstack/react-query";

export const titlesKeys = {
  all: ["titles"] as const,
};

export const useTitles = (query: string, options?: Omit<UseQueryOptions<Title[], Error>, "queryKey" | "queryFn">) => {
  return useQuery<Title[], Error>({
    queryKey: [titlesKeys.all, query],
    queryFn: () => getTitlesApi(query),
    placeholderData: keepPreviousData,
    ...options,
  });
};

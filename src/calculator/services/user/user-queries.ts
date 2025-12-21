import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import { getUserApi, type UserData } from "./user";

export const userKeys = {
  all: ["user"] as const,
  bySession: (session: string) => [...userKeys.all, session] as const,
};

export const useUser = (
  session: string | null | undefined,
  options?: Omit<UseQueryOptions<UserData | null, Error>, "queryKey" | "queryFn">,
) => {
  return useQuery<UserData | null, Error>({
    queryKey: userKeys.bySession(session ?? ""),
    queryFn: () => getUserApi(session!),
    enabled: !!session, // Only run query if session is provided
    ...options,
  });
};

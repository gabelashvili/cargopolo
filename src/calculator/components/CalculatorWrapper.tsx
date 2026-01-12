import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { Auction } from "../../types/common";
import Calculator from "./Calculator";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

const CalculatorWrapper = ({ auction, sessionKey }: { auction: Auction; sessionKey?: string }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <Calculator auction={auction} sessionKey={sessionKey} />
    </QueryClientProvider>
  );
};

export default CalculatorWrapper;

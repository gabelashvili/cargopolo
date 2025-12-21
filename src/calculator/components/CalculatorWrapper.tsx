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

const CalculatorWrapper = ({ auction }: { auction: Auction }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <Calculator auction={auction} />
    </QueryClientProvider>
  );
};

export default CalculatorWrapper;

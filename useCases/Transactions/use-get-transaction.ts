import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/hono";
import { convertAmountFromMiliunits } from "@/lib/utils";

import { TRANSACTION_QKEY } from ".";

const useGetTransaction = (id: string) => {
  const query = useQuery({
    queryKey: TRANSACTION_QKEY.DETAIL(id),
    queryFn: async () => {
      const response = await client.api.transactions[":id"].$get({
        param: { id },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch transaction");
      }

      const { data } = await response.json();

      return {
        ...data,
        amount: convertAmountFromMiliunits(data.amount),
      };
    },
    enabled: !!id,
  });

  return query;
};

export default useGetTransaction;

import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/hono";

import { ACCOUNT_QKEY } from ".";

const useGetAccounts = () => {
  const query = useQuery({
    queryKey: ACCOUNT_QKEY.ALL,
    queryFn: async () => {
      const response = await client.api.accounts.$get();

      return await response.json();
    },
    select: (data) => {
      return data.data;
    },
  });

  return query;
};

export default useGetAccounts;

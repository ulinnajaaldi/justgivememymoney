import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/hono";

import { ACCOUNT_QKEY } from ".";

const useGetAccount = (id: string) => {
  const query = useQuery({
    queryKey: ACCOUNT_QKEY.DETAIL(id),
    queryFn: async () => {
      const response = await client.api.accounts[":id"].$get({ param: { id } });

      return await response.json();
    },
    select: (data) => {
      return data.data;
    },
    enabled: !!id,
  });

  return query;
};

export default useGetAccount;

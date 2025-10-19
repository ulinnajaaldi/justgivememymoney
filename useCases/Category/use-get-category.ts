import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/hono";

import { ACCOUNT_QKEY } from "../Account";

const useGetCategory = (id: string) => {
  const query = useQuery({
    queryKey: ACCOUNT_QKEY.DETAIL(id),
    queryFn: async () => {
      const response = await client.api.categories[":id"].$get({
        param: { id },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch category");
      }

      return await response.json();
    },
    select: (data) => {
      return data.data;
    },
    enabled: !!id,
  });

  return query;
};

export default useGetCategory;

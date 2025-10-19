import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/hono";

import { CATEGORY_QKEY } from ".";

const useGetCategories = () => {
  const query = useQuery({
    queryKey: CATEGORY_QKEY.ALL,
    queryFn: async () => {
      const response = await client.api.categories.$get();

      if (!response.ok) {
        throw new Error("Failed to fetch categories");
      }

      return await response.json();
    },
    select: (data) => {
      return data.data;
    },
  });

  return query;
};

export default useGetCategories;

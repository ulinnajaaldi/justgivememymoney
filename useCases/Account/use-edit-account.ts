import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";

import { client } from "@/lib/hono";

type EditAccountResType = InferResponseType<
  (typeof client.api.accounts)[":id"]["$patch"]
>;
type EditAccountReqType = InferRequestType<
  (typeof client.api.accounts)[":id"]["$patch"]
>["json"];

const useEditAccount = (id?: string) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<EditAccountResType, Error, EditAccountReqType>({
    mutationFn: async (json) => {
      const response = await client.api.accounts[":id"]["$patch"]({
        param: { id },
        json,
      });
      return await response.json();
    },
    onSuccess: () => {
      toast.success("Account updated");
      queryClient.invalidateQueries({ queryKey: ["account", { id }] });
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
      queryClient.invalidateQueries({ queryKey: ["summary"] });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
    onError: () => {
      toast.error("Failed to update account");
    },
  });

  return mutation;
};

export default useEditAccount;

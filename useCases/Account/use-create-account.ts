import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";

import { client } from "@/lib/hono";

type CreateAccountResType = InferResponseType<typeof client.api.accounts.$post>;
type CreateAccountReqType = InferRequestType<
  typeof client.api.accounts.$post
>["json"];

const useCreateAccount = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<
    CreateAccountResType,
    Error,
    CreateAccountReqType
  >({
    mutationFn: async (json) => {
      const response = await client.api.accounts.$post({ json });
      return await response.json();
    },
    onSuccess: () => {
      toast.success("Account created");
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
    },
    onError: () => {
      toast.error("Failed to create account");
    },
  });

  return mutation;
};

export default useCreateAccount;

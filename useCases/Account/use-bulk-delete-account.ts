import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";

import { client } from "@/lib/hono";

type BulkDeleteAccountResType = InferResponseType<
  (typeof client.api.accounts)["bulk-delete"]["$post"]
>;
type BulkDeleteAccountReqType = InferRequestType<
  (typeof client.api.accounts)["bulk-delete"]["$post"]
>["json"];

const useBulkDeleteAccount = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<
    BulkDeleteAccountResType,
    Error,
    BulkDeleteAccountReqType
  >({
    mutationFn: async (json) => {
      const response = await client.api.accounts["bulk-delete"].$post({ json });
      return await response.json();
    },
    onSuccess: () => {
      toast.success("Account deleted");
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
      queryClient.invalidateQueries({ queryKey: ["summary"] });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
    onError: () => {
      toast.error("Failed to delete accounts");
    },
  });

  return mutation;
};

export default useBulkDeleteAccount;

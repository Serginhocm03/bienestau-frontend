import { AxiosError } from "axios";
import { useQuery } from "@tanstack/react-query";

import { getApi } from "@/lib/bienestar/api";
import { ActionLinesResponse, WelfareResponse } from "@/types/bienestar/dto";
import { Welfare } from "@/types/bienestar/pages";
import { ActionLine } from "@/types/bienestar/collections";

export const useWelfare = () => {
  const welfare = useQuery<WelfareResponse, AxiosError, Welfare>({
    queryKey: ["welfare"],
    queryFn: getApi<WelfareResponse>(),
    select: (data) => {
      console.log('📡 API Response [welfare]:', JSON.stringify(data, null, 2));
      return data.data;
    },
  });

  const actionLines = useQuery<ActionLinesResponse, AxiosError, ActionLine[]>({
    queryKey: ["action-lines"],
    queryFn: getApi<ActionLinesResponse>(),
    select: (data) => {
      console.log('📡 API Response [action-lines]:', JSON.stringify(data, null, 2));
      return data.data;
    },
  });

  const refetch = () => {
    welfare.refetch();
    actionLines.refetch();
  };

  return {
    welfare: welfare.data,
    actionLines: actionLines.data,
    isPending: welfare.isPending || actionLines.isPending,
    error: welfare.error || actionLines.error,
    refetch,
  };
};

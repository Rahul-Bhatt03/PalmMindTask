import { apiClient } from "@/api";
import { API_PATHS } from "@/constants";
import type { ApiSuccessResponse, AppStats } from "@/types";

export const statsService = {
  async getStats(): Promise<AppStats> {
    const { data } = await apiClient.get<ApiSuccessResponse<AppStats>>(
      API_PATHS.stats,
    );
    return data.data;
  },
};

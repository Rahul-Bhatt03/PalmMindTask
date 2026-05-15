import { apiClient } from "@/api";
import { API_PATHS } from "@/constants";
import type { ApiSuccessResponse, AuthResult, LoginDto, RegisterDto } from "@/types";

export const authService = {
  async register(input: RegisterDto): Promise<AuthResult> {
    const { data } = await apiClient.post<ApiSuccessResponse<AuthResult>>(
      API_PATHS.auth.register,
      input,
    );
    return data.data;
  },

  async login(input: LoginDto): Promise<AuthResult> {
    const { data } = await apiClient.post<ApiSuccessResponse<AuthResult>>(
      API_PATHS.auth.login,
      input,
    );
    return data.data;
  },
};

import { apiClient } from "@/api";
import { API_PATHS } from "@/constants";
import type {
  ApiSuccessResponse,
  ListUsersParams,
  PaginatedUsers,
  UpdateUserDto,
  UserProfile,
} from "@/types";

export const userService = {
  async getMe(): Promise<UserProfile> {
    const { data } = await apiClient.get<ApiSuccessResponse<UserProfile>>(API_PATHS.users.me);
    return data.data;
  },

  async list(params: ListUsersParams = {}): Promise<PaginatedUsers> {
    const { data } = await apiClient.get<ApiSuccessResponse<PaginatedUsers>>(API_PATHS.users.root, {
      params,
    });
    return data.data;
  },

  async getById(id: string): Promise<UserProfile> {
    const { data } = await apiClient.get<ApiSuccessResponse<UserProfile>>(
      API_PATHS.users.byId(id),
    );
    return data.data;
  },

  async update(id: string, input: UpdateUserDto): Promise<UserProfile> {
    const { data } = await apiClient.put<ApiSuccessResponse<UserProfile>>(
      API_PATHS.users.byId(id),
      input,
    );
    return data.data;
  },

  async remove(id: string): Promise<void> {
    await apiClient.delete(API_PATHS.users.byId(id));
  },
};

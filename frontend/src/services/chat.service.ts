import { apiClient } from "@/api";
import { API_PATHS } from "@/constants";
import type { ApiSuccessResponse, ChatMessage, ChatMessagePayload } from "@/types";
import { mapMessage } from "@/utils/message.mapper";

export const chatService = {
  async getMessages(roomId: string): Promise<ChatMessage[]> {
    const { data } = await apiClient.get<ApiSuccessResponse<unknown[]>>(
      API_PATHS.chat.messages,
      { params: { roomId } },
    );
    return data.data.map((m) => mapMessage(m as Parameters<typeof mapMessage>[0]));
  },

  async sendMessage(payload: ChatMessagePayload): Promise<ChatMessage> {
    const { data } = await apiClient.post<ApiSuccessResponse<unknown>>(
      API_PATHS.chat.messages,
      payload,
    );
    return mapMessage(data.data as Parameters<typeof mapMessage>[0]);
  },
};

import type { IStatsService, AppStats } from "../interfaces/services/stats.service.interface.js";
import type { IUserRepository } from "../interfaces/repositories/user.repository.interface.js";
import type { IChatRepository } from "../interfaces/repositories/chat.repository.interface.js";

export class StatsService implements IStatsService {
  constructor(
    private readonly users: IUserRepository,
    private readonly chat: IChatRepository,
  ) {}

  async getStats(): Promise<AppStats> {
    const [users, messages] = await Promise.all([
      this.users.countUsers(),
      this.chat.countMessages(),
    ]);
    return { users, messages };
  }
}

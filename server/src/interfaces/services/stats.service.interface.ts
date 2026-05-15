export interface AppStats {
  users: number;
  messages: number;
}

export interface IStatsService {
  getStats(): Promise<AppStats>;
}

import type { Request, Response, NextFunction } from "express";
import type { IStatsService } from "../interfaces/services/stats.service.interface.js";
import { ok } from "../utils/response.js";

export class StatsController {
  constructor(private readonly stats: IStatsService) {}

  summary = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data = await this.stats.getStats();
      ok(res, data);
    } catch (e) {
      next(e);
    }
  };
}

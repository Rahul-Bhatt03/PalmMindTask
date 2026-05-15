import { Router } from "express";
import type { StatsController } from "../controllers/stats.controller.js";

export function createStatsRoutes(controller: StatsController): Router {
  const r = Router();
  r.get("/", controller.summary);
  return r;
}

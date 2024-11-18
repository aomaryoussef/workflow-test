import { Router } from "express";
import branchesController from "./controllers/branches-controller";

export const staticRouter = Router();

staticRouter.get("/branches", branchesController.index);

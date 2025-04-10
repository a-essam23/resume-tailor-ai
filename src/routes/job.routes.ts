import { processJob } from "@/controllers/job.controller";
import { Router } from "express";

const jobRouter: Router = Router();

jobRouter.post("/process-job", processJob);

export default jobRouter;

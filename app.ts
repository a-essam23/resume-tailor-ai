import cors from "cors";
import bodyParser from "body-parser";
import express, { Express } from "express";
import catchAsync from "@utils/catchAsync";
import AppError from "@utils/AppError";
import { z } from "zod";
import { jobApplicationSchema } from "@/validators";

const app: Express = express();
app.use(cors());
app.use(bodyParser.json());

app.post("/log", (req, res) => {
  const { process, message } = req.body;
  console.log(`[${process}]: ${message}`);
  res.sendStatus(200); // Respond with a success status
});

app.get("/ready", (req, res) => {
  const recievedAt = Date.now();
  console.log(`[extension]: Ready at ${recievedAt}`);
  res.status(200).send(`Recieved at ${recievedAt}`);
});

app.post(
  "/api/process-job",
  catchAsync(async (req, res, next) => {
    if (!req.body) throw new AppError("No description provided", 400);
    const parsed = jobApplicationSchema.safeParse(req.body);
    if (!parsed.success) {
      throw new AppError(
        parsed.error.errors.map((e) => e.message).join("\n"),
        400
      );
    }
    res.status(200).json({
      status: "success",
    });
  })
);

export default app;

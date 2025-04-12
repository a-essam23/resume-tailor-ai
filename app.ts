import cors from "cors";
import bodyParser from "body-parser";
import express, { Express } from "express";
import jobRouter from "@routes/job.routes";
import { log } from "@utils/logger";

const app: Express = express();
app.use(cors());
app.use(bodyParser.json());

app.post("/log", (req, res) => {
  const { process, message } = req.body;
  log.debug(message, "extension");
  res.sendStatus(200); // Respond with a success status
});

app.get("/ready", (req, res) => {
  const recievedAt = Date.now();
  log.debug(`Extension is ready`, "extension");
  res.status(200).send(`Recieved at ${recievedAt}`);
});

app.use("/api", jobRouter);

export default app;

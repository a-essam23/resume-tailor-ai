import dotenv from "dotenv";
dotenv.config();
import exampleResume from "@assets/example-resume";
import { ModelParams } from "@google/generative-ai";
import AppError from "@utils/AppError";
import { existsSync, mkdirSync } from "fs";
import { IResume } from "@schemas/resume.schema";
import { log } from "@utils/logger";
import { validateResume } from "@services/resume.service";

interface IConfig {
  NODE_ENV: string;
  OUTPUT_DIR: string;
  PORT: number;

  API_KEY: string;
  MODEL: ModelParams["model"];

  RESUME: IResume;
  TEMPLATE: string;
  RESUME_OUTPUT_NAME: string;
}
const config: IConfig = {
  NODE_ENV: process.env.NODE_ENV || "development",
  OUTPUT_DIR: "output",
  PORT: 3100,

  API_KEY: process.env.API_KEY!,
  MODEL: "gemini-2.0-flash",

  RESUME: exampleResume,
  TEMPLATE: process.env.TEMPLATE || "default", // Name of the templat's dir inside /templates
  RESUME_OUTPUT_NAME: "resume",
};

// create output directory if doesn't exist
if (!existsSync(config.OUTPUT_DIR)) mkdirSync(config.OUTPUT_DIR);
if (!config.API_KEY) throw new AppError("API_KEY is not set");

// Check if resume in .env
if (process.env.RESUME) {
  if (process.env.RESUME)
    log.debug(`Found resume in .env file: ${process.env.RESUME}`, "preloading");
  const resume = require(process.env.RESUME).default as IResume;
  if (resume) log.debug(`Loaded resume`, "preloading");
  validateResume(resume); // Check if resume is valid
  config.RESUME = resume;
}
export default config;

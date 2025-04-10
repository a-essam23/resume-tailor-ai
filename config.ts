import dotenv from "dotenv";
dotenv.config();
import exampleResume from "@assets/example-resume";
import { ModelParams } from "@google/generative-ai";
import AppError from "@utils/AppError";
import { existsSync, mkdirSync } from "fs";
import { IResume } from "@schemas/resume.schema";

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
  TEMPLATE: "default", // Name of the templat's dir inside /templates
  RESUME_OUTPUT_NAME: "resume",
};

// create output directory if doesn't exist
if (!existsSync(config.OUTPUT_DIR)) mkdirSync(config.OUTPUT_DIR);
if (!config.API_KEY) throw new AppError("API_KEY is not set");
export default config;

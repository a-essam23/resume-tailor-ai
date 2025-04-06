import dotenv from "dotenv";
dotenv.config();
import defaultResume from "@assets/mock-resume";
import { ModelParams } from "@google/generative-ai";
import AppError from "@utils/AppError";
import { existsSync, mkdirSync, readFileSync } from "fs";
import { IResume } from "@schemas/resume.schema";
import { IAdjustmentControls } from "@schemas/controls.schema";

interface IConfig {
  NODE_ENV: string;
  OUTPUT_DIR: string;
  PORT: number;

  API_KEY: string;
  MODEL: ModelParams["model"];
  controls: IAdjustmentControls;

  RESUME: IResume;
  TEMPLATE: string;
  RESUME_OUTPUT_NAME: string;
}
const config: IConfig = {
  NODE_ENV: process.env.NODE_ENV || "development",
  OUTPUT_DIR: "output",
  PORT: 3100,

  controls: {
    experience: {
      maxYearsIncrease: 0.15, // Allow 15% experience boost
      allowTitlePromotion: true,
    },
    skills: {
      maxNewSkills: 2,
      requiredMatchThreshold: 0.6,
    },
    education: { allowDegreeEnhancement: true },
  },

  API_KEY: process.env.API_KEY!,
  MODEL: "gemini-2.0-flash",

  RESUME: defaultResume,
  TEMPLATE: readFileSync("templates/default.hbs", "utf-8"),
  RESUME_OUTPUT_NAME: "resume",
};

// create output directory if doesn't exist
if (!existsSync(config.OUTPUT_DIR)) mkdirSync(config.OUTPUT_DIR);
if (!config.API_KEY) throw new AppError("API_KEY is not set");
export default config;

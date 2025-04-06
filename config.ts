import defaultResume from "@assets/mock-resume";
import dotenv from "dotenv";
import { existsSync, mkdirSync, readFileSync } from "fs";
dotenv.config();

const config = {
  NODE_ENV: process.env.NODE_ENV || "development",
  API_KEY: process.env.API_KEY,
  OUTPUT_DIR: "output",
  PORT: 3100,
  RESUME: defaultResume,
  TEMPLATE: readFileSync("templates/default.hbs", "utf-8"),
};

// create output directory if doesn't exist
if (!existsSync(config.OUTPUT_DIR)) mkdirSync(config.OUTPUT_DIR);

export default config;

import dotenv from "dotenv";
dotenv.config();

const config = {
  API_KEY: process.env.API_KEY,
  OUTPUT_DIR: "output",
  PORT: 3100,
};

export default config;

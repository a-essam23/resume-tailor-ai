import config from "config";
import app from "./app";
import { log } from "@utils/logger";
import {
  compileResume,
  generatePDF,
  validateResume,
} from "@services/resume.service";
app.listen(config.PORT, () => {
  log.info(`Server running on port ${config.PORT}`, "server");
});

const resume = validateResume(config.RESUME);
const html = compileResume(resume, config.TEMPLATE);
generatePDF(html);

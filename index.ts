import config from "@config";
import app from "app";
import { log } from "@utils/logger";
import { compileResume, generatePDF } from "@services/resume.service";
// app.listen(config.PORT, () => {
//   log.info(`Server running on port ${config.PORT}`, "server");
// });

const html = compileResume(config.RESUME, config.TEMPLATE, config.OUTPUT_DIR)
generatePDF(html, config.OUTPUT_DIR);
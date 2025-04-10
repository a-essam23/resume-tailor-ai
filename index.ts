import config from "@config";
import app from "app";
import { log } from "@utils/logger";
import { verifyPuppeteerSetup } from "@utils/verify-puppeteer";

Promise.all([verifyPuppeteerSetup()])
  .then(() => {
    app.listen(config.PORT, () => {
      log.info(`Server running on port ${config.PORT}`, "server");
    });
  })
  .catch((error) => {
    log.error(error, "server");
  });

process.on("uncaughtException", (error) => {
  log.error(error as unknown as string, "uncaughtException");
});

process.on("unhandledRejection", (error) => {
  log.error(error as unknown as string, "unhandledRejection");
});

import config from "@config";
import app from "app";
import { log } from "@utils/logger";
app.listen(config.PORT, () => {
  log.info(`Server running on port ${config.PORT}`, "server");
});

import config from "config";
import app from "./app";

app.listen(config.PORT, () => {
  console.log(`⚡️[server]: Server running on port ${config.PORT}`);
});

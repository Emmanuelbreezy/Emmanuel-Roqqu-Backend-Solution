import "dotenv/config";
import { ENV } from "./config/env.config";
import { createApp } from "./app";
import { initializeDatabase } from "./database/database";

const app = createApp();

app.listen(ENV.PORT, async () => {
  await initializeDatabase();
  console.log(`Server listening on port ${ENV.PORT} in ${ENV.NODE_ENV}`);
});

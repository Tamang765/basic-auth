import { app } from "./app.js";
import { logger } from "./utils/logger.js";

const port = 5005;

async function startServer() {
  try {
    app.listen(port, () => {
      logger.info(`Server is running on port ${port}`);
    });
    
  } catch (error: Error | any) {
    logger.error("Error starting server:", error.message);
  }
}

startServer();

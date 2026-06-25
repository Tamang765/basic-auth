import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import { connectDatabase } from "./database/database.js";
import { logger } from "./utils/logger.js";

import UserRoute from "./modules/users/user.route.js";

export const app = express();
const apiPrefix = "/api/v1";

app.use(helmet());
app.use(express.json({ limit: "10kb" }));

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors());

logger.info("Connecting to database...");
await connectDatabase();
logger.info("Database connected successfully");

app.get("/", (req, res) => {
  res.send("Backend working");
});

// health check

app.get("/health", (req, res) => {
  return res.status(200).json({
    status: "OK",
    timeStamp: Date.now(),
  });
});

app.use(`${apiPrefix}/user`, UserRoute);

app.use((req, res, next) => {
  next(new Error(`cant find req url`));
});

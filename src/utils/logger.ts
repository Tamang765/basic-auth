import pino from "pino";
import config from "../config/config.js";

export const logger = pino(
  config.isProduction
    ? {}
    : {
        transport: {
          target: "pino-pretty",
          options: {
            colorize: true,
          },
        },
      },
);

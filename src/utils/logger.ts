import pino from "pino";
import config from "../config/config.js";

const transport = config.isProduction ? { target: "pino-pretty" } : undefined;

export const logger = pino(transport ? { transport } : {});

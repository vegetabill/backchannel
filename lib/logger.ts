import * as winston from "winston";

const logger = winston.createLogger({
  level: process.env.VERBOSE === "true" ? "debug" : "info",
  format: winston.format.simple(),
  transports: [new winston.transports.Console()],
});

export default logger;

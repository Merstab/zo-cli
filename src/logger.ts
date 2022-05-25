import winston from "winston";

const { combine, timestamp, printf, colorize } = winston.format;

const transport = {
  console: new winston.transports.Console({ level: "info" }),
};

export const setLevel = (l: string) => (transport.console.level = l);

export const logger = winston.createLogger({
  // level: process.env.LOG_LEVEL || "info",
  format: combine(
    colorize(),
    timestamp(),
    printf(({ level, message, timestamp, ...rest }) => {
      const restString = JSON.stringify(rest);
      return `${timestamp} ${level}: ${message} ${
        restString === "{}" ? "" : restString
      }`;
    })
  ),
  transports: [transport.console],
});

export const simplelog = winston.createLogger({
  format: combine(
    colorize(),
    printf(({ level, message, ...rest }) => {
      const restString = JSON.stringify(rest);
      return `${level}: ${message} ${restString === "{}" ? "" : restString}`;
    })
  ),
  transports: [transport.console],
});

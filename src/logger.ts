import winston from "winston";

const { combine, printf, colorize } = winston.format;

const transport = {
  console: new winston.transports.Console({ level: "info" }),
};

export const setLevel = (l: string) => (transport.console.level = l);

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

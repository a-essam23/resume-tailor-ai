import winston from "winston";

const consoleTransport = new winston.transports.Console({
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.prettyPrint(),
    winston.format.simple(),
    winston.format.timestamp({ format: "HH:mm:ss" }), // Add timestamp format here

    winston.format.printf(
      (info) =>
        `${info.timestamp} ${info?.decorator} ${info.level}: ${info.message}`
    )
  ),
});

const decorators = {
  server: "⚡️",
};

const logLevels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  verbose: 4,
  debug: 5,
  silly: 6,
} as const;

const logger = winston.createLogger({
  level: "silly",
  transports: [consoleTransport],
  format: winston.format.combine(
    winston.format.timestamp(), // Add timestamp format here
    winston.format.prettyPrint(),
    winston.format.simple()
  ),
});

const _log = (type: keyof typeof logLevels, message: string, task?: string) => {
  const decorator = task ? decorators[task as keyof typeof decorators] : "";
  logger.log(type, {
    message,
    decorator,
  });
};

export const log = Object.keys(logLevels).reduce((acc, level) => {
  acc[level as keyof typeof logLevels] = (
    message: string,
    task?: string
    // labels?: { [key: string]: any }
  ) => _log(level as any, message, task);
  return acc;
}, {} as Record<keyof typeof logLevels, (message: string, task?: string, labels?: { [key: string]: any }) => any>);

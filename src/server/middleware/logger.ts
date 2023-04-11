import split from "split";
import appRoot from "app-root-path";
import moment from "moment";
import "moment-timezone";
import winston from "winston";
import morgan from "morgan";

const { combine, label, printf } = winston.format;

const timestampWithTimezone = winston.format((info, opts) => {
  if (opts.tz) info.timestamp = moment().tz(opts.tz).format();
  return info;
});

const customFormat = combine(
  label({ label: "DEER" }),
  timestampWithTimezone({ tz: "Asia/Seoul" }),
  printf(({ level, message, label, timestamp }) => `${timestamp} [${label}] ${level}: ${message}`)
);

const options = {
  error: {
    level: "error",
    filename: `${appRoot}/logs/error.log`,
    handleExceptions: true,
    json: false,
    maxsize: 5242880, // 5MB
    maxFiles: 5,
    colorize: false,
    format: customFormat
  },
  info: {
    level: "info",
    filename: `${appRoot}/logs/info.log`,
    handleExceptions: true,
    json: false,
    maxsize: 5242880, // 5MB
    maxFiles: 5,
    colorize: false,
    format: customFormat
  },
  debug: {
    level: "debug",
    filename: `${appRoot}/logs/debug.log`,
    handleExceptions: true,
    json: true,
    maxsize: 5242880, // 5MB
    maxFiles: 5,
    colorize: true,
    format: customFormat
  }
};

const logger = winston.createLogger({
  transports: [
    new winston.transports.File(options.error),
    new winston.transports.File(options.info),
    new winston.transports.Console(options.debug)
  ],
  exitOnError: false // do not exit on handled exceptions
});

const morganFormat =
  ':remote-addr - :remote-user ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"';
const morganOptions = {
  stream: split().on("data", (text) => logger.info(text))
};

export default morgan(morganFormat, morganOptions);

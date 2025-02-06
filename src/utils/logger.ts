import winston, { transport } from 'winston';
import Transport from 'winston-transport';
import { Config } from '../config/config';
import { Log } from '../models/Log';
import path from 'path';

// Custom PostgreSQL transport
class PostgresTransport extends Transport {
  constructor(opts?: transport.TransportStreamOptions) {
    super(opts);
  }

  async log(info: winston.LogEntry, callback: () => void) {
    setImmediate(() => {
      this.emit('logged', info);
    });

    try {
      const { level, message, timestamp, ...meta } = info;
      await Log.create({
        level,
        message,
        timestamp: timestamp || new Date(),
        meta,
        service: 'event-service',
        context: meta.context || null,
      });
    } catch (error) {
      console.error('Error saving log to database:', error);
    }

    callback();
  }
}

// Log format
const logFormat = winston.format.combine(
  winston.format.timestamp({
    format: 'YYYY-MM-DD HH:mm:ss',
  }),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  winston.format.json()
);

// Create logger instance
const logger = winston.createLogger({
  level: Config.LOG_LEVEL || 'info',
  format: logFormat,
  defaultMeta: { service: 'event-service' },
  transports: [
    // Write all logs with level 'error' and below to error.log
    new winston.transports.File({
      filename: path.join('logs', 'error.log'),
      level: 'error',
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
    // Write all logs with level 'info' and below to combined.log
    new winston.transports.File({
      filename: path.join('logs', 'combined.log'),
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
    // PostgreSQL transport
    new PostgresTransport(),
  ],
});

// If we're not in production, log to the console with custom format
if (!Config.isProduction()) {
  logger.add(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    })
  );
}

// Helper function to add request context to logs
export const addRequestContext = (req: any) => {
  return {
    requestId: req.id,
    method: req.method,
    url: req.url,
    ip: req.ip,
    userId: req.user?.id,
  };
};

export default logger; 
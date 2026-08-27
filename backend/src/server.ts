import app from './app';
import { env } from './config/env';
import { logger } from './shared/utils/logger';

const PORT = env.PORT;

const server = app.listen(PORT, '0.0.0.0', () => {
  logger.info(`🚀 Deepsta Backend API running on port ${PORT} [0.0.0.0:${PORT}] [${env.NODE_ENV}]`);
  logger.info(`📍 Base API URL: http://localhost:${PORT}${env.API_PREFIX}`);
});

process.on('unhandledRejection', (err) => {
  logger.error('Unhandled Promise Rejection:', err);
});

process.on('uncaughtException', (err) => {
  logger.error('Uncaught Exception:', err);
  process.exit(1);
});

export default server;

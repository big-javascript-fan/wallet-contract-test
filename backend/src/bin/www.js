#!/usr/bin/env node
/**
 * Module dependencies.
 */
import debug from 'debug';
import http from 'http';
import { CronJob } from 'cron';

import app from '../app';
import { logger } from '../utils';

/**
 * Normalize a port into a number, string, or false.
 */
const normalizePort = (val) => {
  const portNum = parseInt(val, 10);
  if (Number.isNaN(portNum)) {
    // named pipe
    return val;
  }
  if (portNum >= 0) {
    // port number
    return portNum;
  }
  return false;
};

/**
 * Get port from environment and store in Express.
 */
const port = normalizePort(process.env.PORT || '3001');
app.set('port', port);

/**
 * Create HTTP server.
 */
const server = http.createServer(app);

/**
 * Event listener for HTTP server "error" event.
 */
const onError = (error) => {
  if (error.syscall !== 'listen') {
    throw error;
  }
  const bind = typeof port === 'string' ? `Pipe ${port}` : `Port ${port}`;
  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      logger.error(`${bind} requires elevated privileges`);
      process.exit(1);
      break;
    case 'EADDRINUSE':
      logger.error(`${bind} is already in use`);
      process.exit(1);
      break;
    default:
      throw error;
  }
};

/**
 * Event listener for HTTP server "listening" event.
 */
const onListening = () => {
  const addr = server.address();
  const bind = typeof addr === 'string' ? `pipe ${addr}` : `port ${addr.port}`;
  debug(`Listening on ${bind}`);
};
/**
 * Listen on provided port, on all network interfaces.
 */
server.listen(port);

// CRON Job - start
const healthCheckJob = new CronJob(
  '0 */10 * * * *',
  () => {
    logger.info('Health Checking!');
  },
  null,
  false,
  'America/New_York'
);
healthCheckJob.start();
logger.info('Cronjob(healthCheckJob) started!');
// CRON Job - end

server.on('error', onError);
server.on('listening', onListening);

/** Graceful shut down - start */
server.on('close', async () => {
  healthCheckJob.stop();
  logger.info('Cronjob(healthCheckJob) stopped!');

  // wait for .5 second to close the IMAP connection
  await new Promise((resolve) => setTimeout(resolve, 500));
  logger.info('Server closing, bye!');
  process.exit(0);
});

function shutdown() {
  server.close((err) => {
    if (err) {
      logger.error(err);
      process.exit(1);
    }
  });
}

process.on('SIGTERM', () => {
  logger.info('SIGTERM, Graceful shutdown start');
  shutdown();
});

process.on('SIGINT', () => {
  logger.info('SIGINT, Graceful shutdown start');
  shutdown();
});
/** Graceful shut down - end */

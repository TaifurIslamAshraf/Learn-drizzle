import env from './config/env';

import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { compress } from 'hono/compress';
import { cors } from 'hono/cors';
import { showRoutes } from 'hono/dev';
import { logger as httpLogger } from 'hono/logger';
import { trimTrailingSlash } from 'hono/trailing-slash';

import type { Server as HttpServer } from 'http';
import { Server } from 'socket.io';
import { logger } from './config/logger';
import { NODE_ENVIRONMENTS } from './libs/constants';
import { tracing } from './middlewares/tracing';
import { configureRoutes } from './routes';

const app = new Hono();

const corsOptions = {
    origin: env.ORIGIN.split(' '),
    allowMethods: ['POST', 'GET', 'PUT', 'DELETE', 'FETCH'],
    maxAge: 600,
    credentials: true,
};

// Generic middlewares
app.use(cors(corsOptions));
app.use(tracing);
app.use(compress());
app.use(httpLogger());
app.use(trimTrailingSlash());

//configur all routes
configureRoutes(app);

if (env.NODE_ENV === NODE_ENVIRONMENTS.development) {
    console.log('Available routes:');
    showRoutes(app);
}

const port = parseInt(env.PORT);
const server = serve({ fetch: app.fetch, port }, (info) => {
    logger.info(`Server is running: http://${info.address}:${info.port}, env: ${env.NODE_ENV}`);
});

const ioServer = new Server(server as HttpServer, {
    path: '/ws',
    serveClient: false,
    cors: {
        origin: ['http://127.0.0.1:5500'], // Update this to include your client origin
        methods: ['GET', 'POST'],
        credentials: true,
    },
});

ioServer.on('error', (err) => {
    logger.error(err);
});

ioServer.on('connection', (socket) => {
    logger.info('Client Connected');

    socket.on('disconnect', () => {
        logger.info('Client Disconnected');
    });
});

setInterval(() => {
    ioServer.emit('hello', 'world');
}, 1000);

process.on('SIGTERM', () => {
    logger.info('SIGTERM signal received');

    logger.info('Closing http server');
    server.close(async () => {
        // logger.info('Closing worker');
        // await shutDownWorker();

        logger.info('Exiting...');
        process.exit(0);
    });
});

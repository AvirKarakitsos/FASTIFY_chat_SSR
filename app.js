import Fastify from 'fastify';
import 'dotenv/config';
import fastifyStatic from '@fastify/static';
import fastifyMysql from '@fastify/mysql';
import fastifyView from '@fastify/view';
import fastifyFormbody from '@fastify/formbody';
import ejs from 'ejs';
import fastifySecureSession from '@fastify/secure-session';
import fastifySocketIO from 'fastify-socket.io';
import { loginRoute } from './routes/login.js';
import { userRoute } from './routes/user.js';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { readFileSync } from 'fs';

const fastify = Fastify();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

fastify.register(fastifyMysql, {
    promise: true,
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
});

await fastify.register(fastifySocketIO);

fastify.register(fastifyStatic, {
    root: join(__dirname, 'public'),
});

fastify.register(fastifyView, {
    engine: { ejs },
});

fastify.register(fastifyFormbody);

fastify.register(fastifySecureSession, {
    cookieName: 'session',
    key: readFileSync(join(__dirname, 'secret-key')),
    expiry: 24 * 60 * 60,
    cookie: {
        path: `/`,
    },
});

fastify.register(loginRoute);
fastify.register(userRoute);

fastify.io.on('connection', (socket) => {
    socket.on('user_connected', (userId) => {
        socket.broadcast.emit('isConnected', userId);
    });

    socket.on('join-room', (room) => {
        if (socket.room) {
            socket.leave(socket.room);
        }
        socket.join(room);
        socket.room = room;
        console.info(socket.id + ' joined room: ' + room);
    });

    socket.on('send', (msg) => {
        socket.to(socket.room).emit('receive', msg);
    });

    socket.on('isTyping', (userId) => {
        socket.to(socket.room).emit('userTyping', userId);
    });
});

export { fastify };

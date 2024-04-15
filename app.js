import Fastify from 'fastify';
import 'dotenv/config';
import fastifyStatic from '@fastify/static';
import fastifyMysql from '@fastify/mysql';
import fastifyView from '@fastify/view';
import fastifyFormbody from '@fastify/formbody';
import ejs from 'ejs';
import fastifySecureSession from '@fastify/secure-session';
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

export { fastify };

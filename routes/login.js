import { index, login, logout, redirect } from '../controllers/login.js';

export function loginRoute(fastify, option, done) {
    fastify.get('/', redirect);

    fastify.get('/login', index);

    fastify.post('/login', (request, reply) => login(fastify, request, reply));

    fastify.get('/logout', (request, reply) => logout(fastify, request, reply));

    done();
}

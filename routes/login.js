import { index, login, redirect } from '../controllers/login.js';

export function loginRoute(fastify, option, done) {
    fastify.get('/', redirect);

    fastify.get('/login', index);

    fastify.post(
        '/login',
        async (request, reply) => await login(fastify, request, reply),
    );

    done();
}

import { dashboard } from '../controllers/user.js';

export function userRoute(fastify, option, done) {
    fastify.get(
        '/dashboard',
        async (request, reply) => await dashboard(fastify, request, reply),
    );

    done();
}

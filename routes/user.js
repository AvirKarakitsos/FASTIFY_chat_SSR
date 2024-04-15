import { dashboard } from '../controllers/user.js';

export function userRoute(fastify, option, done) {
    fastify.get('/dashboard', (request, reply) =>
        dashboard(fastify, request, reply),
    );

    done();
}

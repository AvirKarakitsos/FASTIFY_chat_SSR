import { fastify } from './app.js';

const start = async () => {
    try {
        await fastify.listen({ port: 3000 });
        console.log('serveur listening: PORT 3000');
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
};

start();
